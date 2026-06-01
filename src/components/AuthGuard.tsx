'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    fetch('/api/auth-v2/session')
      .then(r => r.ok ? r.json() : null)
      .then(session => {
        if (!session) {
          router.push('/dashboard/login')
        } else {
          setAuthorized(true)
        }
      })
      .catch(() => {
        router.push('/dashboard/login')
      })
  }, [router])

  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Loading…</p>
      </div>
    )
  }

  return <>{children}</>
}
