'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-20">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-gray-800">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-accent mb-4">BridgeEast</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Market intelligence and partnerships for Asian food & beverage brands entering NYC.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-300">
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
            <h4 className="font-serif font-bold mb-6 text-lg">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-300">
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
                <a href="mailto:hello@bridgeeast.com" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">Stay Updated</h4>
            <p className="text-sm text-gray-300 mb-4">
              Get notified about new guides and partnerships.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-3 bg-gray-800 text-white text-sm flex-1 border border-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-500"
              />
              <button className="px-4 py-3 bg-accent hover:bg-accent-dark transition-colors font-semibold">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-6">
          <p>&copy; 2026 BridgeEast. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
