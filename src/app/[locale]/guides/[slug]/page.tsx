import GuidePage from '@/app/guides/[slug]/page'

export default function LocaleGuidePage({ params }: { params: { slug: string } }) {
  return <GuidePage params={{ slug: params.slug }} />
}