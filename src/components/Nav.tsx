'use client'
import Link from 'next/link'
import { useState } from 'react'
import { NAV_LINKS, HUBSPOT } from '@/lib/constants'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-near-black/97 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5% flex justify-between items-center h-72px">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-bold text-lg tracking-wider no-underline"
        >
          YOUR OFFICE SPACE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-mid-grey font-normal text-sm no-underline hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={HUBSPOT.bookingUrl}
            className="bg-teal text-white font-semibold text-sm px-5 py-2.5 rounded hover:bg-dark-teal transition-colors duration-200 tracking-wide no-underline"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden bg-transparent border-none text-white cursor-pointer text-2xl p-2"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-near-black border-t border-white/5 px-5% py-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-mid-grey font-normal text-base no-underline py-3 border-b border-white/5 hover:text-white transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={HUBSPOT.bookingUrl}
            className="inline-block mt-4 bg-teal text-white font-semibold text-sm px-6 py-3 rounded hover:bg-dark-teal transition-colors duration-200 no-underline"
          >
            Book a Call
          </a>
        </div>
      )}
    </nav>
  )
}
