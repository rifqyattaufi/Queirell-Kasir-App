<template>
  <div class="p-4 md:p-6 max-w-xl mx-auto">
    <div class="mb-5">
      <h1 class="text-xl font-bold text-slate-800">Pengaturan Toko</h1>
      <p class="text-sm text-slate-400">Konfigurasi teks yang muncul di struk</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <!-- Identitas toko -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Identitas Toko</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Nama Toko</label>
            <input v-model="form.store_name" type="text" placeholder="Nama toko"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Tagline (opsional)</label>
            <input v-model="form.store_tagline" type="text" placeholder="Tagline toko"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Alamat</label>
            <textarea v-model="form.address" rows="2" placeholder="Alamat lengkap"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 mb-1 block">No. Telepon</label>
            <input v-model="form.phone" type="text" placeholder="08xxxxxxxx"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Teks struk -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Teks Struk</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Teks Penutup (bawah)</label>
            <input v-model="form.closing_text" type="text" placeholder="*** Thank You ***"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Teks Kanan Bawah</label>
            <input v-model="form.greeting_text" type="text" placeholder="Barakallah 😊"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Gambar struk -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Gambar Struk</h2>
        <div class="space-y-3">
          <div v-if="form.receipt_image" class="flex items-center gap-3">
            <img :src="form.receipt_image" class="h-16 rounded-lg border border-slate-200 object-contain bg-slate-50" />
            <button @click="form.receipt_image = ''" type="button"
              class="text-xs text-red-400 hover:text-red-600 transition">Hapus gambar</button>
          </div>
          <div>
            <label class="text-xs text-slate-500 mb-1 block">Upload gambar (logo/header struk)</label>
            <input type="file" accept="image/*" @change="onImageUpload"
              class="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
            <p class="text-xs text-slate-400 mt-1">Disarankan ukuran lebar, maks 1MB</p>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Toggle -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Tampilan Struk</h2>
        <label class="flex items-center gap-3 cursor-pointer">
          <div class="relative">
            <input type="checkbox" :checked="form.show_recipient === 'true'"
              @change="form.show_recipient = ($event.target as HTMLInputElement).checked ? 'true' : 'false'"
              class="sr-only" />
            <div class="w-10 h-5 rounded-full transition"
              :class="form.show_recipient === 'true' ? 'bg-emerald-500' : 'bg-slate-200'">
              <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                :class="form.show_recipient === 'true' ? 'translate-x-5' : ''" />
            </div>
          </div>
          <span class="text-sm text-slate-700">Tampilkan info penerima di struk</span>
        </label>
      </div>

      <!-- Preview -->
      <div class="border-t border-slate-100 pt-4">
        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Preview Header Struk</h2>
        <div class="bg-slate-50 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-700">
          <div class="font-bold text-sm">{{ form.store_name || '(Nama Toko)' }}</div>
          <div v-if="form.store_tagline" class="text-slate-400">{{ form.store_tagline }}</div>
          <div class="mt-1 text-slate-500">{{ form.address || '(Alamat)' }}</div>
          <div class="text-slate-500">{{ form.phone || '(Telepon)' }}</div>
          <div class="mt-3 border-t border-slate-300 pt-2 text-center text-slate-400">
            {{ form.footer_note || '' }}
          </div>
          <div class="mt-3 text-slate-400 text-center">{{ form.closing_text || '' }}</div>
        </div>
      </div>

      <div class="flex gap-2">
        <button @click="save" :disabled="saving"
          class="flex-1 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition flex items-center justify-center gap-2">
          <span v-if="saving">⏳ Menyimpan...</span>
          <span v-else>💾 Simpan Pengaturan</span>
        </button>
        <button @click="showPreview = true"
          class="px-4 py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition flex items-center gap-2">
          🖨️ Preview Struk
        </button>
      </div>

      <div v-if="saved" class="text-center text-sm text-emerald-600 font-medium">
        ✅ Pengaturan berhasil disimpan!
      </div>
    </div>
  </div>

  <ReceiptModal :show="showPreview" :tx="dummyTx" @close="showPreview = false" />
</template>

<script setup lang="ts">
import type { StoreConfig } from '~/composables/useConfig'

definePageMeta({ layout: 'default' })

const { config, saveConfig } = useConfig()

const form = reactive<StoreConfig>({ ...config.value })

// Sync ketika config berubah dari server (saat pertama load)
watch(config, (val) => {
  Object.assign(form, val)
}, { immediate: true })

const saving = ref(false)
const saved = ref(false)

function onImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 1024 * 1024) { alert('Gambar terlalu besar, maks 1MB'); return }
  const reader = new FileReader()
  reader.onload = () => { form.receipt_image = reader.result as string }
  reader.readAsDataURL(file)
}
const showPreview = ref(false)

const dummyTx = {
  created_at: new Date().toISOString(),
  customer_name: 'Budi Santoso',
  customer_city: 'Jakarta',
  total: 150000,
  paid: 200000,
  change: 50000,
  note: 'Contoh catatan transaksi',
  items: [
    { id: 1, qty: 2, unit: 'Pcs', name: 'Contoh Produk A', price: 50000, subtotal: 100000 },
    { id: 2, qty: 1, unit: 'Mtr', name: 'Contoh Produk B', price: 50000, subtotal: 50000 },
  ],
}

async function save() {
  saving.value = true
  saved.value = false
  try {
    await saveConfig({ ...form })
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } finally {
    saving.value = false
  }
}
</script>
