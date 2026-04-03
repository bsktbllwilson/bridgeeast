'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'

interface Guide {
  id: string
  title: string
  slug: string
  category: string
  phase: string
  content: string
  published: boolean
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .eq('published', true)
          .order('title')

        if (error) throw error

        setGuides(data || [])
      } catch (err) {
        console.error('Error fetching guides:', err)
        // Fallback to sample data for development
        setGuides([
          {
            id: '1',
            title: 'Entity Setup & Visa Strategy',
            slug: 'entity-visa-setup',
            category: 'Visa & Legal',
            phase: 'Pre-Launch',
            content: '<h2>Choose Your Business Entity</h2><p>The first critical decision is selecting the right business structure...</p>',
            published: true,
          },
          {
            id: '2',
            title: 'NYC Health Department Permits',
            slug: 'health-permits',
            category: 'Permits & Licensing',
            phase: 'Pre-Launch',
            content: '<h2>Food Service Establishment Permit</h2><p>The NYC Department of Health requires all food service establishments...</p>',
            published: true,
          },
          {
            id: '3',
            title: 'Lease Negotiation Playbook for F&B',
            slug: 'lease-negotiation',
            category: 'Real Estate',
            phase: 'Pre-Launch',
            content: '<h2>Understanding Commercial Leases</h2><p>Commercial leases are complex and long-term commitments...</p>',
            published: true,
          },
          {
            id: '4',
            title: 'Hiring & NYC Labor Law Compliance',
            slug: 'hiring-labor',
            category: 'Operations',
            phase: 'Launch',
            content: '<h2>NYC Labor Laws Overview</h2><p>New York City has some of the most employee-friendly labor laws...</p>',
            published: true,
          },
          {
            id: '5',
            title: 'Specialty Ingredient Sourcing in NYC',
            slug: 'ingredient-sourcing',
            category: 'Operations',
            phase: 'Launch',
            content: '<h2>NYC Food Distribution Landscape</h2><p>New York City has a robust network of food distributors...</p>',
            published: true,
          },
          {
            id: '6',
            title: 'Brand Name Localization Strategy',
            slug: 'localization',
            category: 'Marketing',
            phase: 'Pre-Launch',
            content: '<h2>Understanding Cultural Context</h2><p>Successful brand localization requires understanding both your home market...</p>',
            published: true,
          },
        ])
        setError(null) // Clear error since we have fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchGuides()
  }, [])

  const categories = [...new Set(guides.map(g => g.category))]

  const filteredGuides = selectedCategory
    ? guides.filter((g) => g.category === selectedCategory)
    : guides

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pt-32 md:pt-40 pb-20">
        <h1 className="mb-6">Curated Guides for<br /><span className="text-accent">Your NYC Journey</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Step-by-step playbooks organized by phase: from visa strategy to launch day operations.
        </p>
      </section>

      {/* Category Filter */}
      <section className="border-y-2 border-gray-200 py-8">
        <div className="container">
          <h3 className="font-semibold text-gray-700 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
              }`}
            >
              All Guides
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="container section">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Loading guides...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="group block p-8 border-2 border-gray-200 hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-accent text-white rounded-full">
                    {guide.category}
                  </span>
                  <span className="text-xs text-gray-500">{guide.phase}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-accent transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {guide.content.length > 150
                    ? `${guide.content.substring(0, 150)}...`
                    : guide.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{Math.ceil(guide.content.length / 1000)} min read</span>
                  <span className="text-accent font-semibold group-hover:translate-x-1 transition-transform">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
