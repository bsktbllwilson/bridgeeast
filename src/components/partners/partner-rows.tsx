'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { formatSpecialty } from '@/lib/format'
import type { Partner } from '@/lib/partners'
import { cn } from '@/lib/utils'

import { SendMessageModal, type CurrentUserHint } from './send-message-modal'

export function PartnerRows({
  partners,
  currentUser,
}: {
  partners: Partner[]
  currentUser: CurrentUserHint
}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [messagePartner, setMessagePartner] = useState<Partner | null>(null)

  if (partners.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-brand-muted">
        No partners match your filters.
      </p>
    )
  }

  return (
    <>
      <ul className="space-y-3">
        {partners.map((p) => {
          const isOpen = openId === p.id
          return (
            <li key={p.id} className="overflow-hidden rounded-3xl bg-white">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-brand-cream/40"
              >
                <span className="flex items-center gap-3 text-sm md:text-base">
                  <span className="font-medium text-brand-ink">{p.full_name}</span>
                  <span className="text-brand-muted">|</span>
                  <span className="text-brand-muted">
                    {[p.job_title, p.company].filter(Boolean).join(', ') ||
                      formatSpecialty(p.specialty) ||
                      '—'}
                  </span>
                </span>
                <span className="hidden items-center gap-2 text-sm font-medium text-brand-ink sm:inline-flex">
                  Send A Message
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isOpen ? (
                <ExpandedPanel partner={p} onSendMessage={() => setMessagePartner(p)} />
              ) : null}
            </li>
          )
        })}
      </ul>

      <SendMessageModal
        open={messagePartner !== null}
        onClose={() => setMessagePartner(null)}
        partnerId={messagePartner?.id ?? null}
        partnerName={messagePartner?.full_name ?? null}
        currentUser={currentUser}
      />
    </>
  )
}

function ExpandedPanel({
  partner,
  onSendMessage,
}: {
  partner: Partner
  onSendMessage: () => void
}) {
  const meta: { label: string; value: string }[] = []
  if (partner.specialty)
    meta.push({ label: 'Specialty', value: formatSpecialty(partner.specialty) ?? '' })
  if (partner.languages?.length)
    meta.push({ label: 'Languages', value: partner.languages.join(', ') })
  if (partner.email) meta.push({ label: 'Email', value: partner.email })
  if (partner.phone) meta.push({ label: 'Phone', value: partner.phone })
  if (partner.website) meta.push({ label: 'Website', value: partner.website })

  return (
    <div className="border-t border-brand-border bg-white px-6 pb-6 pt-5">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          {partner.bio ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-brand-body">
              {partner.bio}
            </p>
          ) : (
            <p className="text-sm text-brand-muted">No bio provided.</p>
          )}

          {meta.length > 0 ? (
            <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {meta.map((m) => (
                <div key={m.label} className="flex gap-2 text-xs">
                  <dt className="text-brand-muted">{m.label}:</dt>
                  <dd className="text-brand-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="lg:self-start">
          <Button type="button" variant="primary" arrow className="w-full" onClick={onSendMessage}>
            Send A Message
          </Button>
          <p className="mt-3 text-xs text-brand-muted">
            We&rsquo;ll forward your note to {partner.full_name.split(' ')[0]} via email.
          </p>
        </div>
      </div>
    </div>
  )
}
