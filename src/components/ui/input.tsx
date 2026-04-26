import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-12 w-full rounded-full border border-brand-border bg-brand-cream/60 px-6 text-base text-brand-ink placeholder:text-brand-muted',
        'focus:outline-none focus:ring-2 focus:ring-brand-ink/15',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
})
