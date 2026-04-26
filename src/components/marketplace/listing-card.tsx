import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCentsCompact, formatCuisine } from '@/lib/format'
import type { Listing } from '@/lib/listings'

export function ListingCard({ listing }: { listing: Listing }) {
  const location = [listing.city, listing.state].filter(Boolean).join(', ')
  const cuisine = formatCuisine(listing.cuisine)
  const locationPill = [location, cuisine].filter(Boolean).join(' | ')

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link
        href={`/buy/${listing.id}`}
        className="group block aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-brand-ink/30"
        aria-label={`View ${listing.title}`}
      >
        {listing.cover_image_url ? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${listing.cover_image_url}')` }}
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-2xl leading-tight text-brand-ink">
            <Link href={`/buy/${listing.id}`} className="hover:opacity-80">
              {listing.title}
            </Link>
          </h3>
          {locationPill ? <p className="mt-1 text-xs text-brand-muted">{locationPill}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-brand-border py-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-brand-muted">Asking Price</div>
            <div className="mt-1 font-display text-2xl leading-tight text-brand-ink">
              {formatCentsCompact(listing.asking_price_cents)}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-brand-muted">
              Annual Revenue
            </div>
            <div className="mt-1 font-display text-2xl leading-tight text-brand-ink">
              {formatCentsCompact(listing.annual_revenue_cents)}
            </div>
          </div>
        </div>

        {listing.description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-brand-body">
            {listing.description}
          </p>
        ) : null}

        <div className="mt-auto pt-2">
          <Link href={`/buy/${listing.id}`} className="block w-full">
            <Button variant="primary" className="w-full">
              View Listing
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
