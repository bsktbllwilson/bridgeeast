import { getTranslations } from 'next-intl/server'

import { SellerOnboardingStepper } from '@/components/marketplace/SellerOnboardingStepper'
import { type AppLocale } from '@/i18n/locales'

export default async function NewListingPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.newListing' })

  return (
    <div className="ptp-container ptp-section">
      <section className="container pt-32 md:pt-40">
        <div className="max-w-3xl">
          <h1 className="section-title">{t('title')}</h1>
          <p className="mt-3 text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="mt-10">
          <SellerOnboardingStepper />
        </div>
      </section>
      <div className="h-24" />
    </div>
  )
}
