'use client'

import { useTranslations } from 'next-intl'

interface Props {
  reason: 'native' | 'fallback'
  /** Optional override; when omitted the badge picks copy automatically. */
  variant?: 'autoTranslated' | 'originalEnglish'
  className?: string
}

/**
 * Small badge that signals when a piece of content is shown in English
 * because the requested locale doesn't have a translation yet.
 */
export function TranslationBadge({ reason, variant, className }: Props) {
  const t = useTranslations('pages.playbookPage')
  if (reason === 'native') return null

  const labelKey = variant ?? 'originalEnglish'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 ${
        className ?? ''
      }`}
    >
      <span aria-hidden>•</span>
      {t(labelKey)}
    </span>
  )
}
