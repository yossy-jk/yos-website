import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'

export const metadata: Metadata = {
  title: 'Commercial Office Furniture | Your Office Space',
  description: 'Commercial furniture specified, quoted, delivered and installed for offices and workplaces across Australia.',
  alternates: { canonical: 'https://www.yourofficespace.au/furniture' },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)' }
const SEC = { paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }
const CATEGORIES = [
  ['Desks & workstations', 'Fixed-height, sit-stand and workstation systems selected for the team, floorplate and technology.'],
  ['Task & executive seating', 'Commercial seating assessed for ergonomics, durability, adjustability and daily use.'],
  ['Meeting & boardroom', 'Tables, seating, power and presentation requirements resolved as one setting.'],
  ['Storage & lockers', 'Personal, team and document storage planned around what genuinely needs a home.'],
  ['Breakout & collaboration', 'Flexible settings for informal meetings, focused work, waiting and reset time.'],
  ['Reception & front of house', 'A practical first impression that fits the brand and the way visitors arrive.'],
] as const

export default function FurniturePage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <section className="bg-near-black min-h-[82vh] flex items-center" style={SEC}><div className={WRAP} style={{ ...PAD, paddingTop: 'clamp(5rem,10vw,9rem)' }}>
      <FadeIn><SectionLabel>Office &amp; Commercial Furniture</SectionLabel></FadeIn>
      <FadeIn delay={80}><h1 className="text-white leading-[0.98] mt-3 mb-7 max-w-4xl" style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}>Furniture that fits the work, not just the floor plan.</h1></FadeIn>
      <FadeIn delay={160}><p className="text-white/80 leading-relaxed max-w-2xl mb-9" style={{ fontSize: 'clamp(1.05rem,2vw,1.3rem)' }}>We specify, quote, supply and coordinate installation of commercial furniture around your people, space, budget and programme. You can engage us for furniture only or as part of a wider workplace project.</p></FadeIn>
      <FadeIn delay={220}><div className="flex flex-col sm:flex-row gap-4"><Button href="/resources/furniture-quote" variant="primary" size="lg">Request a furniture quote</Button><Button href="/contact?service=furniture" variant="outline-light" size="lg">Enquire</Button></div></FadeIn>
    </div></section>

    <section className="bg-white" style={SEC}><div className={WRAP} style={PAD}>
      <FadeIn><SectionLabel>What we specify</SectionLabel><h2 className="text-near-black mt-3 mb-12 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Every setting has a job to do.</h2></FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{CATEGORIES.map(([title, body], index) => <FadeIn key={title} delay={index * 50}><article className="h-full bg-warm-grey p-8 rounded-2xl"><p className="text-teal font-bold text-sm mb-5">{String(index + 1).padStart(2, '0')}</p><h3 className="text-near-black text-xl mb-3">{title}</h3><p className="text-charcoal leading-relaxed">{body}</p></article></FadeIn>)}</div>
    </div></section>

    <section className="bg-light-teal" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20`} style={PAD}>
      <FadeIn><SectionLabel>Australian-made option</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>The Academy Range, through EOF Group.</h2></FadeIn>
      <FadeIn delay={100}><div className="space-y-5 text-charcoal leading-relaxed text-lg"><p>For briefs suited to locally made product, we can specify from the Australian-made Academy Range through EOF Group.</p><p>Available product, finishes, lead times, delivery and installation are confirmed against the approved brief before an order is placed.</p></div></FadeIn>
    </div></section>

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
      <FadeIn><SectionLabel>Furnish without a FitOut</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Staying put can still work better.</h2></FadeIn>
      <FadeIn delay={100}><div><p className="text-charcoal text-lg leading-relaxed mb-7">A furniture brief can refresh an existing workplace without construction. We can help replace worn settings, improve ergonomics, support growth or standardise furniture across multiple locations.</p><p className="text-charcoal leading-relaxed">Trade and bulk requirements are assessed against quantity, specification, delivery location and programme.</p></div></FadeIn>
    </div></section>

    <section className="bg-warm-grey" style={SEC}><div className={`${WRAP} bg-white rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 items-start lg:items-center`}><div className="flex-1"><SectionLabel>More than furniture?</SectionLabel><h2 className="text-near-black mt-3 mb-3 text-3xl">Planning building work as well?</h2><p className="text-charcoal leading-relaxed">Our separate FitOut service provides client-side project management across brief, budget, design, procurement and delivery.</p></div><Button href="/office-fitout" variant="outline" size="lg">Explore FitOut</Button></div></section>
    <section className="bg-teal" style={SEC}><div className={`${WRAP} text-center`} style={PAD}><h2 className="text-near-black mb-6" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>Tell us what the workplace needs.</h2><Button href="/contact?service=furniture" variant="dark" size="lg">Enquire</Button></div></section>
  </main><Footer /></>
}
