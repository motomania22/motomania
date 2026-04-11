'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function AdminLoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: fd.get('identifier'), password: fd.get('password') }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Credenciales inválidas'); return }
      router.push('/beneficios/admin')
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.group}>
        <label>Email o DNI:</label>
        <input name="identifier" type="text" placeholder="admin@motomania.io" required />
      </div>
      <div className={styles.group}>
        <label>Contraseña:</label>
        <input name="password" type="password" placeholder="••••••••" required />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.btn} disabled={loading}>
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
