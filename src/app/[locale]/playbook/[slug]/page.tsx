'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FindYourNextBigDeal } from '@/components/FindYourNextBigDeal'
import { BuySellSplit } from '@/components/BuySellSplit'
import { hasSupabaseEnv, supabase } from '@/lib/supabase'
import { localizePath, type AppLocale } from '@/i18n/locales'
import {
  PLAYBOOK_FALLBACK_POSTS,
  buildExcerpt,
  coverGradientFor,
  type PlaybookPost,
} from '../playbook-data'

interface PageProps {
  params: { slug: string }
}

export default function PlaybookPostPage({ params }: PageProps) {
  const locale = useLocale() as AppLocale
  const [post, setPost] = useState<PlaybookPost | null>(null)
  const [related, setRelated] = useState<PlaybookPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        if (!hasSupabaseEnv) throw new Error('supabase not configured')
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .eq('slug', params.slug)
          .eq('published', true)
          .single()
        if (error) throw error
        if (!data) {
          setNotFound(true)
          return
        }
        setPost(data as PlaybookPost)

        const { data: rel } = await supabase
          .from('guides')
          .select('*')
          .eq('published', true)
          .eq('category', (data as PlaybookPost).category)
          .neq('slug', params.slug)
          .limit(3)
        setRelated((rel as PlaybookPost[] | null) ?? [])
      } catch (err) {
        console.error('post fetch failed, using fallback', err)
        const fallback = PLAYBOOK_FALLBACK_POSTS.find((p) => p.slug === params.slug)
        if (!fallback) {
          setNotFound(true)
          return
        }
        setPost(fallback)
        setRelated(
          PLAYBOOK_FALLBACK_POSTS.filter(
            (p) => p.category === fallback.category && p.slug !== fallback.slug
          ).slice(0, 3)
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <div className="container section pt-32 md:pt-40 text-center text-gray-500">
          Loading guide…
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <div className="container section pt-32 md:pt-40 text-center">
          <p className="text-gray-700 mb-6">This guide doesn&rsquo;t exist (yet).</p>
          <Link href={localizePath('/playbook', locale)} className="btn-primary">
            ← Back to The Playbook
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const updated = post.updated_at ? new Date(post.updated_at) : null
  const minRead = Math.max(1, Math.ceil(post.content.length / 1200))

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      <article className="container pt-28 md:pt-36 pb-16">
        <nav className="mb-8 max-w-3xl mx-auto text-sm">
          <Link
            href={localizePath('/playbook', locale)}
            className="text-gray-600 hover:text-black"
          >
            The Playbook
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

          <span className="inline-block rounded-full bg-playbook-yellow text-black text-xs font-semibold px-3 py-1.5 mb-5">
            {post.phase}
          </span>

          <h1 className="font-display text-4xl md:text-[56px] font-bold leading-[1.05] mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-12 pb-8 border-b border-black/10">
            <span className="font-medium text-gray-800">Pass The Plate Editorial</span>
            <span aria-hidden>•</span>
            {updated ? (
              <span>
                {updated.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            ) : null}
            <span aria-hidden>•</span>
            <span>{minRead} min read</span>
          </div>

          <div
            className="prose prose-lg prose-headings:font-display prose-headings:font-bold prose-a:text-accent max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white border-t border-black/5">
          <div className="container py-16 md:py-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center">
              Keep reading
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
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
                    <span className="text-xs font-semibold text-gray-600 mb-2">
                      {r.category}
                    </span>
                    <h3 className="font-display text-xl font-bold mb-2 leading-tight group-hover:text-accent transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                      {buildExcerpt(r.content, 120)}
                    </p>
                    <span className="mt-auto text-sm font-semibold text-black group-hover:translate-x-1 transition-transform">
                      Read Guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FindYourNextBigDeal />
      <BuySellSplit />
      <Footer />
    </main>
  )
}
