'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FindYourNextBigDeal } from '@/components/FindYourNextBigDeal'
import { BuySellSplit } from '@/components/BuySellSplit'
import { TranslationBadge } from '@/components/TranslationBadge'
import { hasSupabaseEnv, supabase } from '@/lib/supabase'
import { pickLocalizedField } from '@/lib/i18n-content'
import { localizePath, type AppLocale } from '@/i18n/locales'
import {
  PLAYBOOK_CATEGORIES,
  PLAYBOOK_FALLBACK_POSTS,
  buildExcerpt,
  coverGradientFor,
  type PlaybookPost,
} from './playbook-data'
import { SubscribeCard } from './subscribe-card'

const PAGE_SIZE = 12

export default function PlaybookIndexPage() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('pages.playbookPage')
  const [posts, setPosts] = useState<PlaybookPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('Read All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!hasSupabaseEnv) throw new Error('supabase not configured')
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .eq('published', true)
          .order('updated_at', { ascending: false })
        if (error) throw error
        setPosts((data as PlaybookPost[] | null) ?? PLAYBOOK_FALLBACK_POSTS)
      } catch (err) {
        console.error('playbook fetch failed, using fallback', err)
        setPosts(PLAYBOOK_FALLBACK_POSTS)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'Read All') return posts
    return posts.filter((p) => p.category === activeCategory)
  }, [posts, activeCategory])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const onPickCategory = (cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="relative w-full h-[50vh] min-h-[360px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg,#1a0f08 0%,#3b1f10 45%,#7c2d12 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="relative h-full container flex flex-col justify-end pb-10 md:pb-14">
          <p className="text-cream/80 text-sm md:text-base tracking-widest uppercase mb-3">
            {t('kicker')}
          </p>
          <h1 className="font-display text-cream text-6xl md:text-9xl xl:text-[10rem] font-bold leading-none">
            {t('heading')}
          </h1>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-b border-black/5 bg-cream sticky top-0 z-10">
        <div className="container py-5 flex gap-3 overflow-x-auto no-scrollbar">
          {PLAYBOOK_CATEGORIES.map((cat) => {
            const active = activeCategory === cat
            const label = cat === 'Read All' ? t('categoryAll') : cat
            return (
              <button
                key={cat}
                onClick={() => onPickCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-playbook-yellow text-black border border-playbook-yellow'
                    : 'bg-transparent text-gray-700 border border-gray-300 hover:border-playbook-yellow hover:text-black'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Post grid w/ subscribe injection */}
      <section className="container section">
        {loading ? (
          <div className="py-20 text-center text-gray-500">{t('loading')}</div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center text-gray-500">{t('empty')}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {interleaveSubscribe(visible).map((item, idx) =>
              item.kind === 'post' ? (
                <PostCard key={item.post.id} post={item.post} locale={locale} />
              ) : (
                <SubscribeCard key={`subscribe-${idx}`} />
              )
            )}
          </div>
        )}

        {pageCount > 1 && (
          <Pagination
            current={currentPage}
            total={pageCount}
            onChange={(p) => {
              setPage(p)
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          />
        )}
      </section>

      <FindYourNextBigDeal locale={locale} />
      <BuySellSplit locale={locale} />
      <Footer />
    </main>
  )
}

type GridItem = { kind: 'post'; post: PlaybookPost } | { kind: 'subscribe' }

function interleaveSubscribe(posts: PlaybookPost[]): GridItem[] {
  const out: GridItem[] = []
  posts.forEach((post, idx) => {
    out.push({ kind: 'post', post })
    if ((idx + 1) % 4 === 0 && idx !== posts.length - 1) {
      out.push({ kind: 'subscribe' })
    }
  })
  return out
}

function PostCard({ post, locale }: { post: PlaybookPost; locale: AppLocale }) {
  const t = useTranslations('pages.playbookPage')
  const localizedTitle = pickLocalizedField(post, 'title', locale)
  const localizedContent = pickLocalizedField(post, 'content', locale)
  return (
    <Link
      href={localizePath(`/playbook/${post.slug}`, locale)}
      className="group flex flex-col rounded-2xl bg-white border border-black/5 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div
        className="relative aspect-[16/10] w-full"
        style={{ background: coverGradientFor(post.slug) }}
      >
        <span className="absolute bottom-4 left-4 inline-block rounded-full bg-playbook-yellow text-black text-xs font-semibold px-3 py-1.5">
          {post.category}
        </span>
      </div>
      <div className="p-7 flex flex-col flex-grow">
        <div className="flex items-start gap-2 mb-3">
          <h3 className="font-display text-2xl md:text-[28px] font-bold leading-tight group-hover:text-accent transition-colors flex-1">
            {localizedTitle.value}
          </h3>
        </div>
        {localizedTitle.reason === 'fallback' && (
          <TranslationBadge reason="fallback" className="mb-3 self-start" />
        )}
        <p className="text-gray-700 text-sm mb-6 line-clamp-3">
          {buildExcerpt(localizedContent.value)}
        </p>
        <span className="mt-auto text-sm font-semibold text-black group-hover:translate-x-1 transition-transform">
          {t('readGuide')}
        </span>
      </div>
    </Link>
  )
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number
  total: number
  onChange: (page: number) => void
}) {
  const t = useTranslations('pages.playbookPage')
  return (
    <nav className="mt-16 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-4 py-2 rounded-full border border-gray-300 text-sm disabled:opacity-40 hover:border-black"
      >
        {t('prev')}
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
            p === current
              ? 'bg-black text-white'
              : 'bg-transparent text-gray-700 hover:bg-black/5'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="px-4 py-2 rounded-full border border-gray-300 text-sm disabled:opacity-40 hover:border-black"
      >
        {t('next')}
      </button>
    </nav>
  )
}
