'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './reset.module.css'

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    const confirm = fd.get('confirm') as string
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); setLoading(false); return }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al restablecer'); return }
      setMsg('✅ Contraseña actualizada. Redirigiendo…')
      setTimeout(() => router.push('/login'), 2000)
    } catch { setError('Error de conexión.') }
    finally { setLoading(false) }
  }

  if (!token) return <p className={styles.error}>Token inválido o faltante.</p>

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="form-group">
        <label>Nueva contraseña:</label>
        <input name="password" type="password" placeholder="Mínimo 6 caracteres" minLength={6} required />
      </div>
      <div className="form-group">
        <label>Repetir contraseña:</label>
        <input name="confirm" type="password" placeholder="Repetí tu contraseña" required />
      </div>
      {error && <p className="error-message">{error}</p>}
      {msg && <p className={styles.success}>{msg}</p>}
      <button type="submit" className={styles.btn} disabled={loading}>
        {loading ? 'Guardando…' : 'Guardar contraseña'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2>Restablecer contraseña</h2>
        <Suspense fallback={<p>Cargando…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </section>
  )
}
