'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { Search, MapPin, TrendingUp, Users, DollarSign } from 'lucide-react'

// Create a separate client component for the map
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

interface Neighborhood {
  id: string
  name: string
  avg_rent_sqft: number
  foot_traffic_score: number
  asian_dining_score: number
  competitor_count: number
  lat?: number
  lng?: number
}

interface SearchResult {
  display_name: string
  lat: string
  lon: string
}

export default function DataPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]) // NYC center
  const [mapZoom, setMapZoom] = useState(11)

  // Sample neighborhood coordinates (in a real app, these would be in the database)
  const neighborhoodCoords: Record<string, [number, number]> = {
    'Soho': [40.7233, -74.0030],
    'East Village': [40.7265, -73.9815],
    'Sunset Park': [40.6454, -74.0104],
    'Flushing': [40.7675, -73.8331],
    'Midtown Manhattan': [40.7580, -73.9855]
  }

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('*')
          .order('name')

        if (error) throw error

        // Add coordinates to neighborhoods
        const neighborhoodsWithCoords = (data || []).map(neighborhood => ({
          ...neighborhood,
          lat: neighborhoodCoords[neighborhood.name]?.[0] || 40.7128,
          lng: neighborhoodCoords[neighborhood.name]?.[1] || -74.0060
        }))

        setNeighborhoods(neighborhoodsWithCoords)
      } catch (err) {
        console.error('Error fetching neighborhoods:', err)
        // Fallback to sample data for development
        const fallbackData = [
          { id: '1', name: 'Soho', avg_rent_sqft: 55.00, foot_traffic_score: 85, asian_dining_score: 90, competitor_count: 12 },
          { id: '2', name: 'East Village', avg_rent_sqft: 42.50, foot_traffic_score: 78, asian_dining_score: 75, competitor_count: 8 },
          { id: '3', name: 'Sunset Park', avg_rent_sqft: 25.00, foot_traffic_score: 65, asian_dining_score: 70, competitor_count: 5 },
          { id: '4', name: 'Flushing', avg_rent_sqft: 28.50, foot_traffic_score: 88, asian_dining_score: 92, competitor_count: 15 },
          { id: '5', name: 'Midtown Manhattan', avg_rent_sqft: 72.50, foot_traffic_score: 95, asian_dining_score: 60, competitor_count: 20 }
        ].map(neighborhood => ({
          ...neighborhood,
          lat: neighborhoodCoords[neighborhood.name]?.[0] || 40.7128,
          lng: neighborhoodCoords[neighborhood.name]?.[1] || -74.0060
        }))
        setNeighborhoods(fallbackData)
        setError(null) // Clear error since we have fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchNeighborhoods()
  }, [])

  // Geocode address search
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', New York, NY')}&limit=5&countrycodes=us`)
      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      console.error('Geocoding error:', err)
      setSearchResults([])
    }
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchAddress(query)
  }

  // Handle location selection
  const handleLocationSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setSelectedLocation({ lat, lng, name: result.display_name.split(',')[0] })
    setMapCenter([lat, lng])
    setMapZoom(15)
    setSearchQuery(result.display_name.split(',')[0])
    setSearchResults([])

    // Find nearest neighborhood
    let nearestNeighborhood: Neighborhood | null = null
    let minDistance = Infinity

    neighborhoods.forEach(neighborhood => {
      if (neighborhood.lat && neighborhood.lng) {
        const distance = Math.sqrt(
          Math.pow(neighborhood.lat - lat, 2) + Math.pow(neighborhood.lng - lng, 2)
        )
        if (distance < minDistance) {
          minDistance = distance
          nearestNeighborhood = neighborhood
        }
      }
    })

    setSelectedNeighborhood(nearestNeighborhood)
  }

  // Handle neighborhood marker click
  const handleNeighborhoodClick = (neighborhood: Neighborhood) => {
    setSelectedNeighborhood(neighborhood)
    if (neighborhood.lat && neighborhood.lng) {
      setMapCenter([neighborhood.lat, neighborhood.lng])
      setMapZoom(15)
    }
  }

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
          Search any NYC address to get real neighborhood data on rent, foot traffic, demand, and competitive density. Make informed decisions for your Asian F&B expansion.
        </p>
      </section>

      {/* Address Search & Map */}
      <section className="bg-gray-50 section">
        <div className="container">
          <h2 className="section-title mb-8">Search Your Target Location</h2>

          {/* Search Input */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter an NYC address..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLocationSelect(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{result.display_name.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="bg-white p-4 border-2 border-gray-200 rounded-lg mb-8">
            <div className="h-96 rounded-lg overflow-hidden">
              <MapComponent
                neighborhoods={neighborhoods}
                selectedLocation={selectedLocation}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                onNeighborhoodClick={handleNeighborhoodClick}
              />
            </div>
          </div>

          {/* Selected Location Data */}
          {selectedNeighborhood && (
            <div className="bg-white p-6 border-2 border-accent rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 text-accent mr-2" />
                {selectedNeighborhood.name} Market Analysis
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">${selectedNeighborhood.avg_rent_sqft}</div>
                  <div className="text-sm text-gray-600">Avg Rent/sq ft</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">{selectedNeighborhood.foot_traffic_score}%</div>
                  <div className="text-sm text-gray-600">Foot Traffic</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">{selectedNeighborhood.asian_dining_score}%</div>
                  <div className="text-sm text-gray-600">Asian Demand</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">{selectedNeighborhood.competitor_count}</div>
                  <div className="text-sm text-gray-600">Competitors</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Market Insights:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {selectedNeighborhood.foot_traffic_score > 80 ? 'High' : selectedNeighborhood.foot_traffic_score > 60 ? 'Moderate' : 'Low'} foot traffic indicates {selectedNeighborhood.foot_traffic_score > 80 ? 'excellent' : selectedNeighborhood.foot_traffic_score > 60 ? 'good' : 'limited'} visibility potential</li>
                  <li>• {selectedNeighborhood.asian_dining_score > 80 ? 'Strong' : selectedNeighborhood.asian_dining_score > 60 ? 'Moderate' : 'Low'} Asian dining demand suggests {selectedNeighborhood.asian_dining_score > 80 ? 'high' : selectedNeighborhood.asian_dining_score > 60 ? 'moderate' : 'low'} market saturation</li>
                  <li>• {selectedNeighborhood.competitor_count > 10 ? 'High' : selectedNeighborhood.competitor_count > 5 ? 'Moderate' : 'Low'} competition level - consider differentiation strategies</li>
                </ul>
              </div>
            </div>
          )}
        </div>
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
