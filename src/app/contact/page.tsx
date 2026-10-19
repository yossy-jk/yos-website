import DiscoveryBooking from '@/components/DiscoveryBooking'
import ServiceFaq from '@/components/ServiceFaq'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import Nav from '@/components/Nav'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { CONTACT } from '@/lib/constants'
import BookingCTA from '@/components/BookingCTA'
import FadeIn from '@/components/FadeIn'
import ContactForm from '@/components/ContactForm'
import { LOGO_URL, ORGANIZATION_ID, SERVICE_TYPES } from '@/lib/site-schema'

const SEC    = { paddingTop: 'clamp(4rem,7vw,7rem)', paddingBottom: 'clamp(4rem,7vw,7rem)' }
const PAD    = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }

export const metadata = withPageSeo({
  title: 'Contact Your Office Space | Tenant-Side Commercial Advisory',
  description: 'Talk to Your Office Space about tenant representation in NSW, FitOut and furniture Australia-wide, or commercial cleaning in Newcastle and Lake Macquarie.',
  alternates: { canonical: 'https://www.yourofficespace.au/contact' },
  twitter: { card: 'summary_large_image', title: 'Contact | Your Office Space', description: 'Get in touch with Your Office Space. First conversation is always free.' },
  openGraph: {
    title: 'Contact Your Office Space | Tenant-Side Commercial Advisory',
    description: 'Tenant representation in NSW, office FitOut and furniture Australia-wide, and commercial cleaning in Newcastle CBD and Lake Macquarie.',
    url: 'https://www.yourofficespace.au/contact',
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Contact Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
})

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string | string[]; from?: string | string[] }> }) {
  const params = await searchParams
  const initialService = Array.isArray(params.service) ? params.service[0] : params.service
  const requestedEntry = Array.isArray(params.from) ? params.from[0] : params.from
  const entryPage = requestedEntry && ['buyers-agency', 'office-fitout', 'furniture', 'commercial-construction', 'tenant-rep'].includes(requestedEntry) ? `/${requestedEntry}` : undefined

  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── SCHEMA ────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          ORGANIZATION_SCHEMA,
          {
            "@type": "ContactPage",
            "name": "Contact Your Office Space",
            "description": "Get in touch with Your Office Space about tenant representation, FitOut, furniture or commercial cleaning.",
            "url": "https://www.yourofficespace.au/contact"
          }
        ]
      }) }} />

      {/* HERO. compact, no dead space */}
      <section className="relative overflow-hidden bg-near-black" style={{ paddingTop: 'clamp(8rem,12vw,10rem)', paddingBottom: 'clamp(4rem,8vw,6rem)' }}>
        <Image src="/images/furniture/space-cogc-wide.jpg" alt="Contemporary commercial workplace" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-near-black/85" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>
              Based in Newcastle. Working Australia-wide.
            </p>
            <h1 className="text-white font-black uppercase leading-none tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.25rem,6vw,6rem)' }}>
              Let&apos;s talk.
            </h1>
            <p className="text-white/60 font-light leading-relaxed"
              style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
              A focused conversation about your situation and the decision in front of you.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT. form + direct details */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">

            {/* Left. contact form */}
            <FadeIn className="lg:col-span-7">
              <div id="contact-enquiry" tabIndex={-1} aria-labelledby="contact-enquiry-heading" className="enquiry-form-card rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-10" style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Send a message</p>
                <h2 id="contact-enquiry-heading" className="text-near-black font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
                  Tell us what you need.<br />We&apos;ll confirm the next step.
                </h2>

                {/* Contact form with direct YOS inbox delivery */}
                <ContactForm key={initialService || 'general'} initialService={initialService} entryPage={entryPage} />
                {false && <form
                  name="contact-legacy"
                  method="POST"
                  action={`https://formsubmit.co/${CONTACT.email}`}
                  className="flex flex-col gap-4"
                >
                  <input type="hidden" name="_subject" value="New enquiry. Your Office Space website" />
                  <input type="hidden" name="_next" value="https://www.yourofficespace.au/contact?sent=true" />
                  <input type="hidden" name="_captcha" value="true" />
                  <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-near-black font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                        Your name <span className="text-teal">*</span>
                      </label>
                      <input
                        type="text" name="name" required
                        placeholder="Jane Smith"
                        className="w-full border border-gray-200 focus:border-teal outline-none transition-colors font-light"
                        style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label className="block text-near-black font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                        Business name
                      </label>
                      <input
                        type="text" name="company"
                        placeholder="Acme Pty Ltd"
                        className="w-full border border-gray-200 focus:border-teal outline-none transition-colors font-light"
                        style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-near-black font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                        Email <span className="text-teal">*</span>
                      </label>
                      <input
                        type="email" name="email" required
                        placeholder="jane@company.com.au"
                        className="w-full border border-gray-200 focus:border-teal outline-none transition-colors font-light"
                        style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label className="block text-near-black font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                        Phone
                      </label>
                      <input
                        type="tel" name="phone"
                        placeholder="0400 000 000"
                        className="w-full border border-gray-200 focus:border-teal outline-none transition-colors font-light"
                        style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-near-black font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                      How can we help? <span className="text-teal">*</span>
                    </label>
                    <select
                      name="service" required
                      className="w-full border border-gray-200 focus:border-teal outline-none transition-colors font-light bg-white"
                      style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
                    >
                      <option value="">Select a service...</option>
                      <option value="Tenant Representation">Tenant Representation</option>
                      <option value="Commercial FitOut & Project Management">Commercial FitOut &amp; Project Management</option>
                      <option value="Office & Commercial Furniture">Office &amp; Commercial Furniture</option>
                      <option value="Commercial Cleaning">Commercial Cleaning</option>
                      <option value="General Enquiry">General Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-near-black font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                      Tell us about your situation <span className="text-teal">*</span>
                    </label>
                    <textarea
                      name="message" required rows={4}
                      placeholder="What are you working on? What's your timeline? What does success look like?"
                      className="w-full border border-gray-200 focus:border-teal outline-none transition-colors font-light resize-none"
                      style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', lineHeight: 1.6 }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.1em] min-h-[48px] rounded-[4px] w-full sm:w-auto"
                    style={{ padding: '0.9rem 3rem', fontSize: '0.72rem' }}
                  >
                    Send Message
                  </button>
                </form>
                }
              </div>
            </FadeIn>

            {/* Right. direct contact */}
            <FadeIn delay={120} className="lg:col-span-5">
              <div className="rounded-3xl bg-warm-grey p-7 sm:p-10 lg:sticky lg:top-28">
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Or reach us directly</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-8"
                  style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
                  Real people.<br />Real conversations.
                </h2>

                <div className="flex flex-col gap-6">
                  {/* Enquire */}
                  <div className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                    <p className="text-teal font-bold uppercase tracking-widest mb-2" style={{ fontSize: '0.65rem' }}>Fastest option</p>
                    <p className="text-near-black font-black mb-2" style={{ fontSize: '1.05rem' }}>Enquire</p>
                    <p className="text-charcoal font-light mb-4" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                      Use the form to share your workplace needs, timing and location.
                    </p>
            <Button href="#contact-enquiry" variant="primary" size="lg">
              Enquire
            </Button>
                  </div>

                  <DiscoveryBooking />

                  {/* Email */}
                  <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-mid-grey font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Email</p>
                    <a href={`mailto:${CONTACT.email}`}
                      className="text-teal font-bold no-underline hover:text-dark-teal transition-colors block mb-1"
                      style={{ fontSize: '1rem' }}>
                      {CONTACT.email}
                    </a>
                    <p className="text-charcoal font-light" style={{ fontSize: '0.85rem' }}>
                      We read every enquiry and confirm the appropriate next step.
                    </p>
                  </div>

                  {/* Phone */}
                  <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-mid-grey font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Phone</p>
                    <a href={`tel:${CONTACT.phone.replace(/\D/g,'')}`}
                      className="text-teal font-bold no-underline hover:text-dark-teal transition-colors block mb-1"
                      style={{ fontSize: '1rem' }}>
                      {CONTACT.phone}
                    </a>
                    <p className="text-charcoal font-light" style={{ fontSize: '0.85rem' }}>
                      Call during business hours. We pick up the phone.
                    </p>
                  </div>

                  {/* Location */}
                  <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-mid-grey font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Based in Newcastle</p>
                    <p className="text-near-black font-bold" style={{ fontSize: '1rem' }}>2 Portside Crescent, Maryville NSW 2293</p><p className="text-charcoal" style={{ marginTop: 8 }}>Visits by appointment. Working Australia-wide for fit out and furniture.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-warm-grey" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>What to expect</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-10"
              style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
              A clear first conversation.<br />A practical next step.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'We listen', body: 'Tell us your situation. Current space, timeline, what\'s driving the decision. Real listening, no sales script.' },
              { num: '02', title: 'We assess', body: 'We\'ll tell you straight whether we can help. If we can\'t, we\'ll say so.' },
              { num: '03', title: 'We advise', body: 'If we can help, we\'ll explain the timeline, process and what it looks like to work together.' },
              { num: '04', title: 'Your call', body: 'No pressure. Take your time. Good relationships start with honesty, not a hard close.' },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 60}>
                <div style={{ paddingTop: '1.5rem', borderTop: '2px solid #00B5A5' }}>
                  <p className="text-teal font-bold mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>{item.num}</p>
                  <p className="text-near-black font-black uppercase tracking-tight mb-3" style={{ fontSize: '1rem' }}>{item.title}</p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA label="Enquire" href="#contact-enquiry" />

      <ServiceFaq items={[{"question": "What should I include in an enquiry?", "answer": "Tell us which service you need, the location, approximate space or team size, your timing and any existing lease or project constraints. We use that information to confirm the next step."}, {"question": "Which areas does YOS cover?", "answer": "Tenant representation and commercial buying are available in NSW. FitOut and furniture can be coordinated Australia-wide. Commercial cleaning covers Newcastle CBD and Lake Macquarie."}]} />
      </main>

      <Footer />
    </>
  )
}
