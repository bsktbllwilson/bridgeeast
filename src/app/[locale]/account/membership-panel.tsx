'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { openBillingPortalAction } from './actions'

interface Props {
  tier: string
  status: string
  currentPeriodEnd: string | null
  hasStripeCustomer: boolean
}

export function MembershipPanel({ tier, status, currentPeriodEnd, hasStripeCustomer }: Props) {
  const t = useTranslations('pages.accountPage')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const tierKey = (
    {
      first_bite: ['tierFirstBite', 'tierFirstBiteSub'],
      chefs_table: ['tierChefsTable', 'tierChefsTableSub'],
      full_menu: ['tierFullMenu', 'tierFullMenuSub'],
    } as const
  )[tier as 'first_bite' | 'chefs_table' | 'full_menu'] ?? ['tierFirstBite', 'tierFirstBiteSub']

  const statusKey = (
    {
      active: ['statusActive', 'text-green-700'],
      past_due: ['statusPastDue', 'text-amber-700'],
      canceled: ['statusCanceled', 'text-gray-700'],
    } as const
  )[status as 'active' | 'past_due' | 'canceled'] ?? ['statusActive', 'text-green-700']

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
        <p className="text-xs uppercase tracking-widest text-gray-700 mb-2">
          {t('currentPlan')}
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-bold mb-1">
          {t(tierKey[0] as never)}
        </h3>
        <p className="text-gray-800 mb-4">{t(tierKey[1] as never)}</p>
        <p className="text-sm">
          <span className={`font-semibold ${statusKey[1]}`}>{t(statusKey[0] as never)}</span>
          {currentPeriodEnd && status !== 'canceled' && (
            <>
              {' · '}
              <span className="font-medium">
                {new Date(currentPeriodEnd).toLocaleDateString(undefined, {
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
        <h4 className="font-display text-xl font-bold">{t('manageHeading')}</h4>
        <p className="text-sm text-gray-700">{t('manageBody')}</p>
        <button
          type="button"
          onClick={onPortal}
          disabled={pending || !hasStripeCustomer}
          className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
        >
          {pending ? t('managePending') : t('managePortal')}
        </button>
        {!hasStripeCustomer && <p className="text-xs text-gray-600">{t('noStripeHelper')}</p>}
        {message && <p className="text-sm text-red-700">{message}</p>}
      </div>
    </div>
  )
}
