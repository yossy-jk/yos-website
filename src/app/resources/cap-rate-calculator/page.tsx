'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

const BENCHMARKS = [
  { type: 'Newcastle CBD Office', low: 5.5, high: 7.0 },
  { type: 'Hunter Valley Industrial', low: 5.0, high: 6.5 },
  { type: 'Suburban Retail / Strip', low: 6.0, high: 8.0 },
  { type: 'Medical / Allied Health', low: 5.5, high: 7.0 },
  { type: 'Childcare / Education', low: 4.5, high: 6.0 },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}
function fmtPct(n: number) { return n.toFixed(2) + '%' }
function parseNum(s: string) { return parseFloat(s.replace(/,/g, '')) || 0 }

export default function CapRateCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState('')
  const [grossRent, setGrossRent] = useState('')
  const [vacancy, setVacancy] = useState('5')
  const [outgoings, setOutgoings] = useState('')
  const [result, setResult] = useState<null | {
    grossYield: number; netIncome: number; capRate: number;
    valueAt5: number; valueAt6: number; valueAt7: number
  }>(null)

  function calculate() {
    const price = parseNum(purchasePrice)
    const gross = parseNum(grossRent)
    const vac = parseFloat(vacancy) / 100
    const outg = parseNum(outgoings)
    if (!price || !gross) return
    const effectiveGross = gross * (1 - vac)
    const netIncome = effectiveGross - outg
    const capRate = (netIncome / price) * 100
    const grossYield = (gross / price) * 100
    setResult({ grossYield, netIncome, capRate, valueAt5: netIncome / 0.05, valueAt6: netIncome / 0.06, valueAt7: netIncome / 0.07 })
  }

  const canCalc = !!purchasePrice && !!grossRent

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>
        <div className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(2rem,5vw,4rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>

          {/* Header */}
          <div className="max-w-2xl mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 border border-teal/30 mb-6"
              style={{ padding: '0.4rem 1rem' }}>
              <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
              <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
            </div>
            <h1 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
              Cap Rate Calculator
            </h1>
            <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
              Enter your property details below to calculate capitalisation rate, net yield, and implied value at multiple cap rates.
            </p>
          </div>

          {/* Calculator + Results side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Inputs */}
            <div>
              <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Property details</p>

              <div className="flex flex-col gap-6">
                {/* Purchase price */}
                <div>
                  <label className="block text-white/70 font-semibold mb-2" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Purchase price ($) <span className="text-teal">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)}
                      placeholder="1,500,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                </div>

                {/* Gross rent */}
                <div>
                  <label className="block text-white/70 font-semibold mb-2" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Gross annual rent ($) <span className="text-teal">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={grossRent} onChange={e => setGrossRent(e.target.value)}
                      placeholder="120,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                </div>

                {/* Vacancy */}
                <div>
                  <label className="block text-white/70 font-semibold mb-2" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Vacancy allowance (%)
                  </label>
                  <div className="flex gap-3 flex-wrap mb-2">
                    {['0', '5', '10', '15', '20'].map(v => (
                      <button key={v} onClick={() => setVacancy(v)}
                        className={`font-bold border transition-colors ${vacancy === v ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                        {v}%
                      </button>
                    ))}
                  </div>
                  <p className="text-white/25 font-light" style={{ fontSize: '0.75rem' }}>
                    Typical: 5% for leased property, 10–15% for partially vacant
                  </p>
                </div>

                {/* Outgoings */}
                <div>
                  <label className="block text-white/70 font-semibold mb-2" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Annual outgoings ($) <span className="text-white/30 font-light">optional</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={outgoings} onChange={e => setOutgoings(e.target.value)}
                      placeholder="15,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                  <p className="text-white/25 font-light mt-1" style={{ fontSize: '0.75rem' }}>
                    Rates, insurance, management fees paid by landlord
                  </p>
                </div>

                <button onClick={calculate} disabled={!canCalc}
                  className={`font-bold transition-all ${canCalc ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                  Calculate →
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              {!result ? (
                <div className="border border-white/8 bg-white/3" style={{ padding: '2.5rem 2rem' }}>
                  <p className="text-white/25 font-light text-center" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Enter the purchase price and annual rent on the left to see your cap rate calculation.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Your results</p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 border border-white/8" style={{ padding: '1.5rem 1.25rem' }}>
                      <p className="text-white/40 font-light mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Gross yield</p>
                      <p className="text-white font-black" style={{ fontSize: '1.75rem' }}>{fmtPct(result.grossYield)}</p>
                    </div>
                    <div className="bg-white/5 border border-white/8" style={{ padding: '1.5rem 1.25rem' }}>
                      <p className="text-white/40 font-light mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Net income p.a.</p>
                      <p className="text-white font-black" style={{ fontSize: '1.75rem' }}>{fmt(result.netIncome)}</p>
                    </div>
                  </div>

                  {/* Cap rate — hero metric */}
                  <div className="bg-teal/10 border border-teal/30 mb-6" style={{ padding: '1.75rem 1.5rem' }}>
                    <p className="text-teal/70 font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Capitalisation rate</p>
                    <p className="text-teal font-black" style={{ fontSize: '3rem', lineHeight: 1 }}>{fmtPct(result.capRate)}</p>
                  </div>

                  {/* Implied values */}
                  <div className="border border-white/8 mb-6">
                    <p className="text-white/40 font-semibold uppercase tracking-widest border-b border-white/8 px-4 py-3" style={{ fontSize: '0.65rem' }}>
                      Implied value at different cap rates
                    </p>
                    {[{ rate: '5.0%', val: result.valueAt5 }, { rate: '6.0%', val: result.valueAt6 }, { rate: '7.0%', val: result.valueAt7 }].map((item, i, arr) => (
                      <div key={item.rate} className={`flex justify-between items-center px-4 py-4 ${i < arr.length - 1 ? 'border-b border-white/6' : ''}`}>
                        <span className="text-white/55 font-light" style={{ fontSize: '0.875rem' }}>At {item.rate} cap rate</span>
                        <span className="text-white font-bold" style={{ fontSize: '0.95rem' }}>{fmt(item.val)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benchmarks */}
                  <div className="border border-white/8">
                    <p className="text-white/40 font-semibold uppercase tracking-widest border-b border-white/8 px-4 py-3" style={{ fontSize: '0.65rem' }}>
                      Market benchmarks — Australia (April 2026)
                    </p>
                    {BENCHMARKS.map((b, i) => (
                      <div key={b.type} className={`flex justify-between items-center px-4 py-3 ${i < BENCHMARKS.length - 1 ? 'border-b border-white/6' : ''}`}>
                        <span className="text-white/50 font-light" style={{ fontSize: '0.82rem' }}>{b.type}</span>
                        <span className="text-white/70 font-semibold" style={{ fontSize: '0.82rem' }}>{b.low}–{b.high}%</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => { setResult(null); setPurchasePrice(''); setGrossRent(''); setVacancy('5'); setOutgoings('') }}
                    className="mt-5 text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                    ← Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 md:mt-20 pt-10 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Want expert analysis?</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              We can assess any commercial opportunity and tell you if the numbers stack up.
            </h2>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
              style={{ padding: '1rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Book a Buyer Consultation →
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}
