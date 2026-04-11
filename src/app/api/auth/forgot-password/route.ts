import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createServiceClient } from '@/lib/supabase'
import { ForgotPasswordSchema } from '@/lib/validations'
import { sendPasswordResetEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await checkRateLimit(`forgot:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = ForgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const { email } = parsed.data
    const supabase = createServiceClient()

    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    // Respuesta genérica para no filtrar si el email existe
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'Si el correo existe, recibirás instrucciones.' })
    }

    const token = randomBytes(32).toString('hex')
    const expire = new Date(Date.now() + 3600000).toISOString() // 1 hora

    await supabase
      .from('users')
      .update({ reset_token: token, reset_token_expire: expire })
      .eq('email', email)

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: 'Si el correo existe, recibirás instrucciones.' })
  } catch (err) {
    console.error('forgot-password error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
