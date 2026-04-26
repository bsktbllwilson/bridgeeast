import type { MetadataRoute } from 'next'
import { hasSupabaseAdminEnv, getSupabaseAdmin } from '@/lib/supabase-admin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://passtheplate.store'

const STATIC_PATHS: Array<{ path: string; priority: number; change: 'daily' | 'weekly' | 'monthly' }> = [
  { path: '/', priority: 1.0, change: 'weekly' },
  { path: '/listings', priority: 0.9, change: 'daily' },
  { path: '/marketplace/browse', priority: 0.9, change: 'daily' },
  { path: '/playbook', priority: 0.8, change: 'weekly' },
  { path: '/partners', priority: 0.8, change: 'weekly' },
  { path: '/about', priority: 0.6, change: 'monthly' },
  { path: '/contact', priority: 0.6, change: 'monthly' },
  { path: '/sign-up', priority: 0.7, change: 'monthly' },
  { path: '/sign-in', priority: 0.5, change: 'monthly' },
  { path: '/waitlist', priority: 0.5, change: 'monthly' },
]

const LOCALES = ['en', 'zh', 'ko', 'vi'] as const

function localizeUrl(path: string, locale: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`
  if (path === '/') return `${SITE_URL}${prefix || '/'}`
  return `${SITE_URL}${prefix}${path}`
}

async function fetchListings(): Promise<Array<{ id: string; updated_at: string | null }>> {
  if (!hasSupabaseAdminEnv()) return []
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('ptp_business_listings')
      .select('id, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(2000)
    if (error) {
      console.error('sitemap: listings query failed', error)
      return []
    }
    return (data as Array<{ id: string; updated_at: string | null }> | null) ?? []
  } catch (err) {
    console.error('sitemap: listings fetch failed', err)
    return []
  }
}

async function fetchPlaybook(): Promise<Array<{ slug: string; updated_at: string | null }>> {
  if (!hasSupabaseAdminEnv()) return []
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('guides')
      .select('slug, updated_at')
      .eq('published', true)
      .limit(1000)
    if (error) {
      console.error('sitemap: guides query failed', error)
      return []
    }
    return (data as Array<{ slug: string; updated_at: string | null }> | null) ?? []
  } catch (err) {
    console.error('sitemap: guides fetch failed', err)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, playbook] = await Promise.all([fetchListings(), fetchPlaybook()])

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(({ path, priority, change }) =>
    LOCALES.map((locale) => ({
      url: localizeUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: change,
      priority,
    }))
  )

  const listingEntries: MetadataRoute.Sitemap = listings.flatMap((l) =>
    LOCALES.map((locale) => ({
      url: localizeUrl(`/marketplace/listings/${l.id}`, locale),
      lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  const playbookEntries: MetadataRoute.Sitemap = playbook.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: localizeUrl(`/playbook/${p.slug}`, locale),
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...listingEntries, ...playbookEntries]
}
