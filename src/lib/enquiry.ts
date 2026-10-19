/** Browser transport for YOS inbox delivery. No CRM credentials or vendor SDK. */
export interface LeadPayload {
  firstname: string; email: string; source: string; context?: string; marketingConsent?: boolean
}
const ids = new Map<string, { id: string; submittedAt: string }>()
export async function postEnquiry(endpoint: string, payload: Record<string, unknown>, attachment?: File, attachmentField: 'lease' | 'attachment' = 'lease'): Promise<Response> {
  const digest = attachment ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await attachment.arrayBuffer()))).map(n => n.toString(16).padStart(2, '0')).join('') : ''
  const candidate = typeof window !== 'undefined' ? window.location.pathname : ''
  const enquiryPage = /^\/(?:$|[a-z0-9/-]+$)/.test(candidate) && !/^\/(?:api|dashboard)(?:\/|$)/.test(candidate) && !/^\/tenant-rep\/(?:brief|payment)(?:\/|$)/.test(candidate) ? candidate : undefined
  const key = JSON.stringify({ endpoint, payload, enquiryPage, attachmentField, attachment: attachment ? { name: attachment.name, digest } : null })
  if (!ids.has(key)) {
    if (ids.size >= 100) ids.delete(ids.keys().next().value!)
    ids.set(key, { id: crypto.randomUUID(), submittedAt: new Date().toISOString() })
  }
  const data = { ...payload, enquiryPage, submissionId: ids.get(key)!.id, submittedAt: ids.get(key)!.submittedAt }
  if (attachment) {
    const form = new FormData()
    form.set('payload', JSON.stringify(data)); form.set(attachmentField, attachment)
    return fetch(endpoint, { method: 'POST', body: form })
  }
  return fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}
export async function sendEnquiry(payload: Record<string, unknown>): Promise<{ ok: boolean; preview?: boolean; reference?: string }> {
  try {
    const response = await postEnquiry('/api/enquiry', payload)
    const data = await response.json()
    return { ok: response.ok && data.ok === true, preview: data.preview === true, reference: typeof data.reference === 'string' ? data.reference : undefined }
  } catch { return { ok: false } }
}
export async function submitLead(payload: LeadPayload) {
  if (!payload.email || payload.email.includes('@yos.placeholder')) return { ok: false }
  return sendEnquiry({ ...payload })
}
