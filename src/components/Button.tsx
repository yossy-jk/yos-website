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
    'font-bold tracking-wide text-center no-underline',
    'rounded-sm',
    // Smooth transitions on all properties including transform
    'transition-all duration-200 ease-out',
    // Micro-interactions: lift on hover, depress on click
    'hover:scale-[1.03] active:scale-[0.97]',
    // Minimum touch target
    'min-h-[44px]',
    // Focus ring for keyboard navigation
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
    // Disabled state
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100',
  ].join(' ')

  const variantStyles = {
    primary: 'bg-teal text-white hover:bg-dark-teal shadow-sm hover:shadow-md',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-near-black',
    dark: 'bg-near-black text-white hover:bg-charcoal shadow-sm hover:shadow-md',
    outline: 'border-2 border-teal text-teal hover:bg-teal hover:text-white',
  }

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4 text-base',
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
