'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'
import ToolGate from '@/components/ToolGate'

/* ─── Rate data (YOS Fitout Cost Guide — April 2026, ex GST) ─── */
const RATES = {
  basic: {
    label: 'Basic', color: '#9B9B9B',
    sqm: { low: 490, high: 590 },
    desk: { low: 550, high: 900 },
    meetingRoom: { low: 8000, high: 14000 },
    kitchen: { low: 5000, high: 10000 },
    reception: { low: 6000, high: 12000 },
    av: { low: 2500, high: 5000 },
    contingency: 0.10,
  },
  mid: {
    label: 'Mid-Range', color: '#00B5A5',
    sqm: { low: 1040, high: 1290 },
    desk: { low: 1050, high: 2000 },
    meetingRoom: { low: 18000, high: 30000 },
    kitchen: { low: 15000, high: 25000 },
    reception: { low: 20000, high: 35000 },
    av: { low: 8000, high: 18000 },
    contingency: 0.10,
  },
  premium: {
    label: 'Premium', color: '#1A1A1A',
    sqm: { low: 1780, high: 2200 },
    desk: { low: 2500, high: 5000 },
    meetingRoom: { low: 40000, high: 70000 },
    kitchen: { low: 35000, high: 60000 },
    reception: { low: 50000, high: 90000 },
    av: { low: 25000, high: 60000 },
    contingency: 0.15,
  },
}

type Tier = keyof typeof RATES

interface Inputs {
  sqm: string
  tier: Tier | ''
  desks: string
  meetingRooms: string
  hasKitchen: boolean
  hasReception: boolean
  hasAV: boolean
  buildingType: string
  timeframe: string
}

const STEPS = [
  { id: 'space', title: 'Tell us about the space', subtitle: 'Floor area and building type' },
  { id: 'quality', title: 'What quality level?', subtitle: 'This drives the biggest cost variable' },
  { id: 'workstations', title: 'Workstations and meeting rooms', subtitle: 'Your day-to-day workspace needs' },
  { id: 'spaces', title: 'Additional spaces', subtitle: 'Kitchen, reception, AV and tech' },
  { id: 'result', title: 'Your estimate', subtitle: 'Based on current market rates' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function calcEstimate(inputs: Inputs) {
  if (!inputs.sqm || !inputs.tier) return null
  const r = RATES[inputs.tier as Tier]
  const sqm = parseFloat(inputs.sqm) || 0
  const desks = parseInt(inputs.desks) || 0
  const meetings = parseInt(inputs.meetingRooms) || 0

  const base = { low: sqm * r.sqm.low, high: sqm * r.sqm.high }
  const furniture = { low: desks * r.desk.low, high: desks * r.desk.high }
  const meetingCost = { low: meetings * r.meetingRoom.low, high: meetings * r.meetingRoom.high }
  const kitchenCost = inputs.hasKitchen ? { low: r.kitchen.low, high: r.kitchen.high } : { low: 0, high: 0 }
  const receptionCost = inputs.hasReception ? { low: r.reception.low, high: r.reception.high } : { low: 0, high: 0 }
  const avCost = inputs.hasAV ? { low: r.av.low, high: r.av.high } : { low: 0, high: 0 }

  const subLow = base.low + furniture.low + meetingCost.low + kitchenCost.low + receptionCost.low + avCost.low
  const subHigh = base.high + furniture.high + meetingCost.high + kitchenCost.high + receptionCost.high + avCost.high

  const totalLow = Math.round(subLow * (1 + r.contingency))
  const totalHigh = Math.round(subHigh * (1 + r.contingency))

  return {
    breakdown: [
      { label: 'Construction & fitout', low: base.low, high: base.high },
      { label: 'Workstations & seating', low: furniture.low, high: furniture.high },
      { label: 'Meeting rooms', low: meetingCost.low, high: meetingCost.high },
      ...(inputs.hasKitchen ? [{ label: 'Kitchen / breakout', low: kitchenCost.low, high: kitchenCost.high }] : []),
      ...(inputs.hasReception ? [{ label: 'Reception area', low: receptionCost.low, high: receptionCost.high }] : []),
      ...(inputs.hasAV ? [{ label: 'AV & technology', low: avCost.low, high: avCost.high }] : []),
      { label: `Contingency (${Math.round(r.contingency * 100)}%)`, low: Math.round(subLow * r.contingency), high: Math.round(subHigh * r.contingency) },
    ].filter(b => b.low > 0 || b.high > 0),
    totalLow,
    totalHigh,
    perSqm: { low: Math.round(totalLow / (parseFloat(inputs.sqm) || 1)), high: Math.round(totalHigh / (parseFloat(inputs.sqm) || 1)) }
  }
}

export default function FitoutEstimatorPage() {
  const [step, setStep] = useState(0)
  const [inputs, setInputs] = useState<Inputs>({
    sqm: '', tier: '', desks: '', meetingRooms: '1',
    hasKitchen: false, hasReception: false, hasAV: false,
    buildingType: '', timeframe: '',
  })

  const set = (k: keyof Inputs, v: string | boolean) => setInputs(prev => ({ ...prev, [k]: v }))

  const canProceed = () => {
    if (step === 0) return true  // intro screen, no validation needed
    if (step === 1) return !!inputs.sqm && parseFloat(inputs.sqm) > 0
    if (step === 2) return !!inputs.tier
    if (step === 3) return !!inputs.desks && parseInt(inputs.desks) > 0
    return true
  }

  const estimate = step === 4 ? calcEstimate(inputs) : null
  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black flex flex-col" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>

        {/* Progress bar */}
        {step > 0 && (
          <div className="fixed top-16 md:top-20 left-0 right-0 z-40 h-0.5 bg-white/10">
            <div className="h-full bg-teal transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="flex-1 max-w-screen-xl mx-auto w-full"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(2rem,5vw,4rem)', paddingBottom: 'clamp(3rem,6vw,6rem)' }}>

          {/* Step header */}
          <div className="mb-10 md:mb-14">
            {step > 0 && step < 4 && (
              <p className="text-white/30 font-light mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                Step <span className="text-white/50 font-semibold">{step}</span> of {STEPS.length - 1}
              </p>
            )}
            <div className="inline-flex items-center gap-2 border border-teal/30 mb-5"
              style={{ padding: '0.4rem 1rem' }}>
              <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
              <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
            </div>
            <h1 className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)', marginBottom: '0.75rem' }}>
              {step === 0 ? 'Fitout Cost Estimator' : STEPS[step].title}
            </h1>
            <p className="text-white/40 font-light" style={{ fontSize: '0.9rem' }}>
              {step === 0 ? 'Real market rates. Newcastle & Hunter Region. April 2026. All figures ex GST.' : STEPS[step].subtitle}
            </p>
          </div>

          {/* ── STEP 0: INTRO ── */}
          {step === 0 && (
            <div className="max-w-2xl">
              <p className="text-white/60 font-light leading-relaxed mb-10" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                Get a realistic cost range for your commercial fitout. We&apos;ll walk you through construction, furniture, meeting rooms, kitchen, reception, AV and technology — with a contingency built in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                {[
                  { icon: '📐', label: '5 quick questions' },
                  { icon: '💰', label: 'Detailed breakdown' },
                  { icon: '📋', label: 'Based on real projects' },
                ].map(f => (
                  <div key={f.label} className="border border-white/10 bg-white/4 text-center" style={{ padding: '2rem 1.5rem', borderRadius: '0.75rem' }}>
                    <p className="text-3xl mb-3">{f.icon}</p>
                    <p className="text-white/60 font-light" style={{ fontSize: '0.9rem' }}>{f.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)}
                className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                Start estimator →
              </button>
            </div>
          )}

          {/* ── STEP 1: SPACE ── */}
          {step === 1 && (
            <div className="max-w-2xl">
              <div className="flex flex-col gap-6 mb-10">
                <div>
                  <label className="block text-white/70 font-semibold mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    Floor area (m²) <span className="text-teal">*</span>
                  </label>
                  <input
                    type="number" min="1" placeholder="e.g. 250"
                    value={inputs.sqm}
                    onChange={e => set('sqm', e.target.value)}
                    className="w-full max-w-xs bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/25 transition-colors"
                    style={{ padding: '0.9rem 1.1rem', fontSize: '1.1rem', borderRadius: '0.5rem' }}
                  />
                  <p className="text-white/30 mt-2" style={{ fontSize: '0.78rem' }}>The net lettable area (NLA) of the space you are fitting out</p>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>Building type</label>
                  <div className="flex flex-wrap gap-3">
                    {['A-Grade', 'B-Grade', 'C-Grade / Industrial', 'Tenancy in a retail centre'].map(t => (
                      <button key={t} onClick={() => set('buildingType', t)}
                        className={`font-medium border transition-colors ${inputs.buildingType === t ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '0.5rem' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>Timeframe</label>
                  <div className="flex flex-wrap gap-3">
                    {['ASAP (under 3 months)', '3–6 months', '6–12 months', 'Planning ahead (12m+)'].map(t => (
                      <button key={t} onClick={() => set('timeframe', t)}
                        className={`font-medium border transition-colors ${inputs.timeframe === t ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '0.5rem' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setStep(2)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Next →
                </button>
                <button onClick={() => setStep(0)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.85rem' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 2: QUALITY ── */}
          {step === 2 && (
            <div className="max-w-3xl">
              <div className="grid grid-cols-1 gap-4 mb-10">
                {(Object.entries(RATES) as [Tier, typeof RATES[Tier]][]).map(([key, tier]) => (
                  <button key={key} onClick={() => set('tier', key)}
                    className={`text-left border transition-all duration-150 ${inputs.tier === key ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                    style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${inputs.tier === key ? 'bg-teal' : 'bg-white/20'}`} />
                          <span className="text-white font-black uppercase" style={{ fontSize: '1rem' }}>{tier.label}</span>
                        </div>
                        <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                          {key === 'basic' && 'Functional. Does the job. No frills. Best for short-term tenancies or tight budgets.'}
                          {key === 'mid' && 'Professional standard. Quality materials, considered design, full technology. Right for most growing businesses.'}
                          {key === 'premium' && 'High-specification. Premium materials, integrated technology, architectural design. Makes a statement.'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/40 font-light" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Construction rate</p>
                        <p className="text-white font-black" style={{ fontSize: '0.95rem' }}>
                          ${tier.sqm.low}–${tier.sqm.high}<span className="text-white/40 font-light">/m²</span>
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-white/25 font-light mb-8" style={{ fontSize: '0.78rem' }}>Rates are for construction only. Furniture, meeting rooms and other items are added separately in the next steps.</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setStep(3)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Next →
                </button>
                <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.85rem' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: WORKSTATIONS & MEETINGS ── */}
          {step === 3 && (
            <div className="max-w-xl">
              <div className="flex flex-col gap-10 mb-12">
                <div>
                  <label className="block text-white/70 font-semibold mb-2" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    Number of workstations <span className="text-teal">*</span>
                  </label>
                  <input type="number" min="0" placeholder="e.g. 20"
                    value={inputs.desks} onChange={e => set('desks', e.target.value)}
                    className="w-full max-w-xs bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/25 transition-colors"
                    style={{ padding: '0.9rem 1.1rem', fontSize: '1.1rem', borderRadius: '0.5rem' }}
                  />
                  <p className="text-white/30 mt-2" style={{ fontSize: '0.78rem' }}>Includes desk, chair, and cable management. Mid-range = $1,050–$2,000 per person.</p>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    Meeting rooms
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {['0', '1', '2', '3', '4+'].map(n => (
                      <button key={n} onClick={() => set('meetingRooms', n === '4+' ? '4' : n)}
                        className={`font-bold border transition-colors w-14 ${inputs.meetingRooms === (n === '4+' ? '4' : n) ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.7rem', fontSize: '1rem' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/30 mt-2" style={{ fontSize: '0.78rem' }}>Mid-range: $18,000–$30,000 per room incl. AV, glass, joinery.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setStep(4)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Next →
                </button>
                <button onClick={() => setStep(2)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.85rem' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: ADDITIONAL SPACES ── */}
          {step === 4 && (
            <div className="max-w-xl">
              <div className="flex flex-col gap-4 mb-12">
                {[
                  { key: 'hasKitchen' as const, label: 'Kitchen / breakout area', desc: inputs.tier ? `$${RATES[inputs.tier as Tier].kitchen.low.toLocaleString()}–$${RATES[inputs.tier as Tier].kitchen.high.toLocaleString()}` : 'Varies by tier' },
                  { key: 'hasReception' as const, label: 'Reception area', desc: inputs.tier ? `$${RATES[inputs.tier as Tier].reception.low.toLocaleString()}–$${RATES[inputs.tier as Tier].reception.high.toLocaleString()}` : 'Varies by tier' },
                  { key: 'hasAV' as const, label: 'AV & integrated technology', desc: inputs.tier ? `$${RATES[inputs.tier as Tier].av.low.toLocaleString()}–$${RATES[inputs.tier as Tier].av.high.toLocaleString()}` : 'Varies by tier' },
                ].map(item => (
                  <button key={item.key} onClick={() => set(item.key, !inputs[item.key])}
                    className={`text-left flex items-center justify-between border transition-all ${inputs[item.key] ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                    style={{ padding: '1.5rem 1.75rem', borderRadius: '0.75rem' }}>
                    <div className="flex items-center gap-4">
                      <span className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all ${inputs[item.key] ? 'border-teal bg-teal' : 'border-white/30'}`}>
                        {inputs[item.key] && <span className="text-white font-black" style={{ fontSize: '0.7rem' }}>✓</span>}
                      </span>
                      <div>
                        <p className="text-white font-semibold" style={{ fontSize: '0.95rem' }}>{item.label}</p>
                        <p className="text-white/40 font-light" style={{ fontSize: '0.78rem' }}>{item.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setStep(5)}
                  className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Show my estimate →
                </button>
                <button onClick={() => setStep(3)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.85rem' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 5: RESULT ── */}
          {step === 5 && estimate && inputs.tier && (
            <div className="max-w-2xl">
            <ToolGate
              tool="Fitout Estimator"
              context={() => `Budget range: ${fmt(estimate!.totalLow)} – ${fmt(estimate!.totalHigh)} | Area: ${inputs.sqm}m² | Quality: ${RATES[inputs.tier as Tier].label}`}
              heading="Where should we send your estimate?"
              subheading="Unlock your full cost breakdown — including line-by-line categories and per m² rate."
              teaser={
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-2" style={{ fontSize: '0.7rem' }}>
                      {inputs.sqm}m² · {RATES[inputs.tier as Tier].label} quality
                    </p>
                    <h2 className="text-white font-black uppercase leading-none tracking-tight mb-2"
                      style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                      {fmt(estimate!.totalLow)} – {fmt(estimate!.totalHigh)}
                    </h2>
                    <p className="text-white/40 font-light" style={{ fontSize: '0.85rem' }}>
                      {fmt(estimate!.perSqm.low)}–{fmt(estimate!.perSqm.high)} per m² · All figures ex GST
                    </p>
                  </div>
                  <div className="border border-white/10">
                    <div className="border-b border-white/10 px-5 py-3">
                      <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Cost breakdown — unlock to view</p>
                    </div>
                    {[1,2,3].map(i => (
                      <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-white/6">
                        <span className="w-32 h-3 bg-white/10 rounded-lg" />
                        <span className="w-20 h-3 bg-white/10 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <div className="mb-8">
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-2" style={{ fontSize: '0.7rem' }}>
                  {inputs.sqm}m² · {RATES[inputs.tier as Tier].label} quality
                </p>
                <h2 className="text-white font-black uppercase leading-none tracking-tight mb-2"
                  style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                  {fmt(estimate.totalLow)} – {fmt(estimate.totalHigh)}
                </h2>
                <p className="text-white/40 font-light" style={{ fontSize: '0.85rem' }}>
                  {fmt(estimate.perSqm.low)}–{fmt(estimate.perSqm.high)} per m² · All figures ex GST · 10% contingency included
                </p>
              </div>

              {/* Breakdown */}
              <div className="border border-white/10 mb-8">
                <div className="border-b border-white/10 px-5 py-3">
                  <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Cost breakdown</p>
                </div>
                {estimate.breakdown.map((row, i) => (
                  <div key={i} className={`flex justify-between items-center px-5 py-4 ${i < estimate.breakdown.length - 1 ? 'border-b border-white/6' : ''} ${row.label.includes('Contingency') ? 'bg-white/3' : ''}`}>
                    <span className={`font-light ${row.label.includes('Contingency') ? 'text-white/40 italic' : 'text-white/70'}`} style={{ fontSize: '0.9rem' }}>{row.label}</span>
                    <span className={`font-bold ${row.label.includes('Contingency') ? 'text-white/40' : 'text-white'}`} style={{ fontSize: '0.9rem' }}>
                      {fmt(row.low)} – {fmt(row.high)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-5 py-4 bg-teal/10 border-t border-teal/20">
                  <span className="text-white font-black uppercase tracking-tight" style={{ fontSize: '0.9rem' }}>Total estimate</span>
                  <span className="text-teal font-black" style={{ fontSize: '1rem' }}>{fmt(estimate.totalLow)} – {fmt(estimate.totalHigh)}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-white/30 font-light mb-10 leading-relaxed" style={{ fontSize: '0.82rem', lineHeight: 1.8 }}>
                This estimate is based on current NSW market rates from the YOS Fitout Cost Guide (April 2026). Rates vary by location — figures shown reflect Newcastle and Hunter Region benchmarks. Actual costs depend on site conditions, builder selection, specification detail, and market conditions at time of tender. A site visit and detailed brief will refine this estimate significantly.
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 max-w-sm">
                <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Book a Fitout Consultation →
                </a>
                <Link href="/furniture"
                  className="text-white font-medium no-underline text-center hover:bg-white/10 transition-colors"
                  style={{ padding: '1.1rem 2rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>
                  View Furniture & Fitout Services
                </Link>
              </div>

              <button onClick={() => { setStep(0); setInputs({ sqm: '', tier: '', desks: '', meetingRooms: '1', hasKitchen: false, hasReception: false, hasAV: false, buildingType: '', timeframe: '' }) }}
                className="block mt-6 text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                ← Start again
              </button>
            </ToolGate>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}
