import Link from 'next/link'

import { Container } from '@/components/ui/container'

const CARDS = [
  {
    title: 'Bilingual Listing',
    body: 'List in 10 minutes from any device. Native support for Mandarin, Korean, and Vietnamese. Invisible to English-only competitors.',
    cta: 'Get Started',
    href: '/sell',
  },
  {
    title: 'Market Data',
    body: 'Valuations backed by 50+ SBA and US Census Bureau data sources — because every number means something.',
    cta: 'Market Tools',
    href: '/tools',
  },
  {
    title: 'Vetted Demand',
    body: 'Buyers must show proof of funds or SBA pre-qualification before seller contacts are released. Vetted by our advisors. Zero spam.',
    cta: 'View Sources',
    href: '/about#trust',
  },
  {
    title: 'Curated Partners',
    body: '120+ SBA lenders, bilingual brokers, and immigration attorneys — pre-screened and ready to help close your deal.',
    cta: 'Access Partners',
    href: '/partners',
  },
] as const

export function ValueProps() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <h2 className="font-display text-4xl text-brand-ink md:text-5xl">Our Plates Are Full</h2>
      </Container>

      <div className="mt-10 overflow-x-auto pb-2">
        <ul className="flex w-max gap-5 px-6 md:px-8 lg:mx-auto lg:max-w-[1280px]">
          {CARDS.map((card) => (
            <li
              key={card.title}
              className="flex h-[340px] w-[300px] shrink-0 flex-col justify-between rounded-3xl bg-brand-orange p-7 text-white sm:w-[320px] md:w-[300px] lg:w-[290px]"
            >
              <div>
                <h3 className="font-display text-3xl leading-tight">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/95">{card.body}</p>
              </div>
              <Link
                href={card.href}
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:underline"
              >
                {card.cta} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
