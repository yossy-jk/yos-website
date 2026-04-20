'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { HUBSPOT } from '@/lib/constants'
import ToolGate from '@/components/ToolGate'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}
function fmtK(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
  return fmt(n)
}
function pct(n: number) {
  return `${n.toFixed(1)}%`
}

interface LeaseInput {
  name: string
  faceRent: string
  area: string
  term: string
  incentive: string
  outgoings: string
  makegood: string
  rentReview: string
}

const empty = (): LeaseInput => ({
  name: '', faceRent: '', area: '', term: '', incentive: '', outgoings: '', makegood: '', rentReview: '3.5'
})

interface YearlyBreakdown {
  year: number
  rent: number
  outgoings: number
  total: number
}

interface LeaseResult {
  name: string
  faceRentPa: number
  effectiveRentPa: number
  effectiveRentSqm: number
  effectiveRentDay: number
  totalOutgoingsPa: number
  trueCostPa: number
  trueCostTotal: number
  netPresentCost: number
  incentiveValue: number
  totalSavingVsWorst: number | null
  yearlyBreakdown: YearlyBreakdown[]
  flags: string[]
  area: number
  term: number
}

function calcLease(l: LeaseInput, idx: number): LeaseResult | null {
  const rent = parseFloat(l.faceRent.replace(/,/g, ''))
  const area = parseFloat(l.area.replace(/,/g, '')) || 1
  const term = parseFloat(l.term) || 1
  const incentiveMths = parseFloat(l.incentive) || 0
  const outgoings = parseFloat(l.outgoings.replace(/,/g, '')) || 0
  const makegood = parseFloat(l.makegood.replace(/,/g, '')) || 0
  const reviewPct = parseFloat(l.rentReview) / 100 || 0.035
  if (!rent || !area) return null

  const grossPa = rent * area
  const incentiveValue = grossPa * (incentiveMths / 12)
  const effectiveRentPa = grossPa - (incentiveValue / term)
  const totalOutgoingsPa = outgoings * area

  // Year-by-year with rent reviews
  const breakdown: YearlyBreakdown[] = []
  let totalRentCost = 0
  let totalOutCost = 0
  for (let y = 1; y <= Math.min(term, 10); y++) {
    const yearRent = effectiveRentPa * Math.pow(1 + reviewPct, y - 1)
    // Outgoings also escalate (typically CPI ~3%)
    const yearOut = totalOutgoingsPa * Math.pow(1.03, y - 1)
    breakdown.push({ year: y, rent: yearRent, outgoings: yearOut, total: yearRent + yearOut })
    totalRentCost += yearRent
    totalOutCost += yearOut
  }

  const trueCostTotal = totalRentCost + totalOutCost + makegood
  const trueCostPa = trueCostTotal / term

  // NPV at 7%
  const r = 0.07
  let npv = 0
  for (let y = 1; y <= Math.min(term, breakdown.length); y++) {
    npv += breakdown[y - 1].total / Math.pow(1 + r, y)
  }
  npv += makegood / Math.pow(1 + r, term)

  // Flags
  const flags: string[] = []
  if (incentiveMths < term * 1.5 && term >= 3) flags.push(`Rent-free of ${incentiveMths} months is below market for a ${term}-year lease — push for more`)
  if (outgoings > 120) flags.push(`Outgoings at $${outgoings}/m² are high — verify what's included`)
  if (outgoings === 0 && term >= 2) flags.push('No outgoings entered — confirm if gross or net lease')
  if (makegood > grossPa * 0.5) flags.push('Make-good estimate is significant — get a contractor quote before signing')
  if (reviewPct > 0.05) flags.push(`${pct(reviewPct * 100)} rent reviews will add up — model a longer term carefully`)
  if (term >= 5 && incentiveMths === 0) flags.push('No incentive on a long lease — there is almost always room to negotiate one')

  return {
    name: l.name || `Option ${idx + 1}`,
    faceRentPa: grossPa,
    effectiveRentPa,
    effectiveRentSqm: effectiveRentPa / area,
    effectiveRentDay: (effectiveRentPa / area) / 365,
    totalOutgoingsPa,
    trueCostPa,
    trueCostTotal,
    netPresentCost: npv,
    incentiveValue,
    totalSavingVsWorst: null,
    yearlyBreakdown: breakdown,
    flags,
    area,
    term
  }
}

function BarChart({ results, bestIdx }: { results: LeaseResult[]; bestIdx: number }) {
  const max = Math.max(...results.map(r => r.netPresentCost))
  return (
    <div className="mt-8 mb-2">
      <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase mb-4">True cost comparison (net present value)</p>
      <div className="space-y-3">
        {results.map((r, i) => {
          const w = (r.netPresentCost / max) * 100
          const isBest = i === bestIdx
          return (
            <div key={r.name}>
              <div className="flex justify-between mb-1">
                <span className="text-near-black font-semibold text-sm">{r.name}</span>
                <span className={`font-bold text-sm ${isBest ? 'text-teal' : 'text-near-black'}`}>{fmtK(r.netPresentCost)}</span>
              </div>
              <div className="h-8 bg-warm-grey rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 flex items-center px-3 ${isBest ? 'bg-teal' : 'bg-mid-grey/40'}`}
                  style={{ width: `${w}%` }}
                >
                  {isBest && <span className="text-white font-semibold text-xs whitespace-nowrap">Lowest cost</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function YearTable({ result, isBest }: { result: LeaseResult; isBest: boolean }) {
  return (
    <div className="mt-6">
      <p className={`font-semibold text-xs tracking-widest uppercase mb-3 ${isBest ? 'text-white/70' : 'text-mid-grey'}`}>Year-by-year cost</p>
      <div className="space-y-1">
        {result.yearlyBreakdown.map(y => (
          <div key={y.year} className={`flex justify-between text-xs py-1 border-b ${isBest ? 'border-white/10' : 'border-gray-100'}`}>
            <span className={isBest ? 'text-white/60' : 'text-mid-grey'}>Year {y.year}</span>
            <span className={`font-semibold ${isBest ? 'text-white' : 'text-near-black'}`}>{fmt(y.total)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LeaseComparisonPage() {
  const [leases, setLeases] = useState<LeaseInput[]>([empty(), empty(), empty()])
  const [results, setResults] = useState<LeaseResult[]>([])
  const [showYearly, setShowYearly] = useState(false)
  const [copied, setCopied] = useState(false)

  function update(i: number, field: keyof LeaseInput, val: string) {
    setLeases(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l))
  }

  function compare() {
    const raw = leases.map((l, i) => calcLease(l, i)).filter(Boolean) as LeaseResult[]
    if (raw.length === 0) return
    const worst = Math.max(...raw.map(r => r.netPresentCost))
    raw.forEach(r => { r.totalSavingVsWorst = worst - r.netPresentCost })
    setResults(raw)
    setShowYearly(false)
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function copyResults() {
    if (!results.length) return
    const lines = results.map(r =>
      `${r.name}\nEffective rent: ${fmt(r.effectiveRentPa)}/yr | True cost p.a.: ${fmt(r.trueCostPa)} | NPV: ${fmt(r.netPresentCost)}`
    ).join('\n\n')
    navigator.clipboard.writeText(`YOS Lease Comparison\n\n${lines}\n\nGenerated at yourofficespace.au/resources/lease-comparison`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validResults = results
  const bestIdx = validResults.length ? validResults.reduce((bi, r, i, a) => r.netPresentCost < a[bi].netPresentCost ? i : bi, 0) : -1

  const fields: { key: keyof LeaseInput; label: string; hint?: string; prefix?: string; suffix?: string; type?: string }[] = [
    { key: 'name', label: 'Option name', hint: 'e.g. 10 Smith St' },
    { key: 'faceRent', label: 'Face rent', hint: '$/m²/yr gross', prefix: '$' },
    { key: 'area', label: 'Area', hint: 'm²', suffix: 'm²' },
    { key: 'term', label: 'Lease term', hint: 'years', suffix: 'yrs' },
    { key: 'incentive', label: 'Rent-free', hint: 'months', suffix: 'mths' },
    { key: 'outgoings', label: 'Outgoings', hint: '$/m²/yr', prefix: '$' },
    { key: 'makegood', label: 'Make-good', hint: 'estimated $', prefix: '$' },
    { key: 'rentReview', label: 'Rent review', hint: '% per year', suffix: '%' },
  ]

  // Determine which options have data
  const filledCount = leases.filter(l => l.faceRent && l.area).length

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">Free tool</p>
          <h1 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-4">Lease Comparison Tool</h1>
          <p className="text-white/60 font-light text-lg max-w-2xl">
            Enter up to three lease options. We calculate the true cost — factoring in rent-free periods, outgoings, make-good, and annual rent reviews — then tell you which deal is actually cheaper.
          </p>
          <div className="mt-10 flex flex-wrap gap-8">
            {[
              { stat: 'Accounts for rent reviews', desc: 'Year-by-year cost escalation' },
              { stat: 'Net present value', desc: 'Discounts future costs to today' },
              { stat: 'Plain-English verdict', desc: 'Not just numbers — a recommendation' },
            ].map(item => (
              <div key={item.stat} className="border-l-2 border-teal pl-5">
                <p className="text-white font-semibold text-sm mb-1">{item.stat}</p>
                <p className="text-white/40 font-light text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Input */}
      <section className="bg-white" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left pb-7 pr-8 w-52">
                    <span className="text-mid-grey font-semibold text-xs tracking-widest uppercase">Field</span>
                  </th>
                  {[0, 1, 2].map(i => (
                    <th key={i} className="text-left pb-7 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${leases[i].faceRent && leases[i].area ? 'bg-teal' : 'bg-gray-200'}`} />
                        <span className="text-near-black font-bold text-sm">Option {i + 1}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(f => (
                  <tr key={f.key} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 pr-8">
                      <p className="text-near-black font-semibold text-sm leading-snug">{f.label}</p>
                      {f.hint && <p className="text-mid-grey font-light text-xs mt-1.5 leading-relaxed">{f.hint}</p>}
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="py-5 px-4">
                        <div className="relative">
                          {f.prefix && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mid-grey text-sm font-light">{f.prefix}</span>
                          )}
                          <input
                            type={f.type || 'text'}
                            inputMode={f.key === 'name' ? 'text' : 'decimal'}
                            value={leases[i][f.key]}
                            onChange={e => update(i, f.key, e.target.value)}
                            placeholder={f.key === 'rentReview' ? '3.5' : ''}
                            className={`w-full border border-gray-200 rounded-lg px-4 py-3.5 text-near-black font-light text-sm focus:outline-none focus:border-teal transition-colors ${f.prefix ? 'pl-7' : ''} ${f.suffix ? 'pr-10' : ''}`}
                          />
                          {f.suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-mid-grey text-xs font-light">{f.suffix}</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
            <button
              onClick={compare}
              disabled={filledCount === 0}
              className="bg-teal text-white font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center hover:bg-dark-teal transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed min-h-[52px]" style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}
            >
              {filledCount > 1 ? `Compare ${filledCount} options` : 'Compare leases'}
            </button>
            {filledCount === 0 && (
              <p className="text-mid-grey font-light text-sm mt-1 sm:mt-3">Fill in at least two options to compare</p>
            )}
          </div>

          <p className="text-mid-grey font-light text-xs mt-8 max-w-2xl leading-relaxed">
            Rent reviews compound annually at the rate you enter. Outgoings escalate at 3% per year. Make-good is added at end of term.
            NPV discounts all future costs to today&apos;s dollars at 7%. This is a guide — not financial advice. Get proper advice before you sign anything.
          </p>
        </div>
      </section>

      {/* Results */}
      {validResults.length > 0 && (
        <section id="results" className="bg-warm-grey" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <ToolGate
            tool="Lease Comparison Tool"
            context={() => `Comparing ${validResults.length} leases: ${validResults.map(r => `${r.name} ($${r.trueCostPa.toLocaleString()}/yr)`).join(' vs ')}`}
            heading="Where should we send your comparison?"
            subheading="Unlock the full year-by-year breakdown and negotiation flags."
            teaser={
              <div className="bg-near-black rounded-xl p-8 mb-4">
                <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-3">Verdict</p>
                <h2 className="text-white font-bold text-3xl mb-3">
                  {validResults.length === 1 ? validResults[0].name : `${validResults[bestIdx]?.name} is the better deal`}
                </h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  {validResults.map((r, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <p className="text-white/60 text-xs mb-1">{r.name}</p>
                      <p className="text-white font-black">{fmt(r.trueCostPa)}<span className="text-white/40 font-light text-sm">/yr</span></p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-white/10 pt-4">
                  {[1,2,3].map(i => <div key={i} className="flex justify-between py-2"><span className="w-32 h-3 bg-white/10 rounded-lg" /><span className="w-20 h-3 bg-white/10 rounded-lg" /></div>)}
                  <p className="text-white/25 text-xs mt-3">Year-by-year breakdown — unlock to view</p>
                </div>
              </div>
            }
          >

            {/* Verdict banner */}
            <div className="bg-near-black rounded-xl p-8 mb-10">
              <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-3">Verdict</p>
              {validResults.length === 1 ? (
                <>
                  <h2 className="text-white font-bold text-3xl mb-3">{validResults[0].name}</h2>
                  <p className="text-white/60 font-light text-lg">
                    One option entered. True occupancy cost is {fmt(validResults[0].trueCostPa)} per year — {fmt(validResults[0].effectiveRentSqm.toFixed(2) as unknown as number)}/m²/yr effective.
                    Add a second option to compare.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-white font-bold text-3xl mb-3">
                    {validResults[bestIdx].name} is the cheaper deal
                  </h2>
                  <p className="text-white/60 font-light text-lg mb-4">
                    {validResults[bestIdx].totalSavingVsWorst && validResults[bestIdx].totalSavingVsWorst! > 0
                      ? `It saves you ${fmt(validResults[bestIdx].totalSavingVsWorst!)} in net present cost compared to the most expensive option.`
                      : 'All options are close in net present value — negotiate hard on incentives before deciding.'}
                    {' '}The effective rent works out to ${validResults[bestIdx].effectiveRentSqm.toFixed(2)}/m²/yr, or ${validResults[bestIdx].effectiveRentDay.toFixed(2)}/m² per day.
                  </p>
                  <BarChart results={validResults} bestIdx={bestIdx} />
                </>
              )}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {validResults.map((r, i) => {
                const isBest = i === bestIdx
                return (
                  <div key={r.name} className={`rounded-xl p-8 ${isBest ? 'bg-teal text-white ring-2 ring-teal' : 'bg-white'}`}>
                    {isBest && (
                      <p className="text-white/70 font-semibold text-xs tracking-widest uppercase mb-3">Recommended</p>
                    )}
                    <h3 className={`font-bold text-xl mb-6 ${isBest ? 'text-white' : 'text-near-black'}`}>{r.name}</h3>

                    <div className="space-y-3 mb-6">
                      {[
                        { label: 'Face rent p.a.', val: fmt(r.faceRentPa) },
                        { label: 'Incentive value', val: fmt(r.incentiveValue) },
                        { label: 'Effective rent p.a.', val: fmt(r.effectiveRentPa), bold: true },
                        { label: 'Outgoings p.a.', val: fmt(r.totalOutgoingsPa) },
                      ].map(item => (
                        <div key={item.label} className={`flex justify-between border-b pb-2.5 ${isBest ? 'border-white/20' : 'border-gray-100'}`}>
                          <p className={`font-light text-sm ${isBest ? 'text-white/70' : 'text-mid-grey'}`}>{item.label}</p>
                          <p className={`text-sm ${item.bold ? 'font-bold' : 'font-semibold'} ${isBest ? 'text-white' : 'text-near-black'}`}>{item.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Key metrics */}
                    <div className={`rounded p-4 mb-6 ${isBest ? 'bg-white/10' : 'bg-warm-grey'}`}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className={`font-light text-xs mb-1 ${isBest ? 'text-white/60' : 'text-mid-grey'}`}>True cost p.a.</p>
                          <p className={`font-bold text-base ${isBest ? 'text-white' : 'text-near-black'}`}>{fmt(r.trueCostPa)}</p>
                        </div>
                        <div>
                          <p className={`font-light text-xs mb-1 ${isBest ? 'text-white/60' : 'text-mid-grey'}`}>Total over term</p>
                          <p className={`font-bold text-base ${isBest ? 'text-white' : 'text-near-black'}`}>{fmtK(r.trueCostTotal)}</p>
                        </div>
                        <div>
                          <p className={`font-light text-xs mb-1 ${isBest ? 'text-white/60' : 'text-mid-grey'}`}>Effective $/m²/yr</p>
                          <p className={`font-bold text-base ${isBest ? 'text-white' : 'text-near-black'}`}>${r.effectiveRentSqm.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className={`font-light text-xs mb-1 ${isBest ? 'text-white/60' : 'text-mid-grey'}`}>Net present cost</p>
                          <p className={`font-bold text-base ${isBest ? 'text-white' : 'text-teal'}`}>{fmtK(r.netPresentCost)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Flags */}
                    {r.flags.length > 0 && (
                      <div className={`rounded p-4 mb-6 ${isBest ? 'bg-white/10' : 'bg-amber-50 border border-amber-200'}`}>
                        <p className={`font-semibold text-xs tracking-widest uppercase mb-2 ${isBest ? 'text-white/70' : 'text-amber-700'}`}>Watch out</p>
                        <ul className="space-y-1.5">
                          {r.flags.map((f, fi) => (
                            <li key={fi} className={`font-light text-xs leading-snug ${isBest ? 'text-white/80' : 'text-amber-800'}`}>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Year-by-year toggle */}
                    {showYearly && <YearTable result={r} isBest={isBest} />}
                  </div>
                )
              })}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setShowYearly(v => !v)}
                className="border border-near-black text-near-black font-semibold text-sm px-6 py-3 rounded-lg hover:bg-near-black hover:text-white transition-colors"
              >
                {showYearly ? 'Hide' : 'Show'} year-by-year breakdown
              </button>
              <button
                onClick={copyResults}
                className="border border-gray-300 text-mid-grey font-semibold text-sm px-6 py-3 rounded-lg hover:border-near-black hover:text-near-black transition-colors"
              >
                {copied ? 'Copied' : 'Copy results'}
              </button>
            </div>

            <p className="text-mid-grey font-light text-xs mt-8 max-w-2xl">
              Outgoings are estimated to escalate at 3% per year. Rent reviews compound at your entered rate.
              Make-good is added as a lump sum at end of term. NPV at 7%. These figures are indicative — lease terms vary significantly and professional advice matters before you sign.
            </p>
            </ToolGate>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-near-black text-center" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">Want us to run the numbers for real?</h2>
          <p className="text-white/60 font-light text-lg mb-8">
            We review leases every day. We&apos;ll look at your actual documents, pull apart the hidden costs, and tell you which deal is better — and what to negotiate.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a Lease Review Call</Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
