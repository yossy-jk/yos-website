import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import Button from '@/components/Button'
import BookingCTA from '@/components/BookingCTA'
import { CONTACT } from '@/lib/constants'

export const metadata = {
  title: 'EOF Group | Commercial Fitout, Tenant Rep, Lease Review & Property Services',
  description: 'EOF Group delivers commercial office fitout, tenant representation, lease review and property services across Newcastle, the Hunter Valley and regional NSW. Four divisions. One team. We work exclusively for tenants and occupiers.',
  twitter: { card: 'summary_large_image', title: 'EOF Group | Commercial Fitout & Property Services', description: 'Office fitout, tenant rep, lease review and commercial property services. We work for tenants and occupiers — never landlords.' },
  alternates: { canonical: 'https://yourofficespace.au/eof-group' },
  openGraph: {
    title: 'EOF Group | Commercial Fitout, Tenant Rep & Property Services',
    description: 'Four specialist divisions. One experienced team. EOF Group delivers office fitout, tenant representation, lease review and property services across Newcastle and regional NSW.',
    url: 'https://yourofficespace.au/eof-group',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'EOF Group — Commercial Fitout & Property Services' }],
    siteName: 'EOF Group',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const DIVISIONS = [
  {
    id: 'furniture',
    label: '01',
    name: 'Office Furniture & Fitout',
    tagline: 'Brief to installed. No gaps.',
    description: 'Full project management for commercial office fitout — from space planning and specification through to supply, installation and post-fitout cleaning. In-stock express options through to fully custom made-to-order solutions. We manage the whole thing so you don\'t have to.',
    services: ['Space planning & design intent', 'Commercial furniture supply', 'Installation & project management', 'Post-fitout cleaning', 'In-stock express to made-to-order'],
    href: '/eof-group/furniture',
    cta: 'See our fitout work',
    colour: '#f59e0b',
  },
  {
    id: 'tenant-rep',
    label: '02',
    name: 'Tenant Representation',
    tagline: 'We only work for tenants. Never landlords.',
    description: 'We negotiate commercial leases on behalf of tenants — not landlords. That means we find the right space, negotiate better terms, and protect your interests at every stage. No conflicts. No divided loyalties.',
    services: ['Site search & selection', 'Lease negotiation', 'Break clause strategy', 'Rent review advocacy', 'Lease renewal management'],
    href: '/eof-group/tenant-representation',
    cta: 'How tenant rep works',
    colour: '#00B5A5',
  },
  {
    id: 'lease-review',
    label: '03',
    name: 'Lease Review & Advisory',
    tagline: 'Know what you\'re signing before you sign.',
    description: 'Commercial leases are complex documents with clauses that can cost you significantly down the track. We review, negotiate and advise on lease terms before you commit — saving you from costly mistakes.',
    services: ['Lease document review', 'Clause-by-clause negotiation', 'Make-good obligations', 'Exit strategy planning', 'Rent and outgoings analysis'],
    href: '/eof-group/lease-review',
    cta: 'Get a lease review',
    colour: '#6366f1',
  },
  {
    id: 'newcastle',
    label: '04',
    name: 'Newcastle & Hunter Region',
    tagline: 'Deep local knowledge. Every postcode.',
    description: 'We\'re based in Newcastle and work extensively across the Hunter Valley, Lake Macquarie, Central Coast and broader regional NSW. If your business is here or you\'re moving here, we know the market.',
    services: ['Newcastle CBD commercial space', 'Hunter Valley business parks', 'Lake Macquarie commercial precincts', 'Regional NSW expansion', 'Sub-lease and co-working advice'],
    href: '/eof-group/newcastle',
    cta: 'Explore Newcastle',
    colour: '#22c55e',
  },
]

export default function EOFGroupPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ ...SEC, background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d1117 100%)' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ maxWidth: '900px' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Newcastle, NSW — Est. 2019
              </p>
              <h1 style={{ color: 'white', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
                Four divisions.<br />One team that<br />works for you.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '640px' }}>
                EOF Group delivers commercial office fitout, tenant representation, lease review and property services — exclusively for tenants and occupiers. We&apos;ve operated from Newcastle since 2019 and work across the Hunter Valley, regional NSW and nationally.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button href="/eof-group/furniture" variant="primary" size="lg">
                  Office Fitout
                </Button>
                <Button href="/eof-group/tenant-representation" variant="outline" size="lg">
                  Tenant Rep
                </Button>
                <Button href="/eof-group/lease-review" variant="outline" size="lg">
                  Lease Review
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* INTRO — why EOF works differently */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', maxWidth: '900px' }}>
              <div>
                <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Why EOF Group
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  We only act for tenants and occupiers.<br />That&apos;s the whole model.
                </h2>
              </div>
              <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {[
                  {
                    title: 'No conflicts of interest',
                    body: 'Most commercial property agents work for landlords. We don\'t. When we negotiate, we\'re working entirely for your interests — not trying to fill a landlord\'s vacancy.',
                  },
                  {
                    title: 'End-to-end project management',
                    body: 'From brief to installed fitout — we manage the specification, procurement, installation and cleaning. You approve the work. We handle everything else.',
                  },
                  {
                    title: 'Local knowledge, national capability',
                    body: 'Based in Newcastle with established supplier relationships across NSW. For national rollouts, we have the networks to deliver wherever you operate.',
                  },
                  {
                    title: 'Transparent process and pricing',
                    body: 'No hidden margins, no undisclosed markups. We quote supply and installation separately so you know exactly what you\'re paying for at every stage.',
                  },
                ].map(item => (
                  <div key={item.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem' }}>{item.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.65 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOUR DIVISIONS */}
      <section style={{ ...SEC, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3.5rem' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                What we do
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.2 }}>
                Four specialist divisions.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {DIVISIONS.map((div, i) => (
                <div
                  key={div.id}
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderLeft: `3px solid ${div.colour}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    display: 'grid',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.4rem' }}>{div.label}</p>
                      <h3 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', marginBottom: '0.35rem' }}>{div.name}</h3>
                      <p style={{ color: div.colour, fontSize: '0.8rem', fontWeight: 600, fontStyle: 'italic' }}>{div.tagline}</p>
                    </div>
                    <Button href={div.href} variant="outline" size="sm">
                      {div.cta}
                    </Button>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.7 }}>{div.description}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {div.services.map(s => (
                      <span key={s} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* HOW WE WORK — process */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ maxWidth: '800px', marginBottom: '3rem' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                The process
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                How EOF Group works with you.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                { step: '01', title: 'Initial brief', body: 'We start with a conversation — about your space, your team, your timeline and your budget. No floor plan required at this stage.' },
                { step: '02', title: 'Site assessment', body: 'We survey the space, review your lease if applicable, and put together a specification that actually fits your requirements.' },
                { step: '03', title: 'Specification & quote', body: 'You receive a clear, itemised specification and quote. No vague estimates. No surprises. You decide what goes ahead.' },
                { step: '04', title: 'Delivery & install', body: 'We manage procurement, logistics and installation. Your team keeps working — we handle the coordination and quality control.' },
              ].map(s => (
                <div key={s.step} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '1rem' }}>{s.step}</p>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{s.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', lineHeight: 1.65 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* SERVICE AREA */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Where we work
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Newcastle is home. We work across NSW.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Our office is in Newcastle. We have established supplier and contractor relationships across the Hunter Valley, Central Coast, Lake Macquarie and broader regional NSW. For national requirements, we work with trusted partners in each market.
                </p>
                <Button href="/eof-group/newcastle" variant="primary">
                  Newcastle & Hunter region
                </Button>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  'Newcastle CBD & fringe',
                  'Hunter Valley commercial',
                  'Lake Macquarie',
                  'Central Coast NSW',
                  'Port Stephens',
                  'Singleton & Upper Hunter',
                  'Maitland & Lower Hunter',
                  'Regional NSW (project-based)',
                ].map(area => (
                  <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B5A5', flexShrink: 0 }} />
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem' }}>{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <BookingCTA label="Talk to EOF Group" />
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://yourofficespace.au/#organization",
            "name": "EOF Group",
            "alternateName": ["EOF Group", "Your Office Space"],
            "url": "https://yourofficespace.au",
            "logo": "https://yourofficespace.au/logo.png",
            "telephone": "+61434655511",
            "email": "hello@yourofficespace.au",
            "address": { "@type": "PostalAddress", "addressLocality": "Newcastle", "addressRegion": "NSW", "addressCountry": "AU" },
            "areaServed": ["Newcastle NSW", "Hunter Valley NSW", "Regional NSW"],
            "description": "EOF Group delivers commercial office fitout, tenant representation, lease review and property services exclusively for tenants and occupiers.",
          },
          {
            "@type": "WebPage",
            "@id": "https://yourofficespace.au/eof-group/#webpage",
            "url": "https://yourofficespace.au/eof-group",
            "name": "EOF Group | Commercial Fitout, Tenant Rep & Lease Review",
            "description": "Four specialist divisions. One experienced team. EOF Group delivers commercial office fitout, tenant representation, lease review and property services across Newcastle and regional NSW.",
            "isPartOf": { "@type": "WebSite", "@id": "https://yourofficespace.au/#website" },
          },
        ],
      }) }} />
    </>
  )
}
