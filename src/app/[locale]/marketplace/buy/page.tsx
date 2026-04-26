import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { DualImageCta } from '@/components/ptp/DualImageCta'
import { type AppLocale } from '@/i18n/locales'
import { ptpRoute } from '@/lib/ptp/nav'
import { listBusinessListings } from '@/lib/marketplace/queries'

const STEPS = [
  {
    title: 'Filter Honestly',
    body:
      'Cuisine, geo, budget, visa eligibility — pick what matters. We surface only what truly fits.',
    cta: 'Browse Listings',
    href: '/browse',
  },
  {
    title: 'Sign One NDA',
    body:
      'Single click NDA unlocks financials across every shortlisted listing. No back-and-forth.',
    cta: 'See How It Works',
    href: '/who-we-are',
  },
  {
    title: 'Talk to Operators',
    body:
      'Every seller is a real Asian F&B operator — verified, bilingual, and ready to walk you through their books.',
    cta: 'Open Inbox',
    href: '/inbox',
  },
  {
    title: 'Close With Backup',
    body:
      'Pull in our partner network: SBA lenders, bilingual brokers, immigration attorneys. One marketplace.',
    cta: 'View Partners',
    href: '/address-book',
  },
]

const STATS = [
  { value: '$0', body: 'Free to browse, free to inquire. No paywall before you see what’s for sale.' },
  { value: '4 Languages', body: 'EN, Mandarin, Korean, Vietnamese — listings translated by real operators.' },
  { value: '50+ Cities', body: 'From Sunset Park to San Gabriel Valley to Houston Bellaire.' },
  { value: 'Verified Sellers', body: 'Every seller submits proof of ownership and clean financials.' },
]

export default async function BuyBusinessPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const { listings } = await listBusinessListings({ limit: 4 })

  return (
    <>
      <section className="relative">
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[16/7]">
          <img
            src="https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="ptp-container relative flex h-full items-center">
            <div className="max-w-2xl text-white">
              <h1 className="ptp-h1">
                Find A Business
                <br />
                You’re Hungry For
              </h1>
              <p className="mt-5 text-base text-white/85 md:text-lg">
                Browse vetted Asian F&B businesses for sale across the U.S. — bilingual listings,
                financials behind a single NDA, and operators ready to talk.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={ptpRoute('/browse', locale)} className="ptp-btn-primary text-sm">
                  Browse Listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={ptpRoute('/buyers/new', locale)} className="ptp-btn-primary text-sm">
                  Create Buyer Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ptp-section">
        <div className="ptp-container">
          <h2 className="ptp-h2">How It Works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <article key={step.title} className="ptp-card-orange flex flex-col gap-4">
                <h3 className="ptp-display text-xl">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{step.body}</p>
                <Link
                  href={ptpRoute(step.href, locale)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-ptp-yellow"
                >
                  {step.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ptp-yellow py-14 md:py-20">
        <div className="ptp-container">
          <div className="grid gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <p className="ptp-h3">{stat.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-ptp-ink/75">{stat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ptp-section">
        <div className="ptp-container flex flex-wrap items-end justify-between gap-4">
          <h2 className="ptp-h2">Newest Listings</h2>
          <Link
            href={ptpRoute('/browse', locale)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ptp-ink transition hover:text-ptp-orange"
          >
            View All
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

      <DualImageCta locale={locale} />
    </>
  )
}
