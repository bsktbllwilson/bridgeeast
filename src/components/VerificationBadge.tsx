'use client'

import { BadgeCheck, ShieldAlert, ShieldQuestion } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { getLocaleFromPathname } from '@/i18n/locales'
import { getStaticMessages } from '@/i18n/static-messages'
import { type VerificationStatus } from '@/lib/marketplace'

const badgeStyles: Record<VerificationStatus, string> = {
  verified: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  unverified: 'bg-gray-100 text-gray-700 border-gray-200',
}

const badgeIcons: Record<VerificationStatus, typeof BadgeCheck> = {
  verified: BadgeCheck,
  pending: ShieldAlert,
  rejected: ShieldAlert,
  unverified: ShieldQuestion,
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const messages = getStaticMessages(locale)
  const Icon = badgeIcons[status]

  const labelMap: Record<VerificationStatus, string> = {
    verified: messages.common.verification.verified,
    pending: messages.common.verification.pending,
    rejected: messages.common.verification.rejected,
    unverified: messages.common.verification.unverified,
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${badgeStyles[status]}`}>
      <Icon className="h-4 w-4" />
      {labelMap[status]}
    </span>
  )
}