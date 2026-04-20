'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { HUBSPOT } from '@/lib/constants'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

interface LeaseInput {
  name: string
  faceRent: string
  area: string
  term: string
  incentive: string
  outgoings: string
  makegood: string
}

const empty = (): LeaseInput => ({ name: '', faceRent: '', area: '', term: '', incentive: '', outgoings: '', makegood: '' })

interface LeaseResult {
  name: string
  netRentPa: number
  totalOutgoings: number
  trueCostPa: number
  trueCostTotal: number
  netPresentCost: number
  incentiveValue: number
}

function calcLease(l: LeaseInput): LeaseResult | null {
  const rent = parseFloat(l.faceRent.replace(/,/g, ''))
  const area = parseFloat(l.area.replace(/,/g, '')) || 1
  const term = parseFloat(l.term) || 1
  const incentiveMths = parseFloat(l.incentive) || 0
  const outgoings = parseFloat(l.outgoings.replace(/,/g, '')) || 0
  const makegood = parseFloat(l.makegood.replace(/,/g, '')) || 0
  if (!rent || !area) return null

  const grossPa = rent * area
  const incentiveValue = grossPa * (incentiveMths / 12)
  const netRentPa = grossPa - (incentiveValue / term)
  const totalOutgoings = outgoings * area
  const trueCostPa = netRentPa + totalOutgoings
  const trueCostTotal = trueCostPa * term + makegood

  // Simple NPV at 7% discount rate
  const r = 0.07
  let npv = 0
  for (let y = 1; y <= term; y++) {
    npv += trueCostPa / Math.pow(1 + r, y)
  }
  npv += makegood / Math.pow(1 + r, term)

  return { name: l.name || `Option ${1}`, netRentPa, totalOutgoings, trueCostPa, trueCostTotal, netPresentCost: npv, incentiveValue }
}

export default function LeaseComparisonPage() {
  const [leases, setLeases] = useState<LeaseInput[]>([empty(), empty(), empty()])
  const [results, setResults] = useState<(LeaseResult | null)[]>([])

  function update(i: number, field: keyof LeaseInput, val: string) {
    setLeases(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l))
  }

  function compare() {
    setResults(leases.map((l, i) => {
      const r = calcLease(l)
      if (r) r.name = l.name || `Option ${i + 1}`
      return r
    }))
  }

  const validResults = results.filter(Boolean) as LeaseResult[]
  const bestNPV = validResults.length ? Math.min(...validResults.map(r => r.netPresentCost)) : null

  const fields: { key: keyof LeaseInput; label: string; hint?: string }[] = [
    { key: 'name', label: 'Option name', hint: 'e.g. 10 Smith St' },
    { key: 'faceRent', label: 'Face rent ($/m²/yr)', hint: 'Gross face rent' },
    { key: 'area', label: 'Area (m²)' },
    { key: 'term', label: 'Lease term (years)' },
    { key: 'incentive', label: 'Rent-free (months)', hint: 'Free rent incentive' },
    { key: 'outgoings', label: 'Outgoings ($/m²/yr)', hint: 'Rates, insurance etc.' },
    { key: 'makegood', label: 'Make-good estimate ($)', hint: 'End of lease cost' }
  ]

  return (
    <>
      <Nav />

      <section className="bg-near-black ">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(7rem,14vw,11rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
          <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">Free tool</p>
          <h1 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-4">Lease Comparison Tool</h1>
          <p className="text-white/60 font-light text-lg">Compare up to three lease options on true occupancy cost — not just face rent.</p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-mid-grey font-semibold text-xs tracking-widest uppercase pb-4 pr-6 w-48">Field</th>
                  {[0, 1, 2].map(i => (
                    <th key={i} className="text-left pb-4 px-4">
                      <span className="text-near-black font-bold text-sm">Option {i + 1}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(f => (
                  <tr key={f.key} className="border-t border-gray-100">
                    <td className="py-3 pr-6">
                      <p className="text-near-black font-semibold text-sm">{f.label}</p>
                      {f.hint && <p className="text-mid-grey font-light text-xs">{f.hint}</p>}
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="py-3 px-4">
                        <input
                          type="text"
                          value={leases[i][f.key]}
                          onChange={e => update(i, f.key, e.target.value)}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-near-black font-light text-sm focus:outline-none focus:border-teal transition-colors"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={compare}
            className="mt-8 bg-teal text-white font-semibold text-base px-10 py-4 rounded hover:bg-dark-teal transition-colors duration-200 w-full md:w-auto">
            Compare leases
          </button>

          {validResults.length > 0 && (
            <div className="mt-12">
              <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase mb-6">Comparison results</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {validResults.map(r => (
                  <div key={r.name} className={`rounded-sm p-8 ${r.netPresentCost === bestNPV ? 'bg-teal text-white border-2 border-teal' : 'bg-warm-grey'}`}>
                    {r.netPresentCost === bestNPV && (
                      <p className="text-white/70 font-semibold text-xs tracking-widest uppercase mb-3">Lowest true cost</p>
                    )}
                    <h3 className={`font-bold text-xl mb-6 ${r.netPresentCost === bestNPV ? 'text-white' : 'text-near-black'}`}>{r.name}</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Effective rent p.a.', val: fmt(r.netRentPa) },
                        { label: 'Outgoings p.a.', val: fmt(r.totalOutgoings) },
                        { label: 'True cost p.a.', val: fmt(r.trueCostPa) },
                        { label: 'Total over term', val: fmt(r.trueCostTotal) },
                        { label: 'Incentive value', val: fmt(r.incentiveValue) },
                      ].map(item => (
                        <div key={item.label} className={`flex justify-between border-b pb-2 ${r.netPresentCost === bestNPV ? 'border-white/20' : 'border-gray-200'}`}>
                          <p className={`font-light text-sm ${r.netPresentCost === bestNPV ? 'text-white/70' : 'text-mid-grey'}`}>{item.label}</p>
                          <p className={`font-semibold text-sm ${r.netPresentCost === bestNPV ? 'text-white' : 'text-near-black'}`}>{item.val}</p>
                        </div>
                      ))}
                      <div className="pt-2">
                        <p className={`font-light text-xs mb-1 ${r.netPresentCost === bestNPV ? 'text-white/70' : 'text-mid-grey'}`}>Net present cost (7% discount)</p>
                        <p className={`font-bold text-2xl ${r.netPresentCost === bestNPV ? 'text-white' : 'text-teal'}`}>{fmt(r.netPresentCost)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-mid-grey font-light text-xs mt-6">
                True cost includes effective rent (after incentives), outgoings, and make-good. NPV discounts all costs to today&apos;s dollars at 7%. This tool is a guide — get advice before signing.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-near-black py-20 md:py-28 text-center">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">Want us to run the numbers for real?</h2>
          <p className="text-white/60 font-light text-lg mb-8">We review leases every day. We&apos;ll tell you which deal is actually better and why.</p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a Lease Review Call</Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
