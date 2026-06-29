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
  customer_name  TEXT        NOT NULL DEFAULT '',
  customer_city  TEXT        NOT NULL DEFAULT '',
  total          INTEGER     NOT NULL DEFAULT 0,
  paid           INTEGER     NOT NULL DEFAULT 0,
  change         INTEGER     NOT NULL DEFAULT 0,
  note           TEXT        NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE INDEX IF NOT EXISTS idx_txn_items_txn_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_txn_created_at   ON transactions(created_at DESC);
