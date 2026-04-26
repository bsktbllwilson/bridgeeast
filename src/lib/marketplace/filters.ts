import {
  BUSINESS_TYPES,
  CUISINE_TYPES,
  type BusinessType,
  type CuisineType,
  type ListingFilters,
  type ListingSort,
  type BusinessListing,
} from '@/lib/marketplace/types'

const LISTING_SORTS: ListingSort[] = ['newest', 'price_low', 'price_high', 'revenue_high']

function parseList<T extends string>(value: string | null, allowed: readonly T[]): T[] | undefined {
  if (!value) return undefined
  const items = value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0) as T[]
  const filtered = items.filter((entry) => allowed.includes(entry))
  return filtered.length > 0 ? filtered : undefined
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseBool(value: string | null): boolean | undefined {
  if (value == null) return undefined
  if (value === '1' || value === 'true') return true
  if (value === '0' || value === 'false') return false
  return undefined
}

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): ListingFilters {
  const get = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key)
    const raw = searchParams[key]
    if (Array.isArray(raw)) return raw[0] ?? null
    return raw ?? null
  }

  return {
    q: get('q') || undefined,
    cuisine_types: parseList<CuisineType>(get('cuisine'), CUISINE_TYPES),
    business_types: parseList<BusinessType>(get('type'), BUSINESS_TYPES),
    states: get('state')
      ? get('state')!
          .split(',')
          .map((entry) => entry.trim().toUpperCase())
          .filter(Boolean)
      : undefined,
    cities: get('city')
      ? get('city')!
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      : undefined,
    price_min: parseNumber(get('price_min')),
    price_max: parseNumber(get('price_max')),
    revenue_min: parseNumber(get('revenue_min')),
    lease_remaining_min: parseNumber(get('lease_min')),
    visa_eb5: parseBool(get('eb5')),
    visa_e2: parseBool(get('e2')),
    sba: parseBool(get('sba')),
  }
}

export function parseSortFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): ListingSort {
  const raw =
    searchParams instanceof URLSearchParams
      ? searchParams.get('sort')
      : Array.isArray(searchParams.sort)
        ? searchParams.sort[0]
        : searchParams.sort
  return LISTING_SORTS.includes(raw as ListingSort) ? (raw as ListingSort) : 'newest'
}

export function filtersToSearchParams(filters: ListingFilters, sort?: ListingSort): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.cuisine_types?.length) params.set('cuisine', filters.cuisine_types.join(','))
  if (filters.business_types?.length) params.set('type', filters.business_types.join(','))
  if (filters.states?.length) params.set('state', filters.states.join(','))
  if (filters.cities?.length) params.set('city', filters.cities.join(','))
  if (filters.price_min != null) params.set('price_min', String(filters.price_min))
  if (filters.price_max != null) params.set('price_max', String(filters.price_max))
  if (filters.revenue_min != null) params.set('revenue_min', String(filters.revenue_min))
  if (filters.lease_remaining_min != null) params.set('lease_min', String(filters.lease_remaining_min))
  if (filters.visa_eb5) params.set('eb5', '1')
  if (filters.visa_e2) params.set('e2', '1')
  if (filters.sba) params.set('sba', '1')
  if (sort && sort !== 'newest') params.set('sort', sort)
  return params
}

export function applyFilters(listings: BusinessListing[], filters: ListingFilters): BusinessListing[] {
  return listings.filter((listing) => {
    if (filters.q) {
      const haystack = [listing.title, listing.title_zh, listing.description, listing.city, listing.neighborhood]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(filters.q.toLowerCase())) return false
    }
    if (filters.cuisine_types?.length && !filters.cuisine_types.includes(listing.cuisine_type)) return false
    if (filters.business_types?.length && !filters.business_types.includes(listing.business_type)) return false
    if (filters.states?.length && !filters.states.includes(listing.state.toUpperCase())) return false
    if (filters.cities?.length && !filters.cities.some((c) => listing.city.toLowerCase() === c.toLowerCase())) return false
    if (filters.price_min != null && (listing.asking_price ?? 0) < filters.price_min) return false
    if (filters.price_max != null && (listing.asking_price ?? Infinity) > filters.price_max) return false
    if (filters.revenue_min != null && (listing.gross_revenue_annual ?? 0) < filters.revenue_min) return false
    if (
      filters.lease_remaining_min != null &&
      (listing.lease_remaining_months ?? 0) < filters.lease_remaining_min
    ) {
      return false
    }
    if (filters.visa_eb5 && !listing.visa_eligible_eb5) return false
    if (filters.visa_e2 && !listing.visa_eligible_e2) return false
    if (filters.sba && !listing.sba_prequalified) return false
    return true
  })
}

export function applySort(listings: BusinessListing[], sort: ListingSort): BusinessListing[] {
  const cloned = [...listings]
  switch (sort) {
    case 'price_low':
      return cloned.sort((a, b) => (a.asking_price ?? Infinity) - (b.asking_price ?? Infinity))
    case 'price_high':
      return cloned.sort((a, b) => (b.asking_price ?? -Infinity) - (a.asking_price ?? -Infinity))
    case 'revenue_high':
      return cloned.sort((a, b) => (b.gross_revenue_annual ?? -Infinity) - (a.gross_revenue_annual ?? -Infinity))
    case 'newest':
    default:
      return cloned.sort(
        (a, b) =>
          new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime(),
      )
  }
}

export function isEmptyFilters(filters: ListingFilters): boolean {
  return Object.values(filters).every((value) => {
    if (value == null) return true
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'string') return value.length === 0
    if (typeof value === 'boolean') return value === false
    return false
  })
}
