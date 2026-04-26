import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FindYourNextBigDeal } from '@/components/FindYourNextBigDeal'
import { BuySellSplit } from '@/components/BuySellSplit'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { getFaqsForContact } from '@/data/faqs'
import { ContactForm } from './contact-form'
import { FaqAccordion } from './faq-accordion'

export const metadata = {
  title: 'Contact — Pass The Plate',
  description:
    'Get in touch about buying, selling, membership, or partnership. We respond within one business day.',
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.contactPage' })
  const faqs = getFaqsForContact()
  const playbookHref = localizePath('/playbook', locale)

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="container pt-24 md:pt-32 pb-12 md:pb-16 text-center">
        <p className="text-sm md:text-base tracking-widest uppercase text-gray-600 mb-5">
          {t('kicker')}
        </p>
        <h1 className="font-display text-5xl md:text-7xl xl:text-[110px] font-bold leading-[1.02]">
          {t('heading')}
        </h1>
        <p className="mt-6 text-base md:text-lg text-gray-700 max-w-2xl mx-auto">{t('intro')}</p>
      </section>

      {/* Form + side panel */}
      <section className="container pb-20">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <ContactForm />

          <aside className="rounded-2xl bg-playbook-yellow p-8 md:p-10 space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t('asideHeading')}</h2>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-700 mb-1">
                {t('asideEmail')}
              </p>
              <a
                className="text-lg font-medium text-black hover:underline"
                href="mailto:hello@passtheplate.store"
              >
                hello@passtheplate.store
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-700 mb-1">
                {t('asidePhone')}
              </p>
              <a className="text-lg font-medium text-black hover:underline" href="tel:+19294550000">
                (929) 455-0000
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-700 mb-1">
                {t('asideOfficeHours')}
              </p>
              <p className="text-base text-gray-800">{t('asideOfficeHoursValue')}</p>
            </div>

            <div className="pt-4 border-t border-black/15 space-y-2">
              <p className="text-xs uppercase tracking-widest text-gray-700 mb-1">
                {t('asideSelfServe')}
              </p>
              <Link href="#contact-faqs" className="block text-base font-medium hover:underline">
                {t('asideFaqLink')}
              </Link>
              <Link href={playbookHref} className="block text-base font-medium hover:underline">
                {t('asidePlaybookLink')}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQs */}
      <section id="contact-faqs" className="bg-white border-y border-black/5 scroll-mt-24">
        <div className="container py-16 md:py-24">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center mb-12">
            {t('commonQuestions')}
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <FindYourNextBigDeal locale={locale} />
      <BuySellSplit locale={locale} />
      <Footer />
    </main>
  )
}
