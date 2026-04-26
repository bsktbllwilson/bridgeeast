import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { InquiryThread } from '@/components/marketplace/InquiryThread'
import { type AppLocale } from '@/i18n/locales'
import { getInquiryMessages } from '@/lib/marketplace/queries'
import { samplePtpListings, samplePtpThreads } from '@/lib/marketplace/sample-data'

export default async function InquiryThreadPage({
  params: { locale, threadId },
}: {
  params: { locale: AppLocale; threadId: string }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.inbox' })
  const commonT = await getTranslations({ locale, namespace: 'common' })

  const thread = samplePtpThreads.find((entry) => entry.id === threadId)
  if (!thread) notFound()
  const listing = samplePtpListings.find((entry) => entry.id === thread.listing_id) ?? null
  const { messages } = await getInquiryMessages(threadId)

  return (
    <div className="ptp-container ptp-section">
      <section className="container pt-32 md:pt-40">
        <Link
          href={`/${locale}/marketplace/inbox`}
          className="text-sm font-semibold text-accent hover:text-accent-dark"
        >
          ← {t('title')}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <h1 className="text-3xl font-bold text-gray-950">
              {thread.subject ?? listing?.title ?? threadId}
            </h1>
            {listing && (
              <p className="mt-2 text-sm text-gray-500">
                {listing.city}, {listing.state}
              </p>
            )}

            <div className="mt-6 card p-6">
              <InquiryThread initialMessages={messages} currentRole="seller" locale={locale} />
            </div>
          </div>

          <aside className="space-y-3">
            {listing && (
              <Link
                href={`/${locale}/marketplace/listings/${listing.id}`}
                className="card flex flex-col gap-1 p-4 hover:border-accent"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {commonT('viewListingDetails')}
                </p>
                <p className="text-base font-bold text-gray-950">{listing.title}</p>
              </Link>
            )}
          </aside>
        </div>
      </section>
      <div className="h-24" />
    </div>
  )
}
