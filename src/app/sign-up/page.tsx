import { Container } from '@/components/ui/container'

// Stub — full sign-up flow comes in a follow-up. Reads optional ?tier=
// (from the membership page) so we can preselect a plan after sign-up.
export default function SignUpPage({
  searchParams,
}: {
  searchParams: { tier?: string; next?: string }
}) {
  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-4xl text-brand-ink md:text-5xl">Create your account</h1>
        <p className="mt-4 text-brand-muted">Sign-up UI coming soon.</p>
        {searchParams.tier ? (
          <p className="mt-6 text-xs text-brand-muted">
            Plan after sign-up: <code className="text-brand-ink">{searchParams.tier}</code>
          </p>
        ) : null}
      </div>
    </Container>
  )
}
