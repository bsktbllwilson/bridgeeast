export const appLocales = ['en', 'zh', 'ko', 'vi'] as const

export type AppLocale = (typeof appLocales)[number]

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale)
}

export function getLocaleFromPathname(pathname: string | null | undefined): AppLocale {
  if (!pathname) {
    return 'en'
  }

  const segment = pathname.split('/').filter(Boolean)[0]
  return segment && isAppLocale(segment) ? segment : 'en'
}

export function localizePath(pathname: string | null | undefined, locale: AppLocale) {
  if (!pathname || pathname === '/') {
    return `/${locale}`
  }

  const segments = pathname.split('/').filter(Boolean)

  if (segments.length > 0 && isAppLocale(segments[0])) {
    segments[0] = locale
    return `/${segments.join('/')}`
  }

  return `/${locale}/${segments.join('/')}`
}

const localeRotation: AppLocale[] = ['en', 'zh', 'ko', 'vi']

export function getOppositeLocale(locale: AppLocale): AppLocale {
  const index = localeRotation.indexOf(locale)
  const next = localeRotation[(index + 1) % localeRotation.length]
  return next ?? 'en'
}

export const localeLabels: Record<AppLocale, string> = {
  en: 'EN',
  zh: '简',
  ko: '한',
  vi: 'VI',
}

export const localeNames: Record<AppLocale, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어',
  vi: 'Tiếng Việt',
}
