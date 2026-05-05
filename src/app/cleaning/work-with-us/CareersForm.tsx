'use client'
import { useState } from 'react'

type AppType = 'employee' | 'contractor'

const INPUT = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'white',
  fontSize: '0.9rem',
  padding: '0.875rem 1rem',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box' as const,
  outline: 'none',
}

const LABEL = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '0.5rem',
}

const SECTION_HEAD = {
  color: '#00B5A5',
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.25em',
  textTransform: 'uppercase' as const,
  marginBottom: '1.25rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid rgba(0,181,165,0.2)',
}

const EXPERIENCE_OPTIONS = [
  { value: 'office',      label: 'Commercial offices' },
  { value: 'medical',     label: 'Medical / allied health' },
  { value: 'childcare',   label: 'Childcare / education' },
  { value: 'industrial',  label: 'Industrial / warehouse' },
  { value: 'retail',      label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality / food service' },
]

const AVAILABILITY_OPTIONS = [
  { value: 'weekday-early',   label: 'Weekday early mornings (before 7am)' },
  { value: 'weekday-day',     label: 'Weekday daytime' },
  { value: 'weekday-evening', label: 'Weekday evenings' },
  { value: 'weekends',        label: 'Weekends' },
  { value: 'flexible',        label: 'Flexible — available anytime' },
]

export default function CareersForm() {
  const [appType, setAppType] = useState<AppType>('employee')
  const [experience, setExperience] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', email: '', phone: '', suburb: '', yearsExp: '', message: '', howHeard: '',
    // Contractor
    abn: '', businessName: '',
    plInsurer: '', plPolicyNumber: '', plExpiry: '', plAmount: '',
    wcInsurer: '', wcPolicyNumber: '', wcExpiry: '',
    policeCheck: '',
  })

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const toggleExp = (val: string) =>
    setExperience(e => e.includes(val) ? e.filter(v => v !== val) : [...e, val])

  const toggleAvail = (val: string) =>
    setAvailability(a => a.includes(val) ? a.filter(v => v !== val) : [...a, val])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in your name, email and phone.')
      return
    }
    if (appType === 'contractor' && (!form.abn || !form.plInsurer || !form.plExpiry)) {
      setError('Contractors must provide ABN and public liability insurance details.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/cleaning-careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: appType,
          experience: experience.join(', '),
          availability: availability.join(', '),
          _honey: '',
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ background: 'rgba(0,181,165,0.08)', border: '1px solid rgba(0,181,165,0.25)', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: '#00B5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem' }}>✓</div>
        <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>We&apos;ve got your application.</h3>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
          Sarah will be in touch within 2 business days. If you have any questions in the meantime, call or text <a href="tel:0411311745" style={{ color: '#00B5A5' }}>0411 311 745</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Application type selector ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>I am applying as a</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {(['employee', 'contractor'] as AppType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setAppType(t)}
              style={{
                padding: '1rem',
                border: appType === t ? `2px solid ${t === 'contractor' ? '#a78bfa' : '#00B5A5'}` : '1px solid rgba(255,255,255,0.12)',
                background: appType === t
                  ? (t === 'contractor' ? 'rgba(124,58,237,0.1)' : 'rgba(0,181,165,0.08)')
                  : 'rgba(255,255,255,0.02)',
                color: appType === t
                  ? (t === 'contractor' ? '#a78bfa' : '#00B5A5')
                  : 'rgba(255,255,255,0.45)',
                fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {t === 'employee' ? '👔 Employee' : '🔧 Contractor'}
            </button>
          ))}
        </div>
        {appType === 'contractor' && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Contractors must hold current public liability insurance (min. $10M) and workers compensation or personal accident cover.
          </p>
        )}
      </div>

      {/* ── Personal details ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Your details</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={LABEL}>Full name <span style={{ color: '#ef4444' }}>*</span></label>
            <input style={INPUT} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={LABEL}>Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={INPUT} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@email.com" required />
            </div>
            <div>
              <label style={LABEL}>Mobile <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={INPUT} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="04XX XXX XXX" required />
            </div>
          </div>
          <div>
            <label style={LABEL}>Suburb / area</label>
            <input style={INPUT} value={form.suburb} onChange={e => set('suburb', e.target.value)} placeholder="e.g. Broadmeadow, Maitland, Lake Macquarie" />
          </div>
        </div>
      </div>

      {/* ── Experience ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Experience</p>
        <div style={{ marginBottom: '1rem' }}>
          <label style={LABEL}>Types of cleaning (select all that apply)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {EXPERIENCE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleExp(opt.value)}
                style={{
                  padding: '0.65rem 0.875rem',
                  border: experience.includes(opt.value) ? '1px solid rgba(0,181,165,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  background: experience.includes(opt.value) ? 'rgba(0,181,165,0.1)' : 'rgba(255,255,255,0.02)',
                  color: experience.includes(opt.value) ? '#00B5A5' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', transition: 'all 0.1s',
                }}
              >
                {experience.includes(opt.value) ? '✓ ' : ''}{opt.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={LABEL}>Years of experience</label>
            <select style={INPUT} value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}>
              <option value="">Select...</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1–2 years">1–2 years</option>
              <option value="3–5 years">3–5 years</option>
              <option value="5–10 years">5–10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Availability ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Availability</p>
        <label style={LABEL}>When can you work? (select all that apply)</label>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {AVAILABILITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleAvail(opt.value)}
              style={{
                padding: '0.65rem 1rem',
                border: availability.includes(opt.value) ? '1px solid rgba(0,181,165,0.5)' : '1px solid rgba(255,255,255,0.1)',
                background: availability.includes(opt.value) ? 'rgba(0,181,165,0.08)' : 'rgba(255,255,255,0.02)',
                color: availability.includes(opt.value) ? '#00B5A5' : 'rgba(255,255,255,0.5)',
                fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left', transition: 'all 0.1s',
              }}
            >
              {availability.includes(opt.value) ? '✓  ' : '   '}{opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contractor section ── */}
      {appType === 'contractor' && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ ...SECTION_HEAD, color: '#a78bfa', borderBottomColor: 'rgba(124,58,237,0.25)' }}>
            Contractor details
          </p>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={LABEL}>ABN <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={INPUT} value={form.abn} onChange={e => set('abn', e.target.value)} placeholder="XX XXX XXX XXX" required />
              </div>
              <div>
                <label style={LABEL}>Business / trading name</label>
                <input style={INPUT} value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Smith Cleaning Services" />
              </div>
            </div>
          </div>

          {/* Public Liability Insurance */}
          <div style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ color: '#a78bfa', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Public Liability Insurance <span style={{ color: '#ef4444' }}>*</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={LABEL}>Insurer</label>
                <input style={INPUT} value={form.plInsurer} onChange={e => set('plInsurer', e.target.value)} placeholder="e.g. QBE, Allianz" required />
              </div>
              <div>
                <label style={LABEL}>Policy number</label>
                <input style={INPUT} value={form.plPolicyNumber} onChange={e => set('plPolicyNumber', e.target.value)} placeholder="POL-XXXXXXX" />
              </div>
              <div>
                <label style={LABEL}>Expiry date <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={{ ...INPUT, colorScheme: 'dark' }} type="date" value={form.plExpiry} onChange={e => set('plExpiry', e.target.value)} required />
              </div>
              <div>
                <label style={LABEL}>Cover amount</label>
                <select style={INPUT} value={form.plAmount} onChange={e => set('plAmount', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="$5M">$5 million</option>
                  <option value="$10M">$10 million</option>
                  <option value="$20M">$20 million</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workers Compensation */}
          <div style={{ background: 'rgba(124,58,237,0.03)', border: '1px solid rgba(124,58,237,0.1)', padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ color: '#a78bfa', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Workers Compensation / Personal Accident Insurance
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              If you employ staff: workers compensation is required. If you operate as a sole trader, personal accident / income protection is strongly recommended.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={LABEL}>Insurer</label>
                <input style={INPUT} value={form.wcInsurer} onChange={e => set('wcInsurer', e.target.value)} placeholder="e.g. iCare, Allianz" />
              </div>
              <div>
                <label style={LABEL}>Policy number</label>
                <input style={INPUT} value={form.wcPolicyNumber} onChange={e => set('wcPolicyNumber', e.target.value)} placeholder="POL-XXXXXXX" />
              </div>
              <div>
                <label style={LABEL}>Expiry date</label>
                <input style={{ ...INPUT, colorScheme: 'dark' }} type="date" value={form.wcExpiry} onChange={e => set('wcExpiry', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Police check */}
          <div>
            <label style={LABEL}>Police check</label>
            <select style={INPUT} value={form.policeCheck} onChange={e => set('policeCheck', e.target.value)}>
              <option value="">Select...</option>
              <option value="Yes — within 12 months">Yes — within the last 12 months</option>
              <option value="Yes — over 12 months ago">Yes — more than 12 months ago</option>
              <option value="No — willing to obtain">No — willing to obtain one</option>
              <option value="No">No</option>
            </select>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginTop: '0.4rem' }}>
              A current police check may be required for some sites (medical, childcare).
            </p>
          </div>
        </div>
      )}

      {/* ── Additional info ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Anything else</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={LABEL}>Anything you&apos;d like us to know</label>
            <textarea
              style={{ ...INPUT, minHeight: '100px', resize: 'vertical' }}
              value={form.message}
              onChange={e => set('message', e.target.value)}
              placeholder="Tell us about your situation, what you're looking for, any questions you have..."
            />
          </div>
          <div>
            <label style={LABEL}>How did you hear about us?</label>
            <select style={INPUT} value={form.howHeard} onChange={e => set('howHeard', e.target.value)}>
              <option value="">Select...</option>
              <option value="Google search">Google search</option>
              <option value="Facebook / Instagram">Facebook / Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Word of mouth">Word of mouth</option>
              <option value="Referred by a current team member">Referred by a current team member</option>
              <option value="Saw a YOS vehicle">Saw a YOS vehicle</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.875rem 1rem', marginBottom: '1rem' }}>
          <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0 }}>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? 'rgba(0,181,165,0.5)' : '#00B5A5',
          color: 'white', border: 'none',
          padding: '1rem 2.5rem',
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', width: '100%',
          transition: 'background 0.15s',
        }}
      >
        {submitting ? 'Submitting...' : 'Send my application →'}
      </button>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Sarah will be in touch within 2 business days. Your details are kept private and never shared.
      </p>
    </form>
  )
}
