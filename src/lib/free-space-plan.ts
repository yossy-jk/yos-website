export const SPACE_PLAN_CONTACT_PERMISSION = 'I agree that Your Office Space may contact me about my free space plan request.'
export function normaliseSpacePlan(raw: Record<string, unknown>) {
  const text = (key: string, max: number) => typeof raw[key] === 'string' ? raw[key].trim().slice(0, max) : ''
  if (raw._honey || raw.honeypot) throw Error('Check your request details.')
  const name = text('name', 200), email = text('email', 254).toLowerCase()
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Enter your name and a valid email address.')
  if (raw.builderEngaged !== 'no') throw Error('This offer is for businesses that have not yet engaged a builder. Please contact us about your project instead.')
  if (raw.contactPermission !== true) throw Error('Please give permission for us to contact you about this request.')
  const suburb = text('suburb', 200), brief = text('brief', 4000)
  if (!suburb || brief.length < 10) throw Error('Enter the business suburb and a short workplace brief.')
  return { name, email, phone: text('phone', 80), company: text('company', 200), source: 'Free space plan', message: brief,
    details: { suburb, teamSize: text('teamSize', 80), timing: text('timing', 200), builderEngaged: 'No', contactPermission: true, consentWording: SPACE_PLAN_CONTACT_PERMISSION, service: 'FitOut' },
    marketingConsent: false, submissionId: text('submissionId', 80), submittedAt: text('submittedAt', 80), enquiryPage: '/free-space-plan', entryPage: '/office-fitout' }
}
