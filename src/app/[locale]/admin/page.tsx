'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ShieldCheck, ShieldX, Trash2 } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { VerificationBadge } from '@/components/VerificationBadge'
import {
  samplePtpBuyers,
  samplePtpListings,
  samplePtpThreads,
} from '@/lib/marketplace/sample-data'

type AdminTab = 'bridgeeast' | 'ptp_listings' | 'ptp_buyers' | 'ptp_inquiries'

interface PendingProfile {
  id: string
  email: string
  full_name: string
  business_name: string
  verification_status: 'pending'
  verification_submitted_at?: string | null
  governmentIdUrl: string | null
  ownershipDocumentUrl: string | null
  businessLicenseUrl: string | null
}

interface ModerationListing {
  id: string
  profile_id: string
  title: string
  category: string
  city: string
  description: string
  moderation_status: 'active' | 'removed'
  is_flagged: boolean
  flag_reason?: string | null
  profiles?: {
    id: string
    full_name: string
    business_name: string
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  } | null
}

interface DashboardPayload {
  pendingProfiles: PendingProfile[]
  moderationQueue: ModerationListing[]
  mocked?: boolean
}

const fallbackAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@bridgeeast.com'

export default function LocalizedAdminPage() {
  const t = useTranslations('admin')
  const errorT = useTranslations('errors')
  const ptpAdminT = useTranslations('marketplace.admin')
  const [adminEmail, setAdminEmail] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>('bridgeeast')

  const flaggedCount = useMemo(
    () => dashboard?.moderationQueue.filter((listing) => listing.is_flagged || listing.moderation_status === 'removed').length || 0,
    [dashboard],
  )

  const loadDashboard = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/dashboard?adminEmail=${encodeURIComponent(email)}`)
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || errorT('loadAdmin'))
      }

      setDashboard(payload)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : errorT('loadAdmin'))
    } finally {
      setLoading(false)
    }
  }, [errorT])

  useEffect(() => {
    if (authorized) {
      void loadDashboard(adminEmail)
    }
  }, [authorized, adminEmail, loadDashboard])

  const unlockAdmin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (adminEmail.trim().toLowerCase() !== fallbackAdminEmail.trim().toLowerCase()) {
      setError(errorT('adminUnauthorized'))
      return
    }

    setAuthorized(true)
    setError(null)
  }

  const handleVerificationDecision = async (profileId: string, decision: 'verified' | 'rejected') => {
    setBusyKey(`${decision}-${profileId}`)
    setError(null)

    try {
      const response = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminEmail, profileId, decision }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || errorT('updateVerification'))
      }

      await loadDashboard(adminEmail)
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : errorT('updateVerification'))
    } finally {
      setBusyKey(null)
    }
  }

  const handleModeration = async (listingId: string, action: 'flag' | 'remove' | 'restore') => {
    setBusyKey(`${action}-${listingId}`)
    setError(null)

    try {
      const response = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail,
          listingId,
          action,
          reason: action === 'flag'
            ? 'Flagged for closer manual review.'
            : action === 'remove'
              ? 'Removed by admin for violating listing quality guidelines.'
              : null,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || errorT('moderateListing'))
      }

      await loadDashboard(adminEmail)
    } catch (moderationError) {
      setError(moderationError instanceof Error ? moderationError.message : errorT('moderateListing'))
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pb-16 pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="badge mb-6">{t('badge')}</p>
          <h1 className="mb-6">{t('title')}</h1>
          <p className="text-lg leading-relaxed text-gray-600">{t('subtitle')}</p>
        </div>
      </section>

      {!authorized ? (
        <section className="container pb-24">
          <form onSubmit={unlockAdmin} className="card mx-auto max-w-xl space-y-5 p-8">
            <h2 className="text-2xl font-bold text-gray-950">{t('unlockTitle')}</h2>
            <p className="text-sm leading-relaxed text-gray-600">{t('unlockBody')}</p>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">{t('adminEmail')}</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                placeholder={t('adminEmailPlaceholder')}
                required
              />
            </div>
            {error && <p className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <button type="submit" className="btn-primary w-full text-center">{t('enter')}</button>
          </form>
        </section>
      ) : (
        <section className="container space-y-10 pb-24">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {([
              { id: 'bridgeeast', label: ptpAdminT('tabBridgeEast') },
              { id: 'ptp_listings', label: ptpAdminT('tabPtpListings') },
              { id: 'ptp_buyers', label: ptpAdminT('tabPtpBuyers') },
              { id: 'ptp_inquiries', label: ptpAdminT('tabPtpInquiries') },
            ] as { id: AdminTab; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== 'bridgeeast' && (
            <PtpAdminPanel tab={activeTab} />
          )}

          {activeTab === 'bridgeeast' && (
            <>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t('cards.pending')}</p>
              <p className="mt-3 text-4xl font-bold text-gray-950">{dashboard?.pendingProfiles.length || 0}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t('cards.flagged')}</p>
              <p className="mt-3 text-4xl font-bold text-gray-950">{flaggedCount}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t('cards.dataSource')}</p>
              <p className="mt-3 text-lg font-semibold text-gray-950">{dashboard?.mocked ? t('cards.sample') : t('cards.live')}</p>
            </div>
          </div>

          {error && <p className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <div className="card overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-2xl font-bold text-gray-950">{t('pendingTitle')}</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">{t('pendingLoading')}</div>
            ) : !dashboard?.pendingProfiles.length ? (
              <div className="p-8 text-center text-gray-500">{t('pendingEmpty')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">{t('seller')}</th>
                      <th className="px-6 py-4 font-semibold">{t('submitted')}</th>
                      <th className="px-6 py-4 font-semibold">{t('documents')}</th>
                      <th className="px-6 py-4 font-semibold">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dashboard.pendingProfiles.map((profile) => (
                      <tr key={profile.id}>
                        <td className="px-6 py-5 align-top">
                          <p className="font-semibold text-gray-950">{profile.business_name}</p>
                          <p className="text-gray-500">{profile.full_name}</p>
                          <p className="text-gray-500">{profile.email}</p>
                        </td>
                        <td className="px-6 py-5 align-top text-gray-600">
                          {profile.verification_submitted_at
                            ? new Date(profile.verification_submitted_at).toLocaleString()
                            : 'Not available'}
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="space-y-2">
                            <a href={profile.governmentIdUrl || '#'} target="_blank" rel="noreferrer" className="block text-accent hover:underline">
                              {t('governmentId')}
                            </a>
                            <a href={profile.ownershipDocumentUrl || '#'} target="_blank" rel="noreferrer" className="block text-accent hover:underline">
                              {t('ownershipProof')}
                            </a>
                            {profile.businessLicenseUrl && (
                              <a href={profile.businessLicenseUrl} target="_blank" rel="noreferrer" className="block text-accent hover:underline">
                                {t('businessLicense')}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                              onClick={() => handleVerificationDecision(profile.id, 'verified')}
                              disabled={Boolean(busyKey)}
                            >
                              <ShieldCheck className="h-4 w-4" />
                              {busyKey === `verified-${profile.id}` ? t('approving') : t('approve')}
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                              onClick={() => handleVerificationDecision(profile.id, 'rejected')}
                              disabled={Boolean(busyKey)}
                            >
                              <ShieldX className="h-4 w-4" />
                              {busyKey === `rejected-${profile.id}` ? t('rejecting') : t('reject')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-2xl font-bold text-gray-950">{t('moderationTitle')}</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">{t('moderationLoading')}</div>
            ) : !dashboard?.moderationQueue.length ? (
              <div className="p-8 text-center text-gray-500">{t('moderationEmpty')}</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {dashboard.moderationQueue.map((listing) => (
                  <div key={listing.id} className="grid gap-4 px-6 py-6 lg:grid-cols-[1.5fr_1fr_auto] lg:items-start">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-950">{listing.title}</h3>
                        {listing.profiles?.verification_status === 'verified' && <VerificationBadge status="verified" />}
                      </div>
                      <p className="mb-2 text-sm text-gray-500">
                        {listing.profiles?.business_name || t('unknownSeller')} · {listing.category} · {listing.city}
                      </p>
                      <p className="mb-3 leading-relaxed text-gray-600">{listing.description}</p>
                      <p className="text-sm text-gray-500">
                        {t('status')}: <strong>{listing.moderation_status}</strong>
                        {listing.flag_reason ? ` · ${listing.flag_reason}` : ''}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p className="font-semibold text-gray-700">{t('sellerLabel')}</p>
                      <p>{listing.profiles?.full_name || t('unknown')}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <button
                        type="button"
                        className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => handleModeration(listing.id, 'flag')}
                        disabled={Boolean(busyKey)}
                      >
                        {busyKey === `flag-${listing.id}` ? t('flagging') : t('flag')}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => handleModeration(listing.id, 'remove')}
                        disabled={Boolean(busyKey)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {busyKey === `remove-${listing.id}` ? t('removing') : t('remove')}
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => handleModeration(listing.id, 'restore')}
                        disabled={Boolean(busyKey)}
                      >
                        {busyKey === `restore-${listing.id}` ? t('restoring') : t('restore')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            </>
          )}
        </section>
      )}

      <Footer />
    </main>
  )
}

function PtpAdminPanel({ tab }: { tab: AdminTab }) {
  if (tab === 'ptp_listings') {
    return (
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-gray-950">Pass The Plate · Listings</h2>
          <p className="text-sm text-gray-500">Approve, flag, or remove business-for-sale listings.</p>
        </div>
        <div className="divide-y divide-gray-200">
          {samplePtpListings.map((listing) => (
            <div key={listing.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[2fr_1fr_auto] lg:items-center">
              <div>
                <p className="text-base font-bold text-gray-950">{listing.title}</p>
                <p className="text-xs text-gray-500">
                  {listing.city}, {listing.state} · {listing.cuisine_type} · {listing.business_type}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                <p>Status: <strong>{listing.status}</strong></p>
                <p>Asking: ${listing.asking_price?.toLocaleString() ?? '—'}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">Flag</button>
                <button type="button" className="rounded-md bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (tab === 'ptp_buyers') {
    return (
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-gray-950">Pass The Plate · Buyers</h2>
          <p className="text-sm text-gray-500">Verify proof-of-funds and toggle buyer demand visibility.</p>
        </div>
        <div className="divide-y divide-gray-200">
          {samplePtpBuyers.map((buyer) => (
            <div key={buyer.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_2fr_auto] lg:items-center">
              <div>
                <p className="text-base font-bold text-gray-950">{buyer.display_handle}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{buyer.buyer_type}</p>
              </div>
              <div className="text-sm text-gray-700">
                <p>Budget: ${buyer.budget_min?.toLocaleString() ?? '—'} – ${buyer.budget_max?.toLocaleString() ?? '—'}</p>
                <p>Verification: <strong>{buyer.verification_status}</strong></p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
                <button type="button" className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (tab === 'ptp_inquiries') {
    return (
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-gray-950">Pass The Plate · Inquiries</h2>
          <p className="text-sm text-gray-500">Monitor active NDA-gated buyer ↔ seller threads.</p>
        </div>
        <div className="divide-y divide-gray-200">
          {samplePtpThreads.map((thread) => (
            <div key={thread.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[2fr_1fr_auto] lg:items-center">
              <div>
                <p className="text-base font-bold text-gray-950">{thread.subject ?? thread.id}</p>
                <p className="text-xs text-gray-500">
                  Listing {thread.listing_id} · Buyer {thread.buyer_profile_id}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                <p>Status: <strong>{thread.status}</strong></p>
                <p>Last message: {new Date(thread.last_message_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">Archive</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}