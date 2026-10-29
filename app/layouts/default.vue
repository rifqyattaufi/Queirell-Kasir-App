<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
    <!-- Sidebar desktop -->
    <aside class="hidden md:flex flex-col w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed inset-y-0 z-30">
      <div class="px-5 py-5 border-b border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">QUEIRELL Kasir App</div>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-3 space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
          :class="isActive(item.to)
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'"
        >
          <span class="text-base w-5 text-center">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Dark mode toggle -->
      <div class="p-3 border-t border-slate-100 dark:border-slate-700 flex justify-start">
        <button @click="toggle"
          class="p-2 rounded-lg text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          {{ isDark ? '🌙' : '☀️' }}
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 md:ml-56 min-w-0">
      <!-- Mobile top bar -->
      <header class="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3
                     bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">QUEIRELL Kasir App</span>
        </div>
        <button @click="toggle" class="text-xl p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          {{ isDark ? '🌙' : '☀️' }}
        </button>
      </header>

      <main class="pb-24 md:pb-6">
        <slot />
      </main>
    </div>

    <!-- Bottom nav mobile -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-30 flex shadow-lg">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
        :class="isActive(item.to) ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
      >
        <span class="text-xl leading-none">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchConfig } = useConfig()
const { isDark, toggle } = useDark()

onMounted(fetchConfig)

const navItems = [
  { to: '/',        label: 'Kasir',      icon: '🧾' },
  { to: '/history', label: 'History',    icon: '📋' },
  { to: '/report',  label: 'Laporan',    icon: '📊' },
  { to: '/master',  label: 'Master Data', icon: '📦' },
  { to: '/config',  label: 'Pengaturan', icon: '⚙️' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const currentLabel = computed(() =>
  navItems.find(n => isActive(n.to))?.label ?? ''
)
</script>
