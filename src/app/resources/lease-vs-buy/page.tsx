'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import ToolGate from '@/components/ToolGate'
import { HUBSPOT } from '@/lib/constants'

const SEC = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

function fmtAUD(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function parseNum(s: string) {
  return parseFloat(s.replace(/[$,\s]/g, '')) || 0
}

interface CalcResult {
  leaseTotalCost: number
  buyTotalCost: number
  breakEvenYear: number | null
  capitalGain: number
  remainingLoan: number
  netEquity: number
  leaseIsCheaper: boolean
  years: number
  annualLeaseYears: number[]
  buyCumulativeYears: number[]
  leaseCumulativeYears: number[]
}

function calcMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function calcRemainingLoan(principal: number, annualRate: number, loanTermYears: number, yearsElapsed: number): number {
  const r = annualRate / 100 / 12
  const n = loanTermYears * 12
  const p = yearsElapsed * 12
  if (r === 0) return Math.max(0, principal - (principal / n) * p)
  const monthlyPayment = calcMonthlyPayment(principal, annualRate, loanTermYears)
  // Remaining balance formula
  return principal * Math.pow(1 + r, p) - monthlyPayment * ((Math.pow(1 + r, p) - 1) / r)
}

function calcLeaseVsBuy(
  annualRentPerSqm: number,
  sqm: number,
  leaseTerm: number,
  rentIncreasePct: number,
  fitoutContribution: number,
  purchasePrice: number,
  depositPct: number,
  interestRatePct: number,
  loanTermYears: number,
  outgoingsPct: number,
  capitalGrowthPct: number,
): CalcResult {
  const loanAmount = purchasePrice * (1 - depositPct / 100)
  const deposit = purchasePrice * (depositPct / 100)
  const monthlyPayment = calcMonthlyPayment(loanAmount, interestRatePct, loanTermYears)

  // Lease: sum annual costs with escalation
  const annualLeaseYears: number[] = []
  let leaseTotal = 0
  let baseRent = annualRentPerSqm * sqm
  for (let y = 1; y <= leaseTerm; y++) {
    if (y > 1) baseRent *= (1 + rentIncreasePct / 100)
    annualLeaseYears.push(baseRent)
    leaseTotal += baseRent
  }
  leaseTotal -= fitoutContribution

  // Buy: deposit + mortgage payments + outgoings - capital gain
  const capitalGain = purchasePrice * (Math.pow(1 + capitalGrowthPct / 100, leaseTerm) - 1)
  const mortgageTotal = monthlyPayment * leaseTerm * 12
  const outgoingsTotal = (outgoingsPct / 100) * purchasePrice * leaseTerm
  const buyTotal = deposit + mortgageTotal + outgoingsTotal - capitalGain

  // Remaining loan at end of term
  const remLoan = Math.max(0, calcRemainingLoan(loanAmount, interestRatePct, loanTermYears, leaseTerm))
  const netEquity = capitalGain - remLoan

  // Cumulative per year arrays for break-even detection
  const leaseCumulativeYears: number[] = []
  const buyCumulativeYears: number[] = []
  let lcum = 0
  let baseR2 = annualRentPerSqm * sqm
  for (let y = 1; y <= leaseTerm; y++) {
    if (y > 1) baseR2 *= (1 + rentIncreasePct / 100)
    lcum += baseR2
    leaseCumulativeYears.push(lcum - (y === leaseTerm ? fitoutContribution : 0))
  }
  for (let y = 1; y <= leaseTerm; y++) {
    const cg = purchasePrice * (Math.pow(1 + capitalGrowthPct / 100, y) - 1)
    const mCost = monthlyPayment * y * 12
    const oCost = (outgoingsPct / 100) * purchasePrice * y
    buyCumulativeYears.push(deposit + mCost + oCost - cg)
  }

  // Break-even year: first year where buy cumulative < lease cumulative
  let breakEvenYear: number | null = null
  for (let y = 0; y < leaseTerm; y++) {
    if (buyCumulativeYears[y] < leaseCumulativeYears[y]) {
      breakEvenYear = y + 1
      break
    }
  }

  return {
    leaseTotalCost: leaseTotal,
    buyTotalCost: buyTotal,
    breakEvenYear,
    capitalGain,
    remainingLoan: remLoan,
    netEquity,
    leaseIsCheaper: leaseTotal < buyTotal,
    years: leaseTerm,
    annualLeaseYears,
    buyCumulativeYears,
    leaseCumulativeYears,
  }
}

const INPUT_STYLE = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.15)',
  outline: 'none',
  padding: '0.9rem 1rem',
  fontSize: '1rem',
  fontWeight: 300,
  transition: 'border-color 0.15s',
} as const

const LABEL_STYLE = {
  display: 'block',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  marginBottom: '0.6rem',
} as const

export default function LeaseVsBuyPage() {
  // Lease inputs
  const [annualRentPerSqm, setAnnualRentPerSqm] = useState('')
  const [sqm, setSqm] = useState('')
  const [leaseTerm, setLeaseTerm] = useState<number | ''>('')
  const [rentIncrease, setRentIncrease] = useState('3.5')
  const [fitoutContrib, setFitoutContrib] = useState('0')

  // Buy inputs
  const [purchasePrice, setPurchasePrice] = useState('')
  const [depositPct, setDepositPct] = useState('30')
  const [interestRate, setInterestRate] = useState('6.5')
  const [loanTerm, setLoanTerm] = useState<number | ''>(25)
  const [outgoingsPct, setOutgoingsPct] = useState('1.5')
  const [capitalGrowth, setCapitalGrowth] = useState('4')

  const [result, setResult] = useState<CalcResult | null>(null)

  const LEASE_TERMS = [1, 2, 3, 5, 7, 10]
  const LOAN_TERMS = [10, 15, 20, 25, 30]
  const RENT_INCREASE_OPTIONS = [
    { value: '3', label: '3%' },
    { value: '3.5', label: '3.5%' },
    { value: '4', label: '4%' },
    { value: '3.5cpi', label: 'CPI ~3.5%' },
  ]

  const canCalc =
    parseNum(annualRentPerSqm) > 0 &&
    parseNum(sqm) > 0 &&
    leaseTerm !== '' &&
    parseNum(purchasePrice) > 0

  function handleCalc() {
    if (!canCalc) return
    const r = parseNum(rentIncrease === '3.5cpi' ? '3.5' : rentIncrease)
    setResult(calcLeaseVsBuy(
      parseNum(annualRentPerSqm),
      parseNum(sqm),
      leaseTerm as number,
      r,
      parseNum(fitoutContrib),
      parseNum(purchasePrice),
      parseNum(depositPct) || 30,
      parseNum(interestRate) || 6.5,
      loanTerm as number || 25,
      parseNum(outgoingsPct) || 1.5,
      parseNum(capitalGrowth) || 4,
    ))
  }

  function handleReset() {
    setResult(null)
  }

  const teaserContent = result && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white/5 border border-white/10" style={{ padding: '1.5rem 1.25rem' }}>
        <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Total Lease Cost</p>
        <p className="text-white font-black leading-tight blur-sm select-none" style={{ fontSize: '1.6rem' }}>
          {fmtAUD(result.leaseTotalCost)}
        </p>
      </div>
      <div className="bg-white/5 border border-white/10" style={{ padding: '1.5rem 1.25rem' }}>
        <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Total Buy Cost</p>
        <p className="text-white font-black leading-tight blur-sm select-none" style={{ fontSize: '1.6rem' }}>
          {fmtAUD(result.buyTotalCost)}
        </p>
      </div>
    </div>
  )

  const fullResults = result && (
    <div>
      <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>
        {result.years}-Year Comparison
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className={`border ${result.leaseIsCheaper ? 'bg-teal/10 border-teal/30' : 'bg-white/5 border-white/10'}`} style={{ padding: '1.5rem 1.25rem' }}>
          <p className={`font-light mb-1 uppercase tracking-widest ${result.leaseIsCheaper ? 'text-teal/70' : 'text-white/40'}`} style={{ fontSize: '0.65rem' }}>
            Total Lease Cost
            {result.leaseIsCheaper && <span className="ml-2 text-teal">✓ Cheaper</span>}
          </p>
          <p className={`font-black leading-tight ${result.leaseIsCheaper ? 'text-teal' : 'text-white'}`} style={{ fontSize: '1.6rem' }}>
            {fmtAUD(result.leaseTotalCost)}
          </p>
        </div>
        <div className={`border ${!result.leaseIsCheaper ? 'bg-teal/10 border-teal/30' : 'bg-white/5 border-white/10'}`} style={{ padding: '1.5rem 1.25rem' }}>
          <p className={`font-light mb-1 uppercase tracking-widest ${!result.leaseIsCheaper ? 'text-teal/70' : 'text-white/40'}`} style={{ fontSize: '0.65rem' }}>
            Total Buy Cost
            {!result.leaseIsCheaper && <span className="ml-2 text-teal">✓ Better Value</span>}
          </p>
          <p className={`font-black leading-tight ${!result.leaseIsCheaper ? 'text-teal' : 'text-white'}`} style={{ fontSize: '1.6rem' }}>
            {fmtAUD(result.buyTotalCost)}
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 border border-white/8" style={{ padding: '1.25rem 1rem' }}>
          <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>Break-Even Year</p>
          <p className="text-white font-black" style={{ fontSize: '1.3rem' }}>
            {result.breakEvenYear !== null ? `Year ${result.breakEvenYear}` : 'After term'}
          </p>
        </div>
        <div className="bg-white/5 border border-white/8" style={{ padding: '1.25rem 1rem' }}>
          <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>Capital Gain</p>
          <p className="text-white font-black" style={{ fontSize: '1.3rem' }}>{fmtAUD(result.capitalGain)}</p>
        </div>
        <div className="bg-white/5 border border-white/8" style={{ padding: '1.25rem 1rem' }}>
          <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>Net Equity Position</p>
          <p className={`font-black ${result.netEquity >= 0 ? 'text-teal' : 'text-red-400'}`} style={{ fontSize: '1.3rem' }}>
            {result.netEquity >= 0 ? '+' : ''}{fmtAUD(result.netEquity)}
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="border border-teal/30 bg-teal/8 mb-6" style={{ padding: '1.25rem 1.5rem' }}>
        <p className="text-teal font-black uppercase tracking-wide mb-1" style={{ fontSize: '0.7rem' }}>Recommendation</p>
        <p className="text-white font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>
          {result.leaseIsCheaper
            ? 'Leasing is more cost-effective for your term. The cash you\'d otherwise commit to a deposit and mortgage payments can be deployed elsewhere in your business.'
            : 'Purchasing builds long-term equity advantage. Over your selected term, buying comes out ahead once capital growth and equity are accounted for.'}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="border border-yellow-500/20 bg-yellow-500/5 mb-6" style={{ padding: '1.25rem 1.5rem' }}>
        <p className="text-yellow-300/70 font-light leading-relaxed" style={{ fontSize: '0.78rem', lineHeight: 1.7 }}>
          This is an indicative financial model only. We strongly recommend independent financial and legal advice before any property purchase.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="/buyers-agency"
          className="inline-flex items-center gap-2 bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
          style={{ padding: '1rem 2rem', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: '0.5rem' }}
        >
          Talk to a Buyers Agent →
        </a>
        <a
          href="/tenant-rep"
          className="inline-flex items-center gap-2 text-white font-bold no-underline hover:text-teal transition-colors border border-white/20 hover:border-teal/50"
          style={{ padding: '1rem 2rem', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: '0.5rem' }}
        >
          Find the Right Lease →
        </a>
      </div>

      <button onClick={handleReset} className="text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
        ← Reset
      </button>
    </div>
  )

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(6rem,14vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ ...WRAP, paddingTop: 'clamp(4rem,8vw,6rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>

          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl" style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}>
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-6" style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
              <h1 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                Lease vs Buy Calculator
              </h1>
              <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
                Compare the true cost of leasing vs buying commercial property over your chosen term. Model mortgage repayments, outgoings, capital growth and equity in one place.
              </p>
            </div>
          </FadeIn>

          {/* Inputs — two columns on desktop */}
          <FadeIn delay={60}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-start" style={{ gap: 'clamp(2rem,5vw,4rem)', marginBottom: 'clamp(3rem,6vw,5rem)' }}>

              {/* Lease side */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/8 border border-white/15" style={{ padding: '0.35rem 0.85rem' }}>
                    <p className="text-white font-black uppercase tracking-widest" style={{ fontSize: '0.68rem' }}>Lease</p>
                  </div>
                </div>

                <div className="flex flex-col" style={{ gap: '1.75rem' }}>
                  <div>
                    <label style={LABEL_STYLE}>Annual rent ($/sqm/yr) <span style={{ color: '#00B5A5' }}>*</span></label>
                    <input
                      type="number"
                      value={annualRentPerSqm}
                      onChange={e => { setAnnualRentPerSqm(e.target.value); setResult(null) }}
                      placeholder="e.g. 350"
                      style={INPUT_STYLE}
                      className="focus:border-teal"
                    />
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Sqm required <span style={{ color: '#00B5A5' }}>*</span></label>
                    <input
                      type="number"
                      value={sqm}
                      onChange={e => { setSqm(e.target.value); setResult(null) }}
                      placeholder="e.g. 250"
                      style={INPUT_STYLE}
                      className="focus:border-teal"
                    />
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Lease term (years) <span style={{ color: '#00B5A5' }}>*</span></label>
                    <div className="grid grid-cols-6 gap-2">
                      {LEASE_TERMS.map(t => (
                        <button
                          key={t}
                          onClick={() => { setLeaseTerm(t); setResult(null) }}
                          className={`font-bold border transition-colors text-center ${leaseTerm === t ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                          style={{ padding: '0.6rem 0.25rem', fontSize: '0.85rem' }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Annual rent increases</label>
                    <div className="grid grid-cols-4 gap-2">
                      {RENT_INCREASE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setRentIncrease(opt.value); setResult(null) }}
                          className={`font-bold border transition-colors text-center ${rentIncrease === opt.value ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                          style={{ padding: '0.6rem 0.25rem', fontSize: '0.8rem' }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Fitout contribution from landlord ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                      <input
                        type="number"
                        value={fitoutContrib}
                        onChange={e => { setFitoutContrib(e.target.value); setResult(null) }}
                        placeholder="0"
                        style={{ ...INPUT_STYLE, paddingLeft: '2rem' }}
                        className="focus:border-teal"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy side */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-teal/10 border border-teal/30" style={{ padding: '0.35rem 0.85rem' }}>
                    <p className="text-teal font-black uppercase tracking-widest" style={{ fontSize: '0.68rem' }}>Buy</p>
                  </div>
                </div>

                <div className="flex flex-col" style={{ gap: '1.75rem' }}>
                  <div>
                    <label style={LABEL_STYLE}>Purchase price ($) <span style={{ color: '#00B5A5' }}>*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-light" style={{ fontSize: '1rem' }}>$</span>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={e => { setPurchasePrice(e.target.value); setResult(null) }}
                        placeholder="e.g. 1,200,000"
                        style={{ ...INPUT_STYLE, paddingLeft: '2rem' }}
                        className="focus:border-teal"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Deposit (%)</label>
                    <input
                      type="number"
                      value={depositPct}
                      onChange={e => { setDepositPct(e.target.value); setResult(null) }}
                      placeholder="30"
                      style={INPUT_STYLE}
                      className="focus:border-teal"
                    />
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Interest rate (%)</label>
                    <input
                      type="number"
                      value={interestRate}
                      step={0.1}
                      onChange={e => { setInterestRate(e.target.value); setResult(null) }}
                      placeholder="6.5"
                      style={INPUT_STYLE}
                      className="focus:border-teal"
                    />
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Loan term (years)</label>
                    <div className="grid grid-cols-5 gap-2">
                      {LOAN_TERMS.map(t => (
                        <button
                          key={t}
                          onClick={() => { setLoanTerm(t); setResult(null) }}
                          className={`font-bold border transition-colors text-center ${loanTerm === t ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                          style={{ padding: '0.6rem 0.25rem', fontSize: '0.85rem' }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Annual outgoings (% of value)</label>
                    <input
                      type="number"
                      value={outgoingsPct}
                      step={0.1}
                      onChange={e => { setOutgoingsPct(e.target.value); setResult(null) }}
                      placeholder="1.5"
                      style={INPUT_STYLE}
                      className="focus:border-teal"
                    />
                    <p className="text-white/25 font-light mt-1" style={{ fontSize: '0.72rem' }}>Council rates, insurance, maintenance, etc.</p>
                  </div>

                  <div>
                    <label style={LABEL_STYLE}>Annual capital growth (%)</label>
                    <input
                      type="number"
                      value={capitalGrowth}
                      step={0.5}
                      onChange={e => { setCapitalGrowth(e.target.value); setResult(null) }}
                      placeholder="4"
                      style={INPUT_STYLE}
                      className="focus:border-teal"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalc}
              disabled={!canCalc}
              className={`font-bold transition-all ${canCalc ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              style={{ padding: '1.25rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '0.5rem' }}
            >
              Compare Lease vs Buy →
            </button>
          </FadeIn>

          {/* Results */}
          {result && (
            <FadeIn delay={80}>
              <div style={{ marginTop: 'clamp(3rem,6vw,5rem)' }}>
                <div className="border-t border-white/8" style={{ paddingTop: 'clamp(2rem,4vw,3rem)' }}>
                  <ToolGate
                    tool="Lease vs Buy Calculator"
                    teaser={
                      <div>
                        <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-4" style={{ fontSize: '0.7rem' }}>
                          Your {result.years}-year cost comparison
                        </p>
                        {teaserContent}
                      </div>
                    }
                    context={() => `Lease term: ${result.years} years, Lease cost: ${fmtAUD(result.leaseTotalCost)}, Buy cost: ${fmtAUD(result.buyTotalCost)}`}
                  >
                    {fullResults}
                  </ToolGate>
                </div>
              </div>
            </FadeIn>
          )}

          <div style={{ paddingBottom: 'clamp(4rem,8vw,6rem)' }} />

          {/* CTA */}
          <div className="mt-20 md:mt-28 pt-12 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Need expert advice?</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              We help businesses work out whether leasing or buying makes more sense for their situation.
            </h2>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
              style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
              Book a Strategy Session →
            </a>
          </div>

        </div>
      </div>

      {/* CTA section */}
      <section className="bg-teal" style={SEC}>
        <div className="max-w-screen-xl mx-auto text-center" style={WRAP}>
          <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
            The numbers are only part of the decision.
          </h2>
          <p className="text-white/80 font-light leading-relaxed mb-12 mx-auto"
            style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
            We&apos;ll help you factor in your business plan, cash flow needs and the current commercial market before you commit to either path.
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
