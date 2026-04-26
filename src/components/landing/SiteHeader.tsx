'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV = [
  { href: '/marketplace/browse', label: 'Buy Business' },
  { href: '/marketplace/listings/new', label: 'Sell Business' },
  { href: '/playbook', label: 'Playbooks' },
  { href: '/about', label: 'Who We Are' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-30 px-3 pt-3 md:px-5 md:pt-5">
      <div className="relative mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between rounded-pill bg-orange-deep px-6 md:h-[88px] md:px-10">
        {/* Mobile: logo left + hamburger right */}
        <Link href="/" className="md:hidden flex items-center" aria-label="Pass The Plate home">
          <Image
            src="/assets/logo-passtheplate.png"
            alt="Pass The Plate"
            width={220}
            height={28}
            className="h-7 w-auto brightness-0 invert"
            priority
          />
        </Link>

        {/* Desktop: 2 links left, centered logo, 2 links right */}
        <nav className="hidden md:flex items-center gap-10 text-cream font-body">
          {NAV.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[20px] font-medium tracking-tight hover:opacity-80 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-label="Pass The Plate home"
        >
          <Image
            src="/assets/logo-passtheplate.png"
            alt="Pass The Plate"
            width={330}
            height={45}
            className="h-10 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-cream font-body">
          {NAV.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[20px] font-medium tracking-tight hover:opacity-80 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden text-cream p-2 -mr-2"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden mt-2 mx-auto w-full max-w-[1500px] rounded-card bg-orange-deep text-cream px-6 py-5 space-y-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-[20px] font-medium font-body py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
