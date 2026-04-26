import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

const INDUSTRIES = [
  { value: '', label: 'All Industries' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'catering', label: 'Catering' },
] as const

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

          <form
            action="/buy"
            method="get"
            className="mt-10 w-full max-w-3xl"
            aria-label="Search listings"
          >
            <div className="flex w-full flex-col gap-2 rounded-3xl border border-brand-border bg-white p-2 shadow-sm md:flex-row md:items-center md:gap-0 md:rounded-full">
              <input
                type="text"
                name="q"
                placeholder="City, State"
                aria-label="City, State"
                className="h-12 flex-1 rounded-full bg-transparent px-5 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none md:border-r md:border-brand-border/60"
              />
              <select
                name="industry"
                aria-label="Industry"
                defaultValue=""
                className="h-12 flex-1 appearance-none rounded-full bg-transparent px-5 pr-10 text-base text-brand-ink focus:outline-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '14px 14px',
                }}
              >
                {INDUSTRIES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="primary" arrow className="w-full md:w-auto">
                Find A Seat
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  )
}
