# Queirell Kasir App

Aplikasi kasir sederhana berbasis **Nuxt 4** + **PostgreSQL**.  
Tidak butuh backend terpisah — server routes Nuxt langsung konek ke Postgres.

## Fitur

- Transaksi kasir dengan pencarian master item
- Cetak struk (preview + print, support thermal printer)
- Upload logo/gambar untuk header struk
- History transaksi dengan filter pencarian
- Laporan bulanan
- Master item CRUD
- Pengaturan toko (nama, alamat, teks struk, dll)
- Tampilan responsif desktop & mobile

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | Nuxt 4 + Tailwind CSS       |
| Backend  | Nuxt Server Routes (Nitro)  |
| Database | PostgreSQL (via `postgres`)  |
| Deploy   | PM2 di VPS                  |

---

## Setup Lokal

### 1. Install dependencies
```bash
npm install
```

### 2. Buat database PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE kasir_db;"
```

### 3. Setup .env
```bash
cp .env.example .env
# Edit DATABASE_URL sesuai credentials kamu
```

### 4. Jalankan migrasi (sekali aja)
```bash
npm run db:migrate
```

### 5. Dev server
```bash
npm run dev
# Buka http://localhost:3000
```

---

## Struktur Project

```
Queirell-Kasir-App/
├── app/
│   ├── pages/
│   │   ├── index.vue          # Kasir / POS
│   │   ├── history.vue        # List transaksi
│   │   ├── history/[id].vue   # Detail transaksi
│   │   ├── report.vue         # Laporan bulanan
│   │   ├── master.vue         # Master item CRUD
│   │   └── config.vue         # Pengaturan toko
│   ├── components/
│   │   └── ReceiptModal.vue   # Preview & print struk
│   ├── composables/
│   │   ├── useConfig.ts       # Store config reaktif
│   │   └── useFormat.ts       # Format Rupiah, tanggal
│   └── layouts/
│       └── default.vue        # Sidebar + mobile nav
├── server/
│   ├── db/
│   │   ├── schema.sql         # DDL schema
│   │   └── migrate.mjs        # Script migrasi
│   └── api/
│       ├── config/            # GET + PUT config toko
│       ├── master-items/      # CRUD master item
│       ├── transactions/      # CRUD transaksi
│       └── report.get.ts      # Laporan bulanan
├── .env.example
├── ecosystem.config.cjs       # PM2 config
└── nuxt.config.ts
```
