'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: fd.get('identifier'), password: fd.get('password') }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al iniciar sesión'); return }
      localStorage.setItem('user', JSON.stringify({ name: data.name, points: data.points }))
      router.push('/beneficios')
    } catch {
      setError('Error de conexión. Intentá más tarde.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setForgotMsg('Enviando…')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      setForgotMsg(data.message || 'Si el correo existe, recibirás instrucciones.')
    } catch {
      setForgotMsg('Error al enviar la solicitud.')
    }
  }

  return (
    <section className={styles.section}>
      {showForgot && (
        <div className={styles.modal} onClick={() => setShowForgot(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setShowForgot(false)}>✕</button>
            <h2>Recuperar contraseña</h2>
            <form onSubmit={handleForgot}>
              <label>Ingresá tu correo:</label>
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="tu@email.com" required />
              <button type="submit">Enviar</button>
            </form>
            {forgotMsg && <p className={styles.msg}>{forgotMsg}</p>}
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h2>Inicio de Sesión</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className="form-group">
            <label>Email o DNI:</label>
            <input name="identifier" type="text" placeholder="Email o DNI" required />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input name="password" type="password" placeholder="Contraseña" required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Iniciando…' : 'Iniciar sesión'}
          </button>
          <p className={styles.links}>
            ¿No tenés cuenta? <Link href="/register">Registrate</Link>
          </p>
          <button type="button" className={styles.forgotBtn} onClick={() => setShowForgot(true)}>
            Olvidé mi contraseña
          </button>
        </form>
      </div>
    </section>
  )
}
