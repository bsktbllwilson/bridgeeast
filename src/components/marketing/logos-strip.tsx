import { Container } from '@/components/ui/container'

// Text-only treatment for now; swap each <span> for an <Image> with the
// real logo SVG when assets are ready.
const LOGOS = [
  { name: 'chowbus', label: 'chowbus' },
  { name: 'hungrypanda', label: 'HungryPanda · 熊猫外卖' },
  { name: 'minitable', label: 'Minitable' },
] as const

export function LogosStrip() {
  return (
    <section className="border-y border-brand-border bg-brand-cream py-14 md:py-20">
      <Container>
        <h2 className="text-center font-display text-3xl text-brand-ink md:text-4xl">
          You&rsquo;re In Good Hands
        </h2>
        <ul className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
          {LOGOS.map((logo) => (
            <li
              key={logo.name}
              className="font-display text-2xl text-brand-muted opacity-80 grayscale transition-opacity hover:opacity-100"
            >
              {logo.label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
