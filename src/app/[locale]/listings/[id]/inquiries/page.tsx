'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { InlineTranslation } from '@/components/InlineTranslation'
import { findSampleListing, getSampleInquiryThread } from '@/lib/marketplace'

export default function InquiryThreadPage({ params }: { params: { id: string } }) {
  const t = useTranslations('inquiryThread')
  const commonT = useTranslations('common')
  const locale = useLocale()

  const listing = useMemo(() => findSampleListing(params.id), [params.id])
  const thread = useMemo(() => getSampleInquiryThread(params.id), [params.id])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pb-16 pt-32 md:pt-40">
        <div className="mb-8 max-w-3xl">
          <p className="badge mb-6">{t('badge')}</p>
          <h1 className="heading-hero mb-4">{t('title')}</h1>
          <p className="text-lead">{t('subtitle')}</p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link href={`/${locale}/listings/${params.id}`} className="btn-secondary">
            {commonT('viewListingDetails')}
          </Link>
          {listing && <span className="text-sm text-gray-500">{listing.title}</span>}
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {t('sampleNotice')}
        </div>

        {thread.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">{t('empty')}</div>
        ) : (
          <div className="space-y-5">
            {thread.map((message) => {
              const isSeller = message.author === 'seller'

              return (
                <article
                  key={message.id}
                  className={`card max-w-3xl p-6 ${isSeller ? 'ml-auto border-green-200 bg-green-50/60' : 'mr-auto border-gray-200 bg-white'}`}
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-950">{message.sender_name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{isSeller ? t('seller') : t('buyer')}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(message.sent_at).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                    </p>
                  </div>

                  <p className="text-body">{message.body}</p>

                  {isSeller && <InlineTranslation text={message.body} />}
                </article>
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}