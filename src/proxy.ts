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
import { verifySignedSessionToken } from '@/lib/auth-session'

const LEGACY_COOKIE_NAME = 'yos_dash_session'
const V2_COOKIE_NAME = 'yos_dash_session_v2'

/** Verify the legacy HMAC session format retained during the v2 transition. */
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

/** Optimistic verification for the auth-v2 session. API handlers still resolve
 * the user from Redis before returning protected data. */
function verifyV2Token(token: string, secret: string): boolean {
  return Boolean(verifySignedSessionToken(token, secret))
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /dashboard/* (not the login page itself)
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()
  if (pathname.startsWith('/dashboard/login')) return NextResponse.next()

  const secret = process.env.AUTH_COOKIE_SECRET
  if (!secret || secret.length < 32) {
    // Misconfigured — fail closed
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  const legacySession = req.cookies.get(LEGACY_COOKIE_NAME)?.value
  const v2Session = req.cookies.get(V2_COOKIE_NAME)?.value
  const authenticated = Boolean(
    (legacySession && verifyToken(legacySession, secret)) ||
    (v2Session && verifyV2Token(v2Session, secret))
  )
  if (!authenticated) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
