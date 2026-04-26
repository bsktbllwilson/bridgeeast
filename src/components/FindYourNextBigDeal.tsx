'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { localizePath, type AppLocale } from '@/i18n/locales'

export function FindYourNextBigDeal({ locale }: { locale?: AppLocale } = {}) {
  const t = useTranslations('pages.bottomCtas')
  const href = localizePath('/marketplace/browse', locale ?? 'en')
  return (
    <section className="bg-cream">
      <div className="container section text-center max-w-3xl">
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
          {t('findDealHeading')}
        </h2>
        <p className="text-lg text-gray-700 mb-8">{t('findDealBody')}</p>
        <Link href={href} className="btn-primary">
          {t('findDealCta')}
        </Link>
      </div>
    </section>
  )
}
