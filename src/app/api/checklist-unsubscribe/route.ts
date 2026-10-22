import { NextResponse } from 'next/server'
import { checklistRedis, checklistUnsubscribeKey, checklistSuppressionKey } from '@/lib/checklist-store'
export const runtime = 'nodejs'
export async function POST(req: Request) {
  try {
    const form = await req.formData(), token = form.get('token')
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{32,160}$/.test(token)) return NextResponse.json({ ok: false }, { status: 400 })
    if (process.env.VERCEL_ENV === 'production') {
      const redis = checklistRedis(), email = await redis.get<string>(checklistUnsubscribeKey(token))
      if (email) await redis.set(checklistSuppressionKey(email), true, { ex: 90 * 86400 })
    }
    return NextResponse.redirect(new URL('/checklist-unsubscribe?done=1', req.url), 303)
  } catch { return NextResponse.json({ ok: false, error: 'Please reply to your email to unsubscribe while we resolve this issue.' }, { status: 502 }) }
}
