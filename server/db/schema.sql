-- Jalankan sekali: psql -d kasir_db -f server/db/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Konfigurasi toko (key-value) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS store_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

INSERT INTO store_config (key, value) VALUES
  ('store_name',    'Nama Toko Anda'),
  ('store_tagline', ''),
  ('address',       'Alamat toko'),
  ('phone',         ''),
  ('footer_note',   '[ Printed by e-Nota ]'),
  ('closing_text',  '*** Thank You ***'),
  ('greeting_text', 'Barakallah 😊'),
  ('show_recipient','true')
ON CONFLICT (key) DO NOTHING;

-- ─── Master item ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS master_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  unit       TEXT        NOT NULL DEFAULT '',
  price      INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Transaksi ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT        NOT NULL DEFAULT '',
  customer_name  TEXT        NOT NULL DEFAULT '',
  customer_city  TEXT        NOT NULL DEFAULT '',
  total          INTEGER     NOT NULL DEFAULT 0,
  paid           INTEGER     NOT NULL DEFAULT 0,
  change         INTEGER     NOT NULL DEFAULT 0,
  note           TEXT        NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS invoice_number TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS transaction_items (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID    NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  name           TEXT    NOT NULL,
  unit           TEXT    NOT NULL DEFAULT '',
  qty            NUMERIC NOT NULL,
  price          INTEGER NOT NULL,
  subtotal       INTEGER NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_accounts (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_method_id UUID        NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  name              TEXT        NOT NULL DEFAULT '',
  image             TEXT        NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_method  TEXT NOT NULL DEFAULT '';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_account TEXT NOT NULL DEFAULT '';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_account_id UUID REFERENCES payment_accounts(id) ON DELETE SET NULL;
-- backfill invoice lama (tanggal WIB, urut per hari)
UPDATE transactions t SET invoice_number = s.inv FROM (
  SELECT id, 'INV-' || to_char(created_at AT TIME ZONE 'Asia/Jakarta', 'YYYYMMDD') || '-' ||
    lpad((row_number() OVER (PARTITION BY (created_at AT TIME ZONE 'Asia/Jakarta')::date ORDER BY created_at))::text, 3, '0') AS inv
  FROM transactions
) s WHERE t.id = s.id AND t.invoice_number = '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_txn_invoice_unique ON transactions(invoice_number) WHERE invoice_number <> '';

CREATE INDEX IF NOT EXISTS idx_txn_items_txn_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_txn_created_at   ON transactions(created_at DESC);
