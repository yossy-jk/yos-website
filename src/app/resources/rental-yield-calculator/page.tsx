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
function fmtPct(n: number) { return n.toFixed(2) + '%' }
function parseNum(s: string) { return parseFloat(s.replace(/[$,]/g, '')) || 0 }

interface Result {
  grossYield: number
  netYield: number
  annualGross: number
  annualNet: number
  monthlyNet: number
  weeklyEffective: number
  weeklyBreakEven: number
  annualMgmtFee: number
}

function calculate(
  price: number,
  weeklyRent: number,
  outgoings: number,
  vacancyPct: number,
  mgmtFeePct: number
): Result | null {
  if (!price || !weeklyRent) return null
  const vacRate = vacancyPct / 100
  const mgmtRate = mgmtFeePct / 100

  const annualGross = weeklyRent * 52
  const weeklyEffective = weeklyRent * (1 - vacRate)
  const annualEffective = weeklyEffective * 52
  const annualMgmtFee = annualEffective * mgmtRate
  const annualNet = annualEffective - outgoings - annualMgmtFee
  const grossYield = (annualGross / price) * 100
  const netYield = (annualNet / price) * 100
  const monthlyNet = annualNet / 12

  // Break-even weekly rent: where annual net = 0
  // effectiveRent * 52 * (1 - mgmtRate) = outgoings
  // weeklyBreakEven = outgoings / (52 * (1 - mgmtRate) * (1 - vacRate))
  const weeklyBreakEven =
    mgmtRate < 1 && vacRate < 1
      ? outgoings / (52 * (1 - mgmtRate) * (1 - vacRate))
      : 0

  return { grossYield, netYield, annualGross, annualNet, monthlyNet, weeklyEffective, weeklyBreakEven, annualMgmtFee }
}

export default function RentalYieldCalculatorPage() {
  const [price, setPrice] = useState('')
  const [rent, setRent] = useState('')
  const [outgoings, setOutgoings] = useState('')
  const [vacancy, setVacancy] = useState('5')
  const [mgmtFee, setMgmtFee] = useState('8')
  const [result, setResult] = useState<Result | null>(null)

  const priceNum = parseNum(price)
  const rentNum = parseNum(rent)
  const outgoingsNum = parseNum(outgoings)
  const vacancyNum = parseFloat(vacancy) || 0
  const mgmtFeeNum = parseFloat(mgmtFee) || 0

  const canCalc = priceNum > 0 && rentNum > 0

  function handleCalc() {
    const r = calculate(priceNum, rentNum, outgoingsNum, vacancyNum, mgmtFeeNum)
    setResult(r)
  }

  function handleReset() {
    setResult(null)
    setPrice('')
    setRent('')
    setOutgoings('')
    setVacancy('5')
    setMgmtFee('8')
  }

  const grossYieldDisplay = result ? fmtPct(result.grossYield) : null

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(6rem,14vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ ...WRAP, paddingTop: 'clamp(4rem,8vw,6rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>

          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl" style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}>
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-5" style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
              <h1 className="text-white font-black uppercase leading-tight tracking-tight"
                style={{ fontSize: 'clamp(2rem,5vw,4rem)', marginBottom: '1.25rem' }}>
                Rental Yield Calculator
              </h1>
              <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                Enter the property details below to see gross and net yield. Factors in vacancy, outgoings, and management fees — so you get a real number, not just face rent.
              </p>
            </div>
          </FadeIn>

          {/* Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: "clamp(2.5rem,6vw,5rem)" }}>

            {/* Inputs */}
            <FadeIn delay={60}>
              <p className="text-white/40 font-semibold uppercase tracking-[0.25em]" style={{ fontSize: '0.7rem', marginBottom: '2rem' }}>Property details</p>

              <div className="flex flex-col" style={{ gap: "2rem" }}>
                {/* Purchase price */}
                <div>
                  <label className="block text-white/70 font-semibold mb-4" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Purchase price ($) <span className="text-teal">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={price} onChange={e => setPrice(e.target.value)}
                      placeholder="1,200,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                </div>

                {/* Weekly rent */}
                <div>
                  <label className="block text-white/70 font-semibold mb-4" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Weekly rent ($) <span className="text-teal">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={rent} onChange={e => setRent(e.target.value)}
                      placeholder="1,500"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                </div>

                {/* Annual outgoings */}
                <div>
                  <label className="block text-white/70 font-semibold mb-4" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Annual outgoings ($) <span className="text-white/30 font-light">optional</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                    <input type="text" value={outgoings} onChange={e => setOutgoings(e.target.value)}
                      placeholder="12,000"
                      className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                      style={{ padding: '0.9rem 1rem 0.9rem 2rem', fontSize: '1.1rem' }}
                    />
                  </div>
                  <p className="text-white/25 font-light mt-1" style={{ fontSize: '0.75rem' }}>Rates, insurance, land tax paid by landlord. Enter $0 if outgoings are gross.</p>
                </div>

                {/* Vacancy rate */}
                <div>
                  <label className="block text-white/70 font-semibold mb-4" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Vacancy rate (%)
                  </label>
                  <div className="flex gap-3 flex-wrap mb-2">
                    {['0', '2', '5', '8', '10', '15'].map(v => (
                      <button key={v} onClick={() => setVacancy(v)}
                        className={`font-bold border transition-colors ${vacancy === v ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.55rem 0.9rem', fontSize: '0.88rem' }}>
                        {v}%
                      </button>
                    ))}
                  </div>
                  <p className="text-white/25 font-light" style={{ fontSize: '0.75rem' }}>Default 5%. Represents weeks vacant per year.</p>
                </div>

                {/* Management fee */}
                <div>
                  <label className="block text-white/70 font-semibold mb-4" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Annual management fee (%)
                  </label>
                  <div className="flex gap-3 flex-wrap mb-2">
                    {['0', '5', '6', '7', '8', '10'].map(v => (
                      <button key={v} onClick={() => setMgmtFee(v)}
                        className={`font-bold border transition-colors ${mgmtFee === v ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.55rem 0.9rem', fontSize: '0.88rem' }}>
                        {v}%
                      </button>
                    ))}
                  </div>
                  <p className="text-white/25 font-light" style={{ fontSize: '0.75rem' }}>Default 8%. Applied to effective rent (after vacancy).</p>
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
              {!result ? (
                <div className="border border-white/8 bg-white/3" style={{ padding: '2.5rem 2rem' }}>
                  <p className="text-white/25 font-light text-center" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Enter the purchase price and weekly rent to see your yield calculation.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Your results</p>

                  {/* Gross yield — shown instantly, no gate */}
                  <div className="bg-teal/10 border border-teal/30 mb-6" style={{ padding: '1.75rem 1.5rem' }}>
                    <p className="text-teal/70 font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Gross yield</p>
                    <p className="text-teal font-black leading-none mb-1" style={{ fontSize: '3rem' }}>{grossYieldDisplay}</p>
                    <p className="text-teal/50 font-light" style={{ fontSize: '0.78rem' }}>
                      Annual gross income: {fmt(result.annualGross)}
                    </p>
                  </div>

                  {/* Net breakdown — behind ToolGate */}
                  <ToolGate
                    tool="Rental Yield Calculator"
                    context={() => `Purchase price: $${priceNum} | Weekly rent: $${rentNum} | Gross yield: ${fmtPct(result!.grossYield)} | Net yield: ${fmtPct(result!.netYield)}`}
                    heading="Unlock the full net breakdown"
                    subheading="See net yield, monthly income, break-even rent and more — free."
                    teaser={
                      <div>
                        <div className="border border-white/10">
                          <div className="border-b border-white/10 px-5 py-3">
                            <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Net breakdown — unlock to view</p>
                          </div>
                          {['Net yield', 'Annual net income', 'Monthly net income', 'Weekly effective rent', 'Break-even weekly rent'].map((label, i) => (
                            <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-white/6">
                              <span className="text-white/50 font-light" style={{ fontSize: '0.875rem' }}>{label}</span>
                              <span className="w-20 h-3 bg-white/10 rounded-lg" />
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    {/* Full net breakdown */}
                    <div className="border border-white/10">
                      <div className="border-b border-white/10 px-5 py-3">
                        <p className="text-white/50 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Net breakdown</p>
                      </div>
                      {[
                        { label: 'Gross yield', value: fmtPct(result.grossYield), highlight: false },
                        { label: 'Net yield', value: fmtPct(result.netYield), highlight: true },
                        { label: 'Annual gross income', value: fmt(result.annualGross), highlight: false },
                        { label: 'Vacancy deduction', value: `−${fmt(result.annualGross - result.weeklyEffective * 52)}`, highlight: false },
                        { label: 'Management fee deduction', value: `−${fmt(result.annualMgmtFee)}`, highlight: false },
                        { label: 'Annual outgoings', value: `−${fmt(outgoingsNum)}`, highlight: false },
                        { label: 'Annual net income', value: fmt(result.annualNet), highlight: true },
                        { label: 'Monthly net income', value: fmt(result.monthlyNet), highlight: false },
                        { label: 'Weekly effective rent (after vacancy)', value: fmt(result.weeklyEffective), highlight: false },
                        ...(outgoingsNum > 0 ? [{ label: 'Break-even weekly rent', value: fmt(result.weeklyBreakEven), highlight: false }] : []),
                      ].map((row, i, arr) => (
                        <div key={i} className={`flex justify-between items-center px-5 py-4 ${i < arr.length - 1 ? 'border-b border-white/6' : ''} ${row.highlight ? 'bg-teal/10' : ''}`}>
                          <span className={`font-light ${row.highlight ? 'text-teal font-semibold' : 'text-white/70'}`} style={{ fontSize: '0.875rem' }}>{row.label}</span>
                          <span className={`font-bold ${row.highlight ? 'text-teal' : 'text-white'}`} style={{ fontSize: '0.9rem' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-white/25 font-light mt-5 leading-relaxed" style={{ fontSize: '0.75rem', lineHeight: 1.7 }}>
                      This is an estimate only. Verify with a qualified accountant or solicitor before making decisions.
                    </p>

                    <button onClick={handleReset} className="block mt-4 text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
                      ← Reset
                    </button>
                  </ToolGate>
                </div>
              )}
            </FadeIn>
          </div>

          {/* spacer */}
          <div style={{ paddingBottom: 'clamp(4rem,8vw,6rem)' }} />

          {/* CTA */}
          <div className="mt-20 md:mt-28 pt-12 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Want expert analysis?</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              We assess any commercial property opportunity and tell you if the numbers stack up.
            </h2>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
              style={{ padding: '1rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
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
            Numbers look good? Let&apos;s talk strategy.
          </h2>
          <p className="text-white/80 font-light leading-relaxed mb-12 mx-auto"
            style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
            Yield is one metric. We help you buy the right property at the right price. First conversation is free.
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
