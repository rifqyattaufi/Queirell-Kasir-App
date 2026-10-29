export default defineEventHandler(async (event) => {
  const sql = useDb()
  const id = getRouterParam(event, 'id')

  const [txn] = await sql`
    SELECT t.*, COALESCE(pa.name, t.payment_account) AS payment_account_name, COALESCE(pa.image, '') AS payment_account_image
    FROM transactions t LEFT JOIN payment_accounts pa ON pa.id = t.payment_account_id
    WHERE t.id = ${id!}
  `
  if (!txn) throw createError({ statusCode: 404, message: 'Transaksi tidak ditemukan' })

  const items = await sql`
    SELECT * FROM transaction_items
    WHERE transaction_id = ${id!}
    ORDER BY sort_order
  `

  return { ...txn, items }
})
