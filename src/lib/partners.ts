import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type Partner = Tables<'partners'>

export type PartnerSort = 'featured' | 'newest' | 'az' | 'za'

export type PartnerFilters = {
  specialty?: string
  sort?: PartnerSort
  page?: number
  perPage?: number
}

export type PartnersPage = {
  rows: Partner[]
  totalCount: number
  totalPages: number
  page: number
  perPage: number
}

const DEFAULT_PER_PAGE = 12

function isSupabaseConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export async function getPartners(filters: PartnerFilters = {}): Promise<PartnersPage> {
  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.max(1, filters.perPage ?? DEFAULT_PER_PAGE)
  const sort = filters.sort ?? 'featured'

  if (!isSupabaseConfigured()) {
    return { rows: [], totalCount: 0, totalPages: 0, page, perPage }
  }

  const supabase = createClient()

  let query = supabase.from('partners').select('*', { count: 'exact' }).eq('approved', true)

  if (filters.specialty) {
    query = query.eq('specialty', filters.specialty)
  }

  query = applySort(query, sort)

  const from = (page - 1) * perPage
  const { data, count, error } = await query.range(from, from + perPage - 1)

  if (error) {
    console.error('[getPartners] supabase error', error)
    return { rows: [], totalCount: 0, totalPages: 0, page, perPage }
  }

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  return { rows: data ?? [], totalCount, totalPages, page, perPage }
}

export async function getFeaturedPartners(limit = 3): Promise<Partner[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('approved', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getFeaturedPartners] supabase error', error)
    return []
  }
  return data ?? []
}

// Postgrest builder is generic enough that we can just chain .order()
// calls — typed as `any` here to keep the helper readable.
function applySort<Q extends { order: (col: string, opts?: { ascending: boolean }) => Q }>(
  query: Q,
  sort: PartnerSort,
): Q {
  switch (sort) {
    case 'newest':
      return query.order('created_at', { ascending: false })
    case 'az':
      return query.order('full_name', { ascending: true })
    case 'za':
      return query.order('full_name', { ascending: false })
    case 'featured':
    default:
      return query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }
}
