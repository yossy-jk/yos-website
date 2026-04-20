'use client'
import { useState, useEffect, useRef } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

export default function ExitPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    // Don't show if already seen this session
    if (sessionStorage.getItem('exit-popup-dismissed')) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves toward top of viewport (exiting toward tab bar)
      if (e.clientY <= 20 && !triggered.current && !dismissed) {
        triggered.current = true
        setVisible(true)
      }
    }

    // Mobile: trigger on back button / visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !triggered.current && !dismissed) {
        triggered.current = true
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dismissed])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('exit-popup-dismissed', '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      await Promise.allSettled([
        submitLead({
          firstname: name || 'Exit Popup Lead',
          email,
          source: 'Exit Intent Popup',
          context: `Exit intent popup — $100 furniture voucher claimed. Name: ${name || 'not provided'}, Email: ${email}`,
        }),
        fetch('/api/notify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name, email, source: 'Exit Intent Popup — $100 Voucher', context: `Voucher claimed. Min spend $1,000 ex GST. Valid 7 days.` }) }),
      ])
    } catch { /* fail silently */ }
    setSubmitted(true)
    setSubmitting(false)
    setTimeout(dismiss, 4000)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10,10,10,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div
        className="relative w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxWidth: '34rem', animation: 'exitPopupIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Teal top bar */}
        <div className="h-1.5 w-full bg-teal" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-mid-grey hover:text-near-black transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {!submitted ? (
          <div style={{ padding: '2.5rem 2.75rem 2.75rem' }}>
            {/* Voucher badge */}
            <div
              className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-full mb-6"
              style={{ padding: '0.5rem 1rem' }}
            >
              <span className="text-sm">🎁</span>
              <span className="font-bold text-xs tracking-widest uppercase">$100 Furniture Voucher</span>
            </div>

            <h2
              className="text-near-black font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', paddingRight: '2rem' }}
            >
              Before you go — grab $100 off your next furniture order.
            </h2>

            <p
              className="text-mid-grey font-light leading-relaxed mb-8"
              style={{ fontSize: '0.95rem', lineHeight: 1.85 }}
            >
              Drop your details and we&apos;ll send you a $100 voucher toward any YOS furniture or fitout project.
              Minimum order $1,000 ex GST. Valid for 7 days only.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '1rem' }}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
                style={{ padding: '1.1rem 1.25rem', fontSize: '0.95rem' }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
                style={{ padding: '1.1rem 1.25rem', fontSize: '0.95rem' }}
              />
              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className="w-full bg-teal text-white font-bold uppercase tracking-[0.14em] rounded-xl hover:bg-dark-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ padding: '1.25rem 2rem', fontSize: '0.72rem', marginTop: '0.5rem' }}
              >
                {submitting ? 'Sending…' : 'Claim my $100 voucher →'}
              </button>
            </form>

            <p className="text-gray-400 font-light text-center" style={{ fontSize: '0.72rem', marginTop: '1.25rem' }}>
              No spam. We&apos;ll send your voucher code within one business day.
            </p>
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem 2.75rem' }}>
            <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l6 6 10-12" stroke="#00B5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-near-black font-bold text-xl mb-3">Voucher on its way.</h3>
            <p className="text-mid-grey font-light text-sm" style={{ lineHeight: 1.8 }}>
              Check your inbox — your $100 voucher code will arrive within one business day.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes exitPopupIn {
          from { opacity: 0; transform: scale(0.92) translateY(1rem); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
