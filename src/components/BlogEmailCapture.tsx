'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

export default function BlogEmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await submitLead({ email, source: 'Blog Email Capture', context: 'Subscribed to blog updates from blog index page.' })
    } catch { /* fail silently */ }
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-teal font-semibold" style={{ fontSize: '0.95rem' }}>
        <div className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-6" stroke="#00B5A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        Done — we&apos;ll be in touch.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-3" style={{ maxWidth: '28rem' }}>
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
        style={{ padding: '0.9rem 1.1rem', fontSize: '0.9rem' }}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-teal text-white font-bold uppercase tracking-[0.12em] rounded-lg hover:bg-dark-teal transition-colors disabled:opacity-50 flex-shrink-0"
        style={{ padding: '0.9rem 1.5rem', fontSize: '0.68rem' }}
      >
        {loading ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}
