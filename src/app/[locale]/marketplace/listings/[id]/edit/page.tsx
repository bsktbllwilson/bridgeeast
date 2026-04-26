import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { type AppLocale } from '@/i18n/locales'
import { getBusinessListing } from '@/lib/marketplace/queries'

export default async function EditListingPage({
  params: { locale, id },
}: {
  params: { locale: AppLocale; id: string }
}) {
  const { listing } = await getBusinessListing(id)
  if (!listing) notFound()

  const t = await getTranslations({ locale, namespace: 'marketplace.listing' })
  const commonT = await getTranslations({ locale, namespace: 'common' })

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="container pt-32 md:pt-40">
        <Link
          href={`/${locale}/marketplace/listings/${listing.id}`}
          className="text-sm font-semibold text-accent hover:text-accent-dark"
        >
          ← {commonT('backToListings')}
        </Link>
        <h1 className="mt-6 section-title">{t('editCta')}</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          A full edit experience for an existing listing wires up here once the seller dashboard auth flow
          lands. For now you can preview the listing or jump back to your inquiries.
        </p>

        <div className="mt-6 flex gap-3">
          <Link href={`/${locale}/marketplace/listings/${listing.id}`} className="btn-secondary">
            {commonT('viewListingDetails')}
          </Link>
          <Link href={`/${locale}/marketplace/inbox`} className="btn-outline">
            {t('viewInquiries')}
          </Link>
        </div>
      </section>
      <div className="h-24" />
      <Footer />
    </main>
  )
}
