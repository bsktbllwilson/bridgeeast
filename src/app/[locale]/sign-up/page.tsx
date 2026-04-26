import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { SignUpForm } from './sign-up-form'

export const metadata = { title: 'Sign Up — Pass The Plate' }

interface PageProps {
  params: { locale: string }
  searchParams: { next?: string }
}

export default async function SignUpPage({ params, searchParams }: PageProps) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.auth' })
  const next = searchParams.next ?? null
  const signInBase = localizePath('/sign-in', locale)
  const signInHref = next ? `${signInBase}?next=${encodeURIComponent(next)}` : signInBase

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
            {t('signUpHeading')}
          </h1>
          <p className="text-center text-gray-700 mb-8">{t('signUpBody')}</p>

          <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 shadow-sm">
            <SignUpForm next={next} />
          </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            {t('alreadyHaveAccount')}{' '}
            <Link href={signInHref} className="underline hover:text-black">
              {t('signInLink')}
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
