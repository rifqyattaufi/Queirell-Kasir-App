export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')

  const [txn] = await sql`SELECT * FROM transactions WHERE id = ${id!}`
  if (!txn) throw createError({ statusCode: 404, message: 'Transaksi tidak ditemukan' })

  const items = await sql`
    SELECT * FROM transaction_items
    WHERE transaction_id = ${id!}
    ORDER BY sort_order
  `

  return { ...txn, items }
})
