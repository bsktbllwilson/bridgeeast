'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { NDAGate } from '@/components/marketplace/NDAGate'
import { type AppLocale, isAppLocale } from '@/i18n/locales'

export default function InquirePage() {
  const params = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const commonT = useTranslations('common')

  const locale: AppLocale = isAppLocale(params.locale) ? params.locale : 'en'
  const listingId = params.id

  const handleSigned = async (_fullName: string) => {
    // Wiring to /api/ptp/nda-acceptances comes later; for the scaffold we redirect
    // back to the listing detail with the unlocked param so financials reveal.
    router.push(`/${locale}/marketplace/listings/${listingId}?nda=signed`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="container pt-32 md:pt-40">
        <Link
          href={`/${locale}/marketplace/listings/${listingId}`}
          className="text-sm font-semibold text-accent hover:text-accent-dark"
        >
          ← {commonT('backToListings')}
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <NDAGate listingId={listingId} onSigned={handleSigned} />
          <aside className="card p-6 text-sm text-gray-600">
            <p>
              After signing, you&apos;ll see full financials and can start an inquiry thread directly with the
              seller. The signed name is recorded in <code>ptp_nda_acceptances</code>.
            </p>
          </aside>
        </div>
      </section>
      <div className="h-16" />
      <Footer />
    </main>
  )
}
