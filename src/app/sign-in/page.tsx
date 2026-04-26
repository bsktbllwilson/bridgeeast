import { Container } from '@/components/ui/container'

// Stub — full sign-in flow comes in a follow-up.
export default function SignInPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-4xl text-brand-ink md:text-5xl">Sign In</h1>
        <p className="mt-4 text-brand-muted">Sign-in UI coming soon.</p>
        {searchParams.next ? (
          <p className="mt-6 text-xs text-brand-muted">
            You&rsquo;ll return to <code className="text-brand-ink">{searchParams.next}</code> after
            signing in.
          </p>
        ) : null}
      </div>
    </Container>
  )
}
