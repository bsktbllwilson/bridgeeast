import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

const DATA_SETS = [
  {
    title: 'Rent per Square Foot',
    body: 'Median commercial rent across 12 Asian F&B-dense neighborhoods, refreshed quarterly.',
  },
  {
    title: 'Foot Traffic Index',
    body: 'Pedestrian density scores by trade area, sourced from anonymized mobile data.',
  },
  {
    title: 'Concept Saturation',
    body: 'Restaurants per capita by cuisine — find white-space opportunities in saturated metros.',
  },
  {
    title: 'SBA Loan Approval Rates',
    body: 'Acceptance rates by metro for SBA 7(a) loans on Asian F&B acquisitions.',
  },
  {
    title: 'Median SDE Multiple',
    body: 'Seller’s Discretionary Earnings multiples observed in closed Asian F&B sales.',
  },
  {
    title: 'Visa-Eligible Listings',
    body: 'Share of active listings that qualify for EB-5, E-2, or SBA-prequalified financing.',
  },
]

export default function MarketDataPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container">
          <h1 className="ptp-h1 text-center md:text-left">Market Data</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ptp-ink/70">
            The data we wish we had when we were buying our first restaurant. Public-source
            datasets cleaned, joined, and visualized for Asian F&B operators.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DATA_SETS.map((dataset) => (
              <article key={dataset.title} className="ptp-card-yellow flex flex-col gap-3">
                <h3 className="ptp-display text-xl">{dataset.title}</h3>
                <p className="text-sm leading-relaxed text-ptp-ink/75">{dataset.body}</p>
                <button type="button" className="ptp-btn-dark mt-4 self-start text-sm" disabled>
                  Coming Soon
                </button>
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
