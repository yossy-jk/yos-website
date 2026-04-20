'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

/**
 * Contact form — sends to FormSubmit (email delivery) + HubSpot CRM (deal creation).
 * Both run in parallel; neither blocks the other.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fields, setFields] = useState({
    name: '', company: '', email: '', phone: '', message: '',
  })
  const [errors, setErrors] = useState<Partial<typeof fields>>({})

  const set = (k: keyof typeof fields) => (v: string) => {
    setFields(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<typeof fields> = {}
    if (!fields.name.trim()) e.name = 'Required'
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Valid email required'
    if (!fields.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    // Run email + HubSpot in parallel
    await Promise.allSettled([
      // Email delivery via server-side API route
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          company: fields.company || '',
          email: fields.email,
          phone: fields.phone || '',
          message: fields.message,
          source: 'Contact Form',
        }),
      }),
      // HubSpot CRM — contact + deal
      submitLead({
        firstname: fields.name.split(' ')[0],
        email: fields.email,
        source: 'Contact Form',
        context: `Company: ${fields.company || '—'}\nPhone: ${fields.phone || '—'}\nMessage: ${fields.message}`,
      }),
    ])

    setSubmitting(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-teal/5 border border-teal/20 rounded-xl p-8 text-center">
        <p className="text-teal font-black text-lg mb-2">Message received.</p>
        <p className="text-charcoal font-light text-sm">We&apos;ll come back to you within one business day.</p>
      </div>
    )
  }

  const inputClass = (err?: string) => [
    'w-full border outline-none transition-colors font-light',
    'focus:border-teal',
    err ? 'border-red-400' : 'border-gray-200 hover:border-gray-300',
  ].join(' ')
  const style = { padding: '0.85rem 1rem', fontSize: '0.95rem' }
  const labelClass = 'block text-near-black font-semibold mb-2'
  const labelStyle = { fontSize: '0.78rem', letterSpacing: '0.05em' }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Your name <span className="text-teal">*</span></label>
          <input type="text" value={fields.name} onChange={e => set('name')(e.target.value)}
            placeholder="Jane Smith" autoComplete="name"
            className={inputClass(errors.name)} style={style} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Business name</label>
          <input type="text" value={fields.company} onChange={e => set('company')(e.target.value)}
            placeholder="Acme Pty Ltd" autoComplete="organization"
            className={inputClass()} style={style} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Email <span className="text-teal">*</span></label>
          <input type="email" value={fields.email} onChange={e => set('email')(e.target.value)}
            placeholder="jane@company.com.au" autoComplete="email"
            className={inputClass(errors.email)} style={style} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Phone</label>
          <input type="tel" value={fields.phone} onChange={e => set('phone')(e.target.value)}
            placeholder="0400 000 000" autoComplete="tel"
            className={inputClass()} style={style} />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>How can we help? <span className="text-teal">*</span></label>
        <textarea value={fields.message} onChange={e => set('message')(e.target.value)}
          rows={4} placeholder="Tell us what you&apos;re working on..."
          className={inputClass(errors.message)} style={{ ...style, resize: 'vertical' as const }} />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-teal text-white font-black text-sm tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-dark-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] inline-flex items-center gap-2"
      >
        {submitting ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
        ) : 'Send Message →'}
      </button>

      <p className="text-gray-400 text-xs">
        Your information is handled under the Australian Privacy Act 1988 and never shared.
      </p>
    </form>
  )
}
