import { ArrowRight } from 'lucide-react'

import { DualImageCta } from '@/components/ptp/DualImageCta'
import { type AppLocale } from '@/i18n/locales'

import { MembershipFAQs } from './MembershipFAQs'

type Tier = {
  name: string
  price: string
  priceSuffix: string
  blurb: string
  features: string[]
  cta: string
  highlight?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'First Bite',
    price: '$0',
    priceSuffix: '/ Month',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    features: [
      'Access to XX Listings',
      'Access to XX Contacts',
      'One Complimentary Valuation (per Membership)',
    ],
    cta: 'Start Plan',
  },
  {
    name: 'Chef’s Table',
    price: '$99',
    priceSuffix: '/ Month',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    features: [
      'Access to XX Listings',
      'Access to XX Contacts',
      'Complimentary XX Valuation',
      'Up to 60-Minutes with an Advisor',
      'Unlimited Access to Resources',
    ],
    cta: 'Start Plan',
    highlight: true,
  },
  {
    name: 'The Full Menu',
    price: '$249',
    priceSuffix: '/ Month',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    features: [
      'Access to Unlimited Listings',
      'Access to Unlimited Contacts',
      'Complimentary Valuation, Always',
      'Dedicated Advisor',
      'Unlimited Access to Resources',
    ],
    cta: 'Start Plan',
  },
]

export default function MembershipPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className="ptp-card-yellow flex flex-col gap-6 text-center"
            >
              <header className="space-y-1">
                <h3 className="ptp-h3">{tier.name}</h3>
                <p className="ptp-h3">
                  {tier.price} <span className="font-semibold">{tier.priceSuffix}</span>
                </p>
              </header>
              <p className="text-sm leading-relaxed text-ptp-ink/70">{tier.blurb}</p>
              <ul className="space-y-2 text-sm leading-relaxed text-ptp-ink/85">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button type="button" className="ptp-btn-dark mx-auto mt-auto w-full justify-center text-sm">
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="ptp-section pt-0">
        <div className="ptp-container">
          <h2 className="ptp-h2 text-center">FAQs</h2>
          <div className="mx-auto mt-10 max-w-3xl">
            <MembershipFAQs />
          </div>
        </div>
      </section>

      <DualImageCta locale={locale} />
    </>
  )
}
