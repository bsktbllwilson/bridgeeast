import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { routing } from '@/i18n/routing'
import { isAppLocale } from '@/i18n/locales'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    const locale = localeCookie && isAppLocale(localeCookie) ? localeCookie : routing.defaultLocale
    const url = new URL(`/${locale}/listings`, request.url)

    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}