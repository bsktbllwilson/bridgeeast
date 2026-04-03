'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b-2 border-gray-200 sticky top-0 bg-white z-50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="text-2xl font-serif font-bold text-accent">
          BridgeEast
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-12">
          <Link href="/data" className="text-gray-700 hover:text-accent transition-colors font-medium">
            Market Data
          </Link>
          <Link href="/guides" className="text-gray-700 hover:text-accent transition-colors font-medium">
            Guides
          </Link>
          <Link href="/partners" className="text-gray-700 hover:text-accent transition-colors font-medium">
            Partners
          </Link>
          <Link href="/waitlist" className="btn-primary">
            Waitlist
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-8"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="h-1 w-full bg-accent rounded" />
          <span className="h-1 w-full bg-accent rounded" />
          <span className="h-1 w-full bg-accent rounded" />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b-2 border-gray-200 md:hidden p-4 space-y-4">
            <Link href="/data" className="block text-gray-700 hover:text-accent font-medium">
              Market Data
            </Link>
            <Link href="/guides" className="block text-gray-700 hover:text-accent font-medium">
              Guides
            </Link>
            <Link href="/partners" className="block text-gray-700 hover:text-accent font-medium">
              Partners
            </Link>
            <Link href="/waitlist" className="block btn-primary text-center">
              Waitlist
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
