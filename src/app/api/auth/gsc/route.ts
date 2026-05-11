/**
 * GET /api/auth/gsc?token=*** → redirects to Google OAuth consent screen
 * One-time setup to get a refresh token for Search Console API
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const CLIENT_ID     = process.env.GSC_CLIENT_ID || ''
const REDIRECT_URI  = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/auth/gsc/callback`
  : 'https://www.yourofficespace.au/api/auth/gsc/callback'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  'https://www.yourofficespace.au/api/auth/gsc/callback',
    response_type: 'code',
    scope:         'https://www.googleapis.com/auth/webmasters.readonly',
    access_type:   'offline',
    prompt:        'consent',
  })

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
