import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { type AppLocale } from '@/i18n/locales'
import { formatCurrencyRange } from '@/lib/marketplace/format'
import { listBuyerProfiles } from '@/lib/marketplace/queries'

export default async function BuyerDetailPage({
  params: { locale, id },
}: {
  params: { locale: AppLocale; id: string }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.buyers' })
  const buyerTypeT = await getTranslations({ locale, namespace: 'marketplace.buyerTypes' })
  const cuisineT = await getTranslations({ locale, namespace: 'marketplace.cuisines' })
  const typeT = await getTranslations({ locale, namespace: 'marketplace.businessTypes' })

  const { buyers } = await listBuyerProfiles()
  const buyer = buyers.find((entry) => entry.id === id)
  if (!buyer) notFound()

  return (
    <div className="ptp-container ptp-section">
      <section className="container pt-32 md:pt-40">
        <Link
          href={`/${locale}/marketplace/buyers`}
          className="text-sm font-semibold text-accent hover:text-accent-dark"
        >
          ← {t('title')}
        </Link>
        <h1 className="mt-6 section-title">{buyer.display_handle}</h1>
        <p className="mt-2 text-gray-600">{buyerTypeT(buyer.buyer_type)}</p>

        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          <Stat label={t('budget')} value={formatCurrencyRange(buyer.budget_min, buyer.budget_max, locale)} />
          <Stat
            label={t('targets')}
            value={[
              ...buyer.target_cuisines.map((c) => cuisineT(c)),
              ...buyer.target_business_types.map((b) => typeT(b)),
              ...buyer.target_states,
            ].join(' · ')}
          />
        </dl>

        {(locale === 'zh' && buyer.notes_zh ? buyer.notes_zh : buyer.notes) && (
          <p className="mt-6 max-w-2xl rounded-lg bg-white p-5 text-gray-700 shadow-sm">
            {locale === 'zh' && buyer.notes_zh ? buyer.notes_zh : buyer.notes}
          </p>
        )}
      </section>
      <div className="h-24" />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-950">{value}</dd>
    </div>
  )
}
