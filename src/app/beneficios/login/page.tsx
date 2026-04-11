import type { Metadata } from 'next'
import styles from './login.module.css'
import AdminLoginForm from './AdminLoginForm'

export const metadata: Metadata = { title: 'Admin Login | Motomania' }

export default function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🏍️ MOTOMANIA</div>
        <h1>Panel Administrador</h1>
        <AdminLoginForm />
      </div>
    </div>
  )
}
