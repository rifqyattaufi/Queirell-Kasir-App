export interface StoreConfig {
  store_name: string
  store_tagline: string
  address: string
  phone: string
  closing_text: string
  greeting_text: string
  show_recipient: string // 'true' | 'false'
  receipt_image: string  // base64 data URL
  // watermark struk (semua string karena disimpan di store_config)
  wm_mode: string        // 'none' | 'text' | 'logo' | 'image'
  wm_layout: string      // 'single' | 'tile'
  wm_text: string
  wm_image: string       // base64 data URL
  wm_size: string        // px
  wm_angle: string       // derajat
  wm_opacity: string     // persen
}

const _config = ref<StoreConfig>({
  store_name: '',
  store_tagline: '',
  address: '',
  phone: '',
  closing_text: '',
  greeting_text: '',
  show_recipient: 'true',
  receipt_image: '',
  wm_mode: 'none',
  wm_layout: 'single',
  wm_text: '',
  wm_image: '',
  wm_size: '120',
  wm_angle: '-30',
  wm_opacity: '12',
})

const _loaded = ref(false)

export function useConfig() {
  async function fetchConfig() {
    if (_loaded.value) return
    const data = await $fetch<StoreConfig>('/api/config')
    _config.value = { ..._config.value, ...data }
    _loaded.value = true
  }

  async function saveConfig(data: Partial<StoreConfig>) {
    await $fetch('/api/config', { method: 'PUT', body: data })
    _config.value = { ..._config.value, ...data }
  }

  return { config: readonly(_config), fetchConfig, saveConfig }
}
