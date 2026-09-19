CREATE TABLE IF NOT EXISTS ml_products (
  id                 TEXT        PRIMARY KEY,
  title              TEXT        NOT NULL,
  price              NUMERIC     DEFAULT 0,
  currency           TEXT        DEFAULT 'ARS',
  thumbnail          TEXT        DEFAULT '',
  permalink          TEXT        DEFAULT '',
  category_id        TEXT        DEFAULT '',
  category_name      TEXT        DEFAULT 'General',
  condition          TEXT        DEFAULT 'new',
  available_quantity INTEGER     DEFAULT 0,
  source             TEXT        DEFAULT 'mercadolibre',
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ml_products_source
  ON ml_products(source);

CREATE INDEX IF NOT EXISTS idx_ml_products_available
  ON ml_products(available_quantity)
  WHERE available_quantity > 0;

CREATE INDEX IF NOT EXISTS idx_ml_products_title
  ON ml_products(title);