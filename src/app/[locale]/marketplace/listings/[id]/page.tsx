import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MapPin } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { FinancialsPanel } from '@/components/marketplace/FinancialsPanel'
import { ListingViewTracker } from '@/components/marketplace/ListingViewTracker'
import { type AppLocale } from '@/i18n/locales'
import { getBusinessListing } from '@/lib/marketplace/queries'
import { localizedListingField } from '@/lib/marketplace/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://passtheplate.store'

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: AppLocale; id: string }
}): Promise<Metadata> {
  const { listing } = await getBusinessListing(id)
  if (!listing) {
    return {
      title: 'Listing not found',
      robots: { index: false, follow: true },
    }
  }
  const title = localizedListingField(listing, 'title', locale)
  const description = (localizedListingField(listing, 'description', locale) || '').slice(
    0,
    200
  )
  const path =
    locale === 'en'
      ? `/marketplace/listings/${listing.id}`
      : `/${locale}/marketplace/listings/${listing.id}`
  const ogParams = new URLSearchParams({
    title,
    subtitle: description,
    eyebrow: [listing.city, listing.state].filter(Boolean).join(', '),
  })
  const ogImage = `${SITE_URL}/api/og?${ogParams.toString()}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function MarketplaceListingDetailPage({
  params: { locale, id },
  searchParams,
}: {
  params: { locale: AppLocale; id: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { listing } = await getBusinessListing(id)
  if (!listing) notFound()

  const t = await getTranslations({ locale, namespace: 'marketplace.listing' })
  const cuisineT = await getTranslations({ locale, namespace: 'marketplace.cuisines' })
  const typeT = await getTranslations({ locale, namespace: 'marketplace.businessTypes' })
  const commonT = await getTranslations({ locale, namespace: 'common' })

  // For the scaffold, we treat ?nda=signed as the unlocked state.
  // Once auth is wired, this becomes a server-side check against ptp_nda_acceptances.
  const ndaParam = Array.isArray(searchParams.nda) ? searchParams.nda[0] : searchParams.nda
  const unlocked = ndaParam === 'signed'
  const ndaCtaHref = `/${locale}/marketplace/listings/${listing.id}/inquire`
  const inquireHref = ndaCtaHref

  const title = localizedListingField(listing, 'title', locale)
  const description = localizedListingField(listing, 'description', locale)
  const sellerNotes =
    locale === 'zh' && listing.seller_notes_zh ? listing.seller_notes_zh : listing.seller_notes
  const reasonForSale =
    locale === 'zh' && listing.reason_for_sale_zh ? listing.reason_for_sale_zh : listing.reason_for_sale

  const productJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description?.slice?.(0, 1000),
    category: listing.cuisine_type,
    brand: {
      '@type': 'Organization',
      name: 'Pass The Plate',
      url: SITE_URL,
    },
    url:
      SITE_URL +
      (locale === 'en'
        ? `/marketplace/listings/${listing.id}`
        : `/${locale}/marketplace/listings/${listing.id}`),
    ...(listing.asking_price
      ? {
          offers: {
            '@type': 'Offer',
            price: listing.asking_price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Pass The Plate Marketplace' },
          },
        }
      : {}),
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={productJsonLd} />
      <ListingViewTracker
        listingId={listing.id}
        cuisine={listing.cuisine_type}
        city={listing.city ?? undefined}
      />
      <Header />

      <section className="container pt-32 md:pt-40">
        <Link
          href={`/${locale}/marketplace/browse`}
          className="text-sm font-semibold text-accent hover:text-accent-dark"
        >
          ← {commonT('backToListings')}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
                  {cuisineT(listing.cuisine_type)}
                </span>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-800">
                  {typeT(listing.business_type)}
                </span>
                <span className="rounded-full border border-gray-300 px-3 py-1 text-gray-700">
                  {t(`status${capitalize(listing.status)}` as 'statusActive')}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-bold text-gray-950 md:text-5xl">{title}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
                {listing.city}, {listing.state}
              </p>
            </div>

            {listing.cover_image_url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={listing.cover_image_url}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-950">{description.split('\n')[0]}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">{description}</p>
            </div>

            <FinancialsPanel
              listing={listing}
              locale={locale}
              unlocked={unlocked}
              ndaCtaHref={ndaCtaHref}
              labels={{
                askingPrice: t('askingPrice'),
                grossRevenue: t('grossRevenue'),
                cashFlow: t('cashFlow'),
                monthlyRent: t('monthlyRent'),
                leaseRemaining: t('leaseRemaining'),
                monthsShort: t('monthsShort'),
                sqft: t('sqft'),
                employeesFt: t('employeesFt'),
                employeesPt: t('employeesPt'),
                notProvided: t('notProvided'),
                ndaLockedTitle: t('ndaLockedTitle'),
                ndaLockedBody: t('ndaLockedBody'),
                ndaCta: t('ndaCta'),
              }}
            />

            {listing.equipment_included.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-950">{t('equipment')}</h3>
                <ul className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                  {listing.equipment_included.map((item) => (
                    <li key={item} className="rounded-md bg-gray-50 px-3 py-2">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(reasonForSale || sellerNotes) && (
              <div className="card p-6">
                {reasonForSale && (
                  <>
                    <h3 className="text-xl font-bold text-gray-950">{t('reasonForSale')}</h3>
                    <p className="mt-2 leading-relaxed text-gray-700">{reasonForSale}</p>
                  </>
                )}
                {sellerNotes && (
                  <>
                    <h3 className="mt-6 text-xl font-bold text-gray-950">{t('sellerNotes')}</h3>
                    <p className="mt-2 leading-relaxed text-gray-700">{sellerNotes}</p>
                  </>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              {listing.profiles && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Seller</p>
                  <p className="mt-1 text-lg font-bold text-gray-950">{listing.profiles.business_name}</p>
                  <p className="text-sm text-gray-600">{listing.profiles.full_name}</p>
                </>
              )}

              <Link href={inquireHref} className="btn-primary mt-5 w-full text-center">
                {t('inquireCta')}
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="text-base font-bold text-gray-950">{t('visaEligibility')}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <EligibilityRow label={t('eb5Eligible')} value={listing.visa_eligible_eb5} />
                <EligibilityRow label={t('e2Eligible')} value={listing.visa_eligible_e2} />
                <EligibilityRow label={t('sbaPrequalified')} value={listing.sba_prequalified} />
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <div className="h-16" />
      <Footer />
    </main>
  )
}

function EligibilityRow({ label, value }: { label: string; value: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
      <span className="text-gray-700">{label}</span>
      <span className={`text-xs font-bold ${value ? 'text-emerald-700' : 'text-gray-400'}`}>
        {value ? '✓' : '—'}
      </span>
    </li>
  )
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
