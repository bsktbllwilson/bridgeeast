import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { PartnerApplicationForm } from '@/components/marketing/partner-application-form'
import { Card, CardBody } from '@/components/ui/card'
import { Container } from '@/components/ui/container'

export const metadata = {
  title: 'Become a Partner · Pass The Plate',
  description:
    'Apply to join our directory of SBA lenders, immigration attorneys, bilingual brokers, and accountants serving Asian F&B operators.',
}

const PARTNER_TYPES = [
  {
    title: 'SBA Lenders',
    body: 'Bank or non-bank lenders making 7(a) and 504 loans to Asian F&B operators. Bilingual underwriting capacity is a strong plus — we route language-matched buyers your way first.',
  },
  {
    title: 'Immigration Attorneys',
    body: 'E-2, L-1, EB-5, and family-based practitioners with deep restaurant-industry experience. Especially valuable if you’ve filed at consulates in Tokyo, Seoul, Taipei, or Hanoi.',
  },
  {
    title: 'Bilingual Brokers',
    body: 'Restaurant-focused commercial real estate or business brokers fluent in Mandarin, Cantonese, Korean, or Vietnamese. We send members who explicitly want a language match.',
  },
  {
    title: 'Accountants',
    body: 'CPAs and tax preparers comfortable cleaning up cash-heavy restaurant books, preparing quality-of-earnings reports, and structuring sale transactions. Bilingual practices preferred.',
  },
] as const

export default function PartnersApplyPage() {
  return (
    <>
      <section className="bg-brand-cream py-16 md:py-24">
        <Container>
          <Card className="mx-auto max-w-4xl rounded-3xl border-brand-border">
            <CardBody className="p-8 md:p-14">
              <h1 className="text-center font-display text-5xl leading-tight text-brand-ink md:text-[64px]">
                Become a Partner
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-center text-base text-brand-muted">
                Join our vetted directory of advisors helping Asian F&amp;B operators across the US.
                We send members directly to the right partner — no lead fees, no exclusivity.
              </p>

              <div className="mt-10">
                <PartnerApplicationForm />
              </div>
            </CardBody>
          </Card>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <h2 className="text-center font-display text-4xl text-brand-ink md:text-5xl">
            Who We&rsquo;re Looking For
          </h2>
          <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
            {PARTNER_TYPES.map((t) => (
              <li key={t.title}>
                <Card className="h-full">
                  <CardBody className="space-y-3 p-7">
                    <h3 className="font-display text-2xl text-brand-ink">{t.title}</h3>
                    <p className="text-sm leading-relaxed text-brand-body">{t.body}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
    </>
  )
}
