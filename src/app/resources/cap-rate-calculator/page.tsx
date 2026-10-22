'use client'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'

import { useId, useState } from 'react'
import { calculateCapScenario, deriveAnnualNOI, parseCapNumber, type CapTarget } from '@/lib/cap-rate'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}
function fmtPct(n: number) { return n.toFixed(2) + '%' }


// Number input with comma formatting
function NumberInput({ label, value, onChange, placeholder, prefix = '$', suffix, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  prefix?: string; suffix?: string; hint?: string;
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-white/75 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-4 text-white/75 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>{prefix}</span>}
        <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} inputMode="decimal" type="text" value={value} onChange={e => {
          const raw = e.target.value
          onChange(raw)
        }} placeholder={placeholder || '0'}
          className="w-full bg-white/8 text-white border border-white/12 focus:border-teal font-light placeholder:text-white/75 transition-colors"
          style={{ padding: prefix ? '0.9rem 1rem 0.9rem 2rem' : '0.9rem 1rem', fontSize: '1.1rem' }}
        />
        {suffix && <span className="absolute right-4 text-white/75 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>{suffix}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="text-white/75 font-light mt-1" style={{ fontSize: '0.72rem' }}>{hint}</p>}
    </div>
  )
}

// Metric card
function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10" style={{ padding: '1.5rem 1.5rem' }}>
      <p className="text-white/75 font-light mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
      <p className="text-white font-black" style={{ fontSize: '1.75rem', lineHeight: 1.2, overflowWrap: 'anywhere' }}>{value || 'Not calculated'}</p>
      {sub && <p className="text-white/75 font-light mt-1" style={{ fontSize: '0.75rem' }}>{sub}</p>}
    </div>
  )
}

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Cap Rate Calculator for Commercial Property | Your Office Space",
  "description": "Calculate an indicative cap rate, capitalised value or annual NOI from your own assumptions. Not a property valuation.",
  "url": "https://www.yourofficespace.au/resources/cap-rate-calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AUD", "description": "Free to use" },
  "provider": ORGANIZATION_SCHEMA,
  "areaServed": { "@type": "Country", "name": "Australia" },
}

export default function CapRateCalculatorPage() {
  // Net rent section, two modes: derive from gross or enter directly
  const [netRentMode, setNetRentMode] = useState<'derive' | 'direct'>('derive')
  const [grossRent, setGrossRent] = useState('')
  const [vacancy, setVacancy] = useState('0')
  const [outgoings, setOutgoings] = useState('')
  const [netRentDirect, setNetRentDirect] = useState('')

  // Cap rate / value inputs (bidirectional)
  const [purchasePrice, setPurchasePrice] = useState('')
  const [annualNOI, setAnnualNOI] = useState('')
  const [capRatePct, setCapRatePct] = useState('')

  const [target, setTarget] = useState<CapTarget>('rate')
  const helper = netRentMode === 'direct'
    ? { noi: parseCapNumber(netRentDirect) }
    : deriveAnnualNOI(grossRent, vacancy, outgoings || '0')
  const netRent = 'noi' in helper && helper.noi !== null ? helper.noi : 0
  const helperError = 'error' in helper ? helper.error : helper.noi === null ? 'Enter a valid non-negative annual NOI.' : ''
  const scenario = calculateCapScenario(target, { price: purchasePrice, noi: annualNOI, rate: capRatePct })
  const calcPrice = 'error' in scenario ? 0 : scenario.price
  const calcNOI = 'error' in scenario ? 0 : scenario.noi
  const calcRate = 'error' in scenario ? 0 : scenario.rate
  const validScenario = !('error' in scenario)
  const changeTarget = (next: CapTarget) => {
    if (validScenario) { setPurchasePrice(String(calcPrice)); setAnnualNOI(String(calcNOI)); setCapRatePct(String(calcRate)) }
    setTarget(next)
  }
  const valuesAtRates = validScenario && calcNOI > 0
    ? [5, 5.5, 6, 6.5, 7, 7.5, 8].map(rate => ({ rate, value: calcNOI / (rate / 100) })).filter(row => Number.isFinite(row.value)) : []

  const vacancyOptions = ['0', '5', '10', '15', '20']

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <Nav />

      <main id="main-content" tabIndex={-1}>

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(6rem,14vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>

          {/* Header */}
          <div className="max-w-2xl" style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}>
            <div className="inline-flex items-center gap-2 border border-teal/30 mb-6"
              style={{ padding: '0.4rem 1rem' }}>
              <span className="bg-teal rounded-sm" style={{ width: '0.35rem', height: '0.35rem' }} />
              <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
            </div>
            <h1 className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem,5vw,4rem)', marginBottom: '1.25rem' }}>
              Cap Rate Calculator
            </h1>
            <p className="text-white/75 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
              Choose what to calculate, then enter the other two values. All income is annual and amounts are in Australian dollars. This is an income scenario tool, not a property valuation.
            </p>
          </div>

          {/* Main calculator, two columns, always live */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: 'clamp(2.5rem,6vw,5rem)' }}>

            {/* LEFT, Inputs */}
            <div>

              {/* Net Rent Input */}
              <div className="mb-8">
                <p className="text-white/75 font-semibold uppercase tracking-[0.2em] mb-5" style={{ fontSize: '0.65rem' }}>Optional annual NOI helper</p>

                {/* Toggle derive vs direct */}
                <div className="flex gap-0 border border-white/15 mb-5 rounded overflow-hidden" style={{ maxWidth: 420 }}>
                  <button aria-pressed={netRentMode === 'derive'} onClick={() => { setNetRentMode('derive'); setNetRentDirect('') }}
                    className={`flex-1 font-bold transition-all ${netRentMode === 'derive' ? 'bg-teal text-near-black' : 'bg-white/5 text-white/75 hover:text-white/75'}`}
                    style={{ padding: '0.7rem 0.75rem', fontSize: '0.78rem' }}>
                    Derive from gross
                  </button>
                  <button aria-pressed={netRentMode === 'direct'} onClick={() => { setNetRentMode('direct'); setGrossRent(''); setVacancy('0'); setOutgoings('') }}
                    className={`flex-1 font-bold transition-all ${netRentMode === 'direct' ? 'bg-teal text-near-black' : 'bg-white/5 text-white/75 hover:text-white/75'}`}
                    style={{ padding: '0.7rem 0.75rem', fontSize: '0.78rem' }}>
                    Enter net directly
                  </button>
                </div>

                {netRentMode === 'derive' ? (
                  <div className="flex flex-col" style={{ gap: '1.5rem' }}>
                    <NumberInput label="Potential annual rent" value={grossRent} onChange={setGrossRent} placeholder="120,000" hint="Annual rent before vacancy. Use a consistent GST basis throughout; do not apply vacancy again to income already adjusted for it." />
                    <div>
                      <p id="vacancy-label" className="block text-white/75 font-semibold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Vacancy / collection loss</p>
                      <div role="group" aria-labelledby="vacancy-label" className="flex gap-2 flex-wrap">
                        {vacancyOptions.map(v => (
                          <button key={v} aria-pressed={vacancy === v} onClick={() => setVacancy(v)}
                            className={`font-bold border transition-all ${vacancy === v ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/75 hover:text-white/70'}`}
                            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', borderRadius: '0.35rem' }}>
                            {v}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <NumberInput label="Unrecovered operating expenses p.a." value={outgoings} onChange={setOutgoings} placeholder="15,000" hint="Landlord-borne rates, insurance, land tax, management and ordinary repairs. Exclude tenant-recovered costs, debt service, income tax, depreciation and capital expenditure." />
                  </div>
                ) : (
                  <div>
                    <NumberInput label="Net annual rent (NOI)" value={netRentDirect} onChange={setNetRentDirect} placeholder="90,000" hint="Annual property income after vacancy and unrecovered operating expenses; before financing, income tax, depreciation and capital expenditure." />
                  </div>
                )}

                {/* Net rent preview */}
                {!helperError && (grossRent || netRentDirect) && (
                  <div className="mt-4 bg-teal/10 border border-teal/20 rounded" style={{ padding: '1rem 1.25rem' }}>
                    <p className="text-teal font-semibold" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Helper NOI p.a.</p>
                    <p className="text-teal font-black" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{fmt(netRent)}</p>
                    {netRent >= 0 ? <button onClick={() => { setAnnualNOI(String(netRent)); if (target === 'noi') setTarget('value') }} className="bg-teal text-near-black font-bold mt-4" style={{ padding: '0.8rem 1rem', minHeight: 44 }}>Use this NOI in calculator</button> : <p className="text-white mt-4">Costs exceed effective income. Review the inputs; non-positive NOI is not suitable for a simple capitalised-value calculation.</p>}

                  </div>
                )}
              </div>

              {helperError && (grossRent || netRentDirect) && <p role="status" className="text-white mb-5">{helperError}</p>}
              <p className="text-white/75 mb-6 text-sm leading-relaxed">The initial 0% vacancy is a neutral starting value, not an occupancy forecast. Do not count tenant recoveries or vacancy adjustments twice.</p>
              {/* Divider */}
              <div className="border-t border-white/10 mb-8" />

              {/* Bidirectional Cap Rate / Price / NOI */}
              <div>
                <p className="text-white/75 font-semibold uppercase tracking-[0.2em] mb-5" style={{ fontSize: '0.65rem' }}>Choose the result to calculate</p>

                <div role="group" aria-label="Calculate" className="flex flex-wrap gap-2 mb-6">
                  {([['rate', 'Cap rate'], ['value', 'Capitalised value'], ['noi', 'Annual NOI']] as const).map(([key, label]) => <button key={key} aria-pressed={target === key} onClick={() => changeTarget(key)} className={`border font-bold ${target === key ? 'bg-teal text-near-black border-teal' : 'text-white border-white/30'}`} style={{ padding: '0.8rem 1rem', minHeight: 44 }}>{label}</button>)}
                </div>
                <div className="flex flex-col" style={{ gap: '1.5rem' }}>
                  {/* Purchase Price */}
                  <div>
                    <label htmlFor="cap-price" className="block text-white/75 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Property price / value (AUD)
                      {target === 'value' && <span className="ml-2 text-teal text-xs font-normal normal-case tracking-normal">(calculated)</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/75 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>$</span>
                      <input id="cap-price" inputMode="decimal" type="text" aria-describedby="cap-price-hint" readOnly={target === 'value'} value={target === 'value' ? validScenario ? String(calcPrice) : '' : purchasePrice} onChange={e => {
                        setPurchasePrice(e.target.value)
                      }} placeholder="1,500,000"
                        className="w-full bg-white/8 text-white border border-white/12 focus:border-teal font-light placeholder:text-white/75 transition-colors"
                        style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                      />
                    </div>
                  </div>

                  <p id="cap-price-hint" className="text-white/75 text-sm">Property price or value only, excluding acquisition fees, duty and borrowing costs.</p>
                  {/* Cap Rate */}
                  <div>
                    <label htmlFor="cap-rate" className="block text-white/75 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Cap rate
                      {target === 'rate' && <span className="ml-2 text-teal text-xs font-normal normal-case tracking-normal">(calculated)</span>}
                    </label>
                    <div className="relative">
                      <input id="cap-rate" aria-describedby="cap-rate-hint" readOnly={target === 'rate'} inputMode="decimal" type="text" value={target === 'rate' ? validScenario ? String(calcRate) : '' : capRatePct} onChange={e => setCapRatePct(e.target.value)} placeholder="6.50"
                        className="w-full bg-white/8 text-white border border-white/12 focus:border-teal font-light transition-colors"
                        style={{ padding: '0.9rem 1rem', fontSize: '1.1rem' }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/75 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>%</span>
                    </div>
                  </div>

                  <p id="cap-rate-hint" className="text-white/75 text-sm">Enter 6 for 6%. No market cap rate is supplied; use comparable income and price evidence on a consistent basis.</p>
                  {/* Annual NOI */}
                  <div>
                    <label htmlFor="cap-noi" className="block text-white/75 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Net operating income (NOI)
                      {target === 'noi' && <span className="ml-2 text-teal text-xs font-normal normal-case tracking-normal">(calculated)</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/75 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>$</span>
                      <input id="cap-noi" inputMode="decimal" type="text" aria-describedby="cap-noi-hint" readOnly={target === 'noi'} value={target === 'noi' ? validScenario ? String(calcNOI) : '' : annualNOI} onChange={e => {
                        setAnnualNOI(e.target.value)
                      }} placeholder="90,000"
                        className="w-full bg-white/8 text-white border border-white/12 focus:border-teal font-light placeholder:text-white/75 transition-colors"
                        style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                      />
                    </div>
                    <p id="cap-noi-hint" className="text-white/75 font-light mt-1" style={{ fontSize: '0.85rem' }}>Annual property operating income, before financing and income tax. Use the helper button to copy NOI into this scenario.</p>
                  </div>
                </div>

                {/* How-to hint */}
                <div className="mt-4 bg-white/4 border border-white/8 rounded" style={{ padding: '0.875rem 1.25rem' }}>
                  <p className="text-white/75 font-light" style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>
                    The selected result is read-only. Cap rate = annual NOI ÷ property price × 100. Capitalised value = NOI ÷ (cap rate ÷ 100). Implied NOI = price × (cap rate ÷ 100).
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT, Results */}
            <div>
              <p className="text-white/75 font-semibold uppercase tracking-[0.2em] mb-5" style={{ fontSize: '0.65rem' }}>Your results</p>

              {/* Net rent hero */}
              {netRent > 0 && (
                <div className="bg-teal/10 border border-teal/25 mb-4 rounded" style={{ padding: '1.5rem 1.5rem' }}>
                  <p className="text-teal font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.6rem' }}>Helper NOI p.a.</p>
                  <p className="text-teal font-black" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{fmt(netRent)}</p>
                </div>
              )}

              {/* Bidirectional results */}
              <div aria-live="polite" aria-atomic="true" data-testid="cap-results">
              {validScenario ? (
                <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                    <MetricCard label="Cap rate" value={fmtPct(calcRate)} />
                    <MetricCard label={target === 'value' ? 'Indicative capitalised value' : 'Entered property price / value'} value={calcPrice > 0 ? fmt(calcPrice) : ', '} />
                    <MetricCard label="NOI p.a." value={fmt(calcNOI)} />
                  </div>

                  <p className="text-white/75 text-sm leading-relaxed">Displayed dollars are rounded; rates show two decimal places. Calculations retain unrounded values. This is not an after-tax, leveraged or total investment return.</p>
                  {calcNOI === 0 && <p className="text-white">Zero NOI gives zero income yield, not evidence that a property has no market value.</p>}
                </div>
              ) : (
                <div className="border border-white/8 bg-white/3 mb-5" style={{ padding: '2rem 1.5rem' }}>
                  <p className="text-white/75 font-light text-center" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {'error' in scenario ? scenario.error : ''}
                  </p>
                </div>
              )}

              </div>
              {/* Implied values table */}
              {valuesAtRates.length > 0 && (
                <div className="border border-white/8 mb-5">
                  <p className="text-white/75 font-semibold uppercase tracking-widest border-b border-white/8 px-4 py-4" style={{ fontSize: '0.65rem' }}>
                    Illustrative values using the scenario NOI
                  </p>
                  {valuesAtRates.map((item, i, arr) => {
                    const isActive = validScenario && Math.abs(item.rate - calcRate) < 0.01
                    return (
                      <div key={item.rate}
                        className={`flex justify-between items-center px-4 py-4 transition-colors ${i < arr.length - 1 ? 'border-b border-white/6' : ''} ${isActive ? 'bg-teal/8' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-white/75 font-light" style={{ fontSize: '0.9rem', minWidth: 44 }}>{fmtPct(item.rate)}</span>
                          {isActive && <span className="text-teal font-bold px-1.5 py-0.5 border border-teal/30 rounded text-xs">YOUR RATE</span>}
                        </div>
                        <span className={`font-bold ${isActive ? 'text-teal' : 'text-white/80'}`} style={{ fontSize: '0.95rem', overflowWrap: 'anywhere', minWidth: 0 }}>{fmt(item.value)}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              <aside style={{ padding: 20, marginBottom: 20 }} className="border border-white/15" aria-labelledby="cap-assumptions-heading">
                <h3 id="cap-assumptions-heading" style={{ marginBottom: 12 }} className="text-white font-semibold mb-3">Check the assumptions behind the result.</h3>
                <p className="text-white/75 leading-relaxed text-sm">The sensitivity rates are examples, not market benchmarks. A passing-income yield is not automatically a market capitalisation rate. A valuer must assess comparable transactions, sustainable income, condition and the appropriate valuation method.</p>
                <p className="text-white/75 text-sm leading-relaxed mt-4">Use consistent GST treatment for income, expenses and price. This tool does not calculate GST liability, tax deductions, acquisition costs or equity returns. NOI is not cash left after mortgage payments. Capital works and acquisition costs need separate assessment.</p>
                <p className="text-white/75 text-sm leading-relaxed mt-4">This one-period model does not separately model lease expiry, incentives, rent reviews, future vacancy, capital works, growth or sale proceeds. A property requiring stabilisation or redevelopment may need another valuation method.</p>
                <p className="text-white/75 text-sm leading-relaxed mt-4">Example only: $90,000 annual NOI ÷ $1,500,000 price = 6.00%. At the same NOI and 7.00%, the capitalised amount is about $1,285,714. These are arithmetic examples, not appraisals.</p>
                <p className="text-white/75 text-sm leading-relaxed mt-4">Calculation and source review: 22 October 2026. Have an accountant check your income and tax basis, and a suitably qualified valuer assess any property value you intend to rely on.</p>
                <a href="https://www.propertycouncil.com.au/news-research/research/glossary-of-terms" className="inline-block text-teal underline underline-offset-4 mt-4 text-sm">Australian property glossary: capitalisation rate</a><br />
                <a style={{ marginTop: 16 }} href="https://ww3.rics.org/uk/en/journals/property-journal/apc-valuation-competency-advice.html" className="inline-block text-teal underline underline-offset-4 mt-4 text-sm">Read RICS guidance on valuation methods</a>
              </aside>

              {/* Reset */}
              <button onClick={() => { setPurchasePrice(''); setAnnualNOI(''); setCapRatePct(''); setNetRentDirect(''); setGrossRent(''); setVacancy('0'); setOutgoings(''); setTarget('rate'); setNetRentMode('derive') }}
                className="text-white/75 hover:text-white/75 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                ← Reset all
              </button>
            </div>
          </div>

          <div style={{ paddingBottom: 'clamp(4rem,8vw,6rem)' }} />

          {/* CTA */}
          <div className="mt-20 md:mt-28 pt-12 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Want expert analysis?</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              Turn your calculations into a commercial property brief.
            </h2>
            <Link href="/buyers-agency#buyer-enquiry"
              className="inline-block bg-teal text-near-black font-bold no-underline hover:bg-white transition-colors"
              style={{ padding: '1rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Discuss my property brief →
            </Link>
          </div>

        </div>
      </div>

      <div className="bg-gray-50" style={{ padding: "1.5rem clamp(1.5rem,8vw,10rem)" }}>
        <div className="max-w-screen-xl mx-auto">
          <p className="text-mid-grey font-light text-center" style={{ fontSize: "0.72rem", lineHeight: 1.7 }}>
            This tool checks arithmetic from your assumptions. It is not a valuation, tax calculation, financial advice or a recommended purchase price. No accountant or Certified Practising Valuer sign-off is claimed.
          </p>
        </div>
      </div>
      <div className="cap-rate-guide"><ToolGuide purpose="Explore how income, purchase price and an assumed capitalisation rate relate to one another." inputs="A purchase price, annual net operating income or a cap-rate assumption. Enter two fields to calculate the third." result="A scenario based on the inputs shown. Preset rates are examples, not a market appraisal or a recommended purchase price." next="Explore commercial buyer-side support" href="/buyers-agency" /></div>
      </main>

      <Footer />
    </>
  )
}
