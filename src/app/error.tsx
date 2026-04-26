'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('global error boundary caught', error)
  }, [error])

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <div className="container max-w-2xl text-center py-24">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-600 mb-4">500</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Something burned in the kitchen.
            </h1>
            <p className="text-lg text-gray-700 mb-3">
              We hit an unexpected error. The team has been notified.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mb-10">Reference: {error.digest}</p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                type="button"
                onClick={reset}
                className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="bg-playbook-yellow text-black px-6 py-3 rounded-md font-medium hover:brightness-95 transition"
              >
                Back home →
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
