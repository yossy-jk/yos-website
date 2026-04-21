'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

interface ToolGateProps {
  tool: string
  teaser: React.ReactNode
  children: React.ReactNode
  context?: () => string
  heading?: string
  subheading?: string
  onUnlock?: (name: string, email: string) => void
  dark?: boolean  // true = dark background page (default), false = light
}

export default function ToolGate({
  tool,
  teaser,
  children,
  context,
  heading = 'Where should we send your results?',
  subheading = 'Enter your details — we\'ll email you a full branded report instantly.',
  onUnlock,
  dark = true,
}: ToolGateProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)

  const storageKey = `yos_tool_unlocked_${tool.toLowerCase().replace(/\s+/g, '_')}`
  if (typeof window !== 'undefined' && !unlocked) {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'true') return <>{children}</>
  }

  if (unlocked) return <>{children}</>

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter your first name'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    submitLead({
      firstname: name.trim().split(' ')[0],
      email: email.trim(),
      source: tool,
      context: context?.(),
    }).catch(() => {})

    onUnlock?.(name.trim(), email.trim())

    try { localStorage.setItem(storageKey, 'true') } catch {}

    setLoading(false)
    setUnlocked(true)
  }

  const fadeColor = dark ? 'rgba(10,10,10,1)' : 'rgba(255,255,255,1)'
  const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'white'
  const cardBorder = dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E7EB'
  const headingColor = dark ? 'white' : '#0A0A0A'
  const subColor = dark ? 'rgba(255,255,255,0.45)' : '#6B7280'
  const labelColor = dark ? 'rgba(255,255,255,0.6)' : '#374151'
  const inputBg = dark ? 'rgba(255,255,255,0.06)' : 'white'
  const inputText = dark ? 'white' : '#111827'
  const inputBorder = dark ? 'rgba(255,255,255,0.15)' : '#E5E7EB'
  const inputFocus = '#00B5A5'
  const noteColor = dark ? 'rgba(255,255,255,0.2)' : '#9CA3AF'

  return (
    <div style={{ position: 'relative' }}>

      {/* Teaser — fades out at bottom */}
      <div style={{ position: 'relative', overflow: 'hidden', maxHeight: '22rem', marginBottom: '0' }}>
        <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {teaser}
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '10rem',
          background: `linear-gradient(to bottom, transparent, ${fadeColor})`
        }} />
      </div>

      {/* Gate card */}
      <div style={{
        background: cardBg,
        border: cardBorder,
        borderRadius: '1rem',
        padding: 'clamp(2rem,4vw,3rem)',
        marginTop: '2rem',
      }}>
        {/* Teal accent bar */}
        <div style={{ width: '2.5rem', height: '3px', background: '#00B5A5', borderRadius: '2px', marginBottom: '1.75rem' }} />

        <h3 style={{ color: headingColor, fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.15, marginBottom: '0.875rem' }}>
          {heading}
        </h3>
        <p style={{ color: subColor, fontSize: '0.9rem', lineHeight: 1.75, fontWeight: 300, marginBottom: '2.5rem', maxWidth: '36rem' }}>
          {subheading}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* First name */}
            <div>
              <label style={{ display: 'block', color: labelColor, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                First name <span style={{ color: '#00B5A5' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                placeholder="Joe"
                autoComplete="given-name"
                style={{
                  display: 'block', width: '100%',
                  background: inputBg, color: inputText,
                  border: `1px solid ${errors.name ? '#ef4444' : inputBorder}`,
                  borderRadius: '0.625rem', outline: 'none',
                  padding: '0.9rem 1.1rem', fontSize: '0.95rem', fontWeight: 300,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = inputFocus}
                onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : inputBorder}
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' }}>{errors.name}</p>}
            </div>

            {/* Work email */}
            <div>
              <label style={{ display: 'block', color: labelColor, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Work email <span style={{ color: '#00B5A5' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                placeholder="joe@company.com.au"
                autoComplete="email"
                style={{
                  display: 'block', width: '100%',
                  background: inputBg, color: inputText,
                  border: `1px solid ${errors.email ? '#ef4444' : inputBorder}`,
                  borderRadius: '0.625rem', outline: 'none',
                  padding: '0.9rem 1.1rem', fontSize: '0.95rem', fontWeight: 300,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = inputFocus}
                onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : inputBorder}
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' }}>{errors.email}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: loading ? 'rgba(0,181,165,0.5)' : '#00B5A5',
              color: 'white', fontWeight: 800, fontSize: '0.72rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '1.1rem 3rem', borderRadius: '0.5rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              minHeight: '52px', transition: 'background 0.15s',
            }}
          >
            {loading
              ? <><span style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Sending…</>
              : 'Get Full Results →'
            }
          </button>

          <p style={{ color: noteColor, fontSize: '0.72rem', marginTop: '1.25rem', lineHeight: 1.6 }}>
            No spam. No pitch. We use this to send your results and follow up only if it&apos;s relevant.
          </p>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
