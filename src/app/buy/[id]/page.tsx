import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { InquireCard } from '@/components/marketplace/inquire-card'
import { ListingGallery } from '@/components/marketplace/listing-gallery'
import { Badge } from '@/components/ui/badge'
import { Card, CardBody } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { getCurrentProfile } from '@/lib/auth'
import { formatCentsCompact, formatCuisine } from '@/lib/format'
import { getListingById, incrementListingViews } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, profile] = await Promise.all([getListingById(params.id), getCurrentProfile()])
  if (!listing) notFound()

  // Fire and forget — don't block the page on the counter bump.
  void incrementListingViews(params.id)

  const inquireMode = !profile
    ? ({ kind: 'guest' } as const)
    : profile.proof_of_funds_verified
      ? ({ kind: 'verified' } as const)
      : ({ kind: 'unverified' } as const)

  const location = [listing.neighborhood, listing.city, listing.state].filter(Boolean).join(', ')
  const cuisine = formatCuisine(listing.cuisine)
  const assets = parseAssets(listing.assets)

  return (
    <>
      <Container className="pt-12 md:pt-16">
        <Link
          href="/buy"
          className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-ink"
        >
          <span aria-hidden="true">←</span> All Listings
        </Link>
      </Container>

      <Container className="mt-6">
        <ListingGallery
          cover={listing.cover_image_url}
          gallery={listing.gallery_urls ?? []}
          alt={listing.title}
        />
      </Container>

      <Container className="mt-12 md:mt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-display text-4xl leading-tight text-brand-ink md:text-5xl">
              {listing.title}
            </h1>
            {(location || cuisine) && (
              <p className="mt-2 text-sm text-brand-muted">
                {[location, cuisine].filter(Boolean).join(' · ')}
              </p>
            )}

            {listing.description ? (
              <section className="mt-10">
                <h2 className="font-display text-2xl text-brand-ink">About this business</h2>
                <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-brand-body">
                  {listing.description}
                </div>
              </section>
            ) : null}

            {assets.length > 0 ? (
              <section className="mt-10">
                <h2 className="font-display text-2xl text-brand-ink">Assets &amp; equipment</h2>
                <ul className="mt-4 list-disc space-y-1 pl-6 text-base text-brand-body">
                  {assets.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-10 grid grid-cols-1 gap-6 border-y border-brand-border py-8 sm:grid-cols-3">
              <Stat label="Year established" value={listing.year_established?.toString() ?? '—'} />
              <Stat label="Staff" value={listing.staff_count?.toString() ?? '—'} />
              <Stat
                label="Square footage"
                value={
                  listing.square_footage ? `${listing.square_footage.toLocaleString()} sq ft` : '—'
                }
              />
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-24">
              <Card>
                <CardBody className="space-y-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-brand-muted">
                      Asking Price
                    </div>
                    <div className="mt-1 font-display text-4xl text-brand-ink">
                      {formatCentsCompact(listing.asking_price_cents)}
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-4 border-t border-brand-border pt-5">
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-brand-muted">
                        Annual Revenue
                      </dt>
                      <dd className="mt-1 font-display text-xl text-brand-ink">
                        {formatCentsCompact(listing.annual_revenue_cents)}
                      </dd>
                    </div>
                    {listing.annual_profit_cents != null ? (
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-brand-muted">
                          Annual Profit
                        </dt>
                        <dd className="mt-1 font-display text-xl text-brand-ink">
                          {formatCentsCompact(listing.annual_profit_cents)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {(listing.cuisine || listing.industry) && (
                    <div className="flex flex-wrap gap-2 border-t border-brand-border pt-5">
                      {cuisine ? <Badge variant="orange">{cuisine}</Badge> : null}
                      {listing.industry ? (
                        <Badge variant="default">{titleCase(listing.industry)}</Badge>
                      ) : null}
                    </div>
                  )}
                </CardBody>
              </Card>

              <InquireCard listingId={listing.id} listingTitle={listing.title} mode={inquireMode} />
            </div>
          </aside>
        </div>
      </Container>

      <FindYourNextBigDeal />
      <BuySellSplit />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-brand-muted">{label}</div>
      <div className="mt-1 font-display text-2xl text-brand-ink">{value}</div>
    </div>
  )
}

function titleCase(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseAssets(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
        return item.name
      }
      return null
    })
    .filter((s): s is string => !!s)
}
