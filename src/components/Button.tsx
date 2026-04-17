import React from 'react'
import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
  external?: boolean
}

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  external = false
}: ButtonProps) {
  const baseStyles = 'inline-block font-semibold rounded text-center no-underline transition-colors duration-200 tracking-wide'
  
  const variantStyles = {
    primary: 'bg-teal text-white hover:bg-dark-teal',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-near-black',
    dark: 'bg-near-black text-white hover:bg-charcoal'
  }
  
  const sizeStyles = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg'
  }
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  
  if (href) {
    if (external) {
      return (
        <a href={href} className={combinedClassName}>
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
    <button onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  )
}
