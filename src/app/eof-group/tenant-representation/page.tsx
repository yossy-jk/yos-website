import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import Button from '@/components/Button'
import BookingCTA from '@/components/BookingCTA'
import HubSpotForm from '@/components/HubSpotForm'

export const metadata = {
  title: 'Tenant Representation | EOF Group — We Only Work for Tenants | Newcastle NSW',
  description: 'EOF Group provides commercial tenant representation across Newcastle, the Hunter Valley and regional NSW. We negotiate leases exclusively for tenants — never landlords. Better terms, no conflicts, stronger outcomes.',
  twitter: { card: 'summary_large_image', title: 'Tenant Representation | EOF Group — We Only Work for Tenants', description: 'We negotiate commercial leases for tenants. Never landlords. Better terms, no conflicts.' },
  alternates: { canonical: 'https://yourofficespace.au/eof-group/tenant-representation' },
  openGraph: {
    title: 'Tenant Representation | EOF Group',
    description: 'Commercial tenant representation across Newcastle and regional NSW. We work exclusively for tenants — never landlords.',
    url: 'https://yourofficespace.au/eof-group/tenant-representation',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Tenant Representation — EOF Group' }],
    siteName: 'EOF Group',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function TenantRepPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ ...SEC, background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #001a17 100%)' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ maxWidth: '900px' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                EOF Group — Tenant Representation
              </p>
              <h1 style={{ color: 'white', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
                We only represent<br />tenants. Never landlords.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px' }}>
                Commercial lease negotiations where your interests come first. No conflicts. No divided loyalties. We find you the right space, negotiate better terms, and manage the whole process — on your side of the table.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button href="#get-started" variant="primary" size="lg">
                  Start a search
                </Button>
                <Button href="#how-it-works" variant="outline" size="lg">
                  How it works
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* THE PROBLEM */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Why this matters
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Most commercial agents work for landlords.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1rem' }}>
                  That&apos;s the standard model. The agent listing a building is paid by the landlord to fill it. Their incentive is to close the deal — not necessarily to get you the best outcome.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                  When you work with EOF Group, you have someone whose entire incentive is aligned with yours. We&apos;re paid by you, we represent you, and we negotiate with the full weight of your interests behind every conversation.
                </p>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Typical agency model', body: 'Agent represents landlord. Tenant is the customer of the agent\'s product — the building.', side: false },
                  { label: 'EOF Group model', body: 'We represent the tenant. We find the right space, negotiate terms, and are accountable to you throughout.', side: true },
                ].map(item => (
                  <div key={item.label} style={{ background: item.side ? 'rgba(0,181,165,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${item.side ? 'rgba(0,181,165,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '1.5rem' }}>
                    <p style={{ color: item.side ? '#00B5A5' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.65 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHAT WE DO */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                What we do
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                Full tenant representation across every stage of your lease.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {[
                { title: 'Site search & selection', body: 'We understand your operational requirements — space, location, budget, flexibility — and search the market to find the options that actually fit. Not just what\'s listed, but what\'s available.' },
                { title: 'Lease negotiation', body: 'We negotiate on your behalf across rent, incentives, lease term, renewal rights, exit clauses and any conditions. Every term is negotiable — we know what\'s market and what\'s not.' },
                { title: 'Break clause strategy', body: 'A well-negotiated break clause gives you flexibility to exit a lease early if your business circumstances change. We advocate for breaks that actually work for you.' },
                { title: 'Rent review advocacy', body: 'At rent review time, the landlord will typically argue for increases. We review the market evidence, assess the fairness of the proposed rent, and negotiate on your behalf.' },
                { title: 'Lease renewal management', body: 'When your lease is expiring, we manage the renewal process from a position of knowledge — knowing the current market, your options, and what you\'re entitled to push for.' },
                { title: 'Make-good negotiation', body: 'Make-good obligations at lease end can be expensive if negotiated poorly. We advise on what is reasonable in the market and negotiate outcomes that don\'t cost you unnecessarily.' },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(0,181,165,0.03)', border: '1px solid rgba(0,181,165,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#00B5A5', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.65 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                The process
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                How we work with you.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '0' }}>
              {[
                { step: '01', title: 'Brief & requirements', body: 'We start with a detailed brief — your current lease expiry, space requirements, preferred locations, growth plans and any constraints. The more we understand, the better we can represent you.' },
                { step: '02', title: 'Market search', body: 'We search the market broadly — not just what\'s actively listed. Off-market opportunities, upcoming vacancies, and options that don\'t yet have a For Lease sign are all part of what we find for you.' },
                { step: '03', title: 'Shortlist & inspect', body: 'We narrow down to a shortlist of options that genuinely fit your requirements. We inspect together, assess the spaces against your brief, and build a clear picture of the best options.' },
                { step: '04', title: 'Negotiation', body: 'When you\'ve found the right space, we negotiate on your behalf. We run the process, present the landlord\'s position to you with our recommendation, and work to get you the best outcome.' },
                { step: '05', title: 'Lease completion', body: 'We review the lease document against what was agreed, negotiate any variations, and manage completion through to occupation. You have one point of contact throughout.' },
              ].map((s, i) => (
                <div key={s.step} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', alignItems: 'start', paddingBottom: '2rem', marginBottom: '2rem', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', paddingTop: '0.15rem' }}>{s.step}</p>
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{s.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7 }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHERE WE WORK */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Coverage
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Newcastle and Hunter region. Nationally on request.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  We cover Newcastle CBD, the Hunter Valley, Lake Macquarie, the Central Coast and broader regional NSW. For businesses with national requirements, we work with partner tenant rep firms in each market.
                </p>
                <Button href="/eof-group/newcastle" variant="outline">
                  Newcastle market coverage
                </Button>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  'Newcastle CBD & fringe',
                  'Hunter CBD & business parks',
                  'Lake Macquarie commercial precincts',
                  'Central Coast NSW',
                  'Maitland & Lower Hunter',
                  'Singleton & Upper Hunter',
                  'Port Stephens commercial',
                  'Regional NSW (project basis)',
                ].map(area => (
                  <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B5A5', flexShrink: 0 }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* GET IN TOUCH */}
      <section id="get-started" style={{ ...SEC, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Get started
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Tell us about your current situation.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Whether you&apos;re at the start of your search, in the middle of a negotiation, or facing a lease renewal — the best time to engage a tenant rep is before you&apos;re committed. Let&apos;s have a conversation.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    'Current lease expiry and remaining term',
                    'Space requirements (size, location, budget)',
                    'Growth or contraction plans over the lease term',
                    'Any specific requirements or constraints',
                  ].map(s => (
                    <span key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
                      <span style={{ color: '#00B5A5', fontWeight: 700, flexShrink: 0 }}>—</span> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
                <HubSpotForm formId="188fd0e9-44a0-4ed1-ab94-da26126fcc9e" targetId="eof-tenant-rep" />
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
                { label: 'Lease Review & Advisory', href: '/eof-group/lease-review' },
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

      <BookingCTA label="Talk to EOF Tenant Rep" />
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfessionalService",
            "@id": "https://yourofficespace.au/#organization",
            "name": "EOF Group — Tenant Representation",
            "serviceType": "Commercial Tenant Representation",
            "areaServed": ["Newcastle NSW", "Hunter Valley NSW", "Regional NSW"],
            "description": "Commercial tenant representation. We work exclusively for tenants — negotiating leases, securing better terms, and managing the full lease process.",
          },
          {
            "@type": "Service",
            "serviceType": "Tenant Representation",
            "provider": { "@id": "https://yourofficespace.au/#organization" },
            "areaServed": { "@type": "Place", "name": "Newcastle NSW, Hunter Valley NSW" },
            "description": "Commercial tenant representation across Newcastle and the Hunter Valley. We only act for tenants.",
          },
        ],
      }) }} />
    </>
  )
}
