'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import Link from 'next/link'

// ─── Simple markdown → HTML for controlled internal content ──────────────
function processBoldAndItalic(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function renderSnapshotMarkdown(md: string): string {
  const lines = md.split('\n')
  const result: string[] = []
  let inList = false

  for (const line of lines) {
    // Skip footer/CTA lines that we handle separately in the page
    if (
      line.startsWith('**FREE LEASE REVIEW') ||
      line.startsWith('**Need a tenant rep?') ||
      line.startsWith('Your Office Space |') ||
      line.includes('yourofficespace.au/lease-intel') ||
      line.includes('yourofficespace.au/tenant-rep')
    ) {
      if (inList) { result.push('</ul>'); inList = false }
      continue
    }

    if (line.startsWith('# ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h2 class="snap-h1">${processBoldAndItalic(line.slice(2))}</h2>`)
    } else if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h3 class="snap-h2">${processBoldAndItalic(line.slice(3))}</h3>`)
    } else if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h4 class="snap-h3">${processBoldAndItalic(line.slice(4))}</h4>`)
    } else if (line === '---') {
      if (inList) { result.push('</ul>'); inList = false }
      result.push('<hr class="snap-hr" />')
    } else if (line.startsWith('- ')) {
      if (!inList) { result.push('<ul class="snap-list">'); inList = true }
      result.push(`<li>${processBoldAndItalic(line.slice(2))}</li>`)
    } else if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false }
    } else {
      if (inList) { result.push('</ul>'); inList = false }
      // Source/italic-only lines (wrapped in single *)
      if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
        result.push(`<p class="snap-source">${processBoldAndItalic(line)}</p>`)
      } else {
        result.push(`<p class="snap-p">${processBoldAndItalic(line)}</p>`)
      }
    }
  }

  if (inList) result.push('</ul>')
  return result.join('\n')
}

// ─── Registration Popup ──────────────────────────────────────────────────
interface PopupProps {
  onClose: () => void
}

function RegistrationPopup({ onClose }: PopupProps) {
  const [firstname, setFirstname] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('Newcastle')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname.trim() || !email.trim()) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/market-snapshot-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: firstname.trim(), email: email.trim(), region }),
      })
      if (res.ok) {
        localStorage.setItem('snapshot-registered', '1')
        setSubmitted(true)
        setTimeout(onClose, 3500)
      } else {
        setError('Something went wrong. Try again or email jk@yourofficespace.au.')
      }
    } catch {
      setError('Something went wrong. Try again or email jk@yourofficespace.au.')
    }

    setSubmitting(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxWidth: '34rem', animation: 'popupIn 0.32s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Teal top bar */}
        <div className="h-1.5 w-full bg-teal" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-mid-grey hover:text-near-black transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {!submitted ? (
          <div style={{ padding: '2.5rem 2.75rem 2.75rem' }}>
            <div
              className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-full mb-6"
              style={{ padding: '0.5rem 1rem' }}
            >
              <span className="w-2 h-2 rounded-full bg-teal" />
              <span className="font-bold text-xs tracking-widest uppercase">Free Monthly Report</span>
            </div>

            <h2
              className="text-near-black font-bold leading-tight mb-3"
              style={{ fontSize: 'clamp(1.3rem,3vw,1.65rem)', paddingRight: '2rem' }}
            >
              Get the monthly snapshot delivered to your inbox
            </h2>
            <p className="text-mid-grey font-light leading-relaxed mb-7" style={{ fontSize: '0.92rem', lineHeight: 1.85 }}>
              One email, once a month. No spam. Unsubscribe any time.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '0.875rem' }}>
              <input
                type="text"
                placeholder="First name"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
                required
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
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-near-black font-light outline-none focus:border-teal transition-colors bg-white"
                style={{ padding: '1.1rem 1.25rem', fontSize: '0.95rem' }}
              >
                <option value="Newcastle">Newcastle</option>
                <option value="Hunter Valley">Hunter Valley</option>
                <option value="Sydney">Sydney</option>
                <option value="Illawarra">Illawarra</option>
              </select>

              {error && (
                <p className="text-red-500 font-light" style={{ fontSize: '0.82rem' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !email.trim() || !firstname.trim()}
                className="w-full bg-teal text-white font-bold uppercase tracking-[0.14em] rounded-xl hover:bg-dark-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ padding: '1.25rem 2rem', fontSize: '0.72rem', marginTop: '0.35rem' }}
              >
                {submitting ? 'Sending…' : 'Send me the snapshot'}
              </button>
            </form>

            <p className="text-gray-400 font-light text-center" style={{ fontSize: '0.72rem', marginTop: '1.25rem' }}>
              No spam. Unsubscribe any time. Published the first business day of every month.
            </p>
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem 2.75rem' }}>
            <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l6 6 10-12" stroke="#00B5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-near-black font-bold text-xl mb-3">Done. First edition coming your way.</h3>
            <p className="text-mid-grey font-light text-sm" style={{ lineHeight: 1.8 }}>
              Check your inbox — we&apos;ll send you the next edition when it drops.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.92) translateY(1rem); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── CTA Buttons ─────────────────────────────────────────────────────────
function CTASection({ onOpen, leaseIntelHref }: { onOpen: () => void; leaseIntelHref: string }) {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={onOpen}
        className="inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.14em] bg-teal text-white hover:bg-dark-teal transition-colors min-h-[52px] px-10 py-4 text-[0.72rem]"
      >
        Get it delivered monthly
      </button>
      <Link
        href={leaseIntelHref}
        className="inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.14em] border border-teal text-teal hover:bg-teal hover:text-white transition-colors min-h-[52px] px-10 py-4 text-[0.72rem] no-underline"
      >
        Lease review — $297 ex GST, 24-hour turnaround
      </Link>
      <p className="text-white/45 font-light" style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>
        Newcastle business? The full LeaseIntel report is free until 21 July 2026.
      </p>
    </div>
  )
}

// ─── Main Page Content ───────────────────────────────────────────────────
export default function MarketSnapshotPageContent({
  snapshotContent,
  leaseIntelHref,
}: {
  snapshotContent: string
  leaseIntelHref: string
}) {
  const [popupOpen, setPopupOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openPopup = () => setPopupOpen(true)
  const closePopup = () => setPopupOpen(false)

  // Auto-show after 15s if not already registered
  useEffect(() => {
    if (localStorage.getItem('snapshot-registered')) return
    timerRef.current = setTimeout(() => {
      setPopupOpen(true)
    }, 15000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const snapshotHtml = renderSnapshotMarkdown(snapshotContent)

  return (
    <>
      <Nav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="bg-near-black"
        style={{ paddingTop: 'clamp(7rem,15vw,12rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}
      >
        <div
          className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
        >
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal" />
              <span className="font-semibold text-xs tracking-widest uppercase">Newcastle Office Market</span>
            </div>
            <h1
              className="text-white font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(2.2rem,5.5vw,4rem)', maxWidth: '860px' }}
            >
              The Newcastle Office Market — From the Tenant&apos;s Side
            </h1>
            <p
              className="text-white/55 font-light leading-relaxed mb-12"
              style={{ fontSize: 'clamp(1rem,2.2vw,1.25rem)', maxWidth: '620px', lineHeight: 1.85 }}
            >
              Every month, we publish what landlords already know but tenants don&apos;t. Vacancy rates. Rent trends. What&apos;s in the pipeline. Which way leverage is moving.
            </p>
            <CTASection onOpen={openPopup} leaseIntelHref={leaseIntelHref} />
          </FadeIn>
        </div>
      </section>

      {/* ── Intro paragraphs ─────────────────────────────── */}
      <section
        style={{
          paddingTop: 'clamp(3.5rem,7vw,6rem)',
          paddingBottom: 'clamp(3rem,5vw,5rem)',
          background: '#FAFAFA',
        }}
      >
        <div
          className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
        >
          <FadeIn>
            <div style={{ maxWidth: '680px' }}>
              <p
                className="text-near-black font-light leading-relaxed mb-5"
                style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', lineHeight: 1.9 }}
              >
                CBRE and Colliers publish market reports for landlords and investors. Nobody publishes the tenant&apos;s view. We&apos;re fixing that.
              </p>
              <p
                className="text-near-black font-light leading-relaxed mb-5"
                style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', lineHeight: 1.9 }}
              >
                The Newcastle Office Market Snapshot is free. One page. Published the first business day of every month. Written by Your Office Space — the only commercial property firm in Newcastle that works exclusively for tenants.
              </p>
              <p
                className="text-near-black font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', lineHeight: 1.9 }}
              >
                Read the current edition below or register to get it delivered to your inbox each month.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Snapshot Report ──────────────────────────────── */}
      <section
        style={{
          paddingTop: 'clamp(3rem,6vw,5rem)',
          paddingBottom: 'clamp(3.5rem,7vw,6rem)',
          background: '#ffffff',
        }}
      >
        <div
          className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
        >
          <FadeIn>
            {/* Report card */}
            <div
              className="bg-white rounded-2xl"
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
                maxWidth: '800px',
              }}
            >
              {/* Report header */}
              <div
                className="bg-near-black rounded-t-2xl"
                style={{ padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1.5rem,4vw,3rem)' }}
              >
                <p className="text-teal font-bold uppercase tracking-[0.3em] mb-2" style={{ fontSize: '0.62rem' }}>
                  Current Edition
                </p>
                <h2 className="text-white font-bold" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)' }}>
                  Newcastle Office Market Snapshot — May 2026
                </h2>
                <p className="text-white/40 font-light mt-2" style={{ fontSize: '0.8rem' }}>
                  Prepared by Your Office Space
                </p>
              </div>

              {/* Report body */}
              <div
                style={{ padding: 'clamp(1.5rem,4vw,3rem) clamp(1.5rem,4vw,3rem)' }}
                className="snapshot-content"
                dangerouslySetInnerHTML={{ __html: snapshotHtml }}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section
        className="bg-teal"
        style={{ paddingTop: 'clamp(3.5rem,7vw,6rem)', paddingBottom: 'clamp(3.5rem,7vw,6rem)' }}
      >
        <div
          className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
        >
          <FadeIn>
            <div style={{ maxWidth: '640px' }}>
              <h2
                className="text-white font-bold leading-tight mb-5"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}
              >
                Get it delivered to your inbox every month.
              </h2>
              <p className="text-white/75 font-light mb-8" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                One email, once a month. The market data landlords already know — delivered to the tenant&apos;s side.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openPopup}
                  className="inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.14em] border border-white text-white hover:bg-white hover:text-near-black transition-colors min-h-[52px] px-10 py-4 text-[0.72rem]"
                >
                  Get it delivered monthly
                </button>
                <Link
                  href={leaseIntelHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.14em] bg-white/10 text-white hover:bg-white/20 transition-colors min-h-[52px] px-10 py-4 text-[0.72rem] no-underline"
                >
                  Lease review — $297 ex GST
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer note ──────────────────────────────────── */}
      <section
        style={{
          paddingTop: 'clamp(2rem,4vw,3rem)',
          paddingBottom: 'clamp(2rem,4vw,3rem)',
          background: '#F5F5F5',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          className="max-w-screen-xl mx-auto"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
        >
          <p className="text-mid-grey font-light" style={{ fontSize: '0.82rem' }}>
            Published by Your Office Space | Newcastle |{' '}
            <a href="mailto:jk@yourofficespace.au" className="text-teal no-underline hover:underline">
              jk@yourofficespace.au
            </a>{' '}
            | 0434 655 511
          </p>
        </div>
      </section>

      <Footer />

      {/* ── Popup ────────────────────────────────────────── */}
      {popupOpen && <RegistrationPopup onClose={closePopup} />}

      {/* ── Snapshot CSS ─────────────────────────────────── */}
      <style>{`
        .snapshot-content .snap-h1 {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.02em;
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #00B5A5;
        }
        .snapshot-content .snap-h2 {
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.01em;
          margin: 2rem 0 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .snapshot-content .snap-h3 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #444444;
          margin: 1.5rem 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .snapshot-content .snap-p {
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          font-weight: 300;
          color: #1A1A1A;
          line-height: 1.85;
          margin: 0 0 1rem;
        }
        .snapshot-content .snap-source {
          font-size: 0.82rem;
          font-weight: 300;
          color: #9B9B9B;
          font-style: italic;
          line-height: 1.7;
          margin: 0.5rem 0 1.25rem;
          padding: 0.75rem 1rem;
          background: #FAFAFA;
          border-left: 3px solid #E0F5F3;
          border-radius: 0 4px 4px 0;
        }
        .snapshot-content .snap-hr {
          border: none;
          border-top: 1px solid rgba(0,0,0,0.08);
          margin: 2rem 0;
        }
        .snapshot-content .snap-list {
          margin: 0.75rem 0 1.25rem 1.25rem;
          padding: 0;
        }
        .snapshot-content .snap-list li {
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          font-weight: 300;
          color: #1A1A1A;
          line-height: 1.85;
          margin-bottom: 0.5rem;
          padding-left: 0.25rem;
        }
        .snapshot-content strong {
          font-weight: 700;
          color: #1A1A1A;
        }
        .snapshot-content em {
          font-style: italic;
        }
      `}</style>
    </>
  )
}
