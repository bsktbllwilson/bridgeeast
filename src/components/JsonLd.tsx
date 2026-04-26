interface Props {
  data: Record<string, unknown>
}

/**
 * Inline JSON-LD script tag. Used for SEO structured data
 * (BlogPosting on /playbook/[slug], Product on listing detail).
 */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
