'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Store } from 'lucide-react'

import { VerificationBadge } from '@/components/VerificationBadge'
import { getListingImageUrl, type SellerListing } from '@/lib/marketplace'

interface ListingCardProps {
  listing: SellerListing
  detailHref?: string
  detailLabel?: string
  sellerHref: string
  sellerLabel: string
  categoryFallback: string
  descriptionFallback: string
}

export function ListingCard({
  listing,
  detailHref,
  detailLabel,
  sellerHref,
  sellerLabel,
  categoryFallback,
  descriptionFallback,
}: ListingCardProps) {
  const imageUrl = getListingImageUrl(listing)

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-[200px] overflow-hidden bg-gray-100">
        <Image src={imageUrl} alt={listing.title} fill className="object-cover" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/55 via-gray-950/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <p className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-900">
            {listing.category || categoryFallback}
          </p>
          <Store className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-2xl font-bold text-gray-950">{listing.title}</h2>

        <div className="mb-4 mt-4 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{listing.city}</span>
        </div>

        <p className="mb-6 flex-1 leading-relaxed text-gray-600">{listing.description || descriptionFallback}</p>

        {listing.profiles && (
          <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{listing.profiles.business_name}</p>
                <p className="text-sm text-gray-500">{listing.profiles.full_name}</p>
              </div>
              {listing.profiles.verification_status === 'verified' && <VerificationBadge status="verified" />}
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {detailHref && detailLabel && (
            <Link href={detailHref} className="btn-secondary text-center">
              {detailLabel}
            </Link>
          )}
          <Link href={sellerHref} className="text-center text-sm font-semibold text-accent transition-colors hover:text-accent-dark">
            {sellerLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}