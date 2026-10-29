export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')
  const { name, image } = await readBody<{ name: string; image: string }>(event)
  if (!name?.trim() && !image?.trim()) throw createError({ statusCode: 400, message: 'Nama atau gambar wajib diisi' })
  const [row] = await sql`
    UPDATE payment_accounts SET name = ${name?.trim() ?? ''}, image = ${image?.trim() ?? ''}
    WHERE id = ${id!} RETURNING *
  `
  return row
})
