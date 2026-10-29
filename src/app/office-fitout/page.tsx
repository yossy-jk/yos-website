import Link from 'next/link'
import { CLIENT_REVIEWS } from '@/lib/client-reviews'
import ServiceEnquiry from '@/components/ServiceEnquiry'
import WorkplaceGuides from '@/components/WorkplaceGuides'
import ContentBreadcrumbs from '@/components/ContentBreadcrumbs'
import PlanningResources from '@/components/PlanningResources'
import ServiceSchema from '@/components/ServiceSchema'
import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Image from 'next/image'
import ServiceFaq from '@/components/ServiceFaq'

export const metadata: Metadata = withPageSeo({
  title: 'Office Fitout Newcastle | Client-side Project Management',
  description: 'Office fit out and refurbishment project management in Newcastle. Plan the brief, budget, appointed contractors and handover with YOS on your side.',
  alternates: { canonical: 'https://www.yourofficespace.au/office-fitout' },
  openGraph: {
    title: 'Office Fitout Newcastle | Client-side Project Management',
    description: 'Client-side project management connecting the workplace brief, budget, design, procurement, delivery and handover.',
    url: 'https://www.yourofficespace.au/office-fitout',
    siteName: 'Your Office Space', locale: 'en_AU', type: 'website',
    images: [{ url: '/og/og-office-fitout.png', width: 1200, height: 630, alt: 'Commercial office FitOut project management' }],
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Office FitOut Project Management', description: 'Client-side project management from brief to handover.', images: ['/og/og-office-fitout.png'] },
})

const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.25rem,3vw,2rem)', paddingRight: 'clamp(1.25rem,3vw,2rem)' }
const SEC = { paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }
const PROCESS = [
  ['Discovery & brief', 'We define headcount, growth, ways of working, brand, landlord requirements, budget and timing. You receive a written brief for approval.', 'List the essentials separately from preferences, and gather a floor plan and site photos if available.'],
  ['Concept planning', 'Where required, we test the space with concept layouts so the brief is tested before design progresses.', 'Test headcount, meeting needs, circulation and storage before choosing finishes.'],
  ['Preliminary budget', 'We establish an order-of-cost range, allowances and contingency before major commitments are made.', 'Check what the allowance includes: works, consultants, furniture, moving costs and contingency should be visible.'],
  ['Design & documentation', 'We coordinate the design team, finishes, building services, landlord requirements and approvals pathway on your behalf.', 'Name the owner of each landlord, consultant and approval decision, with the date it is needed.'],
  ['Procurement', 'We compare properly scoped proposals, expose exclusions and support you to appoint the appropriate licensed contractors and suppliers.', 'Compare access assumptions, allowances, exclusions and responsibilities alongside the headline price.'],
  ['Delivery & handover', 'We manage the programme, decisions, risks, defects and handover as your client-side project manager.', 'Agree who closes defects, receives documentation and coordinates IT, furniture and operational readiness.'],
] as const

const FAQS = [
  { question: 'Can YOS help with an office refurbishment in Newcastle?', answer: 'Yes. We can coordinate the client-side brief, scope, budget, consultant inputs and appointed contractors for a Newcastle office refurbishment. If the business remains operating, include staged access, disruption limits and IT changeovers in the plan. The actual scope and programme are agreed for your premises.' },
  { question: 'What does a client-side FitOut project manager do?', answer: 'A client-side project manager represents the client across the brief, budget, design, procurement, programme, decisions, risks, defects and handover. YOS coordinates the project team but does not act as the builder or head contractor.' },
  { question: 'When should we appoint a FitOut project manager?', answer: 'The strongest time to start is before committing to a space or design pathway. Early involvement helps test the workplace brief, likely cost, programme and landlord requirements before major commitments are made.' },
  { question: 'Can YOS provide a preliminary FitOut budget?', answer: 'Yes. YOS can coordinate an order-of-cost range with clearly stated assumptions, allowances and contingency. It is an indicative planning tool, not a fixed construction quote.' },
  { question: 'Who performs the construction work?', answer: 'Trade and construction work is performed by appropriately appointed and licensed contractors. YOS supports scope comparison and procurement, then manages delivery from the client side.' },
  { question: 'How long does a commercial FitOut take?', answer: 'Timing depends on the size, approvals, design complexity, procurement and site conditions. We establish a realistic programme early and keep dependencies, decisions and risks visible.' },
  { question: 'Can you help before we sign a lease?', answer: 'Yes. Early involvement lets us test the brief, likely FitOut cost, programme, building constraints and landlord responsibilities before you commit.' },
  { question: 'How are contractor quotes compared?', answer: 'We align scopes, allowances, exclusions and responsibilities so proposals can be compared on the same basis, then support you to appoint the appropriate licensed contractors.' },
  { question: 'What happens at handover?', answer: 'We coordinate completion, defects, required documentation and outstanding actions so ownership is clear and the workplace is ready for use.' },
] as const

const FITOUT_REVIEW = CLIENT_REVIEWS.find(review => review.name === 'Nathan Franks')!

export default function OfficeFitoutPage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
      <ServiceSchema name="Commercial FitOut Project Management" path="/office-fitout" description="Client-side FitOut project management, coordinating the workplace brief, planning, procurement and handover." area="Australia" />
    <section className="hero-static relative min-h-[82vh] flex items-center overflow-hidden"><Image src="/images/furniture/space-cogc-wide.jpg" alt="Completed commercial workplace with fitted meeting and work areas" fill preload sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-near-black/75" /><div className={`relative z-10 ${WRAP}`} style={{ ...PAD, ...SEC, paddingTop: 'clamp(8rem,12vw,11rem)' }}>
      <ContentBreadcrumbs title="Office fit out" path="/office-fitout" /><FadeIn><SectionLabel>Commercial FitOut &amp; project management</SectionLabel></FadeIn>
      <FadeIn delay={80}><h1 className="text-white leading-[0.98] mt-3 mb-7 max-w-4xl" style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}>Office fitout Newcastle. Managed on your behalf.</h1></FadeIn>
      <FadeIn delay={160}><p className="text-white/80 leading-relaxed max-w-2xl mb-9" style={{ fontSize: 'clamp(1.05rem,2vw,1.3rem)' }}>We act as your client-side project manager, connecting the brief, budget, design team, licensed contractors, programme and handover so you stay informed without becoming the project manager.</p></FadeIn>
      <FadeIn delay={220}><div className="flex flex-col sm:flex-row gap-4"><Button href="#fitout-enquiry" variant="primary" size="lg">Discuss your FitOut project</Button><Button href="/resources/fitout-estimator" variant="outline-light" size="lg">Explore an indicative budget</Button></div><p className="service-next-step">Start with your location, timing and workplace priorities. We will review the brief and confirm what information is needed next.</p></FadeIn>
    </div></section>
    <nav aria-label="FitOut page sections" className="bg-warm-grey border-b border-black/10"><div className={`${WRAP} flex flex-wrap gap-x-8 gap-y-3`} style={{ ...PAD, paddingTop: 24, paddingBottom: 24 }}>{[['#fitout-process', 'Project stages'], ['#fitout-responsibilities', 'Who does what'], ['#fitout-team', 'Your team and feedback'], ['#newcastle-planning-pack', 'Planning guide and tools']].map(([href, label]) => <a key={href} href={href} className="text-dark-teal font-semibold underline underline-offset-4">{label}</a>)}</div></nav>
    <section className="bg-light-teal" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20`} style={PAD}>
      <FadeIn><SectionLabel onLight>Protect the whole budget</SectionLabel><h2 className="text-near-black mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>One budget. Many decisions competing for a share.</h2></FadeIn>
      <FadeIn delay={100}><div className="space-y-5 text-charcoal leading-relaxed text-lg"><p>Property costs, consultants, building work, services, furniture and late changes all draw from the same budget.</p><p>Our role is to make the trade-offs visible early, keep scope and responsibilities clear, and give you the information needed to approve each step.</p><p className="font-semibold text-near-black">YOS is your project manager, not the builder or head contractor. Trade work is performed by appropriately appointed and licensed contractors.</p></div></FadeIn>
    </div></section>
    <section className="bg-warm-grey" style={SEC}><div className={WRAP} style={PAD}><SectionLabel onLight>Office fit out planning in Newcastle and the Hunter</SectionLabel><h2 className="text-near-black leading-tight max-w-3xl" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: 20, marginBottom: 24, scrollMarginTop: 144 }}>Resolve the premises and programme before ordering the works.</h2><p className="text-charcoal leading-relaxed max-w-3xl" style={{ marginBottom: 20 }}>For a Newcastle or Hunter office fit out, begin with the site address, usable area, proposed headcount, existing condition and target opening date. Landlord requirements, consultant inputs and approval responsibilities should be identified alongside the preliminary budget.</p><p className="text-charcoal leading-relaxed max-w-3xl">YOS manages the client workstream: connect the workplace brief, design decisions, procurement, appointed contractors and handover. If the business must remain operating, include staged access and disruption limits in the brief from the start.</p></div></section>

    <section className="bg-white" style={SEC}><div className={WRAP} style={PAD}>
      <FadeIn><SectionLabel onLight>The YOS FitOut process</SectionLabel><h2 id="fitout-process" className="text-near-black mt-3 mb-12 max-w-3xl leading-tight" style={{ scrollMarginTop: 144, fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Six clear stages from first brief to handover.</h2></FadeIn>
      <ol className="fitout-process-flow">{PROCESS.map(([title, body, tip], index) => <li key={title}><details><summary><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><i aria-hidden="true">+</i></summary><p>{body}</p><p><strong>Helpful check:</strong> {tip}</p></details></li>)}</ol>
    </div></section>
    <section className="bg-near-black" style={SEC}><div className={`${WRAP} grid grid-cols-1 lg:grid-cols-2 gap-12`} style={PAD}>
      <FadeIn><SectionLabel>What stays visible</SectionLabel><h2 className="text-white mt-3 leading-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Scope, budget, programme and responsibility.</h2></FadeIn>
      <FadeIn delay={100}><ul className="space-y-4 text-white/80 text-lg">{['A brief the project team can work from', 'A budget that records assumptions, allowances and contingency', 'Comparable contractor and supplier scopes', 'A decision register and programme with clear owners', 'Defects, completion and handover tracked to close'].map(item => <li key={item} className="border-l-2 border-teal pl-5">{item}</li>)}</ul></FadeIn>
    </div></section>
    <section className="bg-warm-grey" style={SEC}><div className={`${WRAP} bg-white rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 items-start lg:items-center`}><div className="flex-1"><SectionLabel>Furniture comes next</SectionLabel><h2 className="text-near-black mt-3 mb-3 text-3xl">Need the space furnished as well?</h2><p className="text-charcoal leading-relaxed">Our commercial furniture service handles product specification, samples, quoting, delivery and installation as a separate, clearly defined workstream.</p></div><Button href="/furniture" variant="outline" size="lg">Explore furniture</Button></div></section>
    <section className="bg-light-teal" style={SEC}><div className={WRAP} style={PAD}><SectionLabel>Beyond the office fit out</SectionLabel><h2 className="text-near-black text-3xl" style={{ marginTop: 16, marginBottom: 20 }}>Need client-side commercial construction support?</h2><p className="text-charcoal max-w-2xl leading-relaxed" style={{ marginBottom: 24 }}>For a broader commercial construction brief, YOS helps coordinate the client’s requirements, consultants, appointed contractors and project decisions. Contractor responsibilities and YOS’s management scope are agreed before work begins.</p><Button href="/commercial-construction" variant="primary">Explore construction project management</Button></div></section>
    <section className="refurbishment-planning" aria-labelledby="refurbishment-heading"><div>
      <SectionLabel onLight>Office refurbishment Newcastle</SectionLabel>
      <h2 id="refurbishment-heading">Refresh the workplace with a plan for keeping the business running.</h2>
      <p>Refurbishing an existing office can involve layout changes, finishes, furniture and building services. Start by separating what can be reused from what needs changing, then confirm the scope with the relevant consultants and appointed contractors.</p>
      <ul><li><strong>Define the work:</strong> record the spaces, services and furniture affected, with photos and a floor plan if available.</li><li><strong>Plan around operations:</strong> identify occupied areas, access limits, noisy work and IT changeovers before agreeing a programme.</li><li><strong>Check responsibilities:</strong> confirm landlord requirements, relevant approvals and who owns each decision before work begins.</li></ul>
      <p>YOS coordinates the client-side project. Appointed contractors carry out the building and trade work.</p>
      <Button href="#fitout-enquiry" variant="dark">Discuss your refurbishment</Button>
    </div></section>
    <section className="bg-white" style={SEC} aria-labelledby="newcastle-planning-pack"><div className={WRAP} style={PAD}>
      <SectionLabel onLight>Office fitout Newcastle: planning pack</SectionLabel>
      <h2 id="newcastle-planning-pack" style={{ scrollMarginTop: 144 }} className="text-near-black text-3xl mt-4 mb-6">Bring the same brief to every project conversation.</h2>
      <p className="text-charcoal leading-relaxed max-w-3xl mb-6">Before comparing quotes, record the premises, essential opening-day needs, landlord requirements and what is still unconfirmed. Our Newcastle guide connects those questions with budget, approval responsibilities, procurement and handover.</p>
      <ul className="text-charcoal leading-relaxed space-y-3 mb-8"><li><strong>Premises:</strong> check available plans, existing condition, loading and goods-lift access with the building manager.</li><li><strong>Proposals:</strong> compare one scope revision, quantities, allowances, exclusions and delivery responsibilities.</li><li><strong>Readiness:</strong> give each decision, required document and outstanding handover item an owner.</li></ul>
      <p className="text-charcoal leading-relaxed max-w-3xl mb-6">Compare <Link className="text-action-teal underline font-semibold" href="/blog/commercial-fitout-cost-newcastle-2026">Newcastle fitout costs, warm and cold shells, and basic to high finishes</Link>. Use the <Link className="text-action-teal underline font-semibold" href="/resources/fitout-estimator">fitout cost calculator</Link> as a starting point, then test the design, services scope and funding against the business case.</p>
      <div className="flex flex-col sm:flex-row gap-4"><Button href="/blog/office-fitout-newcastle-planning-checklist" variant="primary">Read the Newcastle planning guide</Button><Button href="/guides/fitout-project-checklist.pdf" variant="outline">Download the planning pack (PDF)</Button></div>
      <p className="text-charcoal text-sm mt-5">Four pages: 12 checks, a premises brief, quote comparison and decision register. No email required. Planning prompts, not an approval assessment or construction quote.</p>
    </div></section>
    <section className="bg-white" style={SEC} aria-labelledby="fitout-responsibilities"><div className={WRAP} style={PAD}>
      <SectionLabel onLight>Office fitout Newcastle: clear appointments</SectionLabel><h2 id="fitout-responsibilities" className="text-near-black leading-tight scroll-mt-24" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: 20, marginBottom: 24, scrollMarginTop: 144 }}>Know which role you are engaging.</h2><div className="grid md:grid-cols-3 gap-8">{[
        ['You, the client', 'Approve the business brief, budget, appointments and significant changes. Keep an authorised decision maker connected to the programme.'],
        ['YOS, client-side project manager', 'Coordinate the agreed brief, budget, consultant inputs, procurement decisions, programme and handover on your behalf. We do not act as builder or head contractor.'],
        ['Appointed contractors and advisers', 'Carry out construction, design, specialist assessment, testing and certification within their respective appointments and responsibilities.'],
      ].map(([title, body]) => <article key={title} className="bg-warm-grey" style={{ padding: 24 }}><h3 className="text-near-black text-xl" style={{ marginBottom: 16 }}>{title}</h3><p className="text-charcoal leading-relaxed">{body}</p></article>)}</div><p className="text-charcoal leading-relaxed" style={{ marginTop: 24 }}>Compare appointments against their actual scope. Read our <Link href="/blog/commercial-construction-project-manager-vs-builder-newcastle" className="text-dark-teal font-semibold underline">project manager and builder guide</Link>, then use the <Link href="/blog/office-fitout-timeline-newcastle" className="text-dark-teal font-semibold underline">Newcastle fitout timeline and decision register</Link> to identify prerequisites before relying on an opening date.</p>
    </div></section>
    <section className="bg-light-teal" style={SEC} aria-labelledby="fitout-team"><div className={`${WRAP} grid lg:grid-cols-2 gap-12`} style={PAD}>
      <div><SectionLabel onLight>The people behind the process</SectionLabel><h2 id="fitout-team" className="text-near-black leading-tight scroll-mt-24" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: 20, marginBottom: 24, scrollMarginTop: 144 }}>Connect the property decision with the workplace plan.</h2><p className="text-charcoal leading-relaxed">Joe Kelley supports commercial property, FitOut and workplace strategy as part of the YOS team. Start with your project stage and the business outcome so we can discuss the appropriate client-side management scope and the next decisions.</p><Link href="/about" className="text-dark-teal font-semibold underline underline-offset-4" style={{ display: 'inline-block', marginTop: 20 }}>Meet Joe and the YOS team</Link></div>
      <figure className="bg-white rounded-2xl" style={{ padding: 28 }}><p className="text-dark-teal font-semibold" style={{ marginBottom: 20 }}>Existing YOS client feedback</p><blockquote className="text-near-black text-xl leading-relaxed">“{FITOUT_REVIEW.quote}”</blockquote><figcaption className="text-charcoal" style={{ marginTop: 24 }}><strong>{FITOUT_REVIEW.name}</strong><br />{FITOUT_REVIEW.organisation}<br /><a href={FITOUT_REVIEW.source} target="_blank" rel="noopener noreferrer" className="text-dark-teal font-semibold underline underline-offset-4" style={{ display: 'inline-block', marginTop: 16 }}>Read the original Google review<span className="sr-only"> (opens in a new tab)</span></a></figcaption></figure>
    </div></section>
    <PlanningResources kind="project" />
    <WorkplaceGuides kind="project" />
    <ServiceFaq items={FAQS} />
    <section className="bg-light-teal" style={SEC}><div className={WRAP} style={PAD}><SectionLabel onLight>Connect the property and workplace decisions</SectionLabel><h2 className="text-near-black text-3xl mt-4 mb-6">Still deciding which premises to commit to?</h2><p className="text-charcoal leading-relaxed max-w-3xl mb-6">Bring the workplace brief into the property decision early. If you are considering a lease, explore <Link className="text-action-teal underline font-semibold" href="/tenant-rep">tenant representation</Link>. If you are looking to purchase premises, see our <Link className="text-action-teal underline font-semibold" href="/buyers-agency">commercial buyers agent service</Link>. For a furniture-only project, start with <Link className="text-action-teal underline font-semibold" href="/furniture">office furniture planning</Link>.</p></div></section>
    <ServiceEnquiry id="fitout-enquiry" service="FitOut" entryPage="/office-fitout" title="Tell us where the project stands." description="We’ll review your project stage and discuss the scope, next decisions and whether YOS’s client-side project management suits your brief." prompts={['Site suburb and whether you have secured the premises.', 'What needs changing and whether the business must remain operating.', 'Your target opening date and any budget expectations.']} placeholder="Site suburb, project stage, what needs changing and target opening date..." />
      </main><Footer /></>
}
