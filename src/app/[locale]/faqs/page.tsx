import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

import { MembershipFAQs } from '../membership/MembershipFAQs'

export default function FaqsPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="ptp-section">
        <div className="ptp-container">
          <h1 className="ptp-h1 text-center uppercase tracking-tight">
            Questions We
            <br />
            Get A Lot
          </h1>
          <div className="mx-auto mt-12 max-w-3xl">
            <MembershipFAQs />
          </div>
        </div>
      </section>

      <FindYourNextBigDealBanner />
      <DualImageCta locale={locale} />
    </>
  )
}
