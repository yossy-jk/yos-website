import { enquiryResponse } from '@/lib/enquiry-delivery'
import { validateAssistantLead } from '@/lib/public-assistant'

export async function POST(req: Request) {
  const headers = { 'Cache-Control': 'private, no-store' }
  if (req.headers.get('origin') !== new URL(req.url).origin) return Response.json({ ok: false, error: 'Please submit from this website.' }, { status: 403, headers })
  const text = await req.text()
  if (text.length > 8000) return Response.json({ ok: false, error: 'Please shorten your enquiry.' }, { status: 413, headers })
  try {
    const raw = JSON.parse(text)
    const lead = validateAssistantLead(raw)
    const response = await enquiryResponse(new Request(req.url, { method: 'POST', headers: req.headers, body: JSON.stringify({ ...lead, source: 'Website assistant follow-up', submissionId: raw.submissionId, submittedAt: raw.submittedAt, enquiryPage: raw.enquiryPage, _honey: raw._honey, details: { contactPermission: true, consentWording: lead.consentWording, summaryReviewedByVisitor: true } }) }))
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch { return Response.json({ ok: false, error: 'Add your name, email, enquiry summary and permission to follow up.' }, { status: 400, headers }) }
}
