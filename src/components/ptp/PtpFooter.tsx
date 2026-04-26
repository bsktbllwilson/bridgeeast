'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import {
  appLocales,
  getLocaleFromPathname,
  localeNames,
  localizePath,
} from '@/i18n/locales'
import { ptpFooterColumns, ptpRoute } from '@/lib/ptp/nav'

export function PtpFooter() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`
    if (typeof window !== 'undefined') {
      window.location.href = localizePath(pathname, next as (typeof appLocales)[number])
    }
  }

  return (
    <footer className="bg-ptp-ink text-white">
      <div className="ptp-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="ptp-display text-2xl tracking-wider md:text-3xl">PASS THE PLATE</p>
          </div>
          {ptpFooterColumns.map((column, index) => (
            <ul key={index} className="space-y-3 text-sm text-white/85">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={ptpRoute(link.href, locale)}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <select
              value={locale}
              onChange={handleLocaleChange}
              aria-label="Select language"
              className="appearance-none rounded-full bg-ptp-orange px-4 py-2 pr-9 text-xs font-semibold uppercase tracking-[0.18em] text-white focus:outline-none"
            >
              {appLocales.map((code) => (
                <option key={code} value={code} className="text-ptp-ink">
                  {localeNames[code]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Pass The Plate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
