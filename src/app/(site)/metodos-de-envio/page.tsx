import type { Metadata } from 'next'
import Image from 'next/image'
import styles from './envio.module.css'

export const metadata: Metadata = {
  title: 'Métodos de Envío',
  description: 'Conocé cómo enviamos tus repuestos y accesorios de motos. Correo Argentino y envíos a todo el país.',
}

export default function MetodosDeEnvioPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1>🚚 Métodos de Envío</h1>
        <p>Enviamos tus repuestos a todo el país</p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📦</div>
            <h2>Correo Argentino</h2>
            <p>Despachamos por Correo Argentino a todo el país. Tiempos estimados según destino.</p>
            <div className={styles.imgWrapper}>
              <Image src="/img/correoArgentino.png" alt="Correo Argentino" width={160} height={80} style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🏪</div>
            <h2>Retiro en local</h2>
            <p>Retirá tu pedido directamente en nuestro local en Colonia Elisa sin costo de envío.</p>
            <p style={{ marginTop: '.5rem', fontWeight: 600, color: '#1a1a1a' }}>📍 Roberto Mora 485, Colonia Elisa</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🤝</div>
            <h2>Envío por encomienda</h2>
            <p>Coordinamos envíos a través de empresas de encomienda de la zona para mayor rapidez.</p>
          </div>

        </div>

        <div className={styles.infoBox}>
          <h3>📋 Información importante sobre los envíos</h3>
          <ul>
            <li>✓ El costo de envío se calcula según el peso y destino del pedido.</li>
            <li>✓ El tiempo de entrega varía entre 3 y 10 días hábiles dependiendo del destino.</li>
            <li>✓ Hacemos seguimiento del envío y te informamos el número de tracking.</li>
            <li>✓ Para pedidos urgentes, consultanos por WhatsApp.</li>
          </ul>
        </div>

        <div className={styles.nota}>
          <p>¿Querés saber el costo de envío a tu localidad?</p>
          <a href="https://wa.me/5403624526860" className={styles.waBtn} target="_blank" rel="noopener">
            Consultar costo de envío
          </a>
        </div>
      </section>
    </>
  )
}
