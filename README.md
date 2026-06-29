# Kasir App

Aplikasi kasir sederhana berbasis **Nuxt 4** + **PostgreSQL**.  
Tidak butuh backend terpisah — server routes Nuxt langsung konek ke Postgres.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | Nuxt 4 + Tailwind CSS v4    |
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

## Deploy ke VPS (PM2)

```bash
# 1. Clone / upload project ke VPS
# 2. Install deps
npm install

# 3. Setup .env di VPS
echo "DATABASE_URL=postgres://user:pass@localhost:5432/kasir_db" > .env

# 4. Migrate DB (kalau belum)
npm run db:migrate

# 5. Build
npm run build

# 6. Start PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Nginx reverse proxy (opsional)
```nginx
server {
    listen 80;
    server_name kasir.domainmu.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Struktur Project

```
kasir-app/
├── app/
│   ├── pages/
│   │   ├── index.vue          # Kasir / POS
│   │   ├── history.vue        # List transaksi
│   │   ├── history/[id].vue   # Detail + print
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
│   │   ├── index.ts           # Koneksi singleton Postgres
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
