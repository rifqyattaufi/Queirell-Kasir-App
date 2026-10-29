// Render struk (#receipt-preview) -> JPG / PDF -> Web Share API (fallback: download)
export const useShareReceipt = () => {
  const sharing = ref<'' | 'jpg' | 'pdf'>('')

  async function renderJpeg(el: HTMLElement) {
    // clone di luar layar supaya seluruh struk ikut (elemen asli bisa ter-scroll/terpotong)
    const clone = el.cloneNode(true) as HTMLElement
    Object.assign(clone.style, {
      position: 'fixed', left: '-10000px', top: '0',
      width: `${el.clientWidth}px`, height: 'auto', maxHeight: 'none', overflow: 'visible',
    })
    document.body.appendChild(clone)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(clone, { backgroundColor: '#ffffff', scale: 2 })
      const bytes = Uint8Array.from(atob(canvas.toDataURL('image/jpeg', 0.92).split(',')[1]), c => c.charCodeAt(0))
      return { bytes, w: canvas.width, h: canvas.height }
    } finally {
      clone.remove()
    }
  }

  // PDF 1 halaman berisi 1 gambar JPEG, ukuran halaman = ukuran struk
  function jpegToPdf({ bytes, w, h }: { bytes: Uint8Array; w: number; h: number }) {
    const enc = new TextEncoder()
    const pw = Math.round(w / 2 * 0.75), ph = Math.round(h / 2 * 0.75)
    const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`
    const parts: Uint8Array[] = []
    const offsets: number[] = []
    let len = 0
    const push = (p: Uint8Array | string) => {
      const b = typeof p === 'string' ? enc.encode(p) : p
      parts.push(b); len += b.length
    }
    push('%PDF-1.4\n')
    const obj = (n: number, body: string, stream?: Uint8Array) => {
      offsets[n] = len
      push(`${n} 0 obj\n${body}`)
      if (stream) { push('\nstream\n'); push(stream); push('\nendstream') }
      push('\nendobj\n')
    }
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>')
    obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
    obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`)
    obj(4, `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>`, bytes)
    obj(5, `<< /Length ${content.length} >>`, enc.encode(content))
    const xref = len
    push(`xref\n0 6\n0000000000 65535 f \n${[1, 2, 3, 4, 5].map(n => String(offsets[n]).padStart(10, '0') + ' 00000 n \n').join('')}`)
    push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`)
    const out = new Uint8Array(len)
    let pos = 0
    for (const p of parts) { out.set(p, pos); pos += p.length }
    return out
  }

  async function share(kind: 'jpg' | 'pdf', name: string) {
    const el = document.getElementById('receipt-preview')
    if (!el || sharing.value) return
    sharing.value = kind
    try {
      const img = await renderJpeg(el)
      const type = kind === 'jpg' ? 'image/jpeg' : 'application/pdf'
      const file = new File([kind === 'jpg' ? img.bytes : jpegToPdf(img)], `${name}.${kind}`, { type })
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: name }) }
        catch (e: any) { if (e?.name !== 'AbortError') throw e }
      } else {
        // ponytail: browser tanpa share file (mis. Firefox desktop) -> download biasa
        const a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = file.name
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      }
    } catch (e) {
      console.error(e)
      alert('Gagal menyiapkan struk. Coba lagi.')
    } finally {
      sharing.value = ''
    }
  }

  return { sharing, share }
}
