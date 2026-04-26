'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  getLocaleFromPathname,
  getOppositeLocale,
  localeLabels,
  localizePath,
} from '@/i18n/locales'
import { getStaticMessages } from '@/i18n/static-messages'
import { UserMenu } from '@/components/UserMenu'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const alternateLocale = getOppositeLocale(locale)
  const messages = getStaticMessages(locale)
  const homeHref = localizePath('/marketplace/browse', locale)
  const brandLabel = messages.marketplace.brand

  const handleLocaleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${alternateLocale}; path=/; max-age=31536000; samesite=lax`
  }

  const navLinks = [
    { href: '/marketplace/browse', label: messages.marketplace.nav.browse },
    { href: '/marketplace/listings/new', label: messages.marketplace.nav.sell },
    { href: '/playbook', label: messages.nav.guides },
    { href: '/partners', label: messages.nav.partners },
  ]

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
      <div className="container flex items-center justify-between h-18 md:h-20">
        <Link
          href={homeHref}
          className="text-2xl md:text-3xl font-serif font-bold text-gray-950 hover:text-accent transition-colors"
        >
          {brandLabel}
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={localizePath(link.href, locale)}
              className="text-gray-600 hover:text-accent transition-colors font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}

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
          <span
            className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-0.5 w-full bg-accent rounded transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-18 left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg">
            <div className="container py-4 space-y-3 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 pt-2">
                {brandLabel}
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
