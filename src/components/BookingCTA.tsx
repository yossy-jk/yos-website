'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'
import { HUBSPOT } from '@/lib/constants'

interface Props {
  label?: string
  variant?: 'primary' | 'outline' | 'white'
  size?: 'default' | 'lg'
  className?: string
}

export default function BookingCTA({
  label = 'Book a Clarity Call',
  variant = 'primary',
  size = 'default',
}: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const close = () => { setOpen(false); setTimeout(() => setStep('form'), 400) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await Promise.allSettled([
        submitLead({
          firstname: name || 'Booking Request',
          email: `booking.${Date.now()}@yos.placeholder`,
          source: 'Clarity Call Booking',
          context: `Name: ${name}, Phone: ${phone}. Redirecting to HubSpot calendar.`,
        }),
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            source: 'Clarity Call — Booking Request',
            context: `Name: ${name}\nPhone: ${phone}\nProceding to calendar booking.`,
          }),
        }),
      ])
    } catch { /* silent */ }
    setStep('done')
    setSubmitting(false)
    // Redirect to HubSpot calendar after short delay
    setTimeout(() => {
      window.open(HUBSPOT.bookingUrl, '_blank')
      close()
    }, 1200)
  }

  const btnStyle: React.CSSProperties = {
    padding: size === 'lg' ? '1.25rem 3.5rem' : '1rem 2.5rem',
    fontSize: '0.72rem',
    borderRadius: '0.5rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '52px',
    transition: 'background 0.15s',
    width: '100%',
  }

  const btnClass =
    variant === 'primary' ? 'bg-teal text-white hover:bg-dark-teal w-full sm:w-auto' :
    variant === 'white'   ? 'bg-white text-near-black hover:bg-white/90 w-full sm:w-auto' :
    'border border-white/30 text-white/70 hover:text-teal hover:border-teal w-full sm:w-auto'

  return (
    <>
      <button onClick={() => setOpen(true)} className={btnClass} style={btnStyle}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div
            className="relative w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            style={{ maxWidth: '28rem', animation: 'bookingIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <div className="h-1.5 bg-teal w-full" />

            <button
              onClick={close}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="#666" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>

            {step === 'form' ? (
              <div style={{ padding: '2rem 2.25rem 2.25rem' }}>
                <p className="text-teal font-semibold uppercase tracking-widest mb-3" style={{ fontSize: '0.65rem' }}>
                  Free — No obligation
                </p>
                <h2 className="text-near-black font-bold leading-tight mb-2" style={{ fontSize: '1.4rem', paddingRight: '1.5rem' }}>
                  Book your Clarity Call.
                </h2>
                <p className="text-mid-grey font-light mb-6" style={{ fontSize: '0.9rem', lineHeight: 1.75 }}>
                  30 minutes. We&apos;ll look at your situation — lease, space, fitout or otherwise — and tell you exactly what we&apos;d do.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '0.875rem' }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
                    style={{ padding: '1rem 1.1rem', fontSize: '0.95rem' }}
                  />
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
                    style={{ padding: '1rem 1.1rem', fontSize: '0.95rem' }}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !phone.trim()}
                    className="w-full bg-teal text-white font-bold uppercase tracking-[0.14em] rounded-xl hover:bg-dark-teal transition-colors disabled:opacity-40"
                    style={{ padding: '1.1rem 2rem', fontSize: '0.72rem', marginTop: '0.25rem' }}
                  >
                    {submitting ? 'One moment…' : 'Pick a time →'}
                  </button>
                </form>

                <p className="text-gray-400 font-light text-center mt-4" style={{ fontSize: '0.72rem' }}>
                  You&apos;ll choose your time on the next screen.
                </p>
              </div>
            ) : (
              <div className="text-center" style={{ padding: '2.5rem 2.25rem' }}>
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11l5 5 9-10" stroke="#00B5A5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-near-black font-bold text-lg mb-2">Opening your calendar…</h3>
                <p className="text-mid-grey font-light text-sm">Pick a time that works for you.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bookingIn {
          from { opacity: 0; transform: scale(0.93) translateY(0.75rem); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  )
}
