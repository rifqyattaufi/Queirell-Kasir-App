export default defineEventHandler(async () => {
  const sql = useDb()

  const rows = await sql`
    SELECT
      to_char(created_at, 'YYYY-MM') AS month,
      COUNT(*)::int                  AS count,
      SUM(total)::bigint             AS total,
      SUM(paid)::bigint              AS paid
    FROM transactions
    GROUP BY month
    ORDER BY month DESC
  `

  return rows
})
