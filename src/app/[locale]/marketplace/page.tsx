import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BusinessListingCard } from '@/components/marketplace/BusinessListingCard'
import { type AppLocale } from '@/i18n/locales'
import { listBusinessListings } from '@/lib/marketplace/queries'

export default async function MarketplaceHomePage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace' })
  const cuisineT = await getTranslations({ locale, namespace: 'marketplace.cuisines' })
  const typeT = await getTranslations({ locale, namespace: 'marketplace.businessTypes' })
  const listingT = await getTranslations({ locale, namespace: 'marketplace.listing' })
  const commonT = await getTranslations({ locale, namespace: 'common' })

  const { listings } = await listBusinessListings({ limit: 4 })

  const browseHref = `/${locale}/marketplace/browse`
  const sellHref = `/${locale}/marketplace/listings/new`

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="badge mb-6">{t('home.heroBadge')}</p>
          <h1 className="section-title">{t('home.heroTitle')}</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">{t('home.heroSubtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={browseHref} className="btn-primary">
              {t('home.primaryCta')}
            </Link>
            <Link href={sellHref} className="btn-secondary">
              {t('home.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat value={t('home.stats.marketSize')} label={t('home.stats.marketSizeLabel')} />
          <Stat value={listings.length.toString()} label={t('home.stats.listings')} />
          <Stat value="3+" label={t('home.stats.buyers')} />
          <Stat value="4" label={t('home.stats.languages')} />
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <h2 className="section-title">{t('home.valueProps.title')}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <article key={index} className="card p-6">
                <h3 className="text-xl font-bold text-gray-950">
                  {t(`home.valueProps.items.${index}.title`)}
                </h3>
                <p className="mt-2 leading-relaxed text-gray-600">
                  {t(`home.valueProps.items.${index}.body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t('browse.title')}</h2>
            <p className="mt-2 text-gray-600">{t('browse.subtitle')}</p>
          </div>
          <Link href={browseHref} className="btn-outline">
            {t('nav.browse')}
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-500">{commonT('loading')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <BusinessListingCard
                key={listing.id}
                listing={listing}
                locale={locale}
                cuisineLabel={cuisineT(listing.cuisine_type)}
                businessTypeLabel={typeT(listing.business_type)}
                detailHref={`/${locale}/marketplace/listings/${listing.id}`}
                detailLabel={commonT('viewListingDetails')}
                priceLabel={listingT('askingPrice')}
                revenueLabel={listingT('grossRevenue')}
                visaLabels={{
                  eb5: listingT('eb5Eligible'),
                  e2: listingT('e2Eligible'),
                  sba: listingT('sbaPrequalified'),
                }}
                verifiedLabel={commonT('verification.verified')}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <h2 className="section-title">{t('home.buyerTypesTitle')}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BuyerTypeChip label={t('home.buyerTypes.operators')} />
            <BuyerTypeChip label={t('home.buyerTypes.searchFunds')} />
            <BuyerTypeChip label={t('home.buyerTypes.visa')} />
            <BuyerTypeChip label={t('home.buyerTypes.sba')} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-gray-950">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}

function BuyerTypeChip({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm font-semibold text-gray-900 shadow-sm">
      {label}
    </div>
  )
}
