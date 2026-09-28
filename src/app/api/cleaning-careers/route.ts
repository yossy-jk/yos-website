/**
 * POST /api/cleaning-careers
 * Handles three types of expressions of interest for YOS:
 *   - Cleaning employee / contractor applications → Sarah + CC Joe
 *   - Commission-only sales partner applications → Joe + CC Sarah
 *
 * Sends notification email via Resend.
 * Creates a HubSpot contact with all relevant details.
 */

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO_JOE    = 'jk@yourofficespace.au'
const TO_SARAH  = 'sarah.kelley@yourofficespace.au'
const CC_SARAH  = 'sarah.kelley@yourofficespace.au'
const CC_JOE    = 'jk@yourofficespace.au'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Honeypot
    if (body._honey) return NextResponse.json({ ok: true })

    // ── Destructuring ──────────────────────────────────────────────────
    const {
      // Common
      type,             // 'employee' | 'contractor' | 'sales-partner'
      name, email, phone, suburb,
      experience,        // comma-separated
      yearsExp,
      availability,
      message,
      howHeard,
      // Contractor only
      abn, businessName,
      plInsurer, plPolicyNumber, plExpiry, plAmount,
      wcInsurer, wcPolicyNumber, wcExpiry,
      policeCheck,
      // Sales partner only
      currentRole,
      commissionExpectation,
      sellingApproach,
      channels,
      industries,
      referralSource,
    } = body

    if (!name || !email || !phone || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const isSalesPartner = type === 'sales-partner'
    const isContractor   = type === 'contractor'

    const safeName             = esc(String(name).slice(0, 200))
    const safeEmail            = esc(String(email).slice(0, 200))
    const safePhone            = esc(String(phone).slice(0, 50))
    const safeSuburb           = suburb ? esc(String(suburb).slice(0, 100)) : ''
    const safeType             = isSalesPartner ? 'Sales Partner' : (isContractor ? 'Contractor' : 'Employee')
    const safeExp             = experience ? esc(String(experience)) : ''
    const safeMessage          = message ? esc(String(message).slice(0, 2000)) : ''
    const safeHowHeard         = howHeard ? esc(String(howHeard)) : ''
    const safeYears            = yearsExp ? esc(String(yearsExp)) : ''
    const safeAvail            = availability ? esc(String(availability)) : ''
    const safeCurrentRole      = currentRole ? esc(String(currentRole).slice(0, 200)) : ''
    const safeCommissionExp    = commissionExpectation ? esc(String(commissionExpectation)) : ''
    const safeSellingApproach  = sellingApproach ? esc(String(sellingApproach).slice(0, 2000)) : ''
    const safeChannels         = channels ? esc(String(channels)) : ''
    const safeIndustries       = industries ? esc(String(industries)) : ''
    const safeReferralSource   = referralSource ? esc(String(referralSource)) : ''

    // ── Email routing ───────────────────────────────────────────────────
    const recipient = isSalesPartner ? TO_JOE : TO_SARAH
    const ccEmail   = isSalesPartner ? CC_SARAH : CC_JOE

    // ── Contractor section ───────────────────────────────────────────────
    const contractorSection = isContractor ? `
      <tr><td colspan="2" style="padding:1rem 0 0.5rem;font-weight:700;color:#00B5A5;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;border-top:1px solid #eee">Contractor Details</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem;width:180px">ABN</td><td style="font-size:0.85rem">${esc(String(abn || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Business name</td><td style="font-size:0.85rem">${esc(String(businessName || '—'))}</td></tr>
      <tr><td colspan="2" style="padding:0.75rem 0 0.25rem;color:#999;font-size:0.8rem;font-weight:600">Public Liability Insurance</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Insurer</td><td style="font-size:0.85rem">${esc(String(plInsurer || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Policy number</td><td style="font-size:0.85rem">${esc(String(plPolicyNumber || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Expiry</td><td style="font-size:0.85rem">${esc(String(plExpiry || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Cover amount</td><td style="font-size:0.85rem">${esc(String(plAmount || '—'))}</td></tr>
      <tr><td colspan="2" style="padding:0.75rem 0 0.25rem;color:#999;font-size:0.8rem;font-weight:600">Workers Compensation / Personal Accident</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Insurer</td><td style="font-size:0.85rem">${esc(String(wcInsurer || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Policy number</td><td style="font-size:0.85rem">${esc(String(wcPolicyNumber || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Expiry</td><td style="font-size:0.85rem">${esc(String(wcExpiry || '—'))}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Police check</td><td style="font-size:0.85rem">${esc(String(policeCheck || '—'))}</td></tr>
    ` : ''

    // ── Sales partner section ───────────────────────────────────────────
    const salesPartnerSection = isSalesPartner ? `
      <tr><td colspan="2" style="padding:0.75rem 0 0.5rem;font-weight:700;color:#00B5A5;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;border-top:1px solid #eee">Sales Background</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem;width:180px">Current role</td><td style="font-size:0.85rem">${safeCurrentRole || '—'}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Sales experience</td><td style="font-size:0.85rem">${safeYears || '—'}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Commission expectation</td><td style="font-size:0.85rem">${safeCommissionExp || '—'}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">How they sell</td><td style="font-size:0.85rem">${safeChannels || '—'}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Industry background</td><td style="font-size:0.85rem">${safeIndustries || '—'}</td></tr>
      ${safeSellingApproach ? `
      <tr><td colspan="2" style="padding:0.75rem 0 0.25rem;font-weight:600;color:#999;font-size:0.8rem">Their approach</td></tr>
      <tr><td colspan="2" style="font-size:0.85rem;line-height:1.6;color:#333">${safeSellingApproach}</td></tr>
      ` : ''}
      ${safeReferralSource ? `
      <tr><td style="padding:0.75rem 1rem 0 0;color:#999;font-size:0.8rem">How they heard about us</td><td style="font-size:0.8rem;color:#666;padding-top:0.75rem">${safeReferralSource}</td></tr>
      ` : ''}
    ` : ''

    // ── Cleaning experience rows (hidden for sales-partner) ─────────────
    const cleaningExpRows = !isSalesPartner ? `
      <tr><td colspan="2" style="padding:0.75rem 0 0.5rem;font-weight:700;color:#00B5A5;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;border-top:1px solid #eee">Experience</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Specialisations</td><td style="font-size:0.85rem">${safeExp || '—'}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Years experience</td><td style="font-size:0.85rem">${safeYears || '—'}</td></tr>
      <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Availability</td><td style="font-size:0.85rem">${safeAvail || '—'}</td></tr>
    ` : ''

    // ── Assemble HTML ─────────────────────────────────────────────────────
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a1a1a;padding:1.5rem 2rem;margin-bottom:1.5rem">
          <p style="color:#00B5A5;font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 0.4rem;font-weight:700">
            YOS ${isSalesPartner ? 'Sales Partner' : 'Cleaning'}
          </p>
          <h1 style="color:white;margin:0;font-size:1.35rem;font-weight:900">New ${safeType} Application</h1>
        </div>
        <div style="padding:0 2rem 2rem">
          <table style="width:100%;border-collapse:collapse">
            <tr><td colspan="2" style="padding:0 0 0.5rem;font-weight:700;color:#00B5A5;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em">Applicant</td></tr>
            <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem;width:180px">Name</td><td style="font-size:0.85rem;font-weight:600">${safeName}</td></tr>
            <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Email</td><td style="font-size:0.85rem"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Phone</td><td style="font-size:0.85rem"><a href="tel:${safePhone}">${safePhone}</a></td></tr>
            <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Suburb</td><td style="font-size:0.85rem">${safeSuburb || '—'}</td></tr>
            <tr><td style="padding:0.3rem 1rem 0.3rem 0;color:#666;font-size:0.85rem">Application type</td><td style="font-size:0.85rem;font-weight:700;color:${isContractor ? '#7c3aed' : '#00B5A5'}">${safeType}</td></tr>
            ${cleaningExpRows}
            ${contractorSection}
            ${salesPartnerSection}
            ${safeMessage ? `
            <tr><td colspan="2" style="padding:0.75rem 0 0.5rem;font-weight:700;color:#00B5A5;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;border-top:1px solid #eee">Additional notes</td></tr>
            <tr><td colspan="2" style="font-size:0.85rem;line-height:1.6;color:#333">${safeMessage}</td></tr>
            ` : ''}
          </table>
        </div>
        <div style="background:#f9fafb;padding:1rem 2rem;border-top:1px solid #eee">
          <p style="color:#999;font-size:0.75rem;margin:0">Submitted via yourofficespace.au/cleaning/work-with-us</p>
        </div>
      </div>
    `

    // ── Send email via Resend ─────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: isSalesPartner
          ? 'YOS Sales <jk@yourofficespace.au>'
          : 'YOS Website <notifications@yourofficespace.au>',
        to: recipient,
        cc: ccEmail,
        replyTo: safeEmail,
        subject: isSalesPartner
          ? `Sales Partner application — ${safeName}${safeSuburb ? ` (${safeSuburb})` : ''}`
          : `Cleaning ${safeType} application — ${safeName}${safeSuburb ? ` (${safeSuburb})` : ''}`,
        html,
      })
    }

    // ── Create HubSpot contact ────────────────────────────────────────────
    const hubspotToken = process.env.HUBSPOT_TOKEN
    if (hubspotToken) {
      try {
        if (isSalesPartner) {
          const notes = [
            `Application type: ${safeType}`,
            `Current role: ${safeCurrentRole}`,
            `Sales experience: ${safeYears}`,
            `Commission expectation: ${safeCommissionExp}`,
            `How they sell: ${safeChannels}`,
            `Industry background: ${safeIndustries}`,
            safeSellingApproach ? `Their approach: ${safeSellingApproach}` : '',
            safeReferralSource ? `Referral source: ${safeReferralSource}` : '',
          ].filter(Boolean).join('\n')

          await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${hubspotToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              properties: {
                firstname: name.split(' ')[0],
                lastname: name.split(' ').slice(1).join(' ') || '',
                email,
                phone,
                city: suburb || '',
                hs_lead_status: 'NEW',
                lifecyclestage: 'lead',
                lead_type: 'Sales Partner Application',
                hs_content_membership_notes: notes,
              },
            }),
          })
        } else {
          const expArray = safeExp ? safeExp.split(',').map((s: string) => s.trim()).join('; ') : ''
          const notes = [
            `Application type: ${safeType}`,
            `Experience: ${expArray}`,
            `Years: ${safeYears}`,
            `Availability: ${safeAvail}`,
            isContractor ? `ABN: ${abn || '—'} | Business: ${businessName || '—'}` : '',
            isContractor ? `PL: ${plInsurer || '—'} #${plPolicyNumber || '—'} exp ${plExpiry || '—'} $${plAmount || '—'}` : '',
            isContractor ? `WC: ${wcInsurer || '—'} #${wcPolicyNumber || '—'} exp ${wcExpiry || '—'}` : '',
            safeMessage ? `Notes: ${safeMessage}` : '',
          ].filter(Boolean).join('\n')

          await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${hubspotToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              properties: {
                firstname: name.split(' ')[0],
                lastname: name.split(' ').slice(1).join(' ') || '',
                email,
                phone,
                city: suburb || '',
                hs_lead_status: 'NEW',
                lifecyclestage: 'lead',
                lead_type: `Cleaning ${safeType} Application`,
                hs_content_membership_notes: notes,
              },
            }),
          })
        }
      } catch (hsErr) {
        console.warn('HubSpot contact creation failed:', hsErr)
        // Non-fatal — email already sent
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Careers form error:', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}