'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { FileCheck2, Shield, UploadCloud } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { VerificationBadge } from '@/components/VerificationBadge'
import { findSampleProfile, getListingImageUrl, getSampleListingsForProfile, type SellerListing, type SellerProfile } from '@/lib/marketplace'
import { supabase } from '@/lib/supabase'

function normalizeProfile(profile: any): SellerProfile {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    business_name: profile.business_name,
    bio: profile.bio,
    verification_status: profile.verification_status,
    government_id_path: profile.government_id_path,
    ownership_document_path: profile.ownership_document_path,
    business_license_path: profile.business_license_path,
    verification_submitted_at: profile.verification_submitted_at,
  }
}

function normalizeListing(listing: any): SellerListing {
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
  }
}

export default function LocalizedSellerProfilePage({ params }: { params: { id: string } }) {
  const t = useTranslations('seller')
  const errorT = useTranslations('errors')
  const commonT = useTranslations('common')
  const locale = useLocale()
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [listings, setListings] = useState<SellerListing[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const [{ data: profileData, error: profileError }, { data: listingsData, error: listingsError }] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, email, full_name, business_name, bio, verification_status, government_id_path, ownership_document_path, business_license_path, verification_submitted_at')
            .eq('id', params.id)
            .single(),
          supabase
            .from('listings')
            .select('id, profile_id, title, category, city, description, image_url, moderation_status, is_flagged, flag_reason, created_at')
            .eq('profile_id', params.id)
            .eq('moderation_status', 'active')
            .order('created_at', { ascending: false }),
        ])

        if (profileError) {
          throw profileError
        }

        if (listingsError) {
          throw listingsError
        }

        setProfile(normalizeProfile(profileData))
        setListings((listingsData || []).map(normalizeListing))
      } catch {
        setProfile(findSampleProfile(params.id))
        setListings(getSampleListingsForProfile(params.id))
      } finally {
        setLoading(false)
      }
    }

    void fetchSellerProfile()
  }, [params.id])

  const handleVerificationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!profile) {
      return
    }

    setSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      const form = new FormData(event.currentTarget)
      form.set('profileId', profile.id)

      const response = await fetch('/api/sellers/verification', {
        method: 'POST',
        body: form,
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || errorT('submitVerification'))
      }

      setProfile({
        ...profile,
        verification_status: 'pending',
        verification_submitted_at: new Date().toISOString(),
      })
      setMessage(t('submitSuccess'))
      event.currentTarget.reset()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : errorT('submitVerification'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pb-14 pt-32 md:pt-40">
        {loading ? (
          <div className="card p-10 text-center text-gray-500">{t('loading')}</div>
        ) : !profile ? (
          <div className="card p-10 text-center text-gray-500">{t('notFound')}</div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="badge mb-6">{t('badge')}</p>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <h1 className="mb-0">{profile.business_name}</h1>
                <VerificationBadge status={profile.verification_status} />
              </div>
              <p className="mb-3 text-lg font-medium text-gray-700">{profile.full_name}</p>
              <p className="max-w-3xl text-lg leading-relaxed text-gray-600">{profile.bio}</p>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-gray-950">{t('verificationTitle')}</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">{t('verificationBody')}</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                <p><strong>{commonT('status')}:</strong> {profile.verification_status}</p>
                <p><strong>{commonT('email')}:</strong> {profile.email}</p>
                {profile.verification_submitted_at && (
                  <p><strong>{commonT('lastSubmitted')}:</strong> {new Date(profile.verification_submitted_at).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {profile && (
        <>
          <section className="container pb-16">
            <div className="mb-8 flex items-center gap-3">
              <FileCheck2 className="h-5 w-5 text-accent" />
              <h2 className="text-3xl font-bold text-gray-950">{t('activeListings')}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {listings.map((listing) => (
                <article key={listing.id} className="card overflow-hidden p-0">
                  <div className="relative h-[200px] w-full">
                    <Image src={getListingImageUrl(listing)} alt={listing.title} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{listing.category}</p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-950">{listing.title}</h3>
                      </div>
                      {profile.verification_status === 'verified' && <VerificationBadge status="verified" />}
                    </div>
                    <p className="mb-3 text-sm text-gray-500">{listing.city}</p>
                    <p className="mb-5 leading-relaxed text-gray-600">{listing.description}</p>
                    <Link href={`/${locale}/listings/${listing.id}`} className="text-sm font-semibold text-accent transition-colors hover:text-accent-dark">
                      {commonT('viewListingDetails')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 py-20">
            <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="badge mb-6">{t('getVerifiedBadge')}</p>
                <h2 className="mb-4 text-4xl font-bold text-gray-950">{t('getVerifiedTitle')}</h2>
                <p className="text-lg leading-relaxed text-gray-600">{t('getVerifiedBody')}</p>
              </div>

              <form onSubmit={handleVerificationSubmit} className="card space-y-5 p-8">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">{t('governmentId')}</label>
                  <input type="file" name="governmentId" accept="image/*,.pdf" required />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">{t('ownershipProof')}</label>
                  <input type="file" name="ownershipProof" accept="image/*,.pdf" required />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">{t('businessLicense')}</label>
                  <input type="file" name="businessLicense" accept="image/*,.pdf" />
                </div>

                {message && <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
                {error && <p className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

                <button type="submit" className="btn-primary w-full text-center disabled:cursor-not-allowed disabled:opacity-70" disabled={submitting}>
                  <span className="inline-flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" />
                    {submitting ? t('submitting') : t('submit')}
                  </span>
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  )
}