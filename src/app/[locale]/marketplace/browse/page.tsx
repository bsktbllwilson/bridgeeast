import { ArrowLeft, ArrowRight } from 'lucide-react'

import { DualImageCta } from '@/components/ptp/DualImageCta'
import { FindYourNextBigDealBanner } from '@/components/ptp/FindYourNextBigDealBanner'
import { PtpBrowseToolbar } from '@/components/ptp/PtpBrowseToolbar'
import { PtpListingCard } from '@/components/ptp/PtpListingCard'
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
  const filters = parseFiltersFromSearchParams(searchParams)
  const sort = parseSortFromSearchParams(searchParams)
  const { listings } = await listBusinessListings({ filters, sort })

  return (
    <>
      <div className="pt-12 md:pt-20">
        <PtpBrowseToolbar />
      </div>

      <section className="ptp-section pt-10">
        <div className="ptp-container">
          {listings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ptp-ink/15 bg-white p-12 text-center text-ptp-ink/60">
              No listings match these filters yet — try widening your search.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <PtpListingCard key={listing.id} listing={listing} locale={locale} />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between text-sm font-medium text-ptp-ink/70">
            <button type="button" className="inline-flex items-center gap-2 transition hover:text-ptp-ink">
              <ArrowLeft className="h-4 w-4" />
              Previous Page
            </button>
            <button type="button" className="inline-flex items-center gap-2 transition hover:text-ptp-ink">
              Next Page
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <FindYourNextBigDealBanner />
      <DualImageCta locale={locale} />
    </>
  )
}
