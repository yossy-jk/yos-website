import Link from 'next/link'
import { CONTACT, SERVICE_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-near-black" style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
      <div
        className="max-w-screen-xl mx-auto"
        style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}
      >
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-5 md:gap-10 mb-14 md:mb-16">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <p className="text-white font-bold tracking-[0.08em] mb-4" style={{ fontSize: '0.8rem' }}>
              Your Office Space
            </p>
            <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.875rem' }}>
              Newcastle-based, tenant-side commercial property advisory across Australia.
            <span className="block mt-3 text-teal italic" style={{ fontSize: '0.8rem' }}>One team. Clear direction. No guesswork.</span>
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-white/60 font-bold uppercase tracking-[0.25em] mb-5" style={{ fontSize: '0.65rem' }}>Services</p>
            <nav className="flex flex-col gap-3">
              {SERVICE_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="text-white/55 font-light no-underline hover:text-white transition-colors"
                  style={{ fontSize: '0.875rem' }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <p className="text-white/60 font-bold uppercase tracking-[0.25em] mb-5" style={{ fontSize: '0.65rem' }}>Resources</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Resources', href: '/resources' },
                { label: 'Blog', href: '/blog' },
                { label: 'Case Studies', href: '/case-studies' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="text-white/55 font-light no-underline hover:text-white transition-colors"
                  style={{ fontSize: '0.875rem' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/60 font-bold uppercase tracking-[0.25em] mb-5" style={{ fontSize: '0.65rem' }}>Get in touch</p>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${CONTACT.email}`}
                className="text-white/50 font-light no-underline hover:text-white transition-colors py-1"
                style={{ fontSize: '0.875rem' }}>
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="text-white/50 font-light no-underline hover:text-white transition-colors py-1"
                style={{ fontSize: '0.875rem' }}>
                {CONTACT.phone}
              </a>
              <p className="text-white/55 font-light" style={{ fontSize: '0.78rem', lineHeight: 1.8 }}>
                Newcastle-based · Hunter home territory<br />Australia-wide tenant advisory
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem' }}>
          <div className="flex flex-col gap-1">
            <p className="text-white/55 font-light" style={{ fontSize: '0.78rem' }}>
              © {new Date().getFullYear()} Your Office Space Pty Ltd. All rights reserved.
            </p>
            <p className="text-white/55 font-light" style={{ fontSize: '0.72rem' }}>
              NSW Real Estate Licence 20565455
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy"
              className="text-white/55 font-light no-underline hover:text-teal transition-colors"
              style={{ fontSize: '0.78rem' }}>
              Privacy Policy
            </Link>
            <Link href="/terms"
              className="text-white/55 font-light no-underline hover:text-teal transition-colors"
              style={{ fontSize: '0.78rem' }}>
              Terms
            </Link>
            <a
              href="https://www.linkedin.com/company/your-office-space-au"
              target="_blank" rel="noopener noreferrer"
              className="text-white/55 font-light no-underline hover:text-teal transition-colors"
              style={{ fontSize: '0.78rem' }}>
              LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
