import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import { LOGO_URL, ORGANIZATION_ID, SERVICE_TYPES } from '@/lib/site-schema'

export const metadata = {
  title: 'About Your Office Space | Newcastle Workplace Team',
  description: 'Based in Newcastle. Tenant representation in NSW, office fit out and furniture Australia-wide, and commercial cleaning in Newcastle CBD and Lake Macquarie.',
  alternates: { canonical: 'https://www.yourofficespace.au/about' },
  twitter: { card: 'summary_large_image', title: 'About | Your Office Space Newcastle', description: 'One team. Clear direction. No guesswork. Tenant-side commercial property advisory and workplace services.' },
  openGraph: {
    title: 'About | Your Office Space Newcastle',
    description: 'Tenant representation in NSW, office fit out and furniture Australia-wide, and commercial cleaning in Newcastle CBD and Lake Macquarie.',
    url: 'https://www.yourofficespace.au/about',
    images: [{ url: '/og/og-about.png', width: 1200, height: 630, alt: 'About Your Office Space | Newcastle NSW | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }

const APPROVED_GOOGLE_REVIEWERS = [
  { name: 'Beth Gwalter', organisation: 'Recovery Station', logo: '/images/relationships/recovery-station.jpg' },
  { name: 'Olivia Crawford', organisation: 'Australian Aboriginal Child and Family Services', logo: '/client-logos/aacafs.png' },
  { name: 'Jason Dowdall', organisation: 'Total Fitouts', logo: '/client-logos/total-fitouts.webp' },
]

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black relative min-h-[72vh] flex items-center overflow-hidden" style={{ paddingTop: 'clamp(8rem,12vw,10rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <Image src="/team/joe-kelley.jpg" alt="Joe Kelley, founder of Your Office Space" fill priority sizes="100vw" className="object-cover object-[70%_25%]" />
        <div className="absolute inset-0 bg-near-black/80" />
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
            <p className="text-white/85 font-light leading-relaxed max-w-xl"
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
            "@id": ORGANIZATION_ID,
            "name": "Your Office Space",
            "url": "https://www.yourofficespace.au",
            "logo": LOGO_URL,
            "telephone": "+61240920733",
            "email": "jk@yourofficespace.au",
            "description": "Newcastle-based workplace partner providing tenant representation in NSW, office fit out and furniture Australia-wide, and commercial cleaning in Newcastle CBD and Lake Macquarie.",
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
            "serviceType": SERVICE_TYPES,
            "knowsAbout": ["Commercial Leases", "Tenant Rights", "Commercial Property", "Office Fit Out", "Commercial Furniture", "Commercial Cleaning"]
          },
          {
            "@type": "Person",
            "@id": "https://www.yourofficespace.au/#person-joe-kelley",
            "name": "Joe Kelley",
            "jobTitle": "Founder & Managing Director",
            "worksFor": { "@id": ORGANIZATION_ID },
            "url": "https://www.yourofficespace.au/about",
            "description": "Commercial property professional working across office fit outs, tenant representation and workplace strategy.",
            "telephone": "+61240920733",
            "email": "jk@yourofficespace.au",
            "knowsAbout": ["Commercial Leases", "Tenant Representation", "Office Fit Out", "Commercial Property Negotiation"],
            "areaServed": [{ "@type": "State", "name": "New South Wales" }, { "@type": "Country", "name": "Australia" }]
          },
          {
            "@type": "Person",
            "name": "Sarah Kelley",
            "jobTitle": "Cleaning Division Director",
            "worksFor": { "@id": ORGANIZATION_ID },
            "description": "Runs the commercial cleaning division with hands-on site auditing and quality control.",
            "telephone": "+61240920733"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How does Your Office Space charge?", "acceptedAnswer": { "@type": "Answer", "text": "Scope, fees and any relevant payment arrangements are explained before an engagement begins." } },
              { "@type": "Question", "name": "Why does Your Office Space take a tenant-side position?", "acceptedAnswer": { "@type": "Answer", "text": "A tenant-side position keeps advice and negotiation focused on the priorities of the business occupying the space." } },
              { "@type": "Question", "name": "Where is Your Office Space based?", "acceptedAnswer": { "@type": "Answer", "text": "Your Office Space is based in Newcastle. Tenant representation is delivered in NSW, fit out and furniture support is available Australia-wide, and commercial cleaning is available in Newcastle CBD and Lake Macquarie." } },
              { "@type": "Question", "name": "What areas do you service?", "acceptedAnswer": { "@type": "Answer", "text": "Tenant representation and commercial buyers agent services are delivered in NSW. Fit out and furniture support is available Australia-wide. Commercial cleaning is available in Newcastle CBD and Lake Macquarie." } },
              { "@type": "Question", "name": "How do I get started with Your Office Space?", "acceptedAnswer": { "@type": "Answer", "text": "Enquire with the lease, fit out, furniture or cleaning decision that needs to become clearer." } },
              { "@type": "Question", "name": "Do you work with businesses outside Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Fit out and furniture support is available Australia-wide, while property representation is delivered in NSW. Commercial cleaning remains focused on Newcastle CBD and Lake Macquarie." } }
            ]
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Liz Murray" },
            "reviewBody": "Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@type": "Service", "name": "Tenant Representation", "provider": { "@id": ORGANIZATION_ID } }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Nathan Franks", "worksFor": { "@type": "Organization", "name": "Dynamic Business Technologies" } },
            "reviewBody": "Joe was instrumental in building out our boardroom. High-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@type": "Service", "name": "Furniture & Fit Out", "provider": { "@id": ORGANIZATION_ID } }
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
                    src="/images/furniture/space-geelong-a.jpg"
                    alt="Commercial workplace representing the spaces Your Office Space helps clients create"
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
                  most expensive and distracting moments in their journey: the office move, the fit out,
                  the lease negotiation.
                </p>
                <p>
                  Here&apos;s what most people don&apos;t see: an office project has a fixed budget.
                  Think of it as a pie. From the moment the project kicks off, multiple contractors,
                  suppliers and agents all need to eat from it. Some are fair. Some are not.
                  The greedy ones take more than their share early. and the business owner doesn&apos;t
                  notice until quality drops at the back end and the budget is gone.
                </p>
                <p>
                  Worse, leadership gets pulled away from the work that actually pays the bills to manage
                  a process they were never equipped for.
                </p>
                <div className="border-l-4 border-teal pl-6 py-2 my-2">
                  <p className="text-near-black font-medium">
                    I started Your Office Space because I believed business owners deserved someone
                    genuinely on their side. someone who gets in early, before the pie starts shrinking,
                    creates a realistic budget, finds the right space on the right terms, and manages the
                    whole thing from a position of trust and experience.
                  </p>
                </div>
                <p className="text-near-black font-black text-lg">
                  One Team. One relationship. One outcome.
                </p>
                <p className="text-mid-grey text-xs font-medium tracking-wide">
                 . Joe Kelley, Founder &amp; Managing Director
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
              <div className="bg-white rounded-sm overflow-hidden flex flex-col border border-gray-200">

                {/* Photo strip */}
                <div className="relative bg-near-black overflow-hidden" style={{ height: 'clamp(14rem,22vw,20rem)' }}>
                  <Image
                    src="/team/joe-kelley.jpg"
                    alt="Joe Kelley. Founder & Managing Director, Your Office Space"
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
                    <p className="text-mid-grey font-semibold leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.85 }}>
                      &ldquo;I got into this because I watched too many good businesses get stitched up by leases they didn&apos;t fully understand. Every client I work with gets the same thing – straight advice, and someone who actually gives a damn about the outcome.&rdquo;
                    </p>
                  </blockquote>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap" style={{ gap: '0.5rem', padding: 'clamp(1.25rem,3vw,1.75rem) clamp(1.75rem,4vw,2.5rem)', background: '#F8F7F5', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {['Commercial Property', 'Tenant Representation', 'Fit Out Strategy'].map(tag => (
                    <span key={tag} className="text-mid-grey font-semibold uppercase tracking-wider bg-white rounded-sm border border-gray-200" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>{tag}</span>
                  ))}
                </div>

              </div>
            </FadeIn>

            {/* Sarah */}
            <FadeIn direction="right" delay={100}>
              <div className="bg-white rounded-sm overflow-hidden flex flex-col border border-gray-200">

                {/* Photo strip */}
                <div className="relative bg-near-black overflow-hidden" style={{ height: 'clamp(14rem,22vw,20rem)' }}>
                  <Image
                    src="/team/sarah-kelley.jpg"
                    alt="Sarah Kelley. Cleaning Division Director, Your Office Space"
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
                    Sarah runs the commercial cleaning division from the ground up. She personally audits every site every month. not a clipboard exercise, a genuine check that standards are being met. If something isn&apos;t right, you hear from Sarah directly. Not a call centre.
                  </p>
                </div>

                {/* Quote */}
                <div style={{ margin: '0 clamp(1.75rem,4vw,2.5rem)', paddingTop: '2rem', paddingBottom: '2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <blockquote>
                    <p className="text-mid-grey font-semibold leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.85 }}>
                      &ldquo;The clients I love most are the ones who&apos;ve had a bad experience somewhere else. They know what a difference a reliable team makes. My standard is simple – if I wouldn&apos;t be happy with it, neither should you.&rdquo;
                    </p>
                  </blockquote>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap" style={{ gap: '0.5rem', padding: 'clamp(1.25rem,3vw,1.75rem) clamp(1.75rem,4vw,2.5rem)', background: '#F8F7F5', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {['Commercial Offices', 'Medical & Childcare', 'Quality Assurance'].map(tag => (
                    <span key={tag} className="text-mid-grey font-semibold uppercase tracking-wider bg-white rounded-sm border border-gray-200" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>{tag}</span>
                  ))}
                </div>

              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Genuine client feedback. */}
      <section className="bg-white" style={SEC} aria-labelledby="reviews-heading">
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Independent feedback</SectionLabel>
            <h2 id="reviews-heading" className="text-near-black font-black leading-tight tracking-tight mt-3 mb-5"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)' }}>
              What clients say about working with Joe.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-10 max-w-3xl">
              Independent feedback from people who have worked with Joe and Your Office Space.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {APPROVED_GOOGLE_REVIEWERS.map((reviewer, index) => (
              <FadeIn key={reviewer.name} delay={index * 70}>
                <article className="h-full rounded-2xl border border-gray-200 bg-warm-grey p-7">
                  <p className="text-dark-teal font-bold uppercase tracking-widest mb-5" style={{ fontSize: '0.65rem' }}>Google reviewer</p>
                  <div className="relative mb-6 h-14 w-full max-w-44"><Image src={reviewer.logo} alt={`${reviewer.organisation} logo`} fill sizes="176px" className="object-contain object-left" /></div>
                  <h3 className="text-near-black font-bold text-xl">{reviewer.name}</h3>
                  <p className="text-charcoal mt-2">{reviewer.organisation}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROOF POINTS ───────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Built around your workplace</SectionLabel>
            <h2 className="mb-12 max-w-3xl text-white" style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>Clear advice, coordinated delivery and people who stay accountable.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { stat: 'Newcastle', label: 'Our home base, with fit out and furniture support Australia-wide.' },
                { stat: 'NSW licensed', label: 'Commercial leasing and buying advice on your side of the table.' },
                { stat: 'Four connected services', label: 'Property, fit out, furniture and workplace cleaning.' },
                { stat: 'Real accountability', label: 'One relationship from the first decision to a workplace that works.' },
              ].map(item => (
                <article key={item.stat} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 hover:border-teal">
                  <p className="text-teal font-black mb-2" style={{ fontSize: 'clamp(1.2rem,2.5vw,1.75rem)' }}>{item.stat}</p>
                  <p className="text-white/75 font-light leading-relaxed">{item.label}</p>
                </article>
              ))}
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
              { heading: 'Local base. Defined reach.', body: "Newcastle is our base. We deliver tenant representation in NSW, fit out and furniture support Australia-wide, and commercial cleaning in Newcastle CBD and Lake Macquarie." },
              { heading: 'End-to-end accountability.', body: "Lease decisions, fit out, furniture and cleaning can be coordinated around one brief and one accountable relationship." },
              { heading: 'Visible decisions.', body: "Recommendations make the evidence and trade-offs clear, so you can make each decision with confidence." },
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
                A focused conversation about your space and the decision you are trying to make.
              </p>
              <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
                Enquire
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
