export default defineEventHandler(async (event) => {
  const sql = useDb()
  const { month } = getQuery(event) // "2026-05" format

  const txns = month
    ? await sql`
        SELECT * FROM transactions
        WHERE to_char(created_at, 'YYYY-MM') = ${month as string}
        ORDER BY created_at DESC
      `
    : await sql`SELECT * FROM transactions ORDER BY created_at DESC LIMIT 200`

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
