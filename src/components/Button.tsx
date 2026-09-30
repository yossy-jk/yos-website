import React from 'react'
import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'outline-light'
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
    'inline-flex items-center justify-center',
    'rounded-lg',
    'font-semibold text-center no-underline',
    'transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none',
    'min-h-[56px] min-w-[160px]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' ')

  const variantStyles = {
    primary:       'bg-teal text-white hover:bg-dark-teal active:opacity-90',
    secondary:   'border border-white text-white hover:bg-white hover:text-near-black',
    dark:        'bg-near-black text-white hover:bg-charcoal',
    outline:     'border border-teal text-teal hover:bg-teal hover:text-white',
    'outline-light': 'border-2 border-white/70 text-white hover:bg-white/10 hover:border-white',
  }

  const sizeStyles = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-8 py-4 text-[1.0625rem]',
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
        <a href={href} className={combinedClassName} target="_blank" rel="noopener noreferrer nofollow">
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
    <button onClick={onClick} className={combinedClassName} disabled={disabled} type={type}>
      {children}
    </button>
  )
}
