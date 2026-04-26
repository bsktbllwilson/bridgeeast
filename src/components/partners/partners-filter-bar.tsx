'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
] as const

const SPECIALTY_OPTIONS = [
  { value: '', label: 'All Industries' },
  { value: 'sba_lender', label: 'SBA Lender' },
  { value: 'immigration_attorney', label: 'Immigration Attorney' },
  { value: 'bilingual_broker', label: 'Bilingual Broker' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'insurance', label: 'Insurance' },
] as const

export function PartnersFilterBar() {
  const router = useRouter()
  const params = useSearchParams()
  const sort = params.get('sort') ?? 'featured'
  const specialty = params.get('specialty') ?? ''

  const setParam = useCallback(
    (key: 'sort' | 'specialty', value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value && value !== (key === 'sort' ? 'featured' : '')) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      const qs = next.toString()
      router.replace(qs ? `?${qs}` : '?', { scroll: false })
    },
    [params, router],
  )

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Featured first'
  const specialtyLabel =
    SPECIALTY_OPTIONS.find((o) => o.value === specialty)?.label ?? 'All Industries'

  return (
    <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-3">
      <Dropdown
        labelPrefix="Sort By"
        currentLabel={sortLabel}
        options={SORT_OPTIONS}
        value={sort}
        onChange={(v) => setParam('sort', v)}
        align="start"
      />

      <h1 className="order-first col-span-2 text-center font-display text-3xl text-brand-ink sm:order-none sm:col-span-1 md:text-5xl lg:text-[64px]">
        The Yellow Pages
      </h1>

      <Dropdown
        labelPrefix="Filter By"
        currentLabel={specialtyLabel}
        options={SPECIALTY_OPTIONS}
        value={specialty}
        onChange={(v) => setParam('specialty', v)}
        align="end"
      />
    </div>
  )
}

function Dropdown({
  labelPrefix,
  currentLabel,
  options,
  value,
  onChange,
  align,
}: {
  labelPrefix: string
  currentLabel: string
  options: readonly { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  align: 'start' | 'end'
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

  return (
    <div ref={ref} className={cn('relative', align === 'end' && 'justify-self-end')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-ink"
      >
        <span className="text-brand-ink/70">{labelPrefix}:</span>
        <span>{currentLabel}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className={cn(
            'absolute top-full z-30 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-brand-border bg-white shadow-xl',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'block w-full px-4 py-2.5 text-left text-sm text-brand-ink hover:bg-brand-cream',
                  value === opt.value && 'bg-brand-cream',
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
