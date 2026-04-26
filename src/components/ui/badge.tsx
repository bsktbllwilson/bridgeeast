import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeStyles = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-brand-ink/5 text-brand-ink',
        orange: 'bg-brand-orange/15 text-brand-orange',
        yellow: 'bg-brand-yellow text-brand-ink',
        cream: 'bg-brand-cream text-brand-ink',
        ink: 'bg-brand-ink text-brand-cream',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeStyles> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
