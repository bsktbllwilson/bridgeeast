'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

const INDUSTRIES = [
  'All Industries',
  'Bakery',
  'Bubble Tea',
  'Ghost Kitchen',
  'Izakaya',
  'Ramen',
  'Restaurant',
  'Sushi',
]

export function ListingHotspots() {
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState(INDUSTRIES[0])

  return (
    <div className="mt-6">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-3 rounded-3xl bg-white p-3 md:flex-row md:items-center md:gap-2 md:rounded-full"
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="City, State"
          className="flex-1 rounded-full bg-transparent px-4 py-3 text-sm text-ptp-ink placeholder:text-ptp-ink/40 focus:outline-none"
          aria-label="City, State"
        />
        <select
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          className="rounded-full border-0 bg-transparent px-4 py-3 text-sm text-ptp-ink focus:outline-none"
          aria-label="Industry"
        >
          {INDUSTRIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button type="submit" className="ptp-btn-primary text-sm">
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      <div className="mt-4 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ptp-cream md:aspect-[16/7]">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1800&q=80"
          alt="Map placeholder showing listing hotspots"
          className="h-full w-full object-cover opacity-90"
        />
      </div>
    </div>
  )
}
