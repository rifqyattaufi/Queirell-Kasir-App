export default defineEventHandler(async () => {
  const sql = useDb()
  const rows = await sql`SELECT key, value FROM store_config`
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
})
