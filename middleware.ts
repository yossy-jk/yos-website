/**
 * YOS Dashboard Middleware — auth-v2 session verification.
 * Protects /dashboard/* (except /dashboard/login) from unauthenticated access.
 * Uses Web Crypto API for Edge runtime compatibility.
 * Token format: base64url(exp|id|email|role|scopes|clients).hmac
 * Separator: '|' (guaranteed not in email addresses)
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME   = 'yos_dash_session_v2'
const COOKIE_SECRET = process.env.AUTH_COOKIE_SECRET || ''
const FIELD_SEP     = '|'

/** Edge-compatible HMAC using Web Crypto API */
async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Constant-time string comparison — prevents timing attacks */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export async function middleware(req: NextRequest) {
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

  // Verify: payload.mac  (dot is guaranteed not in base64url)
  const dotIdx = token.lastIndexOf('.')
  if (dotIdx < 1) return NextResponse.redirect(new URL('/dashboard/login', req.url))
  const payload = token.slice(0, dotIdx)
  const mac     = token.slice(dotIdx + 1)

  const expectedMac = await hmacSign(payload, COOKIE_SECRET)
  if (!await timingSafeEqual(mac, expectedMac)) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  // Check expiry — first field in payload (Unix timestamp in seconds)
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