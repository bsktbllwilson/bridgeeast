import { redirect } from 'next/navigation'

export default function LocalizedHomePage({
  params,
}: {
  params: { locale: string }
}) {
  redirect(`/${params.locale}/listings`)
}