'use client'
import { useState } from 'react'
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
function parseNum(s: string) { return parseFloat(s.replace(/,/g, '').replace(/\$/g, '')) || 0 }

// Number input with comma formatting
function NumberInput({ label, value, onChange, placeholder, prefix = '$', suffix, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  prefix?: string; suffix?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-white/55 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-4 text-white/30 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>{prefix}</span>}
        <input type="text" value={value} onChange={e => {
          const raw = e.target.value.replace(/[^0-9.]/g, '')
          onChange(raw)
        }} placeholder={placeholder || '0'}
          className="w-full bg-white/8 text-white border border-white/12 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
          style={{ padding: prefix ? '0.9rem 1rem 0.9rem 2rem' : '0.9rem 1rem', fontSize: '1.1rem' }}
        />
        {suffix && <span className="absolute right-4 text-white/30 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>{suffix}</span>}
      </div>
      {hint && <p className="text-white/20 font-light mt-1" style={{ fontSize: '0.72rem' }}>{hint}</p>}
    </div>
  )
}

// Metric card
function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10" style={{ padding: '1.5rem 1.5rem' }}>
      <p className="text-white/35 font-light mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
      <p className="text-white font-black" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{value || '—'}</p>
      {sub && <p className="text-white/30 font-light mt-1" style={{ fontSize: '0.75rem' }}>{sub}</p>}
    </div>
  )
}

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Cap Rate Calculator for Commercial Property | Your Office Space",
  "description": "Calculate capitalisation rate for commercial property valuation and investment analysis.",
  "url": "https://www.yourofficespace.au/resources/cap-rate-calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AUD", "description": "Free to use" },
  "provider": { "@type": "Organization", "name": "Your Office Space", "url": "https://www.yourofficespace.au" },
  "areaServed": { "@type": "Country", "name": "Australia" },
}

export default function CapRateCalculatorPage() {
  // Net rent section — two modes: derive from gross or enter directly
  const [netRentMode, setNetRentMode] = useState<'derive' | 'direct'>('derive')
  const [grossRent, setGrossRent] = useState('')
  const [vacancy, setVacancy] = useState('5')
  const [outgoings, setOutgoings] = useState('')
  const [netRentDirect, setNetRentDirect] = useState('')

  // Cap rate / value inputs (bidirectional)
  const [purchasePrice, setPurchasePrice] = useState('')
  const [annualNOI, setAnnualNOI] = useState('')
  const [capRatePct, setCapRatePct] = useState('')

  // Which field was last edited (for bidirectional logic)
  const [lastEdited, setLastEdited] = useState<'price' | 'noi' | 'rate'>('price')

  // Derived net rent
  const netRent = (() => {
    if (netRentMode === 'direct') return parseNum(netRentDirect)
    const gross = parseNum(grossRent)
    const vac = parseFloat(vacancy) / 100
    const outg = parseNum(outgoings)
    return gross > 0 ? gross * (1 - vac) - outg : 0
  })()

  // Bidirectional calculation
  const results = (() => {
    const net = netRent
    const price = parseNum(purchasePrice)
    const noi = parseNum(annualNOI)
    const rate = parseFloat(capRatePct)

    // If cap rate and NOI are known → calculate price
    // If price and cap rate are known → calculate NOI
    // If price and NOI are known → calculate cap rate

    let calcPrice = 0, calcNOI = 0, calcRate = 0

    if (lastEdited === 'rate' && rate > 0 && noi > 0) {
      calcNOI = noi
      calcRate = rate
      calcPrice = noi / (rate / 100)
    } else if (lastEdited === 'price' && price > 0 && rate > 0) {
      calcPrice = price
      calcRate = rate
      calcNOI = price * (rate / 100)
    } else if (lastEdited === 'price' && price > 0 && noi > 0) {
      calcPrice = price
      calcNOI = noi
      calcRate = price > 0 ? (noi / price) * 100 : 0
    } else if (lastEdited === 'rate' && rate > 0 && price > 0) {
      calcPrice = price
      calcRate = rate
      calcNOI = price * (rate / 100)
    } else if (lastEdited === 'noi' && noi > 0 && rate > 0) {
      calcNOI = noi
      calcRate = rate
      calcPrice = noi / (rate / 100)
    } else if (lastEdited === 'noi' && noi > 0 && price > 0) {
      calcNOI = noi
      calcPrice = price
      calcRate = price > 0 ? (noi / price) * 100 : 0
    } else if (price > 0 && noi > 0) {
      calcPrice = price
      calcNOI = noi
      calcRate = price > 0 ? (noi / price) * 100 : 0
    }

    // Implied values at all cap rates
    const valuesAtRates = net > 0
      ? [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map(r => ({ rate: r, value: net / (r / 100) }))
      : []

    return { calcPrice, calcNOI, calcRate, valuesAtRates }
  })()

  const { calcPrice, calcNOI, calcRate, valuesAtRates } = results

  const presetRates = ['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0']
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
              <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
              <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
            </div>
            <h1 className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem,5vw,4rem)', marginBottom: '1.25rem' }}>
              Cap Rate Calculator
            </h1>
            <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
              Fill any two fields to calculate the third. All results update in real time. Use the net rent helper to derive rent from gross rent, or enter it directly.
            </p>
          </div>

          {/* Main calculator — two columns, always live */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: 'clamp(2.5rem,6vw,5rem)' }}>

            {/* LEFT — Inputs */}
            <div>

              {/* Net Rent Input */}
              <div className="mb-8">
                <p className="text-white/40 font-semibold uppercase tracking-[0.2em] mb-5" style={{ fontSize: '0.65rem' }}>Step 1 — Net rent</p>

                {/* Toggle derive vs direct */}
                <div className="flex gap-0 border border-white/15 mb-5 rounded overflow-hidden" style={{ maxWidth: 420 }}>
                  <button onClick={() => { setNetRentMode('derive'); setNetRentDirect('') }}
                    className={`flex-1 font-bold transition-all ${netRentMode === 'derive' ? 'bg-teal text-white' : 'bg-white/5 text-white/40 hover:text-white/60'}`}
                    style={{ padding: '0.7rem 0.75rem', fontSize: '0.78rem' }}>
                    Derive from gross
                  </button>
                  <button onClick={() => { setNetRentMode('direct'); setGrossRent(''); setVacancy('5'); setOutgoings('') }}
                    className={`flex-1 font-bold transition-all ${netRentMode === 'direct' ? 'bg-teal text-white' : 'bg-white/5 text-white/40 hover:text-white/60'}`}
                    style={{ padding: '0.7rem 0.75rem', fontSize: '0.78rem' }}>
                    Enter net directly
                  </button>
                </div>

                {netRentMode === 'derive' ? (
                  <div className="flex flex-col" style={{ gap: '1.5rem' }}>
                    <NumberInput label="Gross annual rent" value={grossRent} onChange={setGrossRent} placeholder="120,000" hint="Annual rent from the lease(s)" />
                    <div>
                      <label className="block text-white/55 font-semibold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Vacancy allowance</label>
                      <div className="flex gap-2 flex-wrap">
                        {vacancyOptions.map(v => (
                          <button key={v} onClick={() => setVacancy(v)}
                            className={`font-bold border transition-all ${vacancy === v ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/40 hover:text-white/70'}`}
                            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', borderRadius: '0.35rem' }}>
                            {v}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <NumberInput label="Annual outgoings (landlord paid)" value={outgoings} onChange={setOutgoings} placeholder="15,000" hint="Rates, insurance, land tax, management fees" />
                  </div>
                ) : (
                  <div>
                    <NumberInput label="Net annual rent (NOI)" value={netRentDirect} onChange={setNetRentDirect} placeholder="90,000" hint="Rent after all landlord costs — no vacancy adjustment" />
                  </div>
                )}

                {/* Net rent preview */}
                {netRent > 0 && (
                  <div className="mt-4 bg-teal/10 border border-teal/20 rounded" style={{ padding: '1rem 1.25rem' }}>
                    <p className="text-teal/70 font-semibold" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Net rent p.a.</p>
                    <p className="text-teal font-black" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{fmt(netRent)}</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mb-8" />

              {/* Bidirectional Cap Rate / Price / NOI */}
              <div>
                <p className="text-white/40 font-semibold uppercase tracking-[0.2em] mb-5" style={{ fontSize: '0.65rem' }}>Step 2 — Fill any two fields</p>

                <div className="flex flex-col" style={{ gap: '1.5rem' }}>
                  {/* Purchase Price */}
                  <div>
                    <label className="block text-white/55 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Purchase price
                      {lastEdited === 'price' && calcPrice > 0 && <span className="ml-2 text-teal text-xs font-normal normal-case tracking-normal">(calculated)</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>$</span>
                      <input type="text" value={purchasePrice} onChange={e => {
                        setPurchasePrice(e.target.value.replace(/[^0-9.]/g, ''))
                        setLastEdited('price')
                      }} placeholder="1,500,000"
                        className="w-full bg-white/8 text-white border border-white/12 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                        style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                      />
                    </div>
                  </div>

                  {/* Cap Rate */}
                  <div>
                    <label className="block text-white/55 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Cap rate
                      {lastEdited === 'rate' && calcRate > 0 && <span className="ml-2 text-teal text-xs font-normal normal-case tracking-normal">(calculated)</span>}
                    </label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {presetRates.map(r => (
                        <button key={r} onClick={() => { setCapRatePct(r); setLastEdited('rate') }}
                          className={`font-bold border transition-all ${capRatePct === r ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/40 hover:text-white/70'}`}
                          style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', borderRadius: '0.35rem' }}>
                          {r}%
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <input type="number" value={capRatePct} onChange={e => { setCapRatePct(e.target.value); setLastEdited('rate') }}
                        step="0.25" min="0.1" max="30" placeholder="6.50"
                        className="w-full bg-white/8 text-white border border-white/12 focus:border-teal outline-none font-light transition-colors"
                        style={{ padding: '0.9rem 1rem', fontSize: '1.1rem' }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>%</span>
                    </div>
                  </div>

                  {/* Annual NOI */}
                  <div>
                    <label className="block text-white/55 font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Net operating income (NOI)
                      {lastEdited === 'noi' && calcNOI > 0 && <span className="ml-2 text-teal text-xs font-normal normal-case tracking-normal">(calculated)</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem', pointerEvents: 'none' }}>$</span>
                      <input type="text" value={annualNOI} onChange={e => {
                        setAnnualNOI(e.target.value.replace(/[^0-9.]/g, ''))
                        setLastEdited('noi')
                      }} placeholder="90,000"
                        className="w-full bg-white/8 text-white border border-white/12 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                        style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                      />
                    </div>
                    <p className="text-white/20 font-light mt-1" style={{ fontSize: '0.72rem' }}>Or use net rent above — all results update live</p>
                  </div>
                </div>

                {/* How-to hint */}
                <div className="mt-4 bg-white/4 border border-white/8 rounded" style={{ padding: '0.875rem 1.25rem' }}>
                  <p className="text-white/35 font-light" style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>
                    Fill any two of the three fields above. The third is calculated automatically. For example: enter purchase price and target cap rate to find the implied value.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Results */}
            <div>
              <p className="text-white/40 font-semibold uppercase tracking-[0.2em] mb-5" style={{ fontSize: '0.65rem' }}>Your results</p>

              {/* Net rent hero */}
              {netRent > 0 && (
                <div className="bg-teal/10 border border-teal/25 mb-4 rounded" style={{ padding: '1.5rem 1.5rem' }}>
                  <p className="text-teal/60 font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.6rem' }}>Net rent p.a.</p>
                  <p className="text-teal font-black" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{fmt(netRent)}</p>
                </div>
              )}

              {/* Bidirectional results */}
              {calcRate > 0 || calcPrice > 0 || calcNOI > 0 ? (
                <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <MetricCard label="Cap rate" value={calcRate > 0 ? fmtPct(calcRate) : '—'} />
                    <MetricCard label="Property value" value={calcPrice > 0 ? fmt(calcPrice) : '—'} />
                    <MetricCard label="NOI p.a." value={calcNOI > 0 ? fmt(calcNOI) : '—'} />
                  </div>

                  {/* Net yield */}
                  {calcPrice > 0 && calcNOI > 0 && (
                    <MetricCard label="Net yield" value={fmtPct((calcNOI / calcPrice) * 100)} sub={`${fmt(calcNOI)} / ${fmt(calcPrice)}`} />
                  )}
                </div>
              ) : (
                <div className="border border-white/8 bg-white/3 mb-5" style={{ padding: '2rem 1.5rem' }}>
                  <p className="text-white/25 font-light text-center" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
                    Enter any two fields — purchase price, cap rate, or NOI — to see your results update in real time.
                  </p>
                </div>
              )}

              {/* Implied values table */}
              {netRent > 0 && (
                <div className="border border-white/8 mb-5">
                  <p className="text-white/40 font-semibold uppercase tracking-widest border-b border-white/8 px-4 py-4" style={{ fontSize: '0.65rem' }}>
                    Implied value at different cap rates
                  </p>
                  {valuesAtRates.map((item, i, arr) => {
                    const isActive = capRatePct && Math.abs(item.rate - parseFloat(capRatePct)) < 0.01
                    return (
                      <div key={item.rate}
                        className={`flex justify-between items-center px-4 py-4 transition-colors ${i < arr.length - 1 ? 'border-b border-white/6' : ''} ${isActive ? 'bg-teal/8' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-white/55 font-light" style={{ fontSize: '0.9rem', minWidth: 44 }}>{fmtPct(item.rate)}</span>
                          {isActive && <span className="text-teal font-bold px-1.5 py-0.5 border border-teal/30 rounded text-xs">YOUR RATE</span>}
                        </div>
                        <span className={`font-bold ${isActive ? 'text-teal' : 'text-white/80'}`} style={{ fontSize: '0.95rem' }}>{fmt(item.value)}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Benchmarks */}
              <div className="border border-white/8 mb-5">
                <p className="text-white/40 font-semibold uppercase tracking-widest border-b border-white/8 px-4 py-4" style={{ fontSize: '0.65rem' }}>
                  Market benchmarks — Australia (April 2026)
                </p>
                {BENCHMARKS.map((b, i) => (
                  <div key={b.type} className={`flex justify-between items-center px-4 py-3 ${i < BENCHMARKS.length - 1 ? 'border-b border-white/6' : ''}`}>
                    <span className="text-white/50 font-light" style={{ fontSize: '0.82rem' }}>{b.type}</span>
                    <span className="text-white/70 font-semibold" style={{ fontSize: '0.82rem' }}>{b.low}–{b.high}%</span>
                  </div>
                ))}
              </div>

              {/* Reset */}
              <button onClick={() => { setPurchasePrice(''); setAnnualNOI(''); setCapRatePct(''); setNetRentDirect(''); setGrossRent(''); setVacancy('5'); setOutgoings('') }}
                className="text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
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

      <div className="bg-gray-50" style={{ padding: "1.5rem clamp(1.5rem,8vw,10rem)" }}>
        <div className="max-w-screen-xl mx-auto">
          <p className="text-mid-grey font-light text-center" style={{ fontSize: "0.72rem", lineHeight: 1.7 }}>
            This calculator provides estimates only. Rates and thresholds change — verify with your accountant or solicitor before relying on these figures. This is not financial or legal advice.
          </p>
        </div>
      </div>
      </main>

      <Footer />
    </>
  )
}