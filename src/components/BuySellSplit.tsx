import Link from 'next/link'

export function BuySellSplit() {
  return (
    <section className="bg-white">
      <div className="container section grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-playbook-yellow p-10 md:p-14 flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">Buying?</h3>
            <p className="text-gray-800 mb-8 text-base md:text-lg">
              Search active listings, talk to brokers, and run the numbers with our valuation tools.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-block self-start bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            Find a Business →
          </Link>
        </div>

        <div className="rounded-3xl bg-black text-white p-10 md:p-14 flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">Selling?</h3>
            <p className="text-gray-200 mb-8 text-base md:text-lg">
              List your operating business in front of qualified buyers. Free to post, vetted before
              it goes live.
            </p>
          </div>
          <Link
            href="/sellers"
            className="inline-block self-start bg-playbook-yellow text-black px-6 py-3 rounded-full font-medium hover:brightness-95 transition"
          >
            List a Business →
          </Link>
        </div>
      </div>
    </section>
  )
}
