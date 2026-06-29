export interface StoreConfig {
  store_name: string
  store_tagline: string
  address: string
  phone: string
  closing_text: string
  greeting_text: string
  show_recipient: string // 'true' | 'false'
  receipt_image: string  // base64 data URL
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
