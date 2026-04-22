import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      resend: !!process.env.RESEND_API_KEY,
      hubspot: !!process.env.HUBSPOT_TOKEN,
      upstash: !!process.env.UPSTASH_REDIS_REST_URL,
    }
  })
}
