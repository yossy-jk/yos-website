'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

const LEASE_TYPE_OPTIONS = [
  { value: 'lease-review', label: 'Lease Review — I\'m already in a lease and want it reviewed' },
  { value: 'relocation', label: 'Relocation Search — I\'m looking for a new space' },
]

const SITUATION_OPTIONS = [
  { value: 'in-lease', label: 'Currently in a commercial lease' },
  { value: 'about-to-sign', label: 'About to sign a new lease' },
  { value: 'lease-expiry-soon', label: 'Lease expiring soon — need to act' },
  { value: 'actively-searching', label: 'Actively searching for space' },
  { value: 'early-stage', label: 'Early stage — exploring options' },
]

export default function NotForProfitForm() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const leaseTypeLabel = LEASE_TYPE_OPTIONS.find(o => o.value === fields.leaseType)?.label || fields.leaseType
    const situationLabel = SITUATION_OPTIONS.find(o => o.value === fields.situation)?.label || fields.situation

    await Promise.allSettled([
      // Email delivery via FormSubmit
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          company: fields.organisation,
          email: fields.email,
          phone: fields.phone || '',
          message: fields.message,
          source: 'Not-for-Profit Support',
          _honey: honey,
        }),
      }),
      // HubSpot CRM
      submitLead({
        firstname: fields.name.split(' ')[0],
        email: fields.email,
        source: 'Not-for-Profit Support',
        context: [
          `Organisation: ${fields.organisation}`,
          `ABN: ${fields.abn || '—'}`,
          `Phone: ${fields.phone || '—'}`,
          `What they need: ${leaseTypeLabel}`,
          `Current situation: ${situationLabel}`,
          `Message: ${fields.message}`,
        ].join('\n'),
      }),
    ])

    setSubmitting(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-teal/5 border border-teal/20 rounded-sm p-10 text-center">
        <p className="text-teal font-black text-xl mb-3">Application received.</p>
        <p className="text-charcoal font-light text-sm leading-relaxed">
          We&apos;ll be in touch within one business day to confirm your eligibility and book a time to chat.
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

  const style = { padding: '0.85rem 1rem', fontSize: '0.95rem' }
  const labelClass = 'block text-near-black font-semibold mb-2'
  const labelStyle = { fontSize: '0.78rem', letterSpacing: '0.05em' }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot */}
      <input type="text" name="_honey" value={honey} onChange={e => setHoney(e.target.value)}
        style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div>
        <label className={labelClass} style={labelStyle}>Your name <span className="text-teal">*</span></label>
        <input type="text" value={fields.name} onChange={e => set('name')(e.target.value)}
          placeholder="Jane Smith" autoComplete="name"
          className={inputClass(errors.name)} style={style} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Organisation name <span className="text-teal">*</span></label>
        <input type="text" value={fields.organisation} onChange={e => set('organisation')(e.target.value)}
          placeholder="Newcastle Community Support Inc." autoComplete="organization"
          className={inputClass(errors.organisation)} style={style} />
        {errors.organisation && <p className="text-red-500 text-xs mt-1">{errors.organisation}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Email <span className="text-teal">*</span></label>
          <input type="email" value={fields.email} onChange={e => set('email')(e.target.value)}
            placeholder="jane@organisation.org.au" autoComplete="email"
            className={inputClass(errors.email)} style={style} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Phone</label>
          <input type="tel" value={fields.phone} onChange={e => set('phone')(e.target.value)}
            placeholder="0411 222 333" autoComplete="tel"
            className={inputClass()} style={style} />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>ABN <span className="text-gray-400 font-normal">(optional)</span></label>
        <input type="text" value={fields.abn} onChange={e => set('abn')(e.target.value)}
          placeholder="12 345 678 901"
          className={inputClass()} style={style} />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>What do you need? <span className="text-teal">*</span></label>
        <select value={fields.leaseType} onChange={e => set('leaseType')(e.target.value)}
          className={[inputClass(errors.leaseType), 'cursor-pointer'].join(' ')} style={style}>
          <option value="" disabled>Select…</option>
          {LEASE_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="text-near-black">{o.label}</option>
          ))}
        </select>
        {errors.leaseType && <p className="text-red-500 text-xs mt-1">{errors.leaseType}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>What&apos;s your current situation? <span className="text-teal">*</span></label>
        <select value={fields.situation} onChange={e => set('situation')(e.target.value)}
          className={[inputClass(errors.situation), 'cursor-pointer'].join(' ')} style={style}>
          <option value="" disabled>Select…</option>
          {SITUATION_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="text-near-black">{o.label}</option>
          ))}
        </select>
        {errors.situation && <p className="text-red-500 text-xs mt-1">{errors.situation}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Tell us about your situation <span className="text-teal">*</span></label>
        <textarea value={fields.message} onChange={e => set('message')(e.target.value)}
          rows={4}
          placeholder="Where are you located? What's your space like? What are you worried about?"
          className={inputClass(errors.message)} style={{ ...style, resize: 'vertical' }} />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-teal text-white font-black uppercase tracking-widest px-8 py-4 transition-all duration-200 hover:bg-dark-teal disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] inline-flex items-center gap-2"
        style={{ fontSize: '0.72rem', letterSpacing: '0.15em' }}
      >
        {submitting ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
        ) : 'Submit Application →'}
      </button>

      <p className="text-gray-400 text-xs leading-relaxed">
        Your information is handled under the Australian Privacy Act 1988 and never shared with third parties.
        We may contact you to confirm eligibility before proceeding.
      </p>
    </form>
  )
}