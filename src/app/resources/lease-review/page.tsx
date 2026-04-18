'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { HUBSPOT } from '@/lib/constants'

const QUESTIONS = [
  {
    id: 'term',
    label: 'What is the initial lease term?',
    type: 'select',
    options: ['1–2 years', '3 years', '5 years', '7+ years'],
    risk: { '7+ years': 'high', '1–2 years': 'medium' }
  },
  {
    id: 'options',
    label: 'Do you have options to renew?',
    type: 'select',
    options: ['No options', '1 option', '2+ options'],
    risk: { 'No options': 'high' }
  },
  {
    id: 'rent_review',
    label: 'How is rent reviewed?',
    type: 'select',
    options: ['Fixed % increases', 'CPI (Consumer Price Index)', 'Market review', 'Combination / not sure'],
    risk: { 'Market review': 'high', 'Combination / not sure': 'medium' }
  },
  {
    id: 'outgoings',
    label: 'Who pays outgoings (rates, insurance, maintenance)?',
    type: 'select',
    options: ['Landlord pays all', 'Tenant pays some', 'Tenant pays all', 'Not clear in lease'],
    risk: { 'Tenant pays all': 'high', 'Not clear in lease': 'high', 'Tenant pays some': 'medium' }
  },
  {
    id: 'makegood',
    label: 'Does the lease include make-good obligations?',
    type: 'select',
    options: ['No make-good clause', 'Fair wear and tear only', 'Full reinstatement required', 'Not sure'],
    risk: { 'Full reinstatement required': 'high', 'Not sure': 'high' }
  },
  {
    id: 'assignment',
    label: 'Can you assign or sublet the lease?',
    type: 'select',
    options: ['Yes, with landlord consent', 'No — not permitted', 'Not mentioned / not sure'],
    risk: { 'No — not permitted': 'high', 'Not mentioned / not sure': 'medium' }
  },
  {
    id: 'personal_guarantee',
    label: 'Does the lease require a personal guarantee?',
    type: 'select',
    options: ['No personal guarantee', 'Yes — limited guarantee', 'Yes — unlimited guarantee', 'Not sure'],
    risk: { 'Yes — unlimited guarantee': 'high', 'Not sure': 'medium' }
  },
  {
    id: 'demolition',
    label: 'Does the landlord have a demolition or redevelopment clause?',
    type: 'select',
    options: ['No such clause', 'Yes — with notice period', 'Yes — without adequate notice', 'Not sure'],
    risk: { 'Yes — without adequate notice': 'high', 'Not sure': 'medium', 'Yes — with notice period': 'medium' }
  },
  {
    id: 'fitout_contribution',
    label: 'Have you negotiated a fitout contribution or rent-free period?',
    type: 'select',
    options: ['Yes — documented in lease', 'Agreed verbally but not in lease', 'No incentive offered', 'Not requested'],
    risk: { 'Agreed verbally but not in lease': 'high', 'No incentive offered': 'medium', 'Not requested': 'medium' }
  },
  {
    id: 'legal_review',
    label: 'Has a solicitor reviewed this lease?',
    type: 'select',
    options: ['Yes — fully reviewed', 'Skimmed it myself', 'No review yet'],
    risk: { 'No review yet': 'high', 'Skimmed it myself': 'high' }
  }
] as const

type QuestionId = typeof QUESTIONS[number]['id']

const RISK_ADVICE: Record<string, { flag: string; advice: string }> = {
  term_high: { flag: 'Long term — limited flexibility', advice: 'A 7+ year lease is a significant commitment. Ensure you have adequate options, assignment rights, and an early termination clause before signing.' },
  term_medium: { flag: 'Short term — limited security', advice: 'Short terms can work in your favour but make it harder to invest in the space and limit your ability to lock in good conditions long-term.' },
  options_high: { flag: 'No renewal options', advice: 'Without options to renew, you have no right to stay at the property when the lease expires. The landlord can remove you or reset rent entirely. Negotiate at least one option.' },
  rent_review_high: { flag: 'Market rent review — highest risk', advice: 'Market reviews can result in significant rent increases with no cap. Always negotiate a ratchet clause (rent cannot fall below current) removal, and cap any market review increase.' },
  rent_review_medium: { flag: 'Clarify rent review mechanism', advice: 'The rent review mechanism directly affects your occupancy cost for the lease term. Ensure you understand exactly how and when it applies.' },
  outgoings_high: { flag: 'Outgoings risk — review carefully', advice: 'Full outgoings or unclear outgoings clauses are common sources of unexpected cost. Get a schedule of current outgoings from the landlord and cap any uncontrolled items.' },
  outgoings_medium: { flag: 'Outgoings — confirm what is included', advice: 'Confirm exactly which outgoings you are responsible for and get a recent outgoings schedule to budget accurately.' },
  makegood_high: { flag: 'Make-good risk identified', advice: 'Full reinstatement obligations can cost $50–$200/m² at lease end. Negotiate "fair wear and tear" instead, or agree a cash settlement amount at lease commencement.' },
  assignment_high: { flag: 'Cannot assign or sublet', advice: 'If you cannot assign, you cannot exit the lease by selling your business without significant risk. This is a material restriction — negotiate it out or ensure you have adequate termination rights.' },
  assignment_medium: { flag: 'Assignment terms — clarify', advice: 'Ensure the lease specifies the grounds on which the landlord can withhold consent. "Reasonably withheld" is better than "absolute discretion".' },
  personal_guarantee_high: { flag: 'Unlimited personal guarantee — high risk', advice: 'An unlimited personal guarantee exposes your personal assets for the full lease liability. Negotiate a cap equal to 3–6 months rent, or a bank guarantee instead.' },
  personal_guarantee_medium: { flag: 'Confirm guarantee terms', advice: 'Ensure you understand the full extent of any guarantee — the amount, term, and triggering events.' },
  demolition_high: { flag: 'Demolition clause — significant risk', advice: 'A demolition clause without adequate notice (minimum 6 months) gives the landlord the right to remove you with little warning. Negotiate minimum notice periods and compensation provisions.' },
  demolition_medium: { flag: 'Demolition clause present', advice: 'Review the notice period carefully. Any period shorter than 6 months should be renegotiated. Ensure you are compensated for unamortised fitout costs.' },
  fitout_contribution_high: { flag: 'Incentive not documented in lease', advice: 'Verbal incentive agreements are unenforceable. Any fitout contribution or rent-free period must be documented in the lease deed or a formal side agreement before you sign.' },
  fitout_contribution_medium: { flag: 'No incentive — may be leaving money behind', advice: 'In most markets, incentives (fitout contribution, rent-free) are negotiable. If you have not asked, you should before signing.' },
  legal_review_high: { flag: 'No legal review — significant risk', advice: 'A commercial lease is one of the most significant financial commitments your business will make. Signing without a solicitor review is a false economy — lease disputes are expensive and protracted.' }
}

export default function LeaseReviewPage() {
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  function answer(id: QuestionId, val: string) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id])

  const flags = submitted ? QUESTIONS.flatMap(q => {
    const val = answers[q.id]
    if (!val) return []
    const risk = (q.risk as Record<string, string>)[val]
    if (!risk) return []
    const key = `${q.id}_${risk}`
    const advice = RISK_ADVICE[key]
    if (!advice) return []
    return [{ ...advice, level: risk as 'high' | 'medium' }]
  }) : []

  const highCount = flags.filter(f => f.level === 'high').length
  const mediumCount = flags.filter(f => f.level === 'medium').length

  return (
    <>
      <Nav />

      <section className="bg-near-black pt-[72px] pb-20">
        <div className="max-w-4xl mx-auto px-[5%] pt-16">
          <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">Free tool</p>
          <h1 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-4">Lease Risk Checker</h1>
          <p className="text-white/60 font-light text-lg leading-relaxed">
            Answer 10 questions about your lease. We&apos;ll flag the risks and tell you what to watch out for before you sign.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-[5%]">

          {!submitted ? (
            <>
              <div className="space-y-8 mb-10">
                {QUESTIONS.map((q, i) => (
                  <div key={q.id} className="border-b border-gray-100 pb-8">
                    <p className="text-near-black font-semibold text-base mb-4">
                      <span className="text-teal mr-2">{i + 1}.</span>{q.label}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => answer(q.id, opt)}
                          className={`px-4 py-2.5 rounded text-sm font-light border transition-all duration-200 ${
                            answers[q.id] === opt
                              ? 'bg-teal text-white border-teal font-semibold'
                              : 'border-gray-300 text-charcoal hover:border-teal'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSubmitted(true)}
                disabled={!allAnswered}
                className={`px-10 py-4 rounded font-semibold text-base transition-all duration-200 ${
                  allAnswered
                    ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer'
                    : 'bg-gray-200 text-mid-grey cursor-not-allowed'
                }`}
              >
                {allAnswered ? 'Show my risk report' : `Answer all questions to continue (${Object.keys(answers).length}/${QUESTIONS.length})`}
              </button>
            </>
          ) : (
            <>
              {/* Summary */}
              <div className={`rounded-sm p-8 mb-8 border-2 ${highCount > 0 ? 'bg-near-black border-near-black' : mediumCount > 0 ? 'bg-warm-grey border-gray-200' : 'bg-light-teal border-teal'}`}>
                <p className={`font-bold text-xl mb-2 ${highCount > 0 ? 'text-white' : 'text-near-black'}`}>
                  {highCount > 0 ? `${highCount} high-risk clause${highCount > 1 ? 's' : ''} identified` : mediumCount > 0 ? 'Some clauses worth reviewing' : 'No major red flags detected'}
                </p>
                <p className={`font-light text-sm ${highCount > 0 ? 'text-white/70' : 'text-charcoal'}`}>
                  {highCount > 0
                    ? `This lease has ${highCount} high-risk item${highCount > 1 ? 's' : ''} that should be negotiated before signing. We strongly recommend getting advice.`
                    : mediumCount > 0
                    ? 'This lease looks reasonable but has some areas worth clarifying with a solicitor or tenant representative.'
                    : 'Based on your answers, this lease appears relatively well-structured. A solicitor review is still recommended before signing.'}
                </p>
              </div>

              {/* Risk flags */}
              {flags.length > 0 && (
                <div className="space-y-4 mb-10">
                  {flags.map((flag, i) => (
                    <div key={i} className={`rounded-sm p-6 border-l-4 ${flag.level === 'high' ? 'border-teal bg-near-black' : 'border-teal/50 bg-warm-grey'}`}>
                      <p className={`font-bold text-sm mb-2 ${flag.level === 'high' ? 'text-white' : 'text-near-black'}`}>
                        {flag.level === 'high' ? '⚠ ' : '→ '}{flag.flag}
                      </p>
                      <p className={`font-light text-sm leading-relaxed ${flag.level === 'high' ? 'text-white/65' : 'text-charcoal'}`}>{flag.advice}</p>
                    </div>
                  ))}
                </div>
              )}

              {flags.length === 0 && (
                <div className="bg-warm-grey rounded-sm p-8 mb-10">
                  <p className="text-near-black font-semibold text-base mb-2">Your answers didn&apos;t trigger any specific flags.</p>
                  <p className="text-charcoal font-light text-sm">This is a good sign — but a lease review tool is not a substitute for professional advice. Have a solicitor and a tenant representative review the full document before you sign.</p>
                </div>
              )}

              <div className="flex gap-4 flex-wrap">
                <Button href={HUBSPOT.bookingUrl} variant="primary" external>Get expert lease advice</Button>
                <button
                  onClick={() => { setSubmitted(false); setAnswers({}) }}
                  className="px-8 py-4 rounded font-semibold text-sm border-2 border-gray-300 text-charcoal hover:border-near-black transition-colors"
                >
                  Start again
                </button>
              </div>

              <p className="text-mid-grey font-light text-xs mt-8 leading-relaxed">
                This tool is a general risk indicator only — not legal or professional advice. Every lease is different. Always have a commercial solicitor and a qualified tenant representative review your full lease document before signing.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="bg-near-black py-20 text-center">
        <div className="max-w-2xl mx-auto px-[5%]">
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">Want us to review the full lease?</h2>
          <p className="text-white/60 font-light text-lg mb-8">
            We review commercial leases for Newcastle businesses every week. We&apos;ll tell you what to push back on — and negotiate it on your behalf.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a Lease Review Call</Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
