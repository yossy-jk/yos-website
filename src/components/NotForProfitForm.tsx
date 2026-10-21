'use client'
import { useRef, useState } from 'react'
import { sendEnquiry } from '@/lib/enquiry'

const LEASE_TYPE_OPTIONS = [
  { value: 'lease-review', label: 'Lease Review, I\'m already in a lease and want it reviewed' },
  { value: 'relocation', label: 'Relocation Search, I\'m looking for a new space' },
]

const SITUATION_OPTIONS = [
  { value: 'in-lease', label: 'Currently in a commercial lease' },
  { value: 'about-to-sign', label: 'About to sign a new lease' },
  { value: 'lease-expiry-soon', label: 'Lease expiring soon, need to act' },
  { value: 'actively-searching', label: 'Actively searching for space' },
  { value: 'early-stage', label: 'Early stage, exploring options' },
]

export default function NotForProfitForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [honey, setHoney] = useState('')
  const [fields, setFields] = useState({
    name: '',
    organisation: '',
    email: '',
    phone: '',
    abn: '',
    leaseType: '',
    situation: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<typeof fields>>({})

  const set = (k: keyof typeof fields) => (v: string) => {
    setFields(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<typeof fields> = {}
    if (!fields.name.trim()) e.name = 'Required'
    if (!fields.organisation.trim()) e.organisation = 'Required'
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Valid email required'
    if (!fields.leaseType) e.leaseType = 'Please select what you need'
    if (!fields.situation) e.situation = 'Please select your current situation'
    if (!fields.message.trim()) e.message = 'Tell us a little about your situation'
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) formRef.current?.querySelector<HTMLElement>(`#nfp-${first}`)?.focus()
    return !first
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const leaseTypeLabel = LEASE_TYPE_OPTIONS.find(o => o.value === fields.leaseType)?.label || fields.leaseType
    const situationLabel = SITUATION_OPTIONS.find(o => o.value === fields.situation)?.label || fields.situation

    setSubmitError('')
    const result = await sendEnquiry({
      name: fields.name, company: fields.organisation, email: fields.email,
      phone: fields.phone, source: 'Not-for-Profit Support', _honey: honey,
      message: [`Organisation: ${fields.organisation}`, `ABN: ${fields.abn}`,
        `What they need: ${leaseTypeLabel}`, `Current situation: ${situationLabel}`,
        `Message: ${fields.message}`].join('\n'),
    })

    setSubmitting(false)
    if (result.ok) setSent(true)
    else setSubmitError('We could not confirm delivery. Please retry or call 02 4092 0733.')
  }

  if (sent) {
    return (
      <div className="bg-teal/5 border border-teal/20 rounded-sm p-10 text-center">
        <p className="text-teal font-black text-xl mb-3">Application received.</p>
        <p className="text-charcoal font-light text-sm leading-relaxed">
          We&apos;ll review the submission, confirm eligibility and identify the appropriate next step.
        </p>
      </div>
    )
  }

  const inputClass = (err?: string) => [
    'w-full border outline-none transition-colors font-light',
    'focus:border-teal',
    'bg-white',
    err ? 'border-red-400' : 'border-gray-200 hover:border-gray-300',
  ].join(' ')

  const style = { padding: '0.85rem 1rem', fontSize: '16px' }
  const labelClass = 'block text-near-black font-semibold mb-2'
  const labelStyle = { fontSize: '0.78rem', letterSpacing: '0.05em' }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError && <p role="alert" className="text-red-600 mb-4">{submitError}</p>}
      {/* Honeypot */}
      <input type="text" name="_honey" value={honey} onChange={e => setHoney(e.target.value)}
        style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div>
        <label htmlFor="nfp-name" className={labelClass} style={labelStyle}>Your name <span className="text-teal">*</span></label>
        <input id="nfp-name" name="name" type="text" value={fields.name} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'nfp-name-error' : undefined} onChange={e => set('name')(e.target.value)}
          placeholder="Jane Smith" autoComplete="name"
          className={inputClass(errors.name)} style={style} />
        {errors.name && <p id="nfp-name-error" className="text-red-700 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="nfp-organisation" className={labelClass} style={labelStyle}>Organisation name <span className="text-teal">*</span></label>
        <input id="nfp-organisation" name="organisation" type="text" value={fields.organisation} required aria-invalid={!!errors.organisation} aria-describedby={errors.organisation ? 'nfp-organisation-error' : undefined} onChange={e => set('organisation')(e.target.value)}
          placeholder="Newcastle Community Support Inc." autoComplete="organization"
          className={inputClass(errors.organisation)} style={style} />
        {errors.organisation && <p id="nfp-organisation-error" className="text-red-700 text-xs mt-1">{errors.organisation}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nfp-email" className={labelClass} style={labelStyle}>Email <span className="text-teal">*</span></label>
          <input id="nfp-email" name="email" type="email" value={fields.email} required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'nfp-email-error' : undefined} onChange={e => set('email')(e.target.value)}
            placeholder="jane@organisation.org.au" autoComplete="email"
            className={inputClass(errors.email)} style={style} />
          {errors.email && <p id="nfp-email-error" className="text-red-700 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="nfp-phone" className={labelClass} style={labelStyle}>Phone</label>
          <input id="nfp-phone" name="phone" type="tel" value={fields.phone} onChange={e => set('phone')(e.target.value)}
            placeholder="0411 222 333" autoComplete="tel"
            className={inputClass()} style={style} />
        </div>
      </div>

      <div>
        <label htmlFor="nfp-abn" className={labelClass} style={labelStyle}>ABN <span className="text-charcoal font-normal">(optional)</span></label>
        <input id="nfp-abn" name="abn" type="text" value={fields.abn} onChange={e => set('abn')(e.target.value)}
          placeholder="12 345 678 901"
          className={inputClass()} style={style} />
      </div>

      <div>
        <label htmlFor="nfp-leaseType" className={labelClass} style={labelStyle}>What do you need? <span className="text-teal">*</span></label>
        <select id="nfp-leaseType" name="leaseType" value={fields.leaseType} required aria-invalid={!!errors.leaseType} aria-describedby={errors.leaseType ? 'nfp-leaseType-error' : undefined} onChange={e => set('leaseType')(e.target.value)}
          className={[inputClass(errors.leaseType), 'cursor-pointer'].join(' ')} style={style}>
          <option value="" disabled>Select…</option>
          {LEASE_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="text-near-black">{o.label}</option>
          ))}
        </select>
        {errors.leaseType && <p id="nfp-leaseType-error" className="text-red-700 text-xs mt-1">{errors.leaseType}</p>}
      </div>

      <div>
        <label htmlFor="nfp-situation" className={labelClass} style={labelStyle}>What&apos;s your current situation? <span className="text-teal">*</span></label>
        <select id="nfp-situation" name="situation" value={fields.situation} required aria-invalid={!!errors.situation} aria-describedby={errors.situation ? 'nfp-situation-error' : undefined} onChange={e => set('situation')(e.target.value)}
          className={[inputClass(errors.situation), 'cursor-pointer'].join(' ')} style={style}>
          <option value="" disabled>Select…</option>
          {SITUATION_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="text-near-black">{o.label}</option>
          ))}
        </select>
        {errors.situation && <p id="nfp-situation-error" className="text-red-700 text-xs mt-1">{errors.situation}</p>}
      </div>

      <div>
        <label htmlFor="nfp-message" className={labelClass} style={labelStyle}>Tell us about your situation <span className="text-teal">*</span></label>
        <textarea id="nfp-message" name="message" value={fields.message} required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'nfp-message-error' : undefined} onChange={e => set('message')(e.target.value)}
          rows={4}
          placeholder="Where are you located? What's your space like? What are you worried about?"
          className={inputClass(errors.message)} style={{ ...style, resize: 'vertical' }} />
        {errors.message && <p id="nfp-message-error" className="text-red-700 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-teal text-near-black font-black uppercase tracking-widest px-8 py-4 transition-all duration-200 hover:bg-dark-teal disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] inline-flex items-center gap-2"
        style={{ fontSize: '0.72rem', letterSpacing: '0.15em' }}
      >
        {submitting ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />Sending…</>
        ) : 'Submit Application →'}
      </button>

      <p className="text-charcoal text-xs leading-relaxed">
        Your information is handled under the Australian Privacy Act 1988 and never shared with third parties.
        We may contact you to confirm eligibility before proceeding.
      </p>
    </form>
  )
}
