'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react'

import { CtaButton } from '@/components/CtaButton'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ListingCard } from '@/components/ListingCard'
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
        }
      : null,
  }
}

const categoryFilters = ['all', 'restaurant', 'cafe', 'bakery', 'retail'] as const
const priceBandFilters = ['all', 'starter', 'growth', 'premium'] as const

function getPriceBand(listing: Pick<SellerListing, 'city' | 'category'>) {
  const normalizedCity = (listing.city || '').toLowerCase()
  const normalizedCategory = (listing.category || '').toLowerCase()

  if (normalizedCity.includes('manhattan')) {
    return 'premium'
  }

  if (normalizedCity.includes('brooklyn') || normalizedCategory.includes('restaurant') || normalizedCategory.includes('quick service')) {
    return 'growth'
  }

  return 'starter'
}

export default function LocalizedListingsPage() {
  const t = useTranslations('listings')
  const commonT = useTranslations('common')
  const locale = useLocale()
  const [listings, setListings] = useState<SellerListing[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState<(typeof categoryFilters)[number]>('all')
  const [priceBandFilter, setPriceBandFilter] = useState<(typeof priceBandFilters)[number]>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id, profile_id, title, category, city, description, image_url, moderation_status, is_flagged, flag_reason, created_at, profiles(id, full_name, business_name, verification_status)')
          .eq('moderation_status', 'active')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setListings((data || []).map(normalizeListing))
      } catch (error) {
        console.error('Error fetching listings:', error)
        setListings(sampleListings.filter((listing) => listing.moderation_status === 'active'))
      } finally {
        setLoading(false)
      }
    }

    void fetchListings()
  }, [])

  const cityOptions = useMemo(
    () => Array.from(new Set(listings.map((listing) => listing.city).filter(Boolean))).sort((left, right) => left.localeCompare(right)),
    [listings],
  )

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        const normalizedQuery = query.trim().toLowerCase()
        const haystack = [listing.title, listing.category, listing.city, listing.description, listing.profiles?.business_name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery)
        const matchesCity = cityFilter === 'all' || listing.city === cityFilter
        const normalizedCategory = (listing.category || '').toLowerCase()
        const matchesCategory =
          categoryFilter === 'all' ||
          normalizedCategory.includes(categoryFilter) ||
          (categoryFilter === 'restaurant' && ['quick service', 'food', 'restaurant'].some((value) => normalizedCategory.includes(value)))
        const matchesPriceBand = priceBandFilter === 'all' || getPriceBand(listing) === priceBandFilter
        const matchesVerification = !verifiedOnly || listing.profiles?.verification_status === 'verified'

        return matchesQuery && matchesCity && matchesCategory && matchesPriceBand && matchesVerification
      }),
    [categoryFilter, cityFilter, listings, priceBandFilter, query, verifiedOnly],
  )

  const citySummaries = useMemo(
    () =>
      cityOptions.map((city) => ({
        city,
        count: filteredListings.filter((listing) => listing.city === city).length,
      })),
    [cityOptions, filteredListings],
  )

  const featuredMapListings = filteredListings.slice(0, 3)

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="relative isolate overflow-hidden bg-slate-950 pt-24 text-white md:pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.52) 45%, rgba(15, 23, 42, 0.84) 100%), url('/images/hands-noodle-bowls.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,90,48,0.28),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />

        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
              {t('heroBadge')}
            </p>
            <h1 className="heading-hero mb-6 max-w-4xl text-white">{t('heroTitle')}</h1>
            <p className="text-lead max-w-3xl text-white/78">{t('heroSubtitle')}</p>
            <div className="mt-8">
              <CtaButton href={`/${locale}/waitlist`} variant="primary">
                {t('heroCta')}
              </CtaButton>
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/15 bg-white/95 p-4 shadow-[0_40px_100px_-40px_rgba(15,23,42,0.85)] backdrop-blur md:p-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_220px_minmax(0,1fr)_120px]">
              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-colors focus-within:border-accent">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
                />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-colors focus-within:border-accent">
                <MapPin className="h-5 w-5 text-gray-400" />
                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  className="w-full bg-transparent text-base text-gray-900 outline-none"
                >
                  <option value="all">{t('allCities')}</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
                <SlidersHorizontal className="h-5 w-5 shrink-0 text-gray-400" />
                {categoryFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setCategoryFilter(filter)}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                      categoryFilter === filter ? 'bg-accent text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
                    }`}
                  >
                    {t(`filters.${filter}`)}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center rounded-2xl bg-gray-950 px-5 py-4 text-center text-white shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{t('heroStats.listingsLabel')}</p>
                  <p className="mt-2 text-3xl font-bold">{loading ? '...' : filteredListings.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-stretch xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {(['verified', 'turnkey', 'high-foot-traffic'] as const).map((pill) => (
                  <span key={pill} className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-gray-700">
                    {t(`pills.${pill}`)}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 xl:max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{t('heroStats.responseLabel')}</p>
                <p className="mt-2 text-base font-semibold leading-snug text-gray-950">{t('heroStats.responseTitle')}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t('heroStats.responseValue')}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-gray-200 pt-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{t('neighborhoodsTitle')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCityFilter('all')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      cityFilter === 'all' ? 'bg-gray-950 text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
                    }`}
                  >
                    {t('allCities')}
                  </button>
                  {cityOptions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCityFilter(city)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        cityFilter === city ? 'bg-accent text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{t('priceBandsTitle')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {priceBandFilters.map((band) => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setPriceBandFilter(band)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        priceBandFilter === band ? 'bg-gray-950 text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
                      }`}
                    >
                      {t(`priceBands.${band}`)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly((current) => !current)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      verifiedOnly ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {t('filters.verifiedOnly')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="grid w-full lg:grid-cols-2">
          <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:min-h-[560px]">
            <img
              src="/images/noodle-pull.jpg"
              alt={t('splitImageAlt')}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-8 px-6 py-16 sm:px-10 md:px-14 lg:px-20 xl:px-28">
            <h1 className="heading-hero not-italic">{t('splitTitle')}</h1>
            <div className="flex flex-wrap gap-3">
              <CtaButton href={`/${locale}/listings`} variant="primary">
                {t('splitBuyerCta')}
              </CtaButton>
              <CtaButton href={`/${locale}/waitlist`} variant="outline">
                {t('splitSellerCta')}
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-stone-50 py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-eyebrow">{t('badge')}</p>
            <h2 className="heading-section not-italic mt-2">{t('title')}</h2>
            <p className="mt-3 text-sm font-semibold not-italic text-gray-900">
              {loading ? t('loading') : t('resultsCount', {count: filteredListings.length})}
            </p>
          </div>
          <Link
            href={`/${locale}/listings`}
            className="inline-flex items-center gap-2 self-start rounded-full bg-gray-950 px-6 py-3 font-sans text-sm font-semibold not-italic text-white transition-colors hover:bg-gray-800 md:self-auto"
          >
            {t('viewListingsCta')}
          </Link>
        </div>
      </section>

      <section className="pb-12 pt-10">
        {loading ? (
          <div className="container">
            <div className="card p-10 text-center text-gray-500 not-italic">{t('loading')}</div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="container">
            <div className="card p-10 text-center">
              <h3 className="heading-subsection">{t('emptyTitle')}</h3>
              <p className="text-body not-italic mt-3">{t('emptyBody')}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCityFilter('all')
                  setCategoryFilter('all')
                  setPriceBandFilter('all')
                  setVerifiedOnly(false)
                }}
                className="mt-6 inline-flex rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold not-italic text-white transition-colors hover:bg-gray-800"
              >
                {t('clearFilters')}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="group relative overflow-hidden"
            role="region"
            aria-label={t('title')}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />
            <div className="marquee-track flex w-max gap-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
              {[...filteredListings, ...filteredListings].map((listing, index) => (
                <div
                  key={`${listing.id}-${index}`}
                  className="w-[300px] shrink-0 sm:w-[340px] md:w-[380px]"
                  aria-hidden={index >= filteredListings.length ? 'true' : undefined}
                >
                  <ListingCard
                    listing={listing}
                    detailHref={`/${locale}/listings/${listing.id}`}
                    detailLabel={commonT('viewListingDetails')}
                    sellerHref={`/${locale}/sellers/${listing.profile_id}`}
                    sellerLabel={commonT('viewSellerProfile')}
                    categoryFallback={t('categoryFallback')}
                    descriptionFallback={t('descriptionFallback')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {!loading && filteredListings.length > 0 && (
        <section className="container pb-24">
          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.4)]">
            <div className="border-b border-gray-200 px-6 py-5">
              <p className="text-eyebrow">{t('mapBadge')}</p>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div>
                  <h3 className="heading-subsection">{t('mapTitle')}</h3>
                  <p className="text-body not-italic mt-2 text-sm">{t('mapBody')}</p>
                </div>
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-accent" />
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-2">
              <div className="relative rounded-[24px] bg-slate-950 p-6 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,90,48,0.25),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_30%)]" />
                <div className="relative grid min-h-[280px] grid-cols-2 gap-3">
                  {citySummaries.map((summary, index) => (
                    <button
                      key={summary.city}
                      type="button"
                      onClick={() => setCityFilter(summary.city)}
                      className={`rounded-[22px] border px-4 py-4 text-left transition-colors ${
                        cityFilter === summary.city
                          ? 'border-white/40 bg-white/18'
                          : 'border-white/10 bg-white/8 hover:bg-white/12'
                      } ${index === 0 ? 'col-span-2' : ''}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{t('mapNeighborhoodLabel')}</p>
                      <p className="mt-2 text-lg font-bold">{summary.city}</p>
                      <p className="mt-3 text-sm text-white/72">{t('mapListingsCount', {count: summary.count})}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">{t('mapShortlistTitle')}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setCityFilter('all')
                      setPriceBandFilter('all')
                      setVerifiedOnly(false)
                    }}
                    className="text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
                  >
                    {t('mapReset')}
                  </button>
                </div>

                {featuredMapListings.map((listing) => (
                  <button
                    key={listing.id}
                    type="button"
                    onClick={() => setCityFilter(listing.city)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-left transition-colors hover:border-accent hover:bg-orange-50/50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold not-italic text-gray-950">{listing.title}</p>
                        <p className="mt-1 text-sm not-italic text-gray-500">{listing.city}</p>
                      </div>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-700">
                        {t(`priceBands.${getPriceBand(listing)}`)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}