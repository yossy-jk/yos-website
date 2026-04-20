import Link from 'next/link'
import { CONTACT } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-near-black" style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
      <div
        className="max-w-screen-xl mx-auto"
        style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
      >
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 mb-14 md:mb-20">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-black uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.72rem' }}>
              Your Office Space
            </p>
            <p className="text-white/35 font-light leading-relaxed" style={{ fontSize: '0.875rem' }}>
              Australia&apos;s tenant-side commercial property team. Lease, fitout, furniture, cleaning.
            <span className="block mt-3 text-teal/70 italic" style={{ fontSize: '0.8rem' }}>We pick up the phone.</span>
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-white/40 font-bold uppercase tracking-[0.25em] mb-5" style={{ fontSize: '0.65rem' }}>Services</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Tenant Rep', href: '/tenant-rep' },
                { label: 'Buyers Agency', href: '/buyers-agency' },
                { label: 'Furniture & Fitout', href: '/furniture' },
                { label: 'Cleaning', href: '/cleaning' },
                { label: 'Lease Review', href: '/lease-review' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="text-white/35 font-light no-underline hover:text-white transition-colors"
                  style={{ fontSize: '0.875rem' }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <p className="text-white/40 font-bold uppercase tracking-[0.25em] mb-5" style={{ fontSize: '0.65rem' }}>Resources</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Resources', href: '/resources' },
                { label: 'Blog', href: '/blog' },
                { label: 'Case Studies', href: '/case-studies' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="text-white/35 font-light no-underline hover:text-white transition-colors"
                  style={{ fontSize: '0.875rem' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/40 font-bold uppercase tracking-[0.25em] mb-5" style={{ fontSize: '0.65rem' }}>Get in touch</p>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${CONTACT.email}`}
                className="text-white/35 font-light no-underline hover:text-white transition-colors"
                style={{ fontSize: '0.875rem' }}>
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="text-white/35 font-light no-underline hover:text-white transition-colors"
                style={{ fontSize: '0.875rem' }}>
                {CONTACT.phone}
              </a>
              <p className="text-white/20 font-light" style={{ fontSize: '0.875rem' }}>{CONTACT.location}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem' }}>
          <p className="text-white/20 font-light" style={{ fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Your Office Space Pty Ltd. All rights reserved.
          </p>
          <a
            href="https://www.linkedin.com/company/your-office-space-au"
            target="_blank" rel="noopener noreferrer"
            className="text-white/30 font-light no-underline hover:text-teal transition-colors"
            style={{ fontSize: '0.78rem' }}>
            LinkedIn →
          </a>
        </div>
      </div>
    </footer>
  )
}
