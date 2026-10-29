export default defineNuxtPlugin(() => {
  const stored = localStorage.getItem('dark')
  const isDark = stored === 'true'
  if (isDark) document.documentElement.classList.add('dark')
})
