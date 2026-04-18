import Nav from '@/components/Nav'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import HubSpotForm from '@/components/HubSpotForm'
import { HUBSPOT, CONTACT } from '@/lib/constants'

export const metadata = {
  title: 'Contact | Your Office Space — Newcastle Commercial Property Advisory',
  description: 'Talk to Joe Kelley at Your Office Space. 20 minutes, no pitch. Commercial property advice for Newcastle and Hunter Valley businesses.'
}

export default function ContactPage() {
  return (
    <>
      <Nav />

      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center pt-[72px] bg-near-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 w-full pt-16 pb-20">
          <FadeIn delay={0}>
            <p className="text-teal font-bold text-xs tracking-[0.28em] uppercase mb-6">Newcastle &amp; Hunter Valley</p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-2xl mb-6"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}>
              Let&apos;s talk.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/60 font-light leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>
              20 minutes. No pitch. Just a conversation about your space and whether we can help.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* HubSpot Contact Form */}
            <div className="flex flex-col">
              <h2 className="text-near-black font-bold text-3xl mb-6">Send us a message</h2>
              <p className="text-charcoal font-light text-lg leading-relaxed mb-8">
                Tell us what you&apos;re working on. We&apos;ll come back to you within one business day.
              </p>
              <HubSpotForm targetId="hs-contact-form" className="min-h-[200px]" />
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-mid-grey font-light text-sm mb-4">Prefer to book directly?</p>
                <Button href={HUBSPOT.bookingUrl} variant="primary" external>
                  Book a Clarity Call
                </Button>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="flex flex-col bg-warm-grey rounded-sm p-12">
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
        <div className="max-w-4xl mx-auto px-5 md:px-10">
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
        <div className="max-w-2xl mx-auto px-5 md:px-10">
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

      <Footer />
    </>
  )
}
