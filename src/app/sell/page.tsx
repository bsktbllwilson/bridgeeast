import Link from 'next/link'

import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { StatsBand, type Stat } from '@/components/marketing/stats-band'
import { Testimonials } from '@/components/marketing/testimonials'
import { ValueProps } from '@/components/marketing/value-props'
import { ListingsHotspotsSection } from '@/components/marketplace/listings-hotspots-section'
import { Button } from '@/components/ui/button'

const SELLER_STATS: Stat[] = [
  {
    value: '$0 Upfront',
    caption: 'We charge zero to list. 3-5% success fee only when you close.',
  },
  {
    value: '10 Minutes',
    caption: 'List from your phone in Chinese, Korean, Japanese, or Vietnamese.',
  },
  {
    value: '120+ Partners',
    caption: 'SBA lenders, bilingual brokers, and immigration attorneys.',
  },
  {
    value: 'Verified Buyers',
    caption: 'Every buyer must show proof of funds before seeing your contact.',
  },
]

export default function SellPage() {
  return (
    <>
      <SellHero />
      <ValueProps heading="How It Works" />
      <ListingsHotspotsSection />
      <StatsBand stats={SELLER_STATS} />
      <Testimonials />
      <FindYourNextBigDeal />
      <BuySellSplit />
    </>
  )
}

function SellHero() {
  return (
    <section
      className="relative flex min-h-[70vh] items-center bg-brand-ink/40 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/brand/chef.JPG')" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-24 text-white md:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl lg:text-[80px]">
            Pass the Plate to
            <br />
            The Right Hands
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/90 md:text-lg">
            List your Asian F&amp;B Business in 10 Minutes. We charge $0 upfront, we only win when
            you win.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/sell/new">
              <Button variant="primary" size="lg" arrow>
                List My Business
              </Button>
            </Link>
            <Link href="/tools#valuation">
              <Button
                size="lg"
                arrow
                className="border border-white bg-transparent text-white hover:bg-white hover:text-brand-ink"
              >
                Get Free Valuation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
