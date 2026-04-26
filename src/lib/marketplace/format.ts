import { type AppLocale } from '@/i18n/locales'

const localeMap: Record<AppLocale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ko: 'ko-KR',
  vi: 'vi-VN',
}

export function formatCurrency(value: number | null | undefined, locale: AppLocale = 'en'): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyRange(
  min: number | null | undefined,
  max: number | null | undefined,
  locale: AppLocale = 'en',
): string {
  if (min == null && max == null) return '—'
  if (min != null && max != null) return `${formatCurrency(min, locale)} – ${formatCurrency(max, locale)}`
  if (min != null) return `${formatCurrency(min, locale)}+`
  return `≤ ${formatCurrency(max, locale)}`
}

export function formatNumber(value: number | null | undefined, locale: AppLocale = 'en'): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat(localeMap[locale]).format(value)
}

export function formatDate(value: string | Date | null | undefined, locale: AppLocale = 'en'): string {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatRelative(value: string | Date | null | undefined, locale: AppLocale = 'en'): string {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  const diffMs = Date.now() - date.getTime()
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  const rtf = new Intl.RelativeTimeFormat(localeMap[locale], { numeric: 'auto' })
  if (diffMs < hour) return rtf.format(-Math.round(diffMs / minute), 'minute')
  if (diffMs < day) return rtf.format(-Math.round(diffMs / hour), 'hour')
  if (diffMs < 30 * day) return rtf.format(-Math.round(diffMs / day), 'day')
  return formatDate(date, locale)
}
