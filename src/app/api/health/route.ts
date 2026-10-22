import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Read-only diagnostics. A health check must never send an email.
export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'private, no-store' } })
}
