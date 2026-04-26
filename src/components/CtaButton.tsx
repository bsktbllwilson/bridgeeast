import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type CtaVariant = 'primary' | 'outline' | 'light'

interface CtaButtonProps {
  href: string
  children: React.ReactNode
  variant?: CtaVariant
  className?: string
}

const variantClasses: Record<CtaVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border-2 border-gray-950 bg-white text-gray-950 hover:bg-gray-950 hover:text-white',
  light: 'bg-white text-gray-950 hover:bg-stone-100',
}

export function CtaButton({ href, children, variant = 'primary', className = '' }: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center rounded-full px-7 py-3 font-sans text-sm font-semibold not-italic transition-colors duration-300 ${variantClasses[variant]} ${className}`}
    >
      <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-3">
        {children}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="pointer-events-none absolute right-5 h-4 w-4 translate-x-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
  )
}
