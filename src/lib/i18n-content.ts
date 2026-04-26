import type { AppLocale } from '@/i18n/locales'

export type FallbackReason = 'native' | 'fallback'

export interface LocalizedField {
  value: string
  reason: FallbackReason
  /** Set when the value came from the English fallback. */
  originalLocale?: 'en'
}

const PER_LOCALE_SUFFIX: Record<Exclude<AppLocale, 'en'>, string> = {
  zh: '_zh',
  ko: '_ko',
  vi: '_vi',
}

/**
 * Pick a per-locale field from a row (e.g. `title_zh`), falling back to the
 * base English column when the localized value is missing or empty.
 *
 * Returns `{ value, reason }` so the caller can render an
 * "Original in English" badge when reason === 'fallback'.
 */
export function pickLocalizedField(
  row: object,
  baseKey: string,
  locale: AppLocale
): LocalizedField {
  const indexable = row as Record<string, unknown>
  const baseRaw = indexable[baseKey]
  const base = typeof baseRaw === 'string' ? baseRaw.trim() : ''

  if (locale === 'en') {
    return { value: base, reason: 'native' }
  }

  const suffix = PER_LOCALE_SUFFIX[locale]
  const localizedRaw = indexable[`${baseKey}${suffix}`]
  const localized = typeof localizedRaw === 'string' ? localizedRaw.trim() : ''

  if (localized.length > 0) {
    return { value: localized, reason: 'native' }
  }
  return { value: base, reason: 'fallback', originalLocale: 'en' }
}
