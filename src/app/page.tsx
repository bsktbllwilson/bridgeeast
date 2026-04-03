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
      <section className="container section pt-32 md:pt-40 pb-20">
        <div className="max-w-3xl">
          <h1 className="mb-6 leading-tight">
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
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 border-y-2 border-gray-200 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">{stats.neighborhoods}</div>
              <div className="text-sm text-gray-600">Neighborhoods Mapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">{stats.partners}</div>
              <div className="text-sm text-gray-600">Vetted Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">{stats.guides}</div>
              <div className="text-sm text-gray-600">Expert Guides</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-gray-600">Free to Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="container section">
        <h2 className="section-title text-center mb-16">Three Pillars of Success</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Market Data',
              description: 'Neighborhood-level rent benchmarks, foot traffic, and competitive density insights.',
              href: '/data',
            },
            {
              title: 'Curated Guides',
              description: 'Phase-based playbooks: visas, permits, leasing, hiring, sourcing, and localization.',
              href: '/guides',
            },
            {
              title: 'Partner Directory',
              description: 'Pre-vetted specialists: brokers, attorneys, distributors, PR, accountants.',
              href: '/partners',
            },
          ].map((pillar, idx) => (
            <Link
              key={idx}
              href={pillar.href}
              className="block p-8 border-2 border-gray-200 hover:border-accent transition-colors group"
            >
              <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-accent transition-colors">
                {pillar.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              <div className="mt-6 text-accent font-medium">Explore →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Data Preview */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-12">Market Reality Check</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border-2 border-gray-200">
              <h3 className="text-xl font-serif font-bold mb-6">Average Rent by Neighborhood</h3>
              <div className="space-y-4">
                {previewData.map((item, idx) => (
                  <div key={idx} className="flex justify-between pb-3 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-semibold text-accent">{item.rent}/sq ft</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-gray-200">
              <h3 className="text-xl font-serif font-bold mb-6">Opening Difficulty Rating</h3>
              <div className="space-y-4">
                {[
                  { name: 'Soho', difficulty: 'Very High', color: 'text-red-600' },
                  { name: 'East Village', difficulty: 'High', color: 'text-orange-600' },
                  { name: 'Sunset Park', difficulty: 'Medium', color: 'text-yellow-600' },
                  { name: 'Flushing', difficulty: 'Medium', color: 'text-yellow-600' },
                  { name: 'Midtown Manhattan', difficulty: 'Very High', color: 'text-red-600' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between pb-3 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700">{item.name}</span>
                    <span className={`font-semibold ${item.color}`}>{item.difficulty}</span>
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
        <p className="text-lg text-gray-600 mb-8">
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