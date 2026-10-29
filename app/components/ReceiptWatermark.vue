<template>
  <!-- Semua style inline: struk dicetak lewat innerHTML & html2canvas, class tailwind tidak ikut -->
  <div
    v-if="content"
    aria-hidden="true"
    :style="`position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:0;opacity:${opacity}`"
  >
    <div v-if="s.wm_layout === 'tile' && tile" :style="tileStyle" />
    <div v-else style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center">
      <img v-if="isImage" :src="content" alt=""
        :style="`width:${size}px;max-width:100%;height:auto;transform:rotate(${angle}deg)`" />
      <span v-else
        :style="`font:bold ${size}px/1 Arial,sans-serif;white-space:nowrap;color:#000;transform:rotate(${angle}deg)`">{{ content }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoreConfig } from '~/composables/useConfig'

// settings: override untuk preview live di halaman pengaturan; default = config tersimpan
const props = defineProps<{ settings?: Partial<StoreConfig> }>()
const { config } = useConfig()
const s = computed(() => ({ ...config.value, ...props.settings }))

const isImage = computed(() => s.value.wm_mode === 'logo' || s.value.wm_mode === 'image')
const content = computed(() => {
  const m = s.value.wm_mode
  if (m === 'text') return s.value.wm_text.trim()
  if (m === 'logo') return s.value.receipt_image
  if (m === 'image') return s.value.wm_image
  return ''
})
const size = computed(() => Math.min(400, Math.max(10, Number(s.value.wm_size) || 120)))
const angle = computed(() => Number(s.value.wm_angle) || 0)
const opacity = computed(() => Math.min(60, Math.max(3, Number(s.value.wm_opacity) || 12)) / 100)

const esc = (t: string) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

// 1 sel pola sebagai SVG; rotasi dipasang di luar sel supaya pola tetap menyambung
const tile = computed(() => {
  if (!content.value) return null
  const n = size.value
  let w: number, h: number, body: string
  if (isImage.value) {
    w = h = n * 1.8
    body = `<image href="${content.value}" x="${(w - n) / 2}" y="${(h - n) / 2}" width="${n}" height="${n}" preserveAspectRatio="xMidYMid meet"/>`
  } else {
    w = Math.max(n, content.value.length * n * 0.6) + n
    h = n * 2.2
    body = `<text x="${w / 2}" y="${h / 2}" font-family="Arial,sans-serif" font-weight="bold" font-size="${n}" text-anchor="middle" dominant-baseline="central" fill="#000">${esc(content.value)}</text>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`
  return { url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), w, h }
})

// ponytail: kotak 300% x 300% dari struk cukup untuk struk normal; struk sangat panjang + miring ekstrem bisa menyisakan tepi kosong
const tileStyle = computed(() =>
  `position:absolute;left:-100%;top:-100%;width:300%;height:300%;transform:rotate(${angle.value}deg);` +
  `background-image:url("${tile.value!.url}");background-size:${tile.value!.w}px ${tile.value!.h}px;background-repeat:repeat`)
</script>
