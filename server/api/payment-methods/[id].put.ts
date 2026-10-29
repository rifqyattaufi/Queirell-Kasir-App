export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')
  const { name } = await readBody<{ name: string }>(event)
  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nama wajib diisi' })
  const [row] = await sql`UPDATE payment_methods SET name = ${name.trim()} WHERE id = ${id!} RETURNING *`
  return row
})
