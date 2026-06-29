<template>
  <div class="p-4 md:p-6 max-w-md mx-auto">
    <div class="flex items-center gap-3 mb-5">
      <NuxtLink to="/history"
        class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-500">
        ←
      </NuxtLink>
      <h1 class="text-lg font-bold text-slate-800">Detail Transaksi</h1>
    </div>

    <div v-if="pending" class="text-center text-slate-400 py-12 text-sm">Memuat...</div>

    <div v-else-if="tx">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <ReceiptModal :show="false" :tx="tx" />

        <!-- Inline receipt preview -->
        <div id="receipt-preview" class="font-mono text-sm leading-relaxed">
          <div style="display:flex;gap:10px;margin-bottom:12px;align-items:center">
            <div v-if="config.receipt_image" style="display:flex;align-items:center;flex-shrink:0">
              <img :src="config.receipt_image" style="max-height:64px;max-width:64px;object-fit:contain" />
            </div>
            <div style="flex:1">
              <div class="font-bold text-base leading-tight">{{ config.store_name }}</div>
              <div v-if="config.store_tagline" class="text-xs text-slate-500 mt-0.5">{{ config.store_tagline }}</div>
              <div class="text-xs text-slate-500 mt-1">{{ config.address }}</div>
              <div class="text-xs text-slate-500">{{ config.phone }}</div>
            </div>
            <div style="text-align:right;font-size:10px;flex-shrink:0">
              <div class="text-slate-400">Tanggal:</div>
              <div class="font-semibold">{{ formatDate(tx.created_at) }}</div>
              <template v-if="config.show_recipient === 'true' && tx.customer_name">
                <div class="mt-1 text-slate-400">Kepada Yth</div>
                <div class="font-semibold">{{ tx.customer_name }}</div>
                <div v-if="tx.customer_city" class="text-slate-600">{{ tx.customer_city }}</div>
              </template>
            </div>
          </div>

          <div class="border-t border-b border-slate-300 py-1 my-2">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-slate-400">
                  <th class="text-left py-1 w-5">No</th>
                  <th class="text-left py-1 w-16">Qty</th>
                  <th class="text-left py-1">Nama Item</th>
                  <th class="text-right py-1">Harga</th>
                  <th class="text-right py-1 pl-2">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in tx.items" :key="item.id" class="border-t border-slate-50">
                  <td class="py-1">{{ i + 1 }}</td>
                  <td class="py-1">{{ item.qty }} {{ item.unit }}</td>
                  <td class="py-1">{{ item.name }}</td>
                  <td class="py-1 text-right">{{ formatRp(item.price) }}</td>
                  <td class="py-1 text-right pl-2">{{ formatRp(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>


          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:6px">
            <table style="font-size:11px;border-collapse:collapse;border-top:1px solid #ccc;margin-right:8px">
              <tr style="font-weight:bold;font-size:12px">
                <td style="padding:4px 10px 4px 0">TOTAL</td>
                <td style="text-align:right;padding:4px 0">{{ formatRp(tx.total) }}</td>
              </tr>
              <tr style="color:#666">
                <td style="padding:4px 10px 4px 0">BAYAR</td>
                <td style="text-align:right;padding:4px 0">{{ formatRp(tx.paid) }}</td>
              </tr>
              <tr v-if="Number(tx.change) !== 0" style="font-weight:600;border-top:1px dashed #ccc">
                <td style="padding:4px 10px 4px 0">{{ Number(tx.change) > 0 ? 'KEMBALI' : 'SISA' }}</td>
                <td style="text-align:right;padding:4px 0">{{ formatRp(Math.abs(Number(tx.change))) }}</td>
              </tr>
            </table>
          </div>

          <div v-if="tx.note" class="mt-3 text-xs text-slate-400 border-t pt-2">
            Catatan: {{ tx.note }}
          </div>

          <div style="margin-top:24px;display:flex;justify-content:space-between;font-size:10px;color:#999;padding:0 6px">
            <span>Tanda Terima,</span>
            <span>{{ config.greeting_text }}</span>
          </div>

          <div style="margin-top:48px"></div>

          <div v-if="config.closing_text" class="text-center text-xs text-slate-400 mt-6">
            {{ config.closing_text }}
          </div>
        </div>
      </div>

      <button @click="doPrint"
        class="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-sm">
        🖨️ Print Struk
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const { config } = useConfig()
const { formatRp, formatDate } = useFormat()

const { data: tx, pending } = await useFetch<any>(`/api/transactions/${route.params.id}`)

const totalQty = computed(() =>
  tx.value?.items?.reduce((s: number, i: any) => s + Number(i.qty), 0) ?? 0
)

function doPrint() {
  const el = document.getElementById('receipt-preview')
  if (!el) return
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="utf-8"><title>Struk</title>
    <style>
      @page { margin: 0; size: auto; }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: monospace; font-size: 12px; width: 100%; padding: 10px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 2px; vertical-align: top; }
      .border-t { border-top: 1px solid #ccc; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
    </style>
  </head><body>${el.innerHTML}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 350)
}
</script>
