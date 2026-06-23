import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { CheckIcon } from '@/components/Icons'
import FadeIn from '@/components/FadeIn'
import Button from '@/components/Button'
import BookingCTA from '@/components/BookingCTA'

export const metadata = {
  title: 'Commercial Property Newcastle | EOF Group — Fitout, Tenant Rep & Lease Review',
  description: 'EOF Group delivers commercial office fitout, tenant representation and lease review across Newcastle, the Hunter Valley, Lake Macquarie and regional NSW. Deep local knowledge. Four specialist divisions. Based in Newcastle.',
  twitter: { card: 'summary_large_image', title: 'Commercial Property Newcastle | EOF Group', description: 'Commercial office fitout, tenant rep and lease review across Newcastle and the Hunter Valley.' },
  alternates: { canonical: 'https://yourofficespace.au/eof-group/newcastle' },
  openGraph: {
    title: 'Commercial Property Newcastle | EOF Group',
    description: 'Commercial office fitout, tenant representation and lease review. Based in Newcastle. Working across the Hunter Valley and regional NSW.',
    url: 'https://yourofficespace.au/eof-group/newcastle',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Commercial Property Newcastle — EOF Group' }],
    siteName: 'EOF Group',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function NewcastlePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ ...SEC, background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #001500 100%)' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ maxWidth: '900px' }}>
              <p style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                EOF Group — Newcastle & Hunter Region
              </p>
              <h1 style={{ color: 'white', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
                Newcastle is home.<br />We know this market.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px' }}>
                Based in Newcastle. Working across the Hunter Valley, Lake Macquarie, Central Coast and regional NSW. Four specialist divisions — office fitout, tenant rep, lease review and property services — all delivered by one team who know this region.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button href="/eof-group/furniture" variant="primary" size="lg">
                  Office Fitout
                </Button>
                <Button href="/eof-group/tenant-representation" variant="outline" size="lg">
                  Tenant Rep
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* THE REGION */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Where we work
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                The Hunter commercial property market, understood.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {[
                {
                  area: 'Newcastle CBD',
                  desc: 'CBD offices, civic precinct, Hunter Street Mall corridor, the Foreshore. The primary commercial zone for professional services, finance, and corporate.',
                  sub: 'Newcastle CBD, Darby St fringe, Honeysuckle',
                },
                {
                  area: 'Hunter Valley commercial',
                  desc: 'Cessnock, Pokolbin and the commercial nodes around the wine region\'s business corridors. Growing demand for professional and hospitality-adjacent office space.',
                  sub: 'Cessnock, Pokolbin, Branxton',
                },
                {
                  area: 'Lake Macquarie',
                  desc: 'A significant residential and commercial base. Charlestown, Belmont, Toronto and the Warners Bay precinct — strong for local service businesses and growing professional firms.',
                  sub: 'Charlestown, Belmont, Warners Bay, Toronto',
                },
                {
                  area: 'Central Coast NSW',
                  desc: 'Gosford and Wyong commercial nodes. Growing commuter belt creating demand for office space for businesses servicing the Sydney-Newcastle corridor.',
                  sub: 'Gosford, Wyong, Tuggerah',
                },
                {
                  area: 'Maitland & Lower Hunter',
                  desc: 'A growing commercial market as Newcastle\'s residential growth spills south. Strong demand from tradie businesses, professional services and government-adjacent organisations.',
                  sub: 'Maitland, Rutherford, Thornton',
                },
                {
                  area: 'Singleton & Upper Hunter',
                  desc: 'Mining, agribusiness and resources-adjacent commercial demand. Smaller market but active — long-term leases common, fitout requirements often specific to industry.',
                  sub: 'Singleton, Muswellbrook, Scone',
                },
              ].map(item => (
                <div key={item.area} style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>{item.area}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '0.75rem' }}>{item.desc}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHY LOCAL MATTERS */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Why local matters
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Every postcode has its own market dynamics.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '1rem' }}>
                  Newcastle is a relationship market. The landlords, the agents, the property managers — we know them. We know which buildings have upcoming vacancies before they&apos;re listed, which landlords are flexible on terms, and which precincts are heating up.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.75 }}>
                  That local knowledge translates directly to better outcomes for you — whether you&apos;re negotiating a rent figure, scoping a fitout, or managing a lease renewal.
                </p>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  'Active relationships with Hunter commercial landlords and agents',
                  'Knowledge of upcoming vacancies before they\'re publicly listed',
                  'Understanding of precinct-level supply and demand dynamics',
                  'Established fitout supplier and contractor relationships in the region',
                  'Local cleaning teams who know the buildings and access requirements',
                  'Regulatory knowledge specific to NSW and Hunter local council requirements',
                ].map(point => (
                  <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckIcon />
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.65 }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* DIVISIONS FOR NEWCASTLE */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Our divisions in Newcastle
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                Four services. One team. Newcastle-focused.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {[
                {
                  name: 'Office Furniture & Fitout',
                  href: '/eof-group/furniture',
                  colour: '#f59e0b',
                  desc: 'Brief to installed fitout management across all Hunter postcodes. Our local supplier and contractor relationships mean faster timelines and better quality control.',
                },
                {
                  name: 'Tenant Representation',
                  href: '/eof-group/tenant-representation',
                  colour: '#00B5A5',
                  desc: 'We negotiate leases exclusively for tenants. We know the Newcastle CBD and Hunter market landlords, and we know where the leverage is in a negotiation.',
                },
                {
                  name: 'Lease Review',
                  href: '/eof-group/lease-review',
                  colour: '#6366f1',
                  desc: 'Clause-by-clause review of any commercial lease. Whether you\'re signing a new Hunter premises lease or reviewing your current arrangement.',
                },
                {
                  name: 'Property Services',
                  href: '/eof-group',
                  colour: '#22c55e',
                  desc: 'Asset management, relocation coordination and end-of-lease management for businesses with Hunter region property portfolios.',
                },
              ].map(div => (
                <a key={div.href} href={div.href} style={{ display: 'block', background: 'rgba(255,255,255,0.025)', border: `1px solid ${div.colour}22`, borderRadius: '12px', padding: '1.5rem', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                  <p style={{ color: div.colour, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{div.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', lineHeight: 1.65 }}>{div.desc}</p>
                  <p style={{ color: div.colour, fontSize: '0.72rem', marginTop: '0.75rem', fontWeight: 600 }}>Learn more →</p>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* KEY PRECINCTS */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Key commercial precincts
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                The Newcastle and Hunter markets we cover.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '0', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {[
                {
                  name: 'Newcastle CBD',
                  streets: 'Hunter Street, Market Street, King Street, Wolfe Street, Auckland Street',
                  type: 'A-grade to B-grade office, civic, professional services',
                },
                {
                  name: 'Newcastle fringe & Darby St',
                  streets: 'Darby Street, Parry Street, Laman Street, The Junction',
                  type: 'Creative, professional, hospitality-adjacent tenancies',
                },
                {
                  name: 'Honeysuckle & Foreshore',
                  streets: 'Honeysuckle Drive, Wright Lane, Merewether Street',
                  type: 'Premium and A-grade office, government and corporate',
                },
                {
                  name: 'Charlestown & Lake Macquarie',
                  streets: 'Pacific Highway corridor, Charlestown Square, Durham Street',
                  type: 'Community commercial, professional services, medical',
                },
                {
                  name: 'Maitland & Rutherford',
                  streets: 'New England Highway, High Street, Elermore Vale',
                  type: 'Regional commercial, trade-adjacent, professional',
                },
              ].map(precinct => (
                <div key={precinct.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem' }}>{precinct.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{precinct.streets}</p>
                  <p style={{ color: '#22c55e', fontSize: '0.72rem' }}>{precinct.type}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <BookingCTA label="Talk to EOF Group in Newcastle" />
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "name": "EOF Group — Newcastle & Hunter Region",
            "areaServed": {
              "@type": "Place",
              "name": "Newcastle NSW, Hunter Valley NSW, Lake Macquarie NSW, Central Coast NSW",
              "containsPlace": [
                { "@type": "City", "name": "Newcastle" },
                { "@type": "AdministrativeArea", "name": "Hunter Valley NSW" },
                { "@type": "AdministrativeArea", "name": "Lake Macquarie NSW" },
                { "@type": "AdministrativeArea", "name": "Central Coast NSW" },
              ],
            },
            "address": { "@type": "PostalAddress", "addressLocality": "Newcastle", "addressRegion": "NSW", "addressCountry": "AU" },
            "description": "Commercial office fitout, tenant representation and lease review across Newcastle, the Hunter Valley, Lake Macquarie and regional NSW.",
          },
        ],
      }) }} />
    </>
  )
}
