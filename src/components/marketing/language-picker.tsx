'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { ChevronDown } from 'lucide-react'

import { setLocaleCookie } from '@/app/actions'
import { LOCALE_LABELS, LOCALES, type Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'

export function LanguagePicker({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
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

  function pick(locale: Locale) {
    setOpen(false)
    startTransition(() => {
      setLocaleCookie(locale)
    })
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-brand-cream/20 bg-transparent px-4 py-2 text-sm text-brand-cream',
          'hover:border-brand-cream/40',
          'disabled:opacity-60',
        )}
      >
        {LOCALE_LABELS[current]}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 mb-2 min-w-[160px] overflow-hidden rounded-2xl border border-brand-ink/40 bg-brand-ink text-brand-cream shadow-xl"
        >
          {LOCALES.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === current}
                onClick={() => pick(code)}
                className={cn(
                  'block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-cream/10',
                  code === current && 'bg-brand-cream/5',
                )}
              >
                {LOCALE_LABELS[code]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
