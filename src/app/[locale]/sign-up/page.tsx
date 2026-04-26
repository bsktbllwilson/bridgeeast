import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SignUpForm } from './sign-up-form'

export const metadata = { title: 'Sign Up — Pass The Plate' }

interface PageProps {
  params: { locale: string }
  searchParams: { next?: string }
}

export default function SignUpPage({ params, searchParams }: PageProps) {
  const next = searchParams.next ?? null
  const signInHref = next
    ? `/${params.locale}/sign-in?next=${encodeURIComponent(next)}`
    : `/${params.locale}/sign-in`

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
            Join Pass The Plate
          </h1>
          <p className="text-center text-gray-700 mb-8">
            Free to create. No credit card. Upgrade anytime.
          </p>

          <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 shadow-sm">
            <SignUpForm next={next} />
          </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            Already have an account?{' '}
            <Link href={signInHref} className="underline hover:text-black">
              Sign in →
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
