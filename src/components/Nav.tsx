'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { SERVICE_LINKS, HUBSPOT, CONTACT } from '@/lib/constants'

const TOOLS = [
  { label: 'Lease Risk Checker', href: '/resources/lease-review', tagline: 'Spot hidden obligations before you sign.' },
  { label: 'Fitout Estimator', href: '/resources/fitout-estimator', tagline: 'Budget your office fitout accurately.' },
  { label: 'Lease Comparison', href: '/resources/lease-comparison', tagline: 'Compare two leases side by side.' },
  { label: 'Stamp Duty Calculator', href: '/resources/stamp-duty-calculator', tagline: 'NSW commercial stamp duty estimate.' },
  { label: 'Rental Yield Calculator', href: '/resources/rental-yield-calculator', tagline: 'Gross and net yield in seconds.' },
  { label: 'Cap Rate Calculator', href: '/resources/cap-rate-calculator', tagline: 'Valuation metric for investors.' },
]

const BLOG_HIGHLIGHTS = [
  { label: 'What Is Tenant Representation?', href: '/blog/tenant-representation-newcastle' },
  { label: 'Fitout Costs in Newcastle 2026', href: '/blog/commercial-office-fitout-cost-newcastle' },
  { label: 'Make Good: What It Really Means', href: '/blog/make-good-clause-commercial-lease' },
  { label: 'Buying Commercial Property in 2026', href: '/blog/buying-commercial-property-newcastle-2026' },
]

const NAV_LINKS_SIMPLE = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const NAV_H = 80

  const closeAll = () => { setServicesOpen(false); setResourcesOpen(false) }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-near-black border-b border-white/10' : 'bg-near-black/95 backdrop-blur-md'
      }`}>
        <div
          className="max-w-screen-xl mx-auto flex justify-between items-center h-16 md:h-20"
          style={{ paddingLeft: 'clamp(1.25rem,5vw,4rem)', paddingRight: 'clamp(1.25rem,5vw,4rem)' }}
        >
          <Link href="/" onClick={() => setOpen(false)}
            className="text-white font-black no-underline z-50 relative uppercase"
            style={{ fontSize: 'clamp(0.8rem,2.5vw,0.72rem)', letterSpacing: '0.2em' }}>
            Your Office Space
          </Link>

          <div className="hidden md:flex gap-8 items-center">

            {/* ── Services dropdown ── */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => { setServicesOpen(v => !v); setResourcesOpen(false) }}
                className="text-white/60 font-medium hover:text-white transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 outline-none focus:outline-none"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                Services
                <svg style={{ width: '0.6rem', height: '0.6rem', transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {servicesOpen && (
                <div className="fixed left-0 right-0 bg-near-black border-b border-white/10 shadow-2xl z-50"
                  style={{ top: `${NAV_H}px` }}>
                  <div className="max-w-screen-xl mx-auto"
                    style={{ padding: `0 clamp(1.5rem,5vw,4rem)` }}>
                    <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {SERVICE_LINKS.map((link, i) => (
                        <Link key={link.href} href={link.href} onClick={closeAll}
                          className="no-underline group flex flex-col bg-near-black hover:bg-white/[0.04] transition-colors"
                          style={{
                            padding: '2rem 2rem', flex: '1 1 0',
                            borderRight: i < SERVICE_LINKS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                            minWidth: 0,
                          }}>
                          <span className="text-white font-black uppercase block whitespace-nowrap group-hover:text-teal transition-colors"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.12em', marginBottom: '0.625rem' }}>
                            {link.label}
                          </span>
                          <span className="text-white/35 font-light block" style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
                            {link.tagline}
                          </span>
                          <span className="text-teal/0 group-hover:text-teal/70 transition-colors block mt-auto pt-3" style={{ fontSize: '0.65rem', fontWeight: 600 }}>→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Resources dropdown ── */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => { setResourcesOpen(v => !v); setServicesOpen(false) }}
                className="text-white/60 font-medium hover:text-white transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 outline-none focus:outline-none"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                Resources
                <svg style={{ width: '0.6rem', height: '0.6rem', transition: 'transform 0.2s', transform: resourcesOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {resourcesOpen && (
                <div className="fixed left-0 right-0 bg-near-black border-b border-white/10 shadow-2xl z-50"
                  style={{ top: `${NAV_H}px` }}>
                  <div className="max-w-screen-xl mx-auto"
                    style={{ padding: `0 clamp(1.5rem,5vw,4rem)` }}>
                    <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

                      {/* Left col — Tools */}
                      <div style={{ flex: '0 0 40%', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '2rem 2rem 2rem 0' }}>
                        <p className="text-teal font-bold uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', marginBottom: '1.25rem' }}>Free Tools</p>
                        <div className="flex flex-col" style={{ gap: '0.125rem' }}>
                          {TOOLS.map(tool => (
                            <Link key={tool.href} href={tool.href} onClick={closeAll}
                              className="no-underline group flex flex-col hover:bg-white/[0.04] transition-colors"
                              style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                              <span className="text-white font-semibold block group-hover:text-teal transition-colors"
                                style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                                {tool.label}
                              </span>
                              <span className="text-white/30 font-light block" style={{ fontSize: '0.68rem', lineHeight: 1.4 }}>
                                {tool.tagline}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <Link href="/resources" onClick={closeAll}
                            className="no-underline text-teal/70 hover:text-teal font-semibold transition-colors"
                            style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            All resources →
                          </Link>
                        </div>
                      </div>

                      {/* Right col — Blog */}
                      <div style={{ flex: 1, padding: '2rem 0 2rem 2.5rem' }}>
                        <p className="text-teal font-bold uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', marginBottom: '1.25rem' }}>Latest Articles</p>
                        <div className="flex flex-col" style={{ gap: '0.125rem' }}>
                          {BLOG_HIGHLIGHTS.map(post => (
                            <Link key={post.href} href={post.href} onClick={closeAll}
                              className="no-underline group flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
                              style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                              <span className="text-white/15 group-hover:text-teal/40 transition-colors flex-shrink-0" style={{ fontSize: '0.7rem' }}>→</span>
                              <span className="text-white/70 font-light group-hover:text-white transition-colors"
                                style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                                {post.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <Link href="/blog" onClick={closeAll}
                            className="no-underline text-teal/70 hover:text-teal font-semibold transition-colors"
                            style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            View all articles →
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Plain links */}
            {NAV_LINKS_SIMPLE.map(link => (
              <Link key={link.href} href={link.href}
                className="text-white/60 font-medium hover:text-white transition-colors no-underline"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {link.label}
              </Link>
            ))}

            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors no-underline"
              style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.75rem 1.5rem' }}>
              Book a Call
            </a>
          </div>

          <button onClick={() => setOpen(!open)}
            className="md:hidden relative z-50 flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer"
            aria-label={open ? 'Close menu' : 'Open menu'}>
            <span className="block w-6 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{ transform: open ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span className="block w-6 h-[2px] bg-white transition-all duration-200"
              style={{ opacity: open ? 0 : 1 }} />
            <span className="block w-6 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{ transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Desktop backdrop */}
      {(servicesOpen || resourcesOpen) && (
        <div className="fixed inset-0 z-40 hidden md:block"
          style={{ background: 'rgba(0,0,0,0.5)', top: `${NAV_H}px` }}
          onClick={closeAll}
        />
      )}

      {/* Mobile fullscreen */}
      <div className={`fixed inset-0 z-40 bg-near-black md:hidden transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col h-full overflow-y-auto" style={{ padding: '5rem 2.5rem 2.5rem' }}>

          <p className="text-teal font-semibold uppercase mb-4" style={{ fontSize: '0.62rem', letterSpacing: '0.3em' }}>Services</p>
          <div className="flex flex-col mb-8">
            {SERVICE_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-white no-underline font-bold hover:text-teal transition-colors"
                style={{ fontSize: '1rem', paddingTop: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'block' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-teal font-semibold uppercase mb-4" style={{ fontSize: '0.62rem', letterSpacing: '0.3em' }}>Free Tools</p>
          <div className="flex flex-col mb-8">
            {TOOLS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-white no-underline font-bold hover:text-teal transition-colors"
                style={{ fontSize: '1rem', paddingTop: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'block' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-teal font-semibold uppercase mb-4" style={{ fontSize: '0.62rem', letterSpacing: '0.3em' }}>Articles</p>
          <div className="flex flex-col mb-8">
            {BLOG_HIGHLIGHTS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-white no-underline font-semibold hover:text-teal transition-colors"
                style={{ fontSize: '0.9rem', paddingTop: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'block' }}>
                {link.label}
              </Link>
            ))}
            <Link href="/blog" onClick={() => setOpen(false)}
              className="text-teal no-underline font-semibold hover:text-dark-teal transition-colors"
              style={{ fontSize: '0.8rem', paddingTop: '0.8rem', display: 'block' }}>
              View all articles →
            </Link>
          </div>

          <p className="text-teal font-semibold uppercase mb-4" style={{ fontSize: '0.62rem', letterSpacing: '0.3em' }}>More</p>
          <div className="flex flex-col mb-10">
            {NAV_LINKS_SIMPLE.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-white no-underline font-bold hover:text-teal transition-colors"
                style={{ fontSize: '1rem', paddingTop: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'block' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 pb-4" style={{ marginTop: 'auto' }}>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
              className="bg-teal text-white font-bold text-center no-underline block"
              style={{ padding: '1.1rem', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Book a Clarity Call →
            </a>
            <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} onClick={() => setOpen(false)}
              className="text-white font-light text-center no-underline block"
              style={{ padding: '0.9rem', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)' }}>
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-teal border-t border-dark-teal">
        <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center text-white font-bold no-underline w-full"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '1rem' }}>
          Book a Clarity Call →
        </a>
      </div>
    </>
  )
}
