import { type BusinessListing, type NdaAcceptance } from '@/lib/marketplace/types'

/**
 * Server-checked: returns true if the buyer has signed the NDA for this listing.
 * Acceptance row in `ptp_nda_acceptances` is the source of truth.
 */
export function hasSignedNda(
  listingId: string,
  buyerProfileId: string | null | undefined,
  acceptances: Pick<NdaAcceptance, 'listing_id' | 'buyer_profile_id'>[],
): boolean {
  if (!buyerProfileId) return false
  return acceptances.some(
    (acceptance) => acceptance.listing_id === listingId && acceptance.buyer_profile_id === buyerProfileId,
  )
}

/**
 * Public-facing financial summary that can be shown without an NDA.
 * Hides exact dollar amounts; gives ranges + qualitative signals.
 */
export interface RedactedFinancials {
  hasFinancials: boolean
  priceRange: string
  revenueRange: string
}

const PRICE_BUCKETS: Array<{ max: number; label: string }> = [
  { max: 250_000, label: 'Under $250K' },
  { max: 500_000, label: '$250K – $500K' },
  { max: 1_000_000, label: '$500K – $1M' },
  { max: 2_000_000, label: '$1M – $2M' },
  { max: 5_000_000, label: '$2M – $5M' },
  { max: Infinity, label: '$5M+' },
]

const REVENUE_BUCKETS: Array<{ max: number; label: string }> = [
  { max: 250_000, label: 'Under $250K' },
  { max: 500_000, label: '$250K – $500K' },
  { max: 1_000_000, label: '$500K – $1M' },
  { max: 2_500_000, label: '$1M – $2.5M' },
  { max: 5_000_000, label: '$2.5M – $5M' },
  { max: Infinity, label: '$5M+' },
]

function bucketFor(value: number, buckets: Array<{ max: number; label: string }>): string {
  return buckets.find((bucket) => value <= bucket.max)?.label ?? '—'
}

export function redactFinancials(listing: BusinessListing): RedactedFinancials {
  const hasFinancials = listing.asking_price != null || listing.gross_revenue_annual != null
  return {
    hasFinancials,
    priceRange: listing.asking_price != null ? bucketFor(listing.asking_price, PRICE_BUCKETS) : '—',
    revenueRange:
      listing.gross_revenue_annual != null ? bucketFor(listing.gross_revenue_annual, REVENUE_BUCKETS) : '—',
  }
}

export const CURRENT_NDA_VERSION = 'v1'

export const NDA_BODY_EN = `This Non-Disclosure Agreement (the "Agreement") is entered into between you (the "Buyer") and the seller of the listing identified above (the "Seller").

1. Confidential Information. All financial, operational, and business information shared on this Pass The Plate listing is the confidential property of the Seller.
2. Permitted Use. The Buyer may use Confidential Information solely for the purpose of evaluating a potential acquisition of the business.
3. No Disclosure. The Buyer will not disclose Confidential Information to any third party, except advisors who are bound by equivalent confidentiality obligations.
4. Term. This Agreement remains in effect for two (2) years from the date of acceptance.
5. Governing Law. This Agreement is governed by the laws of the state in which the business is located.

By typing your full legal name and clicking "Sign NDA & continue", you acknowledge that you have read and agree to the terms above.`
