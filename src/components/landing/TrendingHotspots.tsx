import Link from 'next/link'

interface Listing {
  name: string
  city: string
  state: string
  category: string
  image: string
  imagePosition?: string
  imageFilter?: string
}

const LISTINGS: Listing[] = [
  {
    name: "Grandma's Noods",
    city: 'Flushing',
    state: 'Queens',
    category: 'Chinese',
    image: '/assets/listing-2.jpg',
    imagePosition: '30% 40%',
    imageFilter: 'grayscale(100%) brightness(1.15)',
  },
  {
    name: 'Bao Bao Town',
    city: 'Chinatown',
    state: 'NY',
    category: 'Vietnamese',
    image: '/assets/listing-1.png',
  },
  {
    name: '1800-Dumplings',
    city: 'Elmhurst',
    state: 'Queens',
    category: 'Chinese',
    image: '/assets/listing-3.jpg',
  },
  {
    name: 'Yum Cha, Matcha',
    city: 'Long Island City',
    state: 'Queens',
    category: 'Japanese',
    image: '/assets/listing-4.png',
  },
]

export function TrendingHotspots() {
  return (
    <section className="px-5 py-12 md:py-16">
      <div className="mx-auto max-w-stage">
        <div className="flex items-end justify-between gap-6 mb-10">
          <h2 className="font-display text-[clamp(2rem,4vw,3.375rem)] leading-none tracking-tight">
            Trending Hotspots
          </h2>
          <Link
            href="/marketplace/browse"
            className="font-body text-[clamp(1rem,1.4vw,1.5rem)] text-ink-muted hover:text-ink transition-colors whitespace-nowrap"
          >
            More Listings →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {LISTINGS.map((listing) => (
            <Link
              key={listing.name}
              href="/marketplace/browse"
              className="group relative aspect-[354/490] overflow-hidden bg-neutral-800 hover:scale-[1.01] transition-transform"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${listing.image})`,
                  backgroundPosition: listing.imagePosition,
                  filter: listing.imageFilter,
                }}
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-black/55 to-black/80"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-7 text-center text-white">
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.375rem)] leading-none tracking-tight">
                  {listing.name}
                </h3>
                <p className="mt-3 font-body text-sm md:text-base tracking-wide">
                  {listing.city}, {listing.state} &nbsp;|&nbsp; {listing.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
