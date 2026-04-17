import Link from 'next/link'
import { CONTACT } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-black py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5%">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <p className="text-white font-bold text-sm tracking-widest mb-3 uppercase">Your Office Space</p>
            <p className="text-mid-grey font-light text-sm leading-relaxed">
              Newcastle&apos;s commercial property team. Lease, fitout, furniture, cleaning.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">Services</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Tenant Rep', href: '/tenant-rep' },
                { label: 'Buyers Agency', href: '/buyers-agency' },
                { label: 'Furniture', href: '/furniture' },
                { label: 'Cleaning', href: '/cleaning' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-mid-grey text-sm no-underline hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">Resources</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Lease Review Tool', href: '/resources/lease-review' },
                { label: 'Fitout Estimator', href: '/resources/fitout-estimator' },
                { label: 'Cap Rate Calculator', href: '/resources/cap-rate-calculator' },
                { label: 'Lease Comparison', href: '/resources/lease-comparison' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-mid-grey text-sm no-underline hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">Contact</p>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${CONTACT.email}`} className="text-mid-grey text-sm no-underline hover:text-white transition-colors">
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} className="text-mid-grey text-sm no-underline hover:text-white transition-colors">
                {CONTACT.phone}
              </a>
              <p className="text-mid-grey text-sm">{CONTACT.location}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-mid-grey text-xs">{CONTACT.license}</p>
          <p className="text-mid-grey text-xs">© {new Date().getFullYear()} Your Office Space Pty Ltd</p>
        </div>
      </div>
    </footer>
  )
}
