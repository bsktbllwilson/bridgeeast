import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { isAppLocale } from '@/i18n/locales'
import { routing } from '@/i18n/routing'

function safeNext(raw: string | null, locale: string): string {
  if (!raw) return `/${locale}/account`
  try {
    const decoded = decodeURIComponent(raw)
    if (decoded.startsWith('/') && !decoded.startsWith('//')) {
      return decoded
    }
  } catch {
    // fall through
  }
  return `/${locale}/account`
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const nextRaw = url.searchParams.get('next')

  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  const locale =
    localeCookie && isAppLocale(localeCookie) ? localeCookie : routing.defaultLocale
  const next = safeNext(nextRaw, locale)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in?error=missing_env`, url))
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in?error=missing_code`, url))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('exchangeCodeForSession failed', error)
    return NextResponse.redirect(new URL(`/${locale}/sign-in?error=callback_failed`, url))
  }

  return NextResponse.redirect(new URL(next, url))
}
