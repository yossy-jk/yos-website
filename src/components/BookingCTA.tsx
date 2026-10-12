import Link from 'next/link'

interface Props {
  label?: string
  href?: string
  variant?: 'primary' | 'outline' | 'white'
  size?: 'default' | 'lg'
  className?: string
}

/** Enquiry actions take visitors directly to a usable form. Calendar links stay explicit. */
export default function BookingCTA({
  label = 'Enquire',
  href = '/contact#contact-enquiry',
  variant = 'primary',
  size = 'default',
  className = '',
}: Props) {
  const colors = variant === 'primary' ? 'bg-teal text-white hover:bg-dark-teal' :
    variant === 'white' ? 'bg-white text-near-black hover:bg-white/90' :
    'border border-white/30 text-white/70 hover:text-teal hover:border-teal'

  return <Link href={href} className={`${colors} w-full sm:w-auto ${className}`} style={{
    padding: size === 'lg' ? '1.1rem 3rem' : '0.9rem 2.25rem',
    fontSize: '0.72rem', borderRadius: '0.5rem', letterSpacing: '0.02em',
    fontWeight: 700, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', minHeight: '48px', textDecoration: 'none',
  }}>{label}</Link>
}
