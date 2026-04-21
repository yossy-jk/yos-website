/**
 * YOS HubSpot Lead Capture
 *
 * Posts to the server-side /api/hubspot route which holds the private token.
 * No HubSpot credentials are ever exposed to the browser.
 */

export interface LeadPayload {
  firstname: string
  email: string
  source: string
  context?: string
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  // Skip fake placeholder emails (FurniturePopup/BookingCTA phone-only flows)
  if (!payload.email || payload.email.includes('@yos.placeholder')) {
    return { ok: false }
  }

  try {
    const res = await fetch('/api/hubspot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return { ok: res.ok }
  } catch {
    return { ok: false }
  }
}
