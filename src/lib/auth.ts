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

/**
 * Get all valid users: { username: password }
 * Supports three env var formats (checked in order):
 *   1. DASHBOARD_USERS = JSON string e.g. '{"joe":"pass1","sarah":"pass2"}'
 *   2. DASHBOARD_PASSWORD (Joe's password, username defaults to "joe")
 *   3. DASHBOARD_PASSWORD + DASHBOARD_PASSWORD2 (Joe + Sarah legacy format)
 */
function getUsers(): Record<string, string> {
  const fromJson = process.env.DASHBOARD_USERS
  if (fromJson) {
    try { return JSON.parse(fromJson) } catch { /* fall through */ }
  }
  const users: Record<string, string> = {}
  const joeUser = process.env.DASHBOARD_USER || 'joe'
  const joePass = process.env.DASHBOARD_PASSWORD || ''
  if (joePass) users[joeUser] = joePass
  const sarahUser = process.env.DASHBOARD_USER2 || 'sarah'
  const sarahPass = process.env.DASHBOARD_PASSWORD2 || ''
  if (sarahPass) users[sarahUser] = sarahPass
  return users
}

/**
 * Verify a password against all configured users.
 * Returns the matched username, or null if no match.
 * Constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(candidate: string): string | null {
  const users = getUsers()
  for (const [username, password] of Object.entries(users)) {
    if (!password || candidate.length !== password.length) continue
    try {
      if (timingSafeEqual(Buffer.from(candidate), Buffer.from(password))) {
        return username
      }
    } catch { continue }
  }
  return null
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
