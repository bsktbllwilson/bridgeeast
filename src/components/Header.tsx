'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import {
  getLocaleFromPathname,
  getOppositeLocale,
  localeLabels,
  localizePath,
} from '@/i18n/locales'
import { getStaticMessages } from '@/i18n/static-messages'
import { UserMenu } from '@/components/UserMenu'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productsRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const alternateLocale = getOppositeLocale(locale)
  const messages = getStaticMessages(locale)
  const homeHref = localizePath('/listings', locale)
  const isInMarketplace = (pathname ?? '').includes('/marketplace')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${alternateLocale}; path=/; max-age=31536000; samesite=lax`
  }

  const productOptions = [
    {
      href: '/listings',
      label: messages.nav.productBridgeEast,
      tagline: messages.nav.productBridgeEastTagline,
    },
    {
      href: '/marketplace',
      label: messages.nav.productPassThePlate,
      tagline: messages.nav.productPassThePlateTagline,
    },
  ]

  const bridgeEastLinks = [
    { href: '/data', label: messages.nav.marketData },
    { href: '/listings', label: messages.nav.listings },
    { href: '/guides', label: messages.nav.guides },
    { href: '/partners', label: messages.nav.partners },
  ]

  const marketplaceLinks = [
    { href: '/marketplace/browse', label: messages.marketplace.nav.browse },
    { href: '/marketplace/listings/new', label: messages.marketplace.nav.sell },
    { href: '/marketplace/buyers', label: messages.marketplace.nav.buyers },
    { href: '/marketplace/inbox', label: messages.marketplace.nav.inbox },
    { href: '/marketplace/saved', label: messages.marketplace.nav.saved },
  ]

  const navLinks = isInMarketplace ? marketplaceLinks : bridgeEastLinks

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
      <div className="container flex items-center justify-between h-18 md:h-20">
        <Link href={homeHref} className="text-2xl md:text-3xl font-serif font-bold text-gray-950 hover:text-accent transition-colors">
          {isInMarketplace ? messages.marketplace.brand : 'BridgeEast'}
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <div ref={productsRef} className="relative">
            <button
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={productsOpen}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-accent transition-colors font-medium text-sm"
            >
              {messages.nav.products}
              <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {productOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={localizePath(option.href, locale)}
                    onClick={() => setProductsOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-accent/5"
                  >
                    <p className="text-sm font-semibold text-gray-950">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.tagline}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={localizePath(link.href, locale)}
              className="text-gray-600 hover:text-accent transition-colors font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}

          {!isInMarketplace && (
            <Link href={localizePath('/waitlist', locale)} className="btn-primary text-sm">
              {messages.nav.waitlist}
            </Link>
          )}

          <Link
            href={localizePath(pathname, alternateLocale)}
            onClick={handleLocaleSwitch}
            className="rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-gray-600 transition-colors hover:border-accent hover:text-accent"
            aria-label={messages.nav.language}
          >
            {localeLabels[alternateLocale]}
          </Link>

          <UserMenu locale={locale} />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-7"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={messages.nav.toggleMenu}
        >
          <span className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-18 left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg">
            <div className="container py-4 space-y-3 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 pt-2">
                {messages.nav.products}
              </p>
              {productOptions.map((option) => (
                <Link
                  key={option.href}
                  href={localizePath(option.href, locale)}
                  className="block rounded-lg border border-gray-200 px-3 py-3"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm font-semibold text-gray-950">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.tagline}</p>
                </Link>
              ))}

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 pt-3">
                {isInMarketplace ? messages.marketplace.brand : 'BridgeEast'}
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={localizePath(link.href, locale)}
                  className="block text-gray-600 hover:text-accent font-medium py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isInMarketplace && (
                <Link href={localizePath('/waitlist', locale)} className="btn-primary text-center py-2.5" onClick={() => setIsOpen(false)}>
                  {messages.nav.waitlist}
                </Link>
              )}
              <Link
                href={localizePath(pathname, alternateLocale)}
                onClick={() => {
                  handleLocaleSwitch()
                  setIsOpen(false)
                }}
                className="rounded-full border border-gray-300 px-4 py-2 text-center text-xs font-semibold tracking-[0.18em] text-gray-600 transition-colors hover:border-accent hover:text-accent"
              >
                {localeLabels[alternateLocale]}
              </Link>
              <div className="pt-2 border-t border-gray-100 mt-2">
                <UserMenu locale={locale} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
