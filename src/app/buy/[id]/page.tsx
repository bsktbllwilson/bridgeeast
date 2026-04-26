import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { formatCentsCompact, formatCuisine } from '@/lib/format'
import { getListingById } from '@/lib/listings'

// Stub detail page so View Listing buttons don't 404. Full layout
// (gallery, financials, NDA gate, inquiry form) comes in a follow-up.
export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id)
  if (!listing) notFound()

  const location = [listing.neighborhood, listing.city, listing.state].filter(Boolean).join(', ')

  return (
    <Container className="py-16 md:py-24">
      <Link
        href="/buy"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-ink"
      >
        <span aria-hidden="true">←</span> All Listings
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-[1.6fr_1fr] md:items-start">
        <div>
          {listing.cover_image_url ? (
            <div
              aria-hidden="true"
              className="aspect-[16/10] w-full rounded-2xl bg-brand-ink/30 bg-cover bg-center"
              style={{ backgroundImage: `url('${listing.cover_image_url}')` }}
            />
          ) : null}

          <h1 className="mt-8 font-display text-4xl text-brand-ink md:text-5xl">{listing.title}</h1>
          {(location || listing.cuisine) && (
            <p className="mt-2 text-sm text-brand-muted">
              {[location, formatCuisine(listing.cuisine)].filter(Boolean).join(' · ')}
            </p>
          )}

          {listing.description ? (
            <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-brand-body">
              {listing.description}
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-brand-border bg-white p-6 md:sticky md:top-24">
          <dl className="grid grid-cols-2 gap-4 border-b border-brand-border pb-4">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-brand-muted">Asking Price</dt>
              <dd className="mt-1 font-display text-2xl text-brand-ink">
                {formatCentsCompact(listing.asking_price_cents)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-brand-muted">
                Annual Revenue
              </dt>
              <dd className="mt-1 font-display text-2xl text-brand-ink">
                {formatCentsCompact(listing.annual_revenue_cents)}
              </dd>
            </div>
            {listing.year_established ? (
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-brand-muted">
                  Established
                </dt>
                <dd className="mt-1 font-display text-2xl text-brand-ink">
                  {listing.year_established}
                </dd>
              </div>
            ) : null}
            {listing.staff_count ? (
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-brand-muted">Staff</dt>
                <dd className="mt-1 font-display text-2xl text-brand-ink">{listing.staff_count}</dd>
              </div>
            ) : null}
          </dl>

          <Button variant="primary" className="mt-6 w-full" arrow>
            Inquire About This Listing
          </Button>
        </aside>
      </div>
    </Container>
  )
}
