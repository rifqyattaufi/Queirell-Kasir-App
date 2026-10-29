export default defineEventHandler(async (event) => {
  const sql = useDb()
  const { month } = getQuery(event) // "2026-05" format

  const txns = month
    ? await sql`
        SELECT t.*, COALESCE(pa.name, t.payment_account) AS payment_account_name, COALESCE(pa.image, '') AS payment_account_image
        FROM transactions t LEFT JOIN payment_accounts pa ON pa.id = t.payment_account_id
        WHERE to_char(t.created_at, 'YYYY-MM') = ${month as string}
        ORDER BY t.created_at DESC
      `
    : await sql`
        SELECT t.*, COALESCE(pa.name, t.payment_account) AS payment_account_name, COALESCE(pa.image, '') AS payment_account_image
        FROM transactions t LEFT JOIN payment_accounts pa ON pa.id = t.payment_account_id
        ORDER BY t.created_at DESC LIMIT 200
      `

  if (!txns.length) return []

  const ids = txns.map(t => t.id)
  const items = await sql`
    SELECT * FROM transaction_items
    WHERE transaction_id = ANY(${ids}::uuid[])
    ORDER BY transaction_id, sort_order
  `

  return txns.map(tx => ({
    ...tx,
    items: items.filter(i => i.transaction_id === tx.id),
  }))
})
