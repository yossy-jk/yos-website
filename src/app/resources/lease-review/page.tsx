'use client'
import { LEASE_QUESTIONS as QUESTIONS, LEASE_REVIEW_MESSAGES, assessLeaseAnswers as getRisk } from '@/lib/lease-review'
import LeaseAttachmentField from '@/components/LeaseAttachmentField'
import LeasingResources from '@/components/LeasingResources'
import { leaseFileError } from '@/lib/lease-file-rules'
import { postEnquiry } from '@/lib/enquiry'
import ToolGuide from '@/components/ToolGuide'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { CheckIcon } from '@/components/Icons'


type Step = 'intro' | number | 'capture' | 'result'

const RISK_CONFIG = {
  high: { label: 'HIGHER REVIEW PRIORITY', colour: '#FF8A8A', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', message: LEASE_REVIEW_MESSAGES.high },
  medium: { label: 'REVIEW PRIORITY', colour: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', message: LEASE_REVIEW_MESSAGES.medium },
  low: { label: 'FEWER REVIEW FLAGS', colour: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', message: LEASE_REVIEW_MESSAGES.low },
}


const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Commercial Lease Risk Checker | Your Office Space",
  "description": "A free questionnaire to organise lease topics for discussion with a commercial solicitor and your advisers. It does not analyse the lease.",
  "url": "https://www.yourofficespace.au/resources/lease-review",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AUD", "description": "Free to use" },
  "provider": ORGANIZATION_SCHEMA,
  "areaServed": { "@type": "Country", "name": "Australia" },
}

export default function LeaseRiskCheckerPage() {
  const [step, setStep] = useState<Step>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  // Capture form state
  const [firstName, setFirstName] = useState('')
  const [captureEmail, setCaptureEmail] = useState('')
  const [captureError, setCaptureError] = useState<string | null>(null)
  const [capturePreview, setCapturePreview] = useState(false)
  const [captureLoading, setCaptureLoading] = useState(false)
  const [lease, setLease] = useState<File | null>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStepRef = useRef<Step>(step)

  useEffect(() => {
    if (previousStepRef.current !== step) {
      stepHeadingRef.current?.focus()
      previousStepRef.current = step
    }
  }, [step])

  const currentQ = typeof step === 'number' ? QUESTIONS[step] : null
  const progress = typeof step === 'number'
    ? ((step) / QUESTIONS.length) * 100
    : step === 'capture' || step === 'result' ? 100 : 0

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
      setStep('capture')
    }
  }

  function handleBack() {
    if (typeof step === 'number' && step > 0) {
      setStep(step - 1)
      setSelected(answers[QUESTIONS[step - 1].id] || null)
    } else if (step === 'capture') {
      setStep(QUESTIONS.length - 1)
      setSelected(answers[QUESTIONS[QUESTIONS.length - 1].id] || null)
    } else if (step === 'result') {
      setStep(QUESTIONS.length - 1)
      setSelected(answers[QUESTIONS[QUESTIONS.length - 1].id] || null)
    }
  }

  async function handleCapture(e: React.FormEvent) {
    e.preventDefault()
    setCaptureError(null)

    if (!firstName.trim()) {
      setCaptureError('Please enter your first name.')
      return
    }
    if (!captureEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(captureEmail)) {
      setCaptureError('Please enter a valid email address.')
      return
    }

    if (lease && leaseFileError(lease)) { setCaptureError(leaseFileError(lease)); return }
    setCaptureLoading(true)
    try {
      const res = await postEnquiry('/api/lease-risk-capture', { firstname: firstName.trim(), email: captureEmail.trim(), answers }, lease || undefined)

      const delivered = await res.json().catch(() => ({}))
      if (!res.ok || delivered.ok !== true) throw new Error(delivered.error || 'We could not confirm delivery. Please retry or call (02) 4092 0733.')
      setCapturePreview(Boolean(delivered.preview))

      setStep('result')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setCaptureError(msg)
    } finally {
      setCaptureLoading(false)
    }
  }

  const risk = (step === 'result' || step === 'capture') ? getRisk(answers) : null
  const riskConfig = risk ? RISK_CONFIG[risk.level] : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <Nav />

      <main id="main-content" tabIndex={-1}>

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>

        {/* Progress bar */}
        {step !== 'intro' && (
          <div className="fixed top-16 md:top-20 left-0 right-0 z-40 h-0.5 bg-white/10">
            <div
              className="h-full bg-teal transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="max-w-screen-xl mx-auto w-full"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(5rem,10vw,8rem)', paddingBottom: 'clamp(6rem,12vw,10rem)' }}>

          {/* ── INTRO ── */}
          {step === 'intro' && (
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-8"
                style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-sm" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free – No document required</span>
              </div>
              <h1 ref={stepHeadingRef} tabIndex={-1} className="text-white font-black uppercase leading-tight tracking-tight mb-6 outline-none"
                style={{ fontSize: 'clamp(2rem,5vw,4.5rem)' }}>
                Free Lease Questions Check
              </h1>
              <p className="text-white/80 font-semibold mb-4" style={{ fontSize: '1.05rem' }}>
                No document required. Answer at your own pace.
              </p>
              <p className="text-white/60 font-light leading-relaxed mb-14"
                style={{ fontSize: '1rem', lineHeight: 1.8, maxWidth: '36rem' }}>
                Answer 10 questions to organise topics for further review. The summary uses your answers only; it does not read or interpret your lease. Uploading a document does not change the automated result.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 items-start mb-14">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-white/50 font-light" style={{ fontSize: '0.9rem' }}>Free, always</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-white/50 font-light" style={{ fontSize: '0.9rem' }}>Lease upload optional</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-white/50 font-light" style={{ fontSize: '0.9rem' }}>Instant result</span>
                </div>
              </div>
              <button
                onClick={() => setStep(0)}
                className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[48px] w-full sm:w-auto"
                style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', borderRadius: '4px' }}>
                Start the checker
              </button>
            </div>
          )}

          {/* ── QUESTION ── */}
          {typeof step === 'number' && currentQ && (
            <div className="max-w-2xl">
              {/* Step counter */}
              <p className="text-white/30 font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '2.5rem' }}>
                Question <span className="text-teal font-semibold">{step + 1}</span> <span className="text-white/20">/</span> {QUESTIONS.length}
              </p>

              {/* Question */}
              <h2 ref={stepHeadingRef} tabIndex={-1} className="text-white font-black uppercase leading-tight tracking-tight outline-none"
                style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', marginBottom: '1.25rem' }}>
                {currentQ.label}
              </h2>

              {/* Hint */}
              <p className="text-white/40 font-light" style={{ fontSize: '0.9rem', lineHeight: 1.9, marginBottom: '3rem' }}>
                {currentQ.hint}
              </p>

              {/* Options */}
              <div className="flex flex-col" style={{ gap: '0.875rem', marginBottom: '3.5rem' }}>
                {currentQ.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    aria-pressed={selected === option}
                    className={`text-left font-medium transition-all duration-150 border ${
                      selected === option
                        ? 'border-teal bg-teal/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    style={{ padding: '1.1rem 1.5rem', fontSize: '0.95rem', lineHeight: 1.6, borderRadius: '0.75rem', display: 'flex', alignItems: 'center' }}
                  >
                    <span className={`inline-block w-5 h-5 rounded-sm border-2 flex-shrink-0 transition-all ${
                      selected === option ? 'border-teal bg-teal' : 'border-white/30'
                    }`} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '1rem', marginTop: '-1px' }} />
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center" style={{ gap: '1.5rem' }}>
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className={`font-bold transition-all min-h-[48px] ${
                    selected
                      ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer'
                      : 'bg-white/8 text-white/25 cursor-not-allowed'
                  }`}
                  style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '4px', minWidth: '12rem' }}>
                  {step === QUESTIONS.length - 1 ? 'See my results' : 'Next'}
                </button>
                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="text-white/30 font-light hover:text-white/60 transition-colors"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    ← Back
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── CAPTURE ── */}
          {step === 'capture' && (
            <div className="max-w-lg">
              <p className="text-white/30 font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '2.5rem' }}>
                Almost there
              </p>

              <h2 ref={stepHeadingRef} tabIndex={-1} className="text-white font-black uppercase leading-tight tracking-tight outline-none"
                style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', marginBottom: '1.25rem' }}>
                Your details and optional lease
              </h2>

              <p className="text-white/50 font-light" style={{ fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '3rem' }}>
                Finish with your details to receive your result and a plain-English summary. If you have your current lease handy, you can attach it; it is not required.
              </p>

              <form onSubmit={handleCapture} noValidate>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="lease-risk-name" className="block text-white/40 font-light uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>
                    First name
                  </label>
                  <input
                    id="lease-risk-name"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Joe"
                    required
                    className="w-full bg-white/[0.04] border border-white/15 text-white placeholder-white/20 font-light focus:outline-none focus:border-teal transition-colors"
                    style={{ padding: '1rem 1.25rem', fontSize: '0.95rem', borderRadius: '0.75rem' }}
                  />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <label htmlFor="lease-risk-email" className="block text-white/40 font-light uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>
                    Email address
                  </label>
                  <input
                    id="lease-risk-email"
                    type="email"
                    value={captureEmail}
                    onChange={e => setCaptureEmail(e.target.value)}
                    placeholder="joe@business.com.au"
                    required
                    className="w-full bg-white/[0.04] border border-white/15 text-white placeholder-white/20 font-light focus:outline-none focus:border-teal transition-colors"
                    style={{ padding: '1rem 1.25rem', fontSize: '0.95rem', borderRadius: '0.75rem' }}
                  />
                </div>

                <LeaseAttachmentField dark file={lease} onChange={file => { setLease(file); setCaptureError(null) }} />
                {captureError && (
                  <p role="alert" className="text-red-400 font-light" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    {captureError}
                  </p>
                )}

                <div className="flex items-center" style={{ gap: '1.5rem' }}>
                  <button
                    type="submit"
                    disabled={captureLoading}
                    className={`font-bold transition-all min-h-[48px] ${
                      captureLoading
                        ? 'bg-teal/50 text-white/50 cursor-not-allowed'
                        : 'bg-teal text-white hover:bg-dark-teal cursor-pointer'
                    }`}
                    style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '4px', minWidth: '14rem' }}>
                    {captureLoading ? 'One moment...' : 'Get my result'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-white/30 font-light hover:text-white/60 transition-colors"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    ← Back
                  </button>
                </div>

                <p className="text-white/20 font-light" style={{ fontSize: '0.75rem', marginTop: '1.5rem', lineHeight: 1.6 }}>
                  YOS uses your details and any optional lease to respond to this request. This does not subscribe you to marketing.
                </p>
              </form>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === 'result' && risk && riskConfig && (
            <div className="max-w-2xl">
              <p className="text-white/40 font-light mb-6" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                Your questionnaire summary
              </p>

              {capturePreview ? <p role="status" className="text-white mb-5">Preview only. No details or lease were sent.</p> : lease ? <p role="status" className="text-white mb-5">Your lease was included with your request to the YOS team.</p> : null}
              {/* Risk badge */}
              <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2`}
                style={{ background: riskConfig.colour + '20', border: `1px solid ${riskConfig.colour}40` }}>
                <span className="font-black" style={{ fontSize: '0.85rem', color: riskConfig.colour }}>
                  {riskConfig.label}
                </span>
              </div>

              <h2 ref={stepHeadingRef} tabIndex={-1} className="text-white font-black uppercase leading-tight tracking-tight mb-6 outline-none"
                style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)' }}>
                {risk.level === 'high' ? 'Several answers need review.' : risk.level === 'medium' ? 'Some answers need review.' : 'Fewer flags in these answers.'}
              </h2>

              <p className="text-white/65 font-light leading-relaxed mb-12"
                style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                {riskConfig.message}
              </p>

              {/* Risk summary */}
              <div className="flex gap-6 mb-10 p-5 border border-white/10 bg-white/4">
                <div className="text-center">
                  <p className="font-black text-red-400 leading-none mb-1" style={{ fontSize: '2rem' }}>{risk.high}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.72rem' }}>HIGHER REVIEW<br />FLAGS</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="font-black text-amber-400 leading-none mb-1" style={{ fontSize: '2rem' }}>{risk.medium}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.72rem' }}>MODERATE<br />CONCERNS</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="font-black text-white/60 leading-none mb-1" style={{ fontSize: '2rem' }}>{QUESTIONS.length - risk.high - risk.medium}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.72rem' }}>OTHER<br />ANSWERS</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-10" style={{ borderLeft: '2px solid rgba(20,184,166,0.4)', paddingLeft: '1.5rem' }}>
                <p className="text-white/40 font-light uppercase mb-5" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>Three things to act on</p>
                <ul className="flex flex-col" style={{ gap: '1.25rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  <li className="text-white/75 font-light" style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>
                    Ask a commercial property solicitor to review the actual lease and explain your rights, obligations and options before you commit.
                  </li>
                  <li className="text-white/75 font-light" style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>
                    Clarify outgoings, make-good, guarantees and any other obligations that affect your brief. Obtain project-specific cost advice where needed.
                  </li>
                  <li className="text-white/75 font-light" style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>
                    Record expiry, option-notice and other key dates. Discuss the available time and choices with your appointed advisers.
                  </li>
                </ul>
              </div>

              {/* Legal disclaimer */}
              <p className="text-white/30 font-light mb-8" style={{ fontSize: '0.78rem', lineHeight: 1.8, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                This is an answer-based planning prompt, not a lease analysis, valuation or legal opinion. Retail and non-retail leasing requirements can differ. Ask your commercial solicitor which rules apply before signing, varying or exiting a lease.
              </p>

              <p className="text-white/70 mb-8"><a href="https://www.lawsociety.com.au/for-the-public/know-your-rights/going-into-business/what-to-know-beforehand" className="text-teal underline underline-offset-4">Law Society of NSW: getting advice before entering a business lease</a></p>

              {/* CTA – current Lease Health Check */}
              <div className="mb-8 rounded-sm p-6" style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.25)' }}>
                <p className="text-teal font-bold mb-1" style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Start a free Lease Health Check</p>
                <p className="font-semibold mb-3" style={{ fontSize: '0.85rem', color: 'rgba(20,184,166,0.9)' }}>A free first conversation. No document required.</p>
                <p className="text-white/70 font-light mb-5" style={{ fontSize: '0.92rem', lineHeight: 1.7 }}>
                  Tell us about your lease dates, costs and plans. You can optionally attach your current lease. We will confirm what needs checking and agree the next step; any further advisory work is scoped separately.
                </p>
                <Link href="/lease-health-check"
                  className="inline-flex items-center justify-center bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
                  style={{ padding: '0.9rem 2rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '4px' }}>
                  Start your Health Check →
                </Link>
              </div>

              <LeasingResources dark />

              <button
                onClick={() => { setStep('intro'); setAnswers({}); setSelected(null) }}
                className="text-white/75 font-light hover:text-white transition-colors"
                style={{ fontSize: '0.82rem' }}>
                ← Start again
              </button>
            </div>
          )}
        </div>
      </div>


      <ToolGuide purpose="Use the questions to identify lease topics that warrant closer review before you commit or renew." inputs="Your lease and information about rent reviews, make-good, options and other commercial obligations." result="A risk summary based on your answers. It does not analyse the full lease or replace a solicitor." next="Start a free Lease Health Check" href="/lease-health-check" />
</main>

      <Footer />
    </>
  )
}
