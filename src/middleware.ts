import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret-change-me')

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rutas que requieren autenticación admin
  const isAdminPage = pathname.startsWith('/beneficios/admin')
  const isAdminApi = pathname.startsWith('/api/admin/upload-points') ||
    pathname.startsWith('/api/admin/discount-points') ||
    pathname.startsWith('/api/users')

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('motomania-session')?.value

    if (!token) {
      if (isAdminApi) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      return NextResponse.redirect(new URL('/beneficios/login', req.url))
    }

    try {
      const { payload } = await jwtVerify(token, secret)
      if (payload.role !== 'admin') {
        if (isAdminApi) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        return NextResponse.redirect(new URL('/beneficios/login', req.url))
      }
    } catch {
      if (isAdminApi) return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
      return NextResponse.redirect(new URL('/beneficios/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/beneficios/admin/:path*', '/api/admin/:path*', '/api/users/:path*'],
}
