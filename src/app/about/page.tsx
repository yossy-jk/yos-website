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


const TEAM = [
  { name: 'Joe Kelley', title: 'Founder & Managing Director', image: '/team/joe-kelley.jpg', initials: 'JK', description: 'Commercial property, fit out and workplace strategy. Joe brings more than a decade of industry experience to the team.' },
  { name: 'Sarah Kelley', title: 'Director, Cleaning Division', image: '/team/sarah-kelley.jpg', initials: 'SK', description: 'Sarah leads the Cleaning Division and manages its clients, team and service delivery.' },
  { name: 'Frank Smith', title: 'Head of Furniture', image: '/team/frank-smith.webp', initials: 'FS', description: null },
  { name: 'Harvey Byrne', title: 'Business Development', image: null, initials: 'HB', description: null },
  { name: 'Mary Jenkins', title: 'Head of AI', image: '/team/mary-jenkins.webp', initials: 'MJ', description: null },
]

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black relative min-h-[72vh] flex items-center overflow-hidden" style={{ paddingTop: 'clamp(8rem,12vw,10rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <Image src="/images/furniture/space-geelong-a.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
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
              Your property decision, fit out, furniture and ongoing workplace care belong in one conversation.
              Engage an experienced Newcastle team, with different roles working towards the same workplace outcome.
              One service, or one team across the whole journey.
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
            "email": "hello@yourofficespace.au",
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
          ...TEAM.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": member.title,
            "worksFor": { "@id": ORGANIZATION_ID },
            "url": "https://www.yourofficespace.au/about",
            ...(member.description ? { "description": member.description } : {}),
          })),
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

      {/* Company story and team */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn>
              <SectionLabel>Why we exist</SectionLabel>
              <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)' }}>
                Your workplace should support the business you are building.
              </h2>
              <p className="text-charcoal leading-relaxed text-base max-w-xl">
                A lease or purchase sets the direction. The fit out, furniture and ongoing care
                need to work with it. You can engage us for one service, or connect the whole journey.
              </p>
            </FadeIn>
            <FadeIn delay={80}>
              <div className="space-y-6 text-charcoal leading-relaxed text-base max-w-xl">
                <p>
                  Established in 2025, Your Office Space brings commercial property, fit out,
                  furniture and cleaning together under one roof. We are based in Newcastle,
                  with tenant representation across NSW, fit out and furniture Australia-wide,
                  and cleaning across Newcastle CBD and Lake Macquarie.
                </p>
                <p>
                  Joe brings more than a decade of fit out, furniture and workplace experience.
                  Today, you engage a growing team with distinct roles.
                </p>
                <div className="border-l-4 border-teal pl-6">
                  <h3 className="text-near-black font-bold text-xl mb-3">One budget. Protect the whole picture.</h3>
                  <p>
                    Property costs, consultants, contractors and furniture draw from the same
                    project budget. We keep the brief, budget and delivery connected so you can
                    see the trade-offs before committing.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <section className="bg-warm-grey" style={SEC} aria-labelledby="team-heading">
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Meet the team</SectionLabel>
            <h2 id="team-heading" className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)' }}>
              Different roles. One accountable team.
            </h2>
            <p className="text-charcoal leading-relaxed max-w-2xl mb-10">
              By teaming up with Your Office Space, you engage an experienced team across
              commercial property, workplace projects, furniture, cleaning and business support.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map(member => (
              <article key={member.name} className="bg-white rounded-sm overflow-hidden border border-gray-200">
                <div className="relative aspect-[4/3] bg-warm-grey">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover object-top" />
                  ) : (
                    <div className="flex h-full items-center justify-center" aria-hidden="true">
                      <span className="text-action-teal text-5xl font-semibold">{member.initials}</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 className="text-near-black font-bold text-xl">{member.name}</h3>
                  <p className="text-action-teal font-semibold text-base mt-2">{member.title}</p>
                  {member.description && <p className="text-charcoal leading-relaxed text-base mt-4">{member.description}</p>}
                </div>
              </article>
            ))}
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
              Feedback from people we have worked with.
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
