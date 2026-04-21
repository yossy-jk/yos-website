'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

interface ConsultantPopupProps {
  quoteModalOpen: boolean
}

export default function ConsultantPopup({ quoteModalOpen }: ConsultantPopupProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('sp_consultant_dismissed')) return

    const timer = setTimeout(() => {
      // Don't show if quote modal is open
      if (!quoteModalOpen) setVisible(true)
    }, 120000) // 2 minutes

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hide if quote modal opens while popup is visible
  useEffect(() => {
    if (quoteModalOpen && visible) setVisible(false)
  }, [quoteModalOpen, visible])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('sp_consultant_dismissed', '1')
  }

  if (!visible || dismissed) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 40,
      width: '320px',
      background: '#1A1A1A',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      fontFamily: 'Montserrat, sans-serif',
      animation: 'slideUp 0.3s ease-out',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: '0.25rem' }}
      >
        <X size={16} />
      </button>

      {/* Teal accent bar */}
      <div style={{ width: '32px', height: '3px', background: '#00B5A5', borderRadius: '2px', marginBottom: '0.85rem' }} />

      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F7F6F4', marginBottom: '0.5rem', lineHeight: 1.4, paddingRight: '1rem' }}>
        Prefer someone to do this for you?
      </p>
      <p style={{ fontSize: '0.8rem', color: '#9B9B9B', lineHeight: 1.6, marginBottom: '1.1rem' }}>
        Our project consultants complete a full measure, discovery and scope as part of the service. Same outcome, zero effort on your end.
      </p>

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <Link
          href="/contact"
          style={{
            flex: 1,
            textAlign: 'center',
            background: '#00B5A5',
            color: '#FFFFFF',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Book a consultant call
        </Link>
        <button
          onClick={dismiss}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            color: '#9B9B9B',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          Keep building
        </button>
      </div>
    </div>
  )
}
