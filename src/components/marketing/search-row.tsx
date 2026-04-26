import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const INDUSTRIES = [
  { value: '', label: 'All Industries' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'catering', label: 'Catering' },
] as const

export function SearchRow({
  defaultQ = '',
  defaultIndustry = '',
  className,
  buttonLabel = 'Find A Seat',
  placeholder = 'City, State',
}: {
  defaultQ?: string
  defaultIndustry?: string
  className?: string
  buttonLabel?: string
  placeholder?: string
}) {
  return (
    <form
      action="/buy"
      method="get"
      className={cn('w-full max-w-3xl', className)}
      aria-label="Search listings"
    >
      <div className="flex w-full flex-col gap-2 rounded-3xl border border-brand-border bg-white p-2 shadow-sm md:flex-row md:items-center md:gap-0 md:rounded-full">
        <input
          type="text"
          name="q"
          defaultValue={defaultQ}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-12 flex-1 rounded-full bg-transparent px-5 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none md:border-r md:border-brand-border/60"
        />
        <select
          name="industry"
          aria-label="Industry"
          defaultValue={defaultIndustry}
          className="h-12 flex-1 appearance-none rounded-full bg-transparent px-5 pr-10 text-base text-brand-ink focus:outline-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '14px 14px',
          }}
        >
          {INDUSTRIES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary" arrow className="w-full md:w-auto">
          {buttonLabel}
        </Button>
      </div>
    </form>
  )
}
