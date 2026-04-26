'use client'

import { useState } from 'react'
import { openBillingPortalAction } from './actions'

const TIER_COPY: Record<string, { name: string; sub: string }> = {
  first_bite: { name: 'First Bite', sub: 'Free · core marketplace + Playbook' },
  chefs_table: { name: "Chef's Table", sub: '$99 / month · advisor time + deeper limits' },
  full_menu: { name: 'The Full Menu', sub: '$249 / month · dedicated advisor, unlimited' },
}

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  active: { label: 'Active', tone: 'text-green-700' },
  past_due: { label: 'Past due', tone: 'text-amber-700' },
  canceled: { label: 'Canceled', tone: 'text-gray-700' },
}

interface Props {
  tier: string
  status: string
  currentPeriodEnd: string | null
  hasStripeCustomer: boolean
}

export function MembershipPanel({ tier, status, currentPeriodEnd, hasStripeCustomer }: Props) {
  const tierInfo = TIER_COPY[tier] ?? TIER_COPY.first_bite
  const statusInfo = STATUS_COPY[status] ?? STATUS_COPY.active
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onPortal = async () => {
    setPending(true)
    setMessage(null)
    const r = await openBillingPortalAction()
    setPending(false)
    if (!r.ok) setMessage(r.error ?? 'Could not open billing portal.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-playbook-yellow p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-gray-700 mb-2">Current plan</p>
        <h3 className="font-display text-3xl md:text-4xl font-bold mb-1">{tierInfo.name}</h3>
        <p className="text-gray-800 mb-4">{tierInfo.sub}</p>
        <p className="text-sm">
          Status: <span className={`font-semibold ${statusInfo.tone}`}>{statusInfo.label}</span>
          {currentPeriodEnd && status !== 'canceled' && (
            <>
              {' '}· Renews{' '}
              <span className="font-medium">
                {new Date(currentPeriodEnd).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-black/5 p-6 md:p-8 space-y-4">
        <h4 className="font-display text-xl font-bold">Manage subscription</h4>
        <p className="text-sm text-gray-700">
          Update payment method, change tier, or cancel from the Stripe portal.
        </p>
        <button
          type="button"
          onClick={onPortal}
          disabled={pending || !hasStripeCustomer}
          className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
        >
          {pending ? 'Opening…' : 'Manage in Stripe Portal'}
        </button>
        {!hasStripeCustomer && (
          <p className="text-xs text-gray-600">
            You don’t have a Stripe customer yet — start a paid plan from the Membership page first.
          </p>
        )}
        {message && <p className="text-sm text-red-700">{message}</p>}
      </div>
    </div>
  )
}
