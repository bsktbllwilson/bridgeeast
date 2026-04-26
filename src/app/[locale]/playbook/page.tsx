import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { type AppLocale } from '@/i18n/locales'

import { PlaybookGrid } from './PlaybookGrid'

export default function PlaybookIndexPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  return (
    <>
      <section className="relative">
        <div className="relative aspect-[16/8] w-full overflow-hidden md:aspect-[16/6]">
          <img
            src="https://images.unsplash.com/photo-1556909114-44e3e9699e2b?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="ptp-container relative flex h-full items-center justify-center">
            <h1 className="ptp-h1 text-center text-ptp-cream md:text-[7.5rem]">
              The Playbook
            </h1>
          </div>
        </div>
      </section>

      <PlaybookGrid locale={locale} />

      <FindYourNextBigDealBanner />
      <DualImageCta locale={locale} />
    </>
  )
}
