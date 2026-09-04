import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import Button from '@/components/Button'
import BookingCTA from '@/components/BookingCTA'
import HubSpotForm from '@/components/HubSpotForm'

export const metadata = {
  title: 'Commercial Lease Review | EOF Group — Know What You\'re Signing | Newcastle NSW',
  description: 'EOF Group reviews and negotiates commercial lease terms before you commit. Lease review, clause-by-clause negotiation, rent review advocacy and exit strategy for businesses in Newcastle and regional NSW.',
  twitter: { card: 'summary_large_image', title: 'Commercial Lease Review | EOF Group', description: 'We review commercial leases before you sign. Clause-by-clause negotiation, rent reviews, and exit strategy.' },
  alternates: { canonical: 'https://yourofficespace.au/eof-group/lease-review' },
  openGraph: {
    title: 'Commercial Lease Review | EOF Group',
    description: 'Lease review and negotiation for commercial tenants. Know what you\'re signing before you commit.',
    url: 'https://yourofficespace.au/eof-group/lease-review',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Lease Review — EOF Group' }],
    siteName: 'EOF Group',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function LeaseReviewPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* HERO */}
      <section style={{ ...SEC, background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d1a 100%)' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ maxWidth: '900px' }}>
              <p style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                EOF Group — Lease Review
              </p>
              <h1 style={{ color: 'white', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
                Know what you&apos;re<br />signing. Before you sign.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px' }}>
                Commercial leases are complex documents with clauses that can cost you significantly down the track. We review, negotiate and advise on lease terms before you commit — so you know exactly what you&apos;re agreeing to.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button href="#get-a-review" variant="primary" size="lg">
                  Get a lease review
                </Button>
                <Button href="#what-we-review" variant="outline" size="lg">
                  What we review
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHY REVIEW YOUR LEASE */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Why review matters
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                Most lease problems start before the lease is signed.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {[
                {
                  title: 'Leases are written for landlords',
                  body: 'Standard commercial leases are drafted by solicitors acting for the landlord. Every clause that\'s not in your favour is there because it benefits the landlord. We identify what\'s negotiable and what\'s not.',
                },
                {
                  title: 'Every clause has a cost',
                  body: 'A poorly negotiated make-good clause could cost you tens of thousands at lease end. An inflexible exit clause could trap you in a space that\'s wrong for your business. We quantify the risk in each clause.',
                },
                {
                  title: 'The best time to negotiate is before signing',
                  body: 'After the lease is signed, your leverage drops significantly. Pre-signature negotiation is when you have the most power. We engage before you\'re committed so you can actually negotiate.',
                },
                {
                  title: 'Market knowledge changes your position',
                  body: 'Knowing what is and isn\'t market-standard gives you a foundation to push back. If your neighbour is paying less for a comparable space, that\'s leverage. We bring market evidence to the negotiation.',
                },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.65 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHAT WE REVIEW */}
      <section id="what-we-review" style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                What we review
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                Clause by clause. Every risk identified.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {[
                { title: 'Rent and outgoings', body: 'Base rent, estimated outgoings, how they\'re calculated, caps on annual increases, and what happens at market rent reviews. We benchmark against the market.' },
                { title: 'Lease term and renewals', body: 'Initial term, options to renew, how rent is set at renewal, and whether renewal is at your option or the landlord\'s. Most leases favour the landlord here.' },
                { title: 'Exit and break clauses', body: 'Whether you can exit the lease early, under what conditions, and what the financial consequences are. A well-drafted break clause gives your business genuine flexibility.' },
                { title: 'Make-good obligations', body: 'What you need to return the space to at lease end, what that actually costs, and what is reasonable in the market. Make-good disputes are common and expensive.' },
                { title: 'Permitted use and restrictions', body: 'What you\'re allowed to use the space for, whether that\'s broad enough for your business, and any restrictions that could limit your operations.' },
                { title: 'Assignment and sub-letting', body: 'Can you assign the lease if you need to exit? Can you sublet part of the space? These clauses matter significantly for business sale or restructure.' },
                { title: 'Maintenance and repair obligations', body: 'Who is responsible for what repair, what the standard of repair means in practice, and what happens if you disagree with a landlord\'s assessment.' },
                { title: 'Insurance and liability', body: 'Insurance requirements, liability for damage, public liability obligations, and whether the risk allocation between you and the landlord is reasonable.' },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.5rem' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.65 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHEN TO ENGAGE */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                When to engage us
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                Before you&apos;re committed is always the best time.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {[
                { label: 'New lease negotiation', desc: 'You\'re being offered a new lease — get independent review before you sign' },
                { label: 'Lease renewal approaching', desc: 'Your current lease is expiring — understand your position before you negotiate' },
                { label: 'Rent review notice received', desc: 'The landlord has proposed a rent increase — we assess whether it\'s fair' },
                { label: 'Assignment or subletting', desc: 'You\'re selling or restructuring — review the assignment clause first' },
                { label: 'Make-good dispute', desc: 'The landlord is claiming for make-good — get independent advice on what\'s reasonable' },
                { label: 'Lease for new premises', desc: 'You\'re moving — review the lease before committing to a new space' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.25rem' }}>
                  <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}>{item.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  The process
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Simple. Fast. Before you sign.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Send us your lease and we&apos;ll review it, identify the issues, and give you a clear picture of what&apos;s negotiable and what it might cost you if things go wrong. We&apos;ll tell you what we&apos;d push for and why.
                </p>
                <Button href="/eof-group" variant="outline">
                  About EOF Group
                </Button>
              </div>
              <div style={{ display: 'grid', gap: '0' }}>
                {[
                  { step: '01', title: 'Send us the lease', body: 'Upload or email the lease document. If you only have a summary from the agent, that\'s enough to start.' },
                  { step: '02', title: 'Clause-by-clause review', body: 'We review every material clause, identify the risks, and benchmark terms against market standards.' },
                  { step: '03', title: 'Written advice', body: 'You receive a written report — every clause that needs attention, what\'s negotiable, and our recommended position.' },
                  { step: '04', title: 'Negotiation support', body: 'We help you negotiate directly with the landlord or their solicitor on the clauses that matter most to your business.' },
                ].map((s, i) => (
                  <div key={s.step} style={{ display: 'grid', gridTemplateColumns: '50px 1fr', alignItems: 'start', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <p style={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', paddingTop: '0.1rem' }}>{s.step}</p>
                    <div>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>{s.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.65 }}>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA + FORM */}
      <section id="get-a-review" style={{ ...SEC, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Get a lease review
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Send us the lease. We&apos;ll tell you what you need to know.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Upload the lease document or just the agent&apos;s summary. We&apos;ll review it and get back to you with a clear picture of where you stand and what needs attention.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    'Confidential — your details are never shared',
                    'Clause-by-clause written advice',
                    'Recommended negotiating positions',
                    'No obligation to proceed',
                  ].map(s => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
                      <span style={{ color: '#6366f1', fontWeight: 700 }}>—</span> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
                <HubSpotForm formId="188fd0e9-44a0-4ed1-ab94-da26126fcc9e" targetId="eof-lease-review" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* RELATED */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Explore more
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'EOF Group overview', href: '/eof-group' },
                { label: 'Tenant Representation', href: '/eof-group/tenant-representation' },
                { label: 'Newcastle & Hunter', href: '/eof-group/newcastle' },
                { label: 'Office Fitout Guide', href: '/blog/office-fitout-guide-australia-2026' },
              ].map(link => (
                <Button key={link.href} href={link.href} variant="outline" size="sm">
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <BookingCTA label="Talk to EOF Lease Review" />
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfessionalService",
            "name": "EOF Group — Lease Review",
            "serviceType": "Commercial Lease Review",
            "areaServed": ["Newcastle NSW", "Hunter Valley NSW", "Regional NSW"],
            "description": "Commercial lease review and negotiation. Clause-by-clause analysis, rent review advocacy, and make-good negotiation for commercial tenants.",
          },
        ],
      }) }} />
    </>
  )
}
