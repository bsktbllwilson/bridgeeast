'use client'

import { useState, useTransition } from 'react'

import { subscribeNewsletter, type NewsletterResult } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'

export function BecomePartnerBand() {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<NewsletterResult | null>(null)

  function onSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const r = await subscribeNewsletter('become_a_partner', formData)
      setResult(r)
    })
  }

  return (
    <section className="bg-brand-ink py-16 text-brand-cream md:py-20">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Become A Partner</h2>

          <div className="space-y-4">
            <p className="text-base text-brand-cream/85">
              Working in the F&amp;B Business? Get Listed in Our Network!
            </p>
            <form action={onSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                aria-label="Email"
                className="flex-1 border-brand-cream/20 bg-brand-cream/10 text-brand-cream placeholder:text-brand-cream/60"
              />
              <Button
                type="submit"
                variant="primary"
                arrow={!pending}
                disabled={pending}
                className="shrink-0"
              >
                {pending ? 'Sending…' : 'Add Me'}
              </Button>
            </form>
            <p className="text-xs text-brand-cream/60">
              Or apply now —{' '}
              <a href="/partners/apply" className="text-brand-cream underline underline-offset-4">
                full partner application →
              </a>
            </p>
            {result?.ok ? (
              <p className="text-sm text-brand-cream" role="status">
                Thanks — we&rsquo;ll send the partner application link to your inbox.
              </p>
            ) : null}
            {result && !result.ok ? (
              <p className="text-sm text-brand-orange" role="alert">
                {result.error}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
