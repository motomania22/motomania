import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Motomania | Repuestos y Accesorios para Motos',
    template: '%s | Motomania',
  },
  description: 'Motomania: Tu tienda de confianza para repuestos y accesorios de motos. Cubiertas, lubricantes y más. Más de 20 años de experiencia en Colonia Elisa, Chaco.',
  keywords: ['Motomania', 'repuestos para motos', 'cubiertas', 'accesorios motos', 'lubricantes', 'Colonia Elisa'],
  openGraph: {
    siteName: 'Motomania',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
