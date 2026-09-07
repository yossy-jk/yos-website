import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'About | Your Office Space — Commercial Property Advisory Newcastle',
  description: 'Newcastle-based, tenant-side commercial property advisory. Hunter home territory, with services available across Australia.',
  alternates: { canonical: 'https://www.yourofficespace.au/about' },
  twitter: { card: 'summary_large_image', title: 'About | Your Office Space Newcastle', description: 'One team. Clear direction. No guesswork. Tenant-side commercial property advisory and workplace services.' },
  openGraph: {
    title: 'About | Your Office Space Newcastle',
    description: 'Newcastle-based, tenant-side commercial property advisory. Hunter home territory, with services available across Australia.',
    url: 'https://www.yourofficespace.au/about',
    images: [{ url: '/og/og-about.png', width: 1200, height: 630, alt: 'About Your Office Space | Newcastle NSW | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const SEC_SM = { paddingTop: 'clamp(2.5rem,5vw,4rem)',   paddingBottom: 'clamp(2.5rem,5vw,4rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black relative overflow-hidden" style={SEC_SM}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className={`relative ${WRAP}`} style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>About</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              One team.<br />
              <span className="text-teal">Genuinely on your side.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/60 font-light leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1.05rem,2vw,1.25rem)' }}>
              We built this business because business owners deserve someone genuinely in their corner
              when the stakes are high. Not someone who disappears after the lease is signed.
              A real team. A real relationship. Long after the move is done.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── SCHEMA ────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
            "description": "Newcastle-based tenant-side commercial property advisory across Australia, spanning tenant representation, fit out and project management, furniture and commercial cleaning.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ],
            "knowsAbout": ["Commercial Leases", "Tenant Rights", "Commercial Property", "Office Fitout", "Commercial Cleaning"]
          },
          {
            "@type": "Person",
            "@id": "https://www.yourofficespace.au/#person-joe-kelley",
            "name": "Joe Kelley",
            "jobTitle": "Founder & Managing Director",
            "worksFor": { "@id": "https://www.yourofficespace.au/#organization" },
            "url": "https://www.yourofficespace.au/about",
            "description": "Commercial property professional working across office fit outs, tenant representation and workplace strategy.",
            "telephone": "+61434655511",
            "email": "jk@yourofficespace.au",
            "knowsAbout": ["Commercial Leases", "Tenant Representation", "Office Fitout", "Commercial Property Negotiation"],
            "areaServed": [{ "@type": "State", "name": "New South Wales" }, { "@type": "Country", "name": "Australia" }]
          },
          {
            "@type": "Person",
            "name": "Sarah Kelley",
            "jobTitle": "Cleaning Division Director",
            "worksFor": { "@id": "https://www.yourofficespace.au/#organization" },
            "description": "Runs the commercial cleaning division with hands-on site auditing and quality control.",
            "telephone": "+61434655511"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How does Your Office Space charge?", "acceptedAnswer": { "@type": "Answer", "text": "Scope, fees and any relevant payment arrangements are explained before an engagement begins." } },
              { "@type": "Question", "name": "Why does Your Office Space take a tenant-side position?", "acceptedAnswer": { "@type": "Answer", "text": "A tenant-side position keeps advice and negotiation focused on the priorities of the business occupying the space." } },
              { "@type": "Question", "name": "Where is Your Office Space based?", "acceptedAnswer": { "@type": "Answer", "text": "Your Office Space is Newcastle-based, with the Hunter as its home territory and tenant-side advisory available across Australia." } },
              { "@type": "Question", "name": "What areas do you service?", "acceptedAnswer": { "@type": "Answer", "text": "We are based in Newcastle and focus on the Hunter Valley and NSW. We also work with commercial property clients across Sydney, the Central Coast, Illawarra and regional NSW." } },
              { "@type": "Question", "name": "How do I get started with Your Office Space?", "acceptedAnswer": { "@type": "Answer", "text": "Book a 20-minute Clarity Call. Bring the lease, fit out, furniture or cleaning decision that needs to become clearer." } },
              { "@type": "Question", "name": "Do you work with businesses outside Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. While we are based in Newcastle and focus on the Hunter region, we work with commercial property clients across Sydney, the Central Coast, Illawarra and regional NSW. Distance is not a barrier — many of our best client relationships are conducted entirely online." } }
            ]
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Liz Murray" },
            "reviewBody": "Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@type": "Service", "name": "Tenant Representation", "provider": { "@id": "https://www.yourofficespace.au/#organization" } }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Nathan Franks", "worksFor": { "@type": "Organization", "name": "Dynamic Business Technologies" } },
            "reviewBody": "Joe was instrumental in building out our boardroom — high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@type": "Service", "name": "Furniture & Fitout", "provider": { "@id": "https://www.yourofficespace.au/#organization" } }
          }
        ]
      }) }} />

      {/* ─── THE STORY ────────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>The story</SectionLabel>
                <h2 className="text-near-black font-black leading-tight tracking-tight mt-3 mb-7"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)' }}>
                  I got tired of watching good businesses get taken advantage of.
                </h2>
                <div className="w-full mt-8 overflow-hidden">
                  <Image
                    src="/team/joe-kelley.jpg"
                    alt="Joe Kelley — Managing Director, Your Office Space"
                    width={600}
                    height={600}
                    className="object-cover w-full"
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="flex flex-col gap-6 text-charcoal font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem,1.5vw,1.1rem)' }}>
                <p>
                  I have worked across commercial office fit outs, furniture and workplace strategy.
                  In that work I watched good businesses carry avoidable risk during one of the
                  most expensive and distracting moments in their journey — the office move, the fitout,
                  the lease negotiation.
                </p>
                <p>
                  Here&apos;s what most people don&apos;t see: an office project has a fixed budget.
                  Think of it as a pie. From the moment the project kicks off, multiple contractors,
                  suppliers and agents all need to eat from it. Some are fair. Some are not.
                  The greedy ones take more than their share early — and the business owner doesn&apos;t
                  notice until quality drops at the back end and the budget is gone.
                </p>
                <p>
                  Worse, leadership gets pulled away from the work that actually pays the bills to manage
                  a process they were never equipped for.
                </p>
                <div className="border-l-4 border-teal pl-6 py-2 my-2">
                  <p className="text-near-black font-medium">
                    I started Your Office Space because I believed business owners deserved someone
                    genuinely on their side — someone who gets in early, before the pie starts shrinking,
                    creates a realistic budget, finds the right space on the right terms, and manages the
                    whole thing from a position of trust and experience.
                  </p>
                </div>
                <p className="text-near-black font-black text-lg">
                  One Team. One relationship. One outcome.
                </p>
                <p className="text-mid-grey text-xs font-medium tracking-wide">
                  — Joe Kelley, Founder &amp; Managing Director
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─────────────────────────────────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Meet the team</SectionLabel>
            <h2 className="text-near-black font-black leading-tight tracking-tight mt-3 mb-12"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)' }}>
              The people behind every deal.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Joe */}
            <FadeIn direction="left">
              <div className="bg-white rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300" style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>

                {/* Photo strip */}
                <div className="relative bg-near-black overflow-hidden" style={{ height: 'clamp(14rem,22vw,20rem)' }}>
                  <Image
                    src="/team/joe-kelley.jpg"
                    alt="Joe Kelley — Founder & Managing Director, Your Office Space"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 55%)' }} />
                  <div className="absolute bottom-0 left-0 right-0" style={{ padding: '2rem' }}>
                    <h3 className="text-white font-black text-2xl leading-tight">Joe Kelley</h3>
                    <p className="text-teal font-bold uppercase tracking-widest" style={{ fontSize: '0.65rem', marginTop: '0.35rem' }}>Founder &amp; Managing Director</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 sm:p-8">
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.9 }}>
                    Experience across commercial property, fit out and workplace strategy. Joe started Your Office Space because he believed business owners deserved clear advice and accountable coordination on their side of the table.
                  </p>
                </div>

                {/* Quote */}
                <div style={{ margin: '0 clamp(1.75rem,4vw,2.5rem)', paddingTop: '2rem', paddingBottom: '2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <blockquote>
                    <p className="text-mid-grey font-light leading-relaxed italic" style={{ fontSize: '0.9rem', lineHeight: 1.85 }}>
                      &ldquo;I got into this because I watched too many good businesses get stitched up by leases they didn&apos;t fully understand. Every client I work with gets the same thing — straight advice, and someone who actually gives a damn about the outcome.&rdquo;
                    </p>
                  </blockquote>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap" style={{ gap: '0.5rem', padding: 'clamp(1.25rem,3vw,1.75rem) clamp(1.75rem,4vw,2.5rem)', background: '#F8F7F5', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {['Commercial Property', 'Tenant Representation', 'Fitout Strategy'].map(tag => (
                    <span key={tag} className="text-mid-grey font-semibold uppercase tracking-wider bg-white rounded-lg border border-gray-200" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>{tag}</span>
                  ))}
                </div>

              </div>
            </FadeIn>

            {/* Sarah */}
            <FadeIn direction="right" delay={100}>
              <div className="bg-white rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300" style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>

                {/* Photo strip */}
                <div className="relative bg-near-black overflow-hidden" style={{ height: 'clamp(14rem,22vw,20rem)' }}>
                  <Image
                    src="/team/sarah-kelley.jpg"
                    alt="Sarah Kelley — Cleaning Division Director, Your Office Space"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 55%)' }} />
                  <div className="absolute bottom-0 left-0 right-0" style={{ padding: '2rem' }}>
                    <h3 className="text-white font-black text-2xl leading-tight">Sarah Kelley</h3>
                    <p className="text-teal font-bold uppercase tracking-widest" style={{ fontSize: '0.65rem', marginTop: '0.35rem' }}>Cleaning Division Director</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 sm:p-8">
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.9 }}>
                    Sarah runs the commercial cleaning division from the ground up. She personally audits every site every month — not a clipboard exercise, a genuine check that standards are being met. If something isn&apos;t right, you hear from Sarah directly. Not a call centre.
                  </p>
                </div>

                {/* Quote */}
                <div style={{ margin: '0 clamp(1.75rem,4vw,2.5rem)', paddingTop: '2rem', paddingBottom: '2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <blockquote>
                    <p className="text-mid-grey font-light leading-relaxed italic" style={{ fontSize: '0.9rem', lineHeight: 1.85 }}>
                      &ldquo;The clients I love most are the ones who&apos;ve had a bad experience somewhere else. They know what a difference a reliable team makes. My standard is simple — if I wouldn&apos;t be happy with it, neither should you.&rdquo;
                    </p>
                  </blockquote>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap" style={{ gap: '0.5rem', padding: 'clamp(1.25rem,3vw,1.75rem) clamp(1.75rem,4vw,2.5rem)', background: '#F8F7F5', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {['Commercial Offices', 'Medical & Childcare', 'Quality Assurance'].map(tag => (
                    <span key={tag} className="text-mid-grey font-semibold uppercase tracking-wider bg-white rounded-lg border border-gray-200" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>{tag}</span>
                  ))}
                </div>

              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ─── STATS & CREDENTIALS ─────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { stat: 'Newcastle-based', label: 'Hunter home territory' },
                { stat: 'Australia-wide', label: 'Tenant-side advisory' },
                { stat: 'Four services', label: 'One accountable partner' },
                { stat: 'NSW licensed', label: 'Tenant representation' },
              ].map(item => (
                <div key={item.stat} className="border-t border-white/10 pt-6">
                  <p className="text-teal font-black mb-2" style={{ fontSize: 'clamp(1.2rem,2.5vw,1.75rem)' }}>{item.stat}</p>
                  <p className="text-white/40 font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', lineHeight: 1.5 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="border border-white/10 rounded-xl p-8 md:p-10">
              <p className="text-teal font-bold text-xs tracking-widest uppercase mb-6">Credentials &amp; Licence</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-white font-bold mb-1">NSW Real Estate Licence</p>
                  <p className="text-white/45 font-light text-sm leading-relaxed">Class 2 NSW real estate licence. All property advisory and tenant representation work is conducted under full licence compliance.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Service Area</p>
                  <p className="text-white/45 font-light text-sm leading-relaxed">Newcastle CBD, Maitland, Lake Macquarie, Cessnock, Singleton, Port Stephens and the Hunter Valley. National capability for multi-site clients.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Industries Served</p>
                  <p className="text-white/45 font-light text-sm leading-relaxed">Professional services, healthcare, government, education, technology, trades, financial services, not-for-profit.</p>
                </div>
              </div>
              <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-5">Contact &amp; Location</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-white/30 font-medium uppercase tracking-widest mb-1" style={{ fontSize: '0.6rem' }}>Based in</p>
                    <p className="text-white/70 font-light text-sm leading-relaxed">Newcastle, NSW<br />Hunter Valley &amp; surrounds</p>
                  </div>
                  <div>
                    <p className="text-white/30 font-medium uppercase tracking-widest mb-1" style={{ fontSize: '0.6rem' }}>Email Joe directly</p>
                    <a href="mailto:jk@yourofficespace.au" className="text-teal font-light text-sm" style={{ textDecoration: 'none' }}>jk@yourofficespace.au</a>
                  </div>
                  <div>
                    <p className="text-white/30 font-medium uppercase tracking-widest mb-1" style={{ fontSize: '0.6rem' }}>Phone</p>
                    <a href="tel:+61434655511" className="text-teal font-light text-sm" style={{ textDecoration: 'none' }}>0434 655 511</a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY TENANT-SIDE ONLY ─────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Our position</SectionLabel>
            <h2 className="text-white font-black leading-tight tracking-tight mt-3 mb-12"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)' }}>
              Why we take the tenant side.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { heading: 'A clear client position.', body: "Tenant representation is framed around the occupying business's brief, risks and commercial priorities." },
              { heading: 'Local knowledge. Wider reach.', body: "Newcastle is our base and the Hunter is our home territory, with tenant-side advisory available across Australia." },
              { heading: 'End-to-end accountability.', body: "Lease decisions, fit out, furniture and cleaning can be coordinated around one brief and one accountable relationship." },
              { heading: 'Visible decisions.', body: "Recommendations identify the evidence, trade-offs and approvals needed before the team proceeds." },
            ].map((item, i) => (
              <FadeIn key={item.heading} delay={i * 70} direction="up">
                <div className="pl-6 border-l-4 border-teal py-1">
                  <p className="text-white font-bold text-base mb-2">{item.heading}</p>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="bg-teal text-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <h2 className="text-white font-black leading-tight mb-5 w-full"
                style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                Ready to have someone genuinely on your side?
              </h2>
              <p className="text-white font-light text-lg leading-relaxed mb-10 w-full">
                20 minutes. No pitch. Just a straight conversation about your space and what you&apos;re trying to achieve.
              </p>
              <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
                Book a Clarity Call
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
