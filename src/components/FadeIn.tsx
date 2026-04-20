'use client'
import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

// Premium easing — fast out, settles naturally (matches rb.com.au feel)
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

const INITIAL_TRANSFORM = {
  up: 'translateY(24px)',
  left: 'translateX(-24px)',
  right: 'translateX(24px)',
  none: 'none',
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Start visible — content is always readable (no flash of invisible content)
  // Animation is a progressive enhancement only
  const [visible, setVisible] = useState(true)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Only animate elements below the fold
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) return // already in view — skip animation

    setVisible(false)
    setAnimated(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : INITIAL_TRANSFORM[direction],
        transition: animated ? `opacity 0.6s ${EASING} ${delay}ms, transform 0.6s ${EASING} ${delay}ms` : 'none',
        willChange: (!visible && animated) ? 'opacity, transform' : 'auto',
      }}
    >
      {children}
    </div>
  )
}
