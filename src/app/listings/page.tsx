import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { isAppLocale } from '@/i18n/locales'

export default function ListingsRedirectPage() {
  const localeCookie = cookies().get('NEXT_LOCALE')?.value
  const locale = localeCookie && isAppLocale(localeCookie) ? localeCookie : 'en'

  redirect(`/${locale}/listings`)
}