'use client'

import { useState, type FormEvent } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

type SubmitState = 'idle' | 'sending' | 'sent' | 'error'

export default function FurnitureVoucherSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return

    setState('sending')
    setMessage('')

    const form = event.currentTarget
    const honeypot = (form.elements.namedItem('_honey') as HTMLInputElement | null)?.value || ''

    try {
      const response = await fetch('/api/send-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, _honey: honeypot }),
      })
      const result = await response.json().catch(() => ({})) as { error?: string; preview?: boolean }
      if (!response.ok) throw new Error(result.error || 'We could not send the voucher right now.')

      setState('sent')
      setMessage('Your voucher has been sent. Check your inbox.')

      if (!honeypot && !result.preview) {
        void Promise.allSettled([
          submitLead({
            firstname: name || 'Furniture voucher lead',
            email: email.trim(),
            source: 'Furniture Voucher Form',
            context: '$100 furniture voucher requested. Minimum order $1,000 ex GST; valid 30 days.',
          }),
          fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name || undefined,
              email: email.trim(),
              source: 'Furniture Voucher Form',
              context: 'Voucher sent. Minimum order $1,000 ex GST; valid 30 days.',
            }),
          }),
        ])
      }
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'We could not send the voucher right now.')
    }
  }

  const disabled = state === 'sending' || state === 'sent'

  return (
    <section className="bg-white" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }} aria-labelledby="furniture-voucher-title">
      <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center rounded-2xl bg-warm-grey" style={{ padding: 'clamp(1.75rem,5vw,4rem)' }}>
          <div>
            <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">New client offer</p>
            <h2 id="furniture-voucher-title" className="text-near-black font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem,4vw,3rem)' }}>
              Get $100 off your first furniture order.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-5" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
              Enter your details and we&apos;ll email your voucher immediately. Use it on any YOS commercial furniture order over $1,000 ex GST.
            </p>
            <p className="text-mid-grey font-light" style={{ fontSize: '0.8rem', lineHeight: 1.7 }}>
              Valid for 30 days. New clients only. One voucher per business.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-describedby="voucher-terms">
            <label className="text-near-black font-semibold text-sm" htmlFor="voucher-name">Your name</label>
            <input
              id="voucher-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg text-near-black bg-white outline-none focus:border-teal"
              style={{ padding: '0.95rem 1rem' }}
            />
            <label className="text-near-black font-semibold text-sm" htmlFor="voucher-email">Email address</label>
            <input
              id="voucher-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={200}
              required
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg text-near-black bg-white outline-none focus:border-teal"
              style={{ padding: '0.95rem 1rem' }}
            />
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <label htmlFor="voucher-company">Company website</label>
              <input id="voucher-company" name="_honey" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <button
              type="submit"
              disabled={disabled || !email.trim()}
              className="bg-teal text-white font-bold uppercase tracking-[0.14em] rounded-lg hover:bg-dark-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ padding: '1rem 1.5rem', minHeight: '48px', fontSize: '0.72rem' }}
            >
              {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Voucher sent' : 'Email my $100 voucher →'}
            </button>
            <p id="voucher-terms" className="text-mid-grey font-light" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
              We&apos;ll only use these details to deliver the voucher and respond to your enquiry.
            </p>
            {message && (
              <p role="status" aria-live="polite" className={state === 'error' ? 'text-red-700' : 'text-dark-teal'} style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
