'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getLocaleFromPathname, localizePath } from '@/i18n/locales'
import { getStaticMessages } from '@/i18n/static-messages'

export function Footer() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const messages = getStaticMessages(locale)

  const exploreLinks = [
    { href: '/marketplace/browse', label: messages.marketplace.nav.browse },
    { href: '/marketplace/listings/new', label: messages.marketplace.nav.sell },
    { href: '/playbook', label: messages.nav.guides },
    { href: '/partners', label: messages.nav.partners },
  ]

  const resourceLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/sign-up', label: 'Create Account' },
    { href: '/sign-in', label: 'Sign In' },
  ]

  return (
    <footer className="bg-gray-950 text-white py-20">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-gray-800">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-accent mb-4">
              {messages.marketplace.brand}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The marketplace for the $240B Asian F&amp;B transition. Buy or sell vetted
              restaurants, cafés, and food businesses across the U.S.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">{messages.footer.explore}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizePath(link.href, locale)}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">{messages.footer.resources}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizePath(link.href, locale)}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@passtheplate.store"
                  className="hover:text-accent transition-colors"
                >
                  hello@passtheplate.store
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">{messages.footer.stayUpdated}</h4>
            <p className="text-sm text-gray-300 mb-4">{messages.footer.stayUpdatedBody}</p>
            <Link
              href={localizePath('/playbook', locale)}
              className="inline-block px-4 py-3 bg-accent hover:bg-accent-dark transition-colors font-semibold text-sm rounded-md"
            >
              Read The Playbook →
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-6">
          <p>© 2026 Pass The Plate. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href={localizePath('/privacy', locale)} className="hover:text-accent transition-colors">
              {messages.footer.privacy}
            </Link>
            <Link href={localizePath('/terms', locale)} className="hover:text-accent transition-colors">
              {messages.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
