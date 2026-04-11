import type { Metadata } from 'next'
import Image from 'next/image'
import styles from './medios.module.css'

export const metadata: Metadata = {
  title: 'Medios de Pago',
  description: 'Conocé todos los medios de pago aceptados en Motomania: efectivo, tarjetas, billeteras virtuales y más.',
}

export default function MediosDePagoPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1>💳 Medios de Pago</h1>
        <p>Aceptamos múltiples formas de pago para tu comodidad</p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>

          <div className={styles.card}>
            <div className={styles.cardIcon}>💵</div>
            <h2>Efectivo</h2>
            <p>Pagá directamente en el local con dinero en efectivo. Sin recargos ni comisiones.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🏦</div>
            <h2>Tarjetas bancarias</h2>
            <p>Aceptamos tarjetas de débito y crédito de los principales bancos. Consultanos sobre cuotas disponibles.</p>
            <div className={styles.imgWrapper}>
              <Image src="/img/bancos.png" alt="Bancos" width={280} height={80} style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📱</div>
            <h2>Billeteras virtuales</h2>
            <p>Pagá con tu billetera digital favorita de forma rápida y segura.</p>
            <div className={styles.imgWrapper}>
              <Image src="/img/billeteras.png" alt="Billeteras virtuales" width={280} height={80} style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>💳</div>
            <h2>Pietcard</h2>
            <p>Aceptamos la tarjeta Pietcard con todos sus beneficios y cuotas especiales.</p>
            <div className={styles.imgWrapper}>
              <Image src="/img/pietcard.png" alt="Pietcard" width={160} height={80} style={{ objectFit: 'contain' }} />
            </div>
          </div>

        </div>

        <div className={styles.nota}>
          <p>💡 <strong>¿Tenés dudas sobre los medios de pago?</strong> Consultanos por WhatsApp antes de venir.</p>
          <a href="https://wa.me/5403624526860" className={styles.waBtn} target="_blank" rel="noopener">
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
