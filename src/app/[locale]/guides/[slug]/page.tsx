import { redirect } from 'next/navigation'

import { isAppLocale, localizePath } from '@/i18n/locales'

export default function LocaleGuideRedirect({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = isAppLocale(params.locale) ? params.locale : 'en'
  redirect(localizePath(`/playbook/${params.slug}`, locale))
}
