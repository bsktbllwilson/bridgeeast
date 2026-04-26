import { Container } from '@/components/ui/container'
import { getFeaturedPartners } from '@/lib/partners'

import { FeaturedPartnersGrid } from './featured-partners-grid'
import type { CurrentUserHint } from './send-message-modal'

export async function FeaturedPartners({ currentUser }: { currentUser: CurrentUserHint }) {
  const partners = await getFeaturedPartners(3)
  if (partners.length === 0) return null

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <Container>
        <h2 className="text-center font-display text-4xl text-brand-ink md:text-5xl">
          New &amp; Featured
        </h2>
        <FeaturedPartnersGrid partners={partners} currentUser={currentUser} />
      </Container>
    </section>
  )
}
