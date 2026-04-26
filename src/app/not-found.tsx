import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <div className="container max-w-2xl text-center py-24">
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
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
