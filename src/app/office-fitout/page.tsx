import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Image from 'next/image'
import ServiceFaq from '@/components/ServiceFaq'

export const metadata: Metadata = {
  title: 'Commercial FitOut Project Management | YOS',
  description: 'Client-side commercial FitOut project management from brief and preliminary budget through design, procurement, delivery and handover.',
  alternates: { canonical: 'https://www.yourofficespace.au/office-fitout' },
  openGraph: {
    title: 'Commercial Office FitOut Project Management | Your Office Space',
    description: 'Client-side project management connecting the workplace brief, budget, design, procurement, delivery and handover.',
    url: 'https://www.yourofficespace.au/office-fitout',
    siteName: 'Your Office Space', locale: 'en_AU', type: 'website',
    images: [{ url: '/og/og-office-fitout.png', width: 1200, height: 630, alt: 'Commercial office FitOut project management' }],
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Office FitOut Project Management', description: 'Client-side project management from brief to handover.', images: ['/og/og-office-fitout.png'] },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }
const SEC = { paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }
const PROCESS = [
  ['Discovery & brief', 'We define headcount, growth, ways of working, brand, landlord requirements, budget and timing. You receive a written brief for approval.'],
  ['Concept planning', 'Where required, we test the space with concept layouts so the brief is tested before design progresses.'],
  ['Preliminary budget', 'We establish an order-of-cost range, allowances and contingency before major commitments are made.'],
  ['Design & documentation', 'We coordinate the design team, finishes, building services, landlord requirements and approvals pathway on your behalf.'],
  ['Procurement', 'We compare properly scoped proposals, expose exclusions and support you to appoint the appropriate licensed contractors and suppliers.'],
  ['Delivery & handover', 'We manage the programme, decisions, risks, defects and handover as your client-side project manager.'],
] as const

const FAQS = [
  { question: 'What does a client-side FitOut project manager do?', answer: 'A client-side project manager represents the client across the brief, budget, design, procurement, programme, decisions, risks, defects and handover. YOS coordinates the project team but does not act as the builder or head contractor.' },
  { question: 'When should we appoint a FitOut project manager?', answer: 'The strongest time to start is before committing to a space or design pathway. Early involvement helps test the workplace brief, likely cost, programme and landlord requirements before major commitments are made.' },
  { question: 'Can YOS provide a preliminary FitOut budget?', answer: 'Yes. YOS can coordinate an order-of-cost range with clearly stated assumptions, allowances and contingency. It is an indicative planning tool, not a fixed construction quote.' },
  { question: 'Who performs the construction work?', answer: 'Trade and construction work is performed by appropriately appointed and licensed contractors. YOS supports scope comparison and procurement, then manages delivery from the client side.' },
  { question: 'How long does a commercial FitOut take?', answer: 'Timing depends on the size, approvals, design complexity, procurement and site conditions. We establish a realistic programme early and keep dependencies, decisions and risks visible.' },
  { question: 'Can you help before we sign a lease?', answer: 'Yes. Early involvement lets us test the brief, likely FitOut cost, programme, building constraints and landlord responsibilities before you commit.' },
  { question: 'How are contractor quotes compared?', answer: 'We align scopes, allowances, exclusions and responsibilities so proposals can be compared on the same basis, then support you to appoint the appropriate licensed contractors.' },
  { question: 'What happens at handover?', answer: 'We coordinate completion, defects, required documentation and outstanding actions so ownership is clear and the workplace is ready for use.' },
] as const

export default function OfficeFitoutPage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <section className="relative min-h-[82vh] flex items-center overflow-hidden"><Image src="/images/furniture/space-cogc-wide.jpg" alt="Completed commercial workplace with fitted meeting and work areas" fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-near-black/75" /><div className={`relative z-10 ${WRAP}`} style={{ ...PAD, ...SEC, paddingTop: 'clamp(8rem,12vw,11rem)' }}>
      <FadeIn><SectionLabel>Commercial FitOut &amp; project management</SectionLabel></FadeIn>
      <FadeIn delay={80}><h1 className="text-white leading-[0.98] mt-3 mb-7 max-w-4xl" style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}>Your FitOut, managed from your side of the table.</h1></FadeIn>
      <FadeIn delay={160}><p className="text-white/80 leading-relaxed max-w-2xl mb-9" style={{ fontSize: 'clamp(1.05rem,2vw,1.3rem)' }}>We act as your client-side project manager, connecting the brief, budget, design team, licensed contractors, programme and handover so you stay informed without becoming the project manager.</p></FadeIn>
      <FadeIn delay={220}><div className="flex flex-col sm:flex-row gap-4"><Button href="/resources/fitout-estimator" variant="primary" size="lg">Estimate your FitOut</Button><Button href="/contact?service=fitout" variant="outline-light" size="lg">Enquire</Button></div></FadeIn>
    </div></section>
    <section className="bg-light-teal" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20`} style={PAD}>
      <FadeIn><SectionLabel>Protect the whole budget</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>One budget. Many decisions competing for a share.</h2></FadeIn>
      <FadeIn delay={100}><div className="space-y-5 text-charcoal leading-relaxed text-lg"><p>Property costs, consultants, building work, services, furniture and late changes all draw from the same budget.</p><p>Our role is to make the trade-offs visible early, keep scope and responsibilities clear, and give you the information needed to approve each step.</p><p className="font-semibold text-near-black">YOS is your project manager, not the builder or head contractor. Trade work is performed by appropriately appointed and licensed contractors.</p></div></FadeIn>
    </div></section>
    <section className="bg-white" style={SEC}><div className={WRAP} style={PAD}>
      <FadeIn><SectionLabel>The YOS FitOut process</SectionLabel><h2 className="text-near-black mt-3 mb-12 max-w-3xl leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Six clear stages from first brief to handover.</h2></FadeIn>
      <ol className="fitout-process-flow">{PROCESS.map(([title, body], index) => <FadeIn key={title} delay={index * 50}><li><details><summary><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><i aria-hidden="true">+</i></summary><p>{body}</p></details></li></FadeIn>)}</ol>
    </div></section>
    <section className="bg-near-black" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12`} style={PAD}>
      <FadeIn><SectionLabel>What stays visible</SectionLabel><h2 className="text-white mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Scope, budget, programme and responsibility.</h2></FadeIn>
      <FadeIn delay={100}><ul className="space-y-4 text-white/80 text-lg">{['A brief the project team can work from', 'A budget that records assumptions, allowances and contingency', 'Comparable contractor and supplier scopes', 'A decision register and programme with clear owners', 'Defects, completion and handover tracked to close'].map(item => <li key={item} className="border-l-2 border-teal pl-5">{item}</li>)}</ul></FadeIn>
    </div></section>
    <section className="bg-warm-grey" style={SEC}><div className={`${WRAP} bg-white rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 items-start lg:items-center`}><div className="flex-1"><SectionLabel>Furniture comes next</SectionLabel><h2 className="text-near-black mt-3 mb-3 text-3xl">Need the space furnished as well?</h2><p className="text-charcoal leading-relaxed">Our commercial furniture service handles product specification, samples, quoting, delivery and installation as a separate, clearly defined workstream.</p></div><Button href="/furniture" variant="outline" size="lg">Explore furniture</Button></div></section>
    <ServiceFaq items={FAQS} />
    <section className="bg-teal" style={SEC}><div className={`${WRAP} text-center`} style={PAD}><h2 className="text-near-black mb-6" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>Tell us where the project stands.</h2><Button href="/contact?service=fitout" variant="dark" size="lg">Enquire</Button></div></section>
  </main><Footer /></>
}
