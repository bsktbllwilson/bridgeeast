import { Container } from '@/components/ui/container'
import { SearchRow } from '@/components/marketing/search-row'

export function Hero() {
  return (
    <section className="bg-brand-cream pb-16 pt-20 md:pb-24 md:pt-32">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-display text-[40px] leading-[1.05] text-brand-ink md:text-6xl lg:text-[64px]">
            Your Seat at The Table Starts Here
          </h1>
          <p className="mt-5 text-base text-brand-muted">
            First Marketplace for The $240B+ Asian F&amp;B Transition
          </p>
          <SearchRow className="mt-10" />
        </div>
      </Container>
    </section>
  )
}
