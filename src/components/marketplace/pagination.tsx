import Link from 'next/link'

import { cn } from '@/lib/utils'

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number
  totalPages: number
  searchParams: Record<string, string | string[] | undefined>
}) {
  if (totalPages <= 1) return null

  const prevHref = page > 1 ? buildHref(searchParams, page - 1) : null
  const nextHref = page < totalPages ? buildHref(searchParams, page + 1) : null

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-between border-t border-brand-border pt-6 text-sm text-brand-ink"
    >
      <PaginationLink href={prevHref} disabled={!prevHref}>
        <span aria-hidden="true">←</span> Previous Page
      </PaginationLink>

      <span className="text-brand-muted" aria-current="page">
        Page {page} of {totalPages}
      </span>

      <PaginationLink href={nextHref} disabled={!nextHref}>
        Next Page <span aria-hidden="true">→</span>
      </PaginationLink>
    </nav>
  )
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string | null
  disabled?: boolean
  children: React.ReactNode
}) {
  const className = cn(
    'inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors',
    disabled
      ? 'cursor-not-allowed text-brand-muted/60'
      : 'hover:bg-brand-ink hover:text-brand-cream',
  )

  if (!href) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    )
  }
  return (
    <Link href={href} className={className} scroll={false}>
      {children}
    </Link>
  )
}

function buildHref(
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page' || value == null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else {
      params.set(key, value)
    }
  }
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `?${qs}` : '?'
}
