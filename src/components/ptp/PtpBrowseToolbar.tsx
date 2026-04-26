'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FILTERS = [
  'Industry',
  'Location',
  'Asking Price',
  'Annual Revenue',
  'Assets & Equipments',
] as const

export function PtpBrowseToolbar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)

  return (
    <div className="ptp-container">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          // TODO: wire to /marketplace/browse?q=...
        }}
        className="flex flex-col gap-2 rounded-3xl bg-white p-3 md:flex-row md:items-center md:rounded-full md:p-2"
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Keywords"
          className="flex-1 rounded-full bg-transparent px-5 py-3 text-sm text-ptp-ink placeholder:text-ptp-ink/40 focus:outline-none"
          aria-label="Keywords"
        />
        <button type="submit" className="ptp-btn-primary justify-center text-sm md:w-auto">
          Search
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-ptp-ink/10 pb-3 md:gap-6">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ptp-ink/75 transition hover:text-ptp-ink"
          >
            {filter}
            <ChevronDown className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  )
}
