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
  items: ItemPayload[]
}

export default defineEventHandler(async (event) => {
  const sql = useDb()
  const body = await readBody<TxPayload>(event)

  if (!body.items?.length) throw createError({ statusCode: 400, message: 'Item tidak boleh kosong' })

  // Gunakan transaksi DB agar atomik
  const result = await sql.begin(async (tx) => {
    const [txn] = await tx`
      INSERT INTO transactions (customer_name, customer_city, total, paid, change, note)
      VALUES (
        ${body.customerName ?? ''},
        ${body.customerCity ?? ''},
        ${body.total},
        ${body.paid},
        ${body.change},
        ${body.note ?? ''}
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
