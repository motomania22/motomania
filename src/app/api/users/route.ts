import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, lastname, email, dni, points, role, created_at')
      .eq('role', 'user')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(users)
  } catch (err) {
    console.error('get users error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
