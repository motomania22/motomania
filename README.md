# Motomania — Next.js + Supabase + Vercel

Sitio web completo de Motomania: catálogo de repuestos, programa Clientes Gold, panel admin, formulario de leads y más.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend + API | Next.js 14 (App Router) |
| Hosting | Vercel |
| Base de datos + Auth | Supabase (Postgres) |
| Emails | Resend |
| Rate limiting | Upstash Redis (opcional) |
| Validación | Zod |
| Autenticación | JWT con `jose` |

---

## 1. Requisitos previos

- Node.js 18+
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Resend](https://resend.com) (gratis, 3000 emails/mes)
- (Opcional) Cuenta en [Upstash](https://upstash.com) para rate limiting

---

## 2. Configurar Supabase

1. Crear un proyecto nuevo en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/schema.sql`
3. Ir a **Project Settings → API** y copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ El `service_role` key nunca debe estar en el cliente. Solo se usa en API routes del servidor.

---

## 3. Configurar Resend

1. Crear cuenta en [resend.com](https://resend.com)
2. Crear una API key en **API Keys**
3. Verificar tu dominio (o usar el dominio de prueba para desarrollo)
4. Copiar la API key → `RESEND_API_KEY`

---

## 4. Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT (mínimo 32 caracteres, generá uno aleatorio)
JWT_SECRET=un-secreto-muy-largo-y-aleatorio-de-al-menos-32-chars

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=Motomania <noreply@motomania.io>
LEADS_TO=tu-email@gmail.com

# Upstash (opcional - si no se configura, rate limiting desactivado)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# App
NEXT_PUBLIC_APP_URL=https://motomania.io
NEXT_PUBLIC_WHATSAPP=5403624526860
```

---

## 5. Instalación local

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 6. Deploy en Vercel

### Opción A — CLI (recomendado)

```bash
npm install -g vercel
vercel login
vercel
```

### Opción B — GitHub

1. Subir el proyecto a un repositorio de GitHub
2. En Vercel: **New Project → Import Git Repository**
3. Seleccionar el repo y hacer deploy

### Variables de entorno en Vercel

En el dashboard de Vercel, ir a:
**Project → Settings → Environment Variables**

Agregar todas las variables del `.env.local` (sin el `NEXT_PUBLIC_APP_URL` si el dominio cambia).

---

## 7. Crear admin inicial

El schema SQL ya crea un usuario admin por defecto:

```
Email: admin@motomania.io
Contraseña: Admin1234!
```

> ⚠️ **Cambiar la contraseña** inmediatamente después del primer login en `/beneficios/login`

Para crear un admin adicional, ejecutar en Supabase SQL Editor:

```sql
-- Generar hash con bcrypt (rounds=10) de tu contraseña
-- Podés usar: https://bcrypt-generator.com/
INSERT INTO users (name, lastname, email, dni, password, role)
VALUES ('Tu Nombre', 'Apellido', 'tu@email.com', '12345678', '$2b$10$...hash...', 'admin');
```

---

## 8. Rutas del proyecto

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Home: catálogo, buscador, formulario lead |
| `/beneficios` | Programa Clientes Gold |
| `/login` | Login de usuarios |
| `/register` | Registro de usuarios |
| `/reset-password` | Restablecer contraseña |
| `/nosotros` | Página de empresa |
| `/ubicacion` | Mapa y horarios |
| `/medios-de-pago` | Formas de pago |
| `/metodos-de-envio` | Opciones de envío |

### Admin (requiere login admin)
| Ruta | Descripción |
|------|-------------|
| `/beneficios/login` | Login del administrador |
| `/beneficios/admin` | Panel: usuarios + gestión de puntos |

### API
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login usuario |
| `/api/auth/register` | POST | Registro usuario |
| `/api/auth/logout` | POST | Cerrar sesión |
| `/api/auth/forgot-password` | POST | Solicitar reset |
| `/api/auth/reset-password` | POST | Confirmar reset |
| `/api/admin/login` | POST | Login admin |
| `/api/admin/upload-points` | POST | Sumar puntos |
| `/api/admin/discount-points` | POST | Descontar puntos |
| `/api/users` | GET | Listar usuarios (admin) |
| `/api/leads` | POST | Guardar consulta |

---

## 9. Estructura de archivos

```
motomania/
├── src/
│   ├── app/
│   │   ├── (site)/              # Layout con header/footer
│   │   │   ├── page.tsx         # Home + catálogo
│   │   │   ├── beneficios/      # Clientes Gold
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   ├── nosotros/
│   │   │   ├── ubicacion/
│   │   │   ├── medios-de-pago/
│   │   │   └── metodos-de-envio/
│   │   ├── beneficios/
│   │   │   ├── admin/           # Panel admin
│   │   │   └── login/           # Login admin
│   │   └── api/                 # Serverless functions
│   ├── components/layout/       # Header, Footer
│   ├── lib/                     # supabase, auth, email, ratelimit, validations
│   └── middleware.ts             # Protección rutas admin
├── public/
│   ├── items.json               # Catálogo de productos
│   ├── beneficios.json          # Beneficios Clientes Gold
│   └── img/                     # Imágenes
├── supabase/
│   └── schema.sql               # Schema de base de datos
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

---

## 10. Catálogo de productos

El catálogo se carga desde `/public/items.json`. Formato:

```json
{
  "items": [
    { "name": "Cubierta Pirelli MT 60 110/80-18" },
    { "name": "Aceite Motul 5100 10W-40 4L" }
  ]
}
```

Para actualizar el catálogo, reemplazar `public/items.json` y hacer redeploy.

---

## 11. Beneficios (Clientes Gold)

Los beneficios se cargan desde `/public/beneficios.json`. Formato:

```json
{
  "beneficios": [
    {
      "id": 1,
      "titulo": "20% de descuento",
      "descripcion": "En lubricantes seleccionados",
      "puntos": 500,
      "categoria": "descuento"
    },
    {
      "id": 2,
      "titulo": "Kit de herramientas",
      "descripcion": "Set profesional para motos",
      "puntos": 2000,
      "categoria": "promocion"
    }
  ]
}
```

---

## Soporte

Desarrollado por **Fabricio Barreto Desarrollos Web**
fabriciobarreto2610@gmail.com
# motomania
