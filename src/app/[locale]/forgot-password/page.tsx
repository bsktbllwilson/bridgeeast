import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { ForgotPasswordForm } from './forgot-password-form'

export const metadata = { title: 'Reset password — Pass The Plate' }

export default async function ForgotPasswordPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.auth' })

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
            {t('forgotHeading')}
          </h1>
          <p className="text-center text-gray-700 mb-8">{t('forgotBody')}</p>

          <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 shadow-sm">
            <ForgotPasswordForm />
          </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            {t('rememberedIt')}{' '}
            <Link href={localizePath('/sign-in', locale)} className="underline hover:text-black">
              {t('backToSignIn')}
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
