import Link from 'next/link'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'

const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const SEC_SM = { paddingTop: 'clamp(2.5rem,5vw,4rem)',   paddingBottom: 'clamp(2.5rem,5vw,4rem)' }
import NotForProfitForm from '@/components/NotForProfitForm'
import FadeIn from '@/components/FadeIn'
import { CONTACT } from '@/lib/constants'

export const metadata = withPageSeo({
  title: 'Free Lease Support for Not-for-Profits | Your Office Space Newcastle',
  description: 'Pro bono lease reviews and relocation search for not-for-profits in Newcastle and the Hunter. No fee, no obligation. Limited spots available. Apply now.',
  alternates: { canonical: 'https://www.yourofficespace.au/not-for-profit-lease-support' },
  twitter: { card: 'summary_large_image', title: 'Free Lease Support for Not-for-Profits | Your Office Space', description: 'Pro bono lease reviews for not-for-profits in Newcastle and the Hunter. No fee, no obligation.' },
  openGraph: {
    title: 'Free Lease Support for Not-for-Profits | Your Office Space',
    description: 'Pro bono lease reviews and relocation search for not-for-profits. No fee, no obligation. Limited spots available in Newcastle and the Hunter.',
    url: 'https://www.yourofficespace.au/not-for-profit-lease-support',
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Free Lease Support for Not-for-Profits, Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
})


const FAQ_SCHEMA = [
  {
    q: 'What should our organisation check about make-good?',
    a: 'Gather the signed lease, variations, entry condition report and records of any alterations. Ask your solicitor to identify the actual reinstatement obligations, then obtain a site-specific scope and costed contractor advice. A generic allowance is not a quote for your premises.',
  },
  {
    q: 'How can we plan for rent changes?',
    a: 'Record each review date and the written review method. Ask your adviser to explain any assumptions or unresolved terms, and model the effect on your operating budget alongside outgoings and other occupancy costs. Keep estimates separate from confirmed amounts.',
  },
  {
    q: 'What should we ask about lease security?',
    a: 'List the proposed security amount, form, funding cost and release conditions. Ask your solicitor and finance adviser how those requirements affect your organisation and what alternatives can be put to the landlord. A requested change is not an agreed concession.',
  },
  {
    q: 'What if our organisation needs to move or restructure?',
    a: 'Explain the possible change before committing. Ask your solicitor to check the actual assignment, subletting, permitted-use and exit provisions, including any consent requirements. Connect the advice with a relocation brief and the decisions your board needs to make.',
  },
]


export default function NotForProfitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          ORGANIZATION_SCHEMA,
          {
            "@type": "FAQPage",
            "@id": "https://www.yourofficespace.au/not-for-profit-lease-support/#faq",
            "mainEntity": FAQ_SCHEMA.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": { "@type": "Answer", "text": item.a },
            })),
          },
        ],
      }) }} />

      {/* ─── HERO ─────────────────────────────────── */}
      <section className="bg-near-black" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-5" style={{ fontSize: '0.72rem' }}>
              Pro Bono Programme, Newcastle &amp; Hunter
            </p>
            <h1 className="text-white font-black uppercase leading-none tracking-tight mb-6"
              style={{ fontSize: 'clamp(2rem,5vw,4.5rem)' }}>
              Your office lease.<br />
              <span style={{ color: '#00B5A5' }}>Our expertise.</span><br />
              No cost to you.
            </h1>
            <p className="text-white/60 font-light leading-relaxed mb-8"
              style={{ fontSize: '1.05rem', maxWidth: '38rem', lineHeight: 1.8 }}>
              Your Office Space is offering pro bono lease reviews and relocation search services to not-for-profits across Newcastle and the Hunter. Limited spots available.
            </p>
            <a href="#apply"
              className="inline-block bg-teal text-near-black font-bold uppercase tracking-widest px-8 py-4 transition-all duration-200 hover:bg-teal/90"
              style={{ fontSize: '0.72rem', letterSpacing: '0.2em' }}>
              Apply now
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHAT'S ON OFFER ───────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Two ways we can help</p>
            <h2 className="text-near-black font-black uppercase mb-12 leading-tight"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
              Pick what fits<br />your situation.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1, Lease Review */}
            <FadeIn delay={0}>
              <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0.75rem', padding: 'clamp(2rem,4vw,3.5rem)', }}>
                <div className="bg-near-black text-teal font-bold uppercase tracking-widest px-3 py-1.5 inline-block mb-6"
                  style={{ fontSize: '0.65rem' }}>
                  Option 1
                </div>
                <h3 className="text-near-black font-black uppercase mb-4 leading-tight"
                  style={{ fontSize: 'clamp(1.3rem,2.5vw,1.75rem)' }}>
                  Pro Bono<br />Lease Review
                </h3>
                <p className="text-mid-grey font-light leading-relaxed mb-8"
                  style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>
                  Already in a lease? We will review it properly, identifying your highest-risk clauses, financial exposure, and whether you are getting a fair deal. Same professional standard as our paying clients.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    'Full risk analysis, Red / Amber / Green ratings',
                    'Financial exposure headline figure',
                    'Top 3 clauses to address',
                    'Make-good cost estimate',
                    'Exit scenario overview',
                    'Plain-English, no legal jargon',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-charcoal font-light"
                      style={{ fontSize: '0.9rem' }}>
                      <span className="text-teal font-bold mt-0.5 flex-shrink-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-charcoal font-light font-semibold" style={{ fontSize: '0.8rem' }}>
                  No YOS professional fee for an accepted pro bono lease review.
                </p>
              </div>
            </FadeIn>

            {/* Card 2, Relocation Search */}
            <FadeIn delay={100}>
              <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0.75rem', padding: 'clamp(2rem,4vw,3.5rem)', background: '#0A0A0A' }}>
                <div className="bg-teal text-near-black font-bold uppercase tracking-widest px-3 py-1.5 inline-block mb-6"
                  style={{ fontSize: '0.65rem' }}>
                  Option 2
                </div>
                <h3 className="text-white font-black uppercase mb-4 leading-tight"
                  style={{ fontSize: 'clamp(1.3rem,2.5vw,1.75rem)' }}>
                  Pro Bono<br />Relocation Search
                </h3>
                <p className="text-white/55 font-light leading-relaxed mb-8"
                  style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>
                  Need a new space? We will run the full search, identifying options, negotiating terms, and managing the deal through to signing. Tenant representation, done properly.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    'Property search tailored to your brief',
                    'Market intel and rental comparison',
                    'Lease negotiation on your behalf',
                    'Headlease and sublease review',
                    'Make-good and incentives negotiation',
                    'Settlement and handover support',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-white/75 font-light"
                      style={{ fontSize: '0.9rem' }}>
                      <span className="text-teal font-bold mt-0.5 flex-shrink-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-white/40 font-light font-semibold" style={{ fontSize: '0.8rem' }}>
                  No YOS professional fee for an accepted pro bono relocation search.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── WHO QUALIFIES ─────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Eligibility</p>
                <h2 className="text-white font-black uppercase mb-6 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                  Who qualifies<br />for this programme?
                </h2>
                <p className="text-white/55 font-light leading-relaxed mb-8"
                  style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  This programme is open to registered not-for-profits, charities, and community organisations operating in Newcastle and the Hunter region. You need to be either in a commercial lease or actively searching for space.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <div className="flex flex-col gap-5">
                {[
                  { label: 'Registered charity or not-for-profit', detail: 'ACNC registered or equivalent. We may ask to see your registration.' },
                  { label: 'Currently in a lease', detail: 'Commercial lease in Newcastle or the Hunter, or about to sign one.' },
                  { label: 'Or actively searching for space', detail: 'Actively looking to move, expand, or establish your first commercial premises.' },
                  { label: 'Small to medium organisation', detail: 'Typically under 50 staff. We make no promises, but that is the general shape.' },
                  { label: 'No prior Your Office Space engagement', detail: 'This offer is for new clients only.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-teal pl-5">
                    <p className="text-white font-semibold mb-1" style={{ fontSize: '0.9rem' }}>{item.label}</p>
                    <p className="text-white/40 font-light" style={{ fontSize: '0.82rem' }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Practical questions shared with the FAQ structured data. */}
      <section id="faq" className="bg-white" style={SEC} aria-labelledby="lease-questions-heading">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p className="text-action-teal font-semibold uppercase tracking-widest" style={{ fontSize: '0.72rem', marginBottom: '1rem' }}>Before the next lease decision</p>
          <h2 id="lease-questions-heading" className="text-near-black font-black leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)', marginBottom: '2rem' }}>Questions for your lease, budget and board.</h2>
          <div className="max-w-3xl" style={{ display: 'grid', gap: '1.5rem' }}>
            {FAQ_SCHEMA.map(item => <article key={item.q} className="border-t border-charcoal/10" style={{ paddingTop: '1.5rem' }}>
              <h3 className="text-near-black font-bold" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{item.q}</h3>
              <p className="text-charcoal leading-relaxed">{item.a}</p>
            </article>)}
          </div>
          <p className="text-charcoal leading-relaxed max-w-3xl" style={{ marginTop: '2rem' }}>YOS helps organise the commercial questions and next steps. Your solicitor advises on legal interpretation and the rules that apply to your lease. The NSW Small Business Commissioner provides guidance on <a className="text-action-teal underline" href="https://www.smallbusiness.nsw.gov.au/help/common-questions/before-you-sign-the-lease">preparing to sign</a>, <a className="text-action-teal underline" href="https://www.smallbusiness.nsw.gov.au/help/common-questions/understanding-the-costs-of-leasing">leasing costs</a> and <a className="text-action-teal underline" href="https://www.smallbusiness.nsw.gov.au/help/common-questions/what-to-do-at-the-end-of-the-lease">the end of a lease</a>. Its retail leasing guidance does not automatically apply to every office or industrial tenancy.</p>
        </div>
      </section>

      <section id="lease-planning-tools" className="bg-warm-grey" style={SEC} aria-labelledby="planning-tools-heading">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <h2 id="planning-tools-heading" className="text-near-black font-bold leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', marginBottom: '1.5rem' }}>Useful while you prepare your application.</h2>
          <p className="text-charcoal leading-relaxed max-w-3xl" style={{ marginBottom: '1.5rem' }}>Bring your location, key dates, board decision process and main workplace concerns. You can apply below without completing another tool first.</p>
          <ul style={{ display: 'grid', gap: '1.25rem', maxWidth: '48rem' }}>
            <li><Link className="text-action-teal font-semibold underline" href="/lease-health-check">Explore the Lease Health Check</Link><p className="text-charcoal leading-relaxed">Organise your current lease questions. Uploading an existing lease is optional.</p></li>
            <li><Link className="text-action-teal font-semibold underline" href="/resources/lease-comparison">Compare lease options</Link><p className="text-charcoal leading-relaxed">Use consistent assumptions and separate confirmed costs from estimates.</p></li>
            <li><Link className="text-action-teal font-semibold underline" href="/tenant-rep">Understand tenant representation</Link><p className="text-charcoal leading-relaxed">See the broader service process. This programme application remains the route to request pro bono support.</p></li>
            <li><Link className="text-action-teal font-semibold underline" href="/blog/office-relocation-checklist">Prepare a relocation checklist</Link><p className="text-charcoal leading-relaxed">Connect premises, fit out, furniture, IT and handover decisions before choosing dates.</p></li>
          </ul>
          <a href="#apply" className="text-action-teal font-bold underline" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', marginTop: '2rem' }}>Apply for pro bono support</a>
        </div>
      </section>

      {/* ─── THE PROCESS ───────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>How it works</p>
            <h2 className="text-white font-black uppercase mb-14 leading-tight"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
              Four steps.<br />No surprises.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Apply', desc: 'Fill out the form below or call us. We review the submission and confirm the next step.' },
              { num: '02', title: 'Chat', desc: '20-minute call to understand your situation and confirm eligibility.' },
              { num: '03', title: 'We work', desc: 'Lease review within 5 business days. Relocation search starts once we have your brief.' },
              { num: '04', title: 'You decide', desc: 'We deliver our findings. You decide what to do next. No pressure, no obligation.' },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 60}>
                <div>
                  <p className="text-teal font-black mb-4" style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', lineHeight: 1 }}>{step.num}</p>
                  <p className="text-white font-bold uppercase mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>{step.title}</p>
                  <p className="text-white/45 font-light leading-relaxed" style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPLICATION FORM ──────────────────────── */}
      <section className="bg-white" style={{ paddingTop: 'clamp(5rem,10vw,10rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left, intro */}
            <FadeIn>
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Apply now</p>
                <h2 className="text-near-black font-black uppercase mb-6 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                  Tell us about<br />your situation.
                </h2>
                <p className="text-mid-grey font-light leading-relaxed mb-8"
                  style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  We review the submission, confirm eligibility and identify the appropriate next step.
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-charcoal font-semibold" style={{ fontSize: '0.8rem' }}>Email</p>
                    <a href={`mailto:${CONTACT.email}`} className="text-teal hover:text-near-black transition-colors"
                      style={{ fontSize: '0.9rem' }}>
                      {CONTACT.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-charcoal font-semibold" style={{ fontSize: '0.8rem' }}>Phone</p>
                    <a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`} className="text-teal hover:text-near-black transition-colors"
                      style={{ fontSize: '0.9rem' }}>
                      {CONTACT.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-charcoal font-semibold" style={{ fontSize: '0.8rem' }}>Location</p>
                    <p className="text-charcoal/60" style={{ fontSize: '0.9rem' }}>Newcastle, NSW</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right, form */}
            <FadeIn delay={80}>
              <div id="apply" tabIndex={-1} aria-label="Not for profit lease support application"><NotForProfitForm /></div>
            </FadeIn>
          </div>
        </div>
      </section>

    </>
  )
}
