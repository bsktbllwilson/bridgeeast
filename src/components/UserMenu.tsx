'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { signOutAction } from '@/lib/auth-actions'
import { localizePath, type AppLocale } from '@/i18n/locales'

interface Props {
  locale: AppLocale
}

function initialFor(user: User): string {
  const meta = user.user_metadata as { full_name?: string } | null | undefined
  const candidate = meta?.full_name?.trim()?.[0] ?? user.email?.[0] ?? '?'
  return candidate.toUpperCase()
}

export function UserMenu({ locale }: Props) {
  const t = useTranslations('pages.userMenu')
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null
    try {
      supabase = createSupabaseBrowserClient()
    } catch {
      setReady(true)
      return
    }

    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data.user ?? null)
      setReady(true)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  if (!ready) {
    return <div className="w-9 h-9" aria-hidden />
  }

  if (!user) {
    return (
      <Link
        href={localizePath('/sign-in', locale)}
        className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-gray-700 hover:border-accent hover:text-accent transition-colors"
      >
        {t('signIn')}
      </Link>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-playbook-yellow text-black font-display font-bold flex items-center justify-center hover:brightness-95 transition"
      >
        {initialFor(user)}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-black/5">
            <p className="text-xs text-gray-500">{t('signedInAs')}</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
          <Link
            href={localizePath('/account', locale)}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            {t('account')}
          </Link>
          <Link
            href={localizePath('/account?tab=listings', locale)}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            {t('myListings')}
          </Link>
          <Link
            href={localizePath('/verify', locale)}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            {t('verification')}
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-t border-black/5"
            >
              {t('signOut')}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
