import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import ServiceFaq from '@/components/ServiceFaq'

export const metadata: Metadata = {
  title: 'Commercial Buyers Agent NSW | Your Office Space',
  description: 'Commercial Buyers Agent support in NSW, from an evidence-led property brief through search, due diligence coordination, negotiation and handover.',
  alternates: { canonical: 'https://www.yourofficespace.au/buyers-agency' },
  openGraph: {
    title: 'Commercial Buyers Agent NSW | Your Office Space',
    description: 'Commercial property buying support in NSW, from the brief and search through due diligence coordination, negotiation and handover.',
    url: 'https://www.yourofficespace.au/buyers-agency',
    siteName: 'Your Office Space', locale: 'en_AU', type: 'website',
    images: [{ url: '/og/og-buyers-agency.png', width: 1200, height: 630, alt: 'Commercial buyers agent services in New South Wales' }],
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Buyers Agent NSW', description: 'Commercial property buying support from brief to handover.', images: ['/og/og-buyers-agency.png'] },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }
const SEC = { paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }

const FAQS = [
  { question: 'What does a commercial buyers agent do?', answer: 'A commercial buyers agent represents the purchaser. YOS helps define the property brief, assess opportunities, coordinate commercial due diligence inputs, support negotiation and keep the decision pathway organised.' },
  { question: 'Where does YOS provide commercial buyers agent services?', answer: 'YOS provides commercial buyers agent services in New South Wales through Joseph Kelley, Class 2 licensed real estate agent No. 20565455.' },
  { question: 'Can YOS help with an SMSF property purchase?', answer: 'YOS can coordinate the commercial property workstream and help connect the purchaser with appropriately qualified advisers. YOS does not provide legal, tax, financial, credit or investment advice.' },
  { question: 'What does Structure Ready and Finance Ready mean?', answer: 'It means identifying the legal, ownership, tax, borrowing, valuation and approval questions early, so the purchaser and their appointed professional advisers can prepare before the right property is found.' },
] as const

export default function BuyersAgencyPage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <section className="bg-near-black min-h-[78vh] flex items-center" style={SEC}><div className={WRAP} style={{ ...PAD, paddingTop: 'clamp(5rem,10vw,9rem)' }}>
      <FadeIn><SectionLabel>Commercial Buyers Agent · NSW</SectionLabel></FadeIn>
      <FadeIn delay={80}><h1 className="text-white leading-[0.98] mt-3 mb-7 max-w-4xl" style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}>Buy the right commercial property, with someone on your side.</h1></FadeIn>
      <FadeIn delay={160}><p className="text-white/80 leading-relaxed max-w-2xl mb-9" style={{ fontSize: 'clamp(1.05rem,2vw,1.3rem)' }}>We represent commercial buyers in NSW, turning the business objective into a clear property brief and coordinating the search, evidence, professional advice and negotiation before you commit.</p></FadeIn>
      <FadeIn delay={220}><Button href="/contact?service=buying" variant="primary" size="lg">Enquire</Button></FadeIn>
    </div></section>

    <section className="bg-white" style={SEC}><div className={WRAP} style={PAD}>
      <FadeIn><SectionLabel>The buying pathway</SectionLabel><h2 className="text-near-black mt-3 mb-12 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>A commercial decision, tested from every side.</h2></FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[
        ['Brief & decision criteria', 'Define the intended use, location, property requirements, budget, timing, stakeholders and non-negotiables.'],
        ['Search & opportunity assessment', 'Assess advertised and introduced opportunities against the same brief, without letting a listing dictate the strategy.'],
        ['Due diligence coordination', 'Keep legal, finance, tax, valuation, building and environmental workstreams connected, with each adviser responsible for their discipline.'],
        ['Negotiation & handover', 'Support the commercial negotiation, document the decision points and coordinate the agreed path through exchange, settlement and workplace planning.'],
      ].map(([title, body], index) => <FadeIn key={title} delay={index * 60}><article className="h-full bg-warm-grey rounded-2xl p-8"><p className="text-teal font-bold text-sm mb-5">0{index + 1}</p><h3 className="text-near-black text-xl mb-3">{title}</h3><p className="text-charcoal leading-relaxed">{body}</p></article></FadeIn>)}</div>
    </div></section>

    <section className="bg-light-teal" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20`} style={PAD}>
      <FadeIn><SectionLabel>Structure Ready, Finance Ready</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>The property search should not outrun the professional advice.</h2></FadeIn>
      <FadeIn delay={100}><div className="space-y-5 text-charcoal leading-relaxed text-lg"><p>Before the search becomes a transaction, we help define the questions your solicitor, accountant, finance broker, valuer and other advisers need to resolve.</p><p>You choose and appoint your professional team. YOS coordinates the commercial property workstream and keeps assumptions, dependencies and decisions visible.</p><p className="font-semibold text-near-black">YOS does not provide legal, tax, financial, credit or investment advice.</p></div></FadeIn>
    </div></section>

    <section className="bg-near-black" style={SEC}><div className={WRAP} style={PAD}><FadeIn><SectionLabel>Considering an SMSF purchase?</SectionLabel><h2 className="text-white mt-3 mb-6 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Get specialist advice before the property decision.</h2><p className="text-white/75 text-lg leading-relaxed max-w-3xl">Purchasing commercial property through a self-managed super fund can involve strict legal, tax, borrowing, related-party and use requirements. Information on this site is general only. Obtain advice from appropriately qualified and licensed legal, tax, financial and credit professionals before acting.</p></FadeIn></div></section>

    <ServiceFaq items={FAQS} />

    <section className="bg-teal" style={SEC}><div className={`${WRAP} text-center`} style={PAD}><h2 className="text-near-black mb-6" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>Start with the business objective.</h2><Button href="/contact?service=buying" variant="dark" size="lg">Enquire</Button></div></section>
  </main><Footer /></>
}
