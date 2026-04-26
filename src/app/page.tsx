import { Container } from '@/components/ui/container'
import { MarketingShell } from '@/components/marketing/marketing-shell'

export default function Home() {
  return (
    <MarketingShell>
      <Container className="py-24 md:py-32">
        <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
          The marketplace for Asian F&amp;B business sales.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-brand-muted">
          Browse vetted restaurants, bakeries, and food businesses for sale across the country — or
          list your own and find the right operator to take it forward.
        </p>
      </Container>
    </MarketingShell>
  )
}
