'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

const FREE_CHECKS = [
  'Overall lease risk rating — RED / AMBER / GREEN',
  'Your top 3 highest-risk clauses identified',
  'Total financial exposure headline figure',
  'Whether your lease complies with Australian legislation',
]

const PAID_INCLUDES = [
  { icon: '🔍', title: 'All 12 risk categories', desc: 'Rent & reviews, make good, assignment, security, permitted use, outgoings, repairs, relocation, default, insurance, and special conditions' },
  { icon: '🟥', title: 'Full RAG risk table', desc: 'Every clause rated Red / Amber / Green with plain-English explanation of what it means for your business' },
  { icon: '💰', title: 'Financial exposure summary', desc: 'Total rent commitment, outgoings, make good estimate, bank guarantee, and early exit cost — all in one table' },
  { icon: '🗺️', title: 'Negotiation roadmap', desc: 'Which clauses to push back on, in priority order, with market benchmarks and realistic success likelihood' },
  { icon: '🚪', title: 'Exit scenario analysis', desc: 'How the lease plays out if you need to exit early, sell the business, sublet, or hold to expiry' },
  { icon: '📋', title: 'Your next move', desc: 'Three clear paths: sign as-is / negotiate before signing / do not sign — with specific steps for each' },
]

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: Record<string, unknown>) => void
      }
    }
  }
}

export default function LeaseReviewPage() {
  const [step, setStep] = useState<'landing' | 'upload' | 'submitted'>('landing')
  const [leaseType, setLeaseType] = useState('')
  const [state, setState] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFreeStart = () => setStep('upload')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !email || !name) return
    setSubmitting(true)

    // Submit to HubSpot form for lead capture
    try {
      await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/442709765/e3e49521-0831-49ba-8929-610c7cc7f282`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: name.split(' ')[0] },
            { name: 'lastname', value: name.split(' ').slice(1).join(' ') || '' },
            { name: 'email', value: email },
            { name: 'company', value: company },
            { name: 'message', value: `LeaseIntel™ request — ${leaseType} lease — ${state}` },
          ],
        }),
      })
    } catch (_) {
      // Continue even if HubSpot fails — don't block the user
    }

    setStep('submitted')
    setSubmitting(false)
  }

  return (
    <>
      <Nav />

      {step === 'landing' && (
        <>
          {/* HERO */}
          <section className="bg-near-black pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
              <div className="inline-flex items-center gap-2 bg-teal/15 border border-teal/30 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-teal rounded-full" />
                <span className="text-teal font-bold text-xs tracking-widest uppercase">LeaseIntel™ by Your Office Space</span>
              </div>
              <h1 className="text-white font-black leading-tight tracking-tight mb-6" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
                What&apos;s hiding<br />in your lease?
              </h1>
              <p className="text-white/60 text-base md:text-xl leading-relaxed mb-10 max-w-2xl font-light">
                Most business owners sign commercial leases they don&apos;t fully understand.
                LeaseIntel™ gives you a complete, plain-English risk analysis — every clause rated,
                every risk quantified, every negotiation opportunity identified.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleFreeStart}
                  className="bg-teal text-white font-black text-sm tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-dark-teal transition-colors"
                >
                  Get Free Summary →
                </button>
                <a
                  href="#full-report"
                  className="border border-white/20 text-white font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-sm hover:border-white/50 transition-colors text-center"
                >
                  View Full Report — $97
                </a>
              </div>
            </div>
          </section>

          {/* STATS BAR */}
          <section className="bg-teal py-6">
            <div className="max-w-5xl mx-auto px-5 md:px-10 grid grid-cols-3 gap-4 text-center">
              {[
                { stat: '$97', label: 'Full report' },
                { stat: '24hr', label: 'Turnaround' },
                { stat: '12', label: 'Risk categories' },
              ].map(item => (
                <div key={item.stat}>
                  <p className="text-white font-black text-xl md:text-2xl">{item.stat}</p>
                  <p className="text-white/75 text-xs font-medium tracking-wide">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FREE SUMMARY */}
          <section className="bg-white py-20 md:py-28">
            <div className="max-w-5xl mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Start free</p>
                <h2 className="text-near-black font-black leading-tight tracking-tight mb-6" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                  Upload your lease.<br />Get your risk score. Free.
                </h2>
                <p className="text-charcoal text-sm md:text-base leading-relaxed mb-8 font-light">
                  Upload your lease (PDF or Word doc) and get an instant free summary — your overall
                  risk rating and the three highest-risk clauses identified. No payment required to start.
                </p>
                <button
                  onClick={handleFreeStart}
                  className="bg-near-black text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-black transition-colors"
                >
                  Start Free Review →
                </button>
              </div>
              <div className="bg-warm-grey p-8 rounded-sm border-l-4 border-teal">
                <p className="text-near-black font-bold text-sm tracking-wide uppercase mb-5">Free summary includes:</p>
                <div className="flex flex-col gap-4">
                  {FREE_CHECKS.map(check => (
                    <div key={check} className="flex items-start gap-3">
                      <span className="text-teal font-black text-lg leading-none mt-0.5">✓</span>
                      <p className="text-charcoal text-sm leading-relaxed">{check}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FULL REPORT */}
          <section id="full-report" className="bg-near-black py-20 md:py-28">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
              <div className="max-w-2xl mb-14">
                <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Full paid report — $97 ex GST</p>
                <h2 className="text-white font-black leading-tight tracking-tight mb-5" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                  Everything you need to know<br />before you sign.
                </h2>
                <p className="text-white/55 text-sm md:text-base leading-relaxed font-light">
                  Law firms charge $1,500–$4,000 for a lease review and take 3–10 days.
                  LeaseIntel™ delivers a complete 10-section report in 24 hours for $97.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
                {PAID_INCLUDES.map(item => (
                  <div key={item.title} className="border border-white/10 p-6 rounded-sm hover:border-teal/50 transition-colors">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <h3 className="text-white font-black text-base mb-2">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-white font-black text-3xl mb-1">$97 <span className="text-white/40 font-light text-base">ex GST</span></p>
                  <p className="text-white/40 text-sm">24-hour turnaround · Emailed directly to you</p>
                </div>
                <button
                  onClick={handleFreeStart}
                  className="bg-teal text-white font-black text-sm tracking-widest uppercase px-10 py-4 rounded-sm hover:bg-dark-teal transition-colors w-full md:w-auto text-center"
                >
                  Upload Your Lease →
                </button>
              </div>
            </div>
          </section>

          {/* COMPARISON */}
          <section className="bg-warm-grey py-20 md:py-28">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
              <h2 className="text-near-black font-black leading-tight tracking-tight mb-12 text-center" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
                vs. the alternatives
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Law Firm Review',
                    price: '$1,500–$4,000',
                    time: '3–10 days',
                    plain: false,
                    roadmap: false,
                    highlight: false,
                  },
                  {
                    name: 'LeaseIntel™',
                    price: '$97 ex GST',
                    time: '24 hours',
                    plain: true,
                    roadmap: true,
                    highlight: true,
                  },
                  {
                    name: 'Sign without review',
                    price: 'Free',
                    time: 'Instant',
                    plain: false,
                    roadmap: false,
                    highlight: false,
                  },
                ].map(opt => (
                  <div
                    key={opt.name}
                    className={`p-7 rounded-sm border-2 ${opt.highlight ? 'border-teal bg-white shadow-xl' : 'border-gray-200 bg-white'}`}
                  >
                    {opt.highlight && (
                      <div className="bg-teal text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4">
                        Best value
                      </div>
                    )}
                    <h3 className={`font-black text-lg mb-2 ${opt.highlight ? 'text-teal' : 'text-near-black'}`}>{opt.name}</h3>
                    <p className="text-near-black font-black text-2xl mb-1">{opt.price}</p>
                    <p className="text-mid-grey text-sm mb-6">{opt.time}</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'Plain-English report', val: opt.plain },
                        { label: 'Negotiation roadmap', val: opt.roadmap },
                        { label: 'All 12 risk categories', val: opt.roadmap },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2">
                          <span className={f.val ? 'text-teal font-black' : 'text-mid-grey'}>
                            {f.val ? '✓' : '✗'}
                          </span>
                          <span className={`text-sm ${f.val ? 'text-charcoal' : 'text-mid-grey'}`}>{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECURITY NOTE */}
          <section className="bg-white py-14 border-t border-gray-100">
            <div className="max-w-5xl mx-auto px-5 md:px-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1">
                <p className="text-near-black font-black text-base mb-3">🔒 Your document stays private</p>
                <p className="text-charcoal text-sm leading-relaxed font-light">
                  Your lease is commercially sensitive. It is stored in an access-controlled, encrypted environment
                  accessible only to Your Office Space. It is never shared with third parties, never used for AI training,
                  and deleted 30 days after delivery. Handled under the Australian Privacy Act 1988.
                </p>
              </div>
              <div className="flex-1">
                <p className="text-near-black font-black text-base mb-3">⚖️ Not legal advice — commercial expertise</p>
                <p className="text-charcoal text-sm leading-relaxed font-light">
                  LeaseIntel™ provides commercially informed analysis, not legal advice. Every report recommends
                  you obtain formal legal advice from a qualified commercial solicitor before signing.
                  We identify the risks — your solicitor confirms enforceability.
                </p>
              </div>
            </div>
          </section>

          {/* ABOUT JOE */}
          <section className="bg-near-black py-20 md:py-28 text-center">
            <div className="max-w-2xl mx-auto px-5 md:px-10">
              <div className="w-10 h-1 bg-teal mx-auto mb-8" />
              <p className="text-white font-light leading-relaxed mb-8 text-lg md:text-xl">
                &ldquo;Most business owners sign commercial leases they don&apos;t fully understand.
                LeaseIntel™ changes that. For $97, you get complete plain-English analysis —
                every risk identified, every opportunity flagged, every number quantified.
                Before you sign.&rdquo;
              </p>
              <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase">
                Joe Kelley — Managing Director, Your Office Space
              </p>
            </div>
          </section>

          <Footer />
        </>
      )}

      {step === 'upload' && (
        <div className="min-h-screen bg-near-black flex items-center justify-center px-5 py-32">
          <div className="w-full max-w-lg">
            <button onClick={() => setStep('landing')} className="text-white/40 text-xs tracking-widest uppercase mb-8 hover:text-white transition-colors block">
              ← Back
            </button>

            <div className="inline-flex items-center gap-2 bg-teal/15 border border-teal/30 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-teal rounded-full" />
              <span className="text-teal font-bold text-xs tracking-widest uppercase">LeaseIntel™ — Free Summary</span>
            </div>

            <h2 className="text-white font-black text-3xl md:text-4xl leading-tight mb-3">Upload your lease</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10 font-light">
              We&apos;ll send your free risk summary within minutes. To upgrade to the full $97 report, we&apos;ll confirm in the follow-up email.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your full name *"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="bg-white/8 border border-white/15 text-white placeholder-white/30 px-5 py-4 rounded-sm text-sm focus:outline-none focus:border-teal transition-colors"
              />
              <input
                type="email"
                placeholder="Your email address *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/8 border border-white/15 text-white placeholder-white/30 px-5 py-4 rounded-sm text-sm focus:outline-none focus:border-teal transition-colors"
              />
              <input
                type="text"
                placeholder="Business / company name"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="bg-white/8 border border-white/15 text-white placeholder-white/30 px-5 py-4 rounded-sm text-sm focus:outline-none focus:border-teal transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={leaseType}
                  onChange={e => setLeaseType(e.target.value)}
                  className="bg-white/8 border border-white/15 text-white px-5 py-4 rounded-sm text-sm focus:outline-none focus:border-teal transition-colors"
                  style={{ color: leaseType ? 'white' : 'rgba(255,255,255,0.3)' }}
                >
                  <option value="" disabled>Lease type</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Mixed Use">Mixed Use</option>
                </select>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="bg-white/8 border border-white/15 text-white px-5 py-4 rounded-sm text-sm focus:outline-none focus:border-teal transition-colors"
                  style={{ color: state ? 'white' : 'rgba(255,255,255,0.3)' }}
                >
                  <option value="" disabled>State</option>
                  {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <label className="border-2 border-dashed border-white/20 hover:border-teal/60 transition-colors rounded-sm p-8 text-center cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {file ? (
                  <div>
                    <p className="text-teal font-bold text-sm">✓ {file.name}</p>
                    <p className="text-white/40 text-xs mt-1">Click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white/60 text-sm mb-1">Upload your lease document *</p>
                    <p className="text-white/30 text-xs">PDF or Word doc · Max 50MB</p>
                  </div>
                )}
              </label>

              <p className="text-white/25 text-xs leading-relaxed">
                Your document is stored securely and never shared. By submitting you agree to our privacy policy.
                This service provides commercial analysis, not legal advice.
              </p>

              <button
                type="submit"
                disabled={submitting || !file || !email || !name}
                className="bg-teal text-white font-black text-sm tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-dark-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Get My Free Summary →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'submitted' && (
        <div className="min-h-screen bg-near-black flex items-center justify-center px-5">
          <div className="w-full max-w-lg text-center">
            <div className="w-16 h-16 bg-teal/15 border border-teal/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-teal text-2xl">✓</span>
            </div>
            <h2 className="text-white font-black text-3xl md:text-4xl leading-tight mb-5">
              Got it. We&apos;re on it.
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-8 font-light">
              Your free risk summary will be in your inbox shortly. Joe personally reviews every submission —
              if anything urgent shows up, expect to hear from him directly.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8 text-left">
              <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">What happens next</p>
              <div className="flex flex-col gap-3">
                {[
                  'Free summary arrives in your inbox',
                  'Your top 3 risks and overall rating explained',
                  'Option to upgrade to full $97 report — 24hr turnaround',
                  'Request a free Clarity Call with Joe if you want to talk it through',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-teal font-black text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-white/60 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <a
              href={HUBSPOT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal font-bold text-xs tracking-widest uppercase border-b border-teal hover:text-dark-teal hover:border-dark-teal transition-colors no-underline"
            >
              Skip ahead — book a Clarity Call now →
            </a>
          </div>
        </div>
      )}
    </>
  )
}
