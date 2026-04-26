import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { getCurrentUser } from '@/lib/auth'
import { createSupabaseServerClient, hasSupabaseAuthEnv } from '@/lib/supabase-server'

export const metadata = { title: 'Translations — Admin' }
export const dynamic = 'force-dynamic'

interface GuideRow {
  id: string
  slug: string
  title: string
  category: string
  title_zh: string | null
  title_ko: string | null
  title_vi: string | null
  content_zh: string | null
  content_ko: string | null
  content_vi: string | null
  updated_at: string | null
}

const LOCALES: Array<Exclude<AppLocale, 'en'>> = ['zh', 'ko', 'vi']

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowList = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return allowList.includes(email.toLowerCase())
}

async function fetchGuides(): Promise<GuideRow[]> {
  if (!hasSupabaseAuthEnv()) return []
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('guides')
    .select(
      'id, slug, title, category, title_zh, title_ko, title_vi, content_zh, content_ko, content_vi, updated_at'
    )
    .eq('published', true)
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('admin translations: fetch failed', error)
    return []
  }
  return (data as GuideRow[] | null) ?? []
}

export default async function AdminTranslationsPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale as AppLocale
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <div className="container pt-32 pb-24 text-center">
          <p className="text-gray-700 mb-6">Sign in as an admin to access translations.</p>
          <Link href={localizePath('/sign-in?next=/admin/translations', locale)} className="btn-primary">
            Sign in
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  if (!isAdminEmail(user.email)) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <div className="container pt-32 pb-24 text-center">
          <p className="text-gray-700">
            This page is restricted to admins. Add your email to{' '}
            <code className="text-sm bg-white px-2 py-1 rounded">ADMIN_EMAILS</code> to enable
            access.
          </p>
        </div>
        <Footer />
      </main>
    )
  }

  const guides = await fetchGuides()

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-gray-600 mb-4">Admin</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Translations</h1>
          <p className="text-gray-700 mb-10 max-w-2xl">
            Per-locale title + content status for the playbook (`guides` table). For v1 you paste
            translations directly in Supabase — this page surfaces what’s missing. A native editor
            comes in v2.
          </p>

          {guides.length === 0 ? (
            <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 text-center text-gray-700">
              No guides loaded. (Check Supabase env vars.)
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-white border border-black/5">
              <table className="w-full text-sm">
                <thead className="bg-cream border-b border-black/5">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Slug / Title</th>
                    <th className="text-left px-3 py-3 font-semibold">Category</th>
                    {LOCALES.map((loc) => (
                      <th key={loc} className="text-center px-3 py-3 font-semibold uppercase">
                        {loc}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guides.map((g) => (
                    <tr key={g.id} className="border-b border-black/5 last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{g.title}</div>
                        <div className="text-xs text-gray-500">{g.slug}</div>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{g.category}</td>
                      {LOCALES.map((loc) => {
                        const titleKey = `title_${loc}` as 'title_zh' | 'title_ko' | 'title_vi'
                        const contentKey = `content_${loc}` as
                          | 'content_zh'
                          | 'content_ko'
                          | 'content_vi'
                        const titleOk = Boolean(g[titleKey] && g[titleKey]!.trim())
                        const contentOk = Boolean(g[contentKey] && g[contentKey]!.trim())
                        const both = titleOk && contentOk
                        const partial = (titleOk || contentOk) && !both
                        return (
                          <td key={loc} className="px-3 py-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                                both
                                  ? 'bg-green-100 text-green-900'
                                  : partial
                                    ? 'bg-playbook-yellow text-black'
                                    : 'bg-gray-100 text-gray-500'
                              }`}
                              title={
                                both
                                  ? 'title + content translated'
                                  : partial
                                    ? `${titleOk ? 'title only' : 'content only'}`
                                    : 'missing'
                              }
                            >
                              {both ? '✓' : partial ? '½' : '—'}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-gray-600 mt-6">
            Legend: <span className="font-semibold">✓</span> both title + content translated ·{' '}
            <span className="font-semibold">½</span> partial · <span className="font-semibold">—</span>{' '}
            missing. Edit the corresponding <code className="bg-white px-1.5 py-0.5 rounded">title_*</code>{' '}
            / <code className="bg-white px-1.5 py-0.5 rounded">content_*</code> columns in Supabase.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
