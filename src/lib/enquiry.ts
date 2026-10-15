/** Browser transport for YOS inbox delivery. No CRM credentials or vendor SDK. */
export interface LeadPayload {
  firstname: string; email: string; source: string; context?: string; marketingConsent?: boolean
}
const ids = new Map<string, { id: string; submittedAt: string }>()
export async function postEnquiry(endpoint: string, payload: Record<string, unknown>): Promise<Response> {
  const key = JSON.stringify({ endpoint, payload })
  if (!ids.has(key)) {
    if (ids.size >= 100) ids.delete(ids.keys().next().value!)
    ids.set(key, { id: crypto.randomUUID(), submittedAt: new Date().toISOString() })
  }
  return fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, submissionId: ids.get(key)!.id, submittedAt: ids.get(key)!.submittedAt }),
  })
}
export async function sendEnquiry(payload: Record<string, unknown>): Promise<{ ok: boolean; preview?: boolean }> {
  try {
    const response = await postEnquiry('/api/enquiry', payload)
    const data = await response.json()
    return { ok: response.ok && data.ok === true, preview: data.preview === true }
  } catch { return { ok: false } }
}
export async function submitLead(payload: LeadPayload) {
  if (!payload.email || payload.email.includes('@yos.placeholder')) return { ok: false }
  return sendEnquiry({ ...payload })
}
