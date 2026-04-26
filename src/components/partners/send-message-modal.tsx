'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'

import { sendPartnerMessage, type SendMessageResult } from '@/app/partners/actions'
import { Button } from '@/components/ui/button'

const inputClass =
  'h-12 w-full rounded-full border border-brand-border bg-brand-cream/40 px-5 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-ink/15'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-brand-muted'

export type CurrentUserHint = {
  email: string | null
  fullName: string | null
} | null

export function SendMessageModal({
  open,
  onClose,
  partnerId,
  partnerName,
  currentUser,
}: {
  open: boolean
  onClose: () => void
  partnerId: string | null
  partnerName: string | null
  currentUser: CurrentUserHint
}) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<SendMessageResult | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Reset state when the modal opens with a new partner.
  useEffect(() => {
    if (open) setResult(null)
  }, [open, partnerId])

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !partnerId) return null

  function onSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const r = await sendPartnerMessage(formData)
      setResult(r)
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-message-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-brand-ink/60" onClick={onClose} />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-brand-muted hover:bg-brand-cream hover:text-brand-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {result?.ok ? (
          <div className="space-y-3 py-4 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-xl text-white">
              ✓
            </span>
            <h3 id="send-message-title" className="font-display text-2xl text-brand-ink">
              Message sent
            </h3>
            <p className="text-sm text-brand-muted">
              We&rsquo;ve forwarded your note{partnerName ? ` to ${partnerName}` : ''}.
              They&rsquo;ll reply directly to your email.
            </p>
            <Button variant="primary" onClick={onClose} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3
              id="send-message-title"
              className="font-display text-2xl text-brand-ink md:text-3xl"
            >
              Send a message{partnerName ? ` to ${partnerName}` : ''}
            </h3>
            <p className="mt-1 text-sm text-brand-muted">
              We&rsquo;ll forward your note via email and Cc Pass The Plate.
            </p>

            <form action={onSubmit} className="mt-5 space-y-4" noValidate>
              <input type="hidden" name="partnerId" value={partnerId} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="senderName" className={labelClass}>
                    Your Name
                  </label>
                  <input
                    id="senderName"
                    name="senderName"
                    required
                    defaultValue={currentUser?.fullName ?? ''}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="senderEmail" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    required
                    defaultValue={currentUser?.email ?? ''}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>
                  Subject
                </label>
                <input id="subject" name="subject" required className={inputClass} />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full rounded-2xl border border-brand-border bg-brand-cream/40 p-4 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-ink/15"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                arrow={!pending}
                disabled={pending}
                className="w-full"
              >
                {pending ? 'Sending…' : 'Send Message'}
              </Button>

              {result && !result.ok ? (
                <p role="alert" className="text-sm text-brand-orange">
                  {result.error}
                </p>
              ) : null}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
