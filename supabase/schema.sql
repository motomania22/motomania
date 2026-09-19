-- ============================================================
-- MOTOMANIA - Supabase Schema Completo
-- Versión: 2.0
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- TABLA: users
-- Registro y autenticación de usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                 UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name               VARCHAR(80)  NOT NULL,
  lastname           VARCHAR(80)  NOT NULL,
  email              VARCHAR(255) UNIQUE NOT NULL,
  dni                VARCHAR(12)  UNIQUE NOT NULL,
  password           VARCHAR(255) NOT NULL,
  role               VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  points             INTEGER      NOT NULL DEFAULT 0,
  reset_token        VARCHAR(255),
  reset_token_expire TIMESTAMPTZ,
  created_at         TIMESTAMPTZ  DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: leads
-- Consultas de visitantes sobre productos
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id         UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  contact    VARCHAR(180) NOT NULL,
  product    VARCHAR(220),
  message    TEXT         NOT NULL,
  page       VARCHAR(255),
  user_agent VARCHAR(255),
  ip         VARCHAR(64),
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: points_history
-- Historial de movimientos de puntos por usuario
-- ============================================================
CREATE TABLE IF NOT EXISTS points_history (
  id         UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID         REFERENCES users(id) ON DELETE CASCADE,
  delta      INTEGER      NOT NULL,  -- positivo = suma, negativo = descuento
  reason     VARCHAR(255),
  admin_id   UUID         REFERENCES users(id),
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: ml_products
-- Productos sincronizados desde Mercado Libre y EnvioCompras
-- Se actualiza automáticamente cada 6 horas via cron en Vercel
-- ============================================================
CREATE TABLE IF NOT EXISTS ml_products (
  id                 TEXT        PRIMARY KEY,           -- MLA123456 o ec-001
  title              TEXT        NOT NULL,
  price              NUMERIC     DEFAULT 0,
  currency           TEXT        DEFAULT 'ARS',
  thumbnail          TEXT        DEFAULT '',            -- URL imagen del producto
  permalink          TEXT        DEFAULT '',            -- URL publicación original
  category_id        TEXT        DEFAULT '',            -- ID categoría ML
  category_name      TEXT        DEFAULT 'General',     -- Nombre legible de categoría
  condition          TEXT        DEFAULT 'new'
                                 CHECK (condition IN ('new', 'used', 'not_specified')),
  available_quantity INTEGER     DEFAULT 0,
  source             TEXT        DEFAULT 'mercadolibre'
                                 CHECK (source IN ('mercadolibre', 'enviocompras')),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- users
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_dni      ON users(dni);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role);

-- leads
CREATE INDEX IF NOT EXISTS idx_leads_created  ON leads(created_at DESC);

-- points_history
CREATE INDEX IF NOT EXISTS idx_points_user    ON points_history(user_id);

-- ml_products
CREATE INDEX IF NOT EXISTS idx_ml_products_source
  ON ml_products(source);

CREATE INDEX IF NOT EXISTS idx_ml_products_available
  ON ml_products(available_quantity)
  WHERE available_quantity > 0;

CREATE INDEX IF NOT EXISTS idx_ml_products_title
  ON ml_products(title);

CREATE INDEX IF NOT EXISTS idx_ml_products_category
  ON ml_products(category_name);

CREATE INDEX IF NOT EXISTS idx_ml_products_updated
  ON ml_products(updated_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_products  ENABLE ROW LEVEL SECURITY;

-- users, leads, points_history: solo service_role (API routes privadas)
CREATE POLICY "service_role_all_users"
  ON users FOR ALL TO service_role USING (true);

CREATE POLICY "service_role_all_leads"
  ON leads FOR ALL TO service_role USING (true);

CREATE POLICY "service_role_all_points"
  ON points_history FOR ALL TO service_role USING (true);

-- ml_products: lectura pública (anon puede leer el catálogo),
--              escritura solo service_role (cron de sincronización)
CREATE POLICY "public_read_ml_products"
  ON ml_products FOR SELECT TO anon USING (true);

CREATE POLICY "service_role_write_ml_products"
  ON ml_products FOR ALL TO service_role USING (true);

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Actualiza updated_at automáticamente en users
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Usuario admin inicial
-- Contraseña: Admin1234! (bcrypt hash)
INSERT INTO users (name, lastname, email, dni, password, role)
VALUES (
  'Admin',
  'Motomania',
  'admin@motomania.io',
  '00000000',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
) ON CONFLICT DO NOTHING;

-- Producto inicial de EnvioCompras
INSERT INTO ml_products (id, title, price, currency, thumbnail, permalink, category_id, category_name, condition, available_quantity, source)
VALUES (
  'ec-001',
  'Tapa distribución con soporte arranque Mondial Dax 70cc',
  8500,
  'ARS',
  '',
  'https://enviocompras.com.ar/producto/tapa-distribucion-con-soporte-arranque-mondial-dax-70cc',
  'motor',
  'Motor',
  'new',
  10,
  'enviocompras'
) ON CONFLICT (id) DO NOTHING;