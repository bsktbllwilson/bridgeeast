import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ForgotPasswordForm } from './forgot-password-form'

export const metadata = { title: 'Reset password — Pass The Plate' }

export default function ForgotPasswordPage({ params }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
            Forgot your password?
          </h1>
          <p className="text-center text-gray-700 mb-8">
            Enter your email and we’ll send you a reset link. Click it from your inbox to set a
            new password.
          </p>

          <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 shadow-sm">
            <ForgotPasswordForm />
          </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            Remembered it?{' '}
            <Link href={`/${params.locale}/sign-in`} className="underline hover:text-black">
              Back to sign in →
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
