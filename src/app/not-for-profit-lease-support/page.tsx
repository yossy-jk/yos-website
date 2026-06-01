
const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const SEC_SM = { paddingTop: 'clamp(2.5rem,5vw,4rem)',   paddingBottom: 'clamp(2.5rem,5vw,4rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,6vw,8rem)', paddingRight: 'clamp(1.5rem,6vw,8rem)' }

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-teal font-semibold uppercase tracking-widest mb-4"
    style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
    {children}
  </p>
)
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NotForProfitForm from '@/components/NotForProfitForm'
import FadeIn from '@/components/FadeIn'
import { CONTACT } from '@/lib/constants'

export default function NotForProfitPage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────── */}
      <section className="bg-near-black" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-5" style={{ fontSize: '0.72rem' }}>
              Pro Bono Programme — Newcastle &amp; Hunter
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
            {/* Card 1 — Lease Review */}
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
                  Already in a lease? We will review it properly — identifying your highest-risk clauses, financial exposure, and whether you are getting a fair deal. Same professional standard as our paying clients.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    'Full risk analysis — Red / Amber / Green ratings',
                    'Financial exposure headline figure',
                    'Top 3 clauses to address',
                    'Make-good cost estimate',
                    'Exit scenario overview',
                    'Plain-English — no legal jargon',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-charcoal font-light"
                      style={{ fontSize: '0.9rem' }}>
                      <span className="text-teal font-bold mt-0.5 flex-shrink-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-charcoal font-light italic" style={{ fontSize: '0.8rem' }}>
                  Typical value: $500–$1,500. You are not paying for it.
                </p>
              </div>
            </FadeIn>

            {/* Card 2 — Relocation Search */}
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
                  Need a new space? We will run the full search — identifying options, negotiating terms, and managing the deal through to signing. Tenant representation, done properly.
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
                <p className="text-white/40 font-light italic" style={{ fontSize: '0.8rem' }}>
                  Typical value: 3–5% of annual rent. You are not paying for it.
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
                  { label: 'Currently in a lease', detail: 'Commercial lease in Newcastle or the Hunter — or about to sign one.' },
                  { label: 'Or actively searching for space', detail: 'Actively looking to move, expand, or establish your first commercial premises.' },
                  { label: 'Small to medium organisation', detail: 'Typically under 50 staff. We make no promises — but that is the general shape.' },
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

      {/* ─── WHY THIS MATTERS ──────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Why this matters</p>
              <h2 className="text-near-black font-black uppercase mb-8 leading-tight"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                The leases we see<br />from not-for-profits
              </h2>
              <div className="flex flex-col gap-6">
                {[
                  {
                    q: 'Make-good clauses that were not negotiated',
                    a: 'Standard make-good clauses can cost $20,000–$80,000 at exit. Most not-for-profits do not budget for them because they did not know they were there.',
                  },
                  {
                    q: 'Rent reviews with no caps or guards',
                    a: 'Uncapped rent reviews can blow out operating costs by 40% over a five-year term. Knowing what you are signing matters.',
                  },
                  {
                    q: 'Security requirements that tie up working capital',
                    a: 'Large bank guarantees or security deposits lock away cash that could be funding your mission. There are better ways to structure security.',
                  },
                  {
                    q: 'Assignment clauses that do not account for change',
                    a: 'If your organisation merges, restructures, or changes purpose, your lease needs to handle that gracefully. Most do not.',
                  },
                ].map((item, i) => (
                  <div key={i} className="border-t border-charcoal/10 pt-6">
                    <p className="text-near-black font-bold mb-2" style={{ fontSize: '1rem' }}>{item.q}</p>
                    <p className="text-mid-grey font-light leading-relaxed" style={{ fontSize: '0.9rem' }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
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
              { num: '01', title: 'Apply', desc: 'Fill out the form below or call us. We respond within one business day.' },
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
      <section className="bg-white" id="apply" style={{ paddingTop: 'clamp(5rem,10vw,10rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left — intro */}
            <FadeIn>
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Apply now</p>
                <h2 className="text-near-black font-black uppercase mb-6 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                  Tell us about<br />your situation.
                </h2>
                <p className="text-mid-grey font-light leading-relaxed mb-8"
                  style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  We respond within one business day. If you qualify, we will book a 20-minute call to get started. No obligation, no pressure — just a conversation.
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
                    <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-teal hover:text-near-black transition-colors"
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

            {/* Right — form */}
            <FadeIn delay={80}>
              <NotForProfitForm />
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}