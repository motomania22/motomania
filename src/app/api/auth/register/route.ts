import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { RegisterSchema } from '@/lib/validations'
import { checkRateLimit } from '@/lib/ratelimit'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await checkRateLimit(`register:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Demasiados intentos. Esperá un momento.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, lastname, email, dni, password } = parsed.data
    const supabase = createServiceClient()

    // Verificar duplicados
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},dni.eq.${dni}`)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'El correo electrónico o el DNI ya están registrados' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ name, lastname, email, dni, password: hashedPassword, role: 'user', points: 0 })
      .select('id, name, email')
      .single()

    if (error) throw error

    // Enviar email de bienvenida (no bloquea si falla)
    sendWelcomeEmail(email, name).catch(console.error)

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', user: newUser },
      { status: 201 }
    )
  } catch (err) {
    console.error('register error:', err)
    return NextResponse.json({ error: 'Error al registrar el usuario' }, { status: 500 })
  }
}
