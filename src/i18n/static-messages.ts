import enMessages from '@/messages/en.json'
import zhMessages from '@/messages/zh.json'

import { type AppLocale } from '@/i18n/locales'

const staticMessages = {
  en: enMessages,
  zh: zhMessages,
} as const

export function getStaticMessages(locale: AppLocale) {
  return staticMessages[locale]
}