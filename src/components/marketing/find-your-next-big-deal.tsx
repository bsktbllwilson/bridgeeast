'use client'

import { useState, useTransition } from 'react'

import { subscribeNewsletter, type NewsletterResult } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'

export function FindYourNextBigDeal() {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<NewsletterResult | null>(null)

  function onSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const r = await subscribeNewsletter('find_your_next_big_deal', formData)
      setResult(r)
    })
  }

  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <Container className="px-0">
        <div className="rounded-[40px] bg-brand-orange px-8 py-12 text-white md:px-16 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <h2 className="font-display text-4xl leading-tight text-brand-ink md:text-6xl">
              Find Your Next Big Deal
            </h2>

            <div className="space-y-5">
              <p className="text-sm text-white/95">
                Get in touch with our advisor for a complimentary consultation on your next venture.
              </p>

              <form action={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  arrow
                  disabled={pending}
                  className="shrink-0"
                >
                  {pending ? 'Sending…' : 'Get In Touch'}
                </Button>
              </form>

              {result?.ok ? (
                <p className="text-sm text-white" role="status">
                  Thanks — we&rsquo;ll be in touch.
                </p>
              ) : null}
              {result && !result.ok ? (
                <p className="text-sm text-brand-ink" role="alert">
                  {result.error}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
