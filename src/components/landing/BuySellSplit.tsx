import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BuySellSplit() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px] md:min-h-[640px]">
        {/* Left half — buyer */}
        <div
          className="relative flex items-end p-8 md:p-14 min-h-[360px]"
          style={{
            backgroundImage: 'url(/assets/split-left.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/0" aria-hidden />
          <div className="relative z-10 text-white max-w-xl">
            <h3 className="font-display text-[clamp(2rem,4vw,3.375rem)] leading-[1.1] tracking-tight">
              Find A Business
              <br />
              You&rsquo;re Hungry For
            </h3>
            <Link
              href="/marketplace/browse"
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-[25px] bg-orange hover:bg-orange-dark transition-colors text-white font-body text-lg md:text-2xl font-medium px-8 md:px-12 py-4 md:py-5"
            >
              Buy A Business <ArrowRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Right half — seller */}
        <div
          className="relative flex items-end p-8 md:p-14 min-h-[360px] md:justify-end md:text-right"
          style={{
            backgroundImage: 'url(/assets/split-right.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/0" aria-hidden />
          <div className="relative z-10 text-white max-w-xl md:ml-auto">
            <h3 className="font-display text-[clamp(2rem,4vw,3.375rem)] leading-[1.1] tracking-tight">
              Pass The Plate
              <br />
              To The Right Hands
            </h3>
            <Link
              href="/marketplace/listings/new"
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-[25px] bg-orange hover:bg-orange-dark transition-colors text-white font-body text-lg md:text-2xl font-medium px-8 md:px-12 py-4 md:py-5"
            >
              Sell A Business <ArrowRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
