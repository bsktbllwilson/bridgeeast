import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { isAppLocale } from '@/i18n/locales'

export default function LegacyAdminRedirect() {
  const localeCookie = cookies().get('NEXT_LOCALE')?.value
  const locale = localeCookie && isAppLocale(localeCookie) ? localeCookie : 'en'
  const prefix = locale === 'en' ? '' : `/${locale}`
  redirect(`${prefix}/admin`)
}
