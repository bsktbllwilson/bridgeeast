// Compact USD formatting from cents — "$850K", "$1.4M", "$10K".
export function formatCentsCompact(cents: number | null | undefined): string {
  if (cents == null) return '—'
  const dollars = cents / 100
  if (dollars >= 1_000_000) {
    const m = dollars / 1_000_000
    const trimmed = m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, '')
    return `$${trimmed}M`
  }
  if (dollars >= 1_000) {
    const k = Math.round(dollars / 1_000)
    return `$${k}K`
  }
  return `$${Math.round(dollars).toLocaleString('en-US')}`
}

const CUISINE_LABEL: Record<string, string> = {
  chinese: 'Chinese',
  japanese: 'Japanese',
  korean: 'Korean',
  vietnamese: 'Vietnamese',
  thai: 'Thai',
  pan_asian: 'Pan-Asian',
}

export function formatCuisine(cuisine: string | null | undefined): string | null {
  if (!cuisine) return null
  return CUISINE_LABEL[cuisine] ?? cuisine
}
