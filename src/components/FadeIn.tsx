'use client'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

// Content remains present at all times. Motion is progressive enhancement and
// never gates visibility during fast scrolling, printing or screenshot capture.
export default function FadeIn({ children, delay = 0, direction = 'up', className = '' }: FadeInProps) {
  const distance = direction === 'left' ? '-14px,0' : direction === 'right' ? '14px,0' : direction === 'none' ? '0,0' : '0,14px'
  return <div className={`safe-reveal ${className}`} style={{ '--reveal-delay': `${delay}ms`, '--reveal-distance': distance } as React.CSSProperties}>{children}</div>
}
