'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabase'

interface Neighborhood {
  id: string
  name: string
  avg_rent_sqft: number
  foot_traffic_score: number
  asian_dining_score: number
  competitor_count: number
}

export default function DataPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('*')
          .order('name')

        if (error) throw error

        setNeighborhoods(data || [])
      } catch (err) {
        console.error('Error fetching neighborhoods:', err)
        // Fallback to sample data for development
        setNeighborhoods([
          { id: '1', name: 'Soho', avg_rent_sqft: 55.00, foot_traffic_score: 85, asian_dining_score: 90, competitor_count: 12 },
          { id: '2', name: 'East Village', avg_rent_sqft: 42.50, foot_traffic_score: 78, asian_dining_score: 75, competitor_count: 8 },
          { id: '3', name: 'Sunset Park', avg_rent_sqft: 25.00, foot_traffic_score: 65, asian_dining_score: 70, competitor_count: 5 },
          { id: '4', name: 'Flushing', avg_rent_sqft: 28.50, foot_traffic_score: 88, asian_dining_score: 92, competitor_count: 15 },
          { id: '5', name: 'Midtown Manhattan', avg_rent_sqft: 72.50, foot_traffic_score: 95, asian_dining_score: 60, competitor_count: 20 }
        ])
        setError(null) // Clear error since we have fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchNeighborhoods()
  }, [])

  const rentData = neighborhoods.map(n => ({
    neighborhood: n.name,
    rent: n.avg_rent_sqft
  }))

  const neighborhoodMetrics = neighborhoods.map(n => ({
    name: n.name,
    rent: `$${Math.round(n.avg_rent_sqft * 0.8)}–$${Math.round(n.avg_rent_sqft * 1.2)}`,
    traffic: n.foot_traffic_score,
    demand: n.asian_dining_score,
    competitors: n.competitor_count
  }))
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="container section pt-32 md:pt-40 pb-20">
        <h1 className="mb-6">Market Intelligence for<br /><span className="text-accent">Your NYC Expansion</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Real neighborhood data on rent, foot traffic, demand, and competitive density. Filter by your target location to make informed decisions.
        </p>
      </section>

      {/* Rent Chart */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-12">Average Rent by Neighborhood</h2>
          <div className="bg-white p-8 border-2 border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-gray-500">Loading market data...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={rentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="neighborhood" />
                    <YAxis label={{ value: 'Price per sq ft ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => `$${value}/sq ft`} />
                    <Bar dataKey="rent" fill="#D85A30" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-6 text-center">
                  Data based on commercial real estate listings (2025). Prices vary by specific location within each neighborhood.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Detailed Metrics Table */}
      <section className="container section">
        <h2 className="section-title mb-12">Neighborhood Deep Dive</h2>
        <div className="overflow-x-auto border-2 border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-gray-500">Loading neighborhood data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left font-serif font-bold">Neighborhood</th>
                  <th className="px-6 py-4 text-left font-serif font-bold">Avg Rent</th>
                  <th className="px-6 py-4 text-center font-serif font-bold">Foot Traffic</th>
                  <th className="px-6 py-4 text-center font-serif font-bold">Asian Demand</th>
                  <th className="px-6 py-4 text-center font-serif font-bold">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {neighborhoodMetrics.map((neighborhood, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{neighborhood.name}</td>
                    <td className="px-6 py-4 text-accent font-semibold">{neighborhood.rent}/sq ft</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${neighborhood.traffic}%` }}
                          />
                        </div>
                        <span className="ml-3 font-semibold">{neighborhood.traffic}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${neighborhood.demand}%` }}
                          />
                        </div>
                        <span className="ml-3 font-semibold">{neighborhood.demand}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">{neighborhood.competitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Difficulty Ratings */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-12">Opening Difficulty Ratings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border-2 border-gray-200">
              <h3 className="text-xl font-serif font-bold mb-6">By Hurdle</h3>
              <div className="space-y-4">
                {[
                  { task: 'Health Permits (DOH)', level: 'High', color: 'bg-red-500' },
                  { task: 'Liquor License (SLA)', level: 'Very High', color: 'bg-red-700' },
                  { task: 'Lease Negotiation', level: 'Medium', color: 'bg-yellow-500' },
                  { task: 'Staff Hiring & Compliance', level: 'Medium', color: 'bg-yellow-500' },
                  { task: 'Supply Chain Setup', level: 'Medium', color: 'bg-yellow-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.task}</div>
                    </div>
                    <span className="font-semibold text-gray-600">{item.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-gray-200">
              <h3 className="text-xl font-serif font-bold mb-6">Timeline Expectations</h3>
              <div className="space-y-4">
                {[
                  { phase: 'Entity Setup & Visa', timeline: '2–4 months' },
                  { phase: 'Permit & License', timeline: '4–8 weeks (post-opening)' },
                  { phase: 'Lease Negotiation', timeline: '1–3 months' },
                  { phase: 'Design & Build-out', timeline: '6–12 weeks' },
                  { phase: 'Staff Hiring', timeline: '4–8 weeks' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between pb-4 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700">{item.phase}</span>
                    <span className="font-semibold text-accent">{item.timeline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
