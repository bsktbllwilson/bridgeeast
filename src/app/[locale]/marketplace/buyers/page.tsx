import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BuyerProfileCard } from '@/components/marketplace/BuyerProfileCard'
import { type AppLocale } from '@/i18n/locales'
import { listBuyerProfiles } from '@/lib/marketplace/queries'
import { CUISINE_TYPES, BUSINESS_TYPES } from '@/lib/marketplace/types'

export default async function BuyersPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.buyers' })
  const buyerTypeT = await getTranslations({ locale, namespace: 'marketplace.buyerTypes' })
  const cuisineT = await getTranslations({ locale, namespace: 'marketplace.cuisines' })
  const typeT = await getTranslations({ locale, namespace: 'marketplace.businessTypes' })

  const { buyers } = await listBuyerProfiles()

  const cuisineLabels = Object.fromEntries(CUISINE_TYPES.map((c) => [c, cuisineT(c)]))
  const businessTypeLabels = Object.fromEntries(BUSINESS_TYPES.map((b) => [b, typeT(b)]))

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="container pt-32 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="section-title">{t('title')}</h1>
            <p className="mt-3 text-gray-600">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/marketplace/buyers/new`} className="btn-primary">
            {t('createCta')}
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {buyers.map((buyer) => (
            <BuyerProfileCard
              key={buyer.id}
              buyer={buyer}
              locale={locale}
              buyerTypeLabel={buyerTypeT(buyer.buyer_type)}
              cuisineLabels={cuisineLabels}
              businessTypeLabels={businessTypeLabels}
              labels={{
                type: t('type'),
                budget: t('budget'),
                targets: t('targets'),
                verified: t('verified'),
              }}
            />
          ))}
        </div>
      </section>
      <div className="h-24" />
      <Footer />
    </main>
  )
}
