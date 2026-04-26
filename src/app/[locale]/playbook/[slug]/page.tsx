import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FindYourNextBigDeal } from '@/components/FindYourNextBigDeal'
import { BuySellSplit } from '@/components/BuySellSplit'
import { TranslationBadge } from '@/components/TranslationBadge'
import { JsonLd } from '@/components/JsonLd'
import { hasSupabaseAuthEnv, createSupabaseServerClient } from '@/lib/supabase-server'
import { pickLocalizedField } from '@/lib/i18n-content'
import { localizePath, type AppLocale } from '@/i18n/locales'
import {
  PLAYBOOK_FALLBACK_POSTS,
  buildExcerpt,
  coverGradientFor,
  stripHtml,
  type PlaybookPost,
} from '../playbook-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://passtheplate.store'

interface PageProps {
  params: { locale: string; slug: string }
}

async function loadPost(
  slug: string
): Promise<{ post: PlaybookPost | null; related: PlaybookPost[] }> {
  if (!hasSupabaseAuthEnv()) {
    const fallback = PLAYBOOK_FALLBACK_POSTS.find((p) => p.slug === slug) ?? null
    const related = fallback
      ? PLAYBOOK_FALLBACK_POSTS.filter(
          (p) => p.category === fallback.category && p.slug !== fallback.slug
        ).slice(0, 3)
      : []
    return { post: fallback, related }
  }

  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (error) throw error
    if (!data) return { post: null, related: [] }
    const post = data as PlaybookPost

    const { data: rel } = await supabase
      .from('guides')
      .select('*')
      .eq('published', true)
      .eq('category', post.category)
      .neq('slug', slug)
      .limit(3)

    return { post, related: (rel as PlaybookPost[] | null) ?? [] }
  } catch (err) {
    console.error('playbook detail fetch failed, using fallback', err)
    const fallback = PLAYBOOK_FALLBACK_POSTS.find((p) => p.slug === slug) ?? null
    const related = fallback
      ? PLAYBOOK_FALLBACK_POSTS.filter(
          (p) => p.category === fallback.category && p.slug !== fallback.slug
        ).slice(0, 3)
      : []
    return { post: fallback, related }
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = params.locale as AppLocale
  const { post } = await loadPost(params.slug)
  if (!post) {
    return {
      title: 'Guide not found',
      robots: { index: false, follow: true },
    }
  }
  const title = pickLocalizedField(post, 'title', locale).value
  const content = pickLocalizedField(post, 'content', locale).value
  const description = buildExcerpt(content, 200)
  const path =
    locale === 'en' ? `/playbook/${post.slug}` : `/${locale}/playbook/${post.slug}`
  const ogParams = new URLSearchParams({
    title,
    subtitle: description,
    eyebrow: post.category,
  })
  const ogImage = `${SITE_URL}/api/og?${ogParams.toString()}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PlaybookPostPage({ params }: PageProps) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.playbookPage' })
  const { post, related } = await loadPost(params.slug)

  if (!post) {
    notFound()
  }

  const updated = post.updated_at ? new Date(post.updated_at) : null
  const localizedTitle = pickLocalizedField(post, 'title', locale)
  const localizedContent = pickLocalizedField(post, 'content', locale)
  const minRead = Math.max(1, Math.ceil(localizedContent.value.length / 1200))

  const path =
    locale === 'en' ? `/playbook/${post.slug}` : `/${locale}/playbook/${post.slug}`
  const ogParams = new URLSearchParams({
    title: localizedTitle.value,
    subtitle: stripHtml(localizedContent.value).slice(0, 180),
    eyebrow: post.category,
  })
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: localizedTitle.value,
    description: buildExcerpt(localizedContent.value, 200),
    datePublished: post.created_at ?? undefined,
    dateModified: post.updated_at ?? post.created_at ?? undefined,
    inLanguage: locale,
    mainEntityOfPage: `${SITE_URL}${path}`,
    image: `${SITE_URL}/api/og?${ogParams.toString()}`,
    author: {
      '@type': 'Organization',
      name: 'Pass The Plate Editorial',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pass The Plate',
      url: SITE_URL,
    },
    articleSection: post.category,
  }

  return (
    <main className="min-h-screen bg-cream">
      <JsonLd data={blogJsonLd} />
      <Header />

      <article className="container pt-28 md:pt-36 pb-16">
        <nav className="mb-8 max-w-3xl mx-auto text-sm">
          <Link
            href={localizePath('/playbook', locale)}
            className="text-gray-600 hover:text-black"
          >
            {t('breadcrumbHome')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">{post.category}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <div
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10"
            style={{ background: coverGradientFor(post.slug) }}
          >
            <span className="absolute bottom-5 left-5 inline-block rounded-full bg-playbook-yellow text-black text-xs font-semibold px-3 py-1.5">
              {post.category}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="inline-block rounded-full bg-playbook-yellow text-black text-xs font-semibold px-3 py-1.5">
              {post.phase}
            </span>
            {localizedContent.reason === 'fallback' && <TranslationBadge reason="fallback" />}
          </div>

          <h1 className="font-display text-4xl md:text-[56px] font-bold leading-[1.05] mb-6">
            {localizedTitle.value}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-12 pb-8 border-b border-black/10">
            <span className="font-medium text-gray-800">{t('byline')}</span>
            <span aria-hidden>•</span>
            {updated ? (
              <span>
                {updated.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            ) : null}
            <span aria-hidden>•</span>
            <span>{minRead} min</span>
          </div>

          <div
            className="prose prose-lg prose-headings:font-display prose-headings:font-bold prose-a:text-accent max-w-none"
            dangerouslySetInnerHTML={{ __html: localizedContent.value }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white border-t border-black/5">
          <div className="container py-16 md:py-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center">
              {t('keepReading')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => {
                const rTitle = pickLocalizedField(r, 'title', locale)
                const rContent = pickLocalizedField(r, 'content', locale)
                return (
                  <Link
                    key={r.id}
                    href={localizePath(`/playbook/${r.slug}`, locale)}
                    className="group flex flex-col rounded-2xl bg-cream border border-black/5 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div
                      className="aspect-[16/10] w-full"
                      style={{ background: coverGradientFor(r.slug) }}
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-semibold text-gray-600 mb-2">{r.category}</span>
                      <h3 className="font-display text-xl font-bold mb-2 leading-tight group-hover:text-accent transition-colors">
                        {rTitle.value}
                      </h3>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                        {buildExcerpt(rContent.value, 120)}
                      </p>
                      <span className="mt-auto text-sm font-semibold text-black group-hover:translate-x-1 transition-transform">
                        {t('readGuide')}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <FindYourNextBigDeal locale={locale} />
      <BuySellSplit locale={locale} />
      <Footer />
    </main>
  )
}
