import { redirect } from 'next/navigation'

export default function LocalizedHomePage({
  params,
}: {
  params: { locale: string }
}) {
  const prefix = params.locale === 'en' ? '' : `/${params.locale}`
  redirect(`${prefix}/marketplace/browse`)
}
