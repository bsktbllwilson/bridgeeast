import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/20 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream',
  {
    variants: {
      variant: {
        primary: 'bg-brand-orange text-white hover:bg-brand-orange/90',
        secondary: 'bg-brand-ink text-brand-cream hover:bg-brand-ink/90',
        ghost: 'bg-transparent text-brand-ink hover:bg-brand-ink/5',
        outline:
          'border border-brand-ink bg-transparent text-brand-ink hover:bg-brand-ink hover:text-brand-cream',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonStyles> {
  arrow?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, arrow, children, ...props },
  ref,
) {
  return (
    <button ref={ref} className={cn(buttonStyles({ variant, size }), className)} {...props}>
      {children}
      {arrow ? <span aria-hidden="true">→</span> : null}
    </button>
  )
})
