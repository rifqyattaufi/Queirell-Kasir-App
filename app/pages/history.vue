<template>
  <div class="p-4 md:p-6 max-w-3xl mx-auto">
    <div class="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">History Transaksi</h1>
        <p class="text-sm text-slate-400">{{ transactions?.length ?? 0 }} transaksi</p>
      </div>
      <input v-model="search" type="text" placeholder="Cari nama / item..."
        class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 w-44 transition" />
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-16 text-slate-400 text-sm">
      <div class="animate-spin mr-2 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
      Memuat data...
    </div>

    <!-- Empty -->
    <div v-else-if="!filtered.length"
      class="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
      <div class="text-3xl mb-2 opacity-40">📋</div>
      <div class="text-sm text-slate-400">Belum ada transaksi tersimpan</div>
    </div>

    <!-- List -->
    <div v-else class="space-y-2">
      <div v-for="tx in filtered" :key="tx.id"
        class="bg-white border border-slate-200 rounded-2xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-slate-800 text-sm">
                {{ tx.customer_name || 'Tanpa Nama' }}
              </span>
              <span v-if="tx.customer_city" class="text-xs text-slate-400">— {{ tx.customer_city }}</span>
            </div>
            <div class="text-xs text-slate-400 mt-0.5 mb-2">{{ formatDateTime(tx.created_at) }}</div>
            <div class="flex flex-wrap gap-1">
              <span v-for="item in tx.items.slice(0, 3)" :key="item.id"
                class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {{ item.name }}
              </span>
              <span v-if="tx.items.length > 3" class="text-xs text-slate-400">
                +{{ tx.items.length - 3 }} lainnya
              </span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="font-bold text-emerald-600">{{ formatRp(tx.total) }}</div>
            <div class="text-xs text-slate-400">Bayar {{ formatRp(tx.paid) }}</div>
            <div class="text-xs" :class="Number(tx.change) >= 0 ? 'text-slate-400' : 'text-red-400'">
              Sisa {{ formatRp(tx.change) }}
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-3 pt-3 border-t border-slate-50">
          <button @click="openReceipt(tx)"
            class="flex-1 py-1.5 text-center text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
            🖨️ Lihat & Print
          </button>
          <button @click="remove(tx.id)"
            class="px-3 py-1.5 text-sm text-red-400 border border-red-100 rounded-lg hover:bg-red-50 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>

  <ReceiptModal :show="!!selectedTx" :tx="selectedTx" @close="selectedTx = null" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { formatRp, formatDateTime } = useFormat()

const { data: transactions, pending, refresh } = await useFetch<any[]>('/api/transactions')

const search = ref('')
const selectedTx = ref<any>(null)

function openReceipt(tx: any) {
  selectedTx.value = tx
}
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return transactions.value ?? []
  return (transactions.value ?? []).filter(tx =>
    tx.customer_name?.toLowerCase().includes(q) ||
    tx.customer_city?.toLowerCase().includes(q) ||
    tx.items?.some((i: any) => i.name.toLowerCase().includes(q))
  )
})

async function remove(id: string) {
  if (!confirm('Hapus transaksi ini?')) return
  await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
