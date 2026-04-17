'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NAV_LINKS, HUBSPOT } from '@/lib/constants'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-near-black shadow-2xl' : 'bg-near-black/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-white font-black text-xs tracking-[0.2em] no-underline z-50 relative uppercase"
          >
            Your Office Space
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-7 items-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/55 font-medium text-xs tracking-wider uppercase no-underline hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={HUBSPOT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal text-white font-bold text-xs px-5 py-3 rounded-sm hover:bg-dark-teal transition-colors duration-200 tracking-widest uppercase no-underline"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-50 flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span
              className="block w-6 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{ transform: open ? 'rotate(45deg) translateY(7px)' : 'none' }}
            />
            <span
              className="block w-6 h-[2px] bg-white transition-all duration-200"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-6 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{ transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-near-black flex flex-col justify-center px-8 md:hidden transition-all duration-300 ease-in-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col mt-16">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-white no-underline py-4 border-b border-white/10 hover:text-teal transition-all duration-200"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 7vw, 2.5rem)',
                letterSpacing: '-0.01em',
                transitionDelay: open ? `${i * 40}ms` : '0ms',
                transform: open ? 'translateY(0)' : 'translateY(12px)',
                opacity: open ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href={HUBSPOT.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="bg-teal text-white font-bold text-sm py-4 px-8 text-center no-underline tracking-widest uppercase rounded-sm"
          >
            Book a Free Call →
          </a>
          <p className="text-white/30 text-xs text-center tracking-wider">Newcastle & Hunter Valley</p>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-teal border-t border-dark-teal">
        <a
          href={HUBSPOT.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-white font-bold text-xs tracking-widest uppercase py-4 no-underline w-full"
        >
          Book a Free Clarity Call &rarr;
        </a>
      </div>
    </>
  )
}
