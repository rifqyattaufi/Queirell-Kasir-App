export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')
  // transaction_items otomatis terhapus karena ON DELETE CASCADE
  await sql`DELETE FROM transactions WHERE id = ${id!}`
  return { ok: true }
})
