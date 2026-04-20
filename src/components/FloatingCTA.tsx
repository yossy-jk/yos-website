'use client'
import { useState, useEffect } from 'react'
import { HUBSPOT } from '@/lib/constants'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={HUBSPOT.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-teal text-white font-bold rounded-full shadow-2xl hover:bg-dark-teal transition-all duration-300 no-underline"
      style={{
        padding: '0.85rem 1.5rem',
        fontSize: '0.72rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(1rem)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 8px 32px rgba(0,181,165,0.35)',
      }}
      aria-label="Book a call with Your Office Space"
    >
      <span className="w-2 h-2 rounded-full bg-white/70 flex-shrink-0" />
      Book a call
    </a>
  )
}
