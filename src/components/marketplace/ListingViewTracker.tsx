'use client'

import { useEffect } from 'react'
import { trackListingView } from '@/lib/analytics'

interface Props {
  listingId: string
  cuisine?: string
  city?: string
}

/**
 * Fires the analytics `listing_view` event once per mount. Mounted from the
 * server-rendered listing detail page so the parent stays a server component.
 */
export function ListingViewTracker({ listingId, cuisine, city }: Props) {
  useEffect(() => {
    trackListingView({ listingId, cuisine, city })
  }, [listingId, cuisine, city])
  return null
}
