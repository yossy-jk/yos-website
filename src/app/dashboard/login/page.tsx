'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('jk@yourofficespace.au')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function requestCode() {
    if (!email.trim()) return
    setError(null)
    setNotice(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth-v2/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await response.json().catch(() => ({})) as { error?: string; message?: string }
      if (!response.ok) throw new Error(result.error || 'Unable to send a sign-in code.')

      setCodeSent(true)
      setNotice(result.message || 'A six-digit code has been sent to your email.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send a sign-in code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!codeSent) {
      await requestCode()
      return
    }

    setError(null)
    setNotice(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth-v2/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      })
      const result = await response.json().catch(() => ({})) as { error?: string; go_to_email?: boolean }
      if (!response.ok) {
        if (result.go_to_email) {
          setCodeSent(false)
          setCode('')
        }
        throw new Error(result.error || 'Sign-in failed.')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign-in failed.')
      setLoading(false)
    }
  }

  const canSubmit = codeSent
    ? code.replace(/\s/g, '').length === 6 && password.length > 0
    : email.trim().length > 0

  return (
    <main id="main-content" tabIndex={-1} style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: 'rgba(0,181,165,0.06)', border: '1px solid rgba(0,181,165,0.2)', padding: '2.5rem', borderRadius: 8, width: '100%', maxWidth: 390 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>YOS Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Your Office Space — Agent Command Centre</p>

        <label htmlFor="dashboard-email" style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Authorised email</label>
        <input
          id="dashboard-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setCodeSent(false)
            setCode('')
          }}
          disabled={loading}
          required
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: 'white', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}
        />

        {codeSent && (
          <>
            <label htmlFor="dashboard-code" style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Six-digit email code</label>
            <input
              id="dashboard-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading}
              required
              maxLength={6}
              autoFocus
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: 'white', fontSize: '1rem', letterSpacing: '0.3em', marginBottom: '1rem', boxSizing: 'border-box' }}
            />

            <label htmlFor="dashboard-password" style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Password</label>
            <input
              id="dashboard-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: 'white', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}
            />
          </>
        )}

        {notice && <div role="status" style={{ color: '#63ded2', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>{notice}</div>}
        {error && <div role="alert" style={{ color: '#ff8a8a', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{error}</div>}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          style={{ width: '100%', padding: '0.75rem', background: loading || !canSubmit ? 'rgba(0,181,165,0.3)' : '#00B5A5', border: 'none', borderRadius: 4, color: 'white', fontSize: '1rem', fontWeight: 500, cursor: loading || !canSubmit ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Please wait…' : codeSent ? 'Sign in securely' : 'Email me a sign-in code'}
        </button>

        {codeSent && (
          <button
            type="button"
            onClick={requestCode}
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            Send a new code
          </button>
        )}
      </form>
    </main>
  )
}
