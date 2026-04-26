import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

const VALUES = [
  {
    title: 'Bilingual by Default',
    body:
      'Every listing, message, and contract is rendered in Mandarin, Korean, Vietnamese, and English so language never blocks a good deal.',
  },
  {
    title: 'Vetted Demand',
    body:
      'Buyers prove funds and intent before contact details are released. Sellers see fewer tire-kickers and more real conversations.',
  },
  {
    title: 'Operator-First',
    body:
      'We were operators ourselves. Every workflow is shaped by what we wished existed when we were buying or selling our own kitchens.',
  },
]

export default function WhoWeArePage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container">
          <h1 className="ptp-h1 text-center">Who We Are</h1>

          <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-[1.1fr_1fr] md:items-center">
            <p className="text-base leading-relaxed text-ptp-ink/80 md:text-lg">
              Pass The Plate is a community-first marketplace for Asian F&B operators in the United
              States. We help bakery owners, ramen chefs, bubble tea founders, and izakaya
              operators pass their businesses on to the next generation of immigrant
              entrepreneurs — without losing a decade of recipes and goodwill in the handoff.
              <br />
              <br />
              We were built by operators and second-gen kids who watched our parents’ shops change
              hands at half their value because no one knew how to value the bilingual community
              they’d built. We’re fixing that.
            </p>

            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-ptp-orange/10">
              <img
                src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=900&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.title} className="ptp-card p-6 md:p-8">
                <h3 className="ptp-display text-xl">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ptp-ink/70">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FindYourNextBigDealBanner />
      <DualImageCta locale={locale} />
    </>
  )
}
