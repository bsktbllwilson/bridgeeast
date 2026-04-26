export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type ModerationStatus = 'active' | 'removed'

export interface SellerProfile {
  id: string
  email: string
  full_name: string
  business_name: string
  bio: string | null
  verification_status: VerificationStatus
  government_id_path?: string | null
  ownership_document_path?: string | null
  business_license_path?: string | null
  verification_submitted_at?: string | null
}

export interface SellerListing {
  id: string
  profile_id: string
  title: string
  category: string
  city: string
  description: string
  image_url?: string | null
  moderation_status: ModerationStatus
  is_flagged: boolean
  flag_reason?: string | null
  created_at?: string
  profiles?: Pick<SellerProfile, 'id' | 'full_name' | 'business_name' | 'verification_status'> | null
}

const listingCategoryImages: Record<string, string> = {
  restaurant: '/images/feast-spread.jpg',
  food: '/images/noodle-spread.jpg',
  'quick service': '/images/dumplings.jpg',
  cafe: '/images/pastries-matcha.jpg',
  bakery: '/images/pastries-matcha.jpg',
  retail: '/images/restaurant-blue-tiles.jpg',
  wellness: '/images/friends-dining.jpg',
}

const defaultListingImage = '/images/noodle-spread.jpg'

export function getListingImageUrl(listing: Pick<SellerListing, 'category' | 'image_url'>) {
  if (listing.image_url) {
    return listing.image_url
  }

  const normalizedCategory = (listing.category || '').trim().toLowerCase()

  if (listingCategoryImages[normalizedCategory]) {
    return listingCategoryImages[normalizedCategory]
  }

  const partialMatch = Object.entries(listingCategoryImages).find(([key]) => normalizedCategory.includes(key))
  return partialMatch?.[1] || defaultListingImage
}

export interface InquiryMessage {
  id: string
  listing_id: string
  author: 'seller' | 'buyer'
  sender_name: string
  body: string
  sent_at: string
}

export const sampleProfiles: SellerProfile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'mei@lotusdumpling.com',
    full_name: 'Mei Zhang',
    business_name: 'Lotus Dumpling Studio',
    bio: 'Handmade northern Chinese dumplings with a modern quick-service format designed for high-foot-traffic neighborhoods.',
    verification_status: 'verified',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'kenji@midori-matcha.com',
    full_name: 'Kenji Sato',
    business_name: 'Midori Matcha Bar',
    bio: 'Ceremonial-grade matcha beverages and Japanese soft serve built for compact urban storefronts.',
    verification_status: 'pending',
    verification_submitted_at: '2026-04-04T15:30:00.000Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'hana@seoulbakehouse.com',
    full_name: 'Hana Park',
    business_name: 'Seoul Bakehouse',
    bio: 'Korean-inspired cafe concept focused on laminated pastries, specialty coffee, and all-day dessert service.',
    verification_status: 'unverified',
  },
]

export const sampleListings: SellerListing[] = [
  {
    id: 'listing-1',
    profile_id: '11111111-1111-1111-1111-111111111111',
    title: 'Lotus Dumpling Studio - Williamsburg Pop-up to Permanent',
    category: 'Quick Service',
    city: 'Brooklyn',
    description: 'Seeking a 900-1,200 sq ft corner storefront with strong lunch traffic and venting potential.',
    image_url: '/images/dumplings.jpg',
    moderation_status: 'active',
    is_flagged: false,
    profiles: {
      id: '11111111-1111-1111-1111-111111111111',
      full_name: 'Mei Zhang',
      business_name: 'Lotus Dumpling Studio',
      verification_status: 'verified',
    },
  },
  {
    id: 'listing-2',
    profile_id: '22222222-2222-2222-2222-222222222222',
    title: 'Midori Matcha Bar - Flatiron Flagship',
    category: 'Cafe',
    city: 'Manhattan',
    description: 'Compact beverage-led concept targeting office density and afternoon snack demand.',
    image_url: '/images/pastries-matcha.jpg',
    moderation_status: 'active',
    is_flagged: true,
    flag_reason: 'Needs a closer review of marketing claims and listing imagery.',
    profiles: {
      id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Kenji Sato',
      business_name: 'Midori Matcha Bar',
      verification_status: 'pending',
    },
  },
  {
    id: 'listing-3',
    profile_id: '33333333-3333-3333-3333-333333333333',
    title: 'Seoul Bakehouse - Long Island City Commissary',
    category: 'Bakery',
    city: 'Queens',
    description: 'Production bakery concept with a retail counter and commissary capacity for wholesale expansion.',
    image_url: '/images/pastries-matcha.jpg',
    moderation_status: 'active',
    is_flagged: false,
    profiles: {
      id: '33333333-3333-3333-3333-333333333333',
      full_name: 'Hana Park',
      business_name: 'Seoul Bakehouse',
      verification_status: 'unverified',
    },
  },
]

const sampleInquiryThreads: Record<string, InquiryMessage[]> = {
  'listing-1': [
    {
      id: 'message-1',
      listing_id: 'listing-1',
      author: 'buyer',
      sender_name: 'BridgeEast Expansion Team',
      body: 'Can you share your target opening window and whether a vented kitchen is a hard requirement?',
      sent_at: '2026-04-02T14:20:00.000Z',
    },
    {
      id: 'message-2',
      listing_id: 'listing-1',
      author: 'seller',
      sender_name: 'Mei Zhang',
      body: '我们希望在九月前签约，排烟条件是硬性要求，因为午餐高峰会以现包现煮饺子为主。',
      sent_at: '2026-04-02T15:05:00.000Z',
    },
  ],
  'listing-2': [
    {
      id: 'message-3',
      listing_id: 'listing-2',
      author: 'buyer',
      sender_name: 'BridgeEast Scout',
      body: 'Are you open to a kiosk-first rollout if the flagship search takes longer than expected?',
      sent_at: '2026-04-03T10:00:00.000Z',
    },
    {
      id: 'message-4',
      listing_id: 'listing-2',
      author: 'seller',
      sender_name: 'Kenji Sato',
      body: 'Yes. We can launch with a smaller beverage-led footprint first, but we still need strong daytime office traffic and a clean electrical setup.',
      sent_at: '2026-04-03T10:18:00.000Z',
    },
  ],
}

export function findSampleProfile(profileId: string) {
  return sampleProfiles.find((profile) => profile.id === profileId) || null
}

export function findSampleListing(listingId: string) {
  return sampleListings.find((listing) => listing.id === listingId) || null
}

export function getSampleListingsForProfile(profileId: string) {
  return sampleListings.filter((listing) => listing.profile_id === profileId)
}

export function getSampleInquiryThread(listingId: string) {
  return sampleInquiryThreads[listingId] || []
}

export function getVerificationLabel(status: VerificationStatus) {
  switch (status) {
    case 'verified':
      return 'Verified'
    case 'pending':
      return 'Pending review'
    case 'rejected':
      return 'Rejected'
    default:
      return 'Unverified'
  }
}