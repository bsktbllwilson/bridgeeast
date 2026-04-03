'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [stats, setStats] = useState({
    neighborhoods: 0,
    partners: 0,
    guides: 0,
    waitlist: 0
  })
  const [previewData, setPreviewData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // Fetch stats
      try {
        const [neighborhoodsRes, partnersRes, guidesRes, waitlistRes] = await Promise.all([
          supabase.from('neighborhoods').select('id', { count: 'exact', head: true }),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('guides').select('id', { count: 'exact', head: true }),
          supabase.from('waitlist').select('id', { count: 'exact', head: true })
        ])

        setStats({
          neighborhoods: neighborhoodsRes.count || 5,
          partners: partnersRes.count || 8,
          guides: guidesRes.count || 6,
          waitlist: waitlistRes.count || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({
          neighborhoods: 5,
          partners: 8,
          guides: 6,
          waitlist: 0
        })
      }

      // Fetch preview data
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('name, avg_rent_sqft')
          .order('name')
          .limit(5)

        if (error) throw error

        const formattedData = (data || []).map(item => ({
          name: item.name,
          rent: `$${Math.round(item.avg_rent_sqft * 0.8)}–$${Math.round(item.avg_rent_sqft * 1.2)}`
        }))

        setPreviewData(formattedData.length > 0 ? formattedData : [
          { name: 'Soho', rent: '$45–65' },
          { name: 'East Village', rent: '$35–50' },
          { name: 'Sunset Park', rent: '$20–30' },
          { name: 'Flushing', rent: '$22–35' },
          { name: 'Midtown Manhattan', rent: '$60–85' },
        ])
      } catch (error) {
        console.error('Error fetching preview data:', error)
        setPreviewData([
          { name: 'Soho', rent: '$45–65' },
          { name: 'East Village', rent: '$35–50' },
          { name: 'Sunset Park', rent: '$20–30' },
          { name: 'Flushing', rent: '$22–35' },
          { name: 'Midtown Manhattan', rent: '$60–85' },
        ])
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-12 md:pt-20 pb-16 md:pb-20 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block badge mb-6">
              <span className="text-accent">✨ Trusted by Asian F&B founders</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 text-gray-950">
              Your Market Intelligence for<br />
              <span className="text-accent">NYC Expansion</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              BridgeEast connects Asian F&B founders with curated market data, step-by-step guides, and vetted local partners—everything needed to navigate your first NYC location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/waitlist" className="btn-primary text-center">
                Join the Waitlist
              </Link>
              <Link href="/data" className="btn-secondary text-center">
                Explore Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200 py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-serif font-bold text-accent mb-3">{stats.neighborhoods}</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Neighborhoods Mapped</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-serif font-bold text-accent mb-3">{stats.partners}</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Vetted Partners</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-serif font-bold text-accent mb-3">{stats.guides}</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Expert Guides</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-serif font-bold text-accent mb-3">100%</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="container section">
        <h2 className="section-title text-center mb-16">Three Pillars of Success</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Market Data',
              description: 'Neighborhood-level rent benchmarks, foot traffic, and competitive density insights.',
              icon: '📊',
              href: '/data',
            },
            {
              title: 'Curated Guides',
              description: 'Phase-based playbooks: visas, permits, leasing, hiring, sourcing, and localization.',
              icon: '📖',
              href: '/guides',
            },
            {
              title: 'Partner Directory',
              description: 'Pre-vetted specialists: brokers, attorneys, distributors, PR, accountants.',
              icon: '🤝',
              href: '/partners',
            },
          ].map((pillar, idx) => (
            <Link
              key={idx}
              href={pillar.href}
              className="card p-8 border-2 border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{pillar.icon}</div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-950 group-hover:text-accent transition-colors">
                {pillar.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">{pillar.description}</p>
              <div className="text-accent font-semibold flex items-center gap-2">
                Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Data Preview */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-12">Market Reality Check</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-white p-8">
              <h3 className="text-2xl font-serif font-bold mb-8 text-gray-950">Average Rent by Neighborhood</h3>
              <div className="space-y-4">
                {previewData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="font-semibold text-accent text-lg">{item.rent}/sq ft</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white p-8">
              <h3 className="text-2xl font-serif font-bold mb-8 text-gray-950">Opening Difficulty Rating</h3>
              <div className="space-y-4">
                {[
                  { name: 'Soho', difficulty: 'Very High', color: 'bg-red-100 text-red-700' },
                  { name: 'East Village', difficulty: 'High', color: 'bg-orange-100 text-orange-700' },
                  { name: 'Sunset Park', difficulty: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Flushing', difficulty: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Midtown Manhattan', difficulty: 'Very High', color: 'bg-red-100 text-red-700' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.color}`}>{item.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container section text-center max-w-2xl mx-auto">
        <h2 className="section-title mb-6">Ready to Start Your NYC Journey?</h2>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Join hundreds of Asian F&B founders who trust BridgeEast for their expansion decisions.
        </p>
        <Link href="/waitlist" className="btn-primary">
          Get Early Access
        </Link>
      </section>

      <Footer />
    </main>
  )
}