'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        if (res.status === 429) {
          setError(data.error || 'Too many attempts. Wait 15 minutes.')
        } else {
          setError(data.error || 'Incorrect password')
        }
        setLoading(false)
      }
    } catch {
      setError('Network error. Try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(0,181,165,0.06)',
        border: '1px solid rgba(0,181,165,0.2)',
        padding: '2.5rem',
        borderRadius: 8,
        width: '100%',
        maxWidth: 360,
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          YOS Dashboard
        </h1>
        <label htmlFor="password" style={{
          display: 'block',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '0.5rem',
        }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 4,
            color: 'white',
            fontSize: '1rem',
            marginBottom: '1rem',
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <div style={{
            color: '#ff6b6b',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: loading || !password ? 'rgba(0,181,165,0.3)' : '#00B5A5',
            border: 'none',
            borderRadius: 4,
            color: 'white',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: loading || !password ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
