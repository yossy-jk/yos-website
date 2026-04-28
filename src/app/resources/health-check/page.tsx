'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ToolGate from '@/components/ToolGate'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
  label: string
  score: number
}

interface Question {
  id: number
  text: string
  options: Option[]
  domainIndex: number
}

type RagVerdict = 'GREEN' | 'AMBER' | 'RED'

interface DomainConfig {
  name: string
  icon: string
  serviceLabel: string
  ctaLinks: { label: string; href: string }[]
  verdicts: {
    GREEN: { summary: string; recs: string[] }
    AMBER: { summary: string; recs: string[] }
    RED: { summary: string; recs: string[] }
  }
}

// ─── Domain config ────────────────────────────────────────────────────────────

const DOMAINS: DomainConfig[] = [
  {
    name: 'Lease Health',
    icon: '01',
    serviceLabel: 'Tenant Rep / Lease Review',
    ctaLinks: [
      { label: 'Lease Review', href: '/lease-review' },
      { label: 'Tenant Representation', href: '/tenant-rep' },
    ],
    verdicts: {
      GREEN: {
        summary: 'Your lease position is stable — no immediate pressure to act.',
        recs: [
          'You\'re in a solid lease position right now. Use this window to understand your renewal options before market conditions shift.',
          'Review your rent review clauses and negotiate rent-free periods or incentives at your next opportunity.',
          'An independent lease review once a year keeps you informed — and gives you leverage you wouldn\'t otherwise have.',
        ],
      },
      AMBER: {
        summary: 'There are signals your lease deserves a closer look.',
        recs: [
          'A market rent comparison is overdue. Your current rate may not reflect what\'s achievable today — either above or below.',
          'If you haven\'t had an independent advisor review your lease in the past 2 years, now is the time to do it.',
          'Identify all rent review clauses in your lease and understand how they\'re calculated — CPI, fixed, or market.',
          'Engaging a tenant rep now, ahead of any lease event, puts you in the strongest negotiating position.',
        ],
      },
      RED: {
        summary: 'Your lease situation carries real risk — act before it forces your hand.',
        recs: [
          'Multiple lease indicators are pointing red. Waiting for a lease event to act will cost you negotiating leverage.',
          'Get an independent review of your current rent against the market immediately. The gap may be significant.',
          'If your lease expires in under 12 months, begin exploring your options now — renewal, relocation, or renegotiation.',
          'A tenant representative costs you nothing and can recover multiples of their effort in rent savings and incentives.',
        ],
      },
    },
  },
  {
    name: 'Space & Fitout',
    icon: '02',
    serviceLabel: 'Fitout / Tenant Rep',
    ctaLinks: [
      { label: 'Tenant Representation', href: '/tenant-rep' },
    ],
    verdicts: {
      GREEN: {
        summary: 'Your space is working well for your team right now.',
        recs: [
          'Your workspace is in good shape. Keep an eye on headcount changes that may shift your space requirements in the next 12–24 months.',
          'Consider a minor refresh to keep the space feeling current — amenity areas and meeting rooms age quickly.',
          'Document what\'s working well now so you can replicate it if you relocate or expand.',
        ],
      },
      AMBER: {
        summary: 'Your space may be holding your team back in subtle ways.',
        recs: [
          'A workspace that doesn\'t match how people actually work is one of the top reasons for poor office attendance.',
          'Conduct a space utilisation review — you may be under-using or mis-using significant square meterage.',
          'Even modest changes to layout, collaboration zones, or quiet areas can meaningfully lift team satisfaction.',
          'If your fitout is more than 5 years old, a formal assessment will likely uncover easy wins.',
        ],
      },
      RED: {
        summary: 'Your space is actively working against your business.',
        recs: [
          'A poor or outdated fitout is a direct drag on team performance, retention, and your ability to win new business.',
          'Begin with a professional space assessment — understand what you have, what\'s missing, and what it would cost to fix it.',
          'If the space fundamentally doesn\'t work, relocation may be more cost-effective than refitting — compare both options.',
          'Engage a tenant representative to evaluate your options before your lease forces the decision.',
        ],
      },
    },
  },
  {
    name: 'Furniture',
    icon: '03',
    serviceLabel: 'Furniture',
    ctaLinks: [
      { label: 'Furniture & Fitout', href: '/furniture' },
    ],
    verdicts: {
      GREEN: {
        summary: 'Your furniture is in good shape and supports how your team works.',
        recs: [
          'Your furniture is doing its job. Schedule a periodic review to catch ergonomic gaps — especially as your team evolves.',
          'Consider whether your furniture supports hybrid work patterns — dedicated desks vs. flexible zones vs. collaboration areas.',
          'When specifying new furniture, always compare commercial-grade vs. consumer-grade warranties and durability.',
        ],
      },
      AMBER: {
        summary: 'Your furniture is functional, but likely not doing enough.',
        recs: [
          'Furniture that doesn\'t match your work style is a silent drag on productivity — people work around it rather than with it.',
          'A proper furniture assessment will identify what to keep, what to refresh, and what to replace — without guessing.',
          'If you\'ve bought consumer-grade furniture in the past, factor in the hidden costs: shorter lifespan, warranty gaps, and ergonomic risk.',
          'New furniture doesn\'t require a full fitout — targeted investment in key zones often delivers outsized impact.',
        ],
      },
      RED: {
        summary: 'Your furniture needs attention — this is a visible, fixable problem.',
        recs: [
          'Old or misaligned furniture is one of the easiest wins available to you. The investment is lower than most expect.',
          'Book a furniture assessment — it\'s typically free, and gives you a specification and budget before you commit to anything.',
          'Prioritise sit-stand desks and ergonomic seating if you haven\'t updated these in the last 5 years.',
          'Commercial-grade furniture, bought right, lasts 10+ years and transforms how your space is perceived by staff and clients.',
        ],
      },
    },
  },
  {
    name: 'Cleaning',
    icon: '04',
    serviceLabel: 'Commercial Cleaning',
    ctaLinks: [
      { label: 'Commercial Cleaning', href: '/cleaning' },
    ],
    verdicts: {
      GREEN: {
        summary: 'Your cleaning is consistent and accountable — exactly what you want.',
        recs: [
          'You\'re in a good position. Make sure your next contract renewal includes a benchmark against current market rates.',
          'Maintain a direct accountability relationship with your cleaning provider — don\'t let it become a set-and-forget arrangement.',
          'Review your cleaning schedule seasonally — frequency needs can shift with office attendance patterns.',
        ],
      },
      AMBER: {
        summary: 'Your cleaning standard has room to improve.',
        recs: [
          'Inconsistent cleaning quality is often a contract or accountability problem, not just a service quality one.',
          'Ensure you have a direct contact at your cleaning company who is personally accountable for your site.',
          'A market comparison on your current contract may reveal you\'re paying above-market rates for a below-market service.',
          'Set a formal standard checklist and review it quarterly — most cleaning issues are caught early when you\'re looking.',
        ],
      },
      RED: {
        summary: 'Poor cleaning is a risk to your team, your brand, and potentially your compliance obligations.',
        recs: [
          'Cleaning that has triggered client or staff complaints is a serious business risk — not just an inconvenience.',
          'Switching commercial cleaning providers is typically straightforward and fast — don\'t stay with a provider out of inertia.',
          'Get a market comparison immediately — you may be paying a premium for a service that\'s consistently failing you.',
          'Establish a formal SLA with your next provider, including response times, checklist accountability, and escalation contacts.',
        ],
      },
    },
  },
]

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // Domain 0 — Lease Health
  {
    id: 1,
    domainIndex: 0,
    text: 'When does your current lease expire?',
    options: [
      { label: 'Under 6 months', score: 2 },
      { label: '6–12 months', score: 2 },
      { label: '1–2 years', score: 1 },
      { label: '2+ years', score: 0 },
    ],
  },
  {
    id: 2,
    domainIndex: 0,
    text: 'Do you know your current rent vs. market rate?',
    options: [
      { label: 'Yes, we\'re below market', score: 0 },
      { label: 'Yes, we\'re at market', score: 0 },
      { label: 'Yes, we\'re above market', score: 2 },
      { label: 'No idea', score: 2 },
    ],
  },
  {
    id: 3,
    domainIndex: 0,
    text: 'Have you had your lease reviewed by an independent advisor?',
    options: [
      { label: 'Yes, recently', score: 0 },
      { label: 'Yes, years ago', score: 1 },
      { label: 'Never', score: 2 },
    ],
  },
  {
    id: 4,
    domainIndex: 0,
    text: 'Does your lease have rent review clauses you understand?',
    options: [
      { label: 'Yes, fully understood', score: 0 },
      { label: 'Somewhat', score: 1 },
      { label: 'No / unsure', score: 2 },
    ],
  },
  // Domain 1 — Space & Fitout
  {
    id: 5,
    domainIndex: 1,
    text: 'How well does your current space fit your team?',
    options: [
      { label: 'Perfect', score: 0 },
      { label: 'Mostly fine', score: 0 },
      { label: 'Cramped', score: 2 },
      { label: 'Wasted space', score: 1 },
      { label: 'Layout doesn\'t work', score: 2 },
    ],
  },
  {
    id: 6,
    domainIndex: 1,
    text: 'When was your office last refitted or updated?',
    options: [
      { label: 'Under 2 years', score: 0 },
      { label: '2–5 years', score: 1 },
      { label: '5–10 years', score: 2 },
      { label: 'Over 10 years', score: 2 },
    ],
  },
  {
    id: 7,
    domainIndex: 1,
    text: 'Does your space reflect your brand to clients and recruits?',
    options: [
      { label: 'Absolutely', score: 0 },
      { label: 'Mostly', score: 1 },
      { label: 'Not really', score: 2 },
      { label: 'Never thought about it', score: 2 },
    ],
  },
  {
    id: 8,
    domainIndex: 1,
    text: 'Is your team satisfied with the workspace?',
    options: [
      { label: 'Very satisfied', score: 0 },
      { label: 'Mostly', score: 0 },
      { label: 'Mixed', score: 1 },
      { label: 'Dissatisfied', score: 2 },
    ],
  },
  // Domain 2 — Furniture
  {
    id: 9,
    domainIndex: 2,
    text: 'How old is your current office furniture?',
    options: [
      { label: 'Under 2 years', score: 0 },
      { label: '2–5 years', score: 0 },
      { label: '5–10 years', score: 1 },
      { label: 'Over 10 years', score: 2 },
    ],
  },
  {
    id: 10,
    domainIndex: 2,
    text: 'Does your furniture support how your team actually works?',
    options: [
      { label: 'Yes, purpose-built', score: 0 },
      { label: 'Partly', score: 1 },
      { label: 'Not at all', score: 2 },
      { label: 'We just have desks', score: 2 },
    ],
  },
  {
    id: 11,
    domainIndex: 2,
    text: 'Have you purchased commercial-grade furniture or consumer-grade?',
    options: [
      { label: 'Commercial grade', score: 0 },
      { label: 'Mix', score: 1 },
      { label: 'Consumer grade', score: 2 },
      { label: 'Unsure', score: 1 },
    ],
  },
  {
    id: 12,
    domainIndex: 2,
    text: 'Would new furniture meaningfully improve your team\'s daily experience?',
    options: [
      { label: 'Probably not', score: 0 },
      { label: 'Maybe', score: 1 },
      { label: 'Yes', score: 2 },
      { label: 'Definitely yes', score: 2 },
    ],
  },
  // Domain 3 — Cleaning
  {
    id: 13,
    domainIndex: 3,
    text: 'How often is your office professionally cleaned?',
    options: [
      { label: 'Daily', score: 0 },
      { label: '2–3x per week', score: 0 },
      { label: 'Weekly', score: 1 },
      { label: 'Rarely / never', score: 2 },
    ],
  },
  {
    id: 14,
    domainIndex: 3,
    text: 'Are you satisfied with the quality and consistency of your cleaning?',
    options: [
      { label: 'Very satisfied', score: 0 },
      { label: 'Mostly', score: 0 },
      { label: 'Mixed', score: 1 },
      { label: 'Poor', score: 2 },
      { label: 'No current service', score: 2 },
    ],
  },
  {
    id: 15,
    domainIndex: 3,
    text: 'Do you know who is actually cleaning your office?',
    options: [
      { label: 'Yes, direct relationship', score: 0 },
      { label: 'Sort of', score: 1 },
      { label: 'No', score: 2 },
    ],
  },
  {
    id: 16,
    domainIndex: 3,
    text: 'Has cleaning quality ever affected a client visit or staff complaint?',
    options: [
      { label: 'Never', score: 0 },
      { label: 'Once', score: 1 },
      { label: 'Multiple times', score: 2 },
      { label: 'Yes, regularly', score: 2 },
    ],
  },
]

// ─── Scoring helpers ──────────────────────────────────────────────────────────

function getDomainScore(domainIndex: number, answers: (number | null)[]): number {
  return QUESTIONS.filter(q => q.domainIndex === domainIndex).reduce((acc, q) => {
    const qi = QUESTIONS.indexOf(q)
    const sel = answers[qi]
    if (sel === null) return acc
    return acc + (q.options[sel]?.score ?? 0)
  }, 0)
}

function getVerdict(score: number): RagVerdict {
  if (score <= 3) return 'GREEN'
  if (score <= 6) return 'AMBER'
  return 'RED'
}

function getOverallVerdict(totalScore: number): RagVerdict {
  // Overall out of 32 — scale thresholds proportionally
  if (totalScore <= 12) return 'GREEN'
  if (totalScore <= 22) return 'AMBER'
  return 'RED'
}

function getOverallSummary(verdict: RagVerdict): string {
  if (verdict === 'GREEN') return 'Your commercial space is broadly healthy. A few areas worth monitoring, but no urgent action required.'
  if (verdict === 'AMBER') return 'There are clear areas in your commercial setup that deserve attention. The good news: they\'re fixable.'
  return 'Multiple areas of your commercial property situation carry real risk. Prioritised action is recommended now.'
}

const RAG_STYLES: Record<RagVerdict, {
  color: string
  bgColor: string
  borderColor: string
  badgeBg: string
  badgeText: string
}> = {
  GREEN: {
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.3)',
    badgeBg: 'rgba(34,197,94,0.15)',
    badgeText: '#4ade80',
  },
  AMBER: {
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.3)',
    badgeBg: 'rgba(245,158,11,0.15)',
    badgeText: '#fbbf24',
  },
  RED: {
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.3)',
    badgeBg: 'rgba(239,68,68,0.15)',
    badgeText: '#f87171',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HealthCheckPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [current, setCurrent] = useState(0)

  const allAnswered = answers.every(a => a !== null)
  const answeredCount = answers.filter(a => a !== null).length
  const progressPct = (answeredCount / QUESTIONS.length) * 100

  const domainScores = DOMAINS.map((_, di) => getDomainScore(di, answers))
  const domainVerdicts: RagVerdict[] = domainScores.map(s => getVerdict(s))
  const totalScore = domainScores.reduce((a, b) => a + b, 0)
  const overallVerdict = getOverallVerdict(totalScore)
  const overallStyles = RAG_STYLES[overallVerdict]

  function selectOption(questionIdx: number, optionIdx: number) {
    setAnswers(prev => {
      const next = [...prev]
      next[questionIdx] = optionIdx
      return next
    })
    if (questionIdx < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(questionIdx + 1), 280)
    }
  }

  function handleSubmit() {
    if (!allAnswered) return
    setSubmitted(true)
    setTimeout(() => {
      document.getElementById('health-check-results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function handleReset() {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setSubmitted(false)
    setCurrent(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Context string for HubSpot
  const contextString = () => {
    const domainParts = DOMAINS.map((d, i) => `${d.name}: ${domainVerdicts[i]} (${domainScores[i]}/8)`).join(', ')
    return `Health Check: ${overallVerdict} (score ${totalScore}/32). ${domainParts}.`
  }

  // Teaser — blurred domain cards
  const teaserContent = (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '1rem',
      padding: 'clamp(2rem,4vw,3rem)',
      marginBottom: '0.5rem',
    }}>
      <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        Your Health Check Results
      </p>

      {/* Blurred overall score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', filter: 'blur(4px)', userSelect: 'none' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Overall score
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1 }}>{totalScore}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300, fontSize: '1.25rem' }}>/32</span>
          </div>
        </div>
        <div style={{
          background: overallStyles.badgeBg,
          border: `1px solid ${overallStyles.borderColor}`,
          borderRadius: '0.5rem',
          padding: '0.6rem 1.5rem',
        }}>
          <span style={{ color: overallStyles.badgeText, fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em' }}>
            {overallVerdict}
          </span>
        </div>
      </div>

      {/* Blurred domain badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem', marginBottom: '1.25rem' }}>
        {DOMAINS.map((domain, di) => {
          const verdict = domainVerdicts[di]
          const styles = RAG_STYLES[verdict]
          return (
            <div
              key={domain.name}
              style={{
                background: styles.bgColor,
                border: `1px solid ${styles.borderColor}`,
                borderRadius: '0.75rem',
                padding: '0.875rem 1.125rem',
                filter: 'blur(4px)',
                userSelect: 'none',
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                {domain.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: styles.badgeText, fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                  {verdict}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {domainScores[di]}/8
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
        Full results and recommendations — unlock to view
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
            Free diagnostic tool
          </p>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2.25rem,5vw,5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Is Your Commercial<br />Space Working<br />For You?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.75, maxWidth: '42rem', marginBottom: '3rem' }}>
            16 questions. 4 domains. A clear picture of where your business stands — and what to do about it.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
            {[
              { stat: '16 questions', desc: 'Takes under 4 minutes' },
              { stat: '4 categories', desc: 'Lease, fitout, furniture, cleaning' },
              { stat: 'Instant results', desc: 'Red, Amber, or Green per domain' },
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
          <div style={{ marginBottom: '3.5rem' }}>
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
            {/* Domain segment markers */}
            <div style={{ display: 'flex', marginTop: '0.5rem', gap: '0.25rem' }}>
              {DOMAINS.map((domain, di) => {
                const domainAnswered = QUESTIONS.filter(q => q.domainIndex === di && answers[QUESTIONS.indexOf(q)] !== null).length
                const domainTotal = QUESTIONS.filter(q => q.domainIndex === di).length
                const isComplete = domainAnswered === domainTotal
                return (
                  <div key={domain.name} style={{ flex: 1 }}>
                    <p style={{
                      color: isComplete ? '#00B5A5' : 'rgba(255,255,255,0.25)',
                      fontSize: '0.6rem',
                      fontWeight: isComplete ? 700 : 400,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      transition: 'color 0.3s',
                    }}>
                      {domain.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Domain sections */}
          {DOMAINS.map((domain, di) => {
            const domainQuestions = QUESTIONS.filter(q => q.domainIndex === di)
            const isFirstDomain = di === 0

            return (
              <div key={domain.name} style={{ marginBottom: '5rem' }}>

                {/* Domain divider (not for first) */}
                {!isFirstDomain && (
                  <div style={{
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(0,181,165,0.4), rgba(255,255,255,0.06), transparent)',
                    marginBottom: '3.5rem',
                  }} />
                )}

                {/* Domain header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginBottom: '3rem',
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(0,181,165,0.05)',
                  border: '1px solid rgba(0,181,165,0.15)',
                  borderRadius: '0.75rem',
                }}>
                  <div style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(0,181,165,0.15)',
                    border: '1px solid rgba(0,181,165,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: '#00B5A5', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                      {domain.icon}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#00B5A5', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Domain {di + 1} of 4
                    </p>
                    <p style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(0.95rem,2vw,1.15rem)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                      {domain.name}
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300, fontSize: '0.75rem', textTransform: 'none', marginLeft: '0.875rem', letterSpacing: 0 }}>
                        {domain.serviceLabel}
                      </span>
                    </p>
                  </div>
                  {/* Domain completion indicator */}
                  {(() => {
                    const answered = QUESTIONS.filter(q => q.domainIndex === di && answers[QUESTIONS.indexOf(q)] !== null).length
                    const total = domainQuestions.length
                    return (
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <p style={{ color: answered === total ? '#00B5A5' : 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 700 }}>
                          {answered}/{total}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {answered === total ? 'complete' : 'answered'}
                        </p>
                      </div>
                    )
                  })()}
                </div>

                {/* Questions in this domain */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingLeft: 'clamp(0rem,2vw,1.5rem)' }}>
                  {domainQuestions.map((q) => {
                    const qi = QUESTIONS.indexOf(q)
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
                          {q.options.map((opt, optIdx) => {
                            const isSelected = answers[qi] === optIdx
                            return (
                              <button
                                key={opt.label}
                                onClick={e => { e.stopPropagation(); selectOption(qi, optIdx) }}
                                style={{
                                  background: isSelected ? 'rgba(0,181,165,0.15)' : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${isSelected ? '#00B5A5' : 'rgba(255,255,255,0.1)'}`,
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
                                  if (!isSelected) {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
                                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (!isSelected) {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
                                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                                  }
                                }}
                              >
                                {/* Radio dot */}
                                <div style={{
                                  width: '1rem', height: '1rem', borderRadius: '50%', flexShrink: 0,
                                  border: `2px solid ${isSelected ? '#00B5A5' : 'rgba(255,255,255,0.25)'}`,
                                  background: isSelected ? '#00B5A5' : 'transparent',
                                  transition: 'all 0.15s',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  {isSelected && (
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                                  )}
                                </div>
                                <span style={{
                                  color: isSelected ? 'white' : 'rgba(255,255,255,0.75)',
                                  fontWeight: isSelected ? 600 : 400,
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
              </div>
            )
          })}

          {/* Submit */}
          {!submitted && (
            <div style={{ marginTop: '1rem', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
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
                {allAnswered ? 'Get My Health Report →' : `Answer all ${QUESTIONS.length} questions to continue`}
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
        <section id="health-check-results" style={{ background: '#0A0A0A', paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

            <ToolGate
              tool="Commercial Property Health Check"
              context={contextString}
              heading="Where should we send your report?"
              subheading="We'll email you a full breakdown with specific next steps for your business."
              teaser={teaserContent}
            >
              {/* ── Overall health score card ── */}
              <div style={{
                background: overallStyles.bgColor,
                border: `1px solid ${overallStyles.borderColor}`,
                borderRadius: '1rem',
                padding: 'clamp(2rem,4vw,3rem)',
                marginBottom: '2rem',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  Overall Health Score
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(3rem,6vw,5rem)', lineHeight: 1 }}>{totalScore}</span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300, fontSize: '1.75rem' }}>/32</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 400, marginTop: '0.35rem' }}>
                      across all four domains
                    </p>
                  </div>

                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Verdict
                    </p>
                    <div style={{
                      background: overallStyles.badgeBg,
                      border: `1px solid ${overallStyles.borderColor}`,
                      borderRadius: '0.5rem',
                      padding: '0.6rem 1.75rem',
                      display: 'inline-block',
                    }}>
                      <span style={{ color: overallStyles.badgeText, fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.12em' }}>
                        {overallVerdict}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ width: '2.5rem', height: '3px', background: overallStyles.color, borderRadius: '2px', marginBottom: '1.25rem' }} />
                <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.7, maxWidth: '44rem' }}>
                  {getOverallSummary(overallVerdict)}
                </p>
              </div>

              {/* ── Domain cards ── */}
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Domain Breakdown
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
                {DOMAINS.map((domain, di) => {
                  const verdict = domainVerdicts[di]
                  const score = domainScores[di]
                  const styles = RAG_STYLES[verdict]
                  const verdictData = domain.verdicts[verdict]

                  return (
                    <div
                      key={domain.name}
                      style={{
                        background: styles.bgColor,
                        border: `1px solid ${styles.borderColor}`,
                        borderRadius: '1rem',
                        padding: 'clamp(1.5rem,3vw,1.875rem)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                            Domain {di + 1}
                          </p>
                          <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                            {domain.name}
                          </p>
                        </div>
                        <div style={{
                          background: styles.badgeBg,
                          border: `1px solid ${styles.borderColor}`,
                          borderRadius: '0.375rem',
                          padding: '0.35rem 0.875rem',
                          flexShrink: 0,
                        }}>
                          <span style={{ color: styles.badgeText, fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                            {verdict}
                          </span>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Score
                          </p>
                          <p style={{ color: styles.badgeText, fontWeight: 700, fontSize: '0.8rem' }}>
                            {score} / 8
                          </p>
                        </div>
                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.round((score / 8) * 100)}%`,
                            background: styles.color,
                            borderRadius: '2px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ height: '1px', background: styles.borderColor }} />

                      {/* Summary */}
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.5 }}>
                        {verdictData.summary}
                      </p>

                      {/* Recommendations */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
                        {verdictData.recs.slice(0, 3).map((rec, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '1.25rem', height: '1.25rem', borderRadius: '50%', flexShrink: 0,
                              background: styles.badgeBg,
                              border: `1px solid ${styles.borderColor}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginTop: '0.1rem',
                            }}>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                                <path d="M1 3.5l2 2 3-3" stroke={styles.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, fontSize: '0.8rem', lineHeight: 1.65 }}>
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* CTAs */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem' }}>
                        {domain.ctaLinks.map(link => (
                          <a
                            key={link.href}
                            href={link.href}
                            style={{
                              display: 'inline-flex', alignItems: 'center',
                              background: 'rgba(0,181,165,0.1)',
                              border: '1px solid rgba(0,181,165,0.3)',
                              color: '#00B5A5',
                              fontWeight: 700, fontSize: '0.65rem',
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              textDecoration: 'none',
                              padding: '0.5rem 0.875rem', borderRadius: '0.375rem',
                              transition: 'background 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,181,165,0.2)'; e.currentTarget.style.borderColor = 'rgba(0,181,165,0.55)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,181,165,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,181,165,0.3)' }}
                          >
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Speak to Joe CTA ── */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                padding: 'clamp(2rem,4vw,3rem)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ width: '2.5rem', height: '3px', background: '#00B5A5', borderRadius: '2px', margin: '0 auto 1.5rem' }} />
                <h3 style={{
                  color: 'white', fontWeight: 900, fontSize: 'clamp(1.1rem,2.5vw,1.75rem)',
                  textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '0.875rem',
                }}>
                  Speak to Joe about your results
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75,
                  marginBottom: '2rem', maxWidth: '38rem', margin: '0 auto 2rem',
                }}>
                  Joe will walk through every red and amber domain with you — and tell you exactly what to do next. No pitch, no obligation. Just straight answers.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                  <a
                    href="https://meetings-ap1.hubspot.com/jkelley"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: '#00B5A5', color: 'white',
                      fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', textDecoration: 'none',
                      padding: '1.1rem 2.75rem', borderRadius: '0.5rem',
                      minHeight: '52px', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#009e90')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#00B5A5')}
                  >
                    Book a Free Call with Joe →
                  </a>
                  <button
                    onClick={handleReset}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.5)',
                      fontWeight: 600, fontSize: '0.72rem',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      padding: '1.1rem 2rem', borderRadius: '0.5rem',
                      cursor: 'pointer', minHeight: '52px', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>

              {/* ── Related tools ── */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '1rem',
                padding: 'clamp(1.5rem,3vw,2rem)',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  Not ready for a call? Start with one of these tools
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
                  {[
                    { label: 'Should I Relocate?', href: '/resources/relocate-quiz', desc: 'Get a Red / Amber / Green relocation verdict' },
                    { label: 'Lease Comparison', href: '/resources/lease-comparison', desc: 'Compare your current lease against the market' },
                  ].map(tool => (
                    <a
                      key={tool.href}
                      href={tool.href}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: '0.25rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        padding: '1rem 1.375rem',
                        textDecoration: 'none',
                        transition: 'background 0.15s, border-color 0.15s',
                        flex: '1 1 220px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    >
                      <span style={{ color: '#00B5A5', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '-0.005em' }}>
                        {tool.label} →
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '0.75rem', lineHeight: 1.5 }}>
                        {tool.desc}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </ToolGate>
          </div>
        </section>
      )}

      {/* ─── BOTTOM CTA (pre-submit only) ──────────────────────────────────── */}
      {!submitted && (
        <section style={{ background: '#111111', paddingTop: 'clamp(5rem,10vw,10rem)', paddingBottom: 'clamp(5rem,10vw,10rem)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <div style={{ maxWidth: '44rem', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.5rem)', textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                Not sure where to start?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                Answer the questions above for a clear picture across all four areas. Or book a free call with Joe and skip straight to the answer.
              </p>
              <a
                href="https://meetings-ap1.hubspot.com/jkelley"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#00B5A5', color: 'white',
                  fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  padding: '1.1rem 2.5rem', borderRadius: '0.5rem',
                  minHeight: '52px', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#009e90')}
                onMouseLeave={e => (e.currentTarget.style.background = '#00B5A5')}
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
