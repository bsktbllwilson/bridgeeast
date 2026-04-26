import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { routing } from '@/i18n/routing'
import { isAppLocale } from '@/i18n/locales'

const intlMiddleware = createMiddleware(routing)

// Path patterns (relative to the locale segment) that require an authed session.
const AUTH_REQUIRED_PATTERNS: RegExp[] = [
  /^\/account(\/.*)?$/,
  /^\/verify(\/.*)?$/,
  /^\/sell\/new$/,
  /^\/admin\/translations(\/.*)?$/,
  /^\/marketplace\/listings\/[^/]+\/inquire$/,
  /^\/marketplace\/listings\/new$/,
  /^\/marketplace\/listings\/[^/]+\/edit$/,
  /^\/marketplace\/inbox(\/.*)?$/,
  /^\/marketplace\/saved$/,
  /^\/marketplace\/buyers\/new$/,
]

function stripLocale(pathname: string): { locale: string; rest: string } {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isAppLocale(segments[0])) {
    return { locale: segments[0], rest: '/' + segments.slice(1).join('/') }
  }
  return { locale: routing.defaultLocale, rest: pathname }
}

function requiresAuth(pathname: string): boolean {
  const { rest } = stripLocale(pathname)
  return AUTH_REQUIRED_PATTERNS.some((pattern) => pattern.test(rest))
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    const locale =
      localeCookie && isAppLocale(localeCookie) ? localeCookie : routing.defaultLocale
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
    return NextResponse.redirect(new URL(`${prefix}/marketplace/browse`, request.url))
  }

  const response = intlMiddleware(request)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return response

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && requiresAuth(pathname)) {
    const { locale } = stripLocale(pathname)
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
    const nextParam = encodeURIComponent(pathname + (request.nextUrl.search ?? ''))
    return NextResponse.redirect(
      new URL(`${prefix}/sign-in?next=${nextParam}`, request.url)
    )
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
