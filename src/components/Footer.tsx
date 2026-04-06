'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getLocaleFromPathname, localizePath } from '@/i18n/locales'
import { getStaticMessages } from '@/i18n/static-messages'

export function Footer() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const messages = getStaticMessages(locale)

  return (
    <footer className="bg-gray-950 text-white py-20">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-gray-800">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-accent mb-4">BridgeEast</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {messages.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">{messages.footer.explore}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href={localizePath('/data', locale)} className="hover:text-accent transition-colors">
                  {messages.footer.marketData}
                </Link>
              </li>
              <li>
                <Link href={localizePath('/guides', locale)} className="hover:text-accent transition-colors">
                  {messages.footer.guides}
                </Link>
              </li>
              <li>
                <Link href={localizePath('/partners', locale)} className="hover:text-accent transition-colors">
                  {messages.footer.partners}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">{messages.footer.resources}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href={localizePath('/waitlist', locale)} className="hover:text-accent transition-colors">
                  {messages.footer.joinWaitlist}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  {messages.footer.faq}
                </a>
              </li>
              <li>
                <a href="mailto:hello@bridgeeast.com" className="hover:text-accent transition-colors">
                  {messages.footer.contact}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">{messages.footer.stayUpdated}</h4>
            <p className="text-sm text-gray-300 mb-4">
              {messages.footer.stayUpdatedBody}
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder={messages.footer.emailPlaceholder}
                className="px-4 py-3 bg-gray-800 text-white text-sm flex-1 border border-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-500"
              />
              <button className="px-4 py-3 bg-accent hover:bg-accent-dark transition-colors font-semibold">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-6">
          <p>{messages.footer.rights}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent transition-colors">
              {messages.footer.privacy}
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              {messages.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
