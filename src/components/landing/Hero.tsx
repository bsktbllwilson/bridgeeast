'use client'

import { ChevronDown, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function Hero() {
  const [city, setCity] = useState('')
  const [industry, setIndustry] = useState('')

  const onFind = () => {
    // Placeholder: wire to /marketplace/browse search params later.
    console.log({ city, industry })
  }

  return (
    <section className="relative px-5 pt-16 md:pt-24 pb-12 md:pb-16">
      <div className="mx-auto max-w-stage text-center">
        <h1 className="font-display text-[clamp(3rem,7vw,6.25rem)] leading-[1.1] tracking-tight text-ink">
          Your <span className="italic">Seat</span> at The Table Starts Here
        </h1>
        <p className="mt-8 mx-auto max-w-3xl font-body text-[clamp(1.125rem,1.8vw,1.875rem)] text-ink">
          First Marketplace for The $240B+ Asian F&amp;B Transition
        </p>

        {/* Search bar */}
        <div className="mt-10 mx-auto max-w-[1151px] rounded-[25px] border border-ink bg-white overflow-hidden flex flex-col md:flex-row md:items-stretch md:h-[100px]">
          <label className="flex-1 flex items-center px-7 md:px-14 py-4 text-left cursor-text border-b md:border-b-0 md:border-r border-black/10">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City, State"
              className="w-full bg-transparent outline-none font-body text-[clamp(1.125rem,1.5vw,1.875rem)] text-ink placeholder:text-ink-muted"
            />
          </label>
          <label className="flex-1 md:flex-[0_0_360px] flex items-center px-7 md:px-14 py-4 cursor-text border-b md:border-b-0 md:border-r border-black/10">
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="All Industries"
              className="w-full bg-transparent outline-none font-body text-[clamp(1.125rem,1.5vw,1.875rem)] text-ink placeholder:text-ink-muted"
            />
            <ChevronDown className="ml-2 h-4 w-4 text-ink-muted shrink-0" aria-hidden />
          </label>
          <button
            type="button"
            onClick={onFind}
            className="bg-orange hover:bg-orange-dark transition-colors text-white font-body text-[clamp(1.125rem,1.5vw,1.875rem)] font-medium px-10 md:px-12 py-5 md:py-0 md:w-[305px] flex items-center justify-center gap-3"
          >
            Find A Seat <ArrowRight className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  )
}
