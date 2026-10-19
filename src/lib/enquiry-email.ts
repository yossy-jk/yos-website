/** Pure, deterministic rendering shared by every owner enquiry notification. */
export type EnquiryEmail = {
  source: string; name?: string; email?: string; phone?: string; company?: string
  enquiryPage?: string; entryPage?: string; message?: string; details?: unknown; submissionId: string; submittedAt?: string
  marketingConsent?: boolean; attachment?: { filename: string; size: number; label?: string }
  priority?: string; followUpBy?: string
}
type Row = { label: string; value: string }
const labels: Record<string, string> = {
  firstname: 'First name', firstName: 'First name', lastName: 'Last name', abn: 'ABN',
  business: 'Business', mobile: 'Mobile', expiry: 'Lease expiry', area: 'Office area (m²)',
  rent: 'Current rent (as entered)', headcount: 'Current team size', futureHeadcount: 'Future team size',
  intent: 'Next lease decision', heard: 'How they heard about YOS', worries: 'Priorities / concerns',
  referredBusiness: 'Referred business', referredName: 'Referred contact', referredEmail: 'Referred email',
  referredPhone: 'Referred phone', referralPermission: 'Permission to contact referral',
  yearsExp: 'Years of experience', qty: 'Quantity', sqm: 'Area (m²)', makegood: 'Make-good obligations',
  rent_review: 'Rent review method', options: 'Renewal options', assignment: 'Assignment / subletting',
  guarantee: 'Personal guarantee', demolition: 'Demolition clause', solicitor: 'Solicitor review',
  hasAV: 'Audiovisual required', hasKitchen: 'Kitchen required', hasReception: 'Reception required',
  marketingConsent: 'Marketing permission', consentWording: 'Consent wording',
  utm_source: 'Campaign source', utm_medium: 'Campaign medium', utm_campaign: 'Campaign name',
  utm_content: 'Campaign content', landingPage: 'Enquiry page', calculated: 'Estimated results',
  tool: 'Tool used', results: 'Tool inputs', fields: 'Lease details', attribution: 'How they found YOS', enquiryPage: 'Enquiry page', entryPage: 'Service entry page',
}
export const enquiryLabel = (key: string) => labels[key] || key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, c => c.toUpperCase())
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const ignored = new Set(['_honey', 'honeypot', 'submissionId', 'schemaVersion', 'submittedAt', 'submittedSydney'])
function rows(value: unknown, prefix = ''): Row[] {
  if (value === null || value === undefined || value === '') return []
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.flatMap((v, i) => rows(v, `${prefix}${prefix ? ' · ' : ''}${i + 1}`))
    return Object.entries(value).flatMap(([key, v]) => ignored.has(key) ? [] : rows(v, [prefix, enquiryLabel(key)].filter(Boolean).join(' · ')))
  }
  const text = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  return [{ label: prefix || 'Details', value: text }]
}
export function enquirySydneyDate(value?: string): string {
  if (!value || !Number.isFinite(Date.parse(value))) return ''
  return new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(value))
}
export function renderEnquiryEmail(data: EnquiryEmail): { html: string; text: string } {
  const source = data.source.replace(/[\r\n]/g, ' ')
  const contact = rows({ name: data.name, company: data.company, email: data.email, phone: data.phone })
  let message = data.message?.trim() || ''
  let structuredMessage: unknown
  // The tenant emergency delivery path historically sends its fields as JSON.
  if (message.startsWith('{') && message.endsWith('}')) {
    try { structuredMessage = JSON.parse(message); message = '' } catch { /* Keep the original message when it is prose. */ }
  }
  const sections: { title: string; rows: Row[] }[] = [{ title: 'Contact details', rows: contact }]
  if (data.priority || data.followUpBy) sections.push({ title: 'Follow-up', rows: rows({ priority: data.priority, followUpBy: enquirySydneyDate(data.followUpBy) }) })
  if (message) sections.push({ title: 'What they need', rows: [{ label: 'Message', value: message }] })
  const redundant = new Map<string, unknown>([['name', data.name], ['firstname', data.name], ['firstName', data.name], ['email', data.email], ['phone', data.phone], ['mobile', data.phone], ['company', data.company], ['business', data.company], ['source', data.source], ['message', data.message]])
  const uniqueDetails = data.details && typeof data.details === 'object' && !Array.isArray(data.details)
    ? Object.fromEntries(Object.entries(data.details).filter(([key, value]) => !redundant.has(key) || redundant.get(key) !== value)) : data.details
  const details = [...rows(uniqueDetails), ...rows(structuredMessage)]
  if (details.length) sections.push({ title: 'Submission details', rows: details })
  if (data.attachment) sections.splice(1, 0, { title: data.attachment.label || 'Lease attached', rows: [{ label: 'File', value: `${data.attachment.filename} (${Math.ceil(data.attachment.size / 1024)} KB) — attached to this email` }] })
  const meta = rows({ enquiryPage: data.enquiryPage, entryPage: data.entryPage, received: enquirySydneyDate(data.submittedAt), marketingPermission: data.marketingConsent === true ? 'Opted in' : 'Not opted in', reference: data.submissionId })
  const email = data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? data.email : ''
  const phone = data.phone?.replace(/[^+0-9]/g, '') || ''
  const actions = [email ? { text: 'Email prospect', href: `mailto:${encodeURIComponent(email)}` } : null, phone ? { text: 'Call prospect', href: `tel:${phone}` } : null].filter((v): v is { text: string; href: string } => !!v)
  const sectionHtml = sections.filter(s => s.rows.length).map(s => `<tr><td style="padding:24px 24px 0"><h2 style="margin:0 0 12px;font-size:17px;color:#00796D">${escape(s.title)}</h2>${s.rows.map(r => `<p style="margin:0 0 14px;overflow-wrap:anywhere;word-break:break-word"><strong style="display:block;font-size:12px;line-height:20px;color:#555555">${escape(r.label)}</strong><span style="font-size:15px;line-height:23px;white-space:pre-wrap">${escape(r.value)}</span></p>`).join('')}</td></tr>`).join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New YOS enquiry</title></head><body style="margin:0;padding:0;background:#F3F5F5;color:#1A1A1A;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F3F5F5"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#FFFFFF;border-top:6px solid #00B5A5"><tr><td style="padding:26px 24px;background:#1A1A1A;color:#FFFFFF"><p style="margin:0 0 24px;color:#00B5A5;font-size:12px;font-weight:bold;letter-spacing:2px">YOUR OFFICE SPACE</p><p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;color:#FFFFFF">NEW WEBSITE ENQUIRY</p><h1 style="margin:0;font-size:25px;line-height:32px;overflow-wrap:anywhere">${escape(source)}</h1><p style="margin:12px 0 0;font-size:16px;line-height:24px">${escape([data.name, data.company].filter(Boolean).join(' · ') || 'A prospect has contacted YOS')}</p></td></tr><tr><td style="padding:22px 24px 0"><p style="margin:0 0 16px;font-size:14px;line-height:22px">Reply to this email to contact the sender${phone ? ', or use the phone number below' : ''}.</p>${actions.map(a => `<a href="${escape(a.href)}" style="display:inline-block;background:#00796D;color:#FFFFFF;padding:12px 16px;margin:0 8px 8px 0;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold">${escape(a.text)}</a>`).join('')}</td></tr>${sectionHtml}<tr><td style="padding:20px 24px;background:#EEF5F4;border-top:1px solid #DAE5E3"><p style="margin:0 0 8px;font-size:12px;font-weight:bold">YOS WEBSITE • ENQUIRY RECORD</p>${meta.map(r => `<p style="margin:4px 0;font-size:12px;line-height:19px;color:#555555;overflow-wrap:anywhere">${escape(r.label)}: ${escape(r.value)}</p>`).join('')}</td></tr></table></td></tr></table></body></html>`
  const text = [`YOUR OFFICE SPACE | NEW WEBSITE ENQUIRY`, source, ...sections.filter(s => s.rows.length).map(s => `${s.title.toUpperCase()}\n${s.rows.map(r => `${r.label}: ${r.value}`).join('\n')}`), 'Reply to this email to contact the sender.', meta.map(r => `${r.label}: ${r.value}`).join('\n')].join('\n\n')
  return { html, text }
}
