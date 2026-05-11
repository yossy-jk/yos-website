/**
 * YOS dashboard route protection.
 *
 * Protects:
 *   /dashboard/* (excluding /dashboard/login) — redirects to /dashboard/login if unauthenticated
 *
 * API routes are protected at the route handler level via `requireAuth()` from @/lib/auth.
 * We don't protect them in middleware because some routes (health-intake POST) have their
 * own auth scheme that must stay intact.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'yos_dash_session'

/** Inlined token verification — middleware runs on Edge runtime, no Node modules. */
function verifyToken(token: string, secret: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [expStr, mac] = parts
  const expiresAt = Number(expStr)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() / 1000) return false
  const expected = createHmac('sha256', secret).update(String(expiresAt)).digest('hex')
  if (mac.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /dashboard/* (not the login page itself)
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()
  if (pathname.startsWith('/dashboard/login')) return NextResponse.next()

  const secret = process.env.AUTH_COOKIE_SECRET
  if (!secret) {
    // Misconfigured — fail closed
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  const session = req.cookies.get(COOKIE_NAME)?.value
  if (!session || !verifyToken(session, secret)) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
