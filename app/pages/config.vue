<template>
  <div class="p-4 md:p-6 max-w-xl mx-auto">
    <div class="mb-5">
      <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Pengaturan Toko</h1>
      <p class="text-sm text-slate-400 dark:text-slate-500">Konfigurasi teks yang muncul di struk</p>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <!-- Identitas toko -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Identitas Toko</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nama Toko</label>
            <input v-model="form.store_name" type="text" placeholder="Nama toko"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Tagline (opsional)</label>
            <input v-model="form.store_tagline" type="text" placeholder="Tagline toko"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Alamat</label>
            <textarea v-model="form.address" rows="2" placeholder="Alamat lengkap"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">No. Telepon</label>
            <input v-model="form.phone" type="tel" placeholder="08xxxxxxxx" inputmode="numeric"
              @input="(e: Event) => { const el = e.target as HTMLInputElement; el.value = el.value.replace(/[^0-9+\-\s]/g, '') }"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 dark:border-slate-700" />

      <!-- Teks struk -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Teks Struk</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Teks Penutup (bawah)</label>
            <input v-model="form.closing_text" type="text" placeholder="*** Thank You ***"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Teks Kanan Bawah</label>
            <input v-model="form.greeting_text" type="text" placeholder="Barakallah 😊"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 dark:border-slate-700" />

      <!-- Gambar struk -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Gambar Struk</h2>
        <div class="space-y-3">
          <div v-if="form.receipt_image" class="flex items-center gap-3">
            <img :src="form.receipt_image" class="h-16 rounded-lg border border-slate-200 dark:border-slate-600 object-contain bg-slate-50 dark:bg-slate-700" />
            <button @click="form.receipt_image = ''" type="button"
              class="text-xs text-red-400 hover:text-red-600 transition">Hapus gambar</button>
          </div>
          <div>
            <label class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Upload gambar (logo/header struk)</label>
            <input type="file" accept="image/*" @change="onImageUpload"
              class="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Disarankan ukuran lebar, maks 5MB</p>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 dark:border-slate-700" />

      <!-- Watermark -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Watermark Struk</h2>
        <div class="space-y-3">
          <div role="group" aria-label="Jenis watermark" class="grid grid-cols-2 gap-2">
            <button v-for="m in wmModes" :key="m.value" type="button" @click="form.wm_mode = m.value"
              :aria-pressed="form.wm_mode === m.value"
              :class="form.wm_mode === m.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'"
              class="px-3 py-2 text-xs font-medium rounded-lg border transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
              {{ m.label }}
            </button>
          </div>

          <div v-if="form.wm_mode === 'text'">
            <label for="wm-text" class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Teks watermark</label>
            <input id="wm-text" v-model="form.wm_text" type="text" placeholder="Contoh: Toko Maju Jaya…" autocomplete="off"
              class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
          </div>

          <div v-if="form.wm_mode === 'image'">
            <label for="wm-image" class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Upload gambar watermark</label>
            <div v-if="form.wm_image" class="flex items-center gap-3 mb-2">
              <img :src="form.wm_image" alt="Gambar watermark" class="h-12 rounded-lg border border-slate-200 dark:border-slate-600 object-contain bg-slate-50 dark:bg-slate-700" />
              <button @click="form.wm_image = ''" type="button" class="text-xs text-red-400 hover:text-red-600 transition">Hapus gambar</button>
            </div>
            <input id="wm-image" type="file" accept="image/*" @change="onWmImageUpload"
              class="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
          </div>

          <p v-if="form.wm_mode === 'logo' && !form.receipt_image" class="text-xs text-amber-600 dark:text-amber-400">
            Belum ada logo terpasang. Upload dulu di bagian Gambar Struk.
          </p>

          <template v-if="form.wm_mode !== 'none'">
            <div role="group" aria-label="Pola watermark" class="grid grid-cols-2 gap-2">
              <button v-for="l in wmLayouts" :key="l.value" type="button" @click="setWmLayout(l.value)"
                :aria-pressed="form.wm_layout === l.value"
                :class="form.wm_layout === l.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'"
                class="px-3 py-2 text-xs font-medium rounded-lg border transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                {{ l.label }}
              </button>
            </div>

            <div v-for="r in wmRanges" :key="r.key">
              <label :for="'wm-' + r.key" class="text-xs text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                <span>{{ r.label }}</span>
                <span class="tabular-nums">{{ form[r.key] }}{{ r.unit }}</span>
              </label>
              <input :id="'wm-' + r.key" v-model="form[r.key]" type="range" :min="r.min" :max="r.max" :step="r.step"
                class="w-full accent-emerald-600" />
            </div>

            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Preview</div>
              <!-- struk selalu putih, juga di dark mode -->
              <div class="rounded-xl border border-slate-200 dark:border-slate-600 bg-white overflow-hidden h-56 p-4 font-mono text-xs text-slate-700">
                <div style="position:relative;height:100%">
                  <ReceiptWatermark :settings="form" />
                  <div style="position:relative;z-index:1">
                    <div class="font-bold text-sm">{{ form.store_name || '(Nama Toko)' }}</div>
                    <div class="text-slate-500">{{ form.address || '(Alamat)' }}</div>
                    <div class="mt-3 flex justify-between"><span>2 x Contoh Produk A</span><span>100.000</span></div>
                    <div class="flex justify-between"><span>1 x Contoh Produk B</span><span>50.000</span></div>
                    <div class="mt-2 border-t border-slate-300 pt-1 flex justify-between font-bold"><span>Total</span><span>150.000</span></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="border-t border-slate-100 dark:border-slate-700" />

      <!-- Toggle -->
      <div>
        <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Tampilan Struk</h2>
        <label class="flex items-center gap-3 cursor-pointer">
          <div class="relative">
            <input type="checkbox" :checked="form.show_recipient === 'true'"
              @change="form.show_recipient = ($event.target as HTMLInputElement).checked ? 'true' : 'false'"
              class="sr-only" />
            <div class="w-10 h-5 rounded-full transition"
              :class="form.show_recipient === 'true' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600'">
              <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                :class="form.show_recipient === 'true' ? 'translate-x-5' : ''" />
            </div>
          </div>
          <span class="text-sm text-slate-700 dark:text-slate-300">Tampilkan info penerima di struk</span>
        </label>
      </div>

      <!-- Preview -->
      <div class="border-t border-slate-100 dark:border-slate-700 pt-4">
        <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Preview Header Struk</h2>
        <div class="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div class="font-bold text-sm">{{ form.store_name || '(Nama Toko)' }}</div>
          <div v-if="form.store_tagline" class="text-slate-400 dark:text-slate-500">{{ form.store_tagline }}</div>
          <div class="mt-1 text-slate-500 dark:text-slate-400">{{ form.address || '(Alamat)' }}</div>
          <div class="text-slate-500 dark:text-slate-400">{{ form.phone || '(Telepon)' }}</div>
          <div class="mt-3 border-t border-slate-300 dark:border-slate-600 pt-2 text-center text-slate-400 dark:text-slate-500">
            {{ form.footer_note || '' }}
          </div>
          <div class="mt-3 text-slate-400 dark:text-slate-500 text-center">{{ form.closing_text || '' }}</div>
        </div>
      </div>

      <div class="flex gap-2">
        <button @click="save" :disabled="saving"
          class="flex-1 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition flex items-center justify-center gap-2">
          <span v-if="saving">⏳ Menyimpan...</span>
          <span v-else>💾 Simpan Pengaturan</span>
        </button>
        <button @click="showPreview = true"
          class="px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-2">
          🖨️ Preview Struk
        </button>
      </div>

      <div v-if="saved" class="text-center text-sm text-emerald-600 font-medium">
        ✅ Pengaturan berhasil disimpan!
      </div>
    </div>
  </div>

  <ReceiptModal :show="showPreview" :tx="dummyTx" @close="showPreview = false" />
  <ImageEditorModal
    :show="showEditor"
    :src="editorSrc"
    @apply="(url) => { form.receipt_image = url; showEditor = false }"
    @cancel="showEditor = false"
  />
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

const editorSrc = ref('')
const showEditor = ref(false)

function onImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Gambar terlalu besar, maks 5MB'); return }
  const reader = new FileReader()
  reader.onload = () => {
    editorSrc.value = reader.result as string
    showEditor.value = true
  }
  reader.readAsDataURL(file)
  // reset input so same file can be re-uploaded
  ;(e.target as HTMLInputElement).value = ''
}
const wmModes = [
  { value: 'none', label: 'Tanpa Watermark' },
  { value: 'text', label: 'Teks' },
  { value: 'logo', label: 'Logo Saat Ini' },
  { value: 'image', label: 'Upload Gambar' },
]
const wmLayouts = [
  { value: 'single', label: 'Satu Besar di Tengah' },
  { value: 'tile', label: 'Kecil & Berulang' },
]
const wmRanges = [
  { key: 'wm_size', label: 'Ukuran', min: 20, max: 300, step: 5, unit: 'px' },
  { key: 'wm_angle', label: 'Kemiringan', min: -90, max: 90, step: 5, unit: '°' },
  { key: 'wm_opacity', label: 'Transparansi', min: 3, max: 40, step: 1, unit: '%' },
] as const

// perkecil dulu (maks 600px) supaya config tidak membengkak
function onWmImageUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('Gambar terlalu besar, maks 5MB'); return }
  const img = new Image()
  img.onload = () => {
    const k = Math.min(1, 600 / Math.max(img.width, img.height))
    const c = document.createElement('canvas')
    c.width = Math.round(img.width * k)
    c.height = Math.round(img.height * k)
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
    form.wm_image = c.toDataURL('image/png')
    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
  input.value = ''
}
// ukuran awal beda: satu besar vs pola kecil-kecil
function setWmLayout(v: string) {
  form.wm_layout = v
  form.wm_size = v === 'tile' ? '40' : '120'
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
