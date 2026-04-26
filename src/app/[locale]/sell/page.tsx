import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { DualImageCta } from '@/components/ptp/DualImageCta'
import { type AppLocale } from '@/i18n/locales'
import { ptpRoute } from '@/lib/ptp/nav'

import { ListingHotspots } from './ListingHotspots'

const STEPS = [
  {
    title: 'Bilingual Listing',
    body:
      'List in 10 minutes from any device. Native support for Mandarin, Korean, and Vietnamese. Invisible to English-only competitors.',
    cta: 'Get Started',
    href: '/listings/new',
  },
  {
    title: 'Market Data',
    body:
      'Valuations backed by 50+ SBA and US Census Bureau data sources — because every number means something.',
    cta: 'Market Tools',
    href: '/tools',
  },
  {
    title: 'Vetted Demand',
    body:
      'Buyers must show proof of funds or SBA pre-qualification before seller contacts are released. Vetted by our advisors. Zero spam.',
    cta: 'View Sources',
    href: '/who-we-are',
  },
  {
    title: 'Curated Offers',
    body:
      'Every offer comes with a verified profile, signed NDA, and intent statement. We filter; you decide.',
    cta: 'Accept Offers',
    href: '/inbox',
  },
]

const STATS = [
  {
    value: '$0 Upfront',
    body: 'We charge zero to list. 3–5% success fee only when you close.',
  },
  {
    value: '10 Minutes',
    body: 'List from your phone in Chinese, Korean, Japanese, or Vietnamese.',
  },
  {
    value: '120+ Partners',
    body: 'SBA lenders, bilingual brokers, and immigration attorneys.',
  },
  {
    value: 'Verified Buyers',
    body: 'Every buyer must show proof of funds before seeing your contact.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'We had serious buyer conversations in our first week. Pass The Plate brought in people who actually understood hospitality deals.',
    name: 'Helen Park',
    role: 'Bakery Owner',
    location: 'Brooklyn, NY',
  },
  {
    quote:
      'Listed in Mandarin on a Sunday. Three signed NDAs by Friday. The bilingual reach is the whole game.',
    name: 'Michael Tan',
    role: 'Bubble Tea Operator',
    location: 'San Gabriel, CA',
  },
]

export default function SellBusinessPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[16/7]">
          <img
            src="https://images.unsplash.com/photo-1581349481014-30c7b1b1cf65?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="ptp-container relative flex h-full items-center">
            <div className="max-w-2xl text-white">
              <h1 className="ptp-h1">
                Pass the Plate to
                <br />
                The Right Hands
              </h1>
              <p className="mt-5 text-base text-white/85 md:text-lg">
                List your Asian F&B Business in 10 Minutes. We charge $0 upfront, we only win when
                you win.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={ptpRoute('/listings/new', locale)} className="ptp-btn-primary text-sm">
                  List My Business
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={ptpRoute('/tools', locale)} className="ptp-btn-primary text-sm">
                  Get Free Valuation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="ptp-section">
        <div className="ptp-container">
          <h2 className="ptp-h2">How It Works</h2>
          <div className="mt-10 -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
            {STEPS.map((step) => (
              <article
                key={step.title}
                className="ptp-card-orange min-w-[260px] md:min-w-0 flex flex-col gap-4"
              >
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

      {/* Listing Hotspots */}
      <section className="bg-ptp-yellow py-14 md:py-20">
        <div className="ptp-container">
          <h2 className="ptp-h2 text-ptp-ink">Listing Hotspots</h2>
          <ListingHotspots />
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-ptp-yellow pb-16 md:pb-20">
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

      {/* Testimonials */}
      <section className="ptp-section">
        <div className="ptp-container">
          <h2 className="ptp-h2">Trusted by 100+ Sellers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.name} className="ptp-card p-6 md:p-8">
                <p className="text-base leading-relaxed text-ptp-ink/85">“{testimonial.quote}”</p>
                <p className="ptp-display mt-6 text-xl">{testimonial.name}</p>
                <p className="mt-1 text-sm text-ptp-ink/60">
                  {testimonial.role}
                  <br />
                  {testimonial.location}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DualImageCta locale={locale} />
    </>
  )
}
