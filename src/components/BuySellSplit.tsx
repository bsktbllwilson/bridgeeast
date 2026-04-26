'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { localizePath, type AppLocale } from '@/i18n/locales'

export function BuySellSplit({ locale }: { locale?: AppLocale } = {}) {
  const t = useTranslations('pages.bottomCtas')
  const buyHref = localizePath('/listings', locale ?? 'en')
  const sellHref = localizePath('/sellers', locale ?? 'en')

  return (
    <section className="bg-white">
      <div className="container section grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-playbook-yellow p-10 md:p-14 flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">{t('buying')}</h3>
            <p className="text-gray-800 mb-8 text-base md:text-lg">{t('buyingBody')}</p>
          </div>
          <Link
            href={buyHref}
            className="inline-block self-start bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            {t('buyingCta')}
          </Link>
        </div>

        <div className="rounded-3xl bg-black text-white p-10 md:p-14 flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">{t('selling')}</h3>
            <p className="text-gray-200 mb-8 text-base md:text-lg">{t('sellingBody')}</p>
          </div>
          <Link
            href={sellHref}
            className="inline-block self-start bg-playbook-yellow text-black px-6 py-3 rounded-full font-medium hover:brightness-95 transition"
          >
            {t('sellingCta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
