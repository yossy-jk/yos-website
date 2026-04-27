import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'LeaseIntel™ — Professional Lease Review | Your Office Space',
  description: 'Two ways to know your lease risk. Free Lease Risk Review — 10 questions, instant Red/Amber/Green rating, no document required. Or the full LeaseIntel™ report — every clause analysed, $97 + GST, 24-hour turnaround.',
  alternates: { canonical: 'https://yourofficespace.au/leaseintel' },
  openGraph: {
    title: 'LeaseIntel™ — Commercial Lease Review | Your Office Space',
    description: 'Professional lease review in 24 hours. Every clause rated Red / Amber / Green with a full negotiation roadmap.',
    url: 'https://yourofficespace.au/leaseintel',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'LeaseIntel™ Lease Review', description: 'Professional commercial lease review. 24-hour turnaround. Every risk explained.' },
}

const FAQS = [
  { q: 'What is LeaseIntel™?', a: 'LeaseIntel™ is a professional commercial lease review service run by Your Office Space. You upload your lease document, we review every clause, and return a full risk report within 24 hours. Every clause is rated Red / Amber / Green with plain-English explanations, a financial exposure summary, and a negotiation roadmap.' },
  { q: 'How long does a LeaseIntel™ review take?', a: 'Standard turnaround is 24 hours from the time we receive your complete lease document. For complex leases — multiple tenancies, significant special conditions, or industrial leases — we may require up to 48 hours.' },
  { q: 'What does a LeaseIntel™ review cover?', a: 'We review all 12 risk categories in a standard commercial lease: rent and reviews, outgoings, make-good and reinstatement, assignment and subletting, permitted use, security deposit and bank guarantee, repairs and maintenance, relocation rights, default and termination, insurance obligations, special conditions, and options to renew. Every category is rated and explained.' },
  { q: 'What is the cost?', a: 'LeaseIntel™ is $97 + GST for a full report. No subscription, no ongoing commitment. Use the free lease risk checker at yourofficespace.au/resources/lease-review to get a quick headline rating first if you want.' },
  { q: 'Is my document secure?', a: 'Yes. Your lease document is encrypted with AES-256-GCM before it leaves your browser. It is scanned for malware before upload, stored in a secure OneDrive folder accessible only to your assigned reviewer, and never shared or retained beyond your engagement.' },
  { q: 'Who reviews my lease?', a: 'Your lease is reviewed by a licensed commercial property professional with direct experience in NSW commercial tenancy law and lease negotiation. This is a real review by a qualified person — not automated software.' },
  { q: 'Do I need a solicitor as well?', a: 'A LeaseIntel™ review is a commercial risk and negotiation assessment — not legal advice. For complex leases or significant financial commitments, we recommend a commercial solicitor in addition. We can refer you to experienced commercial solicitors in NSW.' },
  { q: 'What types of leases do you review?', a: 'All Australian commercial leases — office, retail (excluding small business retail under the Retail Leases Act), industrial, warehouse, and mixed-use. We specialise in NSW but review leases in all states and territories.' },
  { q: 'Can I negotiate after receiving the report?', a: 'Yes — the negotiation roadmap identifies exactly which clauses to push back on, in priority order, with guidance on what landlords will accept in the current market. If you want us to negotiate on your behalf, that is covered under our tenant representation service.' },
  { q: 'What if I want to engage you for tenant representation after?', a: 'The LeaseIntel™ fee is credited against our tenant representation engagement fee if you proceed. You never pay twice for the same work.' },
  { q: 'Can I get a free version first?', a: 'Yes. The free Lease Risk Review at yourofficespace.au/resources/lease-review takes 3 minutes. Answer 10 questions about your lease — no document required — and get an instant Red/Amber/Green risk rating plus the top 3 issues to watch. If you want the full picture after that, the complete LeaseIntel™ report is $97 at yourofficespace.au/lease-review. Submit your actual lease document and get a full clause-by-clause analysis within 24 hours.' },
  { q: 'How do I get started?', a: 'Upload your lease at yourofficespace.au/lease-review. Complete the short intake form, upload your document, and pay the $97 review fee. Full report delivered within 24 hours.' },
]

const INCLUDED = [
  { title: 'All 12 risk categories', desc: 'Rent, make good, assignment, security, permitted use, outgoings, repairs, relocation, default, insurance, and special conditions — every clause rated.' },
  { title: 'Full RAG risk table', desc: 'Every clause rated Red / Amber / Green with plain-English explanation. No legal jargon.' },
  { title: 'Financial exposure summary', desc: 'Total rent, outgoings, make-good estimate, bank guarantee, and early exit cost in one table.' },
  { title: 'Negotiation roadmap', desc: 'Which clauses to push on, in priority order. What to ask for and what landlords will accept.' },
  { title: 'Exit scenario analysis', desc: 'How the lease plays out if you exit early, sell, sublet, or hold to expiry.' },
  { title: 'Your next move', desc: 'Three clear paths: sign / negotiate / do not sign — with specific steps for each outcome.' },
]

const SECURITY_ITEMS = [
  { emoji: '🔒', title: 'AES-256-GCM encryption', desc: 'Your document is encrypted in your browser before upload. We never receive an unencrypted copy.' },
  { emoji: '🛡️', title: 'Malware scan on upload', desc: 'Every file is scanned against VirusTotal before it enters our system.' },
  { emoji: '📁', title: 'Secure OneDrive storage', desc: 'Documents are stored in a dedicated encrypted folder, accessed only by your assigned reviewer.' },
]

export default function LeaseIntelPage() {
  return (
    <>
      <Nav />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            'name': 'LeaseIntel™ Commercial Lease Review',
            'provider': { '@type': 'ProfessionalService', 'name': 'Your Office Space', 'url': 'https://yourofficespace.au' },
            'description': 'Professional commercial lease review service. 24-hour turnaround. Every clause rated Red/Amber/Green with financial exposure summary and negotiation roadmap.',
            'offers': { '@type': 'Offer', 'price': '97', 'priceCurrency': 'AUD', 'description': '$97 + GST for a full lease review report' },
            'areaServed': 'Australia',
          },
          {
            '@type': 'FAQPage',
            'mainEntity': FAQS.map(f => ({
              '@type': 'Question',
              'name': f.q,
              'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
            })),
          },
        ],
      })}} />

      {/* Hero */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(7rem,15vw,12rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal" />
              <span className="font-semibold text-xs tracking-widest uppercase">Professional Lease Review</span>
            </div>
            <h1 className="text-white font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', maxWidth: '900px' }}>
              LeaseIntel™
            </h1>
            <p className="text-white/55 font-light leading-relaxed mb-4" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.35rem)', maxWidth: '640px', lineHeight: 1.8 }}>
              A full commercial lease risk report — delivered within 24 hours.
            </p>
            <p className="text-white/40 font-light mb-10" style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', maxWidth: '580px', lineHeight: 1.8 }}>
              Every clause rated Red / Amber / Green. Financial exposure summarised. Negotiation roadmap included. $97 + GST.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/lease-review" variant="primary" size="lg">Submit Your Lease →</Button>
              <Button href={HUBSPOT.bookingUrl} variant="outline" size="lg" external>Talk to us first</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Two-tier product */}
      <section style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-mid-grey font-light mb-10" style={{ fontSize: '1rem', maxWidth: '560px', lineHeight: 1.8 }}>
              Two ways to know where you stand. Start free or go straight to the full report.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free tier */}
            <FadeIn delay={0}>
              <div className="rounded-2xl p-8 h-full flex flex-col" style={{ background: '#F7F8F8', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#10b981' }}>FREE</span>
                  <span className="text-mid-grey font-light text-xs">|</span>
                  <span className="text-near-black font-semibold text-sm">Lease Risk Review</span>
                </div>
                <h3 className="text-near-black font-bold mb-3" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>Instant risk rating. No document required.</h3>
                <p className="text-mid-grey font-light mb-2" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Answer 10 questions about your lease. Takes 3 minutes.</p>
                <p className="text-mid-grey font-light mb-8" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Get your Red / Amber / Green risk rating and the top 3 issues to watch — instantly. No upload, no payment, no waiting.</p>
                <div className="mt-auto">
                  <a href="/resources/lease-review"
                    className="inline-flex items-center justify-center font-bold text-white no-underline transition-colors"
                    style={{ background: '#10b981', padding: '0.85rem 2rem', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '0.5rem' }}>
                    Start free review →
                  </a>
                </div>
              </div>
            </FadeIn>
            {/* Paid tier */}
            <FadeIn delay={80}>
              <div className="rounded-2xl p-8 h-full flex flex-col bg-near-black">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="text-teal text-xs font-black tracking-widest uppercase">$97 + GST</span>
                  <span className="text-white/30 font-light text-xs">|</span>
                  <span className="text-white font-semibold text-sm">Full LeaseIntel™ Report</span>
                </div>
                <h3 className="text-white font-bold mb-3" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>Complete clause-by-clause analysis. 24-hour turnaround.</h3>
                <p className="text-white/60 font-light mb-2" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Submit your actual lease document.</p>
                <p className="text-white/60 font-light mb-8" style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>Every clause rated Red / Amber / Green. Financial exposure summarised. Negotiation roadmap included. Delivered within 24 hours.</p>
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

      {/* What's included */}
      <section style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)', background: '#FAFAFA' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>What you receive</p>
            <h2 className="text-near-black font-bold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>Everything you need to decide — and negotiate.</h2>
            <p className="text-mid-grey font-light mb-14" style={{ fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '600px' }}>
              This is not a checklist. It is a complete clause-by-clause analysis with a clear recommendation at the end.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INCLUDED.map((item, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="bg-white rounded-xl p-8 h-full" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center mb-5">
                    <div className="w-3 h-3 rounded-full bg-teal" />
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
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Document security</p>
            <h2 className="text-near-black font-bold leading-tight mb-14" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', maxWidth: '600px' }}>
              Your lease is confidential. We treat it that way.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SECURITY_ITEMS.map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex flex-col gap-4">
                  <div className="text-3xl">{s.emoji}</div>
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
            <h2 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
              $97 + GST. 24-hour turnaround. No obligation.
            </h2>
            <p className="text-white/80 font-light mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              Upload your lease and receive a complete risk report. If you engage us for tenant representation, the fee is credited.
            </p>
            <Button href="/lease-review" variant="secondary" size="lg">Submit your lease →</Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)', background: '#FAFAFA' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Common questions</p>
            <h2 className="text-near-black font-bold leading-tight mb-14" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', maxWidth: '600px' }}>
              Everything you need to know about LeaseIntel™.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
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
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/resources/lease-review" variant="primary" size="lg">Free Lease Risk Checker</Button>
              <Button href={HUBSPOT.bookingUrl} variant="outline" size="lg" external>Book a call</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
