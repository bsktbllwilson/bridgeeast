import Link from 'next/link'

import { cn } from '@/lib/utils'

export function BuySellSplit() {
  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-2">
      <SplitHalf
        href="/buy"
        backgroundImage="/images/brand/girl_noodle.jpeg"
        headline={
          <>
            Find A Business
            <br />
            You&rsquo;re Hungry For
          </>
        }
        cta="Buy A Business"
      />
      <SplitHalf
        href="/sell"
        backgroundImage="/images/brand/meal_.jpeg"
        headline={
          <>
            Pass The Plate
            <br />
            To The Right Hands
          </>
        }
        cta="Sell A Business"
      />
    </section>
  )
}

function SplitHalf({
  href,
  backgroundImage,
  headline,
  cta,
}: {
  href: string
  backgroundImage: string
  headline: React.ReactNode
  cta: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex aspect-square w-full items-end overflow-hidden md:aspect-[4/5]',
        'bg-brand-ink/40 bg-cover bg-center',
      )}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/30 to-transparent"
      />

      <div className="relative z-10 flex w-full flex-col gap-6 p-8 md:p-12">
        <h2 className="font-display text-4xl leading-[1.05] text-white md:text-6xl">{headline}</h2>
        <span
          className={cn(
            'inline-flex w-fit items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-base font-medium text-white',
            'transition-transform group-hover:translate-x-1',
          )}
        >
          {cta} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
