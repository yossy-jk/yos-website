import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Image from 'next/image'
import ServiceFaq from '@/components/ServiceFaq'

export const metadata: Metadata = {
  title: 'Commercial Office Furniture | Your Office Space',
  description: 'Commercial furniture specified, quoted, delivered and installed for offices and workplaces across Australia.',
  alternates: { canonical: 'https://www.yourofficespace.au/furniture' },
  openGraph: {
    title: 'Commercial Office Furniture | Your Office Space',
    description: 'Commercial furniture specified, quoted, delivered and installed around your people, space, budget and programme.',
    url: 'https://www.yourofficespace.au/furniture',
    siteName: 'Your Office Space', locale: 'en_AU', type: 'website',
    images: [{ url: '/og/og-furniture.png', width: 1200, height: 630, alt: 'Commercial office furniture supplied and installed' }],
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Office Furniture | Your Office Space', description: 'Furniture specified, quoted, delivered and installed for commercial workplaces.', images: ['/og/og-furniture.png'] },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }
const SEC = { paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }
const CATEGORIES = [
  ['Desks & workstations', 'Fixed-height, sit-stand and workstation systems selected for the team, floorplate and technology.'],
  ['Task & executive seating', 'Commercial seating assessed for ergonomics, durability, adjustability and daily use.'],
  ['Meeting & boardroom', 'Tables, seating, power and presentation requirements resolved as one setting.'],
  ['Storage & lockers', 'Personal, team and document storage planned around what genuinely needs a home.'],
  ['Breakout & collaboration', 'Flexible settings for informal meetings, focused work, waiting and reset time.'],
  ['Reception & front of house', 'A practical first impression that fits the brand and the way visitors arrive.'],
] as const

const FAQS = [
  { question: 'Can YOS supply furniture without managing a fit out?', answer: 'Yes. Furniture can be delivered as a standalone service for a single room, an existing workplace refresh, a relocation or a complete new office.' },
  { question: 'What commercial furniture can you source?', answer: 'YOS can source workstations, desks, task and executive seating, meeting and boardroom settings, storage, lockers, breakout furniture and reception settings across established commercial ranges.' },
  { question: 'Do you coordinate delivery and installation?', answer: 'Yes. The quote can include delivery and installation, with access, sequencing, placement and completion coordinated before delivery day.' },
  { question: 'Can furniture be customised for our workplace?', answer: 'Made-to-order sizes, finishes and configurations may be available depending on the product, quantity, lead time and manufacturer. These requirements are confirmed during specification and quoting.' },
  { question: 'Can we see samples before ordering?', answer: 'Where suppliers offer samples, finish swatches or showroom access, we coordinate these so key selections can be checked before approval.' },
  { question: 'Do you supply ergonomic furniture?', answer: 'Yes. We can source adjustable task seating, sit-stand workstations and other ergonomic products suited to the people, work patterns and budget.' },
  { question: 'What lead times should we allow?', answer: 'Lead times vary by product, quantity, finish and manufacturer. We confirm availability during quoting and coordinate ordering against the workplace programme.' },
  { question: 'Can you remove or reuse existing furniture?', answer: 'We can review what should be retained, relocated, repurposed or separately removed, then reflect those decisions in the furniture plan and delivery sequence.' },
] as const

export default function FurniturePage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <section className="relative min-h-[82vh] flex items-center overflow-hidden"><Image src="/images/furniture/space-liverpool-a.jpg" alt="Commercial workplace furnished with workstations and collaborative settings" fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-near-black/75" /><div className={`relative z-10 ${WRAP}`} style={{ ...PAD, ...SEC, paddingTop: 'clamp(8rem,12vw,11rem)' }}>
      <FadeIn><SectionLabel>Office &amp; Commercial Furniture</SectionLabel></FadeIn>
      <FadeIn delay={80}><h1 className="text-white leading-[0.98] mt-3 mb-7 max-w-4xl" style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}>Furniture that fits the work, not just the floor plan.</h1></FadeIn>
      <FadeIn delay={160}><p className="text-white/80 leading-relaxed max-w-2xl mb-9" style={{ fontSize: 'clamp(1.05rem,2vw,1.3rem)' }}>We specify, quote, supply and coordinate installation of commercial furniture around your people, space, budget and programme. You can engage us for furniture only or as part of a wider workplace project.</p></FadeIn>
      <FadeIn delay={220}><div className="flex flex-col sm:flex-row gap-4"><Button href="/resources/furniture-quote" variant="primary" size="lg">Request a furniture quote</Button><Button href="/contact?service=furniture" variant="outline-light" size="lg">Enquire</Button></div></FadeIn>
    </div></section>

    <section className="bg-white" style={SEC}><div className={WRAP} style={PAD}>
      <FadeIn><SectionLabel>What we specify</SectionLabel><h2 className="text-near-black mt-3 mb-12 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Every setting has a job to do.</h2></FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{CATEGORIES.map(([title, body], index) => <FadeIn key={title} delay={index * 50}><article className="h-full bg-warm-grey p-8 rounded-2xl"><p className="text-teal font-bold text-sm mb-5">{String(index + 1).padStart(2, '0')}</p><h3 className="text-near-black text-xl mb-3">{title}</h3><p className="text-charcoal leading-relaxed">{body}</p></article></FadeIn>)}</div>
    </div></section>

    <section className="bg-light-teal" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`} style={PAD}>
      <FadeIn><div className="relative min-h-[360px] overflow-hidden rounded-3xl"><Image src="/images/furniture/burgtec-room-workstations.jpg" alt="Customisable commercial workstations in a completed office" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div></FadeIn>
      <FadeIn delay={100}><SectionLabel>Made for your space</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>More choice, properly coordinated.</h2><div className="mt-6 space-y-5 text-charcoal leading-relaxed text-lg"><p>We source across established commercial manufacturers and wholesale ranges, with made-to-order sizes, finishes and configurations where the brief calls for them.</p><p>We quote, supply and coordinate installation so product, access, placement and programme are resolved before delivery day.</p></div></FadeIn>
    </div></section>

    <section className="bg-white" style={SEC}><div className={WRAP} style={PAD}><FadeIn><SectionLabel>Workplace inspiration</SectionLabel><h2 className="text-near-black mt-3 mb-12 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>See how different settings work together.</h2></FadeIn><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{[
      ['/images/furniture/space-wsi-workstations.jpg', 'Workstations arranged for focused individual work'],
      ['/images/furniture/burgtec-room-collaboration.jpg', 'Informal collaboration setting with commercial furniture'],
      ['/images/furniture/dbt-boardroom.jpg', 'Boardroom table, seating and acoustic treatment'],
      ['/images/furniture/space-bendigo-detail.jpg', 'Detailed breakout and meeting furniture setting'],
      ['/images/furniture/burgtec-open-plan.jpg', 'Open-plan workplace furniture and storage'],
      ['/images/furniture/space-pillowtalk-b.jpg', 'Commercial lounge and flexible meeting setting'],
    ].map(([src, alt], index) => <FadeIn key={src} delay={index * 50}><figure className="group relative min-h-[20rem] overflow-hidden rounded-2xl"><Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" /><figcaption className="absolute inset-x-0 bottom-0 bg-near-black/85 p-5 text-sm font-semibold text-white">{alt}</figcaption></figure></FadeIn>)}</div></div></section>

    <section className="bg-near-black" style={SEC}><div className={WRAP} style={PAD}>
      <FadeIn><SectionLabel>How it works</SectionLabel><h2 className="text-white mt-3 mb-12 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>From product brief to installed workplace.</h2></FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[
        ['Brief', 'Headcount, layout, use, budget, timing and existing furniture.'],
        ['Specify & sample', 'Suitable products and finishes are shortlisted and samples arranged where available.'],
        ['Quote', 'Products, quantities, finishes, delivery, installation and exclusions are recorded.'],
        ['Deliver & install', 'Site access, delivery sequence, placement and completion are coordinated.'],
      ].map(([title, body], index) => <FadeIn key={title} delay={index * 60}><article className="h-full border border-white/15 rounded-2xl p-7"><p className="text-teal font-bold text-sm mb-5">0{index + 1}</p><h3 className="text-white text-xl mb-3">{title}</h3><p className="text-white/70 leading-relaxed">{body}</p></article></FadeIn>)}</div>
    </div></section>

    <section className="bg-white" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12`} style={PAD}>
      <FadeIn><SectionLabel>Furnish without a fit out</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Staying put can still work better.</h2></FadeIn>
      <FadeIn delay={100}><div><p className="text-charcoal text-lg leading-relaxed mb-7">A furniture brief can refresh an existing workplace without construction. We can help replace worn settings, improve ergonomics, support growth or standardise furniture across multiple locations.</p><p className="text-charcoal leading-relaxed">Trade and bulk requirements are assessed against quantity, specification, delivery location and programme.</p></div></FadeIn>
    </div></section>

    <section className="bg-warm-grey" style={SEC}><div className={WRAP} style={PAD}><div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 items-start lg:items-center"><div className="flex-1"><SectionLabel>More than furniture?</SectionLabel><h2 className="text-near-black mt-3 mb-3 text-3xl">Planning building work as well?</h2><p className="text-charcoal leading-relaxed">Our separate fit out service provides client-side project management across brief, budget, design, procurement and delivery.</p></div><Button href="/office-fitout" variant="outline" size="lg">Explore fit out</Button></div></div></section>
    <ServiceFaq items={FAQS} />
    <section className="bg-teal" style={SEC}><div className={`${WRAP} text-center`} style={PAD}><h2 className="text-near-black mb-6" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>Tell us what the workplace needs.</h2><Button href="/contact?service=furniture" variant="dark" size="lg">Enquire</Button></div></section>
  </main><Footer /></>
}
