/**
 * POST /api/auth/logout
 * Clears session cookie.
 */
import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  return clearSessionCookie(response)
}
