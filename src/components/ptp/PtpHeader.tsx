'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
  getLocaleFromPathname,
  getOppositeLocale,
  localeLabels,
  localizePath,
} from '@/i18n/locales'
import { ptpHome, ptpPrimaryNav, ptpRoute } from '@/lib/ptp/nav'

export function PtpHeader() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const alternateLocale = getOppositeLocale(locale)
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${alternateLocale}; path=/; max-age=31536000; samesite=lax`
  }

  const leftLinks = ptpPrimaryNav.slice(0, 2)
  const rightLinks = ptpPrimaryNav.slice(2)

  return (
    <header className="sticky top-0 z-40 bg-ptp-orange text-white">
      <div className="ptp-container flex h-16 items-center justify-between md:h-20">
        {/* Desktop layout: 3-column grid with logo centered */}
        <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center md:grid">
          <nav className="flex items-center gap-10 text-sm font-medium tracking-wide">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={ptpRoute(link.href, locale)}
                className="opacity-90 transition hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href={ptpHome(locale)} className="ptp-display text-2xl tracking-wider md:text-[1.625rem]">
            PASS THE PLATE
          </Link>

          <nav className="flex items-center justify-end gap-10 text-sm font-medium tracking-wide">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={ptpRoute(link.href, locale)}
                className="opacity-90 transition hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={localizePath(pathname, alternateLocale)}
              onClick={handleLocaleSwitch}
              className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold tracking-[0.18em] opacity-90 transition hover:bg-white/10 hover:opacity-100"
              aria-label="Switch language"
            >
              {localeLabels[alternateLocale]}
            </Link>
          </nav>
        </div>

        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span className={`h-0.5 w-6 bg-white transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-white transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>

          <Link href={ptpHome(locale)} className="ptp-display text-xl tracking-wider">
            PASS THE PLATE
          </Link>

          <Link
            href={localizePath(pathname, alternateLocale)}
            onClick={handleLocaleSwitch}
            className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold tracking-[0.18em]"
            aria-label="Switch language"
          >
            {localeLabels[alternateLocale]}
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/15 bg-ptp-orange md:hidden">
          <nav className="ptp-container flex flex-col gap-1 py-4">
            {ptpPrimaryNav.map((link) => (
              <Link
                key={link.href}
                href={ptpRoute(link.href, locale)}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
