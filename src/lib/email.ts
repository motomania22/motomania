import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || 'Motomania <noreply@motomania.io>'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) throw new Error(`Error enviando email: ${error.message}`)
  return data
}

export async function sendLeadNotification({
  name,
  contact,
  product,
  message,
  page,
  ip,
}: {
  name: string
  contact: string
  product?: string
  message: string
  page?: string
  ip?: string
}) {
  const to = process.env.LEADS_TO || ''
  if (!to) return

  await sendEmail({
    to,
    subject: `Nuevo lead - Motomania (${name})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5; max-width:600px">
        <h2 style="color:#1a1a1a">Nuevo lead desde motomania.io</h2>
        <table style="width:100%; border-collapse:collapse">
          <tr><td style="padding:8px; font-weight:bold">Nombre</td><td>${esc(name)}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px; font-weight:bold">Contacto</td><td>${esc(contact)}</td></tr>
          <tr><td style="padding:8px; font-weight:bold">Producto</td><td>${esc(product || '-')}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px; font-weight:bold">Mensaje</td><td>${esc(message).replace(/\n/g,'<br>')}</td></tr>
        </table>
        <hr style="margin:16px 0">
        <p style="font-size:12px; color:#888">
          Página: ${esc(page || '-')}<br>
          IP: ${esc(ip || '-')}
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetLink = `${appUrl}/reset-password?token=${token}`

  await sendEmail({
    to: email,
    subject: 'Recuperación de contraseña - Motomania',
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto">
        <div style="background:#FFD700; padding:24px; text-align:center">
          <h1 style="margin:0; color:#1a1a1a; font-size:24px">MOTOMANIA</h1>
        </div>
        <div style="padding:32px; background:#fff">
          <h2>Recuperá tu contraseña</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Hacé clic en el botón para crear una nueva contraseña:</p>
          <a href="${resetLink}" style="display:inline-block; background:#FFD700; color:#1a1a1a; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold; margin:16px 0">
            Restablecer contraseña
          </a>
          <p style="color:#888; font-size:14px">Este enlace expira en 1 hora. Si no solicitaste esto, ignorá este email.</p>
        </div>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: '¡Bienvenido a Clientes Gold! - Motomania',
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto">
        <div style="background:#FFD700; padding:24px; text-align:center">
          <h1 style="margin:0; color:#1a1a1a; font-size:24px">MOTOMANIA</h1>
        </div>
        <div style="padding:32px; background:#fff">
          <h2>¡Hola ${esc(name)}!</h2>
          <p>Te damos la bienvenida al programa <strong>Clientes Gold</strong> de Motomania.</p>
          <p>A partir de ahora vas a acumular puntos en cada compra y podrás canjearlos por descuentos exclusivos, productos gratis y mucho más.</p>
          <p>¡Gracias por confiar en nosotros!</p>
          <p style="margin-top:24px">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/beneficios" style="background:#FFD700; color:#1a1a1a; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold">
              Ver mis beneficios
            </a>
          </p>
        </div>
      </div>
    `,
  })
}

function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
