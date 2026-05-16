'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/productos', label: 'Catálogo' },
  { href: '/beneficios', label: 'Beneficios' },
  { href: '/medios-de-pago', label: 'Medios de Pago' },
  { href: '/metodos-de-envio', label: 'Envíos' },
  { href: '/ubicacion', label: 'Ubicación' },
  { href: '/nosotros', label: 'Nosotros' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} style={{ position: 'relative' }}>
      <div className="header-container">
        <Link href="/">
          <Image className="logo" src="/img/Logo.png" alt="Motomania Logo" width={150} height={60} priority />
        </Link>

        <button
          className="toggle-btn"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? '✕' : '☰'}
        </button>

        <nav className={open ? 'open' : ''}>
          <ul>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
