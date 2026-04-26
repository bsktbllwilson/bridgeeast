import enMessages from '@/messages/en.json'
import koMessages from '@/messages/ko.json'
import viMessages from '@/messages/vi.json'
import zhMessages from '@/messages/zh.json'

import { type AppLocale } from '@/i18n/locales'

const staticMessages = {
  en: enMessages,
  zh: zhMessages,
  ko: koMessages,
  vi: viMessages,
} as const

export function getStaticMessages(locale: AppLocale) {
  return staticMessages[locale]
}
