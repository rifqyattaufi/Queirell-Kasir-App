<template>
  <div class="p-4 md:p-6 max-w-3xl mx-auto">
    <div class="mb-5">
      <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Laporan Pemasukan</h1>
      <p class="text-sm text-slate-400 dark:text-slate-500">Rekap per bulan</p>
    </div>

    <div v-if="pending" class="text-center text-slate-400 dark:text-slate-500 py-12 text-sm flex items-center justify-center gap-2">
      <div class="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
      Memuat laporan...
    </div>

    <div v-else-if="!report?.length"
      class="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-14 text-center">
      <div class="text-3xl mb-2 opacity-40">📊</div>
      <div class="text-sm text-slate-400 dark:text-slate-500">Belum ada data transaksi</div>
    </div>

    <div v-else class="space-y-3">
      <!-- Summary card -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="bg-emerald-600 text-white rounded-2xl p-4">
          <div class="text-xs font-semibold text-emerald-100 mb-1">Total Semua Transaksi</div>
          <div class="text-2xl font-bold">{{ formatRp(grandTotal) }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">Total Transaksi</div>
          <div class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ grandCount }}</div>
          <div class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">transaksi</div>
        </div>
      </div>

      <!-- Monthly rows -->
      <div v-for="row in report" :key="row.month"
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition-all">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-slate-800 dark:text-slate-100">{{ formatMonth(row.month) }}</div>
            <div class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ row.count }} transaksi</div>
          </div>
          <div class="text-right">
            <div class="font-bold text-emerald-600 text-lg">{{ formatRp(row.total) }}</div>
            <div class="text-xs text-slate-400 dark:text-slate-500">Bayar masuk: {{ formatRp(row.paid) }}</div>
          </div>
        </div>

        <!-- Progress bar relative to max month -->
        <div class="mt-3 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: `${(Number(row.total) / maxTotal) * 100}%` }" />
        </div>

        <NuxtLink :to="`/history?month=${row.month}`"
          class="mt-2 inline-block text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
          Lihat transaksi bulan ini →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { formatRp, formatMonth } = useFormat()

const { data: report, pending } = await useFetch<any[]>('/api/report')

const grandTotal = computed(() =>
  (report.value ?? []).reduce((s, r) => s + Number(r.total), 0)
)
const grandCount = computed(() =>
  (report.value ?? []).reduce((s, r) => s + Number(r.count), 0)
)
const maxTotal = computed(() =>
  Math.max(...(report.value ?? []).map(r => Number(r.total)), 1)
)
</script>
