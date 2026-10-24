type LeaseQuestion = { id: string; label: string; hint: string; options: string[]; risk: Partial<Record<string, 'high' | 'medium'>> }

export const LEASE_QUESTIONS: LeaseQuestion[] = [
  {
    id: 'term',
    label: 'What is the initial lease term?',
    hint: 'Consider how the term, renewal options and exit arrangements fit your business plans.',
    options: ['1–2 years', '3 years', '5 years', '7+ years'],
    risk: { '7+ years': 'high', '1–2 years': 'medium' }
  },
  {
    id: 'options',
    label: 'Do you have options to renew?',
    hint: 'Check whether an option exists and ask your solicitor about its conditions and notice dates.',
    options: ['No options', '1 option', '2+ options'],
    risk: { 'No options': 'high' }
  },
  {
    id: 'rent_review',
    label: 'How is rent reviewed during the lease?',
    hint: 'Check the review method, timing and any limits or dispute process in the lease.',
    options: ['Fixed % increases', 'CPI (Consumer Price Index)', 'Market review', 'Combination / not sure'],
    risk: { 'Market review': 'high', 'Combination / not sure': 'medium' }
  },
  {
    id: 'outgoings',
    label: 'Who pays outgoings (rates, insurance, maintenance)?',
    hint: 'Identify the costs you may pay and request a premises-specific estimate; no standard percentage applies here.',
    options: ['Landlord pays all', 'Tenant pays some', 'Tenant pays all', 'Not clear in lease'],
    risk: { 'Tenant pays all': 'high', 'Not clear in lease': 'high', 'Tenant pays some': 'medium' }
  },
  {
    id: 'makegood',
    label: 'Does the lease include make-good obligations?',
    hint: 'Ask what must be removed, repaired or reinstated and who will assess the required scope.',
    options: ['No make-good clause', 'Fair wear and tear only', 'Full reinstatement required', 'Not sure'],
    risk: { 'Full reinstatement required': 'high', 'Not sure': 'high' }
  },
  {
    id: 'assignment',
    label: 'Can you assign or sublet the lease?',
    hint: 'Ask your solicitor to explain any conditions or consent requirements for assignment and subletting.',
    options: ['Yes, with landlord consent', 'No, not permitted', 'Not mentioned / not sure'],
    risk: { 'No, not permitted': 'high', 'Not mentioned / not sure': 'medium' }
  },
  {
    id: 'guarantee',
    label: 'Does the lease require a personal guarantee?',
    hint: 'Get independent legal advice on the scope, limits and release conditions of any personal guarantee.',
    options: ['No personal guarantee', 'Yes, limited guarantee', 'Yes, unlimited guarantee', 'Not sure'],
    risk: { 'Yes, unlimited guarantee': 'high', 'Not sure': 'medium' }
  },
  {
    id: 'demolition',
    label: 'Does the landlord have a demolition or redevelopment clause?',
    hint: 'Ask your solicitor how any redevelopment clause could affect occupation and what conditions apply.',
    options: ['No such clause', 'Yes, with notice period', 'Yes, without adequate notice', 'Not sure'],
    risk: { 'Yes, without adequate notice': 'high', 'Not sure': 'medium' }
  },
  {
    id: 'fitout',
    label: 'Have you negotiated a fitout contribution or rent-free period?',
    hint: 'Record any agreed incentive and ask your advisers to check its conditions and repayment terms.',
    options: ['Yes, documented in lease', 'Agreed verbally but not in lease', 'No incentive offered', 'Not requested'],
    risk: { 'Agreed verbally but not in lease': 'high', 'No incentive offered': 'medium', 'Not requested': 'medium' }
  },
  {
    id: 'solicitor',
    label: 'Has a solicitor reviewed this lease?',
    hint: 'A commercial property solicitor can explain the lease terms and advise on your specific situation.',
    options: ['Yes, fully reviewed', 'Skimmed it myself', 'No review yet'],
    risk: { 'No review yet': 'high', 'Skimmed it myself': 'medium' }
  },
]


export type LeaseReviewLevel = 'high' | 'medium' | 'low'
export const LEASE_REVIEW_MESSAGES = {
  high: 'Several answers have raised review flags. Discuss the actual lease and your circumstances with a commercial property solicitor before deciding what to do.',
  medium: 'Some answers warrant closer review. Ask your solicitor and commercial advisers which terms need clarification for your situation.',
  low: 'Fewer answers triggered this questionnaire’s flags. This does not establish that the lease is standard, suitable or free of risks.'
} as const

export function assessLeaseAnswers(answers: Record<string, string>): { level: LeaseReviewLevel; high: number; medium: number; issues: string[] } {
  let high = 0, medium = 0
  const issues: string[] = []
  for (const question of LEASE_QUESTIONS) {
    const answer = answers[question.id]
    const priority = question.risk[answer]
    if (priority === 'high') high++
    else if (priority === 'medium') medium++
    if (priority === 'high' || priority === 'medium') issues.push(`${question.label} ${answer}`)
  }
  return { level: high >= 3 ? 'high' : high >= 1 || medium >= 3 ? 'medium' : 'low', high, medium, issues }
}
