'use client'

import { useState } from 'react'

interface SaveProgressPromptProps {
  onSave: (email: string) => void
  onDismiss: () => void
}

export default function SaveProgressPrompt({ onSave, onDismiss }: SaveProgressPromptProps) {
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSaving(true)
    await onSave(email.trim())
    setSaving(false)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      width: '100%',
      maxWidth: '440px',
      background: '#1A1A1A',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '1.1rem 1.25rem',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      fontFamily: 'Montserrat, sans-serif',
      animation: 'slideUp 0.3s ease-out',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>

      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F6F4', marginBottom: '0.3rem' }}>
        Save your progress
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9B9B9B', marginBottom: '0.85rem' }}>
        Enter your email and we will keep your work safe if you lose connection.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            background: '#222',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '0.55rem 0.75rem',
            fontSize: '0.82rem',
            color: '#F7F6F4',
            fontFamily: 'Montserrat, sans-serif',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={saving}
          style={{
            background: '#00B5A5',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'Saving...' : 'Save my work'}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '0.55rem 0.75rem',
            fontSize: '0.78rem',
            color: '#6B6B6B',
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          Skip
        </button>
      </form>
    </div>
  )
}
