import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { Product } from '@/types/product'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Catálogo de Repuestos para Motos | Motomania',
  description:
    'Repuestos y accesorios para Honda, Yamaha, Zanella, Gilera, Guerrero, Motomel y más. Encontrá lo que buscás y comprá en Mercado Libre o EnvioCompras.',
  keywords: 'repuestos motos, accesorios motos, Honda, Yamaha, Zanella, Gilera, Guerrero, Motomel',
}

export default async function ProductosPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: products, error } = await supabase
    .from('ml_products')
    .select('*')
    .gt('available_quantity', 0)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[ProductosPage]', error)
  }

  return <CatalogClient products={(products as Product[]) ?? []} />
}