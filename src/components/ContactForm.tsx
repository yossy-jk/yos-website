'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

const SERVICES = [
  'Leasing',
  'Buying',
  'FitOut',
  'Furniture',
  'Cleaning',
  'Not sure',
] as const

type Service = typeof SERVICES[number]
type ContactFields = {
  name: string
  company: string
  email: string
  phone: string
  service: Service | ''
  message: string
}
type ContactErrors = Partial<Record<keyof ContactFields, string>>

const SERVICE_ALIASES: Record<string, Service> = {
  lease: 'Leasing',
  leasing: 'Leasing',
  'tenant-representation': 'Leasing',
  buy: 'Buying',
  buying: 'Buying',
  'buyers-agency': 'Buying',
  fitout: 'FitOut',
  'fit-out': 'FitOut',
  furniture: 'Furniture',
  cleaning: 'Cleaning',
  unsure: 'Not sure',
  'not-sure': 'Not sure',
}

function resolveService(requested?: string): Service | '' {
  const normalised = requested?.trim().toLowerCase()
  if (!normalised) return ''
  return SERVICE_ALIASES[normalised] ?? SERVICES.find(item => item.toLowerCase() === normalised) ?? ''
}

/**
 * Contact form. sends to FormSubmit (email delivery) + HubSpot CRM (deal creation).
 * Both run in parallel; neither blocks the other.
 */
export default function ContactForm({ initialService }: { initialService?: string }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [honey, setHoney] = useState('')
  const [fields, setFields] = useState<ContactFields>({
    name: '', company: '', email: '', phone: '', service: resolveService(initialService), message: '',
  })
  const [errors, setErrors] = useState<ContactErrors>({})

  const set = <K extends keyof typeof fields>(k: K) => (v: (typeof fields)[K]) => {
    setFields(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e: ContactErrors = {}
    if (!fields.name.trim()) e.name = 'Required'
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Valid email required'
    if (!fields.service) e.service = 'Choose the service you need'
    setErrors(e)
    const valid = Object.keys(e).length === 0
    if (!valid) {
      const firstInvalid = (['name', 'email', 'service'] as const).find(key => e[key])
      window.requestAnimationFrame(() => {
        if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus()
      })
    }
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    // Run email + HubSpot in parallel. Only show success when at least one
    // delivery channel confirms that it accepted the enquiry.
    const [emailResult, hubspotResult] = await Promise.allSettled([
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
          source: `Contact Form — ${fields.service}`,
          _honey: honey,
        }),
      }),
      // HubSpot CRM. contact + deal
      submitLead({
        firstname: fields.name.split(' ')[0],
        email: fields.email,
        source: `Contact Form — ${fields.service}`,
        context: `Service: ${fields.service}\nCompany: ${fields.company || '-'}\nPhone: ${fields.phone || '-'}\nMessage: ${fields.message || '-'}`,
      }),
    ])

    setSubmitting(false)
    const emailAccepted = emailResult.status === 'fulfilled' && emailResult.value.ok
    const hubspotAccepted = hubspotResult.status === 'fulfilled' && hubspotResult.value.ok
    if (emailAccepted || hubspotAccepted) {
      setSent(true)
    } else {
      setSubmitError('We could not confirm delivery. Please try again or call 0434 655 511.')
    }
  }

  if (sent) {
    return (
      <div className="bg-teal/5 border border-teal/20 rounded-sm p-8 text-center">
        <p className="text-teal font-black text-lg mb-2">Message received.</p>
        <p className="text-charcoal font-light text-sm">Joe or the relevant service lead will reply within one business day.</p>
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
      {/* Honeypot. hidden from real users, filled by bots */}
      <input type="text" name="_honey" value={honey} onChange={e => setHoney(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className={labelClass} style={labelStyle}>Your name <span className="text-teal">*</span></label>
          <input id="contact-name" name="name" type="text" value={fields.name} onChange={e => set('name')(e.target.value)}
            placeholder="Jane Smith" autoComplete="name"
            required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={inputClass(errors.name)} style={style} />
          {errors.name && <p id="contact-name-error" role="alert" className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass} style={labelStyle}>Business name</label>
          <input id="contact-company" name="company" type="text" value={fields.company} onChange={e => set('company')(e.target.value)}
            placeholder="Acme Pty Ltd" autoComplete="organization"
            className={inputClass()} style={style} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className={labelClass} style={labelStyle}>Email <span className="text-teal">*</span></label>
          <input id="contact-email" name="email" type="email" value={fields.email} onChange={e => set('email')(e.target.value)}
            placeholder="jane@company.com.au" autoComplete="email"
            required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={inputClass(errors.email)} style={style} />
          {errors.email && <p id="contact-email-error" role="alert" className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass} style={labelStyle}>Phone</label>
          <input id="contact-phone" name="phone" type="tel" value={fields.phone} onChange={e => set('phone')(e.target.value)}
            placeholder="0400 000 000" autoComplete="tel"
            className={inputClass()} style={style} />
        </div>
      </div>

      <div>
        <fieldset id="contact-service" tabIndex={-1} aria-describedby={errors.service ? 'contact-service-error' : undefined} className="outline-none">
          <legend className={labelClass} style={labelStyle}>What do you need? <span className="text-teal">*</span></legend>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map(service => {
              const selected = fields.service === service
              return (
                <button key={service} type="button" aria-pressed={selected}
                  onClick={() => set('service')(service)}
                  className={`min-h-[44px] rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${selected ? 'border-near-black bg-near-black text-white' : 'border-gray-300 bg-white text-near-black hover:border-teal'}`}>
                  {service}
                </button>
              )
            })}
          </div>
          <input type="hidden" name="service" value={fields.service} />
          {errors.service && <p id="contact-service-error" role="alert" className="text-red-500 text-xs mt-1">{errors.service}</p>}
        </fieldset>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass} style={labelStyle}>Anything else we should know? <span className="text-readable-grey font-normal">(optional)</span></label>
        <textarea id="contact-message" name="message" value={fields.message} onChange={e => set('message')(e.target.value)}
          rows={4} placeholder="Tell us what you&apos;re working on..."
          aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={inputClass()} style={{ ...style, resize: 'vertical' as const }} />
        {errors.message && <p id="contact-message-error" role="alert" className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {submitError && <p role="alert" className="text-red-600 text-sm font-semibold">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-teal text-white font-black text-sm tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-dark-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] inline-flex items-center gap-2"
      >
        {submitting ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />Sending…</>
        ) : 'Send Message →'}
      </button>

      <p className="text-readable-grey text-xs">
        Your information is handled under the Australian Privacy Act 1988 and never shared.
      </p>
    </form>
  )
}
