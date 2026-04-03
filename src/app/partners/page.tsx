'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'

interface Partner {
  id: string
  name: string
  firm: string
  category: string
  specialty: string
  languages: string[]
  email: string
  website: string | null
  verified: boolean
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('verified', true)
          .order('name')

        if (error) throw error

        setPartners(data || [])
      } catch (err) {
        console.error('Error fetching partners:', err)
        // Fallback to sample data for development
        setPartners([
          {
            id: '1',
            name: 'Sarah Chen',
            firm: 'Chen Real Estate Partners',
            category: 'Real Estate',
            specialty: 'Restaurant site selection & lease negotiation',
            languages: ['English', 'Mandarin', 'Cantonese'],
            email: 'sarah@chenrealestate.com',
            website: 'chenrealestate.com',
            verified: true,
          },
          {
            id: '2',
            name: 'David Liu',
            firm: 'Liu Restaurant Group',
            category: 'Real Estate',
            specialty: 'F&B real estate, build-out consulting',
            languages: ['English', 'Mandarin'],
            email: 'david@liurg.com',
            website: 'liurg.com',
            verified: true,
          },
          {
            id: '3',
            name: 'Angela Wong',
            firm: 'Wong & Associates Immigration Law',
            category: 'Legal',
            specialty: 'E-2 visa, business immigration',
            languages: ['English', 'Mandarin', 'Cantonese', 'Vietnamese'],
            email: 'angela@wonglaw.com',
            website: 'wonglaw.com',
            verified: true,
          },
          {
            id: '4',
            name: 'Marcus Johnson',
            firm: 'Johnson Immigration Counsel',
            category: 'Legal',
            specialty: 'Visa & corporate law for restaurants',
            languages: ['English', 'Spanish'],
            email: 'marcus@johnsonlaw.com',
            website: 'johnsonlaw.com',
            verified: true,
          },
          {
            id: '5',
            name: 'Tommy Lin',
            firm: 'Jade Supply Company',
            category: 'Distribution',
            specialty: 'Specialty Asian ingredients, import logistics',
            languages: ['English', 'Mandarin', 'Cantonese'],
            email: 'tommy@jadesupply.com',
            website: 'jadesupply.com',
            verified: true,
          },
          {
            id: '6',
            name: 'Vincent Park',
            firm: 'Park Brothers Supplies',
            category: 'Distribution',
            specialty: 'Korean ingredients, restaurant equipment',
            languages: ['English', 'Korean'],
            email: 'vincent@parkbrothers.com',
            website: 'parkbrothers.com',
            verified: true,
          },
          {
            id: '7',
            name: 'Lisa Chen',
            firm: 'Chen PR & Brand Strategy',
            category: 'Marketing',
            specialty: 'Brand launch, food media relations',
            languages: ['English', 'Mandarin'],
            email: 'lisa@chenpr.com',
            website: 'chenpr.com',
            verified: true,
          },
          {
            id: '8',
            name: 'Michael Kumar',
            firm: 'Kumar Accounting & Tax',
            category: 'Finance',
            specialty: 'Restaurant accounting, tax optimization',
            languages: ['English', 'Hindi', 'Tamil'],
            email: 'michael@kumaraccounting.com',
            website: 'kumaraccounting.com',
            verified: true,
          },
        ])
        setError(null) // Clear error since we have fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const categories = [...new Set(partners.map(p => p.category))]
  const languages = [...new Set(partners.flatMap(p => p.languages))]

  const filteredPartners = partners.filter((partner) => {
    const categoryMatch = !selectedCategory || partner.category === selectedCategory
    const languageMatch = !selectedLanguage || partner.languages.includes(selectedLanguage)
    return categoryMatch && languageMatch
  })

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pt-32 md:pt-40 pb-20">
        <h1 className="mb-6">Partner Network for<br /><span className="text-accent">Your Success</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Vetted specialists across legal, real estate, sourcing, and marketing. All pre-screened for F&B expertise and cultural alignment.
        </p>
      </section>

      {/* Filters */}
      <section className="border-y-2 border-gray-200 py-8">
        <div className="container space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Languages Spoken</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLanguage(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedLanguage === null
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                }`}
              >
                All Languages
              </button>
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => setSelectedLanguage(language)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLanguage === language
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="container section">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Loading partners...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-6 border-2 border-gray-200 hover:border-accent hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.firm}</p>
                </div>
                {partner.verified && (
                  <span className="text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Category</p>
                  <span className="inline-block text-xs font-semibold text-white bg-accent px-3 py-1 rounded-full">
                    {partner.category}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Specialty</p>
                  <p className="text-sm text-gray-700">{partner.specialty}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.languages.map((lang) => (
                      <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${partner.email}`}
                      className="flex-1 btn-primary text-center text-sm"
                    >
                      Email
                    </a>
                    <a
                      href={`https://${partner.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-secondary text-center text-sm"
                    >
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          </>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gray-50 section">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="section-title">Missing a Specialist Category?</h2>
          <p className="text-gray-600 mb-8">
            Let us know which type of partner you need, and we&apos;ll connect you with vetted professionals.
          </p>
          <Link href="/waitlist" className="btn-primary">
            Submit Partner Request
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
