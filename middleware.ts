/**
 * YOS Dashboard Middleware — auth-v2 session verification.
 * Protects /dashboard/* (except /dashboard/login) from unauthenticated access.
 * Token format: base64url(exp|id|email|role|scopes|clients).hmac
 * Separator: '|' (guaranteed not in email addresses)
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME   = 'yos_dash_session_v2'
const COOKIE_SECRET = process.env.AUTH_COOKIE_SECRET || ''
const FIELD_SEP     = '|'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow login page and static assets
  if (
    pathname.startsWith('/dashboard/login') ||
    pathname.startsWith('/_next')           ||
    pathname.startsWith('/favicon')         ||
    pathname === '/dashboard'
  ) {
    return NextResponse.next()
  }

  // Protect /dashboard/* routes
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  // No secret = fail closed
  if (!COOKIE_SECRET) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  // Verify: payload.mac
  const dotIdx = token.lastIndexOf('.')
  if (dotIdx < 1) return NextResponse.redirect(new URL('/dashboard/login', req.url))
  const payload = token.slice(0, dotIdx)
  const mac     = token.slice(dotIdx + 1)

  const expectedMac = createHmac('sha256', COOKIE_SECRET)
    .update(payload)
    .digest('base64url')

  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(expectedMac))) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  // Check expiry — first field in payload
  const firstField = payload.split(FIELD_SEP)[0]
  const exp = Number(firstField)
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
}