<template>
  <Teleport to="body">
    <div
      v-if="show && tx"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 class="font-semibold text-slate-700 text-sm">Preview Struk</h2>
          <div class="flex gap-2">
            <button
              @click="doPrint"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              🖨️ Print
            </button>
            <button
              @click="$emit('close')"
              class="px-3 py-1.5 text-slate-500 text-xs border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Tutup
            </button>
          </div>
        </div>

        <!-- Receipt -->
        <div id="receipt-preview" class="overflow-y-auto p-6 text-sm leading-relaxed font-mono flex-1">
          <!-- Store header -->
          <div style="display:flex;gap:10px;margin-bottom:12px;align-items:center">
            <div v-if="config.receipt_image" style="display:flex;align-items:center;flex-shrink:0">
              <img :src="config.receipt_image" style="max-height:64px;max-width:64px;object-fit:contain" />
            </div>
            <div style="flex:1">
              <div class="font-bold text-base leading-tight">{{ config.store_name }}</div>
              <div v-if="config.store_tagline" class="text-xs text-slate-500 mt-0.5">{{ config.store_tagline }}</div>
              <div class="text-xs text-slate-500 mt-1 leading-snug">{{ config.address }}</div>
              <div class="text-xs text-slate-500">{{ config.phone }}</div>
            </div>
            <div style="text-align:right;font-size:10px;flex-shrink:0">
              <div class="text-slate-500">Tanggal:</div>
              <div class="font-semibold">{{ formatDate(tx.created_at) }}</div>
              <template v-if="config.show_recipient === 'true' && tx.customer_name">
                <div class="mt-2 text-slate-500">Kepada Yth</div>
                <div class="font-semibold">{{ tx.customer_name }}</div>
                <div v-if="tx.customer_city">{{ tx.customer_city }}</div>
              </template>
            </div>
          </div>

          <div class="border-t border-b border-slate-300 py-2 my-2">
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
                  <td class="py-1 align-top">{{ i + 1 }}</td>
                  <td class="py-1 align-top">{{ item.qty }} {{ item.unit }}</td>
                  <td class="py-1 align-top">{{ item.name }}</td>
                  <td class="py-1 align-top text-right">{{ formatRp(item.price) }}</td>
                  <td class="py-1 align-top text-right pl-2">{{ formatRp(item.subtotal) }}</td>
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

          <div v-if="tx.note" class="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-2">
            Catatan: {{ tx.note }}
          </div>

          <div style="margin-top:24px;display:flex;justify-content:space-between;font-size:10px;color:#999;padding:0 6px">
            <span>Tanda Terima,</span>
            <span>{{ config.greeting_text }}</span>
          </div>

          <div style="margin-top:48px"></div>

          <div v-if="config.closing_text" class="text-center text-xs text-slate-400 mt-6 mb-2">
            {{ config.closing_text }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  tx: any
}>()

defineEmits<{ close: [] }>()

const { config } = useConfig()
const { formatRp, formatDate } = useFormat()

const totalQty = computed(() =>
  props.tx?.items?.reduce((s: number, i: any) => s + Number(i.qty), 0) ?? 0
)

function doPrint() {
  const el = document.getElementById('receipt-preview')
  if (!el) return

  const win = window.open('', '_blank')
  if (!win) return

  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>Struk - ${props.tx?.customer_name || 'Kasir'}</title>
    <style>
      @page { margin: 0; size: auto; }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: monospace; font-size: 12px; width: 100%; padding: 10px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 3px 4px; vertical-align: top; }
      .border-t { border-top: 1px solid #ccc; }
      .border-b { border-bottom: 1px solid #ccc; }
      .border-dashed { border-top: 1px dashed #ccc; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .font-bold { font-weight: bold; }
      .font-semibold { font-weight: 600; }
      .text-xs { font-size: 10px; }
      .text-sm { font-size: 11px; }
      .text-base { font-size: 14px; }
      .text-slate-400, .text-slate-500 { color: #666; }
      .py-1\\.5 td, td.py-1\\.5 { padding-top: 4px; padding-bottom: 4px; }
      .pr-2 { padding-right: 12px; }
      .mr-3 { margin-right: 12px; }
      .mt-2 { margin-top: 6px; }
      .justify-between { display: flex; justify-content: space-between; }
      .items-start { align-items: flex-start; }
    </style>
  </head><body>${el.innerHTML}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 350)
}
</script>
