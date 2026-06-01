'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SpacePlannerPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {/* Accent bar */}
        <div style={{
          width: 40,
          height: 4,
          background: '#00B5A5', transition: 'background 0.15s',
          borderRadius: 2,
          margin: '0 auto 2rem',
        }} />

        {/* Coming Soon */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(0, 181, 165, 0.1)',
          border: '1px solid rgba(0, 181, 165, 0.25)',
          borderRadius: 100,
          padding: '0.35rem 0.9rem',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#00B5A5',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Coming Soon
          </span>
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#F7F6F4',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: '1rem',
        }}>
          Space Planner
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: '#9B9B9B',
          fontFamily: 'Montserrat, sans-serif',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }}>
          We&apos;re building a tool that lets you draw your floor plan and drag furniture into it — then get a quote on the spot. It&apos;ll be ready soon.
        </p>

        {/* Horizontal rule */}
        <div style={{
          borderTop: '1px solid #222',
          marginBottom: '1.5rem',
        }} />

        <p style={{
          fontSize: '0.82rem',
          color: '#6B6B6B',
          fontFamily: 'Montserrat, sans-serif',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          Need a quote now? Browse our furniture range or talk to The Team directly.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}>
          <Link
            href="/furniture"
            style={{
              display: 'block',
              background: '#00B5A5', transition: 'background 0.15s',
              color: '#FFFFFF',
              borderRadius: 8,
              padding: '1.1rem 2rem', minHeight: '60px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Browse Furniture
          </Link>

          <Link
            href="/contact"
            style={{
              display: 'block',
              background: 'transparent',
              color: '#9B9B9B',
              borderRadius: 8,
              padding: '1.1rem 2rem',
              minHeight: '60px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #2A2A2A',
              cursor: 'pointer',
            }}
          >
            Talk to The Team
          </Link>

          <Link
            href="/"
            style={{
              display: 'block',
              color: '#4B4B4B',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.78rem',
              textDecoration: 'none',
              textAlign: 'center',
              paddingTop: '0.5rem',
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}