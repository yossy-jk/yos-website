import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact | Your Office Space',
  description: 'Talk to the Your Office Space team. 20 minutes, no pitch. Tenant-side commercial property advice across Australia.'
}

export default function ContactPage() {
  return (
    <>
      <Nav />

      {/* HERO — compact, no dead space */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>
              Commercial Property Advisory — Australia
            </p>
            <h1 className="text-white font-black uppercase leading-none tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.25rem,6vw,6rem)' }}>
              Let&apos;s talk.
            </h1>
            <p className="text-white/60 font-light leading-relaxed"
              style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
              20 minutes. No pitch. Just a conversation about your situation and whether we can help.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT — form + direct details */}
      <section className="bg-white" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* Left — contact form */}
            <FadeIn>
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Send a message</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
                  We&apos;ll come back to you<br />within one business day.
                </h2>

                {/* Contact Form — sends to HubSpot CRM + email */}
                <ContactForm />
                {false && <form
                  name="contact-legacy"
                  method="POST"
                  action={`https://formsubmit.co/${CONTACT.email}`}
                  className="flex flex-col gap-4"
                >
                  <input type="hidden" name="_subject" value="New enquiry — Your Office Space website" />
                  <input type="hidden" name="_next" value="https://yourofficespace.au/contact?sent=true" />
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
                      <option value="Buyers Agency">Buyers Agency</option>
                      <option value="Furniture & Fitout">Furniture &amp; Fitout</option>
                      <option value="Commercial Cleaning">Commercial Cleaning</option>
                      <option value="Lease Review">Lease Review</option>
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
                    className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors self-start"
                    style={{ padding: '1rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                  >
                    Send Message →
                  </button>
                </form>}
              </div>
            </FadeIn>

            {/* Right — direct contact */}
            <FadeIn delay={120}>
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Or reach us directly</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-8"
                  style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
                  Real people.<br />Real conversations.
                </h2>

                <div className="flex flex-col gap-6">
                  {/* Book a call */}
                  <div className="border border-gray-100 p-6">
                    <p className="text-teal font-bold uppercase tracking-widest mb-2" style={{ fontSize: '0.65rem' }}>Fastest option</p>
                    <p className="text-near-black font-black mb-2" style={{ fontSize: '1.05rem' }}>Book a Clarity Call</p>
                    <p className="text-charcoal font-light mb-4" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                      20 minutes. Pick a time that suits you and we will call.
                    </p>
                    <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                      className="bg-teal text-white font-bold no-underline inline-block hover:bg-dark-teal transition-colors"
                      style={{ padding: '0.85rem 1.75rem', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      Book a Call →
                    </a>
                  </div>

                  {/* Email */}
                  <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #00B5A5' }}>
                    <p className="text-mid-grey font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Email</p>
                    <a href={`mailto:${CONTACT.email}`}
                      className="text-teal font-bold no-underline hover:text-dark-teal transition-colors block mb-1"
                      style={{ fontSize: '1rem' }}>
                      {CONTACT.email}
                    </a>
                    <p className="text-charcoal font-light" style={{ fontSize: '0.85rem' }}>
                      We read everything. You will hear back within one business day.
                    </p>
                  </div>

                  {/* Phone */}
                  <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #00B5A5' }}>
                    <p className="text-mid-grey font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Phone</p>
                    <a href={`tel:${CONTACT.phone.replace(/\s+/g,'')}`}
                      className="text-teal font-bold no-underline hover:text-dark-teal transition-colors block mb-1"
                      style={{ fontSize: '1rem' }}>
                      {CONTACT.phone}
                    </a>
                    <p className="text-charcoal font-light" style={{ fontSize: '0.85rem' }}>
                      Call during business hours. We pick up the phone.
                    </p>
                  </div>

                  {/* Location */}
                  <div style={{ paddingLeft: '1rem', borderLeft: '1px solid #e5e7eb' }}>
                    <p className="text-mid-grey font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Based in</p>
                    <p className="text-near-black font-bold" style={{ fontSize: '1rem' }}>{CONTACT.location}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>What to expect</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-10"
              style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}>
              No pressure. No pitch.<br />Just a straight conversation.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'We listen', body: 'Tell us your situation. Current space, timeline, what\'s driving the decision. Real listening, no sales script.' },
              { num: '02', title: 'We assess', body: 'We\'ll tell you straight whether we can help. If we can\'t, we\'ll say so.' },
              { num: '03', title: 'We advise', body: 'If we can help, we\'ll explain how — timeline, process, and what it looks like to work together.' },
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

      <Footer />
    </>
  )
}
