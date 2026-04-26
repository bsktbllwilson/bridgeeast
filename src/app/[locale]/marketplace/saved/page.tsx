import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SavedSearchCard } from '@/components/marketplace/SavedSearchCard'
import { type AppLocale } from '@/i18n/locales'
import { listSavedSearches } from '@/lib/marketplace/queries'

const SCAFFOLD_PROFILE_ID = 'aaaa3333-3333-3333-3333-333333333333'

export default async function SavedSearchesPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.saved' })
  const browseT = await getTranslations({ locale, namespace: 'marketplace.browse' })

  const { searches } = await listSavedSearches(SCAFFOLD_PROFILE_ID)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="container pt-32 md:pt-40">
        <div className="max-w-3xl">
          <h1 className="section-title">{t('title')}</h1>
          <p className="mt-3 text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {searches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              {t('empty')}
            </p>
          ) : (
            searches.map((search) => (
              <SavedSearchCard
                key={search.id}
                search={search}
                browseHref={`/${locale}/marketplace/browse`}
                locale={locale}
                labels={{
                  frequency: t('frequency'),
                  frequencyInstant: t('frequencyInstant'),
                  frequencyDaily: t('frequencyDaily'),
                  frequencyWeekly: t('frequencyWeekly'),
                  frequencyNone: t('frequencyNone'),
                  delete: t('delete'),
                  lastMatch: t('lastMatch'),
                  open: browseT('saveSearch'),
                }}
              />
            ))
          )}
        </div>
      </section>
      <div className="h-24" />
      <Footer />
    </main>
  )
}
