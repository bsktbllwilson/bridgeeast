'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold text-accent mb-6">BridgeEast</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Market intelligence and partnerships for Asian food & beverage brands entering NYC.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/data" className="hover:text-accent transition-colors">
                  Market Data
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-accent transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-accent transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/waitlist" className="hover:text-accent transition-colors">
                  Join Waitlist
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-300 mb-4">
              Get notified about new guides and partnerships.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2 bg-gray-800 text-white text-sm flex-1 border border-gray-700 focus:outline-none focus:border-accent"
              />
              <button className="px-4 py-2 bg-accent hover:bg-accent-dark transition-colors">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 BridgeEast. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
