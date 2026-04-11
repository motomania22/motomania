-- ============================================================
-- MOTOMANIA - Supabase Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  lastname VARCHAR(80) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dni VARCHAR(12) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  points INTEGER NOT NULL DEFAULT 0,
  reset_token VARCHAR(255),
  reset_token_expire TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de leads (consultas)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  contact VARCHAR(180) NOT NULL,
  product VARCHAR(220),
  message TEXT NOT NULL,
  page VARCHAR(255),
  user_agent VARCHAR(255),
  ip VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de canjes de puntos (historial)
CREATE TABLE IF NOT EXISTS points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,  -- positivo=suma, negativo=descuento
  reason VARCHAR(255),
  admin_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_dni ON users(dni);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_user ON points_history(user_id);

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- Políticas: solo service_role puede leer/escribir (la app usa service_role en API routes)
CREATE POLICY "service_role_all_users" ON users FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all_leads" ON leads FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all_points" ON points_history FOR ALL TO service_role USING (true);

-- Función para actualizar updated_at automáticamente
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

-- Usuario admin inicial (cambiar la contraseña después)
-- Contraseña: Admin1234! (bcrypt hash)
INSERT INTO users (name, lastname, email, dni, password, role)
VALUES (
  'Admin',
  'Motomania',
  'admin@motomania.io',
  '00000000',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Admin1234!
  'admin'
) ON CONFLICT DO NOTHING;
