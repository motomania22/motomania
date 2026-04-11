import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { ResetPasswordSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ResetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { token, password } = parsed.data
    const supabase = createServiceClient()

    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('reset_token', token)
      .gt('reset_token_expire', new Date().toISOString())
      .limit(1)

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await supabase
      .from('users')
      .update({ password: hashedPassword, reset_token: null, reset_token_expire: null })
      .eq('id', users[0].id)

    return NextResponse.json({ message: 'Contraseña actualizada con éxito' })
  } catch (err) {
    console.error('reset-password error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
