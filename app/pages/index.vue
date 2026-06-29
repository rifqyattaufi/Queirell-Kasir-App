<template>
  <div class="p-4 md:p-6 max-w-5xl mx-auto">
    <div class="mb-5">
      <h1 class="text-xl font-bold text-slate-800">Kasir</h1>
      <p class="text-sm text-slate-400">{{ config.store_name }}</p>
    </div>

    <div class="flex flex-col lg:grid lg:grid-cols-3 gap-4">
      <!-- Kiri: Form input -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Info penerima -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Info Penerima (opsional)</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Nama</label>
              <input v-model="form.customerName" type="text" placeholder="Nama pelanggan"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Kota</label>
              <input v-model="form.customerCity" type="text" placeholder="Kota"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
          </div>
        </div>

        <!-- Tambah item -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Tambah Item</h2>

          <!-- Search / nama -->
          <div ref="dropRef" class="relative mb-3">
            <input
              v-model="itemForm.name"
              type="text"
              placeholder="Nama item — ketik atau pilih dari master"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
              @focus="showDrop = true"
            />
            <div v-if="showDrop && filteredMaster.length"
              class="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
              <button
                v-for="m in filteredMaster" :key="m.id"
                @mousedown.prevent="pickMaster(m)"
                class="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 flex justify-between items-center transition"
              >
                <span class="font-medium text-slate-700">{{ m.name }}</span>
                <span class="text-xs text-slate-400 ml-2 shrink-0">{{ m.unit }} · {{ formatRp(m.price) }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Satuan</label>
              <select v-if="!customUnit" v-model="itemForm.unit"
                class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white"
                @change="onUnitChange">
                <option value="" disabled>Pilih satuan</option>
                <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
                <option value="__custom__">Lainnya (ketik)...</option>
              </select>
              <div v-else class="w-full">
                <input ref="customUnitInput" v-model="itemForm.unit" type="text" placeholder="Ketik satuan"
                  class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                <button type="button" @click="itemForm.unit = ''; customUnit = false"
                  class="mt-1 text-xs text-slate-400 hover:text-emerald-600 transition">← Pilih dari daftar</button>
              </div>
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Qty</label>
              <input v-model.number="itemForm.qty" type="number" min="0" step="0.5" placeholder="0"
                class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Harga Satuan</label>
              <input v-model.number="itemForm.price" type="number" min="0" placeholder="0"
                class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-500">
              Subtotal: <span class="font-semibold text-slate-800">{{ formatRp(itemSubtotal) }}</span>
            </div>
            <button @click="addItem" :disabled="!canAdd"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah
            </button>
          </div>
        </div>

        <!-- Cart -->
        <div v-if="cart.length" class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Item Transaksi ({{ cart.length }})
            </span>
            <button @click="cart = []" class="text-xs text-red-400 hover:text-red-600 transition">Kosongkan</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-xs text-slate-400">
                <tr>
                  <th class="text-left px-4 py-2 w-8">No</th>
                  <th class="text-left px-2 py-2">Qty</th>
                  <th class="text-left px-2 py-2">Item</th>
                  <th class="text-right px-2 py-2">Harga</th>
                  <th class="text-right px-2 py-2">Jumlah</th>
                  <th class="w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in cart" :key="item._id"
                  class="border-t border-slate-50 hover:bg-slate-50 group transition">
                  <td class="px-4 py-2 text-slate-400 text-xs">{{ i + 1 }}</td>
                  <td class="px-2 py-2 text-slate-500 text-xs whitespace-nowrap">{{ item.qty }} {{ item.unit }}</td>
                  <td class="px-2 py-2 text-slate-800 font-medium">{{ item.name }}</td>
                  <td class="px-2 py-2 text-right text-slate-500 text-xs">{{ formatRp(item.price) }}</td>
                  <td class="px-2 py-2 text-right font-semibold text-slate-800 text-xs">{{ formatRp(item.subtotal) }}</td>
                  <td class="px-2 py-2 text-center">
                    <button @click="cart.splice(i, 1)"
                      class="text-slate-300 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-all text-xs">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div class="text-3xl mb-2 opacity-50">🛒</div>
          <div class="text-sm text-slate-400">Belum ada item — tambahkan di atas</div>
        </div>
      </div>

      <!-- Kanan: Ringkasan & bayar -->
      <div>
        <div class="bg-white rounded-2xl border border-slate-200 p-5 md:sticky md:top-4">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Ringkasan</h2>

          <div class="space-y-2 mb-4 text-sm">
            <div class="flex justify-between text-slate-500">
              <span>Jenis Item</span><span>{{ cart.length }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Total Qty</span><span>{{ totalQty }}</span>
            </div>
            <div class="border-t border-slate-100 pt-2 flex justify-between">
              <span class="font-bold text-slate-700">Total</span>
              <span class="font-bold text-emerald-600 text-lg">{{ formatRp(cartTotal) }}</span>
            </div>
          </div>

          <div class="bg-slate-50 rounded-xl p-3 space-y-3 mb-4">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Bayar</label>
              <input v-model.number="form.paid" type="number" min="0" placeholder="Nominal dibayar"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white transition" />
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Kembalian</span>
              <span class="font-semibold" :class="change < 0 ? 'text-red-500' : 'text-emerald-600'">
                {{ formatRp(change) }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="text-xs text-slate-500 mb-1 block">Catatan</label>
            <textarea v-model="form.note" rows="2" placeholder="Opsional..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none transition" />
          </div>

          <div class="space-y-2">
            <button @click="submit(true)" :disabled="!cart.length || saving"
              class="w-full py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              <span v-if="saving">⏳</span>
              <span v-else>🖨️</span>
              Simpan & Cetak Struk
            </button>
            <button @click="submit(false)" :disabled="!cart.length || saving"
              class="w-full py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 disabled:opacity-40 transition">
              Simpan Tanpa Print
            </button>
          </div>
        </div>
      </div>
    </div>

    <ReceiptModal :show="showReceipt" :tx="lastTx" @close="showReceipt = false" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { config } = useConfig()
const { formatRp } = useFormat()

// Master items dari DB
const { data: masterItems } = await useFetch<any[]>('/api/master-items')

// Form state
const form = reactive({ customerName: '', customerCity: '', paid: null as number | null, note: '' })

// Item form
const itemForm = reactive({ name: '', unit: '', qty: null as number | null, price: null as number | null })
const UNITS = ['Pcs', 'Mtr', 'Kg', 'Ltr', 'Lusin', 'Rim', 'Box', 'Set']
const customUnit = ref(false)
const customUnitInput = ref<HTMLInputElement | null>(null)

function onUnitChange() {
  if (itemForm.unit === '__custom__') {
    itemForm.unit = ''
    customUnit.value = true
    nextTick(() => customUnitInput.value?.focus())
  }
}

const showDrop = ref(false)
const dropRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('pointerdown', (e) => {
    if (dropRef.value && !dropRef.value.contains(e.target as Node)) {
      showDrop.value = false
    }
  })
})

// Cart
interface CartRow { _id: string; name: string; unit: string; qty: number; price: number; subtotal: number }
const cart = ref<CartRow[]>([])

// Receipt modal
const showReceipt = ref(false)
const lastTx = ref<any>(null)
const saving = ref(false)

// Computed
const filteredMaster = computed(() => {
  const q = itemForm.name.toLowerCase()
  return (masterItems.value ?? []).filter((m: any) => m.name.toLowerCase().includes(q))
})

const itemSubtotal = computed(() => (itemForm.qty ?? 0) * (itemForm.price ?? 0))
const canAdd = computed(() => itemForm.name.trim() && (itemForm.qty ?? 0) > 0 && (itemForm.price ?? 0) >= 0)
const cartTotal = computed(() => cart.value.reduce((s, i) => s + i.subtotal, 0))
const totalQty = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const change = computed(() => (form.paid ?? 0) - cartTotal.value)

function pickMaster(m: any) {
  itemForm.name = m.name
  itemForm.unit = m.unit
  itemForm.price = m.price
  customUnit.value = !!m.unit && !UNITS.includes(m.unit)
}

function addItem() {
  if (!canAdd.value) return
  cart.value.push({
    _id: `ci_${Date.now()}`,
    name: itemForm.name.trim(),
    unit: itemForm.unit.trim(),
    qty: itemForm.qty!,
    price: itemForm.price!,
    subtotal: itemSubtotal.value,
  })
  itemForm.name = ''
  itemForm.unit = ''
  itemForm.qty = null
  itemForm.price = null
  customUnit.value = false
}

async function submit(print: boolean) {
  if (!cart.value.length || saving.value) return
  saving.value = true
  try {
    const tx = await $fetch<any>('/api/transactions', {
      method: 'POST',
      body: {
        customerName: form.customerName,
        customerCity: form.customerCity,
        total: cartTotal.value,
        paid: form.paid ?? 0,
        change: change.value,
        note: form.note,
        items: cart.value.map(({ _id, ...rest }) => rest),
      },
    })
    lastTx.value = tx
    if (print) showReceipt.value = true
    // Reset
    cart.value = []
    form.customerName = ''
    form.customerCity = ''
    form.paid = null
    form.note = ''
    if (!print) alert('✅ Transaksi tersimpan!')
  } finally {
    saving.value = false
  }
}
</script>
