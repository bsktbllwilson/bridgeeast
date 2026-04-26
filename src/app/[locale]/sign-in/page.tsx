import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { SignInForm } from './sign-in-form'

export const metadata = { title: 'Sign In — Pass The Plate' }

interface PageProps {
  params: { locale: string }
  searchParams: { next?: string; error?: string }
}

const ERROR_COPY: Record<string, string> = {
  missing_env: 'Auth is not configured yet. Check back shortly.',
  missing_code: 'That sign-in link is missing a code. Try again.',
  callback_failed: "We couldn't complete your sign-in. Try again.",
}

export default async function SignInPage({ params, searchParams }: PageProps) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.auth' })
  const next = searchParams.next ?? null
  const initialError = searchParams.error ? (ERROR_COPY[searchParams.error] ?? null) : null
  const signUpBase = localizePath('/sign-up', locale)
  const signUpHref = next ? `${signUpBase}?next=${encodeURIComponent(next)}` : signUpBase
  const forgotHref = localizePath('/forgot-password', locale)

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
            {t('signInHeading')}
          </h1>
          <p className="text-center text-gray-700 mb-8">{t('signInBody')}</p>

          <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 shadow-sm">
            <SignInForm next={next} initialError={initialError} />

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link href={forgotHref} className="text-gray-700 hover:text-black underline">
                {t('forgotPassword')}
              </Link>
              <Link href={signUpHref} className="text-gray-700 hover:text-black underline">
                {t('createAccount')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
