import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

const PARTNER_KINDS = [
  {
    kind: 'SBA Lenders',
    body: 'Bilingual loan officers comfortable underwriting Asian F&B operators.',
    count: '34 partners',
  },
  {
    kind: 'Immigration Attorneys',
    body: 'EB-5, E-2, and L-1 specialists for visa-eligible business buys.',
    count: '21 partners',
  },
  {
    kind: 'Bilingual Brokers',
    body: 'Asian F&B specialists negotiating in your seller’s native language.',
    count: '18 partners',
  },
  {
    kind: 'CPAs & Bookkeepers',
    body: 'Clean up books and stand up bilingual financials before listing.',
    count: '27 partners',
  },
  {
    kind: 'Equipment Suppliers',
    body: 'From wok burners to bubble tea sealers, vetted suppliers nationwide.',
    count: '40 partners',
  },
  {
    kind: 'POS & Compliance',
    body: 'POS, payroll, and food-safety stack for the first 90 days.',
    count: '12 partners',
  },
]

export default function AddressBookPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container">
          <h1 className="ptp-h1 text-center md:text-left">Address Book</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ptp-ink/70">
            The vetted contact list for Asian F&B deals. Filtered by specialty, language, and
            geography.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PARTNER_KINDS.map((kind) => (
              <article key={kind.kind} className="ptp-card flex flex-col p-6">
                <span className="ptp-eyebrow text-ptp-orange">{kind.count}</span>
                <h3 className="ptp-display mt-3 text-xl">{kind.kind}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ptp-ink/70">{kind.body}</p>
                <button type="button" className="ptp-btn-ghost mt-6 text-sm" disabled>
                  Members Only
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
