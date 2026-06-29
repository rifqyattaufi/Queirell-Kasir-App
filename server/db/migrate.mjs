// npm run db:migrate
// Jalankan sekali sebelum start app pertama kali

import postgres from 'postgres'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'

const __dir = dirname(fileURLToPath(import.meta.url))
const schema = readFileSync(join(__dir, 'schema.sql'), 'utf8')

const sql = postgres(process.env.DATABASE_URL, { max: 1 })

try {
  await sql.unsafe(schema)
  console.log('✅ Migration berhasil')
} catch (e) {
  console.error('❌ Migration gagal:', e.message)
  process.exit(1)
} finally {
  await sql.end()
}
