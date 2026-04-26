import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { formatSpecialty } from '@/lib/format'
import { getFeaturedPartners } from '@/lib/partners'

export async function FeaturedPartners() {
  const partners = await getFeaturedPartners(3)
  if (partners.length === 0) return null

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <Container>
        <h2 className="text-center font-display text-4xl text-brand-ink md:text-5xl">
          New &amp; Featured
        </h2>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => {
            const summary = p.bio
              ? p.bio.length > 160
                ? p.bio.slice(0, 157).trimEnd() + '…'
                : p.bio
              : null
            return (
              <li key={p.id}>
                <Card className="h-full overflow-hidden">
                  {/* Placeholder B&W headshot until we have real photos. */}
                  <div
                    aria-hidden="true"
                    className="aspect-[4/3] w-full bg-gradient-to-br from-brand-ink/15 to-brand-muted/25 grayscale"
                  />
                  <CardBody className="space-y-3 p-6">
                    <div>
                      <h3 className="font-display text-2xl text-brand-ink">{p.full_name}</h3>
                      <p className="mt-0.5 text-xs text-brand-muted">
                        {[formatSpecialty(p.specialty), p.company].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {summary ? (
                      <p className="text-sm leading-relaxed text-brand-body">{summary}</p>
                    ) : null}
                    <Button variant="primary" className="w-full" disabled>
                      Send A Message
                    </Button>
                  </CardBody>
                </Card>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
