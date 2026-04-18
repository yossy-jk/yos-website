import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

export default function NotFound() {
  return (
    <>
      <Nav />
      <section className="bg-near-black min-h-screen flex items-center pt-[72px]">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-28 text-center">
          <p className="text-teal font-bold text-xs tracking-[0.28em] uppercase mb-6">404</p>
          <h1 className="text-white font-black leading-[0.95] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
            This page doesn&apos;t exist.
          </h1>
          <p className="text-white/55 font-light text-lg leading-relaxed mb-12 max-w-md mx-auto">
            If you were looking for a specific service or resource, use the links below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/"
              className="bg-teal text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-dark-teal transition-colors no-underline text-center"
            >
              Back to Home
            </Link>
            <a
              href={HUBSPOT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:border-teal hover:text-teal transition-colors no-underline text-center"
            >
              Book a Clarity Call
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Tenant Rep', href: '/tenant-rep' },
              { label: 'Buyers Agency', href: '/buyers-agency' },
              { label: 'Furniture', href: '/furniture' },
              { label: 'Cleaning', href: '/cleaning' },
              { label: 'Lease Review', href: '/lease-review' },
              { label: 'Resources', href: '/resources' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-white/10 text-white/50 font-light text-xs px-4 py-3 rounded-sm hover:border-teal hover:text-teal transition-colors no-underline text-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
