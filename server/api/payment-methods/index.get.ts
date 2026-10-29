export default defineEventHandler(async () => {
  const sql = useDb()
  const methods = await sql`SELECT * FROM payment_methods ORDER BY created_at`
  const accounts = await sql`SELECT * FROM payment_accounts ORDER BY created_at`
  return methods.map(m => ({
    ...m,
    accounts: accounts.filter(a => a.payment_method_id === m.id),
  }))
})
