import Link from 'next/link'

import { type AppLocale } from '@/i18n/locales'
import { filtersToSearchParams } from '@/lib/marketplace/filters'
import { formatRelative } from '@/lib/marketplace/format'
import { type SavedSearch } from '@/lib/marketplace/types'

interface SavedSearchCardProps {
  search: SavedSearch
  browseHref: string
  locale: AppLocale
  labels: {
    frequency: string
    frequencyInstant: string
    frequencyDaily: string
    frequencyWeekly: string
    frequencyNone: string
    delete: string
    lastMatch: string
    open: string
  }
}

export function SavedSearchCard({ search, browseHref, locale, labels }: SavedSearchCardProps) {
  const params = filtersToSearchParams(search.filter_json)
  const href = params.toString() ? `${browseHref}?${params.toString()}` : browseHref
  const frequencyLabel =
    search.alert_frequency === 'instant'
      ? labels.frequencyInstant
      : search.alert_frequency === 'daily'
        ? labels.frequencyDaily
        : search.alert_frequency === 'weekly'
          ? labels.frequencyWeekly
          : labels.frequencyNone

  return (
    <article className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-950">{search.name}</h3>
          <p className="text-xs text-gray-500">
            {labels.frequency}: {frequencyLabel}
          </p>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {search.last_match_count}
        </span>
      </div>
      <p className="text-xs text-gray-500">
        {labels.lastMatch.replace('{when}', formatRelative(search.last_alerted_at, locale))}
      </p>
      <div className="flex gap-2">
        <Link href={href} className="btn-outline flex-1 text-center">
          {labels.open}
        </Link>
      </div>
    </article>
  )
}
