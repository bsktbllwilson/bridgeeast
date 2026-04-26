import { Calculator, FileText, LineChart, MapPin } from 'lucide-react'

import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

const TOOLS = [
  {
    icon: Calculator,
    title: 'Restaurant Valuation Calculator',
    body:
      'Plug in revenue, SDE, lease terms, and concept type. Get a market-anchored valuation range backed by 50+ comparable Asian F&B sales.',
  },
  {
    icon: LineChart,
    title: 'SBA Loan Estimator',
    body:
      'Estimate down payment, monthly debt service, and DSCR for SBA 7(a) acquisitions before you talk to a lender.',
  },
  {
    icon: MapPin,
    title: 'Lease vs. Buy Analyzer',
    body:
      'Compare 5-year cash flow under a new lease vs. buying an existing operating restaurant in the same trade area.',
  },
  {
    icon: FileText,
    title: 'Bilingual LOI Generator',
    body:
      'Generate a non-binding Letter of Intent in EN/ZH/KO/VI from a guided form. Designed for first-time buyers.',
  },
]

export default function ToolsPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="relative">
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[16/7]">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-ptp-cream" />
          <div className="ptp-container relative flex h-full items-center justify-center">
            <h1 className="ptp-h1 text-center text-ptp-cream md:text-[7rem]">
              Tools &<br />
              Calculator
            </h1>
          </div>
        </div>
      </section>

      <section className="ptp-section">
        <div className="ptp-container grid gap-6 md:grid-cols-2">
          {TOOLS.map((tool) => (
            <article key={tool.title} className="ptp-card p-6 md:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ptp-yellow text-ptp-ink">
                <tool.icon className="h-6 w-6" />
              </span>
              <h3 className="ptp-display mt-5 text-xl text-ptp-ink">{tool.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ptp-ink/70">{tool.body}</p>
              <button type="button" className="ptp-btn-ghost mt-6 text-sm" disabled>
                Coming Soon
              </button>
            </article>
          ))}
        </div>
      </section>

      <FindYourNextBigDealBanner />
      <DualImageCta locale={locale} />
    </>
  )
}
