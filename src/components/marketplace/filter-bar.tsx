'use client'

import { ChevronDown, Check } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type RangeOption = { value: string; label: string; min?: number; max?: number }

const INDUSTRY_OPTIONS: Option[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'catering', label: 'Catering' },
]

const LOCATION_OPTIONS: Option[] = [
  { value: 'Brooklyn', label: 'Brooklyn' },
  { value: 'New York', label: 'Manhattan' },
  { value: 'Queens', label: 'Queens' },
  { value: 'NY', label: 'New York State' },
]

// Buckets in cents.
const PRICE_OPTIONS: RangeOption[] = [
  { value: 'under_500k', label: 'Under $500K', max: 50_000_000 },
  { value: '500k_1m', label: '$500K – $1M', min: 50_000_000, max: 100_000_000 },
  { value: '1m_2m', label: '$1M – $2M', min: 100_000_000, max: 200_000_000 },
  { value: '2m_plus', label: '$2M+', min: 200_000_000 },
]

const REVENUE_OPTIONS: RangeOption[] = [
  { value: 'under_500k', label: 'Under $500K', max: 50_000_000 },
  { value: '500k_1m', label: '$500K – $1M', min: 50_000_000, max: 100_000_000 },
  { value: '1m_2m', label: '$1M – $2M', min: 100_000_000, max: 200_000_000 },
  { value: '2m_plus', label: '$2M+', min: 200_000_000 },
]

// UI-only for MVP — no underlying filter wired (assets jsonb has no
// populated data in the seed). Selecting these still updates the URL so
// the picker reflects state, just without server-side filtering yet.
const ASSETS_OPTIONS: Option[] = [
  { value: 'real_estate', label: 'Real Estate Included' },
  { value: 'liquor_license', label: 'Liquor License' },
  { value: 'equipment', label: 'Equipment Included' },
  { value: 'vehicle', label: 'Vehicle Included' },
]

export function FilterBar() {
  const router = useRouter()
  const params = useSearchParams()

  const industry = readMulti(params, 'industry')
  const location = readMulti(params, 'location')
  const assets = readMulti(params, 'assets')
  const priceRange = matchRange(params, 'minPrice', 'maxPrice', PRICE_OPTIONS)
  const revenueRange = matchRange(params, 'minRevenue', 'maxRevenue', REVENUE_OPTIONS)

  const updateParams = useCallback(
    (mutator: (search: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString())
      mutator(next)
      next.delete('page') // Always reset pagination when filters change.
      const qs = next.toString()
      router.replace(qs ? `?${qs}` : '?', { scroll: false })
    },
    [params, router],
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterPopover
        label="Industry"
        options={INDUSTRY_OPTIONS}
        selected={industry}
        onChange={(values) => updateParams((p) => setMulti(p, 'industry', values))}
        multi
      />
      <FilterPopover
        label="Location"
        options={LOCATION_OPTIONS}
        selected={location}
        onChange={(values) => updateParams((p) => setMulti(p, 'location', values))}
        multi
      />
      <FilterPopover
        label="Asking Price"
        options={PRICE_OPTIONS}
        selected={priceRange ? [priceRange.value] : []}
        onChange={(values) => {
          const opt = PRICE_OPTIONS.find((o) => o.value === values[0])
          updateParams((p) => {
            setRange(p, 'minPrice', 'maxPrice', opt)
          })
        }}
      />
      <FilterPopover
        label="Annual Revenue"
        options={REVENUE_OPTIONS}
        selected={revenueRange ? [revenueRange.value] : []}
        onChange={(values) => {
          const opt = REVENUE_OPTIONS.find((o) => o.value === values[0])
          updateParams((p) => {
            setRange(p, 'minRevenue', 'maxRevenue', opt)
          })
        }}
      />
      <FilterPopover
        label="Assets & Equipments"
        options={ASSETS_OPTIONS}
        selected={assets}
        onChange={(values) => updateParams((p) => setMulti(p, 'assets', values))}
        multi
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

function FilterPopover({
  label,
  options,
  selected,
  onChange,
  multi = false,
}: {
  label: string
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  multi?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const summary = useMemo(() => {
    if (selected.length === 0) return label
    if (selected.length === 1) {
      const opt = options.find((o) => o.value === selected[0])
      return opt?.label ?? label
    }
    return `${label} (${selected.length})`
  }, [label, options, selected])

  const isActive = selected.length > 0

  function toggle(value: string) {
    if (multi) {
      onChange(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
      )
    } else {
      // Single-select behaves like a radio: re-clicking the active option clears it.
      onChange(selected[0] === value ? [] : [value])
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
          isActive
            ? 'border-brand-ink bg-brand-ink text-brand-cream'
            : 'border-brand-border bg-white text-brand-ink hover:border-brand-ink/40',
        )}
      >
        {summary}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-multiselectable={multi}
          className="absolute left-0 top-full z-30 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-brand-border bg-white shadow-xl"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.value)
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-brand-ink hover:bg-brand-cream',
                    checked && 'bg-brand-cream',
                  )}
                >
                  <span>{opt.label}</span>
                  {checked ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                </button>
              </li>
            )
          })}
          {multi && selected.length > 0 ? (
            <li className="border-t border-brand-border">
              <button
                type="button"
                onClick={() => {
                  onChange([])
                  setOpen(false)
                }}
                className="block w-full px-4 py-2.5 text-left text-xs text-brand-muted hover:bg-brand-cream"
              >
                Clear
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function readMulti(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key)
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function setMulti(params: URLSearchParams, key: string, values: string[]) {
  if (values.length === 0) params.delete(key)
  else params.set(key, values.join(','))
}

function matchRange(
  params: URLSearchParams,
  minKey: string,
  maxKey: string,
  options: RangeOption[],
): RangeOption | null {
  const min = params.get(minKey)
  const max = params.get(maxKey)
  if (!min && !max) return null
  return (
    options.find(
      (o) => String(o.min ?? '') === (min ?? '') && String(o.max ?? '') === (max ?? ''),
    ) ?? null
  )
}

function setRange(
  params: URLSearchParams,
  minKey: string,
  maxKey: string,
  opt: RangeOption | undefined,
) {
  if (!opt) {
    params.delete(minKey)
    params.delete(maxKey)
    return
  }
  if (opt.min == null) params.delete(minKey)
  else params.set(minKey, String(opt.min))
  if (opt.max == null) params.delete(maxKey)
  else params.set(maxKey, String(opt.max))
}
