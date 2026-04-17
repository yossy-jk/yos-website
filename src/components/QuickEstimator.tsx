'use client'
import { useState } from 'react'
import Link from 'next/link'

// Rates from YOS Fitout Cost Guide April 2026 (ex GST, per sqm)
const TIERS = [
  { label: 'Basic', min: 800, max: 1200, desc: 'Functional, clean finish', highlight: false },
  { label: 'Midrange', min: 1400, max: 2000, desc: 'Professional standard', highlight: true },
  { label: 'Premium', min: 2500, max: 4000, desc: 'High-spec, bespoke', highlight: false },
]

export default function QuickEstimator() {
  const [sqm, setSqm] = useState(120)

  return (
    <div className="bg-white border border-gray-100 rounded-sm p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <p className="text-near-black font-black text-base tracking-tight">Fitout Cost Estimator</p>
        <span className="bg-teal/10 text-teal font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
          Newcastle rates
        </span>
      </div>
      <p className="text-mid-grey text-xs mb-6 font-light">Drag to estimate — April 2026 market rates</p>

      <div className="mb-7">
        <div className="flex justify-between items-center mb-3">
          <span className="text-charcoal text-sm font-medium">Office size</span>
          <span className="text-near-black font-black text-lg">{sqm} <span className="text-mid-grey font-light text-sm">sqm</span></span>
        </div>
        <input
          type="range"
          min={30}
          max={500}
          step={10}
          value={sqm}
          onChange={e => setSqm(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#00B5A5' }}
        />
        <div className="flex justify-between text-xs text-mid-grey mt-2 font-light">
          <span>30 sqm</span>
          <span>500 sqm</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {TIERS.map(tier => {
          const lo = Math.round((tier.min * sqm) / 1000)
          const hi = Math.round((tier.max * sqm) / 1000)
          return (
            <div
              key={tier.label}
              className={`border-2 p-3 rounded-sm text-center transition-colors ${
                tier.highlight ? 'border-teal bg-teal/5' : 'border-gray-200'
              }`}
            >
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: tier.highlight ? '#00B5A5' : '#9B9B9B' }}>
                {tier.label}
              </p>
              <p className="text-near-black font-black text-sm leading-tight">
                ${lo}k–${hi}k
              </p>
              <p className="text-[9px] text-mid-grey font-light mt-0.5">{tier.desc}</p>
            </div>
          )
        })}
      </div>

      <Link
        href="/resources/fitout-estimator"
        className="block w-full bg-near-black text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded-sm text-center no-underline hover:bg-teal transition-colors duration-200"
      >
        Get Full Breakdown →
      </Link>
      <p className="text-mid-grey text-[10px] text-center mt-3 font-light">Ex GST · Excludes FF&E, AV & IT</p>
    </div>
  )
}
