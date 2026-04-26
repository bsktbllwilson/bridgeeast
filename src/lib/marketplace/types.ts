import { type AppLocale } from '@/i18n/locales'

export type CuisineType =
  | 'chinese'
  | 'korean'
  | 'japanese'
  | 'vietnamese'
  | 'thai'
  | 'filipino'
  | 'malaysian'
  | 'pan_asian'
  | 'other'

export const CUISINE_TYPES: CuisineType[] = [
  'chinese',
  'korean',
  'japanese',
  'vietnamese',
  'thai',
  'filipino',
  'malaysian',
  'pan_asian',
  'other',
]

export type BusinessType =
  | 'restaurant'
  | 'coffee_shop'
  | 'bubble_tea'
  | 'bakery'
  | 'izakaya'
  | 'ghost_kitchen'
  | 'grocery'
  | 'other'

export const BUSINESS_TYPES: BusinessType[] = [
  'restaurant',
  'coffee_shop',
  'bubble_tea',
  'bakery',
  'izakaya',
  'ghost_kitchen',
  'grocery',
  'other',
]

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'under_contract'
  | 'sold'
  | 'removed'

export type BuyerType =
  | 'operator'
  | 'search_fund'
  | 'eb5_e2'
  | 'sba'
  | 'family_office'
  | 'other'

export const BUYER_TYPES: BuyerType[] = [
  'operator',
  'search_fund',
  'eb5_e2',
  'sba',
  'family_office',
  'other',
]

export type AlertFrequency = 'instant' | 'daily' | 'weekly' | 'none'

export interface BusinessListing {
  id: string
  profile_id: string

  title: string
  title_zh: string | null
  title_ko: string | null
  title_vi: string | null
  description: string
  description_zh: string | null
  description_ko: string | null
  description_vi: string | null

  cuisine_type: CuisineType
  business_type: BusinessType

  city: string
  neighborhood: string | null
  state: string
  zip_code: string | null

  asking_price: number | null
  gross_revenue_annual: number | null
  cash_flow_annual: number | null
  monthly_rent: number | null
  lease_remaining_months: number | null
  lease_renewal_options: string | null
  sqft: number | null
  employees_ft: number | null
  employees_pt: number | null

  equipment_included: string[]
  reason_for_sale: string | null
  reason_for_sale_zh: string | null
  seller_notes: string | null
  seller_notes_zh: string | null

  visa_eligible_eb5: boolean
  visa_eligible_e2: boolean
  sba_prequalified: boolean

  cover_image_url: string | null

  status: ListingStatus
  is_flagged: boolean
  flag_reason: string | null
  published_at: string | null
  created_at: string
  updated_at: string

  // Optional joined seller summary.
  profiles?: {
    id: string
    full_name: string
    business_name: string
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  } | null
}

export interface BuyerProfile {
  id: string
  profile_id: string
  display_handle: string
  buyer_type: BuyerType
  budget_min: number | null
  budget_max: number | null
  target_cuisines: CuisineType[]
  target_business_types: BusinessType[]
  target_states: string[]
  target_cities: string[]
  notes: string | null
  notes_zh: string | null
  is_visible: boolean
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}

export interface NdaAcceptance {
  id: string
  listing_id: string
  buyer_profile_id: string
  signed_full_name: string
  accepted_at: string
}

export interface InquiryThreadSummary {
  id: string
  listing_id: string
  buyer_profile_id: string
  seller_profile_id: string
  subject: string | null
  status: 'open' | 'archived' | 'closed'
  last_message_at: string
  created_at: string
}

export interface InquiryMessage {
  id: string
  thread_id: string
  sender_profile_id: string
  sender_role: 'buyer' | 'seller' | 'admin'
  body: string
  read_at: string | null
  sent_at: string
}

export interface SavedSearch {
  id: string
  profile_id: string
  name: string
  filter_json: ListingFilters
  alert_frequency: AlertFrequency
  last_alerted_at: string | null
  last_match_count: number
  created_at: string
  updated_at: string
}

export interface ListingFilters {
  q?: string
  cuisine_types?: CuisineType[]
  business_types?: BusinessType[]
  states?: string[]
  cities?: string[]
  price_min?: number
  price_max?: number
  revenue_min?: number
  lease_remaining_min?: number
  visa_eb5?: boolean
  visa_e2?: boolean
  sba?: boolean
}

export type ListingSort =
  | 'newest'
  | 'price_low'
  | 'price_high'
  | 'revenue_high'

/**
 * Resolve the localized title/description, falling back to English.
 */
export function localizedListingField(
  listing: BusinessListing,
  field: 'title' | 'description',
  locale: AppLocale,
): string {
  if (locale === 'en') return listing[field]
  const localized = listing[`${field}_${locale}` as keyof BusinessListing] as string | null | undefined
  return (localized && localized.trim().length > 0 ? localized : listing[field]) ?? ''
}
