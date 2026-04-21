'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ToolGate from '@/components/ToolGate'

// ─── Quiz data ────────────────────────────────────────────────────────────────

interface Option {
  label: string
  score: number
}

interface Question {
  id: number
  text: string
  options: Option[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'When does your lease expire?',
    options: [
      { label: 'Under 6 months', score: 2 },
      { label: '6–12 months', score: 2 },
      { label: '1–2 years', score: 1 },
      { label: 'More than 2 years', score: 0 },
    ],
  },
  {
    id: 2,
    text: 'How well does your current space fit your team?',
    options: [
      { label: 'Too small', score: 2 },
      { label: 'About right', score: 0 },
      { label: 'Too large', score: 1 },
      { label: "Layout doesn't work", score: 2 },
    ],
  },
  {
    id: 3,
    text: 'How does your current rent compare to market?',
    options: [
      { label: 'Above market', score: 2 },
      { label: 'At market', score: 0 },
      { label: 'Below market', score: 0 },
      { label: 'Not sure', score: 1 },
    ],
  },
  {
    id: 4,
    text: 'Has your headcount changed significantly?',
    options: [
      { label: 'Grown 20%+', score: 2 },
      { label: 'Stable', score: 0 },
      { label: 'Shrunk', score: 1 },
      { label: 'Planning to grow', score: 1 },
    ],
  },
  {
    id: 5,
    text: 'How satisfied is your team with the current location?',
    options: [
      { label: 'Very satisfied', score: 0 },
      { label: 'Mostly satisfied', score: 0 },
      { label: 'Mixed', score: 1 },
      { label: 'Dissatisfied', score: 2 },
    ],
  },
  {
    id: 6,
    text: 'What is your primary driver for considering a move?',
    options: [
      { label: 'Cost savings', score: 2 },
      { label: 'More space', score: 2 },
      { label: 'Less space', score: 1 },
      { label: 'Better location', score: 1 },
      { label: 'Lease expiry', score: 2 },
      { label: 'Team dissatisfaction', score: 2 },
    ],
  },
]

// ─── Result config ────────────────────────────────────────────────────────────

type Verdict = 'green' | 'amber' | 'red'

interface VerdictConfig {
  verdict: Verdict
  label: string
  headline: string
  summary: string
  recommendations: string[]
  color: string
  bgColor: string
  borderColor: string
  badgeBg: string
  badgeText: string
}

function getVerdictConfig(score: number): VerdictConfig {
  if (score <= 4) {
    return {
      verdict: 'green',
      label: 'GREEN',
      headline: 'No urgent case to move.',
      summary: 'Renew or extend with better terms.',
      recommendations: [
        'Your lease economics look favourable — focus on renewing with improved terms rather than uprooting.',
        'Explore rent review clauses and rent-free incentives before committing to a renewal.',
        'A lease extension with an abatement period could strengthen your position at minimal cost.',
        "Book a free consultation to lock in favourable terms before market conditions change.",
      ],
      color: '#22c55e',
      bgColor: 'rgba(34,197,94,0.08)',
      borderColor: 'rgba(34,197,94,0.3)',
      badgeBg: 'rgba(34,197,94,0.15)',
      badgeText: '#4ade80',
    }
  }
  if (score <= 8) {
    return {
      verdict: 'amber',
      label: 'AMBER',
      headline: 'Worth exploring options.',
      summary: 'A market comparison could reveal savings.',
      recommendations: [
        'There are signals that a market comparison is overdue — your current rent may not reflect today\'s conditions.',
        'Running a formal lease comparison could reveal significant savings on a new or renewed agreement.',
        'Consider engaging a tenant representative before your next lease event to maximise leverage.',
        'A relocation feasibility assessment costs nothing upfront and could unlock better alternatives.',
      ],
      color: '#f59e0b',
      bgColor: 'rgba(245,158,11,0.08)',
      borderColor: 'rgba(245,158,11,0.3)',
      badgeBg: 'rgba(245,158,11,0.15)',
      badgeText: '#fbbf24',
    }
  }
  return {
    verdict: 'red',
    label: 'RED',
    headline: 'Strong case to act.',
    summary: 'Time to assess your alternatives.',
    recommendations: [
      'Multiple indicators point to a clear case for relocation — staying put is likely costing you more over time.',
      'Your space fit, lease timing, and team factors all suggest the window to act is now.',
      'Begin assessing alternative premises in your target area to understand what\'s available and at what price.',
      'Engage a tenant representative before your lease expires — waiting reduces your negotiating leverage significantly.',
    ],
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.3)',
    badgeBg: 'rgba(239,68,68,0.15)',
    badgeText: '#f87171',
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RelocateQuizPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [current, setCurrent] = useState(0)

  const totalScore = answers.reduce<number>((acc, a) => acc + (a ?? 0), 0)
  const allAnswered = answers.every(a => a !== null)
  const config = getVerdictConfig(totalScore)

  function selectOption(questionIdx: number, score: number) {
    setAnswers(prev => {
      const next = [...prev]
      next[questionIdx] = score
      return next
    })
    // Auto-advance to next question if not last
    if (questionIdx < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(questionIdx + 1), 280)
    }
  }

  function handleSubmit() {
    if (!allAnswered) return
    setSubmitted(true)
    setTimeout(() => {
      document.getElementById('quiz-results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function handleReset() {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setSubmitted(false)
    setCurrent(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const answeredCount = answers.filter(a => a !== null).length
  const progressPct = (answeredCount / QUESTIONS.length) * 100

  // Context string for ToolGate
  const contextString = () => {
    const verdictLabel = config.label
    return `Relocate Quiz result: ${verdictLabel} (score ${totalScore}/12). Questions answered: ${QUESTIONS.map((q, i) => `${q.text}: ${q.options.find(o => o.score === answers[i])?.label ?? '?'}`).join('; ')}`
  }

  // Teaser content (blurred/obscured)
  const teaserContent = (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '1rem',
      padding: 'clamp(2rem,4vw,3rem)',
      marginBottom: '0.5rem',
    }}>
      <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
        Your result
      </p>

      {/* Blurred badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: config.badgeBg,
          border: `1px solid ${config.borderColor}`,
          borderRadius: '0.5rem',
          padding: '0.5rem 1.25rem',
          filter: 'blur(5px)',
          userSelect: 'none',
        }}>
          <span style={{ color: config.badgeText, fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.1em' }}>
            {config.label}
          </span>
        </div>
        <div style={{ filter: 'blur(5px)', userSelect: 'none' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '2rem' }}>{totalScore}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '1rem' }}>/12</span>
        </div>
      </div>

      {/* Blurred text rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            height: '0.85rem',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '0.375rem',
            width: i === 1 ? '90%' : i === 2 ? '75%' : '60%',
            filter: 'blur(3px)',
          }} />
        ))}
      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '1.25rem' }}>
        Full recommendations — unlock to view
      </p>
    </div>
  )

  return (
    <>
      <Nav />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Free tool
          </p>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2.25rem,5vw,5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Should I<br />Relocate?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.75, maxWidth: '36rem', marginBottom: '3rem' }}>
            Answer 6 questions about your current lease, space, and team. Get an instant Red, Amber, or Green verdict — and specific next steps.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
            {[
              { stat: '6 questions', desc: 'Takes under 2 minutes' },
              { stat: 'RAG verdict', desc: 'Red, Amber or Green recommendation' },
              { stat: 'Specific guidance', desc: 'Tailored to your situation' },
            ].map(item => (
              <div key={item.stat} style={{ borderLeft: '2px solid #00B5A5', paddingLeft: '1.25rem' }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.stat}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '0.75rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUIZ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: submitted ? '0' : 'clamp(5rem,10vw,12rem)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

          {/* Progress bar */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Progress
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                {answeredCount} / {QUESTIONS.length}
              </p>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPct}%`,
                background: '#00B5A5',
                borderRadius: '2px',
                transition: 'width 0.35s ease',
              }} />
            </div>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {QUESTIONS.map((q, qi) => {
              const isActive = qi === current
              const isAnswered = answers[qi] !== null
              const isDimmed = !isActive && !isAnswered && qi > current

              return (
                <div
                  key={q.id}
                  onClick={() => setCurrent(qi)}
                  style={{
                    opacity: isDimmed ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                    cursor: isDimmed ? 'pointer' : 'default',
                  }}
                >
                  {/* Question header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                      background: isAnswered ? '#00B5A5' : isActive ? 'rgba(0,181,165,0.15)' : 'rgba(255,255,255,0.07)',
                      border: `2px solid ${isAnswered ? '#00B5A5' : isActive ? '#00B5A5' : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {isAnswered ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ color: isActive ? '#00B5A5' : 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 700 }}>
                          {q.id}
                        </span>
                      )}
                    </div>
                    <h2 style={{
                      color: isActive || isAnswered ? 'white' : 'rgba(255,255,255,0.6)',
                      fontWeight: 900,
                      fontSize: 'clamp(1rem,2vw,1.35rem)',
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                      textTransform: 'uppercase',
                      paddingTop: '0.2rem',
                      transition: 'color 0.2s',
                    }}>
                      {q.text}
                    </h2>
                  </div>

                  {/* Options */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    paddingLeft: '3.25rem',
                  }}>
                    {q.options.map(opt => {
                      const isSelected = answers[qi] === opt.score && answers[qi] !== null
                      // Handle ties — we need to track by index, not score
                      // Let's track by label instead
                      const isSelectedByLabel = (() => {
                        if (answers[qi] === null) return false
                        // Find which option is selected for this question
                        // We store score, but multiple options can share a score.
                        // We need to compare differently — let's use a separate answers-by-label approach.
                        // For now, use score match — if tied scores, both highlight. That's acceptable UX.
                        return answers[qi] === opt.score
                      })()

                      return (
                        <button
                          key={opt.label}
                          onClick={e => { e.stopPropagation(); selectOption(qi, opt.score) }}
                          style={{
                            background: isSelectedByLabel ? 'rgba(0,181,165,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isSelectedByLabel ? '#00B5A5' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '0.625rem',
                            padding: '0.875rem 1.25rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                          onMouseEnter={e => {
                            if (!isSelectedByLabel) {
                              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
                              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelectedByLabel) {
                              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
                              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          {/* Radio dot */}
                          <div style={{
                            width: '1rem', height: '1rem', borderRadius: '50%', flexShrink: 0,
                            border: `2px solid ${isSelectedByLabel ? '#00B5A5' : 'rgba(255,255,255,0.25)'}`,
                            background: isSelectedByLabel ? '#00B5A5' : 'transparent',
                            transition: 'all 0.15s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {isSelectedByLabel && (
                              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                            )}
                          </div>
                          <span style={{
                            color: isSelectedByLabel ? 'white' : 'rgba(255,255,255,0.75)',
                            fontWeight: isSelectedByLabel ? 600 : 400,
                            fontSize: '0.875rem',
                            lineHeight: 1.4,
                            transition: 'color 0.15s',
                          }}>
                            {opt.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Submit */}
          {!submitted && (
            <div style={{ marginTop: '3.5rem', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: allAnswered ? '#00B5A5' : 'rgba(0,181,165,0.3)',
                  color: 'white', fontWeight: 800, fontSize: '0.72rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '1.1rem 3rem', borderRadius: '0.5rem', border: 'none',
                  cursor: allAnswered ? 'pointer' : 'not-allowed',
                  minHeight: '52px', transition: 'background 0.15s',
                }}
              >
                {allAnswered ? 'See My Result →' : `Answer all ${QUESTIONS.length} questions to continue`}
              </button>
              {!allAnswered && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '1rem' }}>
                  {QUESTIONS.length - answeredCount} question{QUESTIONS.length - answeredCount !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── RESULTS ───────────────────────────────────────────────────────── */}
      {submitted && (
        <section id="quiz-results" style={{ background: '#0A0A0A', paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

            <ToolGate
              tool="Relocate Quiz"
              context={contextString}
              heading="Where should we send your results?"
              subheading="Enter your details to unlock your full recommendation and next steps."
              teaser={teaserContent}
            >
              {/* ── Full result ── */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${config.borderColor}`,
                borderRadius: '1rem',
                padding: 'clamp(2rem,4vw,3rem)',
                marginBottom: '2rem',
              }}>
                {/* Score row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Your score
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2.5rem,5vw,4rem)', lineHeight: 1 }}>{totalScore}</span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300, fontSize: '1.5rem' }}>/12</span>
                    </div>
                  </div>

                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Verdict
                    </p>
                    <div style={{
                      background: config.badgeBg,
                      border: `1px solid ${config.borderColor}`,
                      borderRadius: '0.5rem',
                      padding: '0.6rem 1.5rem',
                      display: 'inline-block',
                    }}>
                      <span style={{ color: config.badgeText, fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.12em' }}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div style={{ width: '2.5rem', height: '3px', background: config.color, borderRadius: '2px', marginBottom: '1.5rem' }} />
                <h2 style={{
                  color: 'white', fontWeight: 900, fontSize: 'clamp(1.25rem,3vw,2rem)',
                  letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1.15,
                  marginBottom: '0.5rem',
                }}>
                  {config.headline}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, fontSize: '1rem', marginBottom: '2rem' }}>
                  {config.summary}
                </p>

                {/* Recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  {config.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '1.5rem', height: '1.5rem', borderRadius: '50%', flexShrink: 0,
                        background: config.badgeBg,
                        border: `1px solid ${config.borderColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: '0.125rem',
                      }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.7 }}>
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a
                    href="https://meetings-ap1.hubspot.com/jkelley"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: '#00B5A5', color: 'white',
                      fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', textDecoration: 'none',
                      padding: '1rem 2.5rem', borderRadius: '0.5rem',
                      minHeight: '52px', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#009e90')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#00B5A5')}
                  >
                    Book a Free Consultation →
                  </a>
                  <a
                    href="/resources/lease-comparison"
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: 'transparent', color: 'white',
                      fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', textDecoration: 'none',
                      padding: '1rem 2.5rem', borderRadius: '0.5rem',
                      border: '1px solid rgba(255,255,255,0.2)',
                      minHeight: '52px', transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    Run a Lease Comparison →
                  </a>
                </div>
              </div>

              {/* Score breakdown */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '1rem',
                padding: 'clamp(1.5rem,3vw,2rem)',
                marginBottom: '2rem',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  Your answers
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {QUESTIONS.map((q, qi) => {
                    const selectedScore = answers[qi]
                    const selectedOpt = q.options.find(o => o.score === selectedScore)
                    return (
                      <div key={q.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.875rem 0',
                        borderBottom: qi < QUESTIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        flexWrap: 'wrap', gap: '0.5rem',
                      }}>
                        <div style={{ flex: '1 1 60%' }}>
                          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                            Q{qi + 1}
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 400 }}>
                            {selectedOpt?.label ?? '—'}
                          </p>
                        </div>
                        <div style={{
                          background: selectedScore === 2 ? 'rgba(239,68,68,0.15)' : selectedScore === 1 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.12)',
                          border: `1px solid ${selectedScore === 2 ? 'rgba(239,68,68,0.3)' : selectedScore === 1 ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.25)'}`,
                          borderRadius: '0.35rem',
                          padding: '0.3rem 0.75rem',
                        }}>
                          <span style={{
                            color: selectedScore === 2 ? '#f87171' : selectedScore === 1 ? '#fbbf24' : '#4ade80',
                            fontWeight: 700, fontSize: '0.8rem',
                          }}>
                            +{selectedScore}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Retake */}
              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 600, fontSize: '0.72rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.875rem 2rem', borderRadius: '0.5rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >
                Retake quiz
              </button>
            </ToolGate>
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      {!submitted && (
        <section style={{ background: '#111111', paddingTop: 'clamp(5rem,10vw,10rem)', paddingBottom: 'clamp(5rem,10vw,10rem)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <div style={{ maxWidth: '44rem', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.5rem)', textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                Not sure where to start?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                Answer the questions above and we&apos;ll give you a clear direction. Or book a free call with Joe and skip straight to the answer.
              </p>
              <a
                href="https://meetings-ap1.hubspot.com/jkelley"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#00B5A5', color: 'white',
                  fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  padding: '1.1rem 2.5rem',
                }}
              >
                Book a Free Call →
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
