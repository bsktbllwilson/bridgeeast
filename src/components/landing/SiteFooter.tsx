import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

interface FooterColumn {
  links: { label: string; href: string }[]
}

const COLUMNS: FooterColumn[] = [
  {
    links: [
      { label: 'Buy A Business', href: '/marketplace/browse' },
      { label: 'Sell A Business', href: '/marketplace/listings/new' },
      { label: 'Listing Heatmap', href: '/marketplace/browse' },
    ],
  },
  {
    links: [
      { label: 'Guides & Playbooks', href: '/playbook' },
      { label: 'Market Data', href: '/playbook' },
      { label: 'Address Book', href: '/partners' },
      { label: 'Tools & Calculator', href: '/playbook' },
    ],
  },
  {
    links: [
      { label: 'Who We Are', href: '/about' },
      { label: 'Become A Member', href: '/sign-up' },
      { label: 'Become A Partner', href: '/contact' },
      { label: 'FAQs', href: '/contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-stage px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Pass The Plate home" className="inline-block">
              <Image
                src="/assets/logo-passtheplate.png"
                alt="Pass The Plate"
                width={280}
                height={53}
                className="h-12 md:h-[53px] w-auto"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(97%) sepia(6%) saturate(1350%) hue-rotate(2deg) brightness(99%) contrast(90%)',
                }}
              />
            </Link>
          </div>

          {COLUMNS.map((col, i) => (
            <ul key={i} className="space-y-3 font-body text-base md:text-lg">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:opacity-75 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-cream/90 bg-orange text-white px-4 py-2 font-body text-sm md:text-base hover:bg-orange-dark transition-colors"
            aria-label="Language selector"
          >
            English
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
          <p className="font-body text-sm text-cream/70">
            © 2026 Pass The Plate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
