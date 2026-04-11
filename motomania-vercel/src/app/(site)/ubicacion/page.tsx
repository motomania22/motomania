import type { Metadata } from 'next'
import styles from './ubicacion.module.css'

export const metadata: Metadata = {
  title: 'Ubicación',
  description: 'Encontranos en Roberto Mora 485, Colonia Elisa, Chaco. Horarios de atención y cómo llegar a Motomania.',
}

export default function UbicacionPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1>📍 Dónde encontrarnos</h1>
        <p>Visitanos en nuestro local en Colonia Elisa, Chaco</p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          {/* Info */}
          <div className={styles.info}>
            <div className={styles.card}>
              <h2>Dirección</h2>
              <p className={styles.address}>Roberto Mora 485<br />Colonia Elisa, Chaco</p>
              <a
                href="https://www.google.com/maps/place/Motomania/@-26.9295223,-59.5182205,15z"
                target="_blank"
                rel="noopener"
                className={styles.mapBtn}
              >
                🗺️ Abrir en Google Maps
              </a>
            </div>

            <div className={styles.card}>
              <h2>Horarios de atención</h2>
              <ul className={styles.horarios}>
                <li><span>Lunes a Viernes</span><span>8:00 – 12:00 / 16:00 – 20:00</span></li>
                <li><span>Sábados</span><span>8:00 – 12:00</span></li>
                <li className={styles.cerrado}><span>Domingos</span><span>Cerrado</span></li>
              </ul>
            </div>

            <div className={styles.card}>
              <h2>Contacto directo</h2>
              <div className={styles.contactLinks}>
                <a href="https://wa.me/5403624526860" target="_blank" rel="noopener" className={styles.wa}>
                  📱 WhatsApp: +54 3624-526860
                </a>
                <a href="https://www.facebook.com/p/Motomania-100054418451961/?locale=es_LA" target="_blank" rel="noopener" className={styles.fb}>
                  📘 Facebook: Motomania
                </a>
              </div>
            </div>
          </div>

          {/* Mapa embed */}
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3538.6!2d-59.5182205!3d-26.9295223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94441582a822d0b7%3A0xd876ab20333bf3e9!2sMotomania!5e0!3m2!1ses!2sar!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Motomania"
            />
          </div>
        </div>
      </section>
    </>
  )
}
