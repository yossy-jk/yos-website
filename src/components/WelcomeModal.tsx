'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SERVICES = [
  {
    label: 'Tenant Representation',
    href: '/tenant-rep',
    tagline: 'Your lease. Your terms.',
    desc: 'Independent commercial tenant rep across the Hunter and NSW.',
  },
  {
    label: 'Office Fit Out',
    href: '/office-fitout',
    tagline: 'Brief to delivered.',
    desc: 'End-to-end commercial fitout project management.',
  },
  {
    label: 'Commercial Furniture',
    href: '/furniture',
    tagline: 'Shop or full project.',
    desc: 'In-stock and made-to-order. Delivered and installed.',
  },
  {
    label: 'Commercial Cleaning',
    href: '/cleaning',
    tagline: 'Shows up. Every time.',
    desc: 'Reliable commercial cleaning across Newcastle and Hunter.',
  },
]

const ALTERNATIVES = [
  { label: 'Browse site', href: '/' },
  { label: 'Resources', href: '/resources' },
]

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('welcome-modal-dismissed')) return
    const t = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('welcome-modal-dismissed', '1')
  }

  const navigate = (href: string) => {
    dismiss()
    router.push(href)
  }

  if (!visible) return null

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(10,10,10,0.55)',
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome — what are you looking for?"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: '#fff',
          borderRadius: '1.5rem 1.5rem 0 0',
          padding: '1.5rem 1.5rem 2rem',
          maxHeight: '92vh',
          overflowY: 'auto',
          animation: 'welcomeSlideUp 0.4s cubic-bezier(0.34,1.2,0.64,1)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Teal top accent bar */}
        <div style={{
          width: '3rem', height: '4px',
          background: '#00B5A5', borderRadius: '99px',
          margin: '0 auto 1.25rem',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ color: '#00B5A5', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Your Office Space
            </p>
            <h2 style={{ color: '#1A1A1A', fontWeight: 800, fontSize: 'clamp(1.05rem,4vw,1.25rem)', lineHeight: 1.25 }}>
              What are you here for?
            </h2>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '50%',
              background: '#F4F4F4', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginLeft: '0.75rem',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Service tiles — always 2-column on mobile, scrollable */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          marginBottom: '1rem',
        }}>
          {SERVICES.map((s) => (
            <button
              key={s.href}
              onClick={() => navigate(s.href)}
              style={{
                textAlign: 'left',
                border: '1.5px solid #E8E8E8',
                borderRadius: '0.85rem',
                padding: '0.85rem',
                background: '#fff',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#00B5A5'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#F0FDF9'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8E8E8'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
              }}
            >
              <p style={{
                color: '#1A1A1A', fontWeight: 700,
                fontSize: '0.8rem', lineHeight: 1.3, marginBottom: '0.25rem',
              }}>
                {s.label}
              </p>
              <p style={{ color: '#6B6B6B', fontWeight: 400, fontSize: '0.7rem', lineHeight: 1.5, marginBottom: '0.2rem' }}>
                {s.desc}
              </p>
              <p style={{ color: '#00B5A5', fontWeight: 700, fontSize: '0.68rem' }}>
                {s.tagline} →
              </p>
            </button>
          ))}
        </div>

        {/* Alternatives row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          paddingTop: '0.85rem', borderTop: '1px solid #F0F0F0',
        }}>
          <p style={{ color: '#ABABAB', fontWeight: 400, fontSize: '0.7rem', flexShrink: 0 }}>Or:</p>
          {ALTERNATIVES.map((a, i) => (
            <button
              key={a.href}
              onClick={() => navigate(a.href)}
              style={{
                color: '#6B6B6B', fontWeight: 400, fontSize: '0.75rem',
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'underline', textDecorationColor: '#D0D0D0',
                textUnderlineOffset: '2px',
              }}
            >
              {a.label}{i < ALTERNATIVES.length - 1 && ' · '}
            </button>
          ))}
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