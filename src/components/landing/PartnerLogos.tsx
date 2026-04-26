import Image from 'next/image'

export function PartnerLogos() {
  return (
    <section className="px-5 py-14 md:py-20">
      <div className="mx-auto max-w-stage">
        <h2 className="font-display italic text-center text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight">
          You&rsquo;re In Good Hands
        </h2>

        <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-around gap-x-12 gap-y-8">
          {/* Chowbus */}
          <div className="flex items-center">
            <Image
              src="/assets/chowbus.png"
              alt="Chowbus"
              width={160}
              height={44}
              className="h-10 md:h-11 w-auto"
            />
          </div>

          {/* HungryPanda — assembled from the design */}
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#5dc6ea] border-[3px] border-ink text-white font-display text-lg md:text-xl">
              熊
            </span>
            <span className="font-body font-bold text-2xl md:text-3xl text-ink">HungryPanda</span>
          </div>

          {/* Minitable */}
          <div className="flex items-baseline gap-1">
            <span className="font-body font-bold text-2xl md:text-[36px] text-ink tracking-tight">
              Minitable
            </span>
            <span className="inline-block w-2 h-2 bg-orange rounded-sm" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  )
}
