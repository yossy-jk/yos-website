'use client'

import { useState, useEffect } from 'react'

interface GateScreenProps {
  onComplete: (firstName: string, email: string) => void
}

export default function GateScreen({ onComplete }: GateScreenProps) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const canSubmit = firstName.trim().length > 0 && email.trim().length > 0 && email.includes('@')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)

    const payload = { firstName: firstName.trim(), email: email.trim() }

    // Persist to sessionStorage immediately
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('yos_planner_user', JSON.stringify(payload))
    }

    // Fire HubSpot contact in background — non-blocking
    fetch('/api/space-planner-gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => { /* non-fatal */ })

    // Small delay so the button feels responsive, not instant
    await new Promise((r) => setTimeout(r, 400))

    setLoading(false)
    onComplete(payload.firstName, payload.email)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#1A1A1A',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'transform 0.4s ease',
        }}
      >
        {/* Logo / wordmark */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontFamily: 'Montserrat, sans-serif',
              color: '#00B5A5',
            }}
          >
            Space Planner
          </span>
          <span
            style={{
              display: 'inline-block',
              marginLeft: '0.5rem',
              fontSize: '0.65rem',
              color: '#6B6B6B',
              fontFamily: 'Montserrat, sans-serif',
              verticalAlign: 'middle',
            }}
          >
            by YOS
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: '1.55rem',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            color: '#F7F6F4',
            fontFamily: 'Montserrat, sans-serif',
            marginBottom: '0.65rem',
            textAlign: 'center',
          }}
        >
          Plan your space.
          <br />
          We&apos;ll handle the rest.
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: '0.82rem',
            color: 'rgba(247,246,244,0.55)',
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: 1.65,
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Drop your name and email — just in case we lose
          <br />
          connection while you&apos;re building.
        </p>

        {/* Form card */}
        <div
          style={{
            background: '#222',
            border: '1px solid #2a2a2a',
            borderRadius: '14px',
            padding: '1.5rem',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* First name */}
            <div>
              <label
                htmlFor="gate-firstname"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#9B9B9B',
                  fontFamily: 'Montserrat, sans-serif',
                  marginBottom: '0.3rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                First name
              </label>
              <input
                id="gate-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Joe"
                required
                autoFocus
                autoComplete="given-name"
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.9rem',
                  color: '#F7F6F4',
                  fontFamily: 'Montserrat, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#00B5A5' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#333' }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="gate-email"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#9B9B9B',
                  fontFamily: 'Montserrat, sans-serif',
                  marginBottom: '0.3rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Email
              </label>
              <input
                id="gate-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joe@example.com"
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.9rem',
                  color: '#F7F6F4',
                  fontFamily: 'Montserrat, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#00B5A5' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#333' }}
              />
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{
                marginTop: '0.25rem',
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                background: canSubmit && !loading ? '#00B5A5' : '#2a2a2a',
                color: canSubmit && !loading ? '#FFFFFF' : '#555',
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.01em',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {loading ? 'Starting…' : 'Start Planning →'}
            </button>
          </form>
        </div>

        {/* Fine print */}
        <p
          style={{
            marginTop: '1rem',
            fontSize: '0.68rem',
            color: 'rgba(247,246,244,0.25)',
            fontFamily: 'Montserrat, sans-serif',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          No spam. We&apos;ll only contact you if you ask us to.
        </p>
      </div>
    </div>
  )
}
