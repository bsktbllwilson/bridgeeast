import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

const REGIONS = [
  { city: 'San Gabriel Valley, CA', listings: 42, change: '+8' },
  { city: 'Sunset Park, NY', listings: 31, change: '+5' },
  { city: 'Bellaire, TX', listings: 24, change: '+12' },
  { city: 'Annandale, VA', listings: 18, change: '+3' },
  { city: 'Buford Highway, GA', listings: 15, change: '+6' },
  { city: 'Federal Way, WA', listings: 11, change: '+1' },
]

export default function HeatmapPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container">
          <h1 className="ptp-h1 text-center md:text-left">Listing Heatmap</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ptp-ink/70">
            Where Asian F&B owners are listing right now. Demand and supply density by metro,
            updated weekly.
          </p>

          <div className="mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ptp-cream-soft">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1800&q=80"
              alt="Heatmap placeholder"
              className="h-full w-full object-cover opacity-90"
            />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REGIONS.map((region) => (
              <article
                key={region.city}
                className="ptp-card flex items-center justify-between p-6"
              >
                <div>
                  <p className="ptp-display text-lg leading-tight">{region.city}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ptp-ink/60">
                    {region.listings} active listings
                  </p>
                </div>
                <span className="ptp-tag-yellow">{region.change} this month</span>
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
