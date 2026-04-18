'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { HUBSPOT } from '@/lib/constants'

// Rates sourced from YOS Fitout Cost Guide — Newcastle / Hunter Region, April 2026
// All figures ex GST, Category A base building, 250m² reference project

const TIERS = {
  basic: {
    label: 'Basic',
    desc: 'Functional. Does the job. No extras. Best for budget-constrained projects or short-term tenancies.',
    preConstruction: { low: 168, high: 200 },   // design, PM, engineers, approvals
    structure:       { low: 96,  high: 120 },    // demolition, partitions, ceilings
    finishes:        { low: 72,  high: 90 },     // flooring, joinery, painting
    services:        { low: 56,  high: 70 },     // HVAC, electrical, plumbing, fire
    technology:      { low: 48,  high: 60 },     // data, wifi, AV, access control
    furniturePerDesk: { low: 550,  high: 900 },  // desk + chair per workstation
    contingency: 0.10,
    color: 'border-gray-300'
  },
  midrange: {
    label: 'Mid-Range',
    desc: 'Professional standard. Quality materials, considered design, proper technology. What most growing businesses need.',
    preConstruction: { low: 320, high: 380 },
    structure:       { low: 220, high: 280 },
    finishes:        { low: 200, high: 250 },
    services:        { low: 160, high: 200 },
    technology:      { low: 140, high: 180 },
    furniturePerDesk: { low: 1050, high: 2000 },
    contingency: 0.10,
    color: 'border-teal'
  },
  premium: {
    label: 'Premium',
    desc: 'High-spec. Premium materials, full technology integration, considered design throughout. Sends a statement.',
    preConstruction: { low: 520, high: 620 },
    structure:       { low: 460, high: 560 },
    finishes:        { low: 440, high: 540 },
    services:        { low: 420, high: 520 },
    technology:      { low: 440, high: 540 },
    furniturePerDesk: { low: 2400, high: 4000 },
    contingency: 0.12,
    color: 'border-near-black'
  }
} as const

type TierKey = keyof typeof TIERS

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

interface Result {
  preConLow: number; preConHigh: number
  structureLow: number; structureHigh: number
  finishesLow: number; finishesHigh: number
  servicesLow: number; servicesHigh: number
  techLow: number; techHigh: number
  furnitureLow: number; furnitureHigh: number
  subtotalLow: number; subtotalHigh: number
  contingencyLow: number; contingencyHigh: number
  totalLow: number; totalHigh: number
}

export default function FitoutEstimatorPage() {
  const [area, setArea] = useState('')
  const [desks, setDesks] = useState('')
  const [tier, setTier] = useState<TierKey>('midrange')
  const [result, setResult] = useState<Result | null>(null)

  function calculate() {
    const sqm = parseFloat(area)
    const numDesks = parseInt(desks) || 0
    if (!sqm || sqm <= 0) return

    const t = TIERS[tier]

    const preConLow  = sqm * t.preConstruction.low
    const preConHigh = sqm * t.preConstruction.high
    const structureLow  = sqm * t.structure.low
    const structureHigh = sqm * t.structure.high
    const finishesLow  = sqm * t.finishes.low
    const finishesHigh = sqm * t.finishes.high
    const servicesLow  = sqm * t.services.low
    const servicesHigh = sqm * t.services.high
    const techLow  = sqm * t.technology.low
    const techHigh = sqm * t.technology.high
    const furnitureLow  = numDesks * t.furniturePerDesk.low
    const furnitureHigh = numDesks * t.furniturePerDesk.high

    const subtotalLow  = preConLow  + structureLow  + finishesLow  + servicesLow  + techLow  + furnitureLow
    const subtotalHigh = preConHigh + structureHigh + finishesHigh + servicesHigh + techHigh + furnitureHigh
    const contingencyLow  = subtotalLow  * t.contingency
    const contingencyHigh = subtotalHigh * t.contingency

    setResult({
      preConLow, preConHigh,
      structureLow, structureHigh,
      finishesLow, finishesHigh,
      servicesLow, servicesHigh,
      techLow, techHigh,
      furnitureLow, furnitureHigh,
      subtotalLow, subtotalHigh,
      contingencyLow, contingencyHigh,
      totalLow: subtotalLow + contingencyLow,
      totalHigh: subtotalHigh + contingencyHigh
    })
  }

  const t = TIERS[tier]

  return (
    <>
      <Nav />

      <section className="bg-near-black pt-[72px] pb-20">
        <div className="max-w-4xl mx-auto px-[5%] pt-16">
          <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">Free tool</p>
          <h1 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-4">Fitout Cost Estimator</h1>
          <p className="text-white/60 font-light text-lg leading-relaxed">
            Based on the YOS Fitout Cost Guide — Newcastle and Hunter Region market rates, April 2026.
            Category A base building. All figures ex GST.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-[5%]">

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-near-black font-semibold text-sm mb-2">Floor area (m²)</label>
              <input
                type="number"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. 300"
                className="w-full border border-gray-300 rounded px-4 py-3 text-near-black font-light focus:outline-none focus:border-teal transition-colors"
              />
            </div>
            <div>
              <label className="block text-near-black font-semibold text-sm mb-2">
                Number of workstations <span className="text-mid-grey font-light">(for furniture estimate)</span>
              </label>
              <input
                type="number"
                value={desks}
                onChange={e => setDesks(e.target.value)}
                placeholder="e.g. 20"
                className="w-full border border-gray-300 rounded px-4 py-3 text-near-black font-light focus:outline-none focus:border-teal transition-colors"
              />
            </div>
          </div>

          {/* Tier selector */}
          <div className="mb-10">
            <label className="block text-near-black font-semibold text-sm mb-4">Fitout quality</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(TIERS) as [TierKey, typeof TIERS[TierKey]][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setTier(key)}
                  className={`text-left p-6 rounded-sm border-2 transition-all duration-200 ${
                    tier === key ? 'border-teal bg-light-teal' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-bold text-base mb-2 ${tier === key ? 'text-teal' : 'text-near-black'}`}>{val.label}</p>
                  <p className="text-mid-grey font-light text-xs leading-relaxed">{val.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            className="bg-teal text-white font-semibold text-base px-10 py-4 rounded hover:bg-dark-teal transition-colors duration-200 w-full md:w-auto"
          >
            Calculate estimate
          </button>

          {/* Results */}
          {result && (
            <div className="mt-12 space-y-6">
              <div className="bg-warm-grey rounded-sm p-10">
                <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase mb-8">Cost breakdown — {t.label} finish</p>

                <div className="space-y-4">
                  {[
                    { label: 'Pre-construction (design, PM, engineers, approvals)', low: result.preConLow, high: result.preConHigh },
                    { label: 'Construction — structure (partitions, ceilings, strip-out)', low: result.structureLow, high: result.structureHigh },
                    { label: 'Construction — finishes (flooring, joinery, painting)', low: result.finishesLow, high: result.finishesHigh },
                    { label: 'Construction — services (HVAC, electrical, plumbing, fire)', low: result.servicesLow, high: result.servicesHigh },
                    { label: 'Technology (data, WiFi, AV, access control)', low: result.techLow, high: result.techHigh },
                    ...(result.furnitureLow > 0 ? [{ label: 'Furniture & fit-out (desks, chairs — per workstation)', low: result.furnitureLow, high: result.furnitureHigh }] : [])
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-3 border-b border-gray-200">
                      <p className="text-charcoal font-light text-sm pr-4">{row.label}</p>
                      <p className="text-near-black font-semibold text-sm whitespace-nowrap">
                        {fmt(row.low)} – {fmt(row.high)}
                      </p>
                    </div>
                  ))}

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <p className="text-charcoal font-semibold text-sm">Subtotal (ex contingency)</p>
                    <p className="text-near-black font-bold text-sm">{fmt(result.subtotalLow)} – {fmt(result.subtotalHigh)}</p>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <p className="text-charcoal font-light text-sm">
                      Contingency ({Math.round(t.contingency * 100)}%)
                    </p>
                    <p className="text-near-black font-semibold text-sm">{fmt(result.contingencyLow)} – {fmt(result.contingencyHigh)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-teal flex justify-between items-end">
                  <div>
                    <p className="text-mid-grey font-light text-xs mb-1">Total estimated range (ex GST)</p>
                    <p className="text-teal font-bold text-4xl">{fmt(result.totalLow)}</p>
                    <p className="text-teal font-semibold text-xl">to {fmt(result.totalHigh)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-mid-grey font-light text-xs mb-1">Per m²</p>
                    <p className="text-near-black font-bold text-xl">
                      {fmt(result.totalLow / parseFloat(area))} – {fmt(result.totalHigh / parseFloat(area))}/m²
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-near-black rounded-sm p-8">
                <p className="text-white font-semibold text-sm mb-3">What&apos;s not included in this estimate</p>
                <ul className="space-y-2">
                  {[
                    'GST — add 10% to all figures above',
                    'Make-good obligations at lease end ($50–$200/m² depending on your lease)',
                    'Stamp duty and legal costs on the lease',
                    'Landlord approval and building management charges',
                    'Moving and transition costs ($6,000–$55,000 depending on size and complexity)'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2" />
                      <p className="text-white/60 font-light text-sm">{item}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-white/40 font-light text-xs mt-6">
                  Rates benchmarked to Category A base building, Newcastle / Hunter Region, April 2026. Category B (existing fitout) or Shell & Core base conditions will vary significantly. This is a planning guide, not a quote.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-near-black py-20 text-center">
        <div className="max-w-2xl mx-auto px-[5%]">
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">Want a real quote?</h2>
          <p className="text-white/60 font-light text-lg mb-8">
            We&apos;ll visit your site, review your brief, and put together a detailed fitout budget — from pre-construction through to furniture and moving costs.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a Fitout Consultation</Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
