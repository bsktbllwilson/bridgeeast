import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type Listing = Tables<'listings'>

export type ListingFilters = {
  q?: string
  industry?: string[]
  location?: string[]
  minPrice?: number
  maxPrice?: number
  minRevenue?: number
  maxRevenue?: number
  page?: number
  perPage?: number
}

export type ListingsPage = {
  rows: Listing[]
  totalCount: number
  totalPages: number
  page: number
  perPage: number
}

const DEFAULT_PER_PAGE = 12

function isSupabaseConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export async function getListings(filters: ListingFilters = {}): Promise<ListingsPage> {
  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.max(1, filters.perPage ?? DEFAULT_PER_PAGE)

  if (!isSupabaseConfigured()) {
    return { rows: [], totalCount: 0, totalPages: 0, page, perPage }
  }

  const supabase = createClient()

  let query = supabase.from('listings').select('*', { count: 'exact' }).eq('status', 'active')

  if (filters.q?.trim()) {
    const term = `%${escapeIlike(filters.q.trim())}%`
    // Postgrest .or() takes a comma-separated filter list.
    query = query.or(`title.ilike.${term},description.ilike.${term}`)
  }

  if (filters.industry?.length) {
    query = query.in('industry', filters.industry)
  }

  if (filters.location?.length) {
    // Match any of the selected locations against city/state/neighborhood.
    const clauses = filters.location.flatMap((loc) => {
      const term = `%${escapeIlike(loc)}%`
      return [`city.ilike.${term}`, `state.ilike.${term}`, `neighborhood.ilike.${term}`]
    })
    query = query.or(clauses.join(','))
  }

  if (typeof filters.minPrice === 'number') {
    query = query.gte('asking_price_cents', filters.minPrice)
  }
  if (typeof filters.maxPrice === 'number') {
    query = query.lte('asking_price_cents', filters.maxPrice)
  }
  if (typeof filters.minRevenue === 'number') {
    query = query.gte('annual_revenue_cents', filters.minRevenue)
  }
  if (typeof filters.maxRevenue === 'number') {
    query = query.lte('annual_revenue_cents', filters.maxRevenue)
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count, error } = await query
    .order('view_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[getListings] supabase error', error)
    return { rows: [], totalCount: 0, totalPages: 0, page, perPage }
  }

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  return { rows: (data as Listing[]) ?? [], totalCount, totalPages, page, perPage }
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = createClient()
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).maybeSingle()

  if (error) {
    console.error('[getListingById] supabase error', error)
    return null
  }
  return data
}

export async function incrementListingViews(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const supabase = createClient()
  const { error } = await supabase.rpc('increment_listing_views', { p_id: id })
  if (error) console.error('[incrementListingViews] supabase error', error)
}

// Postgrest's .or() / .ilike() use commas and parens as delimiters; escape
// them in user input so " ramen, japanese " doesn't break the filter.
function escapeIlike(value: string): string {
  return value.replace(/[,()*]/g, ' ').trim()
}
