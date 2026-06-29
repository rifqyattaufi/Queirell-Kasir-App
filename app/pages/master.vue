<template>
  <div class="p-4 md:p-6 max-w-3xl mx-auto">
    <div class="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Master Item</h1>
        <p class="text-sm text-slate-400">{{ items?.length ?? 0 }} item terdaftar</p>
      </div>
      <button @click="openAdd"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">
        + Tambah
      </button>
    </div>

    <!-- Search -->
    <input v-model="search" type="text" placeholder="Cari item..."
      class="w-full mb-4 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />

    <!-- Loading -->
    <div v-if="pending" class="text-center text-slate-400 py-10 text-sm flex items-center justify-center gap-2">
      <div class="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
      Memuat...
    </div>

    <!-- Empty -->
    <div v-else-if="!filtered.length"
      class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
      <div class="text-3xl mb-2 opacity-40">📦</div>
      <div class="text-sm text-slate-400">Belum ada master item</div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-xs text-slate-400">
          <tr>
            <th class="text-left px-4 py-3">Nama Item</th>
            <th class="text-left px-2 py-3 w-20">Satuan</th>
            <th class="text-right px-4 py-3 w-32">Harga</th>
            <th class="w-20"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id"
            class="border-t border-slate-50 hover:bg-slate-50 transition group">
            <td class="px-4 py-3 font-medium text-slate-800">{{ item.name }}</td>
            <td class="px-2 py-3 text-slate-500">{{ item.unit }}</td>
            <td class="px-4 py-3 text-right font-semibold text-slate-700">{{ formatRp(item.price) }}</td>
            <td class="px-3 py-3">
              <div class="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition">
                <button @click="openEdit(item)"
                  class="px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 rounded-lg transition">Edit</button>
                <button @click="remove(item.id)"
                  class="px-2 py-1 text-xs text-red-400 hover:bg-red-50 rounded-lg transition">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal add/edit -->
    <Teleport to="body">
      <div v-if="modal.show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="modal.show = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
          <h2 class="font-bold text-slate-800 mb-4">{{ modal.id ? 'Edit Item' : 'Tambah Item' }}</h2>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Nama Item *</label>
              <input v-model="modal.name" type="text" placeholder="Nama item"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-slate-500 mb-1 block">Satuan</label>
                <select v-if="!customUnitModal" v-model="modal.unit"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white"
                  @change="onModalUnitChange">
                  <option value="" disabled>Pilih satuan</option>
                  <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
                  <option value="__custom__">Lainnya (ketik)...</option>
                </select>
                <div v-else class="w-full">
                  <input ref="customUnitModalInput" v-model="modal.unit" type="text" placeholder="Ketik satuan"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                  <button type="button" @click="modal.unit = ''; customUnitModal = false"
                    class="mt-1 text-xs text-slate-400 hover:text-emerald-600 transition">← Pilih dari daftar</button>
                </div>
              </div>
              <div>
                <label class="text-xs text-slate-500 mb-1 block">Harga Default</label>
                <input v-model.number="modal.price" type="number" min="0" placeholder="0"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>
            </div>
          </div>

          <div class="flex gap-2 mt-5">
            <button @click="save" :disabled="!modal.name.trim() || saving"
              class="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button @click="modal.show = false"
              class="px-4 py-2.5 border border-slate-200 text-slate-500 text-sm rounded-xl hover:bg-slate-50 transition">
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
      await $fetch(`/api/master-items/${modal.id}`, {
        method: 'PUT',
        body: { name: modal.name, unit: modal.unit, price: modal.price },
      })
    } else {
      await $fetch('/api/master-items', {
        method: 'POST',
        body: { name: modal.name, unit: modal.unit, price: modal.price },
      })
    }
    modal.show = false
    await refresh()
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Hapus item ini?')) return
  await $fetch(`/api/master-items/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
