'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'
import { formatSpecialty } from '@/lib/format'
import type { Partner } from '@/lib/partners'

import { SendMessageModal, type CurrentUserHint } from './send-message-modal'

export function FeaturedPartnersGrid({
  partners,
  currentUser,
}: {
  partners: Partner[]
  currentUser: CurrentUserHint
}) {
  const [messagePartner, setMessagePartner] = useState<Partner | null>(null)

  return (
    <>
      <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => {
          const summary = p.bio
            ? p.bio.length > 160
              ? p.bio.slice(0, 157).trimEnd() + '…'
              : p.bio
            : null
          return (
            <li key={p.id}>
              <Card className="h-full overflow-hidden">
                <div
                  aria-hidden="true"
                  className="aspect-[4/3] w-full bg-gradient-to-br from-brand-ink/15 to-brand-muted/25 grayscale"
                />
                <CardBody className="space-y-3 p-6">
                  <div>
                    <h3 className="font-display text-2xl text-brand-ink">{p.full_name}</h3>
                    <p className="mt-0.5 text-xs text-brand-muted">
                      {[formatSpecialty(p.specialty), p.company].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {summary ? (
                    <p className="text-sm leading-relaxed text-brand-body">{summary}</p>
                  ) : null}
                  <Button variant="primary" className="w-full" onClick={() => setMessagePartner(p)}>
                    Send A Message
                  </Button>
                </CardBody>
              </Card>
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
