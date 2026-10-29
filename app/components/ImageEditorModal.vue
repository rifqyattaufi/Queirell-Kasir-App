<template>
  <Teleport to="body">
    <div v-if="show"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden"
        style="max-height:92vh">

        <!-- Header + Tabs -->
        <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <h2 class="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3">Edit Gambar</h2>
          <div class="flex gap-2">
            <button @click="setTab('crop')"
              :class="activeTab==='crop' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
              class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition">
              ✂️ Pangkas & Putar
            </button>
            <button @click="setTab('bg')"
              :class="activeTab==='bg' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
              class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition">
              🪄 Hapus Background
            </button>
          </div>
        </div>

        <!-- Crop Tab -->
        <div v-show="activeTab === 'crop'" class="flex flex-col flex-1 min-h-0">
          <div class="bg-slate-900 flex-1 min-h-0 overflow-hidden" style="max-height:320px">
            <img ref="cropImgEl" :src="src" style="display:block;max-width:100%;opacity:0" />
          </div>

          <div class="px-5 py-4 space-y-3 shrink-0">
            <!-- Rotate -->
            <div>
              <div class="flex justify-between mb-1">
                <label class="text-xs text-slate-500 dark:text-slate-400">Putar</label>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ rotAngle }}°</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="rotateTo(rotAngle - 90)"
                  class="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  ↺ 90°
                </button>
                <input type="range" :value="rotAngle" min="-180" max="180"
                  class="flex-1 accent-emerald-500"
                  @input="(e) => rotateTo(Number((e.target as HTMLInputElement).value))" />
                <button @click="rotateTo(rotAngle + 90)"
                  class="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  90° ↻
                </button>
              </div>
            </div>

            <!-- Flip + Aspect -->
            <div class="flex gap-2 items-center">
              <button @click="doFlipH"
                class="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                ⇄ Balik H
              </button>
              <button @click="doFlipV"
                class="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                ⇅ Balik V
              </button>
              <select v-model="cropAspect" @change="onAspectChange"
                class="ml-auto text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <option value="free">Bebas</option>
                <option value="1">1:1</option>
                <option value="1.3333">4:3</option>
                <option value="1.7778">16:9</option>
              </select>
            </div>
          </div>
        </div>

        <!-- BG Removal Tab -->
        <div v-show="activeTab === 'bg'" class="flex flex-col flex-1 min-h-0">
          <!-- Checkerboard canvas preview -->
          <div class="flex-1 min-h-0 flex items-center justify-center overflow-hidden"
            style="background:repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%) 0 0/16px 16px;max-height:320px">
            <div v-if="bgLoading" class="text-white text-sm flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses...
            </div>
            <canvas v-show="!bgLoading" ref="bgCanvasEl"
              style="max-width:100%;max-height:100%;display:block;cursor:crosshair"
              @click="onCanvasClick" />
          </div>

          <div class="px-5 py-4 space-y-3 shrink-0">
            <p class="text-xs text-slate-400 dark:text-slate-500">Klik pada area background di gambar untuk memilih warna, atau gunakan Deteksi Otomatis.</p>

            <div class="flex gap-2 items-center flex-wrap">
              <button @click="autoDetect"
                class="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold">
                🎯 Deteksi Otomatis
              </button>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500 dark:text-slate-400">Warna BG:</span>
                <div class="w-7 h-7 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer shadow-sm"
                  :style="{ background: bgColorHex }"
                  @click="colorPickerEl?.click()" />
                <input ref="colorPickerEl" type="color" :value="bgColorHex"
                  class="sr-only" @input="onColorPick" />
              </div>
              <button @click="resetBg"
                class="ml-auto px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Reset
              </button>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <label class="text-xs text-slate-500 dark:text-slate-400">Toleransi</label>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ bgTolerance }}</span>
              </div>
              <input type="range" v-model.number="bgTolerance" min="0" max="150"
                class="w-full accent-emerald-500" @input="applyBgRemoval" />
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <label class="text-xs text-slate-500 dark:text-slate-400">Kelembutan tepi</label>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ bgSoftness }}</span>
              </div>
              <input type="range" v-model.number="bgSoftness" min="0" max="60"
                class="w-full accent-emerald-500" @input="applyBgRemoval" />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex gap-2 shrink-0">
          <button @click="cancel"
            class="px-5 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            Batal
          </button>
          <button @click="applyResult"
            class="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">
            ✓ Terapkan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type CropperType from 'cropperjs'

const props = defineProps<{ show: boolean; src: string }>()
const emit = defineEmits<{ apply: [dataUrl: string]; cancel: [] }>()

const activeTab = ref<'crop' | 'bg'>('crop')
const cropImgEl = ref<HTMLImageElement | null>(null)
const bgCanvasEl = ref<HTMLCanvasElement | null>(null)
const colorPickerEl = ref<HTMLInputElement | null>(null)
const bgLoading = ref(false)

let cropper: CropperType | null = null
const rotAngle = ref(0)
const flipX = ref(1)
const flipY = ref(1)
const cropAspect = ref('free')

// BG state
const bgColorHex = ref('#ffffff')
const bgTolerance = ref(30)
const bgSoftness = ref(15)
let origImageData: ImageData | null = null
// Canvas captured from crop step to feed into bg removal
let cropResultCanvas: HTMLCanvasElement | null = null

// ── Lifecycle ──

watch(() => props.show, async (val) => {
  if (val) {
    // Reset state
    activeTab.value = 'crop'
    rotAngle.value = 0
    flipX.value = 1
    flipY.value = 1
    cropAspect.value = 'free'
    bgTolerance.value = 30
    bgSoftness.value = 15
    bgColorHex.value = '#ffffff'
    origImageData = null
    cropResultCanvas = null
    await nextTick()
    initCropper()
  } else {
    destroyCropper()
  }
}, { immediate: false })

onUnmounted(destroyCropper)

// ── Cropper ──

async function initCropper() {
  if (!cropImgEl.value) return
  destroyCropper()
  const Cropper = (await import('cropperjs')).default
  const savedRot = rotAngle.value
  const savedFX = flipX.value
  const savedFY = flipY.value
  cropper = new Cropper(cropImgEl.value, {
    viewMode: 1,
    autoCropArea: 1,
    background: true,
    ready() {
      cropper?.rotateTo(savedRot)
      if (savedFX !== 1) cropper?.scaleX(savedFX)
      if (savedFY !== 1) cropper?.scaleY(savedFY)
    },
  })
}

function destroyCropper() {
  if (cropper) { cropper.destroy(); cropper = null }
}

function rotateTo(angle: number) {
  rotAngle.value = Math.max(-180, Math.min(180, angle))
  cropper?.rotateTo(rotAngle.value)
}

function doFlipH() {
  flipX.value *= -1
  cropper?.scaleX(flipX.value)
}

function doFlipV() {
  flipY.value *= -1
  cropper?.scaleY(flipY.value)
}

function onAspectChange() {
  const v = parseFloat(cropAspect.value)
  cropper?.setAspectRatio(isNaN(v) ? NaN : v)
}

function getCroppedCanvas(): HTMLCanvasElement {
  if (cropper) return cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' })
  if (cropResultCanvas) return cropResultCanvas
  // fallback: draw original
  const img = new Image()
  img.src = props.src
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 400
  c.height = img.naturalHeight || 400
  c.getContext('2d')!.drawImage(img, 0, 0)
  return c
}

// ── Tab Switch ──

async function setTab(tab: 'crop' | 'bg') {
  if (tab === 'crop') {
    activeTab.value = 'crop'
    await nextTick()
    initCropper()
  } else {
    // Capture crop result before destroying cropper
    cropResultCanvas = getCroppedCanvas()
    destroyCropper()
    activeTab.value = 'bg'
    bgLoading.value = true
    await nextTick()
    await initBgCanvas()
    bgLoading.value = false
  }
}

// ── BG Removal ──

async function initBgCanvas() {
  if (!bgCanvasEl.value || !cropResultCanvas) return
  const canvas = bgCanvasEl.value
  canvas.width = cropResultCanvas.width
  canvas.height = cropResultCanvas.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(cropResultCanvas, 0, 0)
  origImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function autoDetect() {
  if (!origImageData || !bgCanvasEl.value) return
  const d = origImageData.data
  const w = bgCanvasEl.value.width
  const h = bgCanvasEl.value.height
  // Sample edges: top row, bottom row, left col, right col
  let r = 0, g = 0, b = 0, n = 0
  const sampleEdge = (x: number, y: number) => {
    const i = (y * w + x) * 4
    r += d[i]; g += d[i+1]; b += d[i+2]; n++
  }
  const step = Math.max(1, Math.floor(Math.min(w, h) / 20))
  for (let x = 0; x < w; x += step) { sampleEdge(x, 0); sampleEdge(x, h-1) }
  for (let y = 0; y < h; y += step) { sampleEdge(0, y); sampleEdge(w-1, y) }
  bgColorHex.value = toHex(Math.round(r/n), Math.round(g/n), Math.round(b/n))
  applyBgRemoval()
}

function onCanvasClick(e: MouseEvent) {
  if (!bgCanvasEl.value || !origImageData) return
  const rect = bgCanvasEl.value.getBoundingClientRect()
  const sx = bgCanvasEl.value.width / rect.width
  const sy = bgCanvasEl.value.height / rect.height
  const x = Math.min(bgCanvasEl.value.width - 1, Math.floor((e.clientX - rect.left) * sx))
  const y = Math.min(bgCanvasEl.value.height - 1, Math.floor((e.clientY - rect.top) * sy))
  const i = (y * bgCanvasEl.value.width + x) * 4
  const d = origImageData.data
  bgColorHex.value = toHex(d[i], d[i+1], d[i+2])
  applyBgRemoval()
}

function onColorPick(e: Event) {
  bgColorHex.value = (e.target as HTMLInputElement).value
  applyBgRemoval()
}

function applyBgRemoval() {
  if (!bgCanvasEl.value || !origImageData) return
  const canvas = bgCanvasEl.value
  const ctx = canvas.getContext('2d')!
  const result = new ImageData(
    new Uint8ClampedArray(origImageData.data),
    origImageData.width,
    origImageData.height,
  )
  const [tr, tg, tb] = hexToRgb(bgColorHex.value)
  const tol = bgTolerance.value
  const soft = bgSoftness.value
  const d = result.data
  for (let i = 0; i < d.length; i += 4) {
    const dist = Math.sqrt((d[i]-tr)**2 + (d[i+1]-tg)**2 + (d[i+2]-tb)**2)
    if (dist <= tol) {
      d[i+3] = 0
    } else if (soft > 0 && dist <= tol + soft) {
      d[i+3] = Math.round(((dist - tol) / soft) * d[i+3])
    }
  }
  ctx.putImageData(result, 0, 0)
}

function resetBg() {
  if (!bgCanvasEl.value || !origImageData) return
  bgCanvasEl.value.getContext('2d')!.putImageData(origImageData, 0, 0)
}

// ── Apply / Cancel ──

function applyResult() {
  let canvas: HTMLCanvasElement
  if (activeTab.value === 'bg' && bgCanvasEl.value) {
    canvas = bgCanvasEl.value
  } else {
    canvas = getCroppedCanvas()
  }
  emit('apply', canvas.toDataURL('image/png'))
  destroyCropper()
}

function cancel() {
  destroyCropper()
  emit('cancel')
}

// ── Utils ──

function toHex(r: number, g: number, b: number) {
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1,3), 16),
    parseInt(hex.slice(3,5), 16),
    parseInt(hex.slice(5,7), 16),
  ]
}
</script>
