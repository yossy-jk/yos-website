import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import BookingCTA from '@/components/BookingCTA'
import { ENQUIRY } from '@/lib/constants'

export const metadata = withPageSeo({
  title: 'Space Planner | Your Office Space',
  description: 'The YOS online Space Planner is not available yet. Share your furniture brief with our team for a scoped quote.',
  alternates: { canonical: 'https://www.yourofficespace.au/tools/space-planner' },
  openGraph: {
    title: 'Space Planner | Your Office Space',
    description: 'The YOS online Space Planner is not available yet. Request a furniture quote from our team.',
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
    url: 'https://www.yourofficespace.au/tools/space-planner',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
})

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function SpacePlannerPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>
      {/* ─── SCHEMA ────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Office Space Planner | Your Office Space",
        "description": "The YOS online Space Planner is not available yet. Contact the team to discuss your furniture brief.",
        "url": "https://www.yourofficespace.au/tools/space-planner",
        "provider": ORGANIZATION_SCHEMA,
        "areaServed": { "@type": "Country", "name": "Australia" },
      }) }} />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', ...SEC }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(1,167,163,0.3)', padding: '0.4rem 1rem', borderRadius: 100, marginBottom: '2rem' }}>
              <span style={{ width: '0.35rem', height: '0.35rem', background: '#00B5A5', borderRadius: '50%', display: 'block' }} />
              <span style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Coming Soon</span>
            </div>
            <h1 style={{ color: '#ffffff', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '1.5rem', maxWidth: '16ch' }}>
              Space Planner
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '40rem', marginBottom: '3rem' }}>
              The online Space Planner is not available yet. You can share your room measurements, furniture requirements and timing with our team to request a quote.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a href={ENQUIRY.contactUrl} target="_blank" rel="noopener noreferrer"
                className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
                style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: '0.5rem', minHeight: '52px', display: 'inline-flex', alignItems: 'center' }}>Request a call</a>
              <a href="/resources/furniture-quote#furniture-quote-form"
                className="text-white/50 no-underline hover:text-white transition-colors"
                style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                Request a furniture quote →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ width: '0.35rem', height: '0.35rem', background: '#00B5A5', borderRadius: '50%', display: 'block' }} />
              <span style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Start with your brief</span>
            </div>
            <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: 'clamp(1.75rem,3.5vw,3rem)', letterSpacing: '-0.01em', marginBottom: '4rem' }}>
              Prepare your furniture enquiry
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
              {[
                { n: '01', title: 'Measure your space', body: 'Note room dimensions, doors, windows and access constraints. Include an existing plan if you have one.' },
                { n: '02', title: 'Describe the work', body: 'List who will use the space, the tasks they perform and the furniture you need to retain or replace.' },
                { n: '03', title: 'Request a scoped quote', body: 'Ask the team to confirm suitable products, availability, delivery, installation and exclusions for your brief.' },
              ].map(step => (
                <div key={step.n}>
                  <p style={{ color: '#00B5A5', fontWeight: 900, fontSize: '2.75rem', lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>{step.n}</p>
                  <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.875rem' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.8 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CONTACT / ALTERNATIVE CTA ─────────────────────── */}
      <section style={{ background: '#131313', paddingTop: 'clamp(5rem,10vw,8rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div style={{ background: 'rgba(1,167,163,0.06)', border: '1px solid rgba(1,167,163,0.2)', borderRadius: '1rem', padding: 'clamp(2rem,5vw,3.5rem)', textAlign: 'center', maxWidth: '36rem', margin: '0 auto' }}>
              <p style={{ color: '#00B5A5', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Ready to start now?
              </p>
              <h2 style={{ color: '#ffffff', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '-0.01em', marginBottom: '1rem', lineHeight: 1.2 }}>
                Talk to The Team instead
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                The Space Planner is coming. In the meantime, we can walk you through furniture options over a 30-minute call, no obligation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', alignItems: 'center' }}>
                <a href={ENQUIRY.contactUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
                  style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: '0.5rem', minHeight: '52px', display: 'inline-flex', alignItems: 'center', width: '100%', maxWidth: '20rem', justifyContent: 'center' }}>Request a call</a>
                <a href="tel:0240920733"
                  style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', textDecoration: 'none', letterSpacing: '0.05em' }}>
                  (02) 4092 0733
                </a>
                <a href="mailto:hello@yourofficespace.au"
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none', letterSpacing: '0.05em' }}>
                  hello@yourofficespace.au
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}><BookingCTA href="/contact?service=furniture#contact-enquiry" /></div>

      </main>

      <Footer />

    </>
  )
}
