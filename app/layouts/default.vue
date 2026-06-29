<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <!-- Sidebar desktop -->
    <aside class="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 fixed inset-y-0 z-30">
      <div class="px-5 py-5 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-800 leading-tight">QUEIRELL Kasir App</div>
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
            ? 'bg-emerald-50 text-emerald-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <span class="text-base w-5 text-center">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 md:ml-56 min-w-0">
      <!-- Mobile top bar -->
      <header class="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3
                     bg-white border-b border-slate-200 shadow-sm">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="font-bold text-slate-800 text-sm">QUEIRELL Kasir App</span>
        </div>
        <span class="text-sm font-semibold text-slate-600">{{ currentLabel }}</span>
      </header>

      <main class="pb-24 md:pb-6">
        <slot />
      </main>
    </div>

    <!-- Bottom nav mobile -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex shadow-lg">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
        :class="isActive(item.to) ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'"
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

onMounted(fetchConfig)

const navItems = [
  { to: '/',        label: 'Kasir',      icon: '🧾' },
  { to: '/history', label: 'History',    icon: '📋' },
  { to: '/report',  label: 'Laporan',    icon: '📊' },
  { to: '/master',  label: 'Master Item',icon: '📦' },
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
