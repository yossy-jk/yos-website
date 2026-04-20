'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/hubspot-lead'

interface ToolGateProps {
  tool: string                          // e.g. "Fitout Estimator"
  teaser: React.ReactNode               // what to show before unlock
  children: React.ReactNode             // full tool content after unlock
  context?: () => string                // optional fn returning lead context string
  heading?: string                      // gate heading
  subheading?: string                   // gate subheading
}

/**
 * ToolGate
 *
 * Shows a teaser (partial result, blurred numbers, etc.) then a minimal
 * two-field unlock form. On submit: creates HubSpot contact + deal,
 * then reveals the full tool. Non-blocking — if HubSpot fails, the
 * tool still unlocks so legit users are never blocked.
 *
 * Gate philosophy: frame it as "where to send your results", not
 * "pay with your email". Low friction, high perceived value.
 */
export default function ToolGate({
  tool,
  teaser,
  children,
  context,
  heading = 'Where should we send your results?',
  subheading = 'Enter your name and email — your full breakdown unlocks instantly.',
}: ToolGateProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)

  // Check localStorage so returning users aren't re-gated
  if (typeof window !== 'undefined' && !unlocked) {
    const stored = localStorage.getItem('yos_tool_unlocked')
    if (stored === 'true') return <>{children}</>
  }

  if (unlocked) return <>{children}</>

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter your first name'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    // Fire and forget — never block the user on API issues
    submitLead({
      firstname: name.trim().split(' ')[0],
      email: email.trim(),
      source: tool,
      context: context?.(),
    }).catch(() => {})

    // Remember unlock so returning users skip the gate
    try { localStorage.setItem('yos_tool_unlocked', 'true') } catch {}

    setLoading(false)
    setUnlocked(true)
  }

  return (
    <div className="relative">
      {/* Teaser — blurred below the fold */}
      <div className="relative overflow-hidden" style={{ maxHeight: '18rem' }}>
        <div className="pointer-events-none select-none">
          {teaser}
        </div>
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, white)' }} />
      </div>

      {/* Gate card */}
      <div className="border border-gray-200 rounded-xl bg-white p-8 md:p-10 mt-2 shadow-sm">
        <p className="text-near-black font-black text-lg mb-1">{heading}</p>
        <p className="text-charcoal text-sm font-light mb-6">{subheading}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-near-black text-xs font-semibold tracking-wide uppercase">
                First name <span className="text-teal">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                placeholder="Joe"
                autoComplete="given-name"
                className={[
                  'border text-sm px-4 py-3 rounded-xl outline-none transition-colors',
                  'placeholder:text-gray-400',
                  'focus:border-teal',
                  errors.name ? 'border-red-400' : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-near-black text-xs font-semibold tracking-wide uppercase">
                Work email <span className="text-teal">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                placeholder="joe@company.com.au"
                autoComplete="email"
                className={[
                  'border text-sm px-4 py-3 rounded-xl outline-none transition-colors',
                  'placeholder:text-gray-400',
                  'focus:border-teal',
                  errors.email ? 'border-red-400' : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-teal text-white font-black text-sm tracking-widest uppercase px-8 py-3.5 rounded-xl hover:bg-dark-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Unlocking…</>
            ) : (
              'See Full Results →'
            )}
          </button>

          <p className="text-gray-400 text-xs mt-3">
            No spam. No pitch. We use this to send your results and follow up only if it&apos;s relevant.
          </p>
        </form>
      </div>
    </div>
  )
}
