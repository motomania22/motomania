'use client'
import { useState, useEffect, useRef } from 'react'
import styles from '../home.module.css'

type Item = { name: string }

const ITEMS_PER_PAGE = 100
const WA = '543624526860'

export default function CatalogoPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filtered, setFiltered] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [leadStatus, setLeadStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const productInputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const catalogoRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('itemsData')
    if (stored) {
      const parsed = JSON.parse(stored).items || []
      setItems(parsed); setFiltered(parsed)
    } else {
      fetch('/items.json')
        .then(r => r.json())
        .then(data => {
          const list = data.items || []
          setItems(list); setFiltered(list)
          localStorage.setItem('itemsData', JSON.stringify({ items: list }))
        })
        .catch(console.error)
    }
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(items.filter(i => i.name.toLowerCase().includes(q)))
    setPage(1)
  }, [search, items])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  async function handleLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setLeadStatus('Enviando…')
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: fd.get('name') as string,
      contact: fd.get('contact') as string,
      product: fd.get('product') as string,
      message: fd.get('message') as string,
      page: location.href,
    }
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error')
      setLeadStatus('✅ ¡Listo! Te respondemos en breve.')
      form.reset()
    } catch {
      const text = `Hola! Soy ${payload.name}. Mi contacto: ${payload.contact}. ${payload.product ? `Producto: ${payload.product}.` : ''} ${payload.message}`
      setLeadStatus('⚠️ Hubo un problema. Te abrimos WhatsApp.')
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank')
    } finally {
      setSubmitting(false)
    }
  }

  function consultarProducto(name: string) {
    if (productInputRef.current) productInputRef.current.value = name
    if (messageRef.current && !messageRef.current.value.trim())
      messageRef.current.value = 'Hola, quiero consultar stock y precio.'
    document.getElementById('consulta')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Catálogo */}
      <section className={styles.catalogo} id="catalogo" ref={catalogoRef}>
        <div className={styles.catalogoHeader}>
          <h1>Nuestro catálogo</h1>
          <p>Explorá nuestro catálogo completo de productos disponibles</p>
        </div>
        <div className={styles.buscador}>
          <input
            type="text"
            placeholder="🔎 Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.tablaWrapper}>
          <table>
            <thead>
              <tr>
                <th className={styles.colProducto}>Producto</th>
                <th className={styles.colConsulta}>Consulta</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, i) => (
                <tr key={i}>
                  <td className={styles.colProducto}>{item.name}</td>
                  <td className={styles.colConsulta}>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero consultar sobre: ${item.name}`)}`, '_blank', 'noopener')}
                        className={styles.btnWa}
                      >WhatsApp</button>
                      <button
                        type="button"
                        onClick={() => consultarProducto(item.name)}
                        className={styles.btnForm}
                      >En formulario</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => { setPage(p => p - 1); catalogoRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Anterior</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => { setPage(p => p + 1); catalogoRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Siguiente</button>
        </div>
      </section>

      {/* Consulta / Lead Form */}
      <section className={styles.consultaSection} id="consulta">
        <div className={styles.consultaContainer}>
          <div className={styles.consultaInfo}>
            <h2>¿Necesitás consultar stock o precios?</h2>
            <p>Dejanos tu consulta y te respondemos rápido por WhatsApp o email.</p>
            <ul className={styles.consultaBeneficios}>
              <li>✓ Respuesta inmediata en horario comercial</li>
              <li>✓ Asesoramiento personalizado</li>
              <li>✓ Verificamos stock en tiempo real</li>
              <li>✓ Te cotizamos con envío incluido</li>
            </ul>
          </div>
          <div className={styles.formWrapper}>
            <form onSubmit={handleLead} className={styles.leadForm}>
              <input name="name" type="text" placeholder="Tu nombre" required />
              <input name="contact" type="text" placeholder="WhatsApp o Email" required />
              <input name="product" type="text" placeholder="Producto que buscás (opcional)" ref={productInputRef} />
              <textarea name="message" placeholder="Contanos qué necesitás..." rows={4} required ref={messageRef} />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Enviando…' : 'Enviar consulta'}
              </button>
              {leadStatus && <p className={styles.leadStatus}>{leadStatus}</p>}
              <small>Al enviar aceptás que te contactemos para responder tu consulta.</small>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
