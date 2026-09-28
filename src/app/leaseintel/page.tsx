import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import FadeIn from '@/components/FadeIn'
import { LockIcon, ShieldIcon, FolderIcon } from '@/components/Icons'
import { HUBSPOT } from '@/lib/constants'
import BookingCTA from '@/components/BookingCTA'

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export const metadata: Metadata = {
  title: 'LeaseIntel™ – Professional Lease Review | Your Office Space',
  description: 'Two ways to examine commercial lease risk: an educational self-check and a scoped LeaseIntel™ document review. Review scope, timing and fees are confirmed before work begins.',
  alternates: { canonical: 'https://www.yourofficespace.au/leaseintel' },
  openGraph: {
    title: 'LeaseIntel™ – Commercial Lease Review Newcastle | Your Office Space',
    description: 'Commercial lease risk review in NSW with plain-English explanation. Scope, timing and fees are confirmed before work begins.',
    url: 'https://www.yourofficespace.au/leaseintel',
    images: [{ url: '/og/og-leaseintel.png', width: 1200, height: 630, alt: 'LeaseIntel Commercial Lease Review Newcastle | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'LeaseIntel™ – Commercial Lease Review Newcastle | Your Office Space', description: 'Commercial lease risk review in NSW. Scope, timing and fees are confirmed before work begins.' },
}

/* ─── FAQ Data ────────────────────────────────────────────── */
const FAQS = [
  { q: 'What is LeaseIntel™?', a: 'LeaseIntel™ is a scoped commercial lease risk review. The agreed output can identify material obligations, explain commercial risks in plain English and set out questions or negotiation priorities for the next step.' },
  { q: 'How long does a LeaseIntel™ review take?', a: 'Timing depends on the document, complexity and agreed scope. The expected delivery date is confirmed before the review begins.' },
  { q: 'What does a LeaseIntel™ review cover?', a: 'We review all 12 risk categories in a standard commercial lease: rent and reviews, outgoings, make-good and reinstatement, assignment and subletting, permitted use, security deposit and bank guarantee, repairs and maintenance, relocation rights, default and termination, insurance obligations, special conditions, and options to renew. Every category is rated and explained.' },
  { q: 'What is the cost?', a: 'Fees depend on the document and agreed scope. Any fee, timing and payment terms are confirmed before the review begins.' },
  { q: 'Is my document secure?', a: 'Yes. Your lease document is encrypted with AES-256-GCM before it leaves your browser. It is scanned for malware before upload, stored in a secure OneDrive folder accessible only to your assigned reviewer, and never shared or retained beyond your engagement.' },
  { q: 'Who reviews my lease?', a: 'The accountable reviewer and scope are confirmed before work begins. LeaseIntel is a commercial risk assessment and does not replace legal advice.' },
  { q: 'Do I need a solicitor as well?', a: 'A LeaseIntel™ review is a commercial risk and negotiation assessment – not legal advice. For complex leases or significant financial commitments, we recommend a commercial solicitor in addition. We can refer you to experienced commercial solicitors in NSW.' },
  { q: 'What types of leases do you review?', a: 'We assess whether the lease type, jurisdiction and requested scope fit the service before accepting the work. Tenant representation is delivered within verified NSW licensing coverage.' },
  { q: 'Can I negotiate after receiving the report?', a: 'Yes – the negotiation roadmap identifies exactly which clauses to push back on, in priority order, with guidance on what landlords will accept in the current market. If you want us to negotiate on your behalf, that is covered under our tenant representation service.' },
  { q: 'What if I want to engage you for tenant representation after?', a: 'Any later tenant-representation engagement has its own documented scope, fee and licensing boundary. Any relationship between fees is confirmed in writing before engagement.' },
  { q: 'Can I use the educational self-check first?', a: 'Yes. The Lease Risk Review at yourofficespace.au/resources/lease-review is an educational self-check that does not require a document. It is not legal advice and does not replace a review of the actual lease.' },
  { q: 'How do I get started?', a: 'Submit an intake request at yourofficespace.au/lease-review. We confirm whether the matter fits the service, then confirm scope, reviewer, timing, fees and document handling before work begins.' },
]

/* ─── Schema ──────────────────────────────────────────────── */
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.yourofficespace.au/#organization",
      "name": "Your Office Space",
      "url": "https://www.yourofficespace.au",
      "logo": "https://www.yourofficespace.au/logo.png",
      "telephone": "+61434655511",
      "email": "jk@yourofficespace.au",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Newcastle",
        "addressRegion": "NSW",
        "postalCode": "2300",
        "addressCountry": "AU"
      }
    },
    {
      "@type": "Service",
      "name": "LeaseIntel™ Commercial Lease Review",
      "provider": { "@id": "https://www.yourofficespace.au/#organization" },
      "description": "Scoped commercial lease risk review with timing, fees and deliverables confirmed before work begins.",
      "areaServed": [{ "@type": "Country", "name": "Australia" }],
      "serviceType": "Commercial Lease Review",
      "url": "https://www.yourofficespace.au/leaseintel",
      "offers": { "@type": "Offer", "description": "Scope, timing and fees confirmed before engagement", "url": "https://www.yourofficespace.au/lease-review" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
    },
    {
      "@type": "WebApplication",
      "name": "LeaseIntel™ Lease Review Tool",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "description": "Scope, timing and fees confirmed before engagement" },
      "url": "https://www.yourofficespace.au/lease-review"
    }
  ]
}

const INCLUDED = [
  { title: 'All 12 risk categories', desc: 'Rent, make good, assignment, security, permitted use, outgoings, repairs, relocation, default, insurance, and special conditions, every clause rated.' },
  { title: 'Full RAG risk table', desc: 'Every clause rated Red / Amber / Green with plain-English explanation. No legal jargon.' },
  { title: 'Financial exposure summary', desc: 'Total rent, outgoings, make-good estimate, bank guarantee, and early exit cost in one table.' },
  { title: 'Negotiation roadmap', desc: 'Which clauses to push on, in priority order. What to ask for and what landlords will accept.' },
  { title: 'Exit scenario analysis', desc: 'How the lease plays out if you exit early, sell, sublet, or hold to expiry.' },
  { title: 'Your next move', desc: 'Three clear paths: sign / negotiate / do not sign, with specific steps for each outcome.' },
]

const SECURITY_ITEMS = [
  { icon: 'lock', title: 'AES-256-GCM encryption', desc: 'Your document is encrypted in your browser before upload. We never receive an unencrypted copy.' },
  { icon: 'shield', title: 'Malware scan on upload', desc: 'Every file is scanned against VirusTotal before it enters our system.' },
  { icon: 'folder', title: 'Secure OneDrive storage', desc: 'Documents are stored in a dedicated encrypted folder, accessed only by your assigned reviewer.' },
]

export default function LeaseIntelPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* Hero */}
      <section className="bg-near-black" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-sm px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-sm bg-teal" />
              <span className="font-semibold text-xs tracking-widest uppercase">Professional Lease Review</span>
            </div>
            <h1 className="text-white font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', maxWidth: '900px' }}>
              LeaseIntel™
            </h1>
            <p className="text-white/55 font-light leading-relaxed mb-4" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.35rem)', maxWidth: '640px', lineHeight: 1.8 }}>
              A scoped commercial lease risk review with the next decisions made clear.
            </p>
            <p className="text-white/40 font-light mb-10" style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', maxWidth: '580px', lineHeight: 1.8 }}>
              Deliverables, timing, reviewer and fees are confirmed before work begins.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button href="/lease-review" variant="primary" size="lg">
                Submit Your Lease
              </Button>
              <Button href={HUBSPOT.bookingUrl} variant="outline" size="lg" external>Talk to us first</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Two-tier product */}
      <section style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <p className="text-mid-grey font-light mb-10" style={{ fontSize: '1rem', maxWidth: '560px', lineHeight: 1.8 }}>
              Start with the educational self-check or request a review of the actual document.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free tier */}
            <FadeIn delay={0}>
              <div className="rounded-sm p-8 h-full flex flex-col" style={{ background: '#F7F8F8', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#10b981' }}>SELF-CHECK</span>
                  <span className="text-mid-grey font-light text-xs">|</span>
                  <span className="text-near-black font-semibold text-sm">Lease Risk Review</span>
                </div>
                <h3 className="text-near-black font-bold mb-3"
                     style={{ fontSize: 'clamp(1rem,2vw,1.35rem)', lineHeight: 1.3 }}>Instant risk rating. No document required.</h3>
                <p className="text-mid-grey font-light mb-2" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Answer 10 questions about your lease. Takes 3 minutes.</p>
                <p className="text-mid-grey font-light mb-8" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Get your Red / Amber / Green risk rating and the top 3 issues to watch, instantly. No upload, no payment, no waiting.</p>
                <div className="mt-auto">
                  <a href="/resources/lease-review"
                    className="inline-flex items-center justify-center font-bold text-white no-underline transition-colors"
                    style={{ background: '#10b981', padding: '0.85rem 2rem', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '0.5rem' }}>
                    Start the self-check →
                  </a>
                </div>
              </div>
            </FadeIn>
            {/* Paid tier */}
            <FadeIn delay={80}>
              <div className="rounded-sm p-8 h-full flex flex-col bg-near-black">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="text-teal text-xs font-black tracking-widest uppercase">SCOPED REVIEW</span>
                  <span className="text-white/30 font-light text-xs">|</span>
                  <span className="text-white font-semibold text-sm">Full LeaseIntel™ Report</span>
                </div>
                <h3 className="text-white font-bold mb-3" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>Document review built around the agreed scope.</h3>
                <p className="text-white/60 font-light mb-2" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Submit your actual lease document.</p>
                <p className="text-white/60 font-light mb-8" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>We confirm the deliverables, timing, reviewer, fees and document-handling approach before accepting the work.</p>
                <div className="mt-auto">
                  <a href="/lease-review"
                    className="inline-flex items-center justify-center font-bold text-white no-underline hover:bg-dark-teal transition-colors bg-teal"
                    style={{ padding: '0.85rem 2rem', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '0.5rem' }}>
                    Submit your lease →
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Scope confirmation banner */}
      <section style={{ ...SEC_SM, background: '#f0fdf9', borderTop: '3px solid #10b981', borderBottom: '3px solid #10b981' }}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <div style={{ maxWidth: '760px' }}>
              <p className="font-black mb-2" style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: '#0f766e' }}>Know the scope before sharing the document.</p>
              <p className="font-light" style={{ fontSize: 'clamp(0.9rem,1.8vw,1rem)', color: '#134e4a', lineHeight: 1.8 }}>
                Start with an intake request. We confirm suitability, scope, timing, fees and secure document handling before the review begins.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What's included */}
      <section style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)', background: '#FAFAFA' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-widest mb-4"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>What you receive</p>
            <h2 className="text-near-black font-bold leading-tight mb-6"
               style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)' }}>Everything you need to decide, and negotiate.</h2>
            <p className="text-mid-grey font-light mb-14" style={{ fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '600px' }}>
              This is not a checklist. It is a complete clause-by-clause analysis with a clear recommendation at the end.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INCLUDED.map((item, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="bg-white rounded-sm p-8 h-full" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-8 h-8 rounded-sm bg-teal/10 flex items-center justify-center mb-5">
                    <div className="w-3 h-3 rounded-sm bg-teal" />
                  </div>
                  <h3 className="text-near-black font-bold mb-3" style={{ fontSize: '1rem' }}>{item.title}</h3>
                  <p className="text-mid-grey font-light" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-widest mb-4"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>Document security</p>
            <h2 className="text-near-black font-bold leading-tight mb-10"
               style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)', maxWidth: '600px' }}>
              Your lease is confidential. We treat it that way.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SECURITY_ITEMS.map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex flex-col gap-6">
                  {s.icon === 'lock'    && <LockIcon size={36} />}
                  {s.icon === 'shield'  && <ShieldIcon size={36} />}
                  {s.icon === 'folder'  && <FolderIcon size={36} />}
                  <h3 className="text-near-black font-bold" style={{ fontSize: '1rem' }}>{s.title}</h3>
                  <p className="text-mid-grey font-light" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <section className="bg-teal" style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
            <h2 className="text-white font-bold leading-tight mb-5"
               style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
              Scope, timing and fees confirmed before work begins.
            </h2>
            <p className="text-white/80 font-light mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              Request a review and receive a written confirmation of the proposed deliverables and next step.
            </p>
            <Button href="/lease-review" variant="secondary" size="lg">
              Submit your lease
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)', background: '#FAFAFA' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-widest mb-4"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>Common questions</p>
            <h2 className="text-near-black font-bold leading-tight mb-10"
               style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)', maxWidth: '600px' }}>
              Everything you need to know about LeaseIntel™.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 40}>
                <div>
                  <h3 className="text-near-black font-bold mb-3" style={{ fontSize: '1rem' }}>{faq.q}</h3>
                  <p className="text-mid-grey font-light" style={{ fontSize: '0.92rem', lineHeight: 1.85 }}>{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
            <h2 className="text-white font-bold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
              Not ready to upload yet?
            </h2>
            <p className="text-white/60 font-light mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              Try the free Lease Risk Checker first. 10 questions, 3 minutes, instant risk rating.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button href="/resources/lease-review" variant="primary" size="lg">Free Lease Risk Checker</Button>
              <Button href={HUBSPOT.bookingUrl} variant="outline" size="lg" external>Book a call</Button>
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
      <BookingCTA label="Enquire" />
    </>
  )
}
