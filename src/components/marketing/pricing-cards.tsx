import Link from 'next/link'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

type Tier = {
  id: 'first_bite' | 'chefs_table' | 'full_menu'
  name: string
  price: string
  cadence: string
  body: string
  features: string[]
  // first_bite uses a plain link to /sign-up; chefs_table + full_menu
  // POST to /api/stripe/checkout (gracefully redirects to /sign-in
  // when unauthenticated).
  checkoutMode: 'link' | 'stripe'
}

const TIERS: Tier[] = [
  {
    id: 'first_bite',
    name: 'First Bite',
    price: '$0',
    cadence: '/Month',
    body: 'Get a taste of the marketplace. Browse limited listings and make your first move.',
    features: [
      'Access To 25 Listings',
      'Access To 50 Contacts',
      'One Complimentary Valuation (per Membership)',
    ],
    checkoutMode: 'link',
  },
  {
    id: 'chefs_table',
    name: "Chef's Table",
    price: '$99',
    cadence: '/Month',
    body: 'For active buyers who want full visibility and advisor support.',
    features: [
      'Access To 100 Listings',
      'Access To 200 Contacts',
      'Complimentary Valuation',
      'Up to 60-Minutes with an Advisor',
      'Unlimited Access to Resources',
    ],
    checkoutMode: 'stripe',
  },
  {
    id: 'full_menu',
    name: 'The Full Menu',
    price: '$249',
    cadence: '/Month',
    body: 'For serious operators and search funds running multiple deals.',
    features: [
      'Access To Unlimited Listings',
      'Access to Unlimited Contacts',
      'Complimentary Valuation, Always',
      'Dedicated Advisor',
      'Unlimited Access to Resources',
    ],
    checkoutMode: 'stripe',
  },
]

export function PricingCards() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <ul className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <li key={tier.id}>
              <PricingCard tier={tier} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function PricingCard({ tier }: { tier: Tier }) {
  return (
    <article className="flex h-full min-h-[480px] flex-col gap-6 rounded-3xl bg-brand-yellow p-8 text-brand-ink md:min-h-[560px]">
      <header>
        <h3 className="font-display text-2xl">{tier.name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-5xl leading-none">{tier.price}</span>
          <span className="text-sm text-brand-ink/70">{tier.cadence}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-brand-ink/85">{tier.body}</p>
      </header>

      <ul className="flex-1 space-y-3 border-t border-brand-ink/15 pt-6 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <CtaButton tier={tier} />
    </article>
  )
}

function CtaButton({ tier }: { tier: Tier }) {
  if (tier.checkoutMode === 'link') {
    return (
      <Link href={`/sign-up?tier=${tier.id}`} className="block">
        <Button variant="secondary" arrow className="w-full">
          Start Plan
        </Button>
      </Link>
    )
  }
  return (
    <form action="/api/stripe/checkout" method="post" className="w-full">
      <input type="hidden" name="tier" value={tier.id} />
      <Button variant="secondary" arrow type="submit" className="w-full">
        Start Plan
      </Button>
    </form>
  )
}
