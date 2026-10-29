interface ItemPayload {
  name: string
  unit: string
  qty: number
  price: number
  subtotal: number
}

interface TxPayload {
  customerName: string
  customerCity: string
  total: number
  paid: number
  change: number
  note: string
  paymentMethod: string
  paymentAccount: string
  paymentAccountId?: string
  items: ItemPayload[]
}

export default defineEventHandler(async (event) => {
  const sql = useDb()
  const body = await readBody<TxPayload>(event)

  if (!body.items?.length) throw createError({ statusCode: 400, message: 'Item tidak boleh kosong' })

  // Gunakan transaksi DB agar atomik
  const result = await sql.begin(async (tx) => {
    // serialisasi per-hari agar nomor urut tidak kembar; tanggal & urutan pakai WIB
    await tx`SELECT pg_advisory_xact_lock(hashtext('invoice_number'))`
    const [{ prefix, seq }] = await tx`
      SELECT 'INV-' || to_char(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYYYMMDD') || '-' AS prefix,
        (SELECT COALESCE(MAX(RIGHT(invoice_number, 3)::int), 0) + 1 FROM transactions
         WHERE invoice_number LIKE 'INV-' || to_char(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYYYMMDD') || '-%') AS seq
    `
    const invoiceNumber = `${prefix}${String(seq).padStart(3, '0')}`

    const [txn] = await tx`
      INSERT INTO transactions (invoice_number, customer_name, customer_city, total, paid, change, note, payment_method, payment_account, payment_account_id)
      VALUES (
        ${invoiceNumber},
        ${body.customerName ?? ''},
        ${body.customerCity ?? ''},
        ${body.total},
        ${body.paid},
        ${body.change},
        ${body.note ?? ''},
        ${body.paymentMethod ?? ''},
        ${body.paymentAccount ?? ''},
        ${body.paymentAccountId || null}
      )
      RETURNING *
    `

    const itemRows = body.items.map((item, idx) => ({
      transaction_id: txn.id,
      name:           item.name,
      unit:           item.unit ?? '',
      qty:            item.qty,
      price:          item.price,
      subtotal:       item.subtotal,
      sort_order:     idx,
    }))

    const items = await tx`
      INSERT INTO transaction_items ${tx(itemRows, 'transaction_id', 'name', 'unit', 'qty', 'price', 'subtotal', 'sort_order')}
      RETURNING *
    `

    return { ...txn, items }
  })

  return result
})
