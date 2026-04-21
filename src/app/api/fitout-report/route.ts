import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { fitoutLimiter, getIp } from '@/lib/ratelimit'

// Lazy-initialised inside handler so build doesn't crash without RESEND_API_KEY
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not configured')
  return new Resend(key)
}

const TEAL = '#00B5A5'
const DARK = '#0A0A0A'
const GREY = '#F9FAFB'
const BORDER = '#E5E7EB'
const MID = '#6B7280'
const BODY = '#374151'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function section(bg: string, content: string, pad = '40px 48px') {
  return `<div style="background:${bg};padding:${pad};">${content}</div>`
}

function divider() {
  return `<div style="height:1px;background:${BORDER};margin:0;"></div>`
}

function label(text: string, color = MID) {
  return `<p style="font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${color};margin-bottom:10px;">${text}</p>`
}

function generateReportHtml(data: {
  name: string
  email: string
  sqm: string
  tier: string
  desks: string
  meetingRooms: string
  hasKitchen: boolean
  hasReception: boolean
  hasAV: boolean
  totalLow: number
  totalHigh: number
  perSqmLow: number
  perSqmHigh: number
  breakdown: { label: string; low: number; high: number }[]
  date: string
}) {
  const inclusions = [
    data.hasKitchen ? 'Kitchen / breakout area' : null,
    data.hasReception ? 'Reception area' : null,
    data.hasAV ? 'AV & integrated technology' : null,
  ].filter(Boolean)

  const breakdownRows = data.breakdown.map((row, i) => {
    const isContingency = row.label.includes('Contingency')
    const isLast = i === data.breakdown.length - 1
    return `<tr>
      <td style="padding:13px 20px;font-size:13px;color:${isContingency ? '#9CA3AF' : BODY};font-style:${isContingency ? 'italic' : 'normal'};border-bottom:${isLast ? 'none' : `1px solid ${BORDER}`};">${row.label}</td>
      <td style="padding:13px 20px;font-size:13px;font-weight:600;color:${isContingency ? '#9CA3AF' : '#111827'};text-align:right;border-bottom:${isLast ? 'none' : `1px solid ${BORDER}`};">${fmt(row.low)} – ${fmt(row.high)}</td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Fitout Cost Estimate + Capability Statement — Your Office Space</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif; background:#F3F4F6; color:${BODY}; }
a { color:${TEAL}; }
</style>
</head>
<body>
<div style="max-width:680px;margin:0 auto;background:white;box-shadow:0 4px 24px rgba(0,0,0,0.08);">


<!-- ═══════════════════════════════════════════
     PAGE 1 — COVER
═══════════════════════════════════════════ -->
<div style="background:${DARK};padding:56px 48px 48px;">
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;">
        <p style="color:${TEAL};font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:16px;">YOUR OFFICE SPACE</p>
        <h1 style="color:white;font-size:36px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.05;margin-bottom:8px;">Fitout Cost<br/>Estimate &amp;<br/>Capability<br/>Statement</h1>
        <p style="color:rgba(255,255,255,0.35);font-size:12px;margin-top:16px;line-height:1.6;">Prepared for ${data.name}<br/>${data.date}</p>
      </td>
      <td style="vertical-align:top;text-align:right;padding-left:24px;">
        <div style="background:${TEAL};padding:8px 16px;display:inline-block;margin-bottom:12px;">
          <p style="color:white;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0;">ESTIMATE RANGE</p>
        </div>
        <p style="color:white;font-size:30px;font-weight:900;line-height:1;margin-bottom:4px;">${fmt(data.totalLow)}</p>
        <p style="color:${TEAL};font-size:16px;font-weight:700;margin-bottom:4px;">to ${fmt(data.totalHigh)}</p>
        <p style="color:rgba(255,255,255,0.3);font-size:10px;">ex GST · 10% contingency included</p>
        <div style="margin-top:24px;border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;">
          <p style="color:rgba(255,255,255,0.4);font-size:10px;margin-bottom:6px;">${data.sqm}m² · ${data.tier} specification</p>
          <p style="color:rgba(255,255,255,0.4);font-size:10px;margin-bottom:6px;">${data.desks} workstations · ${data.meetingRooms} meeting room${parseInt(data.meetingRooms) !== 1 ? 's' : ''}</p>
          ${inclusions.length > 0 ? inclusions.map(i => `<p style="color:rgba(255,255,255,0.4);font-size:10px;margin-bottom:4px;">+ ${i}</p>`).join('') : ''}
        </div>
      </td>
    </tr>
  </table>
</div>

<!-- Teal accent bar -->
<div style="height:4px;background:${TEAL};"></div>

<!-- Intro copy -->
${section(GREY, `
  <p style="font-size:14px;color:${BODY};line-height:1.85;max-width:540px;">
    This document contains two things: a detailed cost estimate for your fitout based on your brief, and a capability overview of Your Office Space — so you know exactly who you'd be working with and what we bring to your project.
  </p>
`)}

${divider()}


<!-- ═══════════════════════════════════════════
     PAGE 2 — YOUR ESTIMATE
═══════════════════════════════════════════ -->

${section('white', `
  ${label('Section 01 — Your Estimate')}
  <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:${DARK};letter-spacing:-0.01em;margin-bottom:6px;">Cost Breakdown</h2>
  <p style="font-size:13px;color:${MID};margin-bottom:28px;">${data.sqm}m² · ${data.tier} · ${data.desks} workstations · ${data.meetingRooms} meeting room${parseInt(data.meetingRooms) !== 1 ? 's' : ''}${inclusions.length > 0 ? ' · ' + inclusions.join(' · ') : ''}</p>

  <table style="width:100%;border-collapse:collapse;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;margin-bottom:16px;">
    <thead>
      <tr style="background:${GREY};">
        <th style="padding:12px 20px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MID};text-align:left;border-bottom:1px solid ${BORDER};">Category</th>
        <th style="padding:12px 20px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MID};text-align:right;border-bottom:1px solid ${BORDER};">Estimate Range (ex GST)</th>
      </tr>
    </thead>
    <tbody>
      ${breakdownRows}
    </tbody>
    <tfoot>
      <tr style="background:${DARK};">
        <td style="padding:16px 20px;font-size:14px;font-weight:900;color:white;text-transform:uppercase;letter-spacing:0.05em;">Total Estimate</td>
        <td style="padding:16px 20px;font-size:15px;font-weight:900;color:${TEAL};text-align:right;">${fmt(data.totalLow)} – ${fmt(data.totalHigh)}</td>
      </tr>
    </tfoot>
  </table>

  <p style="font-size:11px;color:#9CA3AF;line-height:1.7;">
    ${fmt(data.perSqmLow)} – ${fmt(data.perSqmHigh)} per m² · Based on NSW market benchmarks, April 2026. All figures ex GST. A 10% contingency is included in the total. Actual costs depend on site conditions, specification detail, builder selection, and market conditions at time of tender.
  </p>
`)}

${divider()}

<!-- Rate context -->
${section(GREY, `
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;padding-right:24px;width:50%;">
        ${label('What drives your per m² rate?', TEAL)}
        <p style="font-size:13px;color:${BODY};line-height:1.8;">
          NSW commercial fitout rates typically run from $800/m² (basic refresh) to $3,500+/m² (premium executive). Your <strong>${data.tier.toLowerCase()}</strong> specification sits within a well-established range. The biggest variables are builder margin, services condition, and the degree of structural modification required.
        </p>
      </td>
      <td style="vertical-align:top;width:50%;">
        ${label('10% Contingency — why it matters')}
        <p style="font-size:13px;color:${BODY};line-height:1.8;">
          Hidden services, asbestos register items, structural surprises — they appear on almost every fitout. The 10% contingency in your estimate is not padding. It reflects real-world project risk and protects your budget from mid-project blowouts.
        </p>
      </td>
    </tr>
  </table>
`)}

${divider()}


<!-- ═══════════════════════════════════════════
     PAGE 3 — WHO WE ARE
═══════════════════════════════════════════ -->

${section(DARK, `
  ${label('Section 02 — Who We Are', TEAL)}
  <h2 style="color:white;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.01em;line-height:1.1;margin-bottom:16px;">One team.<br/>Your side only.</h2>
  <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.85;max-width:520px;">
    Your Office Space is a commercial property advisory firm. We manage the full lifecycle of your workspace — from lease negotiation and property acquisition through to fitout delivery, furniture supply, and ongoing cleaning. Everything under one roof. One point of accountability.
  </p>
`)}

${section('white', `
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;padding-right:20px;width:50%;">
        <div style="border-left:3px solid ${TEAL};padding-left:16px;margin-bottom:28px;">
          <p style="font-size:12px;font-weight:700;color:${DARK};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">We work for tenants. Not landlords.</p>
          <p style="font-size:13px;color:${MID};line-height:1.75;">We hold a Class 2 NSW real estate licence and act exclusively on behalf of occupiers. We have no landlord relationships, no referral fees, no conflicts. Our only incentive is your outcome.</p>
        </div>
        <div style="border-left:3px solid ${TEAL};padding-left:16px;margin-bottom:28px;">
          <p style="font-size:12px;font-weight:700;color:${DARK};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">National reach. Local knowledge.</p>
          <p style="font-size:13px;color:${MID};line-height:1.75;">We operate across Australia with a strong base in NSW. Our fitout and furniture capability covers every capital city and major regional centre.</p>
        </div>
      </td>
      <td style="vertical-align:top;padding-left:20px;width:50%;">
        <div style="border-left:3px solid ${TEAL};padding-left:16px;margin-bottom:28px;">
          <p style="font-size:12px;font-weight:700;color:${DARK};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">End-to-end delivery.</p>
          <p style="font-size:13px;color:${MID};line-height:1.75;">Most advisory firms hand you a report and walk away. We stay involved through design, builder tender, construction delivery, furniture installation, and post-move cleaning. One team, whole project.</p>
        </div>
        <div style="border-left:3px solid ${TEAL};padding-left:16px;">
          <p style="font-size:12px;font-weight:700;color:${DARK};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Founded by Joe Kelley.</p>
          <p style="font-size:13px;color:${MID};line-height:1.75;">Decade of commercial property experience. Licensed agent. Direct line of contact on every project — not a junior account manager.</p>
        </div>
      </td>
    </tr>
  </table>
`)}

${divider()}


<!-- ═══════════════════════════════════════════
     PAGE 4 — OUR SERVICES
═══════════════════════════════════════════ -->

${section(GREY, `
  ${label('Section 03 — Our Services')}
  <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:${DARK};letter-spacing:-0.01em;margin-bottom:28px;">What we deliver.</h2>

  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;padding:0 16px 24px 0;width:50%;">
        <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:20px 22px;height:100%;">
          <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">01</p>
          <p style="font-size:14px;font-weight:800;color:${DARK};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Tenant Representation</p>
          <p style="font-size:12px;color:${MID};line-height:1.75;">Lease negotiation, market analysis, incentive benchmarking, lease review and make-good advice. We sit on your side of the table for every commercial lease negotiation.</p>
        </div>
      </td>
      <td style="vertical-align:top;padding:0 0 24px 16px;width:50%;">
        <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:20px 22px;height:100%;">
          <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">02</p>
          <p style="font-size:14px;font-weight:800;color:${DARK};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Buyers Agency</p>
          <p style="font-size:12px;color:${MID};line-height:1.75;">Acquisition strategy, off-market sourcing, due diligence and settlement management for commercial property buyers. We find it, assess it and negotiate it — you own the outcome.</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="vertical-align:top;padding:0 16px 0 0;width:50%;">
        <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:20px 22px;height:100%;">
          <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">03</p>
          <p style="font-size:14px;font-weight:800;color:${DARK};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Furniture &amp; Fitout</p>
          <p style="font-size:12px;color:${MID};line-height:1.75;">Full commercial fitout delivery — from brief and design through to construction and installation. Authorised Burgtec dealer. Custom joinery, workstations, seating, AV, kitchen, reception. Brief to delivered.</p>
        </div>
      </td>
      <td style="vertical-align:top;padding:0 0 0 16px;width:50%;">
        <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:20px 22px;height:100%;">
          <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">04</p>
          <p style="font-size:14px;font-weight:800;color:${DARK};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Commercial Cleaning</p>
          <p style="font-size:12px;color:${MID};line-height:1.75;">Regular office cleaning, builders cleans, end-of-lease cleaning and specialised commercial contracts across Newcastle and the Hunter Region. Reliable, accountable, no excuses.</p>
        </div>
      </td>
    </tr>
  </table>
`)}

${divider()}


<!-- ═══════════════════════════════════════════
     PAGE 5 — HOW WE WORK
═══════════════════════════════════════════ -->

${section('white', `
  ${label('Section 04 — Our Process')}
  <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:${DARK};letter-spacing:-0.01em;margin-bottom:28px;">From brief to delivered.</h2>

  <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
    ${[
      ['01', 'Clarity Call', 'Free 30-minute conversation. We understand your brief, your budget, your timeline and your non-negotiables. No pitch — just straight talk about what\'s realistic and what it takes.'],
      ['02', 'Site Inspection', 'We walk your space. Assess existing services, structural constraints, access, and make-good requirements. This is where the estimate gets sharpened into a real number.'],
      ['03', 'Brief & Design', 'We develop a detailed scope of works and design concept. You see the plan before a single dollar is committed. Revisions included — we don\'t lock you in before you\'re ready.'],
      ['04', 'Builder Tender', 'We run a competitive tender process, evaluate submissions, and recommend a builder. You get the benefit of our relationships and our ability to read a builder\'s pricing — not just their pitch.'],
      ['05', 'Delivery', 'We manage the project through to handover. Site supervision, progress reviews, variation control. You run your business. We run your fitout.'],
      ['06', 'Post-Move', 'Builders clean, furniture installation, AV commissioning, and ongoing cleaning if required. The job isn\'t done until your team is settled and the space looks the way it should.'],
    ].map(([num, title, desc], i, arr) => `
      <tr>
        <td style="vertical-align:top;padding:0 0 ${i < arr.length - 1 ? '20px' : '0'} 0;width:40px;">
          <div style="width:32px;height:32px;background:${TEAL};display:flex;align-items:center;justify-content:center;border-radius:4px;">
            <span style="color:white;font-size:10px;font-weight:900;">${num}</span>
          </div>
        </td>
        <td style="vertical-align:top;padding:4px 0 ${i < arr.length - 1 ? '20px' : '0'} 16px;border-bottom:${i < arr.length - 1 ? `1px solid ${BORDER}` : 'none'};">
          <p style="font-size:13px;font-weight:800;color:${DARK};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">${title}</p>
          <p style="font-size:12px;color:${MID};line-height:1.75;">${desc}</p>
        </td>
      </tr>
    `).join('')}
  </table>
`)}

${divider()}


<!-- ═══════════════════════════════════════════
     PAGE 6 — CASE STUDIES
═══════════════════════════════════════════ -->

${section(GREY, `
  ${label('Section 05 — Recent Projects')}
  <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:${DARK};letter-spacing:-0.01em;margin-bottom:28px;">Work that speaks for itself.</h2>

  <!-- Case study 1 -->
  <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:24px;margin-bottom:16px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;width:60%;">
          <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:6px;">FURNITURE & FITOUT · NEWCASTLE CBD</p>
          <p style="font-size:15px;font-weight:900;color:${DARK};text-transform:uppercase;margin-bottom:10px;">DBT Group — Boardroom Refresh</p>
          <p style="font-size:12px;color:${MID};line-height:1.75;margin-bottom:12px;">DBT's existing boardroom no longer reflected their brand positioning. Brief: premium, functional, minimal disruption to operations. We delivered custom joinery, a Burgtec Lingo credenza, Neat Bar Pro integration, and Konfurb Orbit seating — all installed over a single weekend.</p>
          <table style="border-collapse:collapse;">
            <tr>
              <td style="padding-right:24px;padding-bottom:8px;">
                <p style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">BUDGET</p>
                <p style="font-size:13px;font-weight:900;color:${DARK};">On budget</p>
              </td>
              <td style="padding-right:24px;padding-bottom:8px;">
                <p style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">TIMELINE</p>
                <p style="font-size:13px;font-weight:900;color:${DARK};">1 weekend</p>
              </td>
              <td style="padding-bottom:8px;">
                <p style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">DISRUPTION</p>
                <p style="font-size:13px;font-weight:900;color:${DARK};">Zero</p>
              </td>
            </tr>
          </table>
        </td>
        <td style="vertical-align:top;padding-left:20px;width:40%;">
          <div style="background:${DARK};border-radius:6px;padding:16px 20px;">
            <p style="color:rgba(255,255,255,0.5);font-size:11px;line-height:1.7;font-style:italic;">"The space looks exactly like we had in our heads. Delivered faster than we thought possible."</p>
            <p style="color:${TEAL};font-size:10px;font-weight:700;margin-top:10px;">DBT Group, Newcastle</p>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Case study 2 -->
  <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:24px;margin-bottom:16px;">
    <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:6px;">TENANT REPRESENTATION · NEWCASTLE CBD</p>
    <p style="font-size:15px;font-weight:900;color:${DARK};text-transform:uppercase;margin-bottom:10px;">CBD Lease Negotiation — 450m² Office</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;width:50%;padding-right:20px;">
          <p style="font-size:12px;color:${MID};line-height:1.75;">A professional services firm was facing a lease expiry with a landlord pushing a 12% face rent increase. We benchmarked the market, ran a parallel search, and used genuine competition to drive the negotiation. Result: rent held at existing levels, 4-month rent-free period secured, and a $40K fitout contribution added to the lease.</p>
        </td>
        <td style="vertical-align:top;width:50%;padding-left:20px;">
          <table style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="padding-bottom:12px;border-bottom:1px solid ${BORDER};">
                <p style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">RENT INCREASE AVOIDED</p>
                <p style="font-size:16px;font-weight:900;color:${DARK};">12%</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid ${BORDER};">
                <p style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">RENT-FREE SECURED</p>
                <p style="font-size:16px;font-weight:900;color:${DARK};">4 months</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:12px;">
                <p style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">FITOUT CONTRIBUTION</p>
                <p style="font-size:16px;font-weight:900;color:${TEAL};">$40,000</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>

  <!-- Case study 3 -->
  <div style="background:white;border:1px solid ${BORDER};border-radius:8px;padding:24px;">
    <p style="color:${TEAL};font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:6px;">COMMERCIAL CLEANING · NEWCASTLE</p>
    <p style="font-size:15px;font-weight:900;color:${DARK};text-transform:uppercase;margin-bottom:10px;">Jirsch Sutherland — Office Relocation Clean</p>
    <p style="font-size:12px;color:${MID};line-height:1.75;">Jirsch Sutherland relocated their Newcastle office and required both a builders clean at their new site and a make-good clean at the existing premises — all within a 48-hour window. Both cleans completed on schedule, make-good obligations met, bond returned in full.</p>
  </div>
`)}

${divider()}


<!-- ═══════════════════════════════════════════
     PAGE 7 — CREDENTIALS & CLOSE
═══════════════════════════════════════════ -->

${section('white', `
  ${label('Section 06 — Credentials')}
  <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:${DARK};letter-spacing:-0.01em;margin-bottom:24px;">Why us.</h2>

  <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
    ${[
      ['Licensed', 'Class 2 NSW Real Estate Licence — legally qualified to advise on commercial leases and transactions.'],
      ['Authorised Dealer', 'Burgtec commercial furniture — one of Australia\'s leading commercial furniture brands. Direct supply, no margin stacking.'],
      ['Conflict-free', 'No landlord relationships. No referral agreements with builders or agents. We are paid by you to work for you.'],
      ['Single point of contact', 'Joe Kelley leads every engagement personally. You won\'t be passed to a junior. Direct line, direct answers.'],
      ['End-to-end capability', 'Lease · Acquisition · Fitout · Furniture · Cleaning. One firm. One relationship. No handoff risk.'],
    ].map(([title, desc], i, arr) => `
      <tr>
        <td style="vertical-align:top;padding:14px 20px 14px 0;border-bottom:${i < arr.length - 1 ? `1px solid ${BORDER}` : 'none'};width:35%;">
          <p style="font-size:12px;font-weight:800;color:${DARK};text-transform:uppercase;letter-spacing:0.08em;">${title}</p>
        </td>
        <td style="vertical-align:top;padding:14px 0;border-bottom:${i < arr.length - 1 ? `1px solid ${BORDER}` : 'none'};">
          <p style="font-size:12px;color:${MID};line-height:1.75;">${desc}</p>
        </td>
      </tr>
    `).join('')}
  </table>
`)}

${divider()}

<!-- Final CTA -->
${section(DARK, `
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:middle;width:60%;padding-right:32px;">
        <p style="color:${TEAL};font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;margin-bottom:12px;">FREE — NO OBLIGATION</p>
        <h2 style="color:white;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.01em;line-height:1.1;margin-bottom:14px;">Ready to move forward?</h2>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.8;margin-bottom:24px;">
          Book a 30-minute Clarity Call. We'll review your brief, your budget and your timeline. No pitch — just a straight conversation about what your fitout actually takes and how we'd approach it.
        </p>
        <table style="border-collapse:collapse;">
          <tr>
            <td style="padding-right:16px;">
              <a href="https://yourofficespace.au/contact" style="display:inline-block;background:${TEAL};color:white;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;padding:14px 28px;text-decoration:none;border-radius:6px;">Book a Call →</a>
            </td>
          </tr>
        </table>
      </td>
      <td style="vertical-align:middle;padding-left:32px;border-left:1px solid rgba(255,255,255,0.1);">
        <p style="color:rgba(255,255,255,0.3);font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:16px;">Contact</p>
        <p style="color:white;font-size:13px;font-weight:700;margin-bottom:6px;">Joe Kelley</p>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:4px;">Managing Director</p>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:4px;">Your Office Space</p>
        <p style="margin-top:14px;"><a href="mailto:jk@yourofficespace.au" style="color:${TEAL};font-size:12px;font-weight:600;text-decoration:none;">jk@yourofficespace.au</a></p>
        <p style="margin-top:4px;"><a href="tel:0434655511" style="color:rgba(255,255,255,0.4);font-size:12px;text-decoration:none;">0434 655 511</a></p>
        <p style="margin-top:4px;"><a href="https://yourofficespace.au" style="color:rgba(255,255,255,0.4);font-size:12px;text-decoration:none;">yourofficespace.au</a></p>
      </td>
    </tr>
  </table>
`)}

<!-- Legal footer -->
${section(GREY, `
  <p style="font-size:10px;color:#9CA3AF;line-height:1.8;text-align:center;">
    <strong style="color:${MID};">Your Office Space Pty Ltd</strong> · yourofficespace.au · ABN provided on request · Class 2 NSW Real Estate Licence<br/>
    This estimate is indicative only and does not constitute a formal quote. Actual costs will vary based on site conditions, specification detail, builder selection, and market conditions at time of tender.<br/>
    Prepared exclusively for ${data.name} · ${data.date} · Confidential
  </p>
`, '24px 48px')}

</div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const limiter = fitoutLimiter()
  if (limiter) {
    const { success } = await limiter.limit(getIp(req))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const {
      name, email, sqm, tier, desks, meetingRooms,
      hasKitchen, hasReception, hasAV,
      totalLow, totalHigh, perSqmLow, perSqmHigh, breakdown
    } = body

    if (!email || !name || !totalLow) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const date = new Date().toLocaleDateString('en-AU', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney'
    })

    const html = generateReportHtml({
      name, email, sqm, tier, desks, meetingRooms,
      hasKitchen, hasReception, hasAV,
      totalLow, totalHigh, perSqmLow, perSqmHigh, breakdown, date
    })

    const resend = getResend()
    const clientSend = resend.emails.send({
      from: 'Your Office Space <notifications@yourofficespace.au>',
      to: email,
      subject: `Your Fitout Estimate + YOS Capability Statement — ${fmt(totalLow)} to ${fmt(totalHigh)}`,
      html,
    })

    const joeSend = resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: 'jk@yourofficespace.au',
      subject: `New Fitout Lead — ${name} (${sqm}m², ${tier})`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <div style="background:#0A0A0A;padding:24px;border-radius:8px;margin-bottom:24px;">
            <p style="color:#00B5A5;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">NEW FITOUT LEAD</p>
            <p style="color:white;font-size:24px;font-weight:900;margin:0;">${name}</p>
            <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">${email}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;">Area</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;font-size:13px;text-align:right;">${sqm}m²</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;">Quality</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;font-size:13px;text-align:right;">${tier}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;">Workstations</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;font-size:13px;text-align:right;">${desks}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;">Meeting rooms</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;font-size:13px;text-align:right;">${meetingRooms}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;">Extras</td><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-weight:700;font-size:13px;text-align:right;">${[hasKitchen && 'Kitchen', hasReception && 'Reception', hasAV && 'AV'].filter(Boolean).join(', ') || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Estimate range</td><td style="padding:10px 0;font-weight:900;font-size:14px;text-align:right;color:#00B5A5;">${fmt(totalLow)} – ${fmt(totalHigh)}</td></tr>
          </table>
          <div style="background:#F0FDFB;border:1px solid #00B5A525;border-radius:8px;padding:16px 20px;">
            <p style="font-size:12px;color:#374151;font-weight:600;margin-bottom:4px;">Full capability statement sent to client.</p>
            <p style="font-size:12px;color:#6B7280;">Follow up shortly while the brief is fresh.</p>
          </div>
        </div>
      `,
    })

    await Promise.allSettled([clientSend, joeSend])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('fitout-report error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
