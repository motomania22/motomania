import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { LeadSchema } from '@/lib/validations'
import { sendLeadNotification } from '@/lib/email'
import { checkRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await checkRateLimit(`lead:${ip}`)
    if (!success) {
      return NextResponse.json({ ok: false, error: 'Demasiados envíos. Intentá en 1 minuto.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = LeadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, contact, product, message, page } = parsed.data
    const userAgent = req.headers.get('user-agent') ?? undefined
    const supabase = createServiceClient()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({ name, contact, product: product || null, message, page: page || null, user_agent: userAgent, ip })
      .select('id')
      .single()

    if (error) throw error

    // Email de notificación (no bloquea)
    sendLeadNotification({ name, contact, product, message, page, ip }).catch(console.error)

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 })
  } catch (err) {
    console.error('leads error:', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
