export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')
  const { name, unit, price } = await readBody<{ name: string; unit: string; price: number }>(event)

  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nama item wajib diisi' })

  const [row] = await sql`
    UPDATE master_items
    SET name = ${name.trim()}, unit = ${unit ?? ''}, price = ${price ?? 0}
    WHERE id = ${id!}
    RETURNING *
  `
  if (!row) throw createError({ statusCode: 404, message: 'Item tidak ditemukan' })
  return row
})
