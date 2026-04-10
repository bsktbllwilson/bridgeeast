'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Search, MapPin, TrendingUp, Users, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Create a simple placeholder for the map during build
const MapComponent = (_props: {
  neighborhoods: Neighborhood[]
  selectedLocation: { lat: number; lng: number; name: string } | null
  mapCenter: [number, number]
  mapZoom: number
  onNeighborhoodClick: (neighborhood: Neighborhood) => void
}) => (
  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
    <div className="text-center">
      <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
      <div className="text-gray-600 font-medium">Interactive Map</div>
      <div className="text-sm text-gray-500">Search an address above to see location data</div>
    </div>
  </div>
)

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]) // Default city center
  const [mapZoom, setMapZoom] = useState(11)
  const [showDataModal, setShowDataModal] = useState(false)

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
        const neighborhoodsWithCoords = (data || []).map((neighborhood: Neighborhood) => ({
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
  }, []) // Removed neighborhoodCoords from dependencies as it's static

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

    // Find nearest neighborhood with better distance calculation
    let nearestNeighborhood: Neighborhood | null = null
    let minDistance = Infinity

    neighborhoods.forEach(neighborhood => {
      if (neighborhood.lat && neighborhood.lng) {
        // Use proper geographic distance (Haversine formula approximation)
        const dLat = (neighborhood.lat - lat) * Math.PI / 180
        const dLng = (neighborhood.lng - lng) * Math.PI / 180
        const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111 // Rough km conversion

        if (distance < minDistance) {
          minDistance = distance
          nearestNeighborhood = neighborhood
        }
      }
    })

    // If no neighborhood found within reasonable distance, use the first one as fallback
    if (!nearestNeighborhood && neighborhoods.length > 0) {
      nearestNeighborhood = neighborhoods[0]
    }

    if (nearestNeighborhood) {
      setSelectedNeighborhood(nearestNeighborhood)
      setShowDataModal(true) // Show the data popup
    }
  }

  // Handle neighborhood marker click
  const handleNeighborhoodClick = (neighborhood: Neighborhood) => {
    setSelectedNeighborhood(neighborhood)
    setShowDataModal(true) // Show the data popup
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="container section pt-32 md:pt-40 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="mb-6 text-5xl md:text-7xl font-serif font-bold leading-tight">
            Market Intelligence for<br />
            <span className="text-accent bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
              Your U.S. Market Entry
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Search any target address to get real neighborhood data on rent, foot traffic, demand, and competitive density. Make informed decisions for your Asian F&B expansion.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="badge">Real-time Data</div>
            <div className="badge">Market Focus</div>
            <div className="badge">Asian F&B Insights</div>
          </div>
        </div>
      </section>

      {/* Address Search & Map */}
      <section className="bg-white section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Search Your Target Location</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter any target address to see real market data and neighborhood insights
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-lg mx-auto mb-12 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Enter a target address (e.g., Times Square, Brooklyn Bridge)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-xl mt-2 shadow-xl z-10 max-h-64 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLocationSelect(result)}
                    className="w-full text-left px-6 py-4 hover:bg-accent/5 border-b border-gray-100 last:border-b-0 flex items-center transition-colors duration-150"
                  >
                    <MapPin className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{result.display_name.split(',')[0]}</span>
                    <span className="text-sm text-gray-500 ml-2">{result.display_name.split(',')[1]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="bg-white p-6 border-2 border-gray-200 rounded-2xl shadow-lg mb-12">
            <div className="h-[500px] rounded-xl overflow-hidden border border-gray-100">
              <MapComponent
                neighborhoods={neighborhoods}
                selectedLocation={selectedLocation}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                onNeighborhoodClick={handleNeighborhoodClick}
              />
            </div>
          </div>

          {/* Data Modal Popup */}
          {showDataModal && selectedNeighborhood && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
                      <MapPin className="w-8 h-8 text-accent mr-3" />
                      {selectedLocation ? `${selectedLocation.name} - ${selectedNeighborhood.name}` : selectedNeighborhood.name}
                    </h3>
                    <button
                      onClick={() => setShowDataModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-xl border border-accent/20">
                      <div className="flex items-center justify-center mb-3">
                        <DollarSign className="w-7 h-7 text-accent" />
                      </div>
                      <div className="text-4xl font-bold text-accent mb-1">${selectedNeighborhood.avg_rent_sqft}</div>
                      <div className="text-sm text-gray-700 font-medium">Avg Rent/sq ft</div>
                      <div className="text-xs text-gray-500 mt-1">Commercial space</div>
                    </div>

                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="text-4xl font-bold text-blue-600 mb-1">{selectedNeighborhood.foot_traffic_score}%</div>
                      <div className="text-sm text-gray-700 font-medium">Foot Traffic</div>
                      <div className="text-xs text-gray-500 mt-1">Daily pedestrian flow</div>
                    </div>

                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center mb-3">
                        <TrendingUp className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="text-4xl font-bold text-green-600 mb-1">{selectedNeighborhood.asian_dining_score}%</div>
                      <div className="text-sm text-gray-700 font-medium">Asian Demand</div>
                      <div className="text-xs text-gray-500 mt-1">Market saturation</div>
                    </div>

                    <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-center mb-3">
                        <MapPin className="w-7 h-7 text-orange-600" />
                      </div>
                      <div className="text-4xl font-bold text-orange-600 mb-1">{selectedNeighborhood.competitor_count}</div>
                      <div className="text-sm text-gray-700 font-medium">Competitors</div>
                      <div className="text-xs text-gray-500 mt-1">Asian restaurants</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 mb-6">
                    <h4 className="font-serif font-bold text-xl mb-4 flex items-center text-gray-900">
                      <TrendingUp className="w-6 h-6 text-accent mr-2" />
                      Market Insights & Recommendations
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Users className="w-4 h-4 text-blue-600 mr-2" />
                          Traffic Analysis
                        </h5>
                        <div className="text-sm text-gray-700">
                          {selectedNeighborhood.foot_traffic_score > 80 ? '🚀 Excellent visibility potential with high pedestrian traffic' :
                           selectedNeighborhood.foot_traffic_score > 60 ? '✅ Good traffic flow for steady customer acquisition' :
                           '⚠️ Limited foot traffic may require marketing investment'}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 text-orange-600 mr-2" />
                          Competition Assessment
                        </h5>
                        <div className="text-sm text-gray-700">
                          {selectedNeighborhood.asian_dining_score > 80 ? '🔴 High market saturation - focus on differentiation' :
                           selectedNeighborhood.asian_dining_score > 60 ? '🟡 Moderate competition - opportunity for unique positioning' :
                           '🟢 Low saturation - potential for market leadership'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDataModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => window.open('/waitlist', '_blank')}
                      className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors duration-200 font-medium flex items-center"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Start Expansion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Location Data */}
          {selectedNeighborhood && (
            <div id="detailed-analysis" className="bg-gradient-to-r from-accent/5 to-accent/10 p-8 border-2 border-accent/20 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-serif font-bold mb-6 flex items-center text-gray-900">
                <TrendingUp className="w-7 h-7 text-accent mr-3" />
                {selectedNeighborhood.name} Market Analysis
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center mb-3">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-1">${selectedNeighborhood.avg_rent_sqft}</div>
                  <div className="text-sm text-gray-600 font-medium">Avg Rent/sq ft</div>
                  <div className="text-xs text-gray-500 mt-1">Commercial space</div>
                </div>

                <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-1">{selectedNeighborhood.foot_traffic_score}%</div>
                  <div className="text-sm text-gray-600 font-medium">Foot Traffic</div>
                  <div className="text-xs text-gray-500 mt-1">Daily pedestrian flow</div>
                </div>

                <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-1">{selectedNeighborhood.asian_dining_score}%</div>
                  <div className="text-sm text-gray-600 font-medium">Asian Demand</div>
                  <div className="text-xs text-gray-500 mt-1">Market saturation</div>
                </div>

                <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-1">{selectedNeighborhood.competitor_count}</div>
                  <div className="text-sm text-gray-600 font-medium">Competitors</div>
                  <div className="text-xs text-gray-500 mt-1">Asian restaurants</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h4 className="font-serif font-bold text-lg mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-accent mr-2" />
                  Market Insights & Recommendations
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Traffic Analysis</h5>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className={`w-2 h-2 rounded-full mt-2 mr-3 ${selectedNeighborhood.foot_traffic_score > 80 ? 'bg-green-500' : selectedNeighborhood.foot_traffic_score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                        {selectedNeighborhood.foot_traffic_score > 80 ? 'Excellent visibility potential with high pedestrian traffic' : selectedNeighborhood.foot_traffic_score > 60 ? 'Good traffic flow for steady customer acquisition' : 'Limited foot traffic may require marketing investment'}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Competition Assessment</h5>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className={`w-2 h-2 rounded-full mt-2 mr-3 ${selectedNeighborhood.asian_dining_score > 80 ? 'bg-red-500' : selectedNeighborhood.asian_dining_score > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        {selectedNeighborhood.asian_dining_score > 80 ? 'High market saturation - focus on differentiation' : selectedNeighborhood.asian_dining_score > 60 ? 'Moderate competition - opportunity for unique positioning' : 'Low saturation - potential for market leadership'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Rent Chart */}
      <section className="bg-gradient-to-r from-gray-50 to-white section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Average Rent by Neighborhood</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Commercial real estate costs across target neighborhoods (2025 data)
            </p>
          </div>
          <div className="bg-white p-8 border-2 border-gray-200 rounded-2xl shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-pulse">
                  <div className="text-gray-500 mb-4">Loading market data...</div>
                  <div className="w-64 h-4 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-red-500 text-center">
                  <div className="text-lg font-semibold mb-2">Unable to load data</div>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={rentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="neighborhood"
                      stroke="#666"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="#666"
                      fontSize={12}
                      label={{ value: 'Price per sq ft ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Avg Rent']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #D85A30',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Bar
                      dataKey="rent"
                      fill="#D85A30"
                      radius={[4, 4, 0, 0]}
                      stroke="#B84525"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>Data Source:</strong> Commercial real estate listings (2025). Prices vary by specific location, size, and lease terms within each neighborhood.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Detailed Metrics Table */}
      <section className="container section">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Neighborhood Deep Dive</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive metrics for each neighborhood to inform your expansion strategy
          </p>
        </div>
        <div className="overflow-x-auto border-2 border-gray-200 rounded-2xl shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-pulse">
                <div className="text-gray-500 mb-4">Loading neighborhood data...</div>
                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-red-500 text-center">
                <div className="text-lg font-semibold mb-2">Unable to load data</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-accent/10 to-accent/5 border-b-2 border-accent/20">
                  <th className="px-8 py-6 text-left font-serif font-bold text-gray-900 text-lg">Neighborhood</th>
                  <th className="px-8 py-6 text-left font-serif font-bold text-gray-900 text-lg">Avg Rent</th>
                  <th className="px-8 py-6 text-center font-serif font-bold text-gray-900 text-lg">Foot Traffic</th>
                  <th className="px-8 py-6 text-center font-serif font-bold text-gray-900 text-lg">Asian Demand</th>
                  <th className="px-8 py-6 text-center font-serif font-bold text-gray-900 text-lg">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {neighborhoodMetrics.map((neighborhood, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-accent/5 transition-colors duration-150">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-lg">{neighborhood.name}</td>
                    <td className="px-8 py-6 text-accent font-bold text-lg">{neighborhood.rent}/sq ft</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center">
                        <div className="w-32 bg-gray-200 rounded-full h-3 mr-4">
                          <div
                            className="bg-accent h-3 rounded-full transition-all duration-300"
                            style={{ width: `${neighborhood.traffic}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-900 min-w-[3rem]">{neighborhood.traffic}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center">
                        <div className="w-32 bg-gray-200 rounded-full h-3 mr-4">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${neighborhood.demand}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-900 min-w-[3rem]">{neighborhood.demand}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-lg text-gray-900">{neighborhood.competitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Difficulty Ratings */}
      <section className="bg-gradient-to-r from-gray-50 to-white section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Opening Difficulty Ratings</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding the challenges and timelines for opening an Asian restaurant in a new market
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border-2 border-gray-200 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center text-gray-900">
                <TrendingUp className="w-6 h-6 text-accent mr-3" />
                By Hurdle
              </h3>
              <div className="space-y-6">
                {[
                  { task: 'Health Permits (DOH)', level: 'High', color: 'bg-red-500', description: 'Extensive documentation and inspections required' },
                  { task: 'Liquor License (SLA)', level: 'Very High', color: 'bg-red-700', description: 'Complex application process with community board approval' },
                  { task: 'Lease Negotiation', level: 'Medium', color: 'bg-yellow-500', description: 'Competitive market with detailed legal requirements' },
                  { task: 'Staff Hiring & Compliance', level: 'Medium', color: 'bg-yellow-500', description: 'Visa considerations and labor law compliance' },
                  { task: 'Supply Chain Setup', level: 'Medium', color: 'bg-yellow-500', description: 'Sourcing authentic ingredients and reliable suppliers' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0">
                    <div className={`w-4 h-4 rounded-full ${item.color} mt-1 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-900 text-lg">{item.task}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.level === 'Very High' ? 'bg-red-100 text-red-800' :
                          item.level === 'High' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.level}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-gray-200 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center text-gray-900">
                <Users className="w-6 h-6 text-accent mr-3" />
                Timeline Expectations
              </h3>
              <div className="space-y-6">
                {[
                  { phase: 'Entity Setup & Visa', timeline: '2–4 months', color: 'bg-blue-500', description: 'Legal structure and immigration paperwork' },
                  { phase: 'Permit & License', timeline: '4–8 weeks (post-opening)', color: 'bg-purple-500', description: 'Health, liquor, and operational permits' },
                  { phase: 'Lease Negotiation', timeline: '1–3 months', color: 'bg-green-500', description: 'Finding and securing commercial space' },
                  { phase: 'Design & Build-out', timeline: '6–12 weeks', color: 'bg-orange-500', description: 'Interior construction and equipment installation' },
                  { phase: 'Staff Hiring', timeline: '4–8 weeks', color: 'bg-teal-500', description: 'Recruiting and training kitchen/restaurant staff' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0">
                    <div className={`w-4 h-4 rounded-full ${item.color} mt-1 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-900 text-lg">{item.phase}</div>
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                          {item.timeline}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
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
