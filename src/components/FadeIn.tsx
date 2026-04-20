'use client'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

// Animations temporarily disabled — content must be visible at all times.
// Scroll animations to be re-added once design is finalised.
export default function FadeIn({
  children,
  className = '',
}: FadeInProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
