import { DualImageCta } from '@/components/ptp/DualImageCta'
import { type AppLocale } from '@/i18n/locales'

import { PartnerForm } from './PartnerForm'

const TARGET_PARTNERS = [
  {
    title: 'Bilingual Brokers',
    body: 'Asian F&B specialists who speak Mandarin, Korean, Vietnamese, or Japanese with sellers and buyers natively.',
  },
  {
    title: 'Immigration Attorneys',
    body: 'EB-5, E-2, and L-1 specialists who can advise on visa-eligible business acquisitions.',
  },
  {
    title: 'SBA Lenders',
    body: 'Lenders comfortable underwriting Asian F&B operators with non-traditional cash flow patterns.',
  },
  {
    title: 'CPAs & Bookkeepers',
    body: 'Advisors who can clean up books and stand up bilingual financials for first-time sellers.',
  },
]

export default function PartnersPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container">
          <div className="rounded-[32px] bg-white p-8 shadow-sm md:p-14">
            <h1 className="ptp-h2 text-center">Become a Partner</h1>
            <PartnerForm />
          </div>
        </div>
      </section>

      <section className="ptp-section pt-0">
        <div className="ptp-container">
          <h2 className="ptp-h2 text-center">Who We’re Looking For</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {TARGET_PARTNERS.map((partner) => (
              <article key={partner.title} className="ptp-card p-6 md:p-8">
                <h3 className="ptp-display text-xl text-ptp-ink">{partner.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ptp-ink/70">{partner.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DualImageCta locale={locale} />
    </>
  )
}
