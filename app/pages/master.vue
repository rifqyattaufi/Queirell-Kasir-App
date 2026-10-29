<template>
  <div class="p-4 md:p-6 max-w-3xl mx-auto">
    <!-- Tab -->
    <div class="flex gap-2 mb-5">
      <button @click="tab = 'items'"
        :class="tab === 'items' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition">📦 Master Item</button>
      <button @click="tab = 'payment'"
        :class="tab === 'payment' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition">💳 Metode Bayar</button>
    </div>

    <!-- ── TAB ITEM ── -->
    <template v-if="tab === 'items'">
      <div class="mb-5 flex items-start justify-between gap-3">
        <p class="text-sm text-slate-400 dark:text-slate-500">{{ items?.length ?? 0 }} item terdaftar</p>
        <button @click="openAdd"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">
          + Tambah
        </button>
      </div>

      <input v-model="search" type="text" placeholder="Cari item..."
        class="w-full mb-4 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />

      <div v-if="pending" class="text-center text-slate-400 dark:text-slate-500 py-10 text-sm flex items-center justify-center gap-2">
        <div class="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
        Memuat...
      </div>
      <div v-else-if="!filtered.length"
        class="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
        <div class="text-3xl mb-2 opacity-40">📦</div>
        <div class="text-sm text-slate-400 dark:text-slate-500">Belum ada master item</div>
      </div>
      <div v-else class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-700 text-xs text-slate-400 dark:text-slate-500">
            <tr>
              <th class="text-left px-4 py-3">Nama Item</th>
              <th class="text-left px-2 py-3 w-20">Satuan</th>
              <th class="text-right px-4 py-3 w-32">Harga</th>
              <th class="w-20"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id"
              class="border-t border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition group">
              <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{{ item.name }}</td>
              <td class="px-2 py-3 text-slate-500 dark:text-slate-400">{{ item.unit }}</td>
              <td class="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">{{ formatRp(item.price) }}</td>
              <td class="px-3 py-3">
                <div class="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition">
                  <button @click="openEdit(item)"
                    class="px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">Edit</button>
                  <button @click="remove(item.id)"
                    class="px-2 py-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ── TAB PAYMENT ── -->
    <template v-else>
      <div class="mb-5 flex items-start justify-between gap-3">
        <p class="text-sm text-slate-400 dark:text-slate-500">{{ paymentMethods?.length ?? 0 }} metode terdaftar</p>
        <button @click="openAddMethod"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">
          + Tambah Metode
        </button>
      </div>

      <div v-if="pendingPm" class="text-center text-slate-400 dark:text-slate-500 py-10 text-sm">Memuat...</div>
      <div v-else-if="!paymentMethods?.length"
        class="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
        <div class="text-3xl mb-2 opacity-40">💳</div>
        <div class="text-sm text-slate-400 dark:text-slate-500">Belum ada metode pembayaran</div>
      </div>
      <div v-else class="space-y-3">
        <div v-for="pm in paymentMethods" :key="pm.id"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-slate-800 dark:text-slate-100 text-sm">{{ pm.name }}</span>
            <div class="flex gap-1">
              <button @click="openAddAccount(pm)"
                class="px-2 py-1 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition">+ Rekening</button>
              <button @click="openEditMethod(pm)"
                class="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">Edit</button>
              <button @click="removeMethod(pm.id)"
                class="px-2 py-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">Hapus</button>
            </div>
          </div>
          <div v-if="pm.accounts?.length" class="space-y-1">
            <div v-for="acc in pm.accounts" :key="acc.id"
              class="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex items-center gap-2">
                <img v-if="acc.image" :src="acc.image" class="h-8 w-8 object-contain rounded" />
                <span>{{ acc.name || '(gambar)' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="openEditAccount(pm, acc)"
                  class="text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition">Edit</button>
                <button @click="removeAccount(acc.id)"
                  class="text-slate-300 dark:text-slate-500 hover:text-red-400 transition">✕</button>
              </div>
            </div>
          </div>
          <div v-else class="text-xs text-slate-300 dark:text-slate-600 mt-1">Belum ada rekening</div>
        </div>
      </div>
    </template>

    <!-- Modal Item -->
    <Teleport to="body">
      <div v-if="modal.show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="modal.show = false">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
          <h2 class="font-bold text-slate-800 dark:text-slate-100 mb-4">{{ modal.id ? 'Edit Item' : 'Tambah Item' }}</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nama Item *</label>
              <input v-model="modal.name" type="text" placeholder="Nama item"
                class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Satuan</label>
                <select v-if="!customUnitModal" v-model="modal.unit"
                  class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
                  @change="onModalUnitChange">
                  <option value="" disabled>Pilih satuan</option>
                  <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
                  <option value="__custom__">Lainnya (ketik)...</option>
                </select>
                <div v-else class="w-full">
                  <input ref="customUnitModalInput" v-model="modal.unit" type="text" placeholder="Ketik satuan"
                    class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                  <button type="button" @click="modal.unit = ''; customUnitModal = false"
                    class="mt-1 text-xs text-slate-400 hover:text-emerald-600 transition">← Pilih dari daftar</button>
                </div>
              </div>
              <div>
                <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Harga Default</label>
                <input type="text" inputmode="numeric" placeholder="0"
                  :value="modal.price ? modal.price.toLocaleString('id-ID') : ''"
                  @input="(e: Event) => { const el = e.target as HTMLInputElement; const raw = el.value.replace(/\D/g,''); modal.price = raw ? Number(raw) : 0; el.value = raw ? Number(raw).toLocaleString('id-ID') : '' }"
                  class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-5">
            <button @click="save" :disabled="!modal.name.trim() || saving"
              class="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button @click="modal.show = false"
              class="px-4 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              Batal
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Metode/Rekening -->
    <Teleport to="body">
      <div v-if="pmModal.show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="pmModal.show = false">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
          <h2 class="font-bold text-slate-800 dark:text-slate-100 mb-4">
            {{ pmModal.type === 'method' ? (pmModal.id ? 'Edit Metode Bayar' : 'Tambah Metode Bayar') : `${pmModal.id ? 'Edit' : 'Tambah'} Rekening — ${pmModal.methodName}` }}
          </h2>

          <template v-if="pmModal.type === 'method'">
            <input v-model="pmModal.name" type="text" placeholder="Contoh: Transfer, QRIS, Tunai"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </template>

          <template v-else>
            <!-- Toggle teks / gambar -->
            <div class="flex gap-2 mb-3">
              <button @click="pmModal.inputType = 'text'"
                :class="pmModal.inputType === 'text' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
                class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition">Teks</button>
              <button @click="pmModal.inputType = 'image'"
                :class="pmModal.inputType === 'image' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
                class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition">Gambar</button>
            </div>

            <div class="space-y-3">
              <!-- Nama selalu ada (opsional jika gambar) -->
              <div>
                <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  Nama rekening{{ pmModal.inputType === 'image' ? ' (opsional)' : ' *' }}
                </label>
                <input v-model="pmModal.name" type="text" placeholder="Contoh: BCA - 1234567890"
                  class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>

              <!-- Upload gambar -->
              <div v-if="pmModal.inputType === 'image'">
                <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Gambar *</label>
                <div v-if="pmModal.image" class="mb-2 flex items-center gap-2">
                  <img :src="pmModal.image" class="h-20 w-20 object-contain border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700" />
                  <button @click="pmModal.image = ''" type="button" class="text-xs text-red-400 hover:text-red-600">Hapus</button>
                </div>
                <input type="file" accept="image/*" @change="onAccountImageUpload"
                  class="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
              </div>
            </div>
          </template>

          <div class="flex gap-2 mt-4">
            <button @click="savePm" :disabled="!canSavePm || pmSaving"
              class="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition">
              {{ pmSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button @click="pmModal.show = false"
              class="px-4 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              Batal
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { formatRp } = useFormat()

const tab = ref<'items' | 'payment'>('items')

// ── Items ──
const { data: items, pending, refresh } = await useFetch<any[]>('/api/master-items')
const search = ref('')
const saving = ref(false)
const UNITS = ['Pcs', 'Mtr', 'Kg', 'Ltr', 'Lusin', 'Rim', 'Box', 'Set']
const customUnitModal = ref(false)
const customUnitModalInput = ref<HTMLInputElement | null>(null)

function onModalUnitChange() {
  if (modal.unit === '__custom__') {
    modal.unit = ''
    customUnitModal.value = true
    nextTick(() => customUnitModalInput.value?.focus())
  }
}

const modal = reactive({ show: false, id: '', name: '', unit: '', price: 0 })

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return (items.value ?? []).filter((i: any) => i.name.toLowerCase().includes(q))
})

function openAdd() {
  modal.id = ''; modal.name = ''; modal.unit = ''; modal.price = 0
  customUnitModal.value = false
  modal.show = true
}

function openEdit(item: any) {
  modal.id = item.id; modal.name = item.name; modal.unit = item.unit; modal.price = item.price
  customUnitModal.value = !!item.unit && !UNITS.includes(item.unit)
  modal.show = true
}

async function save() {
  if (!modal.name.trim() || saving.value) return
  saving.value = true
  try {
    if (modal.id) {
      await $fetch(`/api/master-items/${modal.id}`, { method: 'PUT', body: { name: modal.name, unit: modal.unit, price: modal.price } })
    } else {
      await $fetch('/api/master-items', { method: 'POST', body: { name: modal.name, unit: modal.unit, price: modal.price } })
    }
    modal.show = false
    await refresh()
  } catch (e: any) {
    alert(`Gagal menyimpan: ${e?.data?.message || e?.message || 'error tidak diketahui'}`)
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Hapus item ini?')) return
  await $fetch(`/api/master-items/${id}`, { method: 'DELETE' })
  await refresh()
}

// ── Payment Methods ──
const { data: paymentMethods, pending: pendingPm, refresh: refreshPm } = await useFetch<any[]>('/api/payment-methods')
const pmSaving = ref(false)
const pmModal = reactive({
  show: false,
  type: 'method' as 'method' | 'account',
  inputType: 'text' as 'text' | 'image',
  id: '', methodId: '', methodName: '', name: '', image: '',
})

const canSavePm = computed(() => {
  if (pmModal.type === 'method') return pmModal.name.trim().length > 0
  if (pmModal.inputType === 'text') return pmModal.name.trim().length > 0
  return pmModal.image.length > 0
})

function openAddMethod() {
  Object.assign(pmModal, { type: 'method', inputType: 'text', id: '', name: '', image: '', methodId: '', methodName: '' })
  pmModal.show = true
}

function openAddAccount(pm: any) {
  Object.assign(pmModal, { type: 'account', inputType: 'text', id: '', name: '', image: '', methodId: pm.id, methodName: pm.name })
  pmModal.show = true
}

function openEditMethod(pm: any) {
  Object.assign(pmModal, { type: 'method', inputType: 'text', id: pm.id, name: pm.name, image: '', methodId: pm.id, methodName: pm.name })
  pmModal.show = true
}

function openEditAccount(pm: any, acc: any) {
  Object.assign(pmModal, { type: 'account', inputType: acc.image ? 'image' : 'text', id: acc.id, name: acc.name, image: acc.image, methodId: pm.id, methodName: pm.name })
  pmModal.show = true
}

function onAccountImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Gambar terlalu besar, maks 5MB'); return }
  const reader = new FileReader()
  reader.onload = () => { pmModal.image = reader.result as string }
  reader.readAsDataURL(file)
}

async function savePm() {
  if (!canSavePm.value || pmSaving.value) return
  pmSaving.value = true
  try {
    if (pmModal.type === 'method') {
      await $fetch(pmModal.id ? `/api/payment-methods/${pmModal.id}` : '/api/payment-methods', {
        method: pmModal.id ? 'PUT' : 'POST', body: { name: pmModal.name },
      })
    } else {
      await $fetch(pmModal.id ? `/api/payment-accounts/${pmModal.id}` : `/api/payment-methods/${pmModal.methodId}/accounts`, {
        method: pmModal.id ? 'PUT' : 'POST',
        body: { name: pmModal.name, image: pmModal.image },
      })
    }
    pmModal.show = false
    await refreshPm()
  } finally {
    pmSaving.value = false
  }
}

async function removeMethod(id: string) {
  if (!confirm('Hapus metode ini beserta semua rekeningnya?')) return
  await $fetch(`/api/payment-methods/${id}`, { method: 'DELETE' })
  await refreshPm()
}

async function removeAccount(id: string) {
  if (!confirm('Hapus rekening ini?')) return
  await $fetch(`/api/payment-accounts/${id}`, { method: 'DELETE' })
  await refreshPm()
}
</script>
