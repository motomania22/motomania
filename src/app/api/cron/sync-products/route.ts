import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ecProducts = require('@/data/enviocompras-products.json')

const SELLER_ID = '67056821'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let offset = 0
    const limit = 50
    let allItems: any[] = []

    while (true) {
      const res = await fetch(
        `https://api.mercadolibre.com/sites/MLA/search?seller_id=${SELLER_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ML_ACCESS_TOKEN}`,
          },
          cache: 'no-store',
        }
      )

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`ML API ${res.status}: ${errText}`)
      }

      const data = await res.json()
      const results: any[] = data.results ?? []
      allItems = allItems.concat(results)

      if (results.length < limit) break
      offset += limit
    }

    const mlProducts = allItems.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price ?? 0,
      currency: item.currency_id ?? 'ARS',
      thumbnail: (item.thumbnail ?? '').replace('-I.jpg', '-O.jpg'),
      permalink: item.permalink ?? '',
      category_id: item.category_id ?? '',
      category_name: item.category_id ?? 'General',
      condition: item.condition ?? 'not_specified',
      available_quantity: item.available_quantity ?? 0,
      source: 'mercadolibre',
      updated_at: new Date().toISOString(),
    }))

    if (mlProducts.length > 0) {
      const { error: mlError } = await supabaseAdmin
        .from('ml_products')
        .upsert(mlProducts, { onConflict: 'id' })
      if (mlError) throw mlError
    }

    const ecFormatted = (ecProducts as any[]).map((p: any) => ({
      ...p,
      updated_at: new Date().toISOString(),
    }))

    if (ecFormatted.length > 0) {
      const { error: ecError } = await supabaseAdmin
        .from('ml_products')
        .upsert(ecFormatted, { onConflict: 'id' })
      if (ecError) throw ecError
    }

    return NextResponse.json({
      ok: true,
      ml_synced: mlProducts.length,
      ec_synced: ecFormatted.length,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[sync-products]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}