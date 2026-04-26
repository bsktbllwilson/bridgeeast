import { Container } from '@/components/ui/container'

export type Stat = { value: string; caption: string }

const HOMEPAGE_STATS: Stat[] = [
  {
    value: '$57B',
    caption: 'The booming Asian F&B sector changing hands right now.',
  },
  {
    value: '685K',
    caption: 'Asian-owned employer firms generating $1.2 trillion in annual receipts.',
  },
  {
    value: '$10T',
    caption: 'In private business assets transferring as Baby Boomers retire by 2030.',
  },
  {
    value: '120+',
    caption: 'Vetted partners. SBA lenders, bilingual brokers, & immigration attorneys.',
  },
]

export function StatsBand({ stats = HOMEPAGE_STATS }: { stats?: Stat[] } = {}) {
  return (
    <section className="bg-brand-yellow py-16 text-brand-ink md:py-20">
      <Container>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.value} className="flex flex-col gap-3">
              <span className="font-display text-5xl leading-none md:text-6xl lg:text-[64px]">
                {stat.value}
              </span>
              <p className="text-sm leading-relaxed text-brand-ink/90">{stat.caption}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
