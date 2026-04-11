'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './beneficios.module.css'

type BeneficioItem = {
  id: number
  titulo: string
  descripcion: string
  puntos: number
  categoria: string
}

type GalleryImg = { src: string; alt: string }

const GALLERY: GalleryImg[] = Array.from({ length: 11 }, (_, i) => ({
  src: `/img/beneficios/premio-${i + 1}.jpg`,
  alt: `Premio ${i + 1}`,
}))

export default function BeneficiosPage() {
  const [user, setUser] = useState<{ name: string; points: number } | null>(null)
  const [view, setView] = useState<'home' | 'descuentos' | 'promociones' | 'fotos'>('home')
  const [beneficios, setBeneficios] = useState<BeneficioItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))

    fetch('/beneficios.json')
      .then(r => r.json())
      .then(data => setBeneficios(data.beneficios || data || []))
      .catch(console.error)
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('user')
    setUser(null)
  }

  const descuentos = beneficios.filter(b => b.categoria === 'descuento')
  const promociones = beneficios.filter(b => b.categoria === 'promocion')

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Image src="/img/clientes_gold.png" alt="Clientes Gold" width={120} height={120} className={styles.goldLogo} />
          <h1>Programa<br />Clientes Gold</h1>
          <p className={styles.subtitle}>
            Sumá puntos en cada compra y canjeá por descuentos exclusivos, productos gratis y beneficios especiales.
          </p>

          {user ? (
            <div className={styles.userPanel}>
              <div className={styles.userInfo}>
                <div className={styles.welcome}>
                  <span>¡Bienvenido,</span>
                  <strong>{user.name}!</strong>
                </div>
                <div className={styles.points}>
                  <Image src="/img/star.png" alt="★" width={24} height={24} />
                  <span>{user.points}</span>
                  <small>puntos</small>
                </div>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link href="/login" className={styles.btnLogin}>Iniciar sesión</Link>
              <Link href="/register" className={styles.btnRegister}>Registrate</Link>
            </div>
          )}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className={styles.comoFunciona}>
        <h2>¿Cómo funciona?</h2>
        <div className={styles.stepsGrid}>
          {[
            { n: '1️⃣', t: 'Registrate gratis', d: 'Creá tu cuenta en nuestro programa Clientes Gold sin costo.' },
            { n: '2️⃣', t: 'Comprá y sumá puntos', d: 'Por cada $100 que gastes, sumás puntos para tu cuenta.' },
            { n: '3️⃣', t: 'Canjeá tus puntos', d: 'Elegí entre descuentos, productos exclusivos y más beneficios.' },
            { n: '4️⃣', t: 'Disfrutá tu premio', d: 'Usá tus descuentos o retirá tus productos en el local.' },
          ].map(s => (
            <div key={s.n} className={styles.stepCard}>
              <div className={styles.stepIcon}>{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navegación de categorías */}
      {view === 'home' && (
        <section className={styles.categoriasSection}>
          <h2>Explorá nuestros beneficios</h2>
          <div className={styles.categoriasGrid}>
            <div className={styles.catCard} onClick={() => setView('descuentos')}>
              <div className={styles.catOverlay}>
                <span className={styles.catIcon}>💰</span>
                <h3>Descuentos exclusivos</h3>
                <p>Hasta 25% de descuento en tus compras</p>
              </div>
            </div>
            <div className={styles.catCard} onClick={() => setView('promociones')}>
              <div className={styles.catOverlay}>
                <span className={styles.catIcon}>🎁</span>
                <h3>Promociones especiales</h3>
                <p>Productos gratis, vouchers y más</p>
              </div>
            </div>
            <div className={styles.catCard} onClick={() => setView('fotos')}>
              <div className={styles.catOverlay}>
                <span className={styles.catIcon}>📸</span>
                <h3>Galería de premios</h3>
                <p>Mirá los premios que podés ganar</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Detalle descuentos / promociones */}
      {(view === 'descuentos' || view === 'promociones') && (
        <section className={styles.detailSection}>
          <button className={styles.backBtn} onClick={() => setView('home')}>← Volver</button>
          <h2>{view === 'descuentos' ? 'Descuentos exclusivos' : 'Promociones especiales'}</h2>
          <div className={styles.beneficiosGrid}>
            {(view === 'descuentos' ? descuentos : promociones).length > 0
              ? (view === 'descuentos' ? descuentos : promociones).map(b => (
                  <div key={b.id} className={styles.beneficioCard}>
                    <h3>{b.titulo}</h3>
                    <p>{b.descripcion}</p>
                    <span className={styles.puntosTag}>⭐ {b.puntos} puntos</span>
                  </div>
                ))
              : <p className={styles.empty}>Próximamente más beneficios. ¡Consultanos por WhatsApp!</p>
            }
          </div>
        </section>
      )}

      {/* Galería */}
      {view === 'fotos' && (
        <section className={styles.detailSection}>
          <button className={styles.backBtn} onClick={() => setView('home')}>← Volver</button>
          <h2>Galería de premios</h2>
          <div className={styles.galleryGrid}>
            {GALLERY.map((img, i) => (
              <div key={i} className={styles.galleryItem}>
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ventajas */}
      <section className={styles.ventajas}>
        <h2>Ventajas de ser Cliente Gold</h2>
        <div className={styles.ventajasGrid}>
          {[
            { icon: '⭐', t: 'Descuentos permanentes', d: 'Accedé a descuentos exclusivos del 20% y 25% en productos seleccionados.' },
            { icon: '🎫', t: 'Sorteos mensuales', d: 'Participá de sorteos exclusivos por productos y servicios premium.' },
            { icon: '🚨', t: 'Asistencia en ruta', d: 'Canjeá puntos por asistencia mecánica gratuita en un radio de 50km.' },
            { icon: '👕', t: 'Merchandising exclusivo', d: 'Gorras, remeras y accesorios exclusivos de Motomania.' },
            { icon: '🔧', t: 'Sets de herramientas', d: 'Canjeá por kits profesionales de herramientas para motos.' },
            { icon: '💵', t: 'Vouchers de compra', d: 'Obtené vouchers de hasta $15.000 para usar en el local.' },
          ].map(v => (
            <div key={v.t} className={styles.ventajaItem}>
              <div className={styles.ventajaIcon}>{v.icon}</div>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <h2>Preguntas frecuentes</h2>
        <div className={styles.faqGrid}>
          {[
            { q: '¿Cómo me hago Cliente Gold?', a: 'Registrate en nuestra web o consultanos en el local. El registro es gratuito.' },
            { q: '¿Cómo acumulo puntos?', a: 'Por cada compra que realices sumás puntos. Consultanos la equivalencia en el local.' },
            { q: '¿Los puntos vencen?', a: 'Tus puntos tienen validez de 12 meses desde la fecha de acumulación.' },
            { q: '¿Cómo canjeo mis puntos?', a: 'Consultanos en el local o por WhatsApp indicando qué beneficio querés canjear.' },
            { q: '¿Puedo transferir puntos?', a: 'No, los puntos son personales e intransferibles.' },
            { q: '¿Hay un límite de canjes?', a: 'No hay límite. Podés canjear todos los beneficios que quieras.' },
          ].map(f => (
            <div key={f.q} className={styles.faqItem}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className={styles.ctaBeneficios}>
          <h2>¿Todavía no sos Cliente Gold?</h2>
          <p>Registrate ahora y empezá a disfrutar de todos los beneficios</p>
          <div className={styles.ctaBtns}>
            <Link href="/register" className={styles.ctaPrimary}>Registrarme ahora</Link>
            <a href="https://wa.me/5403624526860" className={styles.ctaSecondary} target="_blank" rel="noopener">
              Consultar por WhatsApp
            </a>
          </div>
        </section>
      )}
    </>
  )
}
