'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './register.module.css'

export default function RegisterPage() {
  const router = useRouter()
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          lastname: fd.get('lastname'),
          email: fd.get('email'),
          dni: fd.get('dni'),
          password,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al registrar'); return }
      alert('¡Registro exitoso! Ahora podés iniciar sesión.')
      router.push('/login')
    } catch {
      setError('Error de conexión. Intentá más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2>Registro de usuario</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label>Nombre:</label>
            <input name="name" type="text" placeholder="Nombre" required />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input name="lastname" type="text" placeholder="Apellido" required />
          </div>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input name="email" type="email" placeholder="tu@email.com" required />
          </div>
          <div className="form-group">
            <label>DNI:</label>
            <input name="dni" type="text" placeholder="Sin puntos" pattern="\d{7,9}" title="Solo números, 7 a 9 dígitos" required />
            <small style={{ color: 'red' }}>DNI solo números, sin puntos.</small>
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input name="password" type="password" placeholder="Mínimo 6 caracteres" minLength={6} required />
          </div>
          <div className="form-group">
            <label>Repetir contraseña:</label>
            <input name="confirm" type="password" placeholder="Repetí tu contraseña" required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Registrando…' : 'Registrarse'}
          </button>
          <p className={styles.links}>¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link></p>
        </form>
      </div>
    </section>
  )
}
