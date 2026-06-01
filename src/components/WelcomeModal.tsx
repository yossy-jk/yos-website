'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SERVICES = [
  { label: 'Tenant Representation', href: '/tenant-rep' },
  { label: 'Commercial Furniture', href: '/furniture' },
  { label: 'Office Fit Out', href: '/office-fitout' },
  { label: 'Commercial Cleaning', href: '/cleaning' },
]

export default function WelcomeModal() {
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('welcome-modal-dismissed')) return
    const t = setTimeout(() => {
      sessionStorage.setItem('welcome-modal-dismissed', '1')
    }, 10000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => sessionStorage.setItem('welcome-modal-dismissed', '1')
  const navigate = (href: string) => { dismiss(); router.push(href) }

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(10,10,10,0.65)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal panel — dark background */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: '#0A0A0A',
          borderRadius: '1rem 1rem 0 0',
          padding: '1.5rem 1.5rem 2rem',
          animation: 'welcomeSlideUp 0.35s ease-out',
        }}
      >
        {/* Teal accent bar */}
        <div style={{
          width: '3rem', height: '4px',
          background: '#00B5A5', borderRadius: '99px',
          margin: '0 auto 1.25rem',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <p style={{
              color: '#00B5A5', fontWeight: 700,
              fontSize: '0.65rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', marginBottom: '0.25rem',
            }}>
              Your Office Space
            </p>
            <h2 style={{
              color: '#fff', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.25,
            }}>
              What are you here for?
            </h2>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              width: '2rem', height: '2rem', borderRadius: '50%',
              background: '#1E1E1E', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M9 3L3 9M3 3l6 6" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Service tiles — 2 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          marginBottom: '1.1rem',
        }}>
          {SERVICES.map((s) => (
            <button
              key={s.href}
              onClick={() => navigate(s.href)}
              style={{
                textAlign: 'left',
                background: '#1A1A1A',
                border: '1.5px solid #2A2A2A',
                borderRadius: '0.75rem',
                padding: '1rem 0.9rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = '#00B5A5'
                el.style.background = '#151515'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = '#2A2A2A'
                el.style.background = '#1A1A1A'
              }}
            >
              <p style={{
                color: '#fff', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3,
              }}>
                {s.label}
              </p>
            </button>
          ))}
        </div>

        {/* Browse homepage */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              color: '#666', fontWeight: 400, fontSize: '0.78rem',
              background: 'none', border: 'none', cursor: 'pointer',
              textDecoration: 'underline', textDecorationColor: '#444',
              textUnderlineOffset: '3px',
            }}
          >
            Browse the homepage
          </button>
        </div>
      </div>

      <style>{`
        @keyframes welcomeSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}