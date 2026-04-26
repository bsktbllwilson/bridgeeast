'use client'

import { useState } from 'react'
import type { Faq } from '@/data/faqs'

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="max-w-3xl mx-auto divide-y divide-black/10 border-t border-b border-black/10">
      {items.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
              className="w-full flex items-center justify-between gap-6 py-6 text-left hover:text-accent transition-colors"
            >
              <span className="font-display text-lg md:text-xl font-bold pr-2">
                {item.question}
              </span>
              <span
                className={`shrink-0 w-9 h-9 rounded-full border border-black/15 flex items-center justify-center text-xl transition-transform ${
                  open ? 'rotate-45' : ''
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open && (
              <p className="pb-6 -mt-2 text-gray-700 leading-relaxed max-w-2xl">{item.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
