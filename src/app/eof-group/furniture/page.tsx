import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { CheckIcon } from '@/components/Icons'
import FadeIn from '@/components/FadeIn'
import Button from '@/components/Button'
import BookingCTA from '@/components/BookingCTA'
import HubSpotForm from '@/components/HubSpotForm'

export const metadata = {
  title: 'EOF Furniture | Commercial Office Fitout & Furniture Supply | Newcastle NSW',
  description: 'EOF Furniture delivers commercial office fitout and furniture supply across Newcastle, the Hunter Valley and regional NSW. From brief to installed — we manage the whole project. Express in-stock to made-to-order solutions.',
  twitter: { card: 'summary_large_image', title: 'EOF Furniture | Commercial Office Fitout & Furniture Supply', description: 'Brief to installed. Commercial office fitout and furniture supply — Newcastle and regional NSW.' },
  alternates: { canonical: 'https://yourofficespace.au/eof-group/furniture' },
  openGraph: {
    title: 'EOF Furniture | Commercial Office Fitout & Furniture Supply',
    description: 'Full commercial office fitout project management. Supply, installation, project management. Based in Newcastle, working across NSW.',
    url: 'https://yourofficespace.au/eof-group/furniture',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'EOF Furniture — Commercial Office Fitout' }],
    siteName: 'EOF Group',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function EOFFurniturePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ ...SEC, background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #1a1200 100%)' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ maxWidth: '900px' }}>
              <p style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                EOF Furniture Division
              </p>
              <h1 style={{ color: 'white', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
                Commercial office fitout.<br />Brief to installed.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px' }}>
                We manage the complete office fitout process — from space planning and furniture specification through to supply, installation and post-fitout cleaning. Based in Newcastle. Working across NSW.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button href="#get-a-quote" variant="primary" size="lg">
                  Get a quote
                </Button>
                <Button href="#how-it-works" variant="outline" size="lg">
                  How it works
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHAT WE DELIVER */}
      <section style={{ ...SEC_SM, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                What we deliver
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.2 }}>
                Complete fitout. No gaps.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {[
                {
                  title: 'Space planning',
                  body: 'We review your floor plan, headcount and workflow to determine workstation sizes, meeting room requirements, breakout zones and storage. The layout is designed before anything is specified.',
                },
                {
                  title: 'Commercial furniture supply',
                  body: 'We have access to a wide range of commercial-grade furniture — from in-stock express delivery through to fully custom made-to-order pieces. The right solution for your timeline and budget.',
                },
                {
                  title: 'Installation & project management',
                  body: 'We coordinate delivery, installation and any trades required. Your team keeps working — we manage the logistics, QC and any issues that come up on site.',
                },
                {
                  title: 'Post-fitout cleaning',
                  body: 'After installation, our cleaning division handles the post-construction deep clean and any ongoing maintenance. One team managing the whole transition from old space to new.',
                },
                {
                  title: 'Asset management',
                  body: 'For businesses with multiple sites or ongoing fitout needs, we manage furniture asset registers, relocation logistics and disposal of existing furniture — responsibly and efficiently.',
                },
                {
                  title: 'National rollout capability',
                  body: 'For businesses expanding across multiple locations, we manage fitout coordination in markets outside Newcastle through our network of trusted commercial furniture suppliers and installers.',
                },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.65 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* THE RANGE */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                The range
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
                In-stock express through to fully custom.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '640px' }}>
                We work with a broad range of commercial furniture suppliers so we can always match the right product to your project — whether you need something in three weeks or three months.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                { category: 'Workstations', items: ['Height-adjustable desks', 'Fixed desk clusters', 'Standing desk solutions', 'Acoustic workstation pods'] },
                { category: 'Meeting rooms', items: ['Boardroom tables', 'Meeting tables', 'Conference chairs', 'Video conferencing units'] },
                { category: 'Breakout & reception', items: ['Soft seating', 'Lounge furniture', 'Reception desks', 'Collaborative seating'] },
                { category: 'Storage & filing', items: ['Personal lockers', 'Credenzas', 'Filing cabinets', 'Mobile storage'] },
                { category: 'Specialist', items: ['Ergonomic seating', 'Monitor arms & accessories', 'Acoustic panels', 'Commercial blinds & shading'] },
              ].map(group => (
                <div key={group.category} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', marginBottom: '1rem' }}>{group.category}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {group.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
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
              <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                The process
              </p>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2 }}>
                From brief to installed in five steps.
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '0' }}>
              {[
                { step: '01', title: 'Brief & space assessment', body: 'We start with your floor plan, headcount and a conversation about how your team actually works. No brief is too rough — a napkin sketch and a number of staff is enough to get going.' },
                { step: '02', title: 'Specification', body: 'We put together a full furniture specification with options for different price points. You choose what fits your budget. Nothing is committed until you approve.' },
                { step: '03', title: 'Quote & approval', body: 'You receive an itemised quote covering supply, delivery and installation. We separate these costs so you can see exactly what you\'re paying for at each stage.' },
                { step: '04', title: 'Installation', body: 'We coordinate delivery and installation on a schedule that suits your business. Most fitouts happen outside business hours so your team isn\'t disrupted.' },
                { step: '05', title: 'Post-fitout clean & handover', body: 'Our cleaning team does a post-construction deep clean before handover. We walk through the space with you, confirm everything is right, and leave you with a clean, functional workspace.' },
              ].map((s, i) => (
                <div key={s.step} style={{ display: 'grid', gap: '0', gridTemplateColumns: '60px 1fr', alignItems: 'start', paddingBottom: '2rem', marginBottom: '2rem', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', paddingTop: '0.15rem' }}>{s.step}</p>
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

      {/* WHY EOF FURNITURE */}
      <section style={{ ...SEC_SM, background: '#090909' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Why work with us
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  One team. One point of contact. No contractor chaos.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Most businesses manage multiple contractors for a fitout — a furniture supplier, an installer, a cleaner, a project manager. We collapse all of that into one team with one point of contact and one accountability.
                </p>
                <Button href="/eof-group" variant="outline">
                  About EOF Group
                </Button>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  'We\'ve been doing this since 2019 — commercial fitout across Newcastle and regional NSW',
                  'No undisclosed markups — supply and installation costs are shown separately',
                  'No off-the-shelf quoting — every specification is built for your space and team',
                  'Post-fitout cleaning included via our own cleaning division',
                  'National coverage through established supplier networks for multi-site rollouts',
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

      {/* QUOTE FORM */}
      <section id="get-a-quote" style={{ ...SEC, background: '#0d0d0d' }}>
        <FadeIn>
          <div className={WRAP} style={PAD}>
            <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Get a quote
                </p>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Tell us about your project.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Send us your floor plan, headcount and a rough timeline and we&apos;ll put together a full specification and quote. No obligation.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Floor plan or rough dimensions',
                    'Headcount and workstation requirements',
                    'Meeting rooms, breakout, storage needs',
                    'Timeline and budget guidance',
                    'In-stock express to made-to-order options',
                  ].map(s => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                      <CheckIcon /> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
                <HubSpotForm formId="188fd0e9-44a0-4ed1-ab94-da26126fcc9e" targetId="eof-furniture-quote" />
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
                { label: 'Office Fitout Guide', href: '/blog/office-fitout-guide' },
                { label: 'Commercial Furniture Supplier', href: '/blog/commercial-furniture-supplier' },
                { label: 'Office Fitout Costs', href: '/blog/office-fitout-costs' },
                { label: 'Lease Review', href: '/eof-group/lease-review' },
                { label: 'Tenant Representation', href: '/eof-group/tenant-representation' },
              ].map(link => (
                <Button key={link.href} href={link.href} variant="outline" size="sm">
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <BookingCTA label="Talk to EOF Furniture" />
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "@id": "https://yourofficespace.au/#business",
            "name": "EOF Furniture — Office Fitout Division",
            "alternateName": "EOF Group Furniture",
            "parentOrganization": { "@id": "https://yourofficespace.au/#organization" },
            "address": { "@type": "PostalAddress", "addressLocality": "Newcastle", "addressRegion": "NSW", "addressCountry": "AU" },
            "areaServed": ["Newcastle NSW", "Hunter Valley NSW", "Regional NSW"],
            "description": "Commercial office fitout and furniture supply. Brief to installed project management across Newcastle and regional NSW.",
          },
          {
            "@type": "Service",
            "serviceType": "Commercial Office Fitout",
            "provider": { "@id": "https://yourofficespace.au/#organization" },
            "areaServed": { "@type": "Place", "name": "Newcastle NSW, Regional NSW" },
            "description": "Full commercial office fitout project management — space planning, furniture supply, installation and post-fitout cleaning.",
          },
        ],
      }) }} />
    </>
  )
}
