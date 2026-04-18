import Link from 'next/link'
import { CONTACT } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-near-black py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-black text-xs tracking-[0.2em] uppercase mb-3">Your Office Space</p>
            <p className="text-white/35 text-sm leading-relaxed font-light">
              Newcastle&apos;s commercial property team. Lease, fitout, furniture, cleaning.
            </p>
          </div>

          <div>
            <p className="text-white/50 font-bold text-[10px] tracking-[0.25em] uppercase mb-4">Services</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Tenant Rep', href: '/tenant-rep' },
                { label: 'Buyers Agency', href: '/buyers-agency' },
                { label: 'Furniture', href: '/furniture' },
                { label: 'Cleaning', href: '/cleaning' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 text-sm no-underline hover:text-white transition-colors font-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-white/50 font-bold text-[10px] tracking-[0.25em] uppercase mb-4">Resources</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Fitout Estimator', href: '/resources/fitout-estimator' },
                { label: 'Lease Review', href: '/resources/lease-review' },
                { label: 'Cap Rate Calc', href: '/resources/cap-rate-calculator' },
                { label: 'Blog', href: '/blog' },
                { label: 'Case Studies', href: '/case-studies' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 text-sm no-underline hover:text-white transition-colors font-light"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/50 font-bold text-[10px] tracking-[0.25em] uppercase mb-4">Contact</p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-white/40 text-sm no-underline hover:text-white transition-colors font-light"
              >
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="text-white/40 text-sm no-underline hover:text-white transition-colors font-light"
              >
                {CONTACT.phone}
              </a>
              <p className="text-white/25 text-sm font-light">{CONTACT.location}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-white/20 text-xs font-light">{CONTACT.license}</p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/company/your-office-space-au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 text-xs font-light no-underline hover:text-teal transition-colors tracking-wide"
            >
              LinkedIn →
            </a>
            <p className="text-white/20 text-xs font-light">© {new Date().getFullYear()} Your Office Space Pty Ltd</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
