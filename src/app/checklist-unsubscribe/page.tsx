import type { Metadata } from 'next'
import TenantShell from '@/components/tenant/TenantShell'
export const metadata: Metadata = { title: 'Checklist email preferences | Your Office Space', robots: { index: false, follow: false }, referrer: 'no-referrer' }
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string; done?: string }> }) {
  const { token, done } = await searchParams
  const valid = token && /^[A-Za-z0-9_-]{32,160}$/.test(token)
  return <TenantShell title="Your checklist email preferences." intro={done === '1' ? 'Your request has been processed. No further checklist follow-ups will be sent for this request.' : 'You can stop the optional checklist follow-up below.'}><section className="tenant-section"><div className="tenant-wrap">{done === '1' ? <p>You can still contact Joe whenever you need help.</p> : valid ? <form action="/api/checklist-unsubscribe" method="post"><input type="hidden" name="token" value={token} /><button className="tenant-button" type="submit">Stop checklist follow-ups</button></form> : <p>Open the unsubscribe link in your email, or reply to Joe at jk@yourofficespace.au.</p>}</div></section></TenantShell>
}
