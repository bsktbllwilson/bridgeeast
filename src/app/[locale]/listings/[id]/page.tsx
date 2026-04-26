'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, Store } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { InlineTranslation } from '@/components/InlineTranslation'
import { VerificationBadge } from '@/components/VerificationBadge'
import { findSampleListing, findSampleProfile, getListingImageUrl, type SellerListing, type SellerProfile } from '@/lib/marketplace'
import { supabase } from '@/lib/supabase'

interface ListingDetail extends SellerListing {
  profiles?: Pick<SellerProfile, 'id' | 'full_name' | 'business_name' | 'verification_status' | 'bio'> | null
}

function normalizeListing(listing: any): ListingDetail {
  const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles

  return {
    id: listing.id,
    profile_id: listing.profile_id,
    title: listing.title,
    category: listing.category,
    city: listing.city,
    description: listing.description,
    image_url: listing.image_url,
    moderation_status: listing.moderation_status,
    is_flagged: Boolean(listing.is_flagged),
    flag_reason: listing.flag_reason,
    created_at: listing.created_at,
    profiles: profile
      ? {
          id: profile.id,
          full_name: profile.full_name,
          business_name: profile.business_name,
          verification_status: profile.verification_status,
          bio: profile.bio,
        }
      : null,
  }
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations('listingDetail')
  const commonT = useTranslations('common')
  const locale = useLocale()
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id, profile_id, title, category, city, description, image_url, moderation_status, is_flagged, flag_reason, created_at, profiles(id, full_name, business_name, verification_status, bio)')
          .eq('id', params.id)
          .single()

        if (error) {
          throw error
        }

        setListing(normalizeListing(data))
      } catch {
        const fallbackListing = findSampleListing(params.id)
        const fallbackProfile = fallbackListing ? findSampleProfile(fallbackListing.profile_id) : null
        setListing(
          fallbackListing
            ? {
                ...fallbackListing,
                profiles: fallbackProfile
                  ? {
                      id: fallbackProfile.id,
                      full_name: fallbackProfile.full_name,
                      business_name: fallbackProfile.business_name,
                      verification_status: fallbackProfile.verification_status,
                      bio: fallbackProfile.bio,
                    }
                  : null,
              }
            : null,
        )
      } finally {
        setLoading(false)
      }
    }

    void fetchListing()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <section className="container section pt-32 md:pt-40">
          <div className="card p-10 text-center text-gray-500">{t('loading')}</div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <section className="container section pt-32 md:pt-40">
          <div className="card space-y-4 p-10 text-center text-gray-500">
            <p>{t('notFound')}</p>
            <Link href={`/${locale}/listings`} className="btn-primary inline-flex">
              {commonT('backToListings')}
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pb-16 pt-32 md:pt-40">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="badge mb-6">{t('badge')}</p>
            <div className="mb-8 overflow-hidden rounded-3xl bg-gray-100">
              <div className="relative h-[320px] w-full">
                <Image src={getListingImageUrl(listing)} alt={listing.title} fill className="object-cover" sizes="(min-width: 1024px) 66vw, 100vw" />
              </div>
            </div>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-eyebrow mb-3">{listing.category}</p>
                <h1 className="heading-hero mb-4">{listing.title}</h1>
              </div>
              <Store className="mt-1 h-7 w-7 text-accent" />
            </div>

            <div className="mb-6 flex items-center gap-3 text-gray-500">
              <MapPin className="h-5 w-5" />
              <span>{listing.city}</span>
            </div>

            <div className="card p-8">
              <h2 className="heading-subsection mb-4">{t('descriptionTitle')}</h2>
              <p className="text-body">{listing.description}</p>
              <InlineTranslation text={listing.description} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="heading-subsection mb-4">{t('sellerTitle')}</h2>
              {listing.profiles ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-950">{listing.profiles.business_name}</p>
                      <p className="text-sm text-gray-500">{listing.profiles.full_name}</p>
                    </div>
                    {listing.profiles.verification_status === 'verified' && <VerificationBadge status="verified" />}
                  </div>
                  {listing.profiles.bio && <p className="text-meta">{listing.profiles.bio}</p>}
                  <Link href={`/${locale}/sellers/${listing.profile_id}`} className="btn-secondary w-full text-center">
                    {commonT('viewSellerProfile')}
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t('notFound')}</p>
              )}
            </div>

            <div className="card p-6">
              <h2 className="heading-subsection mb-4">{t('sidebarTitle')}</h2>
              <p className="text-meta mb-5">{t('sidebarBody')}</p>
              <Link href={`/${locale}/listings/${listing.id}/inquiries`} className="btn-primary w-full text-center">
                {commonT('viewInquiryThread')}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}