'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, Store } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { VerificationBadge } from '@/components/VerificationBadge'
import { type SellerListing, sampleListings } from '@/lib/marketplace'
import { supabase } from '@/lib/supabase'

function normalizeListing(listing: any): SellerListing {
  const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles

  return {
    id: listing.id,
    profile_id: listing.profile_id,
    title: listing.title,
    category: listing.category,
    city: listing.city,
    description: listing.description,
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
        }
      : null,
  }
}

export default function LocalizedListingsPage() {
  const t = useTranslations('listings')
  const commonT = useTranslations('common')
  const locale = useLocale()
  const [listings, setListings] = useState<SellerListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id, profile_id, title, category, city, description, moderation_status, is_flagged, flag_reason, created_at, profiles(id, full_name, business_name, verification_status)')
          .eq('moderation_status', 'active')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setListings((data || []).map(normalizeListing))
      } catch {
        setListings(sampleListings.filter((listing) => listing.moderation_status === 'active'))
      } finally {
        setLoading(false)
      }
    }

    void fetchListings()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pb-14 pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="badge mb-6">{t('badge')}</p>
          <h1 className="mb-6">{t('title')}</h1>
          <p className="text-lg leading-relaxed text-gray-600">{t('subtitle')}</p>
        </div>
      </section>

      <section className="container pb-24">
        {loading ? (
          <div className="card p-10 text-center text-gray-500">{t('loading')}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <article key={listing.id} className="card flex h-full flex-col p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{listing.category || t('categoryFallback')}</p>
                    <h2 className="text-2xl font-bold text-gray-950">{listing.title}</h2>
                  </div>
                  <Store className="h-6 w-6 text-accent" />
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.city}</span>
                </div>

                <p className="mb-6 flex-1 leading-relaxed text-gray-600">{listing.description || t('descriptionFallback')}</p>

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
                  <Link href={`/${locale}/listings/${listing.id}`} className="btn-secondary text-center">
                    {commonT('viewListingDetails')}
                  </Link>
                  <Link href={`/${locale}/sellers/${listing.profile_id}`} className="text-center text-sm font-semibold text-accent transition-colors hover:text-accent-dark">
                    {commonT('viewSellerProfile')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}