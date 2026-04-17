'use client'
import { useState } from 'react'
import Link from 'next/link'

const TIERS = [
  { label: 'Basic', min: 800, max: 1200, desc: 'Functional, clean finish', highlight: false },
  { label: 'Midrange', min: 1400, max: 2000, desc: 'Professional standard', highlight: true },
  { label: 'Premium', min: 2500, max: 4000, desc: 'High-spec, bespoke', highlight: false },
]

export default function QuickEstimator() {
  const [sqm, setSqm] = useState(120)

  // Progress % for the filled-track gradient
  const pct = Math.round(((sqm - 30) / (500 - 30)) * 100)

  return (
    <div className="bg-white border border-gray-100 rounded-sm p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <p className="text-near-black font-black text-base tracking-tight">Fitout Cost Estimator</p>
        <span className="bg-teal/10 text-teal font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
          Newcastle rates
        </span>
      </div>
      <p className="text-mid-grey text-xs mb-7 font-light">Drag to estimate — April 2026 market rates</p>

      <div className="mb-8">
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-charcoal text-sm font-medium">Office size</span>
          <span className="text-near-black font-black text-2xl leading-none">
            {sqm} <span className="text-mid-grey font-light text-sm">sqm</span>
          </span>
        </div>

        {/* Styled range — global CSS handles thumb; gradient fills the track */}
        <input
          type="range"
          min={30}
          max={500}
          step={10}
          value={sqm}
          onChange={e => setSqm(Number(e.target.value))}
          aria-label="Office size in square metres"
          aria-valuemin={30}
          aria-valuemax={500}
          aria-valuenow={sqm}
          className="w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00B5A5 ${pct}%, #E0F5F3 ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-mid-grey mt-2.5 font-light">
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
              className={[
                'border-2 p-3 rounded-sm text-center transition-all duration-200',
                tier.highlight
                  ? 'border-teal bg-teal/5 shadow-sm'
                  : 'border-gray-200',
              ].join(' ')}
            >
              <p className={[
                'text-[10px] font-black tracking-widest uppercase mb-1',
                tier.highlight ? 'text-teal' : 'text-mid-grey',
              ].join(' ')}>
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
        className="block w-full bg-near-black text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded-sm text-center no-underline hover:bg-teal hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-[44px] flex items-center justify-center"
      >
        Get Full Breakdown →
      </Link>
      <p className="text-mid-grey text-[10px] text-center mt-3 font-light">Ex GST · Excludes FF&amp;E, AV &amp; IT</p>
    </div>
  )
}
