export const LOCALES = ['en', 'zh', 'ko', 'vi'] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어',
  vi: 'Tiếng Việt',
}

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}
