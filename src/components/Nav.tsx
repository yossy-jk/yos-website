'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { NAV_LINKS, SERVICE_LINKS, HUBSPOT, CONTACT } from '@/lib/constants'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-near-black border-b border-white/10' : 'bg-near-black/95 backdrop-blur-md'
      }`}>
        <div className="max-w-screen-xl mx-auto flex justify-between items-center h-16 md:h-20"
          style={{ paddingLeft: 'clamp(1.5rem, 6vw, 5rem)', paddingRight: 'clamp(1.5rem, 6vw, 5rem)' }}>

          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)}
            className="text-white font-black no-underline z-50 relative uppercase"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            Your Office Space
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 items-center">

            {/* Services dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="text-white/60 font-medium hover:text-white transition-colors duration-200 flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Services
                <svg style={{ width: '0.6rem', height: '0.6rem', transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel — full width, attached to nav bottom */}
              {servicesOpen && (
                <div
                  className="fixed left-0 right-0 bg-near-black border-b border-white/10 shadow-2xl z-50" ref={dropdownRef}
                  style={{ top: '80px' }}
                >
                  <div className="max-w-screen-xl mx-auto"
                    style={{ padding: '3rem clamp(2rem, 10vw, 10rem)' }}>
                    <div className="grid grid-cols-5 gap-px bg-white/8">
                      {SERVICE_LINKS.map(link => (
                        <Link key={link.href} href={link.href}
                          onClick={() => setServicesOpen(false)}
                          className="no-underline flex flex-col bg-near-black hover:bg-white/5 transition-colors duration-150"
                          style={{ padding: '1.75rem 1.5rem' }}>
                          <span className="text-white font-black uppercase tracking-tight block mb-2"
                            style={{ fontSize: '0.875rem' }}>
                            {link.label}
                          </span>
                          <span className="text-white/40 font-light leading-snug"
                            style={{ fontSize: '0.75rem' }}>
                            {link.tagline}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other nav links */}
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="text-white/60 font-medium hover:text-white transition-colors duration-200 no-underline"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {link.label}
              </Link>
            ))}

            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors duration-200 no-underline"
              style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.7rem 1.4rem' }}>
              Book a Call
            </a>
          </div>

          {/* Mobile hamburger */}
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

      {/* Desktop backdrop — shades page behind services dropdown */}
      {servicesOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          style={{ background: 'rgba(0,0,0,0.55)', top: '80px' }}
          onClick={() => setServicesOpen(false)}
        />
      )}

      {/* Mobile fullscreen overlay */}
      <div className={`fixed inset-0 z-40 bg-near-black md:hidden transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} style={{ display: 'flex', flexDirection: 'column', paddingTop: '4.5rem' }}>

        <nav style={{ padding: '2rem clamp(2rem, 8vw, 4rem) 0', flex: 1, overflowY: 'auto' }}>
          {/* Services group */}
          <p className="text-teal font-semibold uppercase tracking-[0.25em] mb-3"
            style={{ fontSize: '0.6rem' }}>Services</p>
          {SERVICE_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setOpen(false)}
              className="text-white no-underline block hover:text-teal transition-colors duration-200"
              style={{ fontWeight: 700, fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {link.label}
            </Link>
          ))}

          {/* Other links */}
          <p className="text-teal font-semibold uppercase tracking-[0.25em] mt-8 mb-3"
            style={{ fontSize: '0.6rem' }}>More</p>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setOpen(false)}
              className="text-white no-underline block hover:text-teal transition-colors duration-200"
              style={{ fontWeight: 700, fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div style={{ padding: '2rem clamp(2rem, 8vw, 4rem)' }}>
          <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="bg-teal text-white font-black text-center no-underline block"
            style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '1.1rem 2rem', marginBottom: '0.75rem' }}>
            Book a Clarity Call →
          </a>
          <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
            onClick={() => setOpen(false)}
            className="text-white/60 font-light text-center no-underline block"
            style={{ fontSize: '0.85rem', padding: '0.75rem 2rem', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.15)' }}>
            {CONTACT.phone}
          </a>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
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
