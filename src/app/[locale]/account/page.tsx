import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { localizePath, type AppLocale } from '@/i18n/locales'
import { getCurrentProfile } from '@/lib/auth'
import { createSupabaseServerClient, hasSupabaseAuthEnv } from '@/lib/supabase-server'
import { AccountSettings } from './account-settings'
import { MembershipPanel } from './membership-panel'

export const metadata = { title: 'Account — Pass The Plate' }
export const dynamic = 'force-dynamic'

const VALID_TABS = ['listings', 'inquiries', 'membership', 'settings'] as const
type Tab = (typeof VALID_TABS)[number]

interface PageProps {
  params: { locale: string }
  searchParams: { tab?: string }
}

interface ListingRow {
  id: string
  title: string
  city: string | null
  state: string | null
  status: string | null
  asking_price: number | string | null
  created_at: string
}

interface InquiryRow {
  id: string
  subject: string | null
  status: string | null
  created_at: string
  ptp_business_listings: { title: string | null; city: string | null } | null
}

async function fetchListings(profileId: string): Promise<ListingRow[]> {
  if (!hasSupabaseAuthEnv()) return []
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('ptp_business_listings')
    .select('id, title, city, state, status, asking_price, created_at')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) {
    console.error('account: listings fetch failed', error)
    return []
  }
  return (data as ListingRow[] | null) ?? []
}

async function fetchInquiries(profileId: string): Promise<InquiryRow[]> {
  if (!hasSupabaseAuthEnv()) return []
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('ptp_inquiry_threads')
    .select(
      'id, subject, status, created_at, ptp_business_listings(title, city)'
    )
    .eq('buyer_profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) {
    console.error('account: inquiries fetch failed', error)
    return []
  }
  return (data as unknown as InquiryRow[]) ?? []
}

export default async function AccountPage({ params, searchParams }: PageProps) {
  const locale = params.locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'pages.accountPage' })
  const profile = await getCurrentProfile()

  if (!profile) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <div className="container pt-32 pb-24 text-center">
          <p className="text-gray-700 mb-6">{t('loadFailed')}</p>
          <Link href={localizePath('/sign-in', locale)} className="btn-primary">
            {t('loadFailedCta')}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const requestedTab = (searchParams.tab ?? '').toLowerCase()
  const isSeller = profile.role === 'seller' || profile.role === 'both'
  const isBuyer = profile.role === 'buyer' || profile.role === 'both'

  let activeTab: Tab = 'membership'
  if (VALID_TABS.includes(requestedTab as Tab)) {
    activeTab = requestedTab as Tab
  } else if (isSeller) {
    activeTab = 'listings'
  } else if (isBuyer) {
    activeTab = 'inquiries'
  }
  if (activeTab === 'listings' && !isSeller) activeTab = 'inquiries'
  if (activeTab === 'inquiries' && !isBuyer) activeTab = 'membership'

  const [listings, inquiries] = await Promise.all([
    activeTab === 'listings' && isSeller ? fetchListings(profile.id) : Promise.resolve([]),
    activeTab === 'inquiries' && isBuyer ? fetchInquiries(profile.id) : Promise.resolve([]),
  ])

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'listings', label: t('tabListings'), show: isSeller },
    { key: 'inquiries', label: t('tabInquiries'), show: isBuyer },
    { key: 'membership', label: t('tabMembership'), show: true },
    { key: 'settings', label: t('tabSettings'), show: true },
  ]

  const greeting = profile.full_name?.trim() || profile.email
  const proofStatus = profile.proof_of_funds_status

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-2">
            <p className="text-sm tracking-widest uppercase text-gray-600">{t('kicker')}</p>
            {isBuyer && proofStatus !== 'verified' && (
              <Link
                href={localizePath('/verify', locale)}
                className="text-sm font-medium underline text-gray-700 hover:text-black"
              >
                {proofStatus === 'pending' ? t('verifyPendingCta') : t('verifyCta')}
              </Link>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-10">
            {locale === 'en' ? `Hi, ${greeting}` : greeting}
          </h1>

          {/* Tabs */}
          <nav className="flex gap-2 overflow-x-auto no-scrollbar mb-8 border-b border-black/10">
            {tabs
              .filter((tab) => tab.show)
              .map((tab) => {
                const active = tab.key === activeTab
                return (
                  <Link
                    key={tab.key}
                    href={`${localizePath('/account', locale)}?tab=${tab.key}`}
                    className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      active
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-600 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </Link>
                )
              })}
          </nav>

          {/* Panels */}
          {activeTab === 'listings' && (
            <ListingsPanel listings={listings} locale={locale} />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesPanel inquiries={inquiries} locale={locale} />
          )}

          {activeTab === 'membership' && (
            <MembershipPanel
              tier={profile.membership_tier}
              status={profile.membership_status}
              currentPeriodEnd={profile.membership_current_period_end}
              hasStripeCustomer={Boolean(profile.stripe_customer_id)}
            />
          )}

          {activeTab === 'settings' && (
            <AccountSettings
              email={profile.email}
              initialFullName={profile.full_name ?? ''}
              initialPhone={profile.phone ?? ''}
              initialLanguage={profile.preferred_language}
            />
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

async function ListingsPanel({
  listings,
  locale,
}: {
  listings: ListingRow[]
  locale: AppLocale
}) {
  const t = await getTranslations({ locale, namespace: 'pages.accountPage' })
  if (listings.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 text-center">
        <h3 className="font-display text-2xl font-bold mb-2">{t('noListingsHeading')}</h3>
        <p className="text-gray-700 mb-6">{t('noListingsBody')}</p>
        <Link href={localizePath('/marketplace/listings/new', locale)} className="btn-primary">
          {t('noListingsCta')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {listings.map((l) => (
        <Link
          key={l.id}
          href={localizePath(`/marketplace/listings/${l.id}`, locale)}
          className="block rounded-2xl bg-white border border-black/5 p-5 md:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-display text-lg md:text-xl font-bold">{l.title}</h3>
              <p className="text-sm text-gray-700">
                {[l.city, l.state].filter(Boolean).join(', ') || '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                {l.status ?? 'draft'}
              </p>
              {l.asking_price != null && (
                <p className="font-display text-lg font-bold">
                  ${Number(l.asking_price).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

async function InquiriesPanel({
  inquiries,
  locale,
}: {
  inquiries: InquiryRow[]
  locale: AppLocale
}) {
  const t = await getTranslations({ locale, namespace: 'pages.accountPage' })
  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 text-center">
        <h3 className="font-display text-2xl font-bold mb-2">{t('noInquiriesHeading')}</h3>
        <p className="text-gray-700 mb-6">{t('noInquiriesBody')}</p>
        <Link href={localizePath('/marketplace/browse', locale)} className="btn-primary">
          {t('noInquiriesCta')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {inquiries.map((q) => (
        <Link
          key={q.id}
          href={localizePath(`/marketplace/inbox/${q.id}`, locale)}
          className="block rounded-2xl bg-white border border-black/5 p-5 md:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-display text-lg md:text-xl font-bold">
                {q.ptp_business_listings?.title ?? 'Listing'}
              </h3>
              <p className="text-sm text-gray-700">{q.subject ?? 'No subject'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {q.ptp_business_listings?.city ?? '—'} · sent{' '}
                {new Date(q.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-gray-500">
              {q.status ?? 'open'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
