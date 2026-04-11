import type { Metadata } from 'next'
import Image from 'next/image'
import styles from './nosotros.module.css'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé Motomania: más de 20 años en Colonia Elisa. Repuestos, cubiertas, lubricantes y accesorios para motos.',
}

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Desde 2004</span>
          <h1>Más de 20 años<br />impulsando tu pasión</h1>
          <p>En Motomania comenzamos este viaje hace más de dos décadas con una misión clara: ser el aliado de confianza para todos los que aman las motos.</p>
        </div>
      </section>

      {/* Galería */}
      <section className={styles.gallery}>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem}>
            <Image src="/img/nosotros2.jpg" alt="Variedad de repuestos" fill style={{ objectFit: 'cover' }} />
            <div className={styles.overlay}><span>Amplio stock</span></div>
          </div>
          <div className={styles.galleryItem}>
            <Image src="/img/nosotros3.jpg" alt="Nuestro local" fill style={{ objectFit: 'cover' }} />
            <div className={styles.overlay}><span>Local en Colonia Elisa</span></div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className={styles.story}>
        <div className={styles.storyContainer}>
          <div className={styles.storyText}>
            <h2>Nuestra historia</h2>
            <p>Lo que empezó como un pequeño emprendimiento familiar se transformó en un punto de referencia para motociclistas de toda la zona. A lo largo de estos años, mantuvimos siempre el mismo compromiso: ofrecer productos de calidad, precios justos y una atención que realmente escucha lo que necesitás.</p>
            <p>Hoy seguimos evolucionando, incorporando nuevas marcas, ampliando nuestro catálogo y mejorando nuestros canales de atención. Pero la esencia sigue siendo la misma: pasión por las motos y compromiso con nuestros clientes.</p>
          </div>
          <div className={styles.stats}>
            {[
              { n: '20+', l: 'Años de experiencia' },
              { n: '1000+', l: 'Productos disponibles' },
              { n: '100%', l: 'Compromiso' },
            ].map(s => (
              <div key={s.l} className={styles.statCard}>
                <div className={styles.statNum}>{s.n}</div>
                <div className={styles.statLabel}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className={styles.valores}>
        <h2>Nuestros valores</h2>
        <div className={styles.valoresGrid}>
          {[
            { icon: '🏆', t: 'Calidad', d: 'Trabajamos solo con marcas reconocidas y productos que cumplen los más altos estándares.' },
            { icon: '🤝', t: 'Confianza', d: 'Más de 20 años avalan nuestra trayectoria y el compromiso con nuestros clientes.' },
            { icon: '⚡', t: 'Agilidad', d: 'Respuesta rápida, stock permanente y envíos a todo el país.' },
            { icon: '💡', t: 'Asesoramiento', d: 'Te ayudamos a encontrar exactamente lo que tu moto necesita.' },
          ].map(v => (
            <div key={v.t} className={styles.valorCard}>
              <span>{v.icon}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>¿Querés conocernos?</h2>
        <p>Visitanos en el local o escribinos por WhatsApp.</p>
        <a href="https://wa.me/5403624526860" className={styles.ctaBtn} target="_blank" rel="noopener">
          Contactar por WhatsApp
        </a>
      </section>
    </>
  )
}
