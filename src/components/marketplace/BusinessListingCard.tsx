import Link from 'next/link'
import Image from 'next/image'
import { Coins, MapPin, ShieldCheck, TrendingUp } from 'lucide-react'

import { type AppLocale } from '@/i18n/locales'
import { formatCurrency } from '@/lib/marketplace/format'
import { type BusinessListing, localizedListingField } from '@/lib/marketplace/types'

const fallbackCover =
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80'

interface BusinessListingCardProps {
  listing: BusinessListing
  locale: AppLocale
  cuisineLabel: string
  businessTypeLabel: string
  detailHref: string
  detailLabel: string
  visaLabels: { eb5: string; e2: string; sba: string }
  priceLabel: string
  revenueLabel: string
  verifiedLabel: string
}

export function BusinessListingCard({
  listing,
  locale,
  cuisineLabel,
  businessTypeLabel,
  detailHref,
  detailLabel,
  visaLabels,
  priceLabel,
  revenueLabel,
  verifiedLabel,
}: BusinessListingCardProps) {
  const title = localizedListingField(listing, 'title', locale)
  const description = localizedListingField(listing, 'description', locale)
  const coverImage = listing.cover_image_url ?? fallbackCover

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-[200px] overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/55 via-gray-950/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-900">
              {cuisineLabel}
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-900">
              {businessTypeLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-2xl font-bold text-gray-950">{title}</h2>

        <div className="mb-4 mt-3 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>
            {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
            {listing.city}, {listing.state}
          </span>
        </div>

        <p className="mb-5 flex-1 leading-relaxed text-gray-600">{description}</p>

        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              <Coins className="h-3.5 w-3.5" />
              {priceLabel}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-950">
              {formatCurrency(listing.asking_price, locale)}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              <TrendingUp className="h-3.5 w-3.5" />
              {revenueLabel}
            </p>
            <p className="mt-1 text-lg font-bold text-gray-950">
              {formatCurrency(listing.gross_revenue_annual, locale)}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {listing.visa_eligible_eb5 && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {visaLabels.eb5}
            </span>
          )}
          {listing.visa_eligible_e2 && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {visaLabels.e2}
            </span>
          )}
          {listing.sba_prequalified && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {visaLabels.sba}
            </span>
          )}
        </div>

        {listing.profiles && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm">
            <div>
              <p className="font-semibold text-gray-900">{listing.profiles.business_name}</p>
              <p className="text-xs text-gray-500">{listing.profiles.full_name}</p>
            </div>
            {listing.profiles.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {verifiedLabel}
              </span>
            )}
          </div>
        )}

        <Link href={detailHref} className="btn-secondary text-center">
          {detailLabel}
        </Link>
      </div>
    </article>
  )
}
