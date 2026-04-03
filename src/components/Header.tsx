'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
      <div className="container flex items-center justify-between h-18 md:h-20">
        <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-gray-950 hover:text-accent transition-colors">
          BridgeEast
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10 lg:gap-14">
          <Link href="/data" className="text-gray-600 hover:text-accent transition-colors font-medium text-sm">
            Market Data
          </Link>
          <Link href="/guides" className="text-gray-600 hover:text-accent transition-colors font-medium text-sm">
            Guides
          </Link>
          <Link href="/partners" className="text-gray-600 hover:text-accent transition-colors font-medium text-sm">
            Partners
          </Link>
          <Link href="/waitlist" className="btn-primary text-sm">
            Join Waitlist
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-7"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-18 left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg">
            <div className="container py-4 space-y-3 flex flex-col">
              <Link href="/data" className="block text-gray-600 hover:text-accent font-medium py-2 transition-colors">
                Market Data
              </Link>
              <Link href="/guides" className="block text-gray-600 hover:text-accent font-medium py-2 transition-colors">
                Guides
              </Link>
              <Link href="/partners" className="block text-gray-600 hover:text-accent font-medium py-2 transition-colors">
                Partners
              </Link>
              <Link href="/waitlist" className="btn-primary text-center py-2.5">
                Join Waitlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
