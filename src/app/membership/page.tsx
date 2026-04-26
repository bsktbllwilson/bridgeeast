import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FaqAccordion } from '@/components/marketing/faq-accordion'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { PricingCards } from '@/components/marketing/pricing-cards'
import { Container } from '@/components/ui/container'
import { FAQS } from '@/data/faqs'

export const metadata = {
  title: 'Membership · Pass The Plate',
  description: 'Three plans for browsing, buying, and selling Asian F&B businesses.',
}

export default function MembershipPage() {
  return (
    <>
      <section className="bg-brand-cream pb-8 pt-20 md:pt-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl leading-tight text-brand-ink md:text-6xl">
              Pick the plan that fits where you&rsquo;re sitting
            </h1>
            <p className="mt-5 text-base text-brand-muted">
              Free to start. Upgrade when you&rsquo;re ready to move on a deal — cancel anytime.
            </p>
          </div>
        </Container>
      </section>

      <PricingCards />

      <section className="bg-white py-20 md:py-28">
        <Container>
          <h2 className="text-center font-display text-5xl text-brand-ink md:text-[64px]">FAQs</h2>
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={FAQS} />
          </div>
        </Container>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
    </>
  )
}
