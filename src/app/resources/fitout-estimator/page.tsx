'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'
import ToolGate from '@/components/ToolGate'

/* ─── Rate data (YOS Fitout Cost Guide — April 2026, ex GST) ─── */
type Tier = 'basic' | 'mid' | 'premium'
type FitoutTypeKey = 'furniture-only' | 'turnkey-warm' | 'turnkey-cold'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RATES: Record<FitoutTypeKey, Record<string, any>> = {
  'furniture-only': {
    basic:    { label: 'Basic',     color: '#9B9B9B', desk: { low: 550,  high: 900  }, meetingRoom: { low: 8000,  high: 14000 }, contingency: 0.10 },
    mid:      { label: 'Mid-Range', color: '#00B5A5', desk: { low: 1050, high: 2000 }, meetingRoom: { low: 18000, high: 30000 }, contingency: 0.10 },
    premium:  { label: 'Premium',   color: '#1A1A1A', desk: { low: 2500, high: 5000 }, meetingRoom: { low: 40000, high: 70000 }, contingency: 0.15 },
  },
  'turnkey-warm': {
    basic:    { label: 'Basic',     color: '#9B9B9B', sqm: { low: 490,  high: 590  }, desk: { low: 550,  high: 900  }, meetingRoom: { low: 8000,  high: 14000 }, kitchen: { low: 5000,  high: 10000 }, reception: { low: 6000,  high: 12000 }, av: { low: 2500, high: 5000  }, contingency: 0.10 },
    mid:      { label: 'Mid-Range', color: '#00B5A5', sqm: { low: 1040, high: 1290 }, desk: { low: 1050, high: 2000 }, meetingRoom: { low: 18000, high: 30000 }, kitchen: { low: 15000, high: 25000 }, reception: { low: 20000, high: 35000 }, av: { low: 8000,  high: 18000 }, contingency: 0.10 },
    premium:  { label: 'Premium',   color: '#1A1A1A', sqm: { low: 1780, high: 2200 }, desk: { low: 2500, high: 5000 }, meetingRoom: { low: 40000, high: 70000 }, kitchen: { low: 35000, high: 60000 }, reception: { low: 50000, high: 90000 }, av: { low: 25000, high: 60000 }, contingency: 0.15 },
  },
  'turnkey-cold': {
    basic:    { label: 'Basic',     color: '#9B9B9B', sqm: { low: 320,  high: 385  }, desk: { low: 550,  high: 900  }, meetingRoom: { low: 8000,  high: 14000 }, kitchen: { low: 5000,  high: 10000 }, reception: { low: 6000,  high: 12000 }, av: { low: 2500, high: 5000  }, contingency: 0.10 },
    mid:      { label: 'Mid-Range', color: '#00B5A5', sqm: { low: 680,  high: 840  }, desk: { low: 1050, high: 2000 }, meetingRoom: { low: 18000, high: 30000 }, kitchen: { low: 15000, high: 25000 }, reception: { low: 20000, high: 35000 }, av: { low: 8000,  high: 18000 }, contingency: 0.10 },
    premium:  { label: 'Premium',   color: '#1A1A1A', sqm: { low: 1155, high: 1430 }, desk: { low: 2500, high: 5000 }, meetingRoom: { low: 40000, high: 70000 }, kitchen: { low: 35000, high: 60000 }, reception: { low: 50000, high: 90000 }, av: { low: 25000, high: 60000 }, contingency: 0.15 },
  },
}


interface Inputs {
  fitoutType: 'furniture-only' | 'turnkey' | ''
  sqm: string
  shellCondition: 'cold' | 'warm' | ''
  tier: Tier | ''
  workstationType: 'fixed' | 'eha' | ''
  desks: string
  meetingRooms: string
  hasKitchen: boolean
  hasReception: boolean
  hasAV: boolean
  buildingType: string
  timeframe: string
}

const STEPS = [
  { id: 'intro',       title: 'Fitout Cost Estimator',   subtitle: 'Real market rates. NSW & Australia. April 2026. All figures ex GST.' },
  { id: 'service',     title: 'What are you after?',     subtitle: 'Furniture only or a full turnkey fitout?' },
  { id: 'space',       title: 'Tell us about the space',  subtitle: 'Floor area and building type' },
  { id: 'shell',       title: 'What is the space now?',  subtitle: 'Cold shell or warm shell — this makes a big difference to cost' },
  { id: 'quality',     title: 'What quality level?',     subtitle: 'This drives the biggest cost variable' },
  { id: 'wkstype',     title: 'Workstation type',         subtitle: 'Fixed or adjustable — different cost, different feel' },
  { id: 'workstations',title: 'Workstations and meeting rooms', subtitle: 'Your day-to-day workspace needs' },
  { id: 'spaces',      title: 'Additional spaces',       subtitle: 'Kitchen, reception, AV and tech' },
  { id: 'result',      title: 'Your estimate',           subtitle: 'Based on current market rates' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function calcEstimate(inputs: Inputs) {
  if (!inputs.sqm || !inputs.tier || !inputs.fitoutType) return null
  const isFurniture = inputs.fitoutType === 'furniture-only'
  const rateKey: FitoutTypeKey = isFurniture ? 'furniture-only' : inputs.shellCondition === 'cold' ? 'turnkey-cold' : 'turnkey-warm'
  const r = (RATES as any)[rateKey][inputs.tier as Tier]
  const sqm = parseFloat(inputs.sqm) || 0
  const desks = parseInt(inputs.desks) || 0
  const meetings = parseInt(inputs.meetingRooms) || 0
  const ehaMult = inputs.workstationType === 'eha' ? 1.45 : 1.0

  const base = isFurniture
    ? { low: 0, high: 0 }
    : { low: sqm * (r.sqm?.low ?? 0), high: sqm * (r.sqm?.high ?? 0) }
  const furniture = { low: desks * r.desk.low * ehaMult, high: desks * r.desk.high * ehaMult }
  const meetingCost = { low: meetings * r.meetingRoom.low, high: meetings * r.meetingRoom.high }
  const kitchenCost = (!isFurniture && r.kitchen) ? { low: r.kitchen.low, high: r.kitchen.high } : { low: 0, high: 0 }
  const receptionCost = (!isFurniture && r.reception) ? { low: r.reception.low, high: r.reception.high } : { low: 0, high: 0 }
  const avCost = (!isFurniture && r.av) ? { low: r.av.low, high: r.av.high } : { low: 0, high: 0 }

  const subLow = base.low + furniture.low + meetingCost.low + kitchenCost.low + receptionCost.low + avCost.low
  const subHigh = base.high + furniture.high + meetingCost.high + kitchenCost.high + receptionCost.high + avCost.high

  const totalLow = Math.round(subLow * (1 + r.contingency))
  const totalHigh = Math.round(subHigh * (1 + r.contingency))

  const constructionLabel = isFurniture ? null : rateKey === 'turnkey-cold' ? 'Construction fitout (cold shell)' : 'Construction fitout (warm shell)'

  return {
    breakdown: [
      ...(constructionLabel ? [{ label: constructionLabel, low: base.low, high: base.high }] : []),
      { label: isFurniture ? 'Furniture supply & installation' : 'Workstations & seating', low: furniture.low, high: furniture.high },
      { label: 'Meeting rooms', low: meetingCost.low, high: meetingCost.high },
      ...(kitchenCost.low > 0 ? [{ label: 'Kitchen / breakout', low: kitchenCost.low, high: kitchenCost.high }] : []),
      ...(receptionCost.low > 0 ? [{ label: 'Reception area', low: receptionCost.low, high: receptionCost.high }] : []),
      ...(avCost.low > 0 ? [{ label: 'AV & technology', low: avCost.low, high: avCost.high }] : []),
      { label: `Contingency (${Math.round(r.contingency * 100)}%)`, low: Math.round(subLow * r.contingency), high: Math.round(subHigh * r.contingency) },
    ].filter(b => b.low > 0 || b.high > 0),
    totalLow,
    totalHigh,
    perSqm: { low: Math.round(totalLow / (parseFloat(inputs.sqm) || 1)), high: Math.round(totalHigh / (parseFloat(inputs.sqm) || 1)) },
    coverageNote: isFurniture
      ? 'Price is for supply and installation of furniture items listed. Excludes construction, electrical, and joinery.'
      : rateKey === 'turnkey-cold'
      ? 'Cold shell condition assumed. Base build services and ceiling works are included.'
      : 'Warm shell condition assumed. Base build services already in place.',
  }
}

export default function FitoutEstimatorPage() {
  const [step, setStep] = useState(0)
  const [inputs, setInputs] = useState<Inputs>({
    fitoutType: '', sqm: '', shellCondition: 'warm', tier: '', workstationType: '', desks: '', meetingRooms: '1',
    hasKitchen: false, hasReception: false, hasAV: false,
    buildingType: '', timeframe: '',
  })

  const set = (k: keyof Inputs, v: string | boolean) => setInputs(prev => ({ ...prev, [k]: v }))
  const isFurnitureOnly = inputs.fitoutType === 'furniture-only'
  const maxStep = isFurnitureOnly ? 7 : 8  // 0=Intro, 1=Service, 2=Space, 3=Quality(furn)/Shell(turnkey), 4=Quality, 5=WksType, 6=WksQty, 7=Spaces, 8=Result

  const canProceed = () => {
    if (step === 0) return true
    if (step === 1) return !!inputs.fitoutType
    if (step === 2) return !!inputs.sqm && parseFloat(inputs.sqm) > 0
    // step 3: furn=quality; turnkey=shell (always valid — warm is default)
    if (step === 3) return isFurnitureOnly ? !!inputs.tier : true
    if (step === 4) return !!inputs.tier
    if (step === 5) return !!inputs.workstationType
    if (step === 6) return !!inputs.desks && parseInt(inputs.desks) > 0
    return true
  }

  const estimate = step >= maxStep ? calcEstimate(inputs) : null
  const progress = step === 0 ? 0 : ((step - 1) / (maxStep - 1)) * 100
  const stepCount = maxStep - 1

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>

        {/* Progress bar */}
        {step > 0 && (
          <div className="fixed top-16 md:top-20 left-0 right-0 z-40 h-0.5 bg-white/10">
            <div className="h-full bg-teal transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="flex-1 max-w-screen-xl mx-auto w-full"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>

          {/* Step header */}
          <div style={{ marginBottom: '3.5rem' }}>
            {step > 0 && step < STEPS.length && (
              <p className="text-white/30 font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '2rem' }}>
                Step <span className="text-teal font-semibold">{step}</span> <span className="text-white/20">/</span> {stepCount}
              </p>
            )}
            {step === 0 && (
              <div className="inline-flex items-center gap-2 border border-teal/30" style={{ padding: '0.4rem 1rem', marginBottom: '1.75rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
            )}
            <h1 className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)', marginBottom: '1.25rem' }}>
              {step === 0 ? 'Fitout Cost Estimator' : step < STEPS.length ? STEPS[step].title : 'Your Estimate'}
            </h1>
            <p className="text-white/40 font-light" style={{ fontSize: '0.95rem', lineHeight: 1.85, maxWidth: '36rem' }}>
              {step === 0 ? 'Real market rates. NSW & Australia. April 2026. All figures ex GST.' : step < STEPS.length ? STEPS[step].subtitle : 'Based on current market rates'}
            </p>
          </div>

          {/* ── SECTION 1: THE FITOUT PROCESS (dark) ── */}
          <section style={{ background: '#0A0A0A', paddingTop: '5rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>How it works</span>
              </div>
              <h2 style={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '4rem', fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                How a YOS fitout works
              </h2>

              {/* 4 process steps with connecting line */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', position: 'relative' }}>
                {[
                  { step: '01', title: 'Brief', body: "Tell us what you&apos;re trying to achieve. Floor plan, headcount, and how your team works. We start with your needs — not a product catalogue." },
                  { step: '02', title: '3D Design', body: "We model your layout in 3D. You see exactly where workstations, meeting rooms, and breakout areas sit before anything is ordered. Adjustments are part of the process." },
                  { step: '03', title: 'Fixed Quote', body: 'You get a fixed price based on the approved layout. Deposit structure to suit your cash flow. No surprises, no hidden line items.' },
                  { step: '04', title: 'Install', body: "We manage delivery and installation. One team on site, one point of contact throughout. Your team walks in to a ready workspace." }
                ].map((s, i) => (
                  <div key={s.step} style={{ position: 'relative' }}>
                    {i < 3 && (
                      <div style={{ position: 'absolute', top: '1.8rem', right: '-1.5rem', width: '2.5rem', height: '1px', background: 'linear-gradient(to right, rgba(0,181,165,0.5), rgba(0,181,165,0.15))', zIndex: 1 }} aria-hidden="true" />
                    )}
                    <p style={{ color: '#00B5A5', fontWeight: 900, fontSize: '2.75rem', lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>{s.step}</p>
                    <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.875rem' }}>{s.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.8 }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 2: RECENT PROJECTS (case study gallery) ── */}
          <section style={{ background: '#0A0A0A', paddingTop: '0', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingTop: '5rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Case Studies</span>
              </div>
              <h2 style={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '0.5rem', fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                Recent projects
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300, fontSize: '0.9rem', marginBottom: '3rem', lineHeight: 1.7 }}>
                Selected fitouts delivered by YOS across NSW
              </p>

              {/* 2×3 project card grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '0' }}>
                {[
                  { src: '/images/furniture/space-wsi-openplan.jpg',  alt: 'Large open plan office with Burgtec workstations',    label: 'Open Plan',          mood: 'Bright & Airy' },
                  { src: '/images/furniture/space-cogc-wide.jpg',     alt: 'Contemporary government office fitout',               label: 'Corporate',          mood: 'Clean & Modern' },
                  { src: '/images/furniture/space-pillowtalk-a.jpg',  alt: 'Vibrant collaborative workspace with lounge',          label: 'Collaborative',      mood: 'Warm & Energetic' },
                  { src: '/images/furniture/space-bendigo-wide.jpg',  alt: 'Premium large scale commercial fitout',               label: 'Premium Fitout',     mood: 'Bold & Executive' },
                  { src: '/images/furniture/space-liverpool-b.jpg',   alt: 'Civic office with breakout zones',                   label: 'Breakout Zones',     mood: 'Open & Social' },
                  { src: '/images/furniture/space-pillowtalk-b.jpg',  alt: 'Bright modern commercial interior with lounge',       label: 'Reception & Lounge', mood: 'Inviting & Relaxed' },
                ].map((img, i) => (
                  <div key={i}
                    style={{
                      background: '#131313', border: '1px solid #2A2A2A',
                      borderRadius: '0.75rem', overflow: 'hidden',
                      transition: 'border-color 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00B5A5' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A' }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: '#0e0e0e' }}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                      />
                    </div>
                    {/* Text */}
                    <div style={{ padding: '1.25rem 1.5rem' }}>
                      <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                        {img.label}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '0.8rem' }}>
                        {img.mood}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What was involved strip */}
              <div style={{ marginTop: '3rem', padding: '2rem 2.5rem', background: '#131313', border: '1px solid #2A2A2A', borderRadius: '0.75rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>What was involved?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem' }}>
                  {[
                    'Desk, chair and cable management for 5–50 people',
                    'Meeting room design and configuration',
                    'Joinery, shelving and storage solutions',
                    'Delivery, install and on-site management',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#00B5A5', fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }}>→</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: KNOWLEDGE / FAQ ── */}
          <section style={{ background: '#0D1117', paddingTop: '5rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Knowledge</span>
              </div>
              <h2 style={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '3.5rem', fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                What affects fitout cost?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  {
                    q: 'Why does building grade matter?',
                    a: "A-Grade buildings have higher base costs — deeper cores, better services, stricter BCA requirements. C-Grade and industrial tenancies are cheaper to fit out but may need more work on base condition. We adjust specs to match the building reality."
                  },
                  {
                    q: "What&apos;s the real timeline?",
                    a: "Furniture-only fitout: 2–4 weeks. Full commercial fitout: 6–16 weeks depending on scope. The biggest time-suck is decisions — not construction. Our process is designed to compress that phase so you move faster than you think."
                  },
                  {
                    q: "What&apos;s the payment structure?",
                    a: "Orders under $4,000: full payment upfront. Orders over $4,000: 40% deposit, balance on completion. Account terms available for repeat clients. We don&apos;t hold jobs to ransom over 11th-hour variation requests — if it wasn&apos;t in the quote, we discuss it before we do it."
                  },
                ].map((item, i) => (
                  <div key={i} style={{ paddingLeft: '1.5rem', borderLeft: '2px solid #00B5A5' }}>
                    <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.875rem', lineHeight: 1.4 }}>{item.q}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.85 }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── STEP 0: INTRO ── */}
          {step === 0 && (
            <div className="max-w-2xl">
              <p className="text-white/60 font-light leading-relaxed" style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '3rem' }}>
                Get a realistic cost range for your commercial fitout. We&apos;ll walk you through construction, furniture, meeting rooms, kitchen, reception, AV and technology — with a contingency built in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
                {[
                  { num: '01', label: '5 quick questions' },
                  { num: '02', label: 'Detailed breakdown' },
                  { num: '03', label: 'Based on real projects' },
                ].map(f => (
                  <div key={f.label} className="border border-white/10 bg-white/[0.03]" style={{ padding: '1.75rem 1.5rem', borderRadius: '0.75rem' }}>
                    <p className="text-teal font-black" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '0.625rem' }}>{f.num}</p>
                    <p className="text-white/70 font-medium" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{f.label}</p>
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


          {/* ── STEP 1: SERVICE TYPE ── */}
          {step === 1 && (
            <div className="max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
                {[
                  {
                    key: 'furniture-only' as const,
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
                        <rect x="4" y="14" width="20" height="2" rx="1" fill="currentColor" />
                        <rect x="7" y="8" width="14" height="6" rx="1" fill="currentColor" opacity="0.7" />
                        <rect x="6" y="16" width="2" height="8" rx="1" fill="currentColor" />
                        <rect x="20" y="16" width="2" height="8" rx="1" fill="currentColor" />
                      </svg>
                    ),
                    label: 'Furniture only',
                    body: 'Desks, chairs, storage, meeting tables. We supply and install. No construction.',
                  },
                  {
                    key: 'turnkey' as const,
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
                        <rect x="3" y="12" width="22" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                        <polyline points="3,12 14,4 25,12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                        <rect x="10" y="18" width="8" height="8" rx="1" fill="currentColor" opacity="0.6" />
                      </svg>
                    ),
                    label: 'Turnkey fitout',
                    body: 'Brief to key — construction, joinery, electrical, AV, furniture. One team, ready to move in.',
                  },
                ].map(opt => (
                  <button key={opt.key} onClick={() => set('fitoutType', opt.key)}
                    className={`text-left border transition-all duration-150 ${inputs.fitoutType === opt.key ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                    style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1rem' }}>
                      <span className={inputs.fitoutType === opt.key ? 'text-teal' : 'text-white/40'} style={{ transition: 'color 0.15s', display: 'flex' }}>{opt.icon}</span>
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${inputs.fitoutType === opt.key ? 'bg-teal' : 'bg-white/20'}`} />
                    </div>
                    <p className="text-white font-black uppercase" style={{ fontSize: '0.95rem', marginBottom: '0.625rem' }}>{opt.label}</p>
                    <p className="text-white/50 font-light" style={{ fontSize: '0.875rem', lineHeight: 1.65 }}>{opt.body}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(3)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', borderRadius: '0.5rem', minWidth: '12rem', minHeight: '52px' }}>
                  Next →
                </button>
                <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}
          {/* ── STEP 2: SPACE ── */}
          {step === 2 && (
            <div className="max-w-2xl">
              <div className="flex flex-col" style={{ gap: '3rem', marginBottom: '3.5rem' }}>

                {/* Floor area */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Floor area (m²) <span className="text-teal">*</span>
                  </label>
                  <input
                    type="number" min="1" placeholder="e.g. 250"
                    value={inputs.sqm}
                    onChange={e => set('sqm', e.target.value)}
                    className="w-full max-w-xs bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/25 transition-colors"
                    style={{ padding: '1rem 1.25rem', fontSize: '1.15rem', borderRadius: '0.5rem', display: 'block', marginBottom: '0.75rem' }}
                  />
                  <p className="text-white/30" style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>The net lettable area (NLA) of the space you are fitting out</p>
                </div>

                {/* Building type */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Building type</label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['A-Grade', 'B-Grade', 'C-Grade / Industrial', 'Tenancy in a retail centre'].map(t => (
                      <button key={t} onClick={() => set('buildingType', t)}
                        className={`font-medium border transition-colors ${inputs.buildingType === t ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.5rem' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeframe */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Timeframe</label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['ASAP (under 3 months)', '3–6 months', '6–12 months', 'Planning ahead (12m+)'].map(t => (
                      <button key={t} onClick={() => set('timeframe', t)}
                        className={`font-medium border transition-colors ${inputs.timeframe === t ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.5rem' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(5)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', borderRadius: '0.5rem', minWidth: '12rem', minHeight: '52px' }}>
                  Next →
                </button>
                <button onClick={() => setStep(0)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}


          {/* ── STEP 3: SHELL CONDITION (turnkey only) ── */}
          {step === 3 && (
            <div className="max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
                <button onClick={() => set('shellCondition', 'cold')}
                  className={`text-left border transition-all duration-150 ${inputs.shellCondition === 'cold' ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                  style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${inputs.shellCondition === 'cold' ? 'bg-teal' : 'bg-white/20'}`} />
                  </div>
                  <p className="text-white font-black uppercase" style={{ fontSize: '0.95rem', marginBottom: '0.625rem' }}>Cold shell</p>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Base build in. No ceiling, no HVAC extension, no existing services. Lower base cost but more groundwork.
                  </p>
                </button>
                <button onClick={() => set('shellCondition', 'warm')}
                  className={`text-left border transition-all duration-150 ${inputs.shellCondition === 'warm' ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                  style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${inputs.shellCondition === 'warm' ? 'bg-teal' : 'bg-white/20'}`} />
                  </div>
                  <p className="text-white font-black uppercase" style={{ fontSize: '0.95rem', marginBottom: '0.625rem' }}>Warm shell</p>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Existing ceiling grid, HVAC to tenant area, fire services in place. Clean base to work from. Most common.
                  </p>
                </button>
              </div>
              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(6)}
                  className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Next →
                </button>
                <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}
          {/* ── STEP 4: QUALITY ── */}
          {step === 4 && (
            <div className="max-w-3xl">
              <div className="grid grid-cols-1 mb-10" style={{ gap: '1rem' }}>
                {(Object.entries(RATES as any) as [string, any][]).map(([key, tier]) => (
                  <button key={key} onClick={() => set('tier', key)}
                    className={`text-left border transition-all duration-150 ${inputs.tier === key ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                    style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${inputs.tier === key ? 'bg-teal' : 'bg-white/20'}`} />
                          <span className="text-white font-black uppercase" style={{ fontSize: '1rem' }}>{(tier as any).label}</span>
                        </div>
                        <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                          {key === 'basic' && 'Functional. Does the job. No frills. Best for short-term tenancies or tight budgets.'}
                          {key === 'mid' && 'Professional standard. Quality materials, considered design, full technology. Right for most growing businesses.'}
                          {key === 'premium' && 'High-specification. Premium materials, integrated technology, architectural design. Makes a statement.'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/40 font-light" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                          {key === 'basic' && 'Entry level'}
                          {key === 'mid' && 'Most popular'}
                          {key === 'premium' && 'High specification'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-white/25 font-light mb-8" style={{ fontSize: '0.78rem' }}>Your full cost estimate — including all items — will be shown at the end.</p>
              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(5)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', borderRadius: '0.5rem', minWidth: '12rem', minHeight: '52px' }}>
                  Next →
                </button>
                <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: WORKSTATION TYPE ── */}
          {step === 4 && (
            <div className="max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
                <button onClick={() => set('workstationType', 'fixed')}
                  className={`text-left border transition-all duration-150 ${inputs.workstationType === 'fixed' ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                  style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${inputs.workstationType === 'fixed' ? 'bg-teal' : 'bg-white/20'}`} />
                  </div>
                  <p className="text-white font-black uppercase" style={{ fontSize: '0.95rem', marginBottom: '0.625rem' }}>Fixed height</p>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Standard static desking. Reliable, lower cost. Right for teams who sit and stay.
                  </p>
                </button>
                <button onClick={() => set('workstationType', 'eha')}
                  className={`text-left border transition-all duration-150 ${inputs.workstationType === 'eha' ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                  style={{ padding: '1.75rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${inputs.workstationType === 'eha' ? 'bg-teal' : 'bg-white/20'}`} />
                  </div>
                  <p className="text-white font-black uppercase" style={{ fontSize: '0.95rem', marginBottom: '0.625rem' }}>Electric height adjustable</p>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Sit-stand capability. Dual-motor, programmable. Adds roughly 45% to workstation cost — wellbeing ROI is real.
                  </p>
                </button>
              </div>
              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(5)}
                  className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Next →
                </button>
                <button onClick={() => setStep(2)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 5: WORKSTATIONS & MEETINGS ── */}
          {step === 5 && (
            <div className="max-w-xl">
              <div className="flex flex-col" style={{ gap: '3rem', marginBottom: '3.5rem' }}>

                {/* Workstations */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Number of workstations <span className="text-teal">*</span>
                  </label>
                  <input type="number" min="0" placeholder="e.g. 20"
                    value={inputs.desks} onChange={e => set('desks', e.target.value)}
                    className="w-full max-w-xs bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/25 transition-colors"
                    style={{ padding: '1rem 1.25rem', fontSize: '1.15rem', borderRadius: '0.5rem', display: 'block', marginBottom: '0.75rem' }}
                  />
                  <p className="text-white/30" style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>Includes desk, chair, and cable management. Mid-range = $1,050–$2,000 per person.</p>
                </div>

                {/* Meeting rooms */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Meeting rooms
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem', marginBottom: '0.875rem' }}>
                    {['0', '1', '2', '3', '4+'].map(n => (
                      <button key={n} onClick={() => set('meetingRooms', n === '4+' ? '4' : n)}
                        className={`font-bold border transition-colors w-14 ${inputs.meetingRooms === (n === '4+' ? '4' : n) ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.85rem', fontSize: '1rem' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/30" style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>Mid-range: $18,000–$30,000 per room incl. AV, glass, joinery.</p>
                </div>

              </div>

              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(7)} disabled={!canProceed()}
                  className={`font-bold transition-all ${canProceed() ? 'bg-teal text-white hover:bg-dark-teal' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', borderRadius: '0.5rem', minWidth: '12rem', minHeight: '52px' }}>
                  Next →
                </button>
                <button onClick={() => setStep(2)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 6: ADDITIONAL SPACES ── */}
          {step === 6 && (
            <div className="max-w-xl">
              <div className="flex flex-col" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
                {[
                  { key: 'hasKitchen' as const, label: 'Kitchen / breakout area', desc: 'Benchtop, sink, appliances, storage' },
                  { key: 'hasReception' as const, label: 'Reception area', desc: 'Entry desk, feature wall, visitor seating' },
                  { key: 'hasAV' as const, label: 'AV & integrated technology', desc: 'Screens, conferencing, cabling and control' },
                ].map(item => (
                  <button key={item.key} onClick={() => set(item.key, !inputs[item.key])}
                    className={`text-left flex items-center justify-between border transition-all ${inputs[item.key] ? 'border-teal bg-teal/8' : 'border-white/12 bg-white/3 hover:border-white/25'}`}
                    style={{ padding: '1.5rem 1.75rem', borderRadius: '0.75rem' }}>
                    <div className="flex items-center" style={{ gap: '1.5rem' }}>
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

              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button onClick={() => setStep(5)}
                  className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Show my estimate →
                </button>
                <button onClick={() => setStep(3)} className="text-white/30 hover:text-white/60 transition-colors" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 7: RESULT ── */}
          {step === 5 && estimate && inputs.tier && (
            <div className="max-w-2xl">
            <ToolGate
              tool="Fitout Estimator"
              context={() => `Budget range: ${fmt(estimate!.totalLow)} – ${fmt(estimate!.totalHigh)} | Area: ${inputs.sqm}m² | Quality: ${((RATES as any)['turnkey-warm'] as any)[inputs.tier as Tier]?.label ?? inputs.tier}`}
              heading="Where should we send your estimate?"
              subheading="Enter your details — we'll email you a branded 1-page report with your full cost breakdown."
              onUnlock={(name, email) => {
                // Send branded report to client + notify Joe
                fetch('/api/fitout-report', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name,
                    email,
                    sqm: inputs.sqm,
                    tier: ((RATES as any)['turnkey-warm'] as any)[inputs.tier as Tier]?.label ?? inputs.tier,
                    desks: inputs.desks,
                    meetingRooms: inputs.meetingRooms,
                    hasKitchen: inputs.hasKitchen,
                    hasReception: inputs.hasReception,
                    hasAV: inputs.hasAV,
                    totalLow: estimate!.totalLow,
                    totalHigh: estimate!.totalHigh,
                    perSqmLow: estimate!.perSqm.low,
                    perSqmHigh: estimate!.perSqm.high,
                    breakdown: estimate!.breakdown,
                  }),
                }).catch(() => {})
              }}
              teaser={
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-2" style={{ fontSize: '0.7rem' }}>
                      {inputs.sqm}m² · {((RATES as any)['turnkey-warm'] as any)[inputs.tier as Tier]?.label ?? inputs.tier} quality
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
              {/* Summary */}
              <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>
                  {inputs.sqm}m² · {((RATES as any)['turnkey-warm'] as any)[inputs.tier as Tier]?.label ?? inputs.tier} quality
                </p>
                <h2 className="text-white font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.25rem,5vw,4.5rem)', marginBottom: '1rem' }}>
                  {fmt(estimate.totalLow)} – {fmt(estimate.totalHigh)}
                </h2>
                <p className="text-white/40 font-light" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {fmt(estimate.perSqm.low)} – {fmt(estimate.perSqm.high)} per m² &nbsp;·&nbsp; All figures ex GST &nbsp;·&nbsp; 10% contingency included
                </p>
              </div>

              {/* Breakdown */}
              <div style={{ marginBottom: '3rem' }}>
                <p className="text-white/40 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '1.25rem' }}>Cost breakdown</p>
                <div className="border border-white/10" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                  {estimate.breakdown.map((row, i) => (
                    <div key={i} className={`flex justify-between items-center ${i < estimate.breakdown.length - 1 ? 'border-b border-white/8' : ''} ${row.label.includes('Contingency') ? 'bg-white/[0.02]' : ''}`}
                      style={{ padding: '1.1rem 1.5rem' }}>
                      <span className={`font-light ${row.label.includes('Contingency') ? 'text-white/35 italic' : 'text-white/65'}`} style={{ fontSize: '0.95rem' }}>{row.label}</span>
                      <span className={`font-semibold ${row.label.includes('Contingency') ? 'text-white/35' : 'text-white/85'}`} style={{ fontSize: '0.95rem' }}>
                        {fmt(row.low)} – {fmt(row.high)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center bg-teal/10 border-t border-teal/25" style={{ padding: '1.35rem 1.5rem' }}>
                    <span className="text-white font-black uppercase tracking-wide" style={{ fontSize: '0.85rem' }}>Total estimate</span>
                    <span className="text-teal font-black" style={{ fontSize: '1.1rem' }}>{fmt(estimate.totalLow)} – {fmt(estimate.totalHigh)}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-white/25 font-light leading-relaxed" style={{ fontSize: '0.82rem', lineHeight: 1.85, marginBottom: '3rem' }}>
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

              <button onClick={() => { setStep(0); setInputs({ fitoutType: '', sqm: '', shellCondition: 'warm', tier: '', workstationType: '', desks: '', meetingRooms: '1', hasKitchen: false, hasReception: false, hasAV: false, buildingType: '', timeframe: '' }) }}
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
