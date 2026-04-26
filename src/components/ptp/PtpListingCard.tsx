import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { type BusinessListing, type CuisineType } from '@/lib/marketplace/types'
import { ptpRoute } from '@/lib/ptp/nav'

const CUISINE_LABEL: Record<CuisineType, string> = {
  chinese: 'Chinese',
  korean: 'Korean',
  japanese: 'Japanese',
  vietnamese: 'Vietnamese',
  thai: 'Thai',
  filipino: 'Filipino',
  malaysian: 'Malaysian',
  pan_asian: 'Pan-Asian',
  other: 'Other',
}

function formatMoney(value: number | null) {
  if (value == null) return '—'
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, '')}M`
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`
  }
  return `$${value.toLocaleString()}`
}

export function PtpListingCard({
  listing,
  locale,
}: {
  listing: BusinessListing
  locale: string
}) {
  const detailHref = ptpRoute(`/listings/${listing.id}`, locale)
  const location = [listing.city, listing.state].filter(Boolean).join(', ')

  return (
    <article className="ptp-card flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-ptp-cream-soft">
        {listing.cover_image_url ? (
          <img
            src={listing.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ptp-orange/20 to-ptp-yellow/30" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="ptp-display text-xl text-ptp-ink leading-tight">{listing.title}</h3>
        <p className="mt-1 text-xs text-ptp-ink/60">
          {location}
          {location && ' | '}
          {CUISINE_LABEL[listing.cuisine_type]}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat label="Asking Price" value={formatMoney(listing.asking_price)} />
          <Stat label="Annual Revenue" value={formatMoney(listing.gross_revenue_annual)} />
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ptp-ink/70">
          {listing.description}
        </p>

        <div className="mt-5 flex justify-center">
          <Link href={detailHref} className="ptp-btn-primary text-sm">
            View Listing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ptp-cream-soft px-3 py-2">
      <p className="text-[0.625rem] uppercase tracking-wide text-ptp-ink/55">{label}</p>
      <p className="ptp-display text-base text-ptp-ink">{value}</p>
    </div>
  )
}
