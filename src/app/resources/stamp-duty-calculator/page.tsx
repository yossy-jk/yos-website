'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

const SEC = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}
function fmtPct(n: number) { return n.toFixed(3) + '%' }
function parseNum(s: string) { return parseFloat(s.replace(/[$,]/g, '')) || 0 }

type State = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

interface Bracket {
  prevMax: number
  maxVal: number
  rate: number
  label: string
}

interface DutyResult {
  duty: number
  effectiveRate: number
  totalCost: number
  breakdown: Array<{ range: string; taxable: number; rate: number; tax: number }>
  note?: string
}

// Per-bracket progressive calculation (stamp duty is progressive)
function calcBrackets(value: number, brackets: Bracket[]): { duty: number; breakdown: Array<{ range: string; taxable: number; rate: number; tax: number }> } {
  const breakdown: Array<{ range: string; taxable: number; rate: number; tax: number }> = []
  let duty = 0
  for (const b of brackets) {
    if (value <= b.prevMax) break
    const top = b.maxVal === Infinity ? value : Math.min(value, b.maxVal)
    const taxable = top - b.prevMax
    if (taxable <= 0) continue
    const tax = taxable * b.rate
    duty += tax
    breakdown.push({ range: b.label, taxable, rate: b.rate, tax })
    if (value <= b.maxVal) break
  }
  return { duty, breakdown }
}

const BRACKETS: Record<State, Bracket[]> = {
  NSW: [
    { prevMax: 0, maxVal: 17000, rate: 0.0125, label: '$0 – $17,000 at 1.25%' },
    { prevMax: 17000, maxVal: 37000, rate: 0.015, label: '$17,001 – $37,000 at 1.5%' },
    { prevMax: 37000, maxVal: 99000, rate: 0.0175, label: '$37,001 – $99,000 at 1.75%' },
    { prevMax: 99000, maxVal: 372000, rate: 0.035, label: '$99,001 – $372,000 at 3.5%' },
    { prevMax: 372000, maxVal: 1240000, rate: 0.045, label: '$372,001 – $1,240,000 at 4.5%' },
    { prevMax: 1240000, maxVal: Infinity, rate: 0.055, label: '$1,240,001+ at 5.5%' },
  ],
  VIC: [
    { prevMax: 0, maxVal: 25000, rate: 0.014, label: '$0 – $25,000 at 1.4%' },
    { prevMax: 25000, maxVal: 130000, rate: 0.024, label: '$25,001 – $130,000 at 2.4%' },
    { prevMax: 130000, maxVal: 960000, rate: 0.06, label: '$130,001 – $960,000 at 6.0%' },
    { prevMax: 960000, maxVal: 2000000, rate: 0.06, label: '$960,001 – $2,000,000 at 6.0%' },
    { prevMax: 2000000, maxVal: Infinity, rate: 0.065, label: '$2,000,001+ at 6.5%' },
  ],
  QLD: [
    { prevMax: 0, maxVal: 5000, rate: 0, label: '$0 – $5,000 (Nil)' },
    { prevMax: 5000, maxVal: 75000, rate: 0.015, label: '$5,001 – $75,000 at 1.5%' },
    { prevMax: 75000, maxVal: 540000, rate: 0.035, label: '$75,001 – $540,000 at 3.5%' },
    { prevMax: 540000, maxVal: 1000000, rate: 0.045, label: '$540,001 – $1,000,000 at 4.5%' },
    { prevMax: 1000000, maxVal: Infinity, rate: 0.0575, label: '$1,000,001+ at 5.75%' },
  ],
  WA: [
    { prevMax: 0, maxVal: 120000, rate: 0.019, label: '$0 – $120,000 at 1.9%' },
    { prevMax: 120000, maxVal: 150000, rate: 0.0285, label: '$120,001 – $150,000 at 2.85%' },
    { prevMax: 150000, maxVal: 360000, rate: 0.038, label: '$150,001 – $360,000 at 3.8%' },
    { prevMax: 360000, maxVal: 725000, rate: 0.0475, label: '$360,001 – $725,000 at 4.75%' },
    { prevMax: 725000, maxVal: Infinity, rate: 0.0515, label: '$725,001+ at 5.15%' },
  ],
  SA: [
    { prevMax: 0, maxVal: 12000, rate: 0, label: '$0 – $12,000 (Nil)' },
    { prevMax: 12000, maxVal: 30000, rate: 0.01, label: '$12,001 – $30,000 at 1.0%' },
    { prevMax: 30000, maxVal: 50000, rate: 0.02, label: '$30,001 – $50,000 at 2.0%' },
    { prevMax: 50000, maxVal: 100000, rate: 0.03, label: '$50,001 – $100,000 at 3.0%' },
    { prevMax: 100000, maxVal: 200000, rate: 0.035, label: '$100,001 – $200,000 at 3.5%' },
    { prevMax: 200000, maxVal: 250000, rate: 0.04, label: '$200,001 – $250,000 at 4.0%' },
    { prevMax: 250000, maxVal: 300000, rate: 0.0425, label: '$250,001 – $300,000 at 4.25%' },
    { prevMax: 300000, maxVal: 500000, rate: 0.0475, label: '$300,001 – $500,000 at 4.75%' },
    { prevMax: 500000, maxVal: Infinity, rate: 0.055, label: '$500,001+ at 5.5%' },
  ],
  TAS: [
    { prevMax: 0, maxVal: 3000, rate: 0, label: '$0 – $3,000 (Nil)' },
    { prevMax: 3000, maxVal: 25000, rate: 0.0175, label: '$3,001 – $25,000 at 1.75%' },
    { prevMax: 25000, maxVal: 75000, rate: 0.0225, label: '$25,001 – $75,000 at 2.25%' },
    { prevMax: 75000, maxVal: 200000, rate: 0.035, label: '$75,001 – $200,000 at 3.5%' },
    { prevMax: 200000, maxVal: 375000, rate: 0.04, label: '$200,001 – $375,000 at 4.0%' },
    { prevMax: 375000, maxVal: 725000, rate: 0.0425, label: '$375,001 – $725,000 at 4.25%' },
    { prevMax: 725000, maxVal: Infinity, rate: 0.045, label: '$725,001+ at 4.5%' },
  ],
  ACT: [
    { prevMax: 0, maxVal: 260000, rate: 0.006, label: '$0 – $260,000 at 0.60%' },
    { prevMax: 260000, maxVal: 300000, rate: 0.022, label: '$260,001 – $300,000 at 2.2%' },
    { prevMax: 300000, maxVal: 500000, rate: 0.034, label: '$300,001 – $500,000 at 3.4%' },
    { prevMax: 500000, maxVal: 750000, rate: 0.0432, label: '$500,001 – $750,000 at 4.32%' },
    { prevMax: 750000, maxVal: 1455000, rate: 0.059, label: '$750,001 – $1,455,000 at 5.9%' },
    { prevMax: 1455000, maxVal: Infinity, rate: 0.064, label: '$1,455,001+ at 6.4%' },
  ],
  NT: [], // handled separately
}

function calcDuty(state: State, value: number): DutyResult {
  const legalEstimate = value * 0.02
  const totalCostBase = (duty: number) => value + duty + legalEstimate

  if (state === 'NT') {
    const V = value / 1000
    const duty = value > 525000
      ? value * 0.0495
      : (0.06571441 * V * V + 15 * V) / 100
    const effectiveRate = value > 0 ? (duty / value) * 100 : 0
    return {
      duty,
      effectiveRate,
      totalCost: totalCostBase(duty),
      breakdown: [{
        range: value > 525000 ? 'Flat 4.95% rate (above $525,000)' : 'NT formula: (0.06571441 × V² + 15 × V) / 100',
        taxable: value,
        rate: effectiveRate / 100,
        tax: duty,
      }],
      note: 'Verify with NT Revenue for exact figures.',
    }
  }

  const { duty, breakdown } = calcBrackets(value, BRACKETS[state])
  const effectiveRate = value > 0 ? (duty / value) * 100 : 0
  return { duty, effectiveRate, totalCost: totalCostBase(duty), breakdown }
}

const STATE_NAMES: Record<State, string> = {
  NSW: 'New South Wales', VIC: 'Victoria', QLD: 'Queensland',
  WA: 'Western Australia', SA: 'South Australia', TAS: 'Tasmania',
  ACT: 'Australian Capital Territory', NT: 'Northern Territory',
}

export default function StampDutyCalculatorPage() {
  const [selectedState, setSelectedState] = useState<State | ''>('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [buyerType, setBuyerType] = useState<'individual' | 'company'>('individual')
  const [result, setResult] = useState<DutyResult | null>(null)

  const priceNum = parseNum(purchasePrice)
  const canCalc = !!selectedState && priceNum > 0

  function handleCalc() {
    if (!selectedState || !priceNum) return
    setResult(calcDuty(selectedState, priceNum))
  }

  function handleReset() {
    setResult(null)
    setPurchasePrice('')
    setSelectedState('')
    setBuyerType('individual')
  }

  const STATES: State[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ ...WRAP, paddingTop: 'clamp(2rem,5vw,4rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>

          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-6" style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
              <h1 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
                style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                Stamp Duty Calculator
              </h1>
              <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
                Commercial property transfer duty across all Australian states and territories. Rates are 2025-26 verified. Enter your details to see the full bracket breakdown.
              </p>
            </div>
          </FadeIn>

          {/* Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Inputs */}
            <FadeIn delay={60}>
              <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Property details</p>

              <div className="flex flex-col gap-6">
                {/* State */}
                <div>
                  <label className="block text-white/70 font-semibold mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    State / Territory <span className="text-teal">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {STATES.map(s => (
                      <button key={s} onClick={() => { setSelectedState(s); setResult(null) }}
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

                {/* Purchase price */}
                <div>
                  <label className="block text-white/70 font-semibold mb-2" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Purchase price ($) <span className="text-teal">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={purchasePrice} onChange={e => { setPurchasePrice(e.target.value); setResult(null) }}
                      placeholder="850,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                </div>

                {/* Buyer type */}
                <div>
                  <label className="block text-white/70 font-semibold mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Buyer type
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'individual' as const, label: 'Individual' },
                      { value: 'company' as const, label: 'Company or Trust' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => { setBuyerType(opt.value); setResult(null) }}
                        className={`font-semibold border transition-colors ${buyerType === opt.value ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/25 font-light mt-2" style={{ fontSize: '0.75rem' }}>Commercial property rates are the same for both buyer types in most states.</p>
                </div>

                <button onClick={handleCalc} disabled={!canCalc}
                  className={`font-bold transition-all ${canCalc ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                  Calculate →
                </button>
              </div>
            </FadeIn>

            {/* Results */}
            <FadeIn delay={120}>
              {!result ? (
                <div className="border border-white/8 bg-white/3" style={{ padding: '2.5rem 2rem' }}>
                  <p className="text-white/25 font-light text-center" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Select a state and enter a purchase price to calculate stamp duty.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>
                    {selectedState} — {fmt(priceNum)}
                  </p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-teal/10 border border-teal/30" style={{ padding: '1.5rem 1.25rem' }}>
                      <p className="text-teal/70 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Stamp duty</p>
                      <p className="text-teal font-black leading-tight" style={{ fontSize: '1.6rem' }}>{fmt(result.duty)}</p>
                    </div>
                    <div className="bg-white/5 border border-white/8" style={{ padding: '1.5rem 1.25rem' }}>
                      <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Effective rate</p>
                      <p className="text-white font-black leading-tight" style={{ fontSize: '1.6rem' }}>{fmtPct(result.effectiveRate)}</p>
                    </div>
                  </div>

                  {/* Total acquisition cost */}
                  <div className="bg-white/5 border border-white/8 mb-6" style={{ padding: '1.25rem 1.5rem' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60 font-light" style={{ fontSize: '0.875rem' }}>Purchase price</span>
                      <span className="text-white font-semibold" style={{ fontSize: '0.9rem' }}>{fmt(priceNum)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60 font-light" style={{ fontSize: '0.875rem' }}>Stamp duty</span>
                      <span className="text-white font-semibold" style={{ fontSize: '0.9rem' }}>{fmt(result.duty)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-2 mb-1">
                      <span className="text-white/40 font-light" style={{ fontSize: '0.8rem' }}>Legal costs (est. 2%)</span>
                      <span className="text-white/40 font-light" style={{ fontSize: '0.8rem' }}>{fmt(priceNum * 0.02)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-white font-black uppercase tracking-tight" style={{ fontSize: '0.9rem' }}>Total acquisition cost</span>
                      <span className="text-teal font-black" style={{ fontSize: '1rem' }}>{fmt(result.totalCost)}</span>
                    </div>
                  </div>

                  {/* Bracket breakdown */}
                  <div className="border border-white/10 mb-5">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Bracket breakdown</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full" style={{ fontSize: '0.8rem' }}>
                        <thead>
                          <tr className="border-b border-white/8">
                            <th className="text-left text-white/35 font-semibold uppercase tracking-wider px-4 py-2.5" style={{ fontSize: '0.62rem' }}>Range</th>
                            <th className="text-right text-white/35 font-semibold uppercase tracking-wider px-4 py-2.5" style={{ fontSize: '0.62rem' }}>Taxable</th>
                            <th className="text-right text-white/35 font-semibold uppercase tracking-wider px-4 py-2.5" style={{ fontSize: '0.62rem' }}>Tax</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.breakdown.map((row, i) => (
                            <tr key={i} className={`border-b border-white/6 ${row.tax > 0 ? '' : 'opacity-50'}`}>
                              <td className="text-white/65 font-light px-4 py-3">{row.range}</td>
                              <td className="text-right text-white/65 font-light px-4 py-3">{fmt(row.taxable)}</td>
                              <td className="text-right text-white font-semibold px-4 py-3">{fmt(row.tax)}</td>
                            </tr>
                          ))}
                          <tr className="bg-teal/8">
                            <td className="text-white font-black uppercase tracking-tight px-4 py-3" colSpan={2}>Total stamp duty</td>
                            <td className="text-right text-teal font-black px-4 py-3">{fmt(result.duty)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {result.note && (
                    <div className="border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 mb-4">
                      <p className="text-yellow-300/70 font-light" style={{ fontSize: '0.78rem' }}>{result.note}</p>
                    </div>
                  )}

                  <p className="text-white/25 font-light mb-4 leading-relaxed" style={{ fontSize: '0.75rem', lineHeight: 1.7 }}>
                    This is an estimate only. Verify with a qualified accountant or solicitor before making decisions. Legal cost estimate is indicative at 2% of purchase price.
                  </p>

                  <button onClick={handleReset} className="text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                    ← Reset
                  </button>
                </div>
              )}
            </FadeIn>
          </div>

          {/* CTA */}
          <div className="mt-14 md:mt-20 pt-10 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Ready to buy?</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              We help commercial buyers negotiate the right price and structure the purchase correctly.
            </h2>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
              style={{ padding: '0 2.5rem', fontSize: '0.72rem' }}>
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
            Know your acquisition costs before you make an offer.
          </h2>
          <p className="text-white/80 font-light leading-relaxed mb-12 mx-auto"
            style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
            Stamp duty is just one line. We help you model the full cost of acquisition and make sure you&apos;re not overpaying.
          </p>
          <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-teal font-bold no-underline hover:bg-light-teal transition-colors"
            style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Book a Clarity Call
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
