import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

type Hotspot = {
  id: string
  title: string
  neighborhood: string | null
  city: string | null
  state: string | null
  cuisine: string | null
  cover_image_url: string | null
}

const CUISINE_LABEL: Record<string, string> = {
  chinese: 'Chinese',
  japanese: 'Japanese',
  korean: 'Korean',
  vietnamese: 'Vietnamese',
  thai: 'Thai',
  pan_asian: 'Pan-Asian',
}

async function getHotspots(): Promise<Hotspot[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, neighborhood, city, state, cuisine, cover_image_url')
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(8)

  if (error || !data) return []
  return data
}

export async function TrendingHotspots() {
  const hotspots = await getHotspots()
  if (hotspots.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl text-brand-ink md:text-5xl">Trending Hotspots</h2>
          <Link
            href="/buy"
            className="text-sm font-medium text-brand-ink underline-offset-4 hover:underline"
          >
            More Listings <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>

      <div className="mt-10 overflow-x-auto pb-2">
        <ul className="grid w-max auto-cols-[260px] grid-flow-col gap-5 px-6 md:px-8 lg:mx-auto lg:w-full lg:max-w-[1280px] lg:auto-cols-fr lg:grid-cols-4">
          {hotspots.slice(0, 4).map((spot) => (
            <HotspotCard key={spot.id} spot={spot} />
          ))}
        </ul>
      </div>

      {hotspots.length > 4 ? (
        <div className="mt-5 hidden overflow-x-auto pb-2 lg:block">
          <ul className="mx-auto grid w-full max-w-[1280px] grid-cols-4 gap-5 px-8">
            {hotspots.slice(4, 8).map((spot) => (
              <HotspotCard key={spot.id} spot={spot} />
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

function HotspotCard({ spot }: { spot: Hotspot }) {
  const location = [spot.neighborhood, spot.state].filter(Boolean).join(', ') || spot.city || ''
  const cuisine = spot.cuisine ? (CUISINE_LABEL[spot.cuisine] ?? spot.cuisine) : null

  return (
    <li className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-ink/40">
      <Link href={`/listings/${spot.id}`} className="absolute inset-0">
        {spot.cover_image_url ? (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105',
            )}
            style={{ backgroundImage: `url('${spot.cover_image_url}')` }}
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="font-display text-2xl leading-tight">{spot.title}</h3>
          {(location || cuisine) && (
            <p className="mt-1 text-xs text-white/85">
              {[location, cuisine].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </Link>
    </li>
  )
}
