import Link from 'next/link'

interface Plate {
  title: string
  body: string
  cta: string
  href: string
  variant?: 'default' | 'curated'
}

const PLATES: Plate[] = [
  {
    title: 'Bilingual Listing',
    body: 'List in 10 minutes from any device. Native support for Mandarin, Korean, and Vietnamese. Invisible to English-only competitors.',
    cta: 'Get Started →',
    href: '/marketplace/listings/new',
  },
  {
    title: 'Market Data',
    body: 'Valuations backed by 50+ SBA and US Census Bureau data sources — because every number means something.',
    cta: 'Market Tools →',
    href: '/playbook',
  },
  {
    title: 'Vetted Demand',
    body: 'Buyers must show proof of funds or SBA pre-qualification before seller contacts are released. Vetted by our advisors. Zero spam.',
    cta: 'View Sources →',
    href: '/verify',
  },
  {
    title: 'Curated Resources',
    body: 'Operator playbooks, valuation tools, lease checklists, and bilingual partner intros — built by the team that lived it.',
    cta: 'Access Playbooks →',
    href: '/playbook',
    variant: 'curated',
  },
]

export function OurPlatesAreFull() {
  return (
    <section className="px-5 py-12 md:py-16">
      <div className="mx-auto max-w-stage">
        <h2 className="font-display text-[clamp(2rem,4vw,3.375rem)] leading-none tracking-tight mb-10">
          Our Plates Are Full
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATES.map((plate) => (
            <article
              key={plate.title}
              className="rounded-plate border-[3px] border-black/75 bg-orange-deep text-ink p-7 md:p-8 flex flex-col min-h-[300px]"
            >
              {plate.variant === 'curated' ? (
                <div className="bg-yellow rounded-md py-3 px-4 mb-4 inline-flex items-center justify-center">
                  <span className="font-display italic text-xl md:text-2xl tracking-tight">
                    {plate.title}
                  </span>
                </div>
              ) : (
                <h3 className="font-display text-2xl md:text-[28px] leading-tight tracking-tight mb-4">
                  {plate.title}
                </h3>
              )}
              <p className="font-body text-base md:text-[17px] leading-[1.55] flex-1">
                {plate.body}
              </p>
              <Link
                href={plate.href}
                className="self-start mt-5 font-body font-semibold text-[18px] border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
              >
                {plate.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
