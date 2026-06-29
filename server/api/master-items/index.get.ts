export default defineEventHandler(async () => {
  const sql = useDb()
  return sql`SELECT * FROM master_items ORDER BY name ASC`
})
