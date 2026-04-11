'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './admin.module.css'

type User = {
  id: string
  name: string
  lastname: string
  email: string
  dni: string
  points: number
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filtered, setFiltered] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'users' | 'points'>('users')

  // Points form state
  const [dni, setDni] = useState('')
  const [points, setPoints] = useState('')
  const [action, setAction] = useState<'add' | 'deduct'>('add')
  const [pointsLoading, setPointsLoading] = useState(false)

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.lastname.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.dni.includes(q)
    ))
  }, [search, users])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.status === 401) { router.push('/beneficios/login'); return }
      const data = await res.json()
      setUsers(data); setFiltered(data)
    } catch { setError('Error al cargar usuarios') }
    finally { setLoading(false) }
  }

  async function handlePoints(e: React.FormEvent) {
    e.preventDefault()
    setMsg(''); setError(''); setPointsLoading(true)
    const endpoint = action === 'add' ? '/api/admin/upload-points' : '/api/admin/discount-points'
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, points: parseInt(points) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error'); return }
      setMsg(`✅ ${data.message} — ${data.user.name}: ${data.user.newPoints} puntos`)
      setDni(''); setPoints('')
      fetchUsers()
    } catch { setError('Error de conexión') }
    finally { setPointsLoading(false) }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/beneficios/login')
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>🏍️ MOTOMANIA<span>Admin</span></div>
        <nav className={styles.nav}>
          <button className={tab === 'users' ? styles.active : ''} onClick={() => setTab('users')}>
            👥 Usuarios
          </button>
          <button className={tab === 'points' ? styles.active : ''} onClick={() => setTab('points')}>
            ⭐ Gestión de puntos
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>🚪 Cerrar sesión</button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {tab === 'users' && (
          <>
            <div className={styles.header}>
              <h1>Usuarios registrados</h1>
              <span className={styles.badge}>{users.length} usuarios</span>
            </div>
            <input
              className={styles.search}
              type="text"
              placeholder="🔎 Buscar por nombre, email o DNI..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading ? (
              <div className={styles.loading}>Cargando usuarios…</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>DNI</th>
                      <th>Puntos</th>
                      <th>Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id}>
                        <td><strong>{u.name} {u.lastname}</strong></td>
                        <td>{u.email}</td>
                        <td className={styles.mono}>{u.dni}</td>
                        <td>
                          <span className={styles.points}>⭐ {u.points}</span>
                        </td>
                        <td className={styles.date}>
                          {new Date(u.created_at).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className={styles.empty}>No se encontraron usuarios</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'points' && (
          <>
            <div className={styles.header}>
              <h1>Gestión de puntos</h1>
            </div>
            <div className={styles.pointsContainer}>
              <div className={styles.pointsCard}>
                <h2>Cargar / Descontar puntos</h2>
                <form onSubmit={handlePoints} className={styles.pointsForm}>
                  <div className={styles.actionToggle}>
                    <button
                      type="button"
                      className={action === 'add' ? styles.toggleActive : ''}
                      onClick={() => setAction('add')}
                    >+ Sumar puntos</button>
                    <button
                      type="button"
                      className={action === 'deduct' ? styles.toggleActive : ''}
                      onClick={() => setAction('deduct')}
                    >− Descontar puntos</button>
                  </div>
                  <div className={styles.group}>
                    <label>DNI del usuario:</label>
                    <input
                      type="text"
                      placeholder="Ej: 38123456"
                      value={dni}
                      onChange={e => setDni(e.target.value)}
                      pattern="\d{7,9}"
                      required
                    />
                  </div>
                  <div className={styles.group}>
                    <label>Cantidad de puntos:</label>
                    <input
                      type="number"
                      placeholder="Ej: 500"
                      value={points}
                      onChange={e => setPoints(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                  {msg && <div className={styles.success}>{msg}</div>}
                  {error && <div className={styles.errorBox}>{error}</div>}
                  <button type="submit" className={styles.submitBtn} disabled={pointsLoading}>
                    {pointsLoading ? 'Procesando…' : action === 'add' ? '⭐ Sumar puntos' : '⭐ Descontar puntos'}
                  </button>
                </form>
              </div>

              {/* Búsqueda rápida de usuario */}
              <div className={styles.pointsCard}>
                <h2>Buscar usuario por DNI</h2>
                <input
                  className={styles.search}
                  type="text"
                  placeholder="Buscar DNI..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <div style={{ marginTop: '1rem' }}>
                  {filtered.slice(0, 5).map(u => (
                    <div key={u.id} className={styles.userRow} onClick={() => { setDni(u.dni); setTab('points') }}>
                      <div>
                        <strong>{u.name} {u.lastname}</strong>
                        <span className={styles.mono}> — DNI: {u.dni}</span>
                      </div>
                      <span className={styles.points}>⭐ {u.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
