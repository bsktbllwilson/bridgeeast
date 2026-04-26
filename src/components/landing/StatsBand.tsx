interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  {
    value: '$57B',
    label: 'The booming Asian F&B sector changing hands right now.',
  },
  {
    value: '685K',
    label: 'Asian-owned employer firms generating $1.2 trillion in annual receipts.',
  },
  {
    value: '$10T',
    label: 'In private business assets transferring as Baby Boomers retire by 2030.',
  },
  {
    value: '120+',
    label: 'Vetted partners. SBA lenders, bilingual brokers, and immigration attorneys.',
  },
]

export function StatsBand() {
  return (
    <section className="bg-yellow w-full py-16 md:py-24">
      <div className="mx-auto max-w-stage px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center px-2">
              <div className="font-display text-[clamp(2.75rem,6vw,5.625rem)] leading-none tracking-tight text-ink">
                {stat.value}
              </div>
              <p className="mt-4 font-body text-base md:text-[22px] leading-snug text-ink">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
