import { BecomePartnerBand } from '@/components/marketing/become-partner-band'
import { BuySellSplit } from '@/components/marketing/buy-sell-split'
import { FindYourNextBigDeal } from '@/components/marketing/find-your-next-big-deal'
import { FeaturedPartners } from '@/components/partners/featured-partners'
import { PartnerRows } from '@/components/partners/partner-rows'
import { PartnersFilterBar } from '@/components/partners/partners-filter-bar'
import type { CurrentUserHint } from '@/components/partners/send-message-modal'
import { Pagination } from '@/components/marketplace/pagination'
import { Container } from '@/components/ui/container'
import { getCurrentProfile } from '@/lib/auth'
import { getPartners, type PartnerSort } from '@/lib/partners'

export const metadata = {
  title: 'The Yellow Pages · Pass The Plate',
  description:
    'Vetted SBA lenders, immigration attorneys, bilingual brokers, and accountants serving Asian F&B operators.',
}

type SearchParams = Record<string, string | string[] | undefined>

function pickString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

function pickInt(v: string | string[] | undefined): number | undefined {
  const s = pickString(v)
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

const VALID_SORTS: PartnerSort[] = ['featured', 'newest', 'az', 'za']
function pickSort(v: string | string[] | undefined): PartnerSort | undefined {
  const s = pickString(v) as PartnerSort | undefined
  return s && VALID_SORTS.includes(s) ? s : undefined
}

export default async function PartnersPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = {
    specialty: pickString(searchParams.specialty),
    sort: pickSort(searchParams.sort),
    page: pickInt(searchParams.page) ?? 1,
    perPage: 12,
  }

  const [{ rows, totalCount, totalPages, page }, profile] = await Promise.all([
    getPartners(filters),
    getCurrentProfile(),
  ])
  const currentUser: CurrentUserHint = profile
    ? { email: profile.email, fullName: profile.full_name }
    : null

  return (
    <>
      <section className="bg-brand-yellow py-12 md:py-16">
        <Container>
          <PartnersFilterBar />
        </Container>

        <Container className="mt-10">
          <p className="mb-4 text-sm text-brand-ink/70">
            {totalCount === 0
              ? 'No partners match your filters.'
              : `${totalCount} ${totalCount === 1 ? 'partner' : 'partners'}`}
          </p>
          <PartnerRows partners={rows} currentUser={currentUser} />
          <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
        </Container>
      </section>

      <FeaturedPartners currentUser={currentUser} />
      <BecomePartnerBand />
      <FindYourNextBigDeal />
      <BuySellSplit />
    </>
  )
}
