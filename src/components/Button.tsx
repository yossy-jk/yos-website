import React from 'react'
import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  external = false,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseStyles = [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg',
    'font-bold uppercase tracking-[0.14em] text-center no-underline',
    // Transitions — no scale bounce, just colour shift
    'transition-colors duration-200 ease-out',
    // Minimum touch target
    'min-h-[52px]',
    // Focus ring for keyboard navigation
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
    // Disabled state
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' ')

  const variantStyles = {
    primary:   'bg-teal text-white hover:bg-dark-teal',
    secondary: 'border border-white text-white hover:bg-white hover:text-near-black',
    dark:      'bg-near-black text-white hover:bg-charcoal',
    outline:   'border border-teal text-teal hover:bg-teal hover:text-white',
  }

  const sizeStyles = {
    sm: 'px-6 py-3 text-[0.68rem]',
    md: 'px-8 py-4 text-[0.7rem]',
    lg: 'px-14 py-[1.25rem] text-[0.72rem]',
  }

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ')

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className={combinedClassName}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
