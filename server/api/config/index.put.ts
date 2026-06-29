export default defineEventHandler(async (event) => {
  const sql = useDb()
  const body = await readBody<Record<string, string>>(event)

  const pairs = Object.entries(body).map(([key, value]) => ({ key, value }))
  if (!pairs.length) return { ok: true }

  await sql`
    INSERT INTO store_config ${sql(pairs, 'key', 'value')}
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `
  return { ok: true }
})
