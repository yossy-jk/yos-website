import { LEASE_REVIEW_MESSAGES as RISK_MESSAGES, assessLeaseAnswers as getRisk } from '@/lib/lease-review'
import { readLeaseRequest, LeaseRequestError } from "@/lib/lease-request"
import { enquirySubmissionId } from '@/lib/enquiry-delivery'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { enquiryResponse } from '@/lib/enquiry-delivery'

const htmlText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const RISK_LABELS: Record<string, string> = {
  high: 'HIGHER REVIEW PRIORITY',
  medium: 'REVIEW PRIORITY',
  low: 'FEWER REVIEW FLAGS',
}

export async function POST(req: Request) {
  try {
    const { raw: body, attachment } = await readLeaseRequest(req)
    body.submissionId = enquirySubmissionId(body.submissionId)
    const { firstname, email, answers } = body

    if (!firstname || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const risk = answers && typeof answers === 'object' && !Array.isArray(answers) ? getRisk(answers as Record<string, string>) : null

    const delivery = await enquiryResponse(new Request(req.url, { method: 'POST', headers: req.headers,
      body: JSON.stringify({ firstname, email, company: body.company, phone: body.phone, source: 'Lease risk check', details: { answers, risk }, submissionId: body.submissionId }) }), undefined, attachment)
    if (!delivery.ok) return delivery
    if (process.env.VERCEL_ENV === 'preview') return NextResponse.json({ ok: true, preview: true })

    // 2. Send confirmation email via Resend
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && risk) {
      const resend = new Resend(apiKey)
      const riskLabel = RISK_LABELS[risk.level] || 'ASSESSED'
      const riskMessage = RISK_MESSAGES[risk.level] || ''
      const topIssues = risk.issues.slice(0, 5)

      const riskColour = risk.level === 'high' ? '#b91c1c' : risk.level === 'medium' ? '#92400e' : '#047857'

      const issuesHtml = topIssues.length > 0
        ? topIssues.map(i => `<li style="padding: 6px 0; color: #444; font-size: 14px; line-height: 1.6;">${htmlText(i)}</li>`).join('')
        : '<li style="padding: 6px 0; color: #444; font-size: 14px;">Fewer answers triggered the questionnaire flags; this is not confirmation that the lease is free of risks.</li>'

      const delivered = await resend.emails.send({
        from: 'YOS LeaseIntel <notifications@yourofficespace.au>',
        to: String(email).slice(0, 200),
        replyTo: 'jk@yourofficespace.au',
        subject: `Your lease questionnaire summary: ${riskLabel}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
            <div style="background: #0A0A0A; padding: 24px; margin-bottom: 28px;">
              <p style="color: #00B5A5; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 6px; font-weight: 600;">Your Office Space – LeaseIntel</p>
              <p style="color: white; font-weight: 800; font-size: 20px; margin: 0; text-transform: uppercase;">Your Lease Questionnaire Summary</p>
            </div>

            <p style="color: #333; font-size: 15px; margin: 0 0 20px;">Hi ${htmlText(String(firstname).slice(0, 200))},</p>
            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
              Here is the summary of your 10 questionnaire answers. It does not read or interpret your lease, including any attached document. Ask a commercial property solicitor to review the actual terms.
            </p>

            <div style="background: ${riskColour}15; border: 1px solid ${riskColour}40; padding: 20px 24px; margin-bottom: 28px;">
              <p style="color: ${riskColour}; font-weight: 800; font-size: 18px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">${riskLabel}</p>
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0;">${riskMessage}</p>
            </div>

            <div style="margin-bottom: 28px;">
              <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                <div style="text-align: center; padding: 16px 24px; background: #fef2f2; border: 1px solid #fecaca;">
                  <p style="font-size: 28px; font-weight: 800; color: #ef4444; margin: 0 0 4px;">${risk.high}</p>
                  <p style="font-size: 11px; color: #999; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Higher review<br>flags</p>
                </div>
                <div style="text-align: center; padding: 16px 24px; background: #fffbeb; border: 1px solid #fde68a;">
                  <p style="font-size: 28px; font-weight: 800; color: #f59e0b; margin: 0 0 4px;">${risk.medium}</p>
                  <p style="font-size: 11px; color: #999; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Moderate<br>concerns</p>
                </div>
              </div>
            </div>

            ${topIssues.length > 0 ? `
            <div style="margin-bottom: 28px;">
              <p style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; font-weight: 600;">Answers to discuss with your advisers</p>
              <ul style="margin: 0; padding: 0 0 0 16px; border-left: 3px solid ${riskColour};">
                ${issuesHtml}
              </ul>
            </div>
            ` : ''}

            <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 20px 24px; margin-bottom: 28px;">
              <p style="color: #0f766e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Want the full picture?</p>
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
                Start a free Lease Health Check to discuss lease dates, commercial costs and your next decision. Attaching your lease is optional; further advisory work is scoped separately.
              </p>
              <a href="https://www.yourofficespace.au/lease-health-check" style="display: inline-block; background: #00B5A5; color: white; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; text-decoration: none;">Start your Health Check →</a>
            </div>

            <p style="color: #aaa; font-size: 11px; margin: 0;">
              Joseph Kelley – Your Office Space, Newcastle NSW<br>
              <a href="https://www.yourofficespace.au" style="color: #00B5A5; text-decoration: none;">yourofficespace.au</a>
            </p>
          </div>
        `,
      }, { idempotencyKey: `${body.submissionId}-risk-client` })
      if (delivered.error || !delivered.data?.id) return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Lease risk capture route error:', msg)
    return NextResponse.json({ error: err instanceof LeaseRequestError ? err.message : 'We could not confirm delivery. Please retry.' }, { status: err instanceof LeaseRequestError ? err.status : 502 })
  }
}
