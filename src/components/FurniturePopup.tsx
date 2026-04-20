'use client'
import { useState, useEffect } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

export default function FurniturePopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('furniture-popup-dismissed')) return

    // Show after 25 seconds on page, or when user scrolls 60%
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true)
    }, 25000)

    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrollPct > 0.6 && !dismissed) setVisible(true)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [dismissed])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('furniture-popup-dismissed', '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.trim()) return
    setSubmitting(true)

    try {
      // Determine if contact is email or phone
      const isEmail = contact.includes('@')
      await submitLead({
        firstname: name || 'Furniture Enquiry',
        email: isEmail ? contact : `furniture.enquiry.${Date.now()}@yos.placeholder`,
        source: 'Furniture Page Popup',
        context: `Project pricing consultation requested. Contact provided: ${contact}${isEmail ? '' : ' (mobile)'}`,
      })
    } catch {
      // Fail silently — don't block the user
    }

    setSubmitted(true)
    setSubmitting(false)
    setTimeout(dismiss, 3000)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ animation: 'slideUp 0.3s ease-out' }}>

        {/* Teal accent bar */}
        <div className="h-2 w-full bg-teal" />

        {/* Close */}
        <button onClick={dismiss}
          className="absolute top-4 right-4 text-mid-grey hover:text-near-black transition-colors"
          aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="px-10 py-10">
          {!submitted ? (
            <>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-full px-4 py-2 mb-7">
                <span className="w-2 h-2 rounded-full bg-teal" />
                <span className="font-semibold text-xs tracking-widest uppercase">Project Pricing Available</span>
              </div>

              <h2 className="text-near-black font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.4rem,3vw,1.75rem)' }}>
                Get a personalised quote for your project.
              </h2>
              <p className="text-mid-grey font-light text-sm leading-relaxed mb-8" style={{ lineHeight: 1.8 }}>
                Project pricing is available for fit-outs, multi-site orders, and staged rollouts.
                Leave your contact details and we&apos;ll arrange a 20-minute consultation — no obligation.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
                  style={{ padding: '1rem 1.25rem', fontSize: '0.95rem' }}
                />
                <input
                  type="text"
                  placeholder="Email or mobile number"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
                  style={{ padding: '1rem 1.25rem', fontSize: '0.95rem' }}
                />
                <button
                  type="submit"
                  disabled={submitting || !contact.trim()}
                  className="w-full bg-teal text-white font-bold uppercase tracking-[0.14em] rounded-xl hover:bg-dark-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ padding: '1.2rem 2rem', fontSize: '0.72rem' }}>
                  {submitting ? 'Sending…' : 'Request a consultation →'}
                </button>
              </form>

              <p className="text-gray-400 font-light mt-6 text-center" style={{ fontSize: '0.75rem' }}>
                We respond within one business day. No sales calls without permission.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l6 6 10-12" stroke="#00B5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-near-black font-bold text-xl mb-2">Done. We&apos;ll be in touch.</h3>
              <p className="text-mid-grey font-light text-sm">Expect to hear from us within one business day.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(1.5rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
