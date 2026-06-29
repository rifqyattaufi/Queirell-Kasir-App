export function useFormat() {
  function formatRp(value: number | string | null): string {
    const n = Number(value ?? 0)
    return 'Rp' + n.toLocaleString('id-ID')
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function formatMonth(ym: string): string {
    const [year, month] = ym.split('-')
    const names = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${names[parseInt(month)]} ${year}`
  }

  return { formatRp, formatDate, formatDateTime, formatMonth }
}
