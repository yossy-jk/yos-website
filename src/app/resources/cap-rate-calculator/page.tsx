'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { HUBSPOT } from '@/lib/constants'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}
function fmtPct(n: number) {
  return n.toFixed(2) + '%'
}

const BENCHMARKS = [
  { type: 'Newcastle CBD Office', low: 5.5, high: 7.0 },
  { type: 'Hunter Valley Industrial', low: 5.0, high: 6.5 },
  { type: 'Suburban Retail / Strip', low: 6.0, high: 8.0 },
  { type: 'Medical / Allied Health', low: 5.5, high: 7.0 },
  { type: 'Childcare / Education', low: 4.5, high: 6.0 }
]

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
    const price = parseFloat(purchasePrice.replace(/,/g, ''))
    const gross = parseFloat(grossRent.replace(/,/g, ''))
    const vac = parseFloat(vacancy) / 100
    const outg = parseFloat(outgoings.replace(/,/g, '')) || 0
    if (!price || !gross || price <= 0 || gross <= 0) return

    const effectiveGross = gross * (1 - vac)
    const netIncome = effectiveGross - outg
    const capRate = (netIncome / price) * 100
    const grossYield = (gross / price) * 100

    setResult({
      grossYield,
      netIncome,
      capRate,
      valueAt5: netIncome / 0.05,
      valueAt6: netIncome / 0.06,
      valueAt7: netIncome / 0.07
    })
  }

  return (
    <>
      <Nav />

      <section className="bg-near-black ">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(4rem,10vw,9rem)', paddingBottom: 'clamp(3rem,7vw,7rem)' }}>
          <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">Free tool</p>
          <h1 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-4">Cap Rate Calculator</h1>
          <p className="text-white/60 font-light text-lg">Calculate capitalisation rate, net yield, and implied value for any commercial property investment.</p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-near-black font-semibold text-sm mb-2">Purchase price ($)</label>
              <input type="text" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="e.g. 1,500,000"
                className="w-full border border-gray-300 rounded px-4 py-3 text-near-black font-light focus:outline-none focus:border-teal transition-colors" />
            </div>
            <div>
              <label className="block text-near-black font-semibold text-sm mb-2">Gross annual rent ($)</label>
              <input type="text" value={grossRent} onChange={e => setGrossRent(e.target.value)} placeholder="e.g. 120,000"
                className="w-full border border-gray-300 rounded px-4 py-3 text-near-black font-light focus:outline-none focus:border-teal transition-colors" />
            </div>
            <div>
              <label className="block text-near-black font-semibold text-sm mb-2">Vacancy allowance (%)</label>
              <input type="number" value={vacancy} onChange={e => setVacancy(e.target.value)} placeholder="5"
                className="w-full border border-gray-300 rounded px-4 py-3 text-near-black font-light focus:outline-none focus:border-teal transition-colors" />
              <p className="text-mid-grey text-xs mt-1">Typical: 5% for leased, 10%+ for vacant</p>
            </div>
            <div>
              <label className="block text-near-black font-semibold text-sm mb-2">Annual outgoings ($) <span className="text-mid-grey font-light">(optional)</span></label>
              <input type="text" value={outgoings} onChange={e => setOutgoings(e.target.value)} placeholder="e.g. 15,000"
                className="w-full border border-gray-300 rounded px-4 py-3 text-near-black font-light focus:outline-none focus:border-teal transition-colors" />
              <p className="text-mid-grey text-xs mt-1">Rates, insurance, management fees</p>
            </div>
          </div>

          <button onClick={calculate}
            className="bg-teal text-white font-semibold text-base px-10 py-4 rounded hover:bg-dark-teal transition-colors duration-200 w-full md:w-auto">
            Calculate
          </button>

          {result && (
            <div className="mt-12 space-y-8">
              <div className="bg-warm-grey rounded-sm p-10">
                <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase mb-6">Results</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <p className="text-mid-grey font-light text-xs mb-1">Gross yield</p>
                    <p className="text-near-black font-bold text-2xl">{fmtPct(result.grossYield)}</p>
                  </div>
                  <div>
                    <p className="text-mid-grey font-light text-xs mb-1">Net income p.a.</p>
                    <p className="text-near-black font-bold text-2xl">{fmt(result.netIncome)}</p>
                  </div>
                  <div className="col-span-2 border-l-4 border-teal pl-6">
                    <p className="text-mid-grey font-light text-xs mb-1">Capitalisation rate</p>
                    <p className="text-teal font-bold text-4xl">{fmtPct(result.capRate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-warm-grey rounded-sm p-10">
                <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase mb-6">Implied value at different cap rates</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[{rate: '5.0%', val: result.valueAt5}, {rate: '6.0%', val: result.valueAt6}, {rate: '7.0%', val: result.valueAt7}].map(item => (
                    <div key={item.rate}>
                      <p className="text-mid-grey font-light text-xs mb-1">At {item.rate} cap rate</p>
                      <p className="text-near-black font-bold text-2xl">{fmt(item.val)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-warm-grey rounded-sm p-10">
                <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase mb-6">Newcastle market benchmarks (April 2026)</p>
                <div className="space-y-3">
                  {BENCHMARKS.map(b => (
                    <div key={b.type} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <p className="text-charcoal font-light text-sm">{b.type}</p>
                      <p className="text-near-black font-semibold text-sm">{b.low}% – {b.high}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-near-black py-14 md:py-28 text-center">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">Want expert analysis?</h2>
          <p className="text-white/60 font-light text-lg mb-8">We can assess any commercial opportunity in the Hunter Valley and tell you whether the numbers stack up.</p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a Buyer Consultation</Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
