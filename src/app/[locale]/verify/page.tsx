import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getCurrentProfile } from '@/lib/auth'
import { VerifyForm } from './verify-form'

export const metadata = { title: 'Verify proof of funds — Pass The Plate' }
export const dynamic = 'force-dynamic'

const STATUS_COPY: Record<string, { label: string; tone: string; body: string }> = {
  none: {
    label: 'Not submitted',
    tone: 'bg-gray-100 text-gray-800',
    body: 'Upload a document to start using the marketplace.',
  },
  pending: {
    label: 'Under review',
    tone: 'bg-playbook-yellow text-black',
    body: 'Our team reviews submissions within 1–2 business days.',
  },
  verified: {
    label: 'Verified',
    tone: 'bg-green-100 text-green-900',
    body: 'You can inquire on listings without further checks.',
  },
  rejected: {
    label: 'Needs an update',
    tone: 'bg-red-100 text-red-900',
    body: 'We couldn’t verify the last document. Re-upload to try again.',
  },
}

export default async function VerifyPage({ params }: { params: { locale: string } }) {
  const profile = await getCurrentProfile()
  const status = profile?.proof_of_funds_status ?? 'none'
  const copy = STATUS_COPY[status] ?? STATUS_COPY.none

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container pt-24 md:pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-gray-600 mb-4">
            Buyer Verification
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Prove you’re ready to inquire
          </h1>
          <p className="text-gray-700 mb-10 max-w-xl">
            Sellers want to talk to qualified buyers. Upload one document — a recent bank
            statement, asset summary, or an SBA pre-qualification letter — and a Pass The Plate
            admin will verify within 1–2 business days.
          </p>

          <div
            className={`mb-8 rounded-2xl px-5 py-4 flex items-center gap-4 ${copy.tone}`}
          >
            <span className="font-display text-lg font-bold">{copy.label}</span>
            <span className="text-sm">{copy.body}</span>
          </div>

          {status === 'verified' ? (
            <div className="rounded-2xl bg-white border border-black/5 p-8 md:p-10 text-center">
              <p className="text-gray-700 mb-6">
                You’re cleared to inquire on listings across the marketplace.
              </p>
              <Link href={`/${params.locale}/listings`} className="btn-primary">
                Browse Listings →
              </Link>
            </div>
          ) : (
            <VerifyForm />
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
