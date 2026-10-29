export default defineEventHandler(async (event) => {
  const sql = useDb()
  const { name } = await readBody<{ name: string }>(event)
  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nama wajib diisi' })
  const [row] = await sql`INSERT INTO payment_methods (name) VALUES (${name.trim()}) RETURNING *`
  return row
})
