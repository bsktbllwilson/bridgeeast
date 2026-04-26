'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'

const LEFT_LINKS = [
  { href: '/buy', label: 'Buy Business' },
  { href: '/sell', label: 'Sell Business' },
] as const

const RIGHT_LINKS = [
  { href: '/playbook', label: 'Playbooks' },
  { href: '/about', label: 'Who We Are' },
] as const

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS]

export function Header() {
  const [open, setOpen] = useState(false)

  // Close mobile menu on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full bg-brand-orange text-white">
        <Container className="flex h-full items-center justify-between md:grid md:grid-cols-3">
          <nav className="hidden items-center gap-6 md:flex">
            {LEFT_LINKS.map((link) => (
              <HeaderLink key={link.href} {...link} />
            ))}
          </nav>

          <Link
            href="/"
            className="font-display text-[22px] font-semibold tracking-tight text-white md:justify-self-center"
          >
            PASS THE PLATE
          </Link>

          <nav className="hidden items-center gap-6 md:flex md:justify-self-end">
            {RIGHT_LINKS.map((link) => (
              <HeaderLink key={link.href} {...link} />
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </Container>
      </header>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col bg-brand-orange text-white md:hidden"
        >
          <div className="flex h-16 items-center justify-between px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-display text-[22px] font-semibold tracking-tight"
            >
              PASS THE PLATE
            </Link>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {ALL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  )
}

function HeaderLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-normal text-white/95 transition-opacity hover:opacity-75',
        'underline-offset-4 hover:underline',
      )}
    >
      {label}
    </Link>
  )
}
