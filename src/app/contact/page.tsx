import Link from 'next/link'
import Nav from '@/components/Nav'
import Button from '@/components/Button'
import { HUBSPOT, CONTACT } from '@/lib/constants'

export default function ContactPage() {
  return (
    <>
      <Nav />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-72px bg-near-black">
        <div className="max-w-7xl mx-auto px-5% w-full pt-20">
          <h1 className="text-white font-bold text-7xl lg:text-8xl leading-tight tracking-tight max-w-2xl mb-6">
            Let&apos;s talk.
          </h1>
          <p className="text-white/70 font-light text-2xl leading-relaxed max-w-2xl">
            20 minutes. No pitch. Just a conversation about your space and whether we can help.
          </p>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5%">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Book a Call */}
            <div className="flex flex-col">
              <h2 className="text-near-black font-bold text-3xl mb-6">Book a Clarity Call</h2>
              <p className="text-charcoal font-light text-lg leading-relaxed mb-8">
                Select a time that works for you. We&apos;ll dial in and talk through your situation — what you&apos;re trying to build, where you&apos;re stuck, and whether YOS is the right fit.
              </p>
              <p className="text-mid-grey font-light text-sm mb-6">
                Calls are typically 20–30 minutes and run via Zoom or phone — your choice.
              </p>
              <div>
                <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
                  Book a Call
                </Button>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="flex flex-col bg-warm-grey rounded-lg p-12">
              <h2 className="text-near-black font-bold text-3xl mb-8">Direct Contact</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-mid-grey font-semibold text-sm tracking-widest uppercase mb-2">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-teal font-semibold text-xl no-underline hover:text-dark-teal transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                  <p className="text-mid-grey font-light text-sm mt-2">
                    Send an email anytime. Joe reads everything that comes in.
                  </p>
                </div>

                <div className="border-t border-gray-300 pt-8">
                  <p className="text-mid-grey font-semibold text-sm tracking-widest uppercase mb-2">Phone</p>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                    className="text-teal font-semibold text-xl no-underline hover:text-dark-teal transition-colors"
                  >
                    {CONTACT.phone}
                  </a>
                  <p className="text-mid-grey font-light text-sm mt-2">
                    Call during business hours. Expect a real person on the other end.
                  </p>
                </div>

                <div className="border-t border-gray-300 pt-8">
                  <p className="text-mid-grey font-semibold text-sm tracking-widest uppercase mb-2">Location</p>
                  <p className="text-near-black font-semibold text-lg">
                    {CONTACT.location}
                  </p>
                  <p className="text-mid-grey font-light text-sm mt-2">
                    Based in Newcastle. We know the market inside out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-4xl mx-auto px-5%">
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-16">
            What to expect.
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-near-black font-bold text-2xl mb-4">First conversation</h3>
              <p className="text-charcoal font-light text-lg leading-relaxed">
                We&apos;ll ask about your situation. Current space, timeline, what&apos;s driving the decision, what success looks like. No sales pitch. Real listening.
              </p>
            </div>

            <div>
              <h3 className="text-near-black font-bold text-2xl mb-4">Honest assessment</h3>
              <p className="text-charcoal font-light text-lg leading-relaxed">
                We&apos;ll tell you straight whether we can help. If we can&apos;t, we&apos;ll say so. If we can, we&apos;ll explain how and what it looks like.
              </p>
            </div>

            <div>
              <h3 className="text-near-black font-bold text-2xl mb-4">Next steps</h3>
              <p className="text-charcoal font-light text-lg leading-relaxed">
                If it makes sense to move forward, we&apos;ll outline what happens next — timeline, fee structure (if applicable), and what you&apos;ll need to do on your end.
              </p>
            </div>

            <div>
              <h3 className="text-near-black font-bold text-2xl mb-4">No pressure</h3>
              <p className="text-charcoal font-light text-lg leading-relaxed">
                Take your time. Think it over. We&apos;ll be here if you want to talk more. Good business relationships start with a real conversation, not a hard close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-near-black py-28 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto px-5%">
          <h2 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-6">
            Ready?
          </h2>
          <p className="text-white/70 font-light text-xl leading-relaxed mb-12">
            Pick your method above and let&apos;s get started.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button href={HUBSPOT.bookingUrl} variant="primary" external>
              Book a Call
            </Button>
            <Button href={`mailto:${CONTACT.email}`} variant="secondary" external>
              Send an Email
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-5%">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
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
                  { label: "Tenant Rep", href: "/tenant-rep" },
                  { label: "Buyers Agency", href: "/buyers-agency" },
                  { label: "Furniture", href: "/furniture" },
                  { label: "Cleaning", href: "/cleaning" }
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
              <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">Contact</p>
              <div className="flex flex-col gap-2">
                <a href={`mailto:${CONTACT.email}`} className="text-mid-grey text-sm no-underline hover:text-white transition-colors">
                  {CONTACT.email}
                </a>
                <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className="text-mid-grey text-sm no-underline hover:text-white transition-colors">
                  {CONTACT.phone}
                </a>
                <p className="text-mid-grey text-sm">{CONTACT.location}</p>
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">More</p>
              <Link href="/" className="text-mid-grey text-sm no-underline hover:text-white transition-colors block">
                Home
              </Link>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-mid-grey text-xs">{CONTACT.license}</p>
            <p className="text-mid-grey text-xs">© {new Date().getFullYear()} Your Office Space Pty Ltd</p>
          </div>
        </div>
      </footer>
    </>
  )
}
