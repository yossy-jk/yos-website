'use client'
import { useState, FormEvent, useEffect } from 'react'

type Step = 'email' | 'code'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  async function handleSendCode(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/auth-v2/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStep('code')
        setCountdown(300)
      } else {
        // Show the actual error — don't hide it from the user
        setError(data.error || 'Failed to send code. Try again.')
        setSending(false)
      }
    } catch {
      setError('Network error. Try again.')
      setSending(false)
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth-v2/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      })
      let data: { ok?: boolean; error?: string; code_required?: boolean } = {}
      try {
        data = await res.json()
      } catch {
        setError('Server returned an invalid response. Try again.')
        setLoading(false)
        return
      }

      if (res.ok && data.ok) {
        window.location.href = '/dashboard'
        return
      }

      const errMsg = data.error || ''

      // code_required means: code expired, was used, or too many wrong attempts
      // In all cases the user needs a fresh code — send one automatically,
      // but if that fails we surface the error clearly and let them re-enter email.
      if (data.code_required) {
        setCode('')
        setPassword('')
        setLoading(false)
        try {
          const freshRes = await fetch('/api/auth-v2/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          const freshData = await freshRes.json().catch(() => ({}))
          if (freshRes.ok && freshData.ok) {
            setError(errMsg || 'Session expired — a new code has been sent to your email.')
            setCountdown(300)
          } else {
            // Couldn't send a new code — send them back to email step
            setError(freshData.error || errMsg || 'Your session expired. Please start again.')
            setStep('email')
          }
        } catch {
          setError('Session expired. Please start again.')
          setStep('email')
        }
        return
      }

      // Wrong password or other non-code error — stay on code step, keep inputs
      setError(errMsg || 'Incorrect code or password. Please try again.')
      setCode('')
      setPassword('')
      setLoading(false)
    } catch {
      setError('Network error. Try again.')
      setLoading(false)
    }
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    color: 'white',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '2.5rem 2rem',
        maxWidth: 420, width: '100%',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, background: '#00B5A5', borderRadius: 10,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', fontWeight: 900, color: 'white', marginBottom: 12,
          }}>YOS</div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>YOS Dashboard</h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            {step === 'email'
              ? 'Enter your email to continue'
              : `Code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 8,
            padding: '0.65rem 0.85rem',
            marginBottom: '1.25rem',
            color: '#EF4444',
            fontSize: '0.78rem',
          }}>{error}</div>
        )}

        {/* Step 1 — Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required autoFocus autoComplete="email"
              style={{ ...inputBase, marginBottom: '1rem' }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{
                width: '100%', background: '#00B5A5', color: 'white',
                border: 'none', borderRadius: 8, padding: '0.85rem',
                fontSize: '0.9rem', fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? 'Sending...' : 'Send sign-in code'}
            </button>
          </form>
        )}

        {/* Step 2 — Code + Password */}
        {step === 'code' && (
          <form onSubmit={handleLogin}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Check your email — a 6-digit code has been sent.
            </p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              maxLength={6} required autoFocus
              inputMode="numeric" autoComplete="one-time-code"
              style={{
                ...inputBase, marginBottom: '0.75rem',
                fontSize: '1.1rem', fontFamily: 'monospace',
                letterSpacing: '0.25em', textAlign: 'center',
              }}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password" required autoComplete="current-password"
              style={{ ...inputBase, marginBottom: '1rem' }}
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              style={{
                width: '100%', background: '#00B5A5', color: 'white',
                border: 'none', borderRadius: 8, padding: '0.85rem',
                fontSize: '0.9rem', fontWeight: 600,
                cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: loading || code.length !== 6 ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              {countdown > 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                  Resend in {formatTime(countdown)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => { setStep('email'); setEmail(''); setCode(''); setPassword(''); setError(null); setCountdown(0); }}
                  style={{ background: 'none', border: 'none', color: '#00B5A5', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Use a different email
                </button>
              )}
            </div>
          </form>
        )}

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)' }}>
          YOS internal dashboard
        </p>
      </div>
    </div>
  )
}