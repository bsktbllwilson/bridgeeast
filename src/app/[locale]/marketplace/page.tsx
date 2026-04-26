import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'
import { ptpRoute } from '@/lib/ptp/nav'
import { listBusinessListings } from '@/lib/marketplace/queries'

const VALUES = [
  {
    title: 'Bilingual Listing',
    body:
      'Every listing in EN, Mandarin, Korean, and Vietnamese — written by operators, not translated by bots.',
  },
  {
    title: 'Vetted Demand',
    body:
      'Buyers prove funds and intent before contact details are released. Zero spam, zero tire-kickers.',
  },
  {
    title: 'Operator-First Tools',
    body:
      'Bilingual LOIs, SBA estimators, valuation calculators built for first-time Asian F&B sellers.',
  },
  {
    title: 'Community-Backed',
    body:
      'Brokers, lenders, and immigration attorneys who actually understand hospitality deals.',
  },
]

export default async function MarketplaceHomePage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const { listings } = await listBusinessListings({ limit: 4 })

  return (
    <>
      <section className="relative">
        <div className="ptp-container pt-12 pb-10 md:pt-20 md:pb-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <p className="ptp-eyebrow text-ptp-orange">Asian F&B Marketplace</p>
              <h1 className="ptp-h1 mt-4">
                Pass The Plate
                <br />
                With Confidence.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ptp-ink/75 md:text-lg">
                The community marketplace for buying and selling Asian F&B businesses across the
                U.S. — bakeries, bubble tea, izakayas, ghost kitchens, and everything in between.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={ptpRoute('/buy', locale)} className="ptp-btn-primary text-sm">
                  Buy A Business
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={ptpRoute('/sell', locale)} className="ptp-btn-dark text-sm">
                  Sell A Business
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-ptp-orange/10">
              <img
                src="https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ptp-yellow py-12 md:py-16">
        <div className="ptp-container grid gap-6 md:grid-cols-4">
          {VALUES.map((value) => (
            <article key={value.title}>
              <h3 className="ptp-display text-xl text-ptp-ink">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ptp-ink/75">{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      {listings.length > 0 && (
        <section className="ptp-section">
          <div className="ptp-container flex flex-wrap items-end justify-between gap-4">
            <h2 className="ptp-h2">Featured Listings</h2>
            <Link
              href={ptpRoute('/browse', locale)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ptp-ink transition hover:text-ptp-orange"
            >
              Browse All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="ptp-container mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {listings.slice(0, 4).map((listing) => (
              <Link
                key={listing.id}
                href={ptpRoute(`/listings/${listing.id}`, locale)}
                className="ptp-card overflow-hidden transition hover:shadow-md"
              >
                <div className="aspect-[4/3] bg-ptp-cream-soft">
                  {listing.cover_image_url && (
                    <img
                      src={listing.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="ptp-display text-base leading-tight">
                    {listing.title}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-ptp-ink/60">
                    {listing.city}, {listing.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FindYourNextBigDealBanner />
      <DualImageCta locale={locale} />
    </>
  )
}
