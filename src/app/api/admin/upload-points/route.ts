import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PointsSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = PointsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { dni, points } = parsed.data
    const supabase = createServiceClient()

    // Verificar que el usuario existe
    const { data: users } = await supabase
      .from('users')
      .select('id, name, points')
      .eq('dni', dni)
      .limit(1)

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const user = users[0]

    // Actualizar puntos
    const { error } = await supabase
      .from('users')
      .update({ points: user.points + points })
      .eq('id', user.id)

    if (error) throw error

    // Registrar historial
    await supabase.from('points_history').insert({
      user_id: user.id,
      delta: points,
      reason: 'Carga manual',
      admin_id: session.userId,
    })

    return NextResponse.json({
      message: 'Puntos cargados correctamente',
      user: { dni, name: user.name, newPoints: user.points + points },
    })
  } catch (err) {
    console.error('upload-points error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
