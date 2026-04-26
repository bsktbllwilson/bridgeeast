'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

import type { Faq } from '@/data/faqs'
import { cn } from '@/lib/utils'

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const groupId = useId()

  return (
    <ul className="divide-y divide-brand-border border-y border-brand-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `${groupId}-panel-${i}`
        const buttonId = `${groupId}-button-${i}`
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={cn(
                  'flex w-full items-center justify-between gap-6 py-6 text-left transition-colors',
                  'hover:text-brand-orange',
                )}
              >
                <span className="font-display text-xl text-brand-ink md:text-2xl">{item.q}</span>
                <ChevronDown
                  className={cn(
                    'h-6 w-6 shrink-0 text-brand-ink transition-transform',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6 pr-12 text-base leading-relaxed text-brand-body"
            >
              {item.a}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
