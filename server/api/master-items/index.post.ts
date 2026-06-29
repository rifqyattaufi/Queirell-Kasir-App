export default defineEventHandler(async (event) => {
  const sql = useDb()
  const { name, unit, price } = await readBody<{ name: string; unit: string; price: number }>(event)

  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nama item wajib diisi' })

  const [row] = await sql`
    INSERT INTO master_items (name, unit, price)
    VALUES (${name.trim()}, ${unit ?? ''}, ${price ?? 0})
    RETURNING *
  `
  return row
})
