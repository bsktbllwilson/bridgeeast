import Link from 'next/link'
import { cookies } from 'next/headers'

import { Container } from '@/components/ui/container'
import { LanguagePicker } from '@/components/marketing/language-picker'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/locales'

const COLUMNS: { href: string; label: string }[][] = [
  [
    { href: '/buy', label: 'Buy A Business' },
    { href: '/sell', label: 'Sell A Business' },
    { href: '/heatmap', label: 'Listing Heatmap' },
  ],
  [
    { href: '/playbook', label: 'Guides & Playbooks' },
    { href: '/data', label: 'Market Data' },
    { href: '/address-book', label: 'Address Book' },
    { href: '/tools', label: 'Tools & Calculator' },
  ],
  [
    { href: '/about', label: 'Who We Are' },
    { href: '/membership', label: 'Become A Member' },
    { href: '/partners/apply', label: 'Become A Partner' },
    { href: '/faq', label: 'FAQs' },
  ],
]

export function Footer() {
  const stored = cookies().get('NEXT_LOCALE')?.value
  const current: Locale = isLocale(stored) ? stored : DEFAULT_LOCALE

  return (
    <footer className="bg-brand-ink pb-12 pt-16 text-brand-cream">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Link
              href="/"
              className="font-display text-3xl font-semibold tracking-tight text-brand-cream"
            >
              PASS THE PLATE
            </Link>
          </div>

          {COLUMNS.map((col, i) => (
            <ul key={i} className="space-y-3">
              {col.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-cream/85 transition-opacity hover:underline hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-brand-cream/10 pt-8">
          <p className="text-xs text-brand-cream/60">
            © {new Date().getFullYear()} Pass The Plate. All rights reserved.
          </p>
          <LanguagePicker current={current} />
        </div>
      </Container>
    </footer>
  )
}
