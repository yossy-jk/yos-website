import { CLIENT_REVIEWS } from '@/lib/client-reviews'
import CompanyPurpose from '@/components/CompanyPurpose'
import ServiceFaq from '@/components/ServiceFaq'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { ORGANIZATION_ID } from '@/lib/site-schema'

export const metadata = withPageSeo({
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
})

const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }

const APPROVED_GOOGLE_REVIEWERS = CLIENT_REVIEWS.filter(review => ['Beth Gwalter', 'Olivia Crawford', 'Jason Dowdall'].includes(review.name))


const TEAM = [
  { name: 'Joe Kelley', title: 'Commercial Property & Workplace Strategy', image: '/team/joe-kelley.jpg', initials: 'JK', description: 'Joe supports commercial property, fit out and workplace strategy as part of the YOS team, bringing more than a decade of industry experience.' },
  { name: 'Sarah Kelley', title: 'Director, Cleaning Division', image: '/team/sarah-kelley.jpg', initials: 'SK', description: 'Sarah leads the Cleaning Division and manages its clients, team and service delivery.' },
  { name: 'Frank Smith', title: 'Head of Furniture', image: '/team/frank-smith.webp', initials: 'FS', description: 'Frank turns workplace briefs into clear furniture plans, schedules and prompt quotes. He guides clients through the project journey, from the first brief and product selection to delivery, keeping requirements, timing and next steps clear.' },
  { name: 'Mary Jenkins', title: 'Head of AI and Systems', image: '/team/mary-jenkins.webp', initials: 'MJ', description: 'Mary leads AI and systems at YOS and has helped build the team from scratch. She brings people, processes and technology together, developing practical ways of working that support a growing team and keep the client journey organised.' },
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
          ORGANIZATION_SCHEMA,
          ...TEAM.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": member.title,
            "worksFor": { "@id": ORGANIZATION_ID },
            "url": "https://www.yourofficespace.au/about",
            ...(member.description ? { "description": member.description } : {}),
          })),


        ]
      }) }} />

      <CompanyPurpose>
        <p>Established in 2025 and based in Newcastle, Your Office Space connects commercial property, client-side FitOut project management, furniture and workplace care. Tenant representation is provided in NSW, FitOut and furniture support Australia-wide, and commercial cleaning across Newcastle CBD and Lake Macquarie. Each service has its own agreed scope.</p>
      </CompanyPurpose>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {TEAM.map(member => (
              <article key={member.name} id={member.name.toLowerCase().replaceAll(' ', '-')} style={{ scrollMarginTop: 110 }} className="bg-white rounded-sm overflow-hidden border border-gray-200">
                <div className="relative aspect-[4/3] bg-warm-grey">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1280px) 50vw, 640px"
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
              style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
              Feedback from people we have worked with.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-10 max-w-3xl" style={{ marginBottom: '2.5rem' }}>
              Independent feedback from people who have worked with the Your Office Space team.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {APPROVED_GOOGLE_REVIEWERS.map((reviewer, index) => (
              <FadeIn key={reviewer.name} delay={index * 70}>
                <article className="h-full rounded-2xl border border-gray-200 bg-warm-grey" style={{ padding: '1.75rem' }}>
                  <p className="text-dark-teal font-bold uppercase tracking-widest mb-5" style={{ fontSize: '0.65rem', marginBottom: '1.25rem' }}>Google review excerpt</p>
                  <blockquote className="text-near-black leading-relaxed" style={{ marginBottom: '1.5rem' }}>“{reviewer.quote}”</blockquote>
                  {reviewer.logo && <div className="relative h-14 w-full max-w-44" style={{ marginBottom: '1.5rem', background: reviewer.logoBackground === 'dark' ? '#1a1a1a' : undefined }}><Image src={reviewer.logo} alt={`${reviewer.organisation} logo`} fill sizes="176px" className="object-contain object-left" /></div>}
                  <h3 className="text-near-black font-bold text-xl">{reviewer.name}</h3>
                  <p className="text-charcoal mt-2">{reviewer.organisation}</p>
                  <a href={reviewer.source} target="_blank" rel="noopener noreferrer" className="text-dark-teal font-semibold underline underline-offset-4" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', marginTop: '1rem' }}>Read on Google<span className="sr-only">: {reviewer.name} (opens in a new tab)</span></a>
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

      <section className="bg-white" style={SEC} aria-labelledby="join-yos-heading">
        <div className={WRAP} style={PAD}>
          <SectionLabel>Work or partner with us</SectionLabel>
          <h2 id="join-yos-heading" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1.25rem' }}>Good people. Shared standards.</h2>
          <p style={{ maxWidth: '44rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>We’re always interested in hearing from tenant representatives, furniture referral partners and cleaning team members who take pride in their work. We prefer employee cleaners and also welcome contractor interest. Explore the team, the way we work and where your skills could fit.</p>
          <Button href="/about/work-with-yos" variant="dark">Work or Partner with YOS</Button>
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
              <Button href="/contact#contact-enquiry" variant="dark" size="lg">Enquire</Button>
            </div>
          </FadeIn>
        </div>
      </section>


      <ServiceFaq items={[{"question": "What does Your Office Space do?", "answer": "YOS helps businesses lease or buy commercial space in NSW, then coordinates client-side FitOut project management and commercial furniture. Commercial cleaning is available in Newcastle CBD and Lake Macquarie."}, {"question": "Where is Your Office Space based?", "answer": "Our team is based in Newcastle, NSW. Tenant representation and commercial buying are provided in NSW; FitOut and furniture briefs can be supported Australia-wide, subject to the agreed scope."}, {"question": "How are scope and fees agreed?", "answer": "We confirm the brief, responsibilities, scope and fees before an engagement begins. Each service has its own agreed scope."}]} />
      </main>

      <Footer />
    </>
  )
}
