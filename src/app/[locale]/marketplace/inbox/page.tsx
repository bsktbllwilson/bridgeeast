import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { type AppLocale } from '@/i18n/locales'
import { formatRelative } from '@/lib/marketplace/format'
import { listInquiryThreadsForProfile } from '@/lib/marketplace/queries'
import { samplePtpListings } from '@/lib/marketplace/sample-data'

const SCAFFOLD_PROFILE_ID = '11111111-1111-1111-1111-111111111111'

export default async function InboxPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.inbox' })

  // Until auth is wired, we show the seller-side view for the demo profile.
  const { threads } = await listInquiryThreadsForProfile(SCAFFOLD_PROFILE_ID, 'seller')

  return (
    <div className="ptp-container ptp-section">
      <section className="container pt-32 md:pt-40">
        <h1 className="section-title">{t('title')}</h1>

        <div className="mt-8 grid gap-3">
          {threads.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              {t('empty')}
            </p>
          ) : (
            threads.map((thread) => {
              const listing = samplePtpListings.find((entry) => entry.id === thread.listing_id)
              return (
                <Link
                  key={thread.id}
                  href={`/${locale}/marketplace/inbox/${thread.id}`}
                  className="card flex flex-col gap-1 p-5 hover:border-accent"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-bold text-gray-950">
                      {thread.subject ?? listing?.title ?? thread.id}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatRelative(thread.last_message_at, locale)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {listing ? `${listing.city}, ${listing.state}` : '—'}
                  </p>
                </Link>
              )
            })
          )}
        </div>
      </section>
      <div className="h-24" />
    </div>
  )
}
