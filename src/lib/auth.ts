/**
 * YOS Dashboard Authentication
 *
 * Cookie-based session auth. HMAC-signed token in HttpOnly cookie.
 *
 * Environment variables required:
 *   DASHBOARD_PASSWORD     — the password Joe enters at login
 *   AUTH_COOKIE_SECRET     — 64-char hex string used to sign cookies (rotate to invalidate sessions)
 *
 * Usage:
 *   import { requireAuth, verifyPassword, createSession, clearSession } from '@/lib/auth'
 *
 *   In an API route:
 *     const auth = await requireAuth()
 *     if (!auth.ok) return auth.response  // returns 401
 *
 *   In a page:
 *     const auth = await requireAuth()
 *     if (!auth.ok) redirect('/dashboard/login')
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'yos_dash_session'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7  // 7 days

function getCookieSecret(): string {
  const secret = process.env.AUTH_COOKIE_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_COOKIE_SECRET env var missing or too short (need 32+ chars)')
  }
  return secret
}

function getDashboardPassword(): string {
  const pw = process.env.DASHBOARD_PASSWORD
  if (!pw) {
    throw new Error('DASHBOARD_PASSWORD env var not set')
  }
  return pw
}

/** Verify a candidate password against the configured one. Constant-time. */
export function verifyPassword(candidate: string): boolean {
  const expected = getDashboardPassword()
  if (candidate.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected))
  } catch {
    return false
  }
}

/** Build a signed token: `${expiresAt}.${hmac}`. */
function signToken(expiresAt: number): string {
  const secret = getCookieSecret()
  const mac = createHmac('sha256', secret).update(String(expiresAt)).digest('hex')
  return `${expiresAt}.${mac}`
}

/** Verify a signed token. Returns true if valid and unexpired. */
function verifyToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [expStr, mac] = parts
  const expiresAt = Number(expStr)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() / 1000) return false

  const expected = createHmac('sha256', getCookieSecret()).update(String(expiresAt)).digest('hex')
  if (mac.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

/** Set the auth cookie on a NextResponse. */
export function setSessionCookie(response: NextResponse): NextResponse {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const token = signToken(expiresAt)
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  })
  return response
}

/** Clear the auth cookie on a NextResponse. */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}

/**
 * Check if the current request has a valid session.
 * Returns { ok: true } if authenticated, otherwise { ok: false, response: 401 }.
 *
 * Use in API routes:
 *   const auth = await requireAuth()
 *   if (!auth.ok) return auth.response
 */
export async function requireAuth(): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  if (!session?.value || !verifyToken(session.value)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { ok: true }
}

/** For page-level checks (Server Components). Returns boolean. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  return !!session?.value && verifyToken(session.value)
}
