'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const QUESTIONS = [
  {
    id: 'term',
    label: 'What is the initial lease term?',
    hint: 'Longer terms carry more financial risk if your business needs change.',
    options: ['1–2 years', '3 years', '5 years', '7+ years'],
    risk: { '7+ years': 'high', '1–2 years': 'medium' }
  },
  {
    id: 'options',
    label: 'Do you have options to renew?',
    hint: 'Options give you certainty. No options means you could be forced out.',
    options: ['No options', '1 option', '2+ options'],
    risk: { 'No options': 'high' }
  },
  {
    id: 'rent_review',
    label: 'How is rent reviewed during the lease?',
    hint: 'Market reviews can result in significant rent increases with little control.',
    options: ['Fixed % increases', 'CPI (Consumer Price Index)', 'Market review', 'Combination / not sure'],
    risk: { 'Market review': 'high', 'Combination / not sure': 'medium' }
  },
  {
    id: 'outgoings',
    label: 'Who pays outgoings (rates, insurance, maintenance)?',
    hint: 'Outgoings can add 20–40% on top of face rent. Clarity is critical.',
    options: ['Landlord pays all', 'Tenant pays some', 'Tenant pays all', 'Not clear in lease'],
    risk: { 'Tenant pays all': 'high', 'Not clear in lease': 'high', 'Tenant pays some': 'medium' }
  },
  {
    id: 'makegood',
    label: 'Does the lease include make-good obligations?',
    hint: 'Full reinstatement clauses can cost hundreds of thousands at lease end.',
    options: ['No make-good clause', 'Fair wear and tear only', 'Full reinstatement required', 'Not sure'],
    risk: { 'Full reinstatement required': 'high', 'Not sure': 'high' }
  },
  {
    id: 'assignment',
    label: 'Can you assign or sublet the lease?',
    hint: 'Restrictions here can trap you if you sell your business or need to exit.',
    options: ['Yes, with landlord consent', 'No — not permitted', 'Not mentioned / not sure'],
    risk: { 'No — not permitted': 'high', 'Not mentioned / not sure': 'medium' }
  },
  {
    id: 'guarantee',
    label: 'Does the lease require a personal guarantee?',
    hint: 'Unlimited personal guarantees put your personal assets at risk.',
    options: ['No personal guarantee', 'Yes — limited guarantee', 'Yes — unlimited guarantee', 'Not sure'],
    risk: { 'Yes — unlimited guarantee': 'high', 'Not sure': 'medium' }
  },
  {
    id: 'demolition',
    label: 'Does the landlord have a demolition or redevelopment clause?',
    hint: 'This clause can allow the landlord to terminate your lease early.',
    options: ['No such clause', 'Yes — with notice period', 'Yes — without adequate notice', 'Not sure'],
    risk: { 'Yes — without adequate notice': 'high', 'Not sure': 'medium' }
  },
  {
    id: 'fitout',
    label: 'Have you negotiated a fitout contribution or rent-free period?',
    hint: 'Most landlords offer these — if you haven\'t asked, you\'ve likely left money on the table.',
    options: ['Yes — documented in lease', 'Agreed verbally but not in lease', 'No incentive offered', 'Not requested'],
    risk: { 'Agreed verbally but not in lease': 'high', 'No incentive offered': 'medium', 'Not requested': 'medium' }
  },
  {
    id: 'solicitor',
    label: 'Has a solicitor reviewed this lease?',
    hint: 'A lease review by a property solicitor can identify clauses that cost you significantly.',
    options: ['Yes — fully reviewed', 'Skimmed it myself', 'No review yet'],
    risk: { 'No review yet': 'high', 'Skimmed it myself': 'medium' }
  },
]

type RiskLevel = 'high' | 'medium' | 'low'

function getRisk(answers: Record<string, string>): { level: RiskLevel; high: number; medium: number } {
  let high = 0, medium = 0
  for (const q of QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue
    const r = ((q.risk as unknown) as Record<string, string>)[answer]
    if (r === 'high') high++
    else if (r === 'medium') medium++
  }
  const level: RiskLevel = high >= 3 ? 'high' : high >= 1 || medium >= 3 ? 'medium' : 'low'
  return { level, high, medium }
}

const RISK_CONFIG = {
  high: { label: 'HIGH RISK', colour: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', message: 'This lease has significant risk factors. Before you sign anything, you need a professional review.' },
  medium: { label: 'MODERATE RISK', colour: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', message: 'There are some areas worth attention. A full review will show you exactly what to negotiate.' },
  low: { label: 'LOWER RISK', colour: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', message: 'Your lease looks relatively standard. A full review will confirm there are no hidden issues.' },
}

export default function LeaseRiskCheckerPage() {
  const [step, setStep] = useState<'intro' | number | 'result'>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const currentQ = typeof step === 'number' ? QUESTIONS[step] : null
  const progress = typeof step === 'number' ? ((step) / QUESTIONS.length) * 100 : step === 'result' ? 100 : 0

  function handleSelect(option: string) {
    setSelected(option)
  }

  function handleNext() {
    if (!selected || !currentQ) return
    const newAnswers = { ...answers, [currentQ.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (typeof step === 'number' && step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setStep('result')
    }
  }

  function handleBack() {
    if (typeof step === 'number' && step > 0) {
      setStep(step - 1)
      setSelected(answers[QUESTIONS[step - 1].id] || null)
    } else if (step === 'result') {
      setStep(QUESTIONS.length - 1)
      setSelected(answers[QUESTIONS[QUESTIONS.length - 1].id] || null)
    }
  }

  const risk = step === 'result' ? getRisk(answers) : null
  const riskConfig = risk ? RISK_CONFIG[risk.level] : null

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black flex flex-col" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>

        {/* Progress bar */}
        {step !== 'intro' && (
          <div className="fixed top-16 md:top-20 left-0 right-0 z-40 h-0.5 bg-white/10">
            <div
              className="h-full bg-teal transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center max-w-screen-xl mx-auto w-full"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(2rem,5vw,4rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>

          {/* ── INTRO ── */}
          {step === 'intro' && (
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-8"
                style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
              <h1 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem,5vw,4.5rem)' }}>
                Lease Risk Checker
              </h1>
              <p className="text-white/60 font-light leading-relaxed mb-10"
                style={{ fontSize: '1rem', lineHeight: 1.8, maxWidth: '36rem' }}>
                10 questions about your lease. Answer honestly and we&apos;ll give you an instant risk rating — plus the top issues to watch out for before you sign.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 items-start mb-14">
                <div className="flex items-center gap-2">
                  <span className="text-teal font-bold" style={{ fontSize: '0.8rem' }}>✓</span>
                  <span className="text-white/50 font-light" style={{ fontSize: '0.9rem' }}>Takes 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal font-bold" style={{ fontSize: '0.8rem' }}>✓</span>
                  <span className="text-white/50 font-light" style={{ fontSize: '0.9rem' }}>No sign-up required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal font-bold" style={{ fontSize: '0.8rem' }}>✓</span>
                  <span className="text-white/50 font-light" style={{ fontSize: '0.9rem' }}>Instant results</span>
                </div>
              </div>
              <button
                onClick={() => setStep(0)}
                className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                Start the checker →
              </button>
            </div>
          )}

          {/* ── QUESTION ── */}
          {typeof step === 'number' && currentQ && (
            <div className="max-w-2xl">
              {/* Step counter */}
              <p className="text-white/30 font-light mb-10" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                Question <span className="text-white/60 font-semibold">{step + 1}</span> of {QUESTIONS.length}
              </p>

              {/* Question */}
              <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-3"
                style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)', marginBottom: '1.25rem' }}>
                {currentQ.label}
              </h2>
              <p className="text-white/40 font-light mb-10" style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
                {currentQ.hint}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-4 mb-12">
                {currentQ.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`text-left font-medium transition-all duration-150 border ${
                      selected === option
                        ? 'border-teal bg-teal/10 text-white'
                        : 'border-white/12 bg-white/4 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/8'
                    }`}
                    style={{ padding: '1.35rem 1.75rem', fontSize: '1rem', lineHeight: 1.5, borderRadius: '0.75rem' }}
                  >
                    <span className={`inline-block w-4 h-4 rounded-full border mr-3 flex-shrink-0 align-middle transition-all ${
                      selected === option ? 'border-teal bg-teal' : 'border-white/30'
                    }`} style={{ display: 'inline-block', verticalAlign: 'middle', marginTop: '-2px' }} />
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className={`font-bold transition-all ${
                    selected
                      ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                  style={{ padding: '1.25rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '0.5rem' }}>
                  {step === QUESTIONS.length - 1 ? 'See my results →' : 'Next →'}
                </button>
                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="text-white/30 font-light hover:text-white/60 transition-colors"
                    style={{ fontSize: '0.85rem' }}>
                    ← Back
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === 'result' && risk && riskConfig && (
            <div className="max-w-2xl">
              <p className="text-white/40 font-light mb-6" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                Your lease risk assessment
              </p>

              {/* Risk badge */}
              <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2`}
                style={{ background: riskConfig.colour + '20', border: `1px solid ${riskConfig.colour}40` }}>
                <span className="font-black" style={{ fontSize: '0.85rem', color: riskConfig.colour }}>
                  {riskConfig.label}
                </span>
              </div>

              <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)' }}>
                {risk.level === 'high' ? 'This lease needs attention.' : risk.level === 'medium' ? 'Some things to watch.' : 'Looking reasonable.'}
              </h2>

              <p className="text-white/65 font-light leading-relaxed mb-8"
                style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                {riskConfig.message}
              </p>

              {/* Risk summary */}
              <div className="flex gap-6 mb-10 p-5 border border-white/10 bg-white/4">
                <div className="text-center">
                  <p className="font-black text-red-400 leading-none mb-1" style={{ fontSize: '2rem' }}>{risk.high}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.72rem' }}>HIGH RISK<br />CLAUSES</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="font-black text-amber-400 leading-none mb-1" style={{ fontSize: '2rem' }}>{risk.medium}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.72rem' }}>MODERATE<br />CONCERNS</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="font-black text-white/60 leading-none mb-1" style={{ fontSize: '2rem' }}>{QUESTIONS.length - risk.high - risk.medium}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.72rem' }}>LOWER<br />RISK</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mb-8">
                <Link href="/lease-review"
                  className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors"
                  style={{ padding: '1.1rem 2rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Get Full LeaseIntel™ Report — $97 →
                </Link>
                <Link href="/lease-review"
                  className="text-white font-medium no-underline text-center hover:bg-white/10 transition-colors"
                  style={{ padding: '1.1rem 2rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Get Free Summary First
                </Link>
              </div>

              <button
                onClick={() => { setStep('intro'); setAnswers({}); setSelected(null) }}
                className="text-white/25 font-light hover:text-white/50 transition-colors"
                style={{ fontSize: '0.82rem' }}>
                ← Start again
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
