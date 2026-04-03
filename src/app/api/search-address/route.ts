import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  try {
    // Use Nominatim (OpenStreetMap) for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, New York City&limit=5&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'BridgeEast/1.0 (contact@bridgeeast.com)'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const data = await response.json()

    // Filter for NYC results and format
    const results = data
      .filter((result: any) => {
        const displayName = result.display_name.toLowerCase()
        return displayName.includes('new york') ||
               displayName.includes('manhattan') ||
               displayName.includes('brooklyn') ||
               displayName.includes('queens') ||
               displayName.includes('bronx') ||
               displayName.includes('staten island')
      })
      .map((result: any) => ({
        display_name: result.display_name,
        lat: result.lat,
        lon: result.lon
      }))

    return NextResponse.json(results)
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    )
  }
}