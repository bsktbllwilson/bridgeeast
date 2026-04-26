import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { PtpFooter } from '@/components/ptp/PtpFooter'
import { PtpHeader } from '@/components/ptp/PtpHeader'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!hasLocale(routing.locales, params.locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className="ptp-shell">
        <PtpHeader />
        <main>{children}</main>
        <PtpFooter />
      </div>
    </NextIntlClientProvider>
  )
}
