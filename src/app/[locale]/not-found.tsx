import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function LocaleNotFound() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <section className="container py-24 md:py-32 text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-600 mb-4">404</p>
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
          The plate hasn&rsquo;t arrived yet.
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Either the page moved or this URL never existed. Let&rsquo;s get you back to
          something useful.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/listings"
            className="bg-playbook-yellow text-black px-6 py-3 rounded-md font-medium hover:brightness-95 transition"
          >
            Browse Listings →
          </Link>
          <Link
            href="/playbook"
            className="text-gray-700 underline px-3 py-3 hover:text-black transition-colors"
          >
            The Playbook →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
