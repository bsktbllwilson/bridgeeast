import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { ptpRoute } from '@/lib/ptp/nav'

const BUY_IMAGE =
  'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80'
const SELL_IMAGE =
  'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80'

export function DualImageCta({ locale }: { locale: string }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <Cta
        href={ptpRoute('/buy', locale)}
        title="Find A Business"
        subtitle="You're Hungry For"
        cta="Buy A Business"
        image={BUY_IMAGE}
      />
      <Cta
        href={ptpRoute('/sell', locale)}
        title="Pass The Plate"
        subtitle="To The Right Hands"
        cta="Sell A Business"
        image={SELL_IMAGE}
      />
    </section>
  )
}

function Cta({
  href,
  title,
  subtitle,
  cta,
  image,
}: {
  href: string
  title: string
  subtitle: string
  cta: string
  image: string
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[5/4] overflow-hidden md:aspect-[5/3]"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
        <p className="ptp-h2 text-white drop-shadow">
          {title}
          <br />
          {subtitle}
        </p>
        <span className="ptp-btn-primary mt-5 w-fit text-sm">
          {cta}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
