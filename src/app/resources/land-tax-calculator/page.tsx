'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import ToolGate from '@/components/ToolGate'

const SEC = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}
function fmtPct(n: number, dp = 3) { return n.toFixed(dp) + '%' }
function parseNum(s: string) { return parseFloat(s.replace(/[$,]/g, '')) || 0 }

type LTState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'
type OwnerType = 'individual' | 'trust'

interface LandTaxResult {
  annualTax: number
  effectiveRate: number
  monthlyEquivalent: number
  percentOfGrossRent?: number
  thresholdNote: string
  aboveThreshold: boolean
  threshold: number
  calcNote?: string
  breakdown: Array<{ label: string; value: string; highlight?: boolean }>
}

// ─── Per-state land tax calculation functions ───────────────────────────────

function calcNSW(value: number, ownerType: OwnerType): LandTaxResult {
  const threshold = ownerType === 'trust' ? 0 : 1075000
  let tax = 0
  let thresholdNote: string
  let calcNote: string | undefined

  if (ownerType === 'trust') {
    // NSW trusts: no threshold, same progressive brackets as individuals applied from $0
    // Revenue NSW: $100 + 1.6% on value over $0 up to $5,605,000; then higher rates
    if (value <= 0) {
      tax = 0
      thresholdNote = 'No land value — no tax payable.'
    } else if (value <= 5605000) {
      tax = 100 + value * 0.016
      thresholdNote = 'No threshold for trusts. Progressive rates apply from $0.'
      calcNote = `$100 + ${fmt(value)} × 1.6% = ${fmt(tax)}`
    } else {
      tax = 100 + 5605000 * 0.016 + (value - 5605000) * 0.02
      thresholdNote = 'No threshold for trusts. Progressive rates apply from $0.'
      calcNote = `$100 + ($5,605,000 × 1.6%) + (${fmt(value)} − $5,605,000) × 2.0% = ${fmt(tax)}`
    }
  } else {
    if (value <= 1075000) {
      tax = 0
      thresholdNote = `Below the $1,075,000 nil threshold. No land tax payable.`
    } else if (value <= 6680000) {
      tax = 100 + (value - 1075000) * 0.016
      thresholdNote = `Above the $1,075,000 threshold.`
      calcNote = `$100 + (${fmt(value)} − $1,075,000) × 1.6% = ${fmt(tax)}`
    } else {
      tax = 89780 + (value - 6680000) * 0.02
      thresholdNote = `Above the $6,680,000 upper threshold.`
      calcNote = `$89,780 + (${fmt(value)} − $6,680,000) × 2.0% = ${fmt(tax)}`
    }
  }

  return buildResult(tax, value, threshold, thresholdNote, calcNote, ownerType)
}

function calcVIC(value: number, ownerType: OwnerType): LandTaxResult {
  const threshold = ownerType === 'trust' ? 25000 : 50000
  let tax = 0
  let thresholdNote: string
  let calcNote: string | undefined

  function vicIndividual(v: number): number {
    if (v <= 50000) return 0
    if (v <= 100000) return v * 0.0002
    if (v <= 250000) return 10 + (v - 100000) * 0.002
    if (v <= 600000) return 310 + (v - 250000) * 0.005
    if (v <= 1000000) return 2060 + (v - 600000) * 0.008
    if (v <= 1800000) return 5260 + (v - 1000000) * 0.013
    if (v <= 3000000) return 15660 + (v - 1800000) * 0.0205
    return 40260 + (v - 3000000) * 0.0255
  }

  if (ownerType === 'individual') {
    if (value <= 50000) {
      tax = 0
      thresholdNote = `Below the $50,000 nil threshold. No land tax payable.`
    } else {
      tax = vicIndividual(value)
      thresholdNote = `Above the $50,000 threshold.`
    }
  } else {
    // Trust: threshold $25k, individual rates + 0.375% surcharge on value over $25k
    if (value <= 25000) {
      tax = 0
      thresholdNote = `Below the $25,000 nil threshold (trusts). No land tax payable.`
    } else {
      const surcharge = (value - 25000) * 0.00375
      const indTax = vicIndividual(value)
      tax = indTax + surcharge
      thresholdNote = `Above the $25,000 threshold (trusts). Standard rates + 0.375% surcharge on value over $25,000.`
      calcNote = `Individual rate (${fmt(indTax)}) + surcharge (${fmt(value)} − $25,000) × 0.375% = ${fmt(tax)}`
    }
  }

  return buildResult(tax, value, threshold, thresholdNote, calcNote, ownerType)
}

function calcQLD(value: number, ownerType: OwnerType): LandTaxResult {
  const threshold = ownerType === 'trust' ? 350000 : 750000
  let tax = 0
  let thresholdNote: string
  let calcNote: string | undefined

  if (ownerType === 'trust') {
    if (value <= 350000) {
      tax = 0
      thresholdNote = `Below the $350,000 nil threshold (companies and trusts). No land tax payable.`
    } else {
      tax = (value - 350000) * 0.0175
      thresholdNote = `Above the $350,000 threshold (companies and trusts).`
      calcNote = `(${fmt(value)} − $350,000) × 1.75% = ${fmt(tax)}`
    }
  } else {
    // Individual
    if (value <= 750000) {
      tax = 0
      thresholdNote = `Below the $750,000 nil threshold. No land tax payable.`
    } else if (value <= 2250000) {
      tax = (value - 750000) * 0.01
      thresholdNote = `Above the $750,000 threshold.`
      calcNote = `(${fmt(value)} − $750,000) × 1.0% = ${fmt(tax)}`
    } else if (value <= 5000000) {
      tax = 15000 + (value - 2250000) * 0.0175
      thresholdNote = `Above the $2,250,000 threshold.`
      calcNote = `$15,000 + (${fmt(value)} − $2,250,000) × 1.75% = ${fmt(tax)}`
    } else if (value <= 10000000) {
      // Gap $5M–$10M — rates unconfirmed in brief, estimate based on continuation
      tax = 63125 + (value - 5000000) * 0.025
      thresholdNote = `Above $5,000,000. Note: QLD rates in the $5M–$10M range should be verified with the Queensland Office of State Revenue.`
      calcNote = `Estimated: $63,125 + (${fmt(value)} − $5,000,000) × 2.5% = ${fmt(tax)} (unconfirmed — verify with QLD OSR)`
    } else {
      tax = 125625 + (value - 10000000) * 0.0275
      thresholdNote = `Above the $10,000,000 threshold.`
      calcNote = `$125,625 + (${fmt(value)} − $10,000,000) × 2.75% = ${fmt(tax)}`
    }
  }

  return buildResult(tax, value, threshold, thresholdNote, calcNote, ownerType)
}

function calcWA(value: number, ownerType: OwnerType): LandTaxResult {
  // WA rates are the same for individuals and companies/trusts
  const threshold = 300000
  let tax = 0
  let thresholdNote: string
  let calcNote: string | undefined

  if (value <= 300000) {
    tax = 0
    thresholdNote = `Below the $300,000 nil threshold. No land tax payable.`
  } else if (value <= 420000) {
    tax = (value - 300000) * 0.0025
    thresholdNote = `Above the $300,000 threshold.`
    calcNote = `(${fmt(value)} − $300,000) × 0.25% = ${fmt(tax)}`
  } else if (value <= 1000000) {
    tax = 300 + (value - 420000) * 0.009
    thresholdNote = `Above the $420,000 threshold.`
    calcNote = `$300 + (${fmt(value)} − $420,000) × 0.9% = ${fmt(tax)}`
  } else if (value <= 1800000) {
    tax = 5520 + (value - 1000000) * 0.014
    thresholdNote = `Above the $1,000,000 threshold.`
    calcNote = `$5,520 + (${fmt(value)} − $1,000,000) × 1.4% = ${fmt(tax)}`
  } else if (value <= 5000000) {
    tax = 16720 + (value - 1800000) * 0.019
    thresholdNote = `Above the $1,800,000 threshold.`
    calcNote = `$16,720 + (${fmt(value)} − $1,800,000) × 1.9% = ${fmt(tax)}`
  } else if (value <= 11000000) {
    // Gap $5M–$11M — estimate continuation
    tax = 77520 + (value - 5000000) * 0.024
    thresholdNote = `Above $5,000,000. Note: WA rates in the $5M–$11M range should be verified with the WA Office of State Revenue.`
    calcNote = `Estimated: $77,520 + (${fmt(value)} − $5,000,000) × 2.4% = ${fmt(tax)} (unconfirmed — verify with WA OSR)`
  } else {
    tax = 221520 + (value - 11000000) * 0.0267
    thresholdNote = `Above the $11,000,000 threshold.`
    calcNote = `$221,520 + (${fmt(value)} − $11,000,000) × 2.67% = ${fmt(tax)}`
  }

  void ownerType
  return buildResult(tax, value, threshold, thresholdNote, calcNote, ownerType)
}

function calcSA(value: number, ownerType: OwnerType): LandTaxResult {
  const threshold = ownerType === 'trust' ? 0 : 763000
  let tax = 0
  let thresholdNote: string
  let calcNote: string | undefined

  if (ownerType === 'trust') {
    tax = value * 0.005
    thresholdNote = 'No threshold for trusts. 0.5% flat rate applies from $0.'
    calcNote = `$${value.toLocaleString()} × 0.5% = ${fmt(tax)}`
  } else {
    if (value <= 763000) {
      tax = 0
      thresholdNote = `Below the $763,000 nil threshold. No land tax payable.`
    } else if (value <= 1190000) {
      tax = (value - 763000) * 0.005
      thresholdNote = `Above the $763,000 threshold.`
      calcNote = `(${fmt(value)} − $763,000) × 0.5% = ${fmt(tax)}`
    } else if (value <= 1530000) {
      tax = 2135 + (value - 1190000) * 0.01
      thresholdNote = `Above the $1,190,000 threshold.`
      calcNote = `$2,135 + (${fmt(value)} − $1,190,000) × 1.0% = ${fmt(tax)}`
    } else {
      tax = 5535 + (value - 1530000) * 0.024
      thresholdNote = `Above the $1,530,000 threshold.`
      calcNote = `$5,535 + (${fmt(value)} − $1,530,000) × 2.4% = ${fmt(tax)}`
    }
  }

  return buildResult(tax, value, threshold, thresholdNote, calcNote, ownerType)
}

function calcTAS(value: number, ownerType: OwnerType): LandTaxResult {
  const threshold = 100000
  let tax = 0
  let thresholdNote: string
  let calcNote: string | undefined

  // TAS same rates for individuals and companies/trusts
  if (value <= 100000) {
    tax = 0
    thresholdNote = `Below the $100,000 nil threshold. No land tax payable.`
  } else if (value <= 350000) {
    tax = 50 + (value - 100000) * 0.0055
    thresholdNote = `Above the $100,000 threshold.`
    calcNote = `$50 + (${fmt(value)} − $100,000) × 0.55% = ${fmt(tax)}`
  } else if (value <= 750000) {
    tax = 1425 + (value - 350000) * 0.01
    thresholdNote = `Above the $350,000 threshold.`
    calcNote = `$1,425 + (${fmt(value)} − $350,000) × 1.0% = ${fmt(tax)}`
  } else {
    tax = 5425 + (value - 750000) * 0.015
    thresholdNote = `Above the $750,000 threshold.`
    calcNote = `$5,425 + (${fmt(value)} − $750,000) × 1.5% = ${fmt(tax)}`
  }

  void ownerType
  return buildResult(tax, value, threshold, thresholdNote, calcNote, ownerType)
}

function calcACT(value: number, ownerType: OwnerType): LandTaxResult {
  // ACT: all investment property pays, no threshold
  const threshold = 0
  let tax = 0
  let calcNote: string | undefined

  // ACT: Fixed $1,326 + progressive rates
  // Rate 1: 0.54% on first $150k
  // Rate 2: 0.64% on $150k–$275k portion
  // Rate 3: 1.09% on $275k–$2,000k portion
  // Rate 4: 1.12% on excess over $2,000k
  const base = 1326
  const r1 = Math.min(value, 150000) * 0.0054
  const r2 = Math.max(0, Math.min(value, 275000) - 150000) * 0.0064
  const r3 = Math.max(0, Math.min(value, 2000000) - 275000) * 0.0109
  const r4 = Math.max(0, value - 2000000) * 0.0112
  tax = base + r1 + r2 + r3 + r4

  calcNote = `$1,326 fixed + progressive rates on ${fmt(value)}`

  void ownerType
  return buildResult(
    tax, value, threshold,
    'All investment property in the ACT is subject to land tax. No nil threshold.',
    calcNote, ownerType
  )
}

function buildResult(
  tax: number,
  value: number,
  threshold: number,
  thresholdNote: string,
  calcNote: string | undefined,
  ownerType: OwnerType
): LandTaxResult {
  const effectiveRate = value > 0 ? (tax / value) * 100 : 0
  const monthlyEquivalent = tax / 12
  const aboveThreshold = tax > 0

  const breakdown: Array<{ label: string; value: string; highlight?: boolean }> = [
    { label: 'Land value (unimproved)', value: fmt(value) },
    { label: 'Owner type', value: ownerType === 'trust' ? 'Company or Trust' : 'Individual' },
    { label: 'Annual land tax', value: fmt(tax), highlight: true },
    { label: 'Effective rate', value: fmtPct(effectiveRate) },
    { label: 'Monthly equivalent', value: fmt(monthlyEquivalent) },
  ]

  return { annualTax: tax, effectiveRate, monthlyEquivalent, thresholdNote, aboveThreshold, threshold, calcNote, breakdown }
}

function calcLandTax(state: LTState, value: number, ownerType: OwnerType): LandTaxResult | null {
  if (!value) return null
  switch (state) {
    case 'NSW': return calcNSW(value, ownerType)
    case 'VIC': return calcVIC(value, ownerType)
    case 'QLD': return calcQLD(value, ownerType)
    case 'WA': return calcWA(value, ownerType)
    case 'SA': return calcSA(value, ownerType)
    case 'TAS': return calcTAS(value, ownerType)
    case 'ACT': return calcACT(value, ownerType)
    case 'NT': return null  // handled separately
  }
}

const STATE_NAMES: Record<LTState, string> = {
  NSW: 'New South Wales', VIC: 'Victoria', QLD: 'Queensland',
  WA: 'Western Australia', SA: 'South Australia', TAS: 'Tasmania',
  ACT: 'Australian Capital Territory', NT: 'Northern Territory',
}

const LT_STATES: LTState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export default function LandTaxCalculatorPage() {
  const [selectedState, setSelectedState] = useState<LTState | ''>('')
  const [landValue, setLandValue] = useState('')
  const [ownerType, setOwnerType] = useState<OwnerType>('individual')
  const [weeklyRent, setWeeklyRent] = useState('')
  const [result, setResult] = useState<LandTaxResult | null>(null)
  const [isNT, setIsNT] = useState(false)

  const valueNum = parseNum(landValue)
  const rentNum = parseNum(weeklyRent)
  const canCalc = !!selectedState && valueNum > 0

  function handleCalc() {
    if (!selectedState || !valueNum) return
    if (selectedState === 'NT') {
      setIsNT(true)
      setResult(null)
      return
    }
    setIsNT(false)
    const r = calcLandTax(selectedState as LTState, valueNum, ownerType)
    if (r) {
      if (rentNum > 0) {
        const annualGross = rentNum * 52
        r.percentOfGrossRent = annualGross > 0 ? (r.annualTax / annualGross) * 100 : undefined
        if (r.percentOfGrossRent !== undefined) {
          r.breakdown.push({ label: '% of gross annual rent', value: fmtPct(r.percentOfGrossRent, 1) })
        }
      }
    }
    setResult(r)
  }

  function handleReset() {
    setResult(null)
    setIsNT(false)
    setLandValue('')
    setWeeklyRent('')
    setSelectedState('')
    setOwnerType('individual')
  }

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(6rem,14vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ ...WRAP, paddingTop: 'clamp(4rem,8vw,6rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>

          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl" style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}>
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-6" style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
              <h1 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                Land Tax Calculator
              </h1>
              <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
                Annual land tax liability for commercial and investment property across all Australian states. 2025-26 thresholds and rates. Know your holding costs before you buy.
              </p>
            </div>
          </FadeIn>

          {/* Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: "clamp(2.5rem,6vw,5rem)" }}>

            {/* Inputs */}
            <FadeIn delay={60}>
              <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Property details</p>

              <div className="flex flex-col" style={{ gap: '2.5rem' }}>
                {/* State */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    State / Territory <span className="text-teal">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {LT_STATES.map(s => (
                      <button key={s} onClick={() => { setSelectedState(s); setResult(null); setIsNT(false) }}
                        className={`font-bold border transition-colors text-center ${selectedState === s ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.88rem' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {selectedState && (
                    <p className="text-white/30 mt-2 font-light" style={{ fontSize: '0.75rem' }}>{STATE_NAMES[selectedState]}</p>
                  )}
                </div>

                {/* Land value */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Land value — unimproved ($) <span className="text-teal">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={landValue} onChange={e => { setLandValue(e.target.value); setResult(null); setIsNT(false) }}
                      placeholder="600,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                  <p className="text-white/25 font-light mt-1" style={{ fontSize: '0.75rem' }}>Use the unimproved capital value (UCV) from your council rates notice.</p>
                </div>

                {/* Owner type */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Owner type
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'individual' as const, label: 'Individual' },
                      { value: 'trust' as const, label: 'Company or Trust' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => { setOwnerType(opt.value); setResult(null) }}
                        className={`font-semibold border transition-colors ${ownerType === opt.value ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/25 font-light mt-2" style={{ fontSize: '0.75rem' }}>Trusts and companies often have lower thresholds and higher rates.</p>
                </div>

                {/* Weekly rent — optional */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Weekly rent ($) <span className="text-white/30 font-light">optional — for context</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={weeklyRent} onChange={e => { setWeeklyRent(e.target.value); setResult(null) }}
                      placeholder="1,200"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                  <p className="text-white/25 font-light mt-1" style={{ fontSize: '0.75rem' }}>Shows land tax as a % of gross rent so you can compare it against yield.</p>
                </div>

                <button onClick={handleCalc} disabled={!canCalc}
                  className={`font-bold transition-all ${canCalc ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.25rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'flex-start', borderRadius: '0.5rem' }}>
                  Calculate →
                </button>
              </div>
            </FadeIn>

            {/* Results */}
            <FadeIn delay={120}>
              {!result && !isNT ? (
                <div className="border border-white/8 bg-white/3" style={{ padding: '2.5rem 2rem' }}>
                  <p className="text-white/25 font-light text-center" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Select a state and enter the land value to calculate annual land tax.
                  </p>
                </div>
              ) : isNT ? (
                <div className="border border-white/15 bg-white/3" style={{ padding: '2.5rem 2rem' }}>
                  <p className="text-teal font-semibold uppercase tracking-[0.2em] mb-3" style={{ fontSize: '0.7rem' }}>Northern Territory</p>
                  <p className="text-white font-black mb-3" style={{ fontSize: '1.5rem' }}>No land tax in the NT.</p>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                    The Northern Territory does not levy land tax on property owners. This is one reason the NT can be attractive for certain investment strategies.
                  </p>
                </div>
              ) : result ? (
                <div>
                  <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>
                    {selectedState} — {fmt(valueNum)}
                  </p>

                  {/* Threshold comparison — shown instantly, no gate */}
                  <div className={`border mb-6 ${result.aboveThreshold ? 'border-teal/30 bg-teal/10' : 'border-white/15 bg-white/5'}`} style={{ padding: '1.5rem' }}>
                    <p className={`font-semibold uppercase tracking-widest mb-1 ${result.aboveThreshold ? 'text-teal/70' : 'text-white/40'}`} style={{ fontSize: '0.65rem' }}>
                      Threshold status
                    </p>
                    <p className={`font-black leading-tight mb-2 ${result.aboveThreshold ? 'text-teal' : 'text-white/60'}`} style={{ fontSize: '1.3rem' }}>
                      {result.aboveThreshold ? 'Above threshold — land tax applies' : 'Below threshold — no land tax'}
                    </p>
                    <p className="text-white/50 font-light" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                      {result.thresholdNote}
                    </p>
                  </div>

                  {/* Full calculation — behind ToolGate */}
                  {result.aboveThreshold ? (
                    <ToolGate
                      tool="Land Tax Calculator"
                      context={() => `State: ${selectedState} | Land value: $${valueNum} | Owner: ${ownerType} | Annual land tax: $${Math.round(result!.annualTax)}`}
                      heading="Unlock the full land tax calculation"
                      subheading="See annual tax, effective rate, monthly equivalent and more — free."
                      teaser={
                        <div>
                          <div className="border border-white/10">
                            <div className="border-b border-white/10 px-5 py-3">
                              <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Full calculation — unlock to view</p>
                            </div>
                            {['Annual land tax', 'Effective rate', 'Monthly equivalent', 'Calculation detail'].map((label, i) => (
                              <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-white/6">
                                <span className="text-white/50 font-light" style={{ fontSize: '0.875rem' }}>{label}</span>
                                <span className="w-24 h-3 bg-white/10 rounded-lg" />
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      {/* Full breakdown */}
                      <div className="border border-white/10 mb-5">
                        <div className="border-b border-white/10 px-5 py-3">
                          <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Land tax calculation</p>
                        </div>
                        {result.breakdown.map((row, i) => (
                          <div key={i} className={`flex justify-between items-center px-5 py-4 border-b border-white/6 ${row.highlight ? 'bg-teal/10' : ''}`}>
                            <span className={`font-light ${row.highlight ? 'text-teal font-semibold' : 'text-white/70'}`} style={{ fontSize: '0.875rem' }}>{row.label}</span>
                            <span className={`font-bold ${row.highlight ? 'text-teal' : 'text-white'}`} style={{ fontSize: '0.9rem' }}>{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {result.calcNote && (
                        <div className="border border-white/8 bg-white/3 px-4 py-3 mb-4">
                          <p className="text-white/40 font-light mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Calculation</p>
                          <p className="text-white/60 font-light" style={{ fontSize: '0.82rem' }}>{result.calcNote}</p>
                        </div>
                      )}

                      <p className="text-white/25 font-light mb-4 leading-relaxed" style={{ fontSize: '0.75rem', lineHeight: 1.7 }}>
                        This is an estimate only. Verify with a qualified accountant or solicitor before making decisions.
                      </p>

                      <button onClick={handleReset} className="text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                        ← Reset
                      </button>
                    </ToolGate>
                  ) : (
                    <div>
                      <p className="text-white/25 font-light leading-relaxed" style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>
                        No land tax payable at this value. If the land value rises above the threshold, land tax will apply. Use this tool to model different values.
                      </p>
                      <button onClick={handleReset} className="block mt-4 text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                        ← Reset
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </FadeIn>
          </div>

          {/* spacer */}
          <div style={{ paddingBottom: 'clamp(4rem,8vw,6rem)' }} />

          {/* CTA */}
          <div className="mt-20 md:mt-28 pt-12 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Know your holding costs</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              Land tax is one of the holding costs most buyers underestimate. We model the full picture.
            </h2>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
              style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
              Book a Buyer Consultation →
            </a>
          </div>

        </div>
      </div>

      {/* CTA section */}
      <section className="bg-teal" style={SEC}>
        <div className="max-w-screen-xl mx-auto text-center" style={WRAP}>
          <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
            Land tax changes the return. Model it before you buy.
          </h2>
          <p className="text-white/80 font-light leading-relaxed mb-12 mx-auto"
            style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
            Our buyers agency team models acquisition costs, holding costs, and exit scenarios so you walk in with your eyes open.
          </p>
          <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-teal font-bold no-underline hover:bg-light-teal transition-colors"
            style={{ padding: '1.25rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '0.5rem' }}>
            Book a Clarity Call
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
