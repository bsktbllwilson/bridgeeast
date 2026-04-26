import { ListingsMap, type MapListing } from '@/components/marketplace/listings-map'
import { SearchRow } from '@/components/marketing/search-row'
import { Container } from '@/components/ui/container'
import { createClient } from '@/lib/supabase/server'

async function getMapListings(): Promise<MapListing[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select(
      'id, title, city, state, neighborhood, cuisine, cover_image_url, asking_price_cents, lat, lng',
    )
    .eq('status', 'active')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .limit(500)

  if (error || !data) return []
  // Narrow nullable lat/lng now that we've filtered them.
  return data.flatMap((l) =>
    l.lat != null && l.lng != null ? [{ ...l, lat: l.lat, lng: l.lng }] : [],
  )
}

export async function ListingsHotspotsSection() {
  const listings = await getMapListings()
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null

  return (
    <section className="bg-brand-yellow py-16 md:py-24">
      <Container>
        <h2 className="font-display text-4xl text-brand-ink md:text-5xl">Listing Hotspots</h2>
        <p className="mt-3 max-w-2xl text-sm text-brand-ink/80">
          Browse where Asian F&amp;B businesses are coming to market. Click a pin to see the
          listing.
        </p>

        <div className="mt-8 flex justify-center">
          <SearchRow buttonLabel="Search" />
        </div>

        <div className="mt-10">
          <ListingsMap listings={listings} mapboxToken={mapboxToken} />
        </div>
      </Container>
    </section>
  )
}
