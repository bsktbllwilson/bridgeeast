'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { hasSupabaseEnv, supabase } from '@/lib/supabase'

export function Subscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Enter a valid email.')
      return
    }
    setStatus('submitting')
    setMessage(null)

    try {
      if (hasSupabaseEnv) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({ email, source: 'homepage_subscribe' })
        if (error && !error.message.toLowerCase().includes('duplicate')) {
          throw error
        }
      }
      setStatus('success')
      setMessage("Thanks — we'll be in touch.")
      setEmail('')
    } catch (err) {
      console.error('subscribe failed', err)
      setStatus('error')
      setMessage('Something went wrong. Try again in a minute.')
    }
  }

  return (
    <section className="px-5 py-12 md:py-16">
      <div className="mx-auto max-w-[1505px] rounded-bigband bg-orange-deep px-8 py-10 md:px-20 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <h2 className="font-display text-[clamp(2rem,4vw,3.625rem)] leading-[1.05] tracking-tight text-ink">
            Find Your Next Big Deal
          </h2>

          <div className="text-ink">
            <p className="font-body text-base md:text-lg mb-5 max-w-md md:ml-auto">
              Get in touch with our advisor for a complimentary consultation on your next venture.
            </p>
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-3 md:ml-auto md:max-w-[520px]"
            >
              <label className="flex-1 flex items-center rounded-full bg-white border border-black/10 px-6">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'submitting'}
                  className="w-full bg-transparent outline-none font-body text-base md:text-lg py-3 placeholder:text-[rgb(146,147,158)]"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center gap-2 bg-ink text-white rounded-[25px] px-7 py-3 font-body font-medium text-base md:text-lg hover:bg-neutral-800 transition-colors disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Get In Touch'}{' '}
                {status !== 'submitting' && <ArrowRight className="h-4 w-4" aria-hidden />}
              </button>
            </form>
            {message && (
              <p
                className={`mt-3 font-body text-sm ${status === 'error' ? 'text-red-900' : 'text-ink/80'}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
