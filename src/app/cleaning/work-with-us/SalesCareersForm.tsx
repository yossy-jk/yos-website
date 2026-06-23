'use client'
import { useState } from 'react'
import { CheckIcon } from '@/components/Icons'

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

const CHANNELS = [
  { value: 'existing-network',    label: 'Existing business relationships' },
  { value: 'cold-outreach',       label: 'Cold calling / door knocking' },
  { value: 'linkedin',           label: 'LinkedIn / social selling' },
  { value: 'referrals',          label: 'Referrals from other businesses' },
  { value: 'events',            label: 'Networking events' },
  { value: 'other',             label: 'Other' },
]

const INDUSTRIES = [
  { value: 'commercial-real-estate', label: 'Commercial real estate / property' },
  { value: 'facilities-management',  label: 'Facilities management' },
  { value: 'business-broker',       label: 'Business broker' },
  { value: 'interior-design',       label: 'Interior design / fitout' },
  { value: 'insurance',             label: 'Insurance / risk' },
  { value: 'finance',              label: 'Finance / accounting' },
  { value: 'other',                label: 'Other professional services' },
]

export default function SalesCareersForm() {
  const [channel, setChannel] = useState<string[]>([])
  const [industry, setIndustry] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    currentRole: '',
    yearsExp: '',
    commissionExpectation: '',
    sellingApproach: '',
    referralSource: '',
  })

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const toggle = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in your name, email and mobile.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/cleaning-careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _honey: '',
          type: 'sales-partner',
          channels: channel.join(', '),
          industries: industry.join(', '),
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
        <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Application received.</h3>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
          Joe will be in touch within 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Personal details ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Your details</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={LABEL}>Full name <span style={{ color: '#ef4444' }}>*</span></label>
            <input style={INPUT} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={LABEL}>Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={INPUT} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" required />
            </div>
            <div>
              <label style={LABEL}>Mobile <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={INPUT} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="04XX XXX XXX" required />
            </div>
          </div>
          <div>
            <label style={LABEL}>Suburb / area in Newcastle</label>
            <input style={INPUT} value={form.suburb} onChange={e => set('suburb', e.target.value)} placeholder="e.g. Hamilton, Merewether, Maitland" />
          </div>
        </div>
      </div>

      {/* ── Current situation ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Your situation</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={LABEL}>Current role or situation</label>
            <input style={INPUT} value={form.currentRole} onChange={e => set('currentRole', e.target.value)} placeholder="e.g. BDM at XYZ Property, self-employed, currently between roles" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={LABEL}>Years in sales / business development</label>
              <select style={INPUT} value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}>
                <option value="">Select...</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–2 years">1–2 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="5–10 years">5–10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
            <div>
              <label style={LABEL}>Commission expectation (annual)</label>
              <select style={INPUT} value={form.commissionExpectation} onChange={e => set('commissionExpectation', e.target.value)}>
                <option value="">Select...</option>
                <option value="Under $30k">Under $30,000</option>
                <option value="$30–50k">$30,000–$50,000</option>
                <option value="$50–80k">$50,000–$80,000</option>
                <option value="$80k+">$80,000+</option>
                <option value="Open">Open — let&apos;s talk</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Selling approach ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>How you sell</p>
        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {CHANNELS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(channel, setChannel, opt.value)}
              style={{
                padding: '0.65rem 1rem',
                border: channel.includes(opt.value) ? '1px solid rgba(0,181,165,0.5)' : '1px solid rgba(255,255,255,0.1)',
                background: channel.includes(opt.value) ? 'rgba(0,181,165,0.1)' : 'rgba(255,255,255,0.02)',
                color: channel.includes(opt.value) ? '#00B5A5' : 'rgba(255,255,255,0.5)',
                fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left', transition: 'all 0.1s',
              }}
            >
              {channel.includes(opt.value) ? ' OK ' : '   '}{opt.label}
            </button>
          ))}
        </div>
        <div>
          <label style={LABEL}>Describe your approach</label>
          <textarea
            style={{ ...INPUT, minHeight: '100px', resize: 'vertical' }}
            value={form.sellingApproach}
            onChange={e => set('sellingApproach', e.target.value)}
            placeholder="How do you currently find and engage potential clients? What does your typical week look like?"
          />
        </div>
      </div>

      {/* ── Background ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={SECTION_HEAD}>Your background</p>
        <div style={{ marginBottom: '1rem' }}>
          <label style={LABEL}>Industry background (select all that apply)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {INDUSTRIES.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(industry, setIndustry, opt.value)}
                style={{
                  padding: '0.65rem 0.875rem',
                  border: industry.includes(opt.value) ? '1px solid rgba(0,181,165,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  background: industry.includes(opt.value) ? 'rgba(0,181,165,0.1)' : 'rgba(255,255,255,0.02)',
                  color: industry.includes(opt.value) ? '#00B5A5' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', transition: 'all 0.1s',
                }}
              >
                {industry.includes(opt.value) ? ' OK ' : ''}{opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={LABEL}>How did you hear about this?</label>
          <select style={INPUT} value={form.referralSource} onChange={e => set('referralSource', e.target.value)}>
            <option value="">Select...</option>
            <option value="Google search">Google search</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Word of mouth">Word of mouth</option>
            <option value="Referred by someone">Referred by someone</option>
            <option value="Facebook / Instagram">Facebook / Instagram</option>
            <option value="Other">Other</option>
          </select>
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
        Joe will be in touch within 2 business days. Your details are kept private and never shared.
      </p>
    </form>
  )
}