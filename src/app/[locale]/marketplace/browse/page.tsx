import { getTranslations } from 'next-intl/server'

import { BusinessListingCard } from '@/components/marketplace/BusinessListingCard'
import { ListingFilters } from '@/components/marketplace/ListingFilters'
import { type AppLocale } from '@/i18n/locales'
import { parseFiltersFromSearchParams, parseSortFromSearchParams } from '@/lib/marketplace/filters'
import { listBusinessListings } from '@/lib/marketplace/queries'

export default async function BrowsePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace' })
  const cuisineT = await getTranslations({ locale, namespace: 'marketplace.cuisines' })
  const typeT = await getTranslations({ locale, namespace: 'marketplace.businessTypes' })
  const listingT = await getTranslations({ locale, namespace: 'marketplace.listing' })
  const commonT = await getTranslations({ locale, namespace: 'common' })

  const filters = parseFiltersFromSearchParams(searchParams)
  const sort = parseSortFromSearchParams(searchParams)
  const { listings } = await listBusinessListings({ filters, sort })

  return (
    <div className="ptp-container ptp-section">

      <section className="container pt-32 md:pt-40">
        <div className="max-w-3xl">
          <h1 className="section-title">{t('browse.title')}</h1>
          <p className="mt-3 text-gray-600">{t('browse.subtitle')}</p>
        </div>
      </section>

      <section className="container py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <ListingFilters basePath={`/${locale}/marketplace/browse`} totalResults={listings.length} />

          <div>
            {listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                {t('browse.noResults')}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          </div>
        </div>
      </section>
    </div>
  )
}
