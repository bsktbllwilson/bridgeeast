'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function FindYourNextBigDealBanner() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email) return
    // TODO: wire to /api/ptp/leads or waitlist endpoint
    setSubmitted(true)
  }

  return (
    <section className="ptp-container py-10 md:py-14">
      <div className="rounded-3xl bg-ptp-orange px-6 py-8 text-white md:px-10 md:py-10">
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h3 className="ptp-h2 text-ptp-ink">Find Your Next Big Deal</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-white/90">
              Get in touch with our advisor for a complimentary consultation on your next venture.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email Address"
                className="w-full rounded-full border-0 bg-white px-5 py-3 text-sm text-ptp-ink placeholder:text-ptp-ink/40 focus:outline-none focus:ring-2 focus:ring-ptp-ink/20"
                required
                aria-label="Email address"
              />
              <button type="submit" className="ptp-btn-dark whitespace-nowrap text-sm">
                {submitted ? 'Thanks!' : 'Get In Touch'}
                {!submitted && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
