import { hasSupabaseAdminEnv, getSupabaseAdmin } from '@/lib/supabase-admin'
import { applyFilters, applySort } from '@/lib/marketplace/filters'
import {
  samplePtpBuyers,
  samplePtpListings,
  samplePtpMessages,
  samplePtpNdaAcceptances,
  samplePtpSavedSearches,
  samplePtpThreads,
} from '@/lib/marketplace/sample-data'
import {
  type BusinessListing,
  type BuyerProfile,
  type InquiryMessage,
  type InquiryThreadSummary,
  type ListingFilters,
  type ListingSort,
  type NdaAcceptance,
  type SavedSearch,
} from '@/lib/marketplace/types'

/**
 * All PTP queries fall back to in-memory sample data when Supabase admin env
 * vars aren't configured, mirroring the BridgeEast pattern. Once the migrations
 * are applied and env vars are present, the real Postgres tables take over.
 */

interface ListBusinessListingsOptions {
  filters?: ListingFilters
  sort?: ListingSort
  limit?: number
  includeAllStatuses?: boolean
}

export async function listBusinessListings(
  options: ListBusinessListingsOptions = {},
): Promise<{ listings: BusinessListing[]; mocked: boolean }> {
  const { filters, sort = 'newest', limit, includeAllStatuses = false } = options

  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      let query = supabase
        .from('ptp_business_listings')
        .select(
          '*, profiles:profile_id(id, full_name, business_name, verification_status)',
        )
      if (!includeAllStatuses) {
        query = query.eq('status', 'active')
      }
      const { data, error } = await query
      if (error) throw error
      const listings = applySort(applyFilters((data ?? []) as BusinessListing[], filters ?? {}), sort)
      return { listings: limit ? listings.slice(0, limit) : listings, mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample listings:', error)
    }
  }

  const filtered = applyFilters(
    includeAllStatuses ? samplePtpListings : samplePtpListings.filter((listing) => listing.status === 'active'),
    filters ?? {},
  )
  const sorted = applySort(filtered, sort)
  return { listings: limit ? sorted.slice(0, limit) : sorted, mocked: true }
}

export async function getBusinessListing(
  listingId: string,
): Promise<{ listing: BusinessListing | null; mocked: boolean }> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('ptp_business_listings')
        .select('*, profiles:profile_id(id, full_name, business_name, verification_status)')
        .eq('id', listingId)
        .maybeSingle()
      if (error) throw error
      return { listing: (data as BusinessListing | null) ?? null, mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample listing:', error)
    }
  }

  return { listing: samplePtpListings.find((listing) => listing.id === listingId) ?? null, mocked: true }
}

export async function listBuyerProfiles(): Promise<{ buyers: BuyerProfile[]; mocked: boolean }> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('ptp_buyer_profiles')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return { buyers: (data ?? []) as BuyerProfile[], mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample buyers:', error)
    }
  }

  return { buyers: samplePtpBuyers.filter((buyer) => buyer.is_visible), mocked: true }
}

export async function listNdaAcceptancesForBuyer(
  buyerProfileId: string,
): Promise<{ acceptances: NdaAcceptance[]; mocked: boolean }> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('ptp_nda_acceptances')
        .select('*')
        .eq('buyer_profile_id', buyerProfileId)
      if (error) throw error
      return { acceptances: (data ?? []) as NdaAcceptance[], mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample NDA acceptances:', error)
    }
  }

  return {
    acceptances: samplePtpNdaAcceptances.filter((acceptance) => acceptance.buyer_profile_id === buyerProfileId),
    mocked: true,
  }
}

export async function listInquiryThreadsForProfile(
  profileId: string,
  role: 'buyer' | 'seller',
): Promise<{ threads: InquiryThreadSummary[]; mocked: boolean }> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      const column = role === 'buyer' ? 'buyer_profile_id' : 'seller_profile_id'
      const { data, error } = await supabase
        .from('ptp_inquiry_threads')
        .select('*')
        .eq(column, profileId)
        .order('last_message_at', { ascending: false })
      if (error) throw error
      return { threads: (data ?? []) as InquiryThreadSummary[], mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample threads:', error)
    }
  }

  const column = role === 'buyer' ? 'buyer_profile_id' : 'seller_profile_id'
  return {
    threads: samplePtpThreads.filter((thread) => thread[column] === profileId),
    mocked: true,
  }
}

export async function getInquiryMessages(
  threadId: string,
): Promise<{ messages: InquiryMessage[]; mocked: boolean }> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('ptp_inquiry_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('sent_at', { ascending: true })
      if (error) throw error
      return { messages: (data ?? []) as InquiryMessage[], mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample messages:', error)
    }
  }

  return { messages: samplePtpMessages[threadId] ?? [], mocked: true }
}

export async function listSavedSearches(
  profileId: string,
): Promise<{ searches: SavedSearch[]; mocked: boolean }> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('ptp_saved_searches')
        .select('*')
        .eq('profile_id', profileId)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return { searches: (data ?? []) as SavedSearch[], mocked: false }
    } catch (error) {
      console.warn('[ptp] falling back to sample saved searches:', error)
    }
  }

  return { searches: samplePtpSavedSearches.filter((search) => search.profile_id === profileId), mocked: true }
}
