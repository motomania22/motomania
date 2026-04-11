/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/beneficios.html', destination: '/beneficios', permanent: true },
      { source: '/login.html', destination: '/login', permanent: true },
      { source: '/register.html', destination: '/register', permanent: true },
      { source: '/reset-password.html', destination: '/reset-password', permanent: true },
      { source: '/nosotros.html', destination: '/nosotros', permanent: true },
      { source: '/ubicacion.html', destination: '/ubicacion', permanent: true },
      { source: '/mediosDePago.html', destination: '/medios-de-pago', permanent: true },
      { source: '/metodosDeEnvio.html', destination: '/metodos-de-envio', permanent: true },
    ]
  },
}

module.exports = nextConfig
