import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { AdminLoginSchema } from '@/lib/validations'
import { createSession } from '@/lib/auth'
import { checkRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await checkRateLimit(`admin-login:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = AdminLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { identifier, password } = parsed.data
    const supabase = createServiceClient()

    const { data: users } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},dni.eq.${identifier}`)
      .eq('role', 'admin')
      .limit(1)

    const user = users?.[0]
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createSession({ userId: user.id, role: 'admin', name: user.name })

    const res = NextResponse.json({ message: 'Login exitoso', name: user.name, role: 'admin' })
    res.cookies.set('motomania-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('admin login error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
