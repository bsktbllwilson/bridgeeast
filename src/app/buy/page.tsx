import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { FilterBar } from '@/components/marketplace/filter-bar'
import { ListingCard } from '@/components/marketplace/listing-card'
import { Pagination } from '@/components/marketplace/pagination'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { getListings } from '@/lib/listings'

type SearchParams = Record<string, string | string[] | undefined>

function pickString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

function pickList(v: string | string[] | undefined): string[] | undefined {
  if (!v) return undefined
  const raw = Array.isArray(v) ? v.join(',') : v
  const out = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return out.length ? out : undefined
}

function pickInt(v: string | string[] | undefined): number | undefined {
  const s = pickString(v)
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

export default async function BuyPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = {
    q: pickString(searchParams.q),
    industry: pickList(searchParams.industry),
    location: pickList(searchParams.location),
    minPrice: pickInt(searchParams.minPrice),
    maxPrice: pickInt(searchParams.maxPrice),
    minRevenue: pickInt(searchParams.minRevenue),
    maxRevenue: pickInt(searchParams.maxRevenue),
    page: pickInt(searchParams.page) ?? 1,
    perPage: 12,
  }

  const { rows, totalCount, totalPages, page } = await getListings(filters)

  return (
    <>
      <section className="bg-brand-cream pb-10 pt-16 md:pb-12 md:pt-24">
        <Container>
          <form
            action="/buy"
            method="get"
            className="mx-auto flex w-full max-w-[720px] items-center gap-2 rounded-full border border-brand-border bg-white p-2 shadow-sm"
            aria-label="Search listings"
          >
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ''}
              placeholder="Keywords"
              aria-label="Keywords"
              className="h-12 flex-1 rounded-full bg-transparent px-5 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none"
            />
            <Button type="submit" variant="primary" arrow>
              Search
            </Button>
          </form>

          <div className="mx-auto mt-6 flex max-w-[1280px] flex-wrap items-center justify-center gap-3">
            <FilterBar />
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <p className="mb-6 text-sm text-brand-muted">
            {totalCount === 0
              ? 'No listings match your filters.'
              : `Showing ${rows.length} of ${totalCount} ${totalCount === 1 ? 'listing' : 'listings'}`}
          </p>

          {rows.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((listing) => (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              ))}
            </ul>
          ) : null}

          <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
        </Container>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
    </>
  )
}
