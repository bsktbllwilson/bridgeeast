import Link from 'next/link'

export function FindYourNextBigDeal() {
  return (
    <section className="bg-cream">
      <div className="container section text-center max-w-3xl">
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
          Find Your Next Big Deal
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Browse vetted Asian F&B businesses for sale across the U.S. — listings, financials,
          and the operators behind them.
        </p>
        <Link href="/listings" className="btn-primary">
          Browse Listings →
        </Link>
      </div>
    </section>
  )
}
