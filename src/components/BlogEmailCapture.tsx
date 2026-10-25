'use client'
import { useEffect, useRef, useState } from 'react'
import { submitLead } from '@/lib/enquiry'
import { trackConversion } from '@/lib/analytics'

export default function BlogEmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [preview, setPreview] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (submitted) receiptRef.current?.focus() }, [submitted])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || !email.trim()) return
    setLoading(true)
    setError('')
    const result = await submitLead({ firstname: 'Blog Subscriber', email, source: 'Blog subscription request', marketingConsent: true, context: 'Requested blog updates from the blog index. Consent: subscribe button.', })
    if (!result.ok) {
      setError('We could not confirm delivery. Your email is still here. Please try again.')
      setLoading(false)
      return
    }
    setPreview(result.preview === true)
    if (!result.preview) trackConversion('newsletter_signup', { source: 'blog' })
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div ref={receiptRef} tabIndex={-1} role="status" className="flex items-center gap-3 text-action-teal font-semibold" style={{ fontSize: '0.95rem' }}>
        <div className="w-5 h-5 rounded-sm bg-teal/15 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-6" stroke="#00B5A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {preview ? 'Preview completed. This preview has not sent an email.' : 'Your subscription request has been received.'}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-3 flex-wrap" style={{ maxWidth: '28rem' }}>
      {error && <p role="alert" className="w-full text-red-600">{error}</p>}
      <label htmlFor="blog-email" className="sr-only">Email address</label>
      <input
        id="blog-email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-1 border border-gray-200 rounded-sm text-near-black font-light placeholder:text-gray-400 outline-none focus:border-teal transition-colors"
        style={{ padding: '0.9rem 1.1rem', fontSize: '0.9rem' }}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-teal text-white font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-dark-teal transition-colors disabled:opacity-50 flex-shrink-0"
        style={{ padding: '0.9rem 1.5rem', fontSize: '0.68rem' }}
      >
        {loading ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}
