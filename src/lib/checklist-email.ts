import { DISCOVERY_BOOKING_URL } from './constants'
import { SERVICE_CHECKLISTS, type ChecklistService } from './service-checklists'
const escape = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const BASE = 'https://www.yourofficespace.au'
function frame(title: string, content: string) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#172321"><table role="presentation" width="100%"><tr><td style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:600px;margin:auto;background:#fff;border-top:6px solid #00b5a5"><tr><td style="padding:28px;background:#172321;color:white"><p style="color:#00b5a5;font-size:12px;letter-spacing:2px">YOUR OFFICE SPACE</p><h1 style="font-size:26px;line-height:1.3">${escape(title)}</h1></td></tr><tr><td style="padding:28px;font-size:16px;line-height:1.7">${content}<p style="margin-top:28px">Joe Kelley<br>Your Office Space<br><a href="mailto:jk@yourofficespace.au">jk@yourofficespace.au</a> · 02 4092 0733</p></td></tr></table></td></tr></table></body></html>`
}
function button(url: string, label: string) { return `<p style="margin:24px 0"><a href="${escape(url)}" style="display:inline-block;padding:14px 20px;background:#007c72;color:white;border-radius:5px;text-decoration:none;font-weight:bold">${escape(label)}</a></p>` }
export function checklistDeliveryEmail(service: ChecklistService) {
  const offer = SERVICE_CHECKLISTS[service], url = BASE + offer.pdf
  return {
    subject: `Your ${offer.label.toLowerCase()} checklist`,
    text: `Here is your free ${offer.title}.\n\nDownload: ${url}\n\nUse the practical checks and tips to clarify your next steps. If you would like to talk through what you are tackling, book a discovery session: ${DISCOVERY_BOOKING_URL}\n\nOr reply to Joe at jk@yourofficespace.au.\n\nReceiving this checklist does not subscribe you to ongoing marketing.\n\nYour Office Space · 02 4092 0733`,
    html: frame('Your checklist is ready.', `<p>Thanks for exploring ${escape(offer.label.toLowerCase())} with YOS.</p><h2 style="font-size:20px">${escape(offer.title)}</h2><p>Use the 12 practical checks and helpful tips to clarify your next steps.</p>${button(url, 'Download your checklist (PDF)')}<p>Want to talk through what you are tackling? <a href="${escape(DISCOVERY_BOOKING_URL)}">Book a discovery session</a> or reply to this email.</p><p style="font-size:13px">Receiving this checklist does not subscribe you to ongoing marketing.</p>`),
  }
}
export function checklistFollowUpEmail(service: ChecklistService, unsubscribeToken: string) {
  if (!/^[A-Za-z0-9_-]{32,160}$/.test(unsubscribeToken)) throw Error('Invalid unsubscribe token')
  const offer = SERVICE_CHECKLISTS[service], unsubscribe = `${BASE}/checklist-unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
  return {
    subject: `Ready to tackle your ${offer.label.toLowerCase()} plans?`,
    text: `I hope the checklist helped you identify your next steps.\n\nIf you would like to talk through what you are looking to tackle, book a short discovery session. We will discuss your priorities and see whether YOS can help.\n\nBook: ${DISCOVERY_BOOKING_URL}\n\nPrefer email? Reply and tell us what you are planning.\n\nJoe Kelley · jk@yourofficespace.au · 02 4092 0733\n\nYou asked for this one follow-up when requesting the checklist. Unsubscribe: ${unsubscribe}`,
    html: frame('Let’s talk through your next step.', `<p>I hope the checklist helped you identify your next steps.</p><p>If you would like to talk through what you are looking to tackle, book a short discovery session. We will discuss your priorities and see whether YOS can help.</p>${button(DISCOVERY_BOOKING_URL, 'Book a discovery session')}<p>Prefer email? Reply and tell us what you are planning.</p><p style="font-size:13px">You asked for this one follow-up when requesting the checklist. <a href="${escape(unsubscribe)}">Unsubscribe from checklist follow-ups</a>.</p>`),
  }
}
export type ChecklistFollowUpRecord = { consent: boolean; deliveredAt: number | null; dueAt: number; status: 'pending' | 'sent' | 'suppressed'; unsubscribed: boolean; enquiryReceived: boolean; paymentReceived: boolean }
/** Used immediately before delivery; elapsed time alone never authorises sending. */
export function checklistFollowUpEligible(record: ChecklistFollowUpRecord, now: number) {
  return record.consent === true && record.deliveredAt !== null && record.status === 'pending' && !record.unsubscribed && !record.enquiryReceived && !record.paymentReceived && Number.isFinite(record.dueAt) && record.dueAt >= record.deliveredAt + 24 * 60 * 60 * 1000 && now >= record.dueAt
}
