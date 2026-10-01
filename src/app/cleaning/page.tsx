import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { CheckIcon } from '@/components/Icons'

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const PAD    = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }
import FadeIn from '@/components/FadeIn'
import HubSpotForm from '@/components/HubSpotForm'
import ServiceFaq from '@/components/ServiceFaq'

const CLEANING_FAQS = [
  { question: 'How is commercial cleaning priced?', answer: 'Pricing depends on the size, use, frequency, access and agreed Scope of Works. We inspect the site before preparing a tailored proposal.' },
  { question: 'Do you use the same cleaning team every visit?', answer: 'We aim to keep the same team on each site wherever possible, supported by documented scopes, site notes and quality checks.' },
  { question: 'Where is commercial cleaning available?', answer: 'Our commercial cleaning service covers Newcastle CBD and Lake Macquarie.' },
  { question: 'How often should a commercial office be cleaned?', answer: 'The right frequency depends on occupancy, visitor numbers, amenities and presentation requirements. We recommend a schedule after inspecting the workplace.' },
  { question: 'What is included in a standard office clean?', answer: 'The agreed scope may include rubbish removal, kitchens, bathrooms, surface wiping, vacuuming and hard-floor care. Every inclusion and exclusion is documented before service begins.' },
  { question: 'Can cleaning happen after hours?', answer: 'Yes. Access, timing, alarms, keys and security requirements are agreed during the site inspection and documented before commencement.' },
  { question: 'How do you manage quality?', answer: 'The scope is documented, issues have a direct management pathway and Sarah oversees regular quality assurance so standards remain visible.' },
  { question: 'Can you handle a post-FitOut clean and ongoing service?', answer: 'Yes. A handover clean and the ongoing workplace service can be coordinated as separate, clearly scoped workstreams.' },
] as const

export const metadata = {
  title: 'Commercial Cleaning Newcastle & Lake Macquarie | YOS',
  description: 'Commercial cleaning for Newcastle CBD and Lake Macquarie workplaces, with the same team, monthly QA and a quote within 24 hours of site inspection.',
  twitter: { card: 'summary_large_image', title: 'Commercial Cleaning Newcastle | Your Office Space', description: 'Clear scope. Consistent team. Monthly quality checks.' },
  alternates: { canonical: 'https://www.yourofficespace.au/cleaning' },
  openGraph: {
    title: 'Commercial Cleaning Newcastle | Consistent, Accountable, Local | Your Office Space',
    description: 'Commercial cleaning for Newcastle offices and workplaces, with a clear scope, a consistent team and monthly quality checks.',
    url: 'https://www.yourofficespace.au/cleaning',
    images: [{ url: '/og/og-cleaning.png', width: 1200, height: 630, alt: 'Commercial Office Cleaning Newcastle | Consistent, Accountable, Local | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function CleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://www.yourofficespace.au/#organization",
            "name": "Your Office Space",
            "url": "https://www.yourofficespace.au",
            "logo": "https://www.yourofficespace.au/brand/yos-logo-black.png",
            "telephone": "+61240920733",
            "email": "jk@yourofficespace.au",
            "description": "Newcastle-based commercial cleaning and workplace services.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" }
            ]
          },
          {
            "@type": "Service",
            "@id": "https://www.yourofficespace.au/cleaning#service",
            "name": "Commercial Cleaning Newcastle",
            "provider": { "@id": "https://www.yourofficespace.au/#organization" },
            "description": "Commercial cleaning for workplaces in Newcastle CBD and Lake Macquarie, with a consistent team and monthly quality assurance.",
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "City", "name": "Charlestown" },
              { "@type": "City", "name": "Merewether" },
              { "@type": "City", "name": "Adamstown" },
              { "@type": "City", "name": "Kotara" },
              { "@type": "City", "name": "Wallsend" },
              { "@type": "City", "name": "Cardiff" },
              { "@type": "City", "name": "Cameron Park" },
              { "@type": "State", "name": "New South Wales" }
            ],
            "serviceType": "Commercial Cleaning",
            "url": "https://www.yourofficespace.au/cleaning"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How is commercial cleaning priced?", "acceptedAnswer": { "@type": "Answer", "text": "Pricing depends on the size, use, frequency, access and agreed Scope of Works. We inspect the site before preparing a tailored proposal." } },
              { "@type": "Question", "name": "Do you use the same cleaning team every visit?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every Your Office Space cleaning contract is serviced by the same team on every visit. We do not rotate staff. You know who is coming and so do we." } },
              { "@type": "Question", "name": "Where is commercial cleaning available?", "acceptedAnswer": { "@type": "Answer", "text": "Commercial cleaning is available in Newcastle CBD and Lake Macquarie." } },
              { "@type": "Question", "name": "How often should a commercial office be cleaned?", "acceptedAnswer": { "@type": "Answer", "text": "Most offices benefit from daily or every-second-day cleaning for high-traffic environments, and weekly for lower-use spaces. We work with each client to determine the right frequency for their space, team size and usage patterns." } },
              { "@type": "Question", "name": "What is included in a standard commercial office clean?", "acceptedAnswer": { "@type": "Answer", "text": "Standard commercial office cleaning includes rubbish removal, kitchen and breakroom cleaning, bathroom sanitation, desk and surface wiping, floor care (vacuum/mop), and bin replacement. Deep cleans, infection control cleans and carpet extraction are charged separately." } },
              { "@type": "Question", "name": "Can the cleaning happen after hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Access, timing and security requirements are agreed during the site inspection and documented in the Scope of Works." } }
            ]
          }
        ]
      }) }} />
      <Nav />

      <main id="main-content" tabIndex={-1}>
      <section className="relative min-h-[86vh] flex items-center bg-near-black overflow-hidden"
        style={SEC}>
        <Image src="/images/furniture/space-liverpool-b.jpg" alt="Clean, presentation-ready commercial workplace" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-near-black/75" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Commercial Cleaning</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              A clean office, every visit,<br />
              <span className="text-teal">without chasing anyone.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/80 font-light leading-relaxed max-w-2xl mb-8 sm:mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              The same team every visit, monthly quality assurance overseen by Sarah, and a clear Scope of Works for workplaces in Newcastle CBD and Lake Macquarie.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              <Button href="#cleaning-quote-form" variant="primary" size="lg">
                Get a cleaning quote
              </Button>
              <a href="/contact?service=cleaning"
                className="inline-flex min-h-14 min-w-40 items-center justify-center gap-2 rounded-lg border-2 border-white/70 px-8 py-4 text-white font-bold no-underline transition hover:-translate-y-0.5 hover:bg-white/10 hover:border-white motion-reduce:transform-none"
                style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', letterSpacing: '0.02em' }}>
                Enquire
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-near-black border-b border-white/5"
        style={SEC_SM}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5">
              {[
                { stat: 'Same team', label: 'Every visit, no surprises' },
                { stat: 'Monthly', label: 'Quality audits on every site' },
                { stat: 'After hours', label: 'Timing agreed around your workplace' },
                { stat: 'Clear scope', label: 'Tasks and standards documented' },
              ].map(item => (
                <div key={item.label} className="bg-near-black text-center" style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,1.5rem)' }}>
                  <p className="text-teal font-black text-2xl lg:text-3xl mb-2 leading-tight">{item.stat}</p>
                  <p className="text-white/50 font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── IMAGE BREAK 1 ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(26rem,42vw,38rem)' }}>
        <Image src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80" alt="Immaculately clean modern commercial office" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.52)' }} />
        <div className="absolute inset-0 flex items-end max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)', paddingBottom: 'clamp(2.5rem,6vw,5rem)' }}>
          <FadeIn>
            <p className="text-white font-semibold" style={{ fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', maxWidth: '44rem', lineHeight: 1.75, borderLeft: '3px solid #00B5A5', paddingLeft: '1.5rem' }}>
              Cleaning scopes are documented around the site, access requirements, service frequency and agreed quality checks.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>What we clean</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-10 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Practical services for working spaces.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                type: 'Regular Office Cleaning',
                services: [
                  'Daily office cleaning',
                  'Kitchen and break room',
                  'Washroom maintenance',
                  'Carpet and hard floor care',
                  'Glass and internal touchpoints',
                ],
                note: 'Professional environments demand professional cleaning.'
              },
              {
                type: 'Full Detail Cleaning',
                services: [
                  'Detailed surfaces and edges',
                  'Skirtings and internal glass',
                  'Kitchen and washroom detail',
                  'Carpet and hard-floor attention',
                  'Agreed periodic tasks',
                ],
                note: 'A deeper scheduled clean beyond the regular service.'
              },
              {
                type: 'Mini Detail Cleaning',
                services: [
                  'High-touch point attention',
                  'Kitchen and washroom refresh',
                  'Targeted dust and marks',
                  'Selected floor areas',
                  'Tasks agreed for the site',
                ],
                note: 'A focused reset between larger detail cleans.'
              },
              {
                type: 'Hygiene and Post-Construction',
                services: [
                  'Deep site cleanup',
                  'Dust removal and disposal',
                  'Debris extraction',
                  'Hygiene-bin servicing by arrangement',
                  'Final readiness preparation',
                ],
                note: 'We coordinate closely with your fit out and building teams.'
              },
            ].map((category, i) => (
              <FadeIn key={category.type} delay={i * 70} direction="up">
                <article className="bg-warm-grey rounded-2xl border border-black/5 p-7 sm:p-10 h-full hover:border-teal">
                  <h3 className="text-near-black font-bold text-base mb-5 border-b-2 border-teal pb-3">
                    {category.type}
                  </h3>
                  <ul className="space-y-2.5 mb-5">
                    {category.services.map(service => (
                      <li key={service} className="flex items-start pl-4 border-l-2 border-teal">
                        <span className="text-charcoal font-light text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-mid-grey font-light text-sm font-semibold border-t border-gray-200 pt-4">
                    {category.note}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL QUALITY OWNERSHIP */}
      <section className="bg-light-teal" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16 items-center" style={PAD}>
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl aspect-[4/5] max-w-md">
              <Image src="/team/sarah-kelley.jpg" alt="Sarah Kelley, commercial cleaning quality lead at Your Office Space" fill sizes="(max-width: 1024px) 90vw, 32vw" className="object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <SectionLabel>Local quality ownership</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>
              A real person accountable for the standard.
            </h2>
            <p className="text-charcoal leading-relaxed text-lg mb-5 max-w-2xl">
              Sarah oversees the cleaning relationship and regular quality assurance. Your agreed scope, site feedback and follow-up stay connected to one accountable team.
            </p>
            <p className="text-near-black font-semibold">Sarah Kelley · Cleaning quality lead</p>
          </FadeIn>
        </div>
      </section>

      {/* THE YOS DIFFERENCE */}
      <section className="bg-near-black"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>The YOS difference</SectionLabel>
            <h2 className="text-white font-bold leading-tight tracking-tight mt-3 mb-10 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              How we keep the standard visible.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: 'Same team, every time',
                body: 'No rotating cast of contractors. The same people clean your space every visit. They learn your building. They know what matters. Consistency builds trust.',
                aside: 'Familiarity = fewer mistakes.'
              },
              {
                title: 'Monthly quality audits',
                body: 'Sarah oversees monthly quality assurance against the agreed Scope of Works, so the service stays connected to the standard promised.',
                aside: 'Accountability built into the contract.'
              },
              {
                title: 'Direct line to management',
                body: 'If something is not right, the issue goes to the team responsible for the service. The response stays connected to your Scope of Works.',
                aside: 'Real problems, real solutions.'
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80} direction="up">
                <article className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 sm:p-10 h-full hover:bg-white/[0.07] hover:border-teal transition-colors duration-200">
                  <h3 className="text-white font-bold text-lg mb-4">{item.title}</h3>
                  <p className="text-white/80 font-light leading-relaxed mb-5" style={{ fontSize: "0.95rem", lineHeight: 1.8 }}>{item.body}</p>
                  <p className="text-white/35 font-light text-xs font-semibold border-t border-white/10 pt-4">{item.aside}</p>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="border-l-4 border-teal pl-8 py-6 bg-teal/[0.06] rounded-r-sm">
              <p className="text-white font-light leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
                We show up because we have skin in the game.
                Your space matters to us personally. That changes how we work.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* BUNDLE, cross-sell to fitout */}
      <section className="bg-warm-grey"
        style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="bg-near-black rounded-3xl overflow-hidden grid lg:grid-cols-[1.05fr_0.95fr] min-h-[28rem]">
              <div className="relative min-h-[18rem] lg:min-h-full">
                <Image
                  src="/images/furniture/space-wsi-openplan.jpg"
                  alt="Finished commercial workplace ready for handover and ongoing cleaning"
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/45 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">One coordinated handover</p>
                <h2 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.9rem,3.5vw,3.25rem)' }}>
                  Move into a finished workplace, then keep it that way.
                </h2>
                <p className="text-white/70 font-light text-base leading-relaxed mb-8 max-w-xl">
                  When we manage your FitOut, the final clean and ongoing service can be planned before handover. One scope, clear responsibilities and a workplace ready from day one.
                </p>
                <Button href="/office-fitout" variant="primary" size="lg">
                  Explore FitOut
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* INLINE QUOTE FORM */}
      <section className="bg-near-black" style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">Get a Quote</p>
                <h2 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                  Tell us about your space.
                </h2>
                <p className="text-white/60 font-light leading-relaxed mb-8" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}>
                  We cover Newcastle CBD and Lake Macquarie. After the site inspection, we prepare your tailored quote within 24 hours.
                </p>
                <div className="flex flex-col gap-2 text-white/40 text-sm">
                  {["Newcastle CBD", "Lake Macquarie", "Same team every visit", "Monthly QA overseen by Sarah", "Quote within 24 hours of site inspection"].map(s => (
                    <span key={s} className="flex items-center gap-2"><CheckIcon />{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-warm-grey rounded-sm p-7 sm:p-10">
                <HubSpotForm formId="b1a300a1-c032-486e-a04d-308d140da948" targetId="cleaning-quote-form" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <ServiceFaq heading="Clear answers before your first clean." items={CLEANING_FAQS} />

      {/* CTA */}
      <section className="bg-teal text-white"
        style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <h2 className="text-white font-bold leading-tight mb-5 w-full"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)' }}>
                Ready to move to a better standard?
              </h2>
              <p className="text-white font-light text-lg leading-relaxed mb-10 w-full">
                Start with a site quote or send an enquiry. We&apos;ll confirm the scope before any service begins.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center">
                <Button href="#cleaning-quote-form" variant="dark" size="lg">
                  Get a cleaning quote
                </Button>
                <a href="/contact?service=cleaning"
                  className="inline-flex items-center gap-2 text-white font-bold border border-white/30 rounded-none px-6 py-3 no-underline hover:border-white transition-colors"
                  style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', letterSpacing: '0.02em' }}>
                  Enquire
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Join the team */}
      <section style={{ background: '#111', paddingTop: 'clamp(3rem,6vw,4.5rem)', paddingBottom: 'clamp(3rem,6vw,4.5rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Work with us</p>
            <p style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.4rem)', margin: 0 }}>Looking for cleaning work in Newcastle or Lake Macquarie?</p>
          </div>
          <Button href="/cleaning/work-with-us" variant="primary" size="lg">
            Express interest
          </Button>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
