import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export const metadata = {
  title: 'Welcome aboard · Pass The Plate',
}

export default function MembershipSuccessPage() {
  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange text-3xl text-white">
          ✓
        </span>
        <h1 className="mt-6 font-display text-4xl text-brand-ink md:text-5xl">
          You&rsquo;re in. Welcome aboard.
        </h1>
        <p className="mt-4 text-base text-brand-muted">
          Your membership is active and your dashboard is ready. We&rsquo;ll send a confirmation
          email with your receipt shortly. Manage your plan any time from your account settings.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/buy">
            <Button variant="primary" arrow>
              Browse Listings
            </Button>
          </Link>
          <Link href="/membership">
            <Button variant="outline">Back to Membership</Button>
          </Link>
        </div>

        <p className="mt-12 text-xs text-brand-muted">
          Note: subscription details may take a moment to appear in your account while Stripe
          confirms the payment.
        </p>
      </div>
    </Container>
  )
}
