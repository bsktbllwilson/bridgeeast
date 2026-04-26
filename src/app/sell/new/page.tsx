import { redirect } from 'next/navigation'

import { Container } from '@/components/ui/container'
import { getCurrentUser } from '@/lib/auth'

// Auth-gated stub — full seller onboarding flow comes in a follow-up.
export default async function NewListingPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?next=/sell/new')

  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl text-brand-ink md:text-5xl">List your business</h1>
        <p className="mt-4 text-brand-muted">
          Seller onboarding (multi-step wizard) coming soon. You&rsquo;re signed in as{' '}
          <span className="text-brand-ink">{user.email}</span>.
        </p>
      </div>
    </Container>
  )
}
