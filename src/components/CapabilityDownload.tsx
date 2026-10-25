'use client'
import { postEnquiry } from '@/lib/enquiry'
import { useEffect, useState, useRef } from 'react'
import { trackConversion } from '@/lib/analytics'

interface Props {
  label?: string
  variant?: 'primary' | 'outline' | 'dark'
  className?: string
}

export default function CapabilityDownload({
  label = 'Download Capability Statement',
  variant = 'outline',
  className = '',
}: Props) {
  const [open, setOpen] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!open) return
    const dialog = modalRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [open])

  const baseStyles =
    'inline-flex items-center gap-3 font-bold text-sm cursor-pointer transition-all duration-200 min-h-[58px] px-9 justify-center no-underline shadow-sm hover:-translate-y-0.5 hover:shadow-lg'

  const variantStyles = {
    primary:
      'bg-teal text-white hover:bg-dark-teal',
    outline:
      'border-2 border-teal text-teal hover:bg-teal hover:text-white',
    dark:
      'bg-white text-near-black hover:bg-warm-grey',
  }

  function openModal() {
    setOpen(true)
    setError('')
    setFirstname('')
    setEmail('')
  }

  function closeModal() {
    setOpen(false)
    setError('')
  }

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === modalRef.current) closeModal()
  }

  // Keep keyboard navigation within the open dialog.
  function handleKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== 'Tab') return
    const controls = modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]')
    if (!controls?.length) return
    const first = controls[0], last = controls[controls.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (!firstname.trim()) {
      setError('Enter your name.')
      return
    }

    setLoading(true)
    try {
      const res = await postEnquiry('/api/download/capability-statement', { firstname: firstname.trim(), email: email.trim().toLowerCase() })

      const data = await res.json()
      if (!res.ok || !data.downloadUrl) {
        setError(res.status === 429 ? 'Please wait a few minutes before trying again. Your details are still here.' : 'We could not prepare your download. Your details are still here. Please try again.')
        setLoading(false)
        return
      }

      // Trigger download via hidden anchor
      const a = document.createElement('a')
      a.href = data.downloadUrl
      a.download = 'YOS-Tenant-Representation-Capability-Statement.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      if (!data.preview) trackConversion('capability_statement_download', { asset: 'YOS-Capability-Statement.pdf' })

      closeModal()
    } catch {
      setError('We could not prepare your download. Your details are still here. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        style={{ borderRadius: '0.75rem' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {label}
      </button>

      {open && (
        <dialog
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,59,56,0.75)', backdropFilter: 'blur(4px)', width: '100vw', height: '100dvh', maxWidth: 'none', maxHeight: 'none', margin: 0, border: 0, padding: '1rem' }}
          onCancel={event => { event.preventDefault(); closeModal() }}
          onClick={handleBackdrop}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cap-download-title"
        >
          <div
            className="bg-white w-full max-w-lg overflow-hidden shadow-2xl"
            style={{ width: '100%', maxWidth: '32rem', maxHeight: '90dvh', overflowY: 'auto', borderRadius: '1.5rem' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-7 pt-7 pb-6"
              style={{ borderBottom: '1px solid #f0f0f0', padding: '1.5rem' }}
            >
              <div>
                <p
                  className="text-teal font-bold uppercase tracking-widest mb-1"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}
                >
                  Your Office Space
                </p>
                <h2
                  id="cap-download-title"
                  className="text-near-black font-black leading-tight"
                  style={{ fontSize: '1.2rem' }}
                >
                  See how we can help
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex-shrink-0 text-charcoal/40 hover:text-charcoal transition-colors p-1"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6" style={{ padding: '1.5rem' }}>
              <p className="text-charcoal font-light leading-relaxed mb-6" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                Get the concise YOS capability statement with our services, delivery approach and the sectors we support. No spam and no follow-up calls unless you ask.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="cap-firstname" className="block text-near-black font-bold mb-2" style={{ fontSize: '0.8rem' }}>
                      First Name
                    </label>
                    <input
                      id="cap-firstname"
                      type="text"
                      value={firstname}
                      onChange={e => setFirstname(e.target.value)}
                      placeholder="Joe"
                      autoComplete="given-name"
                      required
                      className="w-full border px-4 py-3 text-near-black font-light focus:outline-none focus:ring-2 focus:ring-teal/50 transition-shadow"
                      style={{ borderRadius: '0.375rem', borderColor: '#d1d5db', fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="cap-email" className="block text-near-black font-bold mb-2" style={{ fontSize: '0.8rem' }}>
                      Work Email
                    </label>
                    <input
                      id="cap-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com.au"
                      autoComplete="email"
                      required
                      className="w-full border px-4 py-3 text-near-black font-light focus:outline-none focus:ring-2 focus:ring-teal/50 transition-shadow"
                      style={{ borderRadius: '0.375rem', borderColor: '#d1d5db', fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                    />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="mt-4 text-red-700 font-medium" style={{ fontSize: '0.85rem' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-teal text-white font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    minHeight: '56px',
                    letterSpacing: '0.1em',
                    fontSize: '0.85rem',
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Preparing download...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download My Copy
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-charcoal/50" style={{ fontSize: '0.75rem' }}>
                Your request goes directly to the YOS team by email. This does not subscribe you to marketing.
              </p>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
