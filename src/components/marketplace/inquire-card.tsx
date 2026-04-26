'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { submitInquiry, type InquiryResult } from '@/app/buy/[id]/actions'
import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'

type Mode = { kind: 'guest' } | { kind: 'unverified' } | { kind: 'verified' }

export function InquireCard({
  listingId,
  listingTitle,
  mode,
}: {
  listingId: string
  listingTitle: string
  mode: Mode
}) {
  if (mode.kind === 'guest') {
    return (
      <Card>
        <CardBody className="space-y-4 text-center">
          <h3 className="font-display text-xl text-brand-ink">Sign in to inquire</h3>
          <p className="text-sm text-brand-muted">
            Pass The Plate verifies every buyer before sharing seller contact info.
          </p>
          <Link href={`/sign-in?next=${encodeURIComponent(`/buy/${listingId}`)}`} className="block">
            <Button variant="primary" className="w-full" arrow>
              Sign In
            </Button>
          </Link>
        </CardBody>
      </Card>
    )
  }

  if (mode.kind === 'unverified') {
    return (
      <Card className="border-brand-yellow/60 bg-brand-yellow/30">
        <CardBody className="space-y-4">
          <h3 className="font-display text-xl text-brand-ink">Verification required</h3>
          <p className="text-sm text-brand-ink/85">
            To contact sellers, verify proof of funds or SBA pre-qualification. Most buyers complete
            this in under 5 minutes.
          </p>
          <Link href="/verify" className="block">
            <Button variant="secondary" className="w-full" arrow>
              Verify Now
            </Button>
          </Link>
        </CardBody>
      </Card>
    )
  }

  return <VerifiedInquiryForm listingId={listingId} listingTitle={listingTitle} />
}

function VerifiedInquiryForm({
  listingId,
  listingTitle,
}: {
  listingId: string
  listingTitle: string
}) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<InquiryResult | null>(null)

  function onSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const r = await submitInquiry(formData)
      setResult(r)
    })
  }

  if (result?.ok) {
    return (
      <Card>
        <CardBody className="space-y-3 text-center">
          <h3 className="font-display text-xl text-brand-ink">Inquiry sent</h3>
          <p className="text-sm text-brand-muted">
            We&rsquo;ve forwarded your message to the seller. They&rsquo;ll reach out via email
            shortly.
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h3 className="font-display text-xl text-brand-ink">Inquire about this listing</h3>
        <form action={onSubmit} className="space-y-3">
          <input type="hidden" name="listingId" value={listingId} />
          <textarea
            name="message"
            required
            rows={5}
            placeholder={`Hi, I'm interested in ${listingTitle}. Could you share more about…`}
            aria-label="Message to seller"
            className="w-full rounded-2xl border border-brand-border bg-brand-cream/40 p-4 text-sm text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-ink/15"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={pending}
            arrow={!pending}
          >
            {pending ? 'Sending…' : 'Send Inquiry'}
          </Button>
          {result && !result.ok ? (
            <p className="text-sm text-brand-orange" role="alert">
              {result.error}
            </p>
          ) : null}
        </form>
      </CardBody>
    </Card>
  )
}
