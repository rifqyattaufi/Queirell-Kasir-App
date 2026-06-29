export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')
  await sql`DELETE FROM master_items WHERE id = ${id!}`
  return { ok: true }
})
