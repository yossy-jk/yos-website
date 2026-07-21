'use client'
import FadeIn from '@/components/FadeIn'

const STEPS = [
  {
    num: '01',
    title: 'Free consultation',
    value: 'You know where you stand before spending a cent',
    body: 'We start with a straight conversation about your situation — your current lease, your space needs, your timeline, and what you are actually trying to achieve. No forms. No sales pitch. You get a honest view of where you stand and whether we can genuinely help.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Market search',
    value: 'Off-market stock your current agent will never show you',
    body: 'We run a full search — on-market, off-market, and pre-release. In Newcastle, over half of commercial property is leased before it is ever listed. We know where that stock is and how to access it. You see more options than any self-directed search would find.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Financial analysis',
    value: 'You know exactly what every option costs — not just the rent',
    body: 'Rent is the headline. The real cost is everything underneath — incentives, outgoings, fit-out contributions, make-good obligations, and escalation clauses. We model every option so you are comparing apples with apples, not being distracted by a low face rent.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Negotiation',
    value: 'An expert in your corner — every clause, every term',
    body: 'We negotiate rent, incentives, rent-free periods, fit-out contributions, make-good caps, option structures, and every other clause in the lease. You have someone across the table who does this every week. That experience gap is worth real money.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Lease review',
    value: 'Every clause read — traps identified before you sign',
    body: 'Your solicitor reviews the lease. We brief them on what to look for and what to push back on. Most tenants read nothing. We make sure nothing is signed without full clarity on what you are agreeing to — including the clauses that only matter at lease end.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Move-in & handover',
    value: 'Keys in hand — without you managing a single contractor',
    body: 'Once the lease is signed, we coordinate fitout, furniture, and commercial cleaning — through to the day your space is running. One team. One contact. No gaps between advisors. You focus on your business; we handle everything else.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

interface Props {
  dark?: boolean   // true = near-black bg, white text (default on homepage)
  compact?: boolean
}

export default function TenantProcess({ dark = true, compact = false }: Props) {
  const bg       = dark ? 'bg-near-black' : 'bg-warm-grey'
  const labelCol = 'text-teal'
  const headCol  = dark ? 'text-white' : 'text-near-black'
  const bodyCol  = dark ? 'text-white/70' : 'text-charcoal'
  const valCol   = 'text-teal'
  const cardBg   = dark ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]' : 'bg-white border-gray-200 hover:shadow-md'

  return (
    <section className={`${bg} tenant-process-section`}>
      <div className="max-w-screen-xl mx-auto" style={{ padding: 'clamp(4rem,8vw,10rem) clamp(1.5rem,8vw,10rem)' }}>

        {/* Header */}
        <FadeIn>
          <div className="mb-14 max-w-2xl">
            <p className={`${labelCol} font-black uppercase tracking-widest mb-3`}
              style={{ fontSize: '0.65rem', letterSpacing: '0.3em' }}>
              How it works
            </p>
            <h2 className={`${headCol} font-black uppercase leading-tight tracking-tight mb-5`}
              style={{ fontSize: compact ? 'clamp(1.5rem,3vw,2.75rem)' : 'clamp(1.75rem,3.5vw,3.25rem)' }}>
              Six steps.<br />Zero guesswork.
            </h2>
            <p className={`${bodyCol} font-light leading-relaxed`}
              style={{ fontSize: '1rem', lineHeight: 1.85, maxWidth: '38rem' }}>
              We handle the entire lease journey — from the first conversation to handing you the keys.
              Here is exactly what that looks like.
            </p>
          </div>
        </FadeIn>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 70}>
              <div
                className={`${cardBg} rounded-xl p-7 sm:p-8 border flex flex-col gap-5 transition-colors duration-200 tenant-process-card`}
                style={{ minHeight: compact ? 'auto' : '18rem' }}
              >
                {/* Icon + number row */}
                <div className="flex items-start justify-between gap-4">
                  <div className={`${dark ? 'text-teal/30' : 'text-teal/40'}`}>
                    {step.icon}
                  </div>
                  <span className={`${dark ? 'text-white/15' : 'text-black/10'} font-black leading-none`}
                    style={{ fontSize: 'clamp(2.5rem,4vw,3.5rem)', fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>
                    {step.num}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className={`${headCol} font-black uppercase tracking-tight mb-2`}
                    style={{ fontSize: compact ? '1rem' : '1.1rem' }}>
                    {step.title}
                  </h3>
                  {/* Client value */}
                  <p className={`${valCol} font-semibold`}
                    style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {step.value}
                  </p>
                </div>

                {/* Body */}
                <p className={`${bodyCol} font-light leading-relaxed flex-1`}
                  style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
                  {step.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}
