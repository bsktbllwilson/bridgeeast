import { ShieldCheck, Target, Wallet } from 'lucide-react'

import { type AppLocale } from '@/i18n/locales'
import { formatCurrencyRange } from '@/lib/marketplace/format'
import { type BuyerProfile } from '@/lib/marketplace/types'

interface BuyerProfileCardProps {
  buyer: BuyerProfile
  locale: AppLocale
  buyerTypeLabel: string
  cuisineLabels: Record<string, string>
  businessTypeLabels: Record<string, string>
  labels: {
    type: string
    budget: string
    targets: string
    verified: string
  }
}

export function BuyerProfileCard({
  buyer,
  locale,
  buyerTypeLabel,
  cuisineLabels,
  businessTypeLabels,
  labels,
}: BuyerProfileCardProps) {
  return (
    <article className="card flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-950">{buyer.display_handle}</p>
        {buyer.verification_status === 'verified' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {labels.verified}
          </span>
        )}
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Target className="mt-0.5 h-4 w-4 text-accent" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{labels.type}</dt>
            <dd className="text-gray-900">{buyerTypeLabel}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Wallet className="mt-0.5 h-4 w-4 text-accent" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{labels.budget}</dt>
            <dd className="text-gray-900">{formatCurrencyRange(buyer.budget_min, buyer.budget_max, locale)}</dd>
          </div>
        </div>
      </dl>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{labels.targets}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {buyer.target_cuisines.map((cuisine) => (
            <span key={cuisine} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {cuisineLabels[cuisine] ?? cuisine}
            </span>
          ))}
          {buyer.target_business_types.map((type) => (
            <span key={type} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {businessTypeLabels[type] ?? type}
            </span>
          ))}
          {buyer.target_states.map((state) => (
            <span key={state} className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
              {state}
            </span>
          ))}
        </div>
      </div>

      {(locale === 'zh' && buyer.notes_zh ? buyer.notes_zh : buyer.notes) && (
        <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          {locale === 'zh' && buyer.notes_zh ? buyer.notes_zh : buyer.notes}
        </p>
      )}
    </article>
  )
}
