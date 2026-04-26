import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { getCurrentProfile } from '@/lib/auth'
import { VerifyForm } from './verify-form'

export const metadata = { title: 'Verify proof of funds — Pass The Plate' }
export const dynamic = 'force-dynamic'

const STATUS_TONES: Record<string, string> = {
  none: 'bg-gray-100 text-gray-800',
  pending: 'bg-playbook-yellow text-black',
  verified: 'bg-green-100 text-green-900',
  rejected: 'bg-red-100 text-red-900',
}

export default async function VerifyPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.verifyPage' })
  const profile = await getCurrentProfile()
  const status = profile?.proof_of_funds_status ?? 'none'
  const tone = STATUS_TONES[status] ?? STATUS_TONES.none
  const labelKey = `status${status[0].toUpperCase()}${status.slice(1)}Label`
  const bodyKey = `status${status[0].toUpperCase()}${status.slice(1)}Body`

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-gray-600 mb-4">{t('kicker')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('heading')}</h1>
          <p className="text-gray-700 mb-10 max-w-xl">{t('intro')}</p>

          <div className={`mb-8 rounded-2xl px-5 py-4 flex items-center gap-4 ${tone}`}>
            <span className="font-display text-lg font-bold">{t(labelKey as never)}</span>
            <span className="text-sm">{t(bodyKey as never)}</span>
          </div>

          {status === 'verified' ? (
            <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 text-center">
              <p className="text-gray-700 mb-6">{t('verifiedBody')}</p>
              <Link href={localizePath('/marketplace/browse', locale)} className="btn-primary">
                {t('browseListings')}
              </Link>
            </div>
          ) : (
            <VerifyForm />
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
