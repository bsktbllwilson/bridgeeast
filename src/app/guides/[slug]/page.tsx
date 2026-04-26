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
  created_at: string
  updated_at: string
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function GuidePage({ params }: PageProps) {
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .eq('slug', params.slug)
          .eq('published', true)
          .single()

        if (error) throw error

        if (!data) {
          setError('Guide not found')
          return
        }

        setGuide(data)
      } catch (err) {
        console.error('Error fetching guide:', err)
        // Fallback to sample data for development
        const fallbackGuides = {
          'entity-visa-setup': {
            id: '1',
            title: 'Entity Setup & Visa Strategy',
            slug: 'entity-visa-setup',
            category: 'Visa & Legal',
            phase: 'Pre-Launch',
            content: '<h2>Choose Your Business Entity</h2><p>The first critical decision is selecting the right business structure. For F&B market entry, founders typically choose between an LLC or C-Corporation.</p><h3>Limited Liability Company (LLC)</h3><p>Best for: Most first-time F&B operators. LLCs provide liability protection, flexible taxation, and simpler administration.</p>',
            published: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
          },
          'health-permits': {
            id: '2',
            title: 'Health Department Permits',
            slug: 'health-permits',
            category: 'Permits & Licensing',
            phase: 'Pre-Launch',
            content: '<h2>Food Service Establishment Permit</h2><p>The local Department of Health and Mental Hygiene (DOHMH) requires all food service establishments to obtain a permit before opening.</p><h3>Application Process</h3><ol><li>Complete online application through the DOHMH portal</li><li>Submit floor plan and equipment specifications</li><li>Pass pre-operational inspection</li></ol>',
            published: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
          },
          'lease-negotiation': {
            id: '3',
            title: 'Lease Negotiation Playbook for F&B',
            slug: 'lease-negotiation',
            category: 'Real Estate',
            phase: 'Pre-Launch',
            content: '<h2>Understanding Commercial Leases</h2><p>Commercial leases are complex and long-term commitments. Understanding key terms is crucial for restaurant success.</p><h3>Key Lease Terms</h3><ul><li><strong>Base Rent:</strong> Fixed monthly payment</li><li><strong>Additional Rent:</strong> Percentage of gross sales</li></ul>',
            published: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
          },
          'hiring-labor': {
            id: '4',
            title: 'Hiring & Labor Law Compliance',
            slug: 'hiring-labor',
            category: 'Operations',
            phase: 'Launch',
            content: '<h2>Labor Laws Overview</h2><p>Many U.S. markets have employee-friendly labor laws. Understanding and complying with these regulations is essential.</p><h3>Minimum Wage</h3><p>As of 2026, local minimum wage requirements vary by market and employer size.</p>',
            published: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
          },
          'ingredient-sourcing': {
            id: '5',
            title: 'Specialty Ingredient Sourcing',
            slug: 'ingredient-sourcing',
            category: 'Operations',
            phase: 'Launch',
            content: '<h2>Food Distribution Landscape</h2><p>Major U.S. markets have robust networks of food distributors and specialty suppliers serving the restaurant industry.</p><h3>Major Distributors</h3><ul><li><strong>Sysco:</strong> Full-service distribution</li><li><strong>US Foods:</strong> Restaurant-focused</li></ul>',
            published: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
          },
          'localization': {
            id: '6',
            title: 'Brand Name Localization Strategy',
            slug: 'localization',
            category: 'Marketing',
            phase: 'Pre-Launch',
            content: '<h2>Understanding Cultural Context</h2><p>Successful brand localization requires understanding both your home market and the local market context.</p><h3>Brand Name Considerations</h3><ul><li><strong>Pronunciation:</strong> Ensure name is easy for English speakers</li><li><strong>Meaning:</strong> Consider cultural connotations</li></ul>',
            published: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
          },
        }

        const fallbackGuide = fallbackGuides[params.slug as keyof typeof fallbackGuides]
        if (fallbackGuide) {
          setGuide(fallbackGuide)
          setError(null)
        } else {
          setError('Guide not found')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGuide()
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container section pt-32 md:pt-40">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Loading guide...</div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !guide) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container section pt-32 md:pt-40">
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500">{error || 'Guide not found'}</div>
            <Link href="/guides" className="btn-primary mt-4">
              Back to Guides
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="container section pt-32 md:pt-40 pb-20">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <Link href="/guides" className="text-accent hover:underline">
            Guides
          </Link>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-gray-600">{guide.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold px-3 py-1 bg-accent text-white rounded-full">
              {guide.category}
            </span>
            <span className="text-sm text-gray-500">{guide.phase} Phase</span>
          </div>
          <h1 className="heading-hero mb-6">
            {guide.title}
          </h1>
          <div className="flex items-center gap-6 text-meta">
            <span>{Math.ceil(guide.content.length / 1000)} min read</span>
            <span>Last updated {new Date(guide.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}</span>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
      </article>

      <Footer />
    </main>
  )
}
