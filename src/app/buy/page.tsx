import { Container } from '@/components/ui/container'

// Stub — full marketplace browse comes in a follow-up. Just lands the
// homepage search submission so the form has a real target.
export default function BuyPage({
  searchParams,
}: {
  searchParams: { q?: string; industry?: string }
}) {
  const { q, industry } = searchParams

  return (
    <Container className="py-24 md:py-32">
      <h1 className="font-display text-5xl text-brand-ink md:text-6xl">Browse Listings</h1>
      <p className="mt-4 text-brand-muted">Marketplace browse page coming soon.</p>

      {(q || industry) && (
        <div className="mt-8 inline-flex flex-wrap gap-3 rounded-2xl border border-brand-border bg-white p-4 text-sm text-brand-ink">
          <span className="text-brand-muted">Search:</span>
          {q ? (
            <span>
              <span className="text-brand-muted">where</span> {q}
            </span>
          ) : null}
          {industry ? (
            <span>
              <span className="text-brand-muted">industry</span> {industry}
            </span>
          ) : null}
        </div>
      )}
    </Container>
  )
}
