'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { supabase } from '@/lib/supabase'

export default function LocalizedHomePage() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [stats, setStats] = useState({
    neighborhoods: 0,
    partners: 0,
    guides: 0,
    waitlist: 0,
  })
  const [previewData, setPreviewData] = useState<Array<{ name: string; rent: string }>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [neighborhoodsRes, partnersRes, guidesRes, waitlistRes] = await Promise.all([
          supabase.from('neighborhoods').select('id', { count: 'exact', head: true }),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('guides').select('id', { count: 'exact', head: true }),
          supabase.from('waitlist').select('id', { count: 'exact', head: true }),
        ])

        setStats({
          neighborhoods: neighborhoodsRes.count || 5,
          partners: partnersRes.count || 8,
          guides: guidesRes.count || 6,
          waitlist: waitlistRes.count || 0,
        })
      } catch {
        setStats({
          neighborhoods: 5,
          partners: 8,
          guides: 6,
          waitlist: 0,
        })
      }

      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('name, avg_rent_sqft')
          .order('name')
          .limit(5)

        if (error) {
          throw error
        }

        setPreviewData(
          (data || []).map((item) => ({
            name: item.name,
            rent: `$${Math.round(item.avg_rent_sqft * 0.8)}–$${Math.round(item.avg_rent_sqft * 1.2)}`,
          })),
        )
      } catch {
        setPreviewData([
          { name: 'Soho', rent: '$45–65' },
          { name: 'East Village', rent: '$35–50' },
          { name: 'Sunset Park', rent: '$20–30' },
          { name: 'Flushing', rent: '$22–35' },
          { name: 'Midtown Manhattan', rent: '$60–85' },
        ])
      }
    }

    void fetchData()
  }, [])

  const pillars = [
    {
      title: t('pillars.marketData.title'),
      description: t('pillars.marketData.description'),
      icon: '📊',
      href: `/${locale}/data`,
    },
    {
      title: t('pillars.curatedGuides.title'),
      description: t('pillars.curatedGuides.description'),
      icon: '📖',
      href: `/${locale}/guides`,
    },
    {
      title: t('pillars.partnerDirectory.title'),
      description: t('pillars.partnerDirectory.description'),
      icon: '🤝',
      href: `/${locale}/partners`,
    },
  ]

  const openingDifficulty = [
    { name: 'Soho', difficulty: t('difficulty.veryHigh'), color: 'bg-red-100 text-red-700' },
    { name: 'East Village', difficulty: t('difficulty.high'), color: 'bg-orange-100 text-orange-700' },
    { name: 'Sunset Park', difficulty: t('difficulty.medium'), color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Flushing', difficulty: t('difficulty.medium'), color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Midtown Manhattan', difficulty: t('difficulty.veryHigh'), color: 'bg-red-100 text-red-700' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="relative overflow-hidden pb-16 pt-12 md:pb-20 md:pt-20">
        <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="badge mb-6 inline-block">
              <span className="text-accent">✨ {t('badge')}</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-950 md:text-6xl">
              {t('titleLine1')}
              <br />
              <span className="text-accent">{t('titleHighlight')}</span>
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">{t('subtitle')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href={`/${locale}/waitlist`} className="btn-primary text-center">
                {t('primaryCta')}
              </Link>
              <Link href={`/${locale}/data`} className="btn-secondary text-center">
                {t('secondaryCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            <div className="text-center md:text-left">
              <div className="mb-3 text-5xl font-bold text-accent md:text-6xl">{stats.neighborhoods}</div>
              <div className="text-sm font-medium text-gray-600 md:text-base">{t('stats.neighborhoods')}</div>
            </div>
            <div className="text-center md:text-left">
              <div className="mb-3 text-5xl font-bold text-accent md:text-6xl">{stats.partners}</div>
              <div className="text-sm font-medium text-gray-600 md:text-base">{t('stats.partners')}</div>
            </div>
            <div className="text-center md:text-left">
              <div className="mb-3 text-5xl font-bold text-accent md:text-6xl">{stats.guides}</div>
              <div className="text-sm font-medium text-gray-600 md:text-base">{t('stats.guides')}</div>
            </div>
            <div className="text-center md:text-left">
              <div className="mb-3 text-5xl font-bold text-accent md:text-6xl">100%</div>
              <div className="text-sm font-medium text-gray-600 md:text-base">{t('stats.freeAccess')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title mb-16 text-center">{t('pillarsTitle')}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="card group border-2 border-gray-200 p-8 transition-all duration-300 hover:border-accent hover:shadow-lg"
            >
              <div className="mb-4 text-4xl transition-transform group-hover:scale-110">{pillar.icon}</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-950 transition-colors group-hover:text-accent">{pillar.title}</h3>
              <p className="mb-6 leading-relaxed text-gray-600">{pillar.description}</p>
              <div className="flex items-center gap-2 font-semibold text-accent">
                {t('pillars.explore')} <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title mb-12">{t('realityTitle')}</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="card bg-white p-8">
              <h3 className="mb-8 text-2xl font-bold text-gray-950">{t('avgRentTitle')}</h3>
              <div className="space-y-4">
                {previewData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-lg font-semibold text-accent">{item.rent}/sq ft</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white p-8">
              <h3 className="mb-8 text-2xl font-bold text-gray-950">{t('difficultyTitle')}</h3>
              <div className="space-y-4">
                {openingDifficulty.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${item.color}`}>{item.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section mx-auto max-w-2xl text-center">
        <h2 className="section-title mb-6">{t('ctaTitle')}</h2>
        <p className="mb-10 text-lg leading-relaxed text-gray-600">{t('ctaBody')}</p>
        <Link href={`/${locale}/waitlist`} className="btn-primary">
          {t('ctaButton')}
        </Link>
      </section>

      <Footer />
    </main>
  )
}