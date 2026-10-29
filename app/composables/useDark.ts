export const useDark = () => {
  const isDark = useState('dark', () => false)

  onMounted(() => {
    const stored = localStorage.getItem('dark')
    const val = stored === 'true'
    isDark.value = val
    document.documentElement.classList.toggle('dark', val)
  })

  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('dark', String(isDark.value))
  }

  return { isDark, toggle }
}
