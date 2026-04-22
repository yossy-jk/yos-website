import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'No RESEND_API_KEY' })
  }

  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: 'jk@yourofficespace.au',
      subject: 'Health check test — 22 Apr',
      html: '<p>Health check email from /api/health route. Resend is working from production.</p>',
    })
    
    return NextResponse.json({
      ok: true,
      resendId: result.data?.id,
      resendError: result.error,
      env: {
        resend: !!apiKey,
        hubspot: !!process.env.HUBSPOT_TOKEN,
        upstash: !!process.env.UPSTASH_REDIS_REST_URL,
      }
    })
  } catch(e: unknown) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) })
  }
}
