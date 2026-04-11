import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { createSession, setSessionCookie } from '@/lib/auth'
import { LoginSchema } from '@/lib/validations'
import { checkRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await checkRateLimit(`login:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Demasiados intentos. Intentá en 1 minuto.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { identifier, password } = parsed.data
    const supabase = createServiceClient()

    // Buscar por email O dni, rol user
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},dni.eq.${identifier}`)
      .eq('role', 'user')
      .limit(1)

    const user = users?.[0]
    if (!user) {
      return NextResponse.json({ error: 'Identificador o contraseña incorrectos' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return NextResponse.json({ error: 'Identificador o contraseña incorrectos' }, { status: 401 })
    }

    const token = await createSession({ userId: user.id, role: 'user', name: user.name })

    const res = NextResponse.json({ name: user.name, points: user.points })
    res.cookies.set('motomania-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('login error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
