import WorkplaceGuides from '@/components/WorkplaceGuides'
import ContentBreadcrumbs from '@/components/ContentBreadcrumbs'
import PlanningResources from '@/components/PlanningResources'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import SectionLabel from '@/components/SectionLabel'
import ContactForm from '@/components/ContactForm'
import ServiceFaq from '@/components/ServiceFaq'
import ServiceSchema from '@/components/ServiceSchema'
import { withPageSeo } from '@/lib/page-seo'

export const metadata: Metadata = withPageSeo({
  title: 'Commercial Construction Newcastle | Your Office Space',
  description: 'Client-side commercial construction project management in Newcastle and the Hunter. YOS coordinates your brief, consultants, appointed contractors and handover.',
  alternates: { canonical: 'https://www.yourofficespace.au/commercial-construction' },
  openGraph: { images: [{ url: '/og/og-office-fitout.png', width: 1200, height: 630, alt: 'Your Office Space commercial project management' }] },
})

const FAQS = [
  { question: 'What does a client-side commercial construction project manager do?', answer: 'A client-side project manager helps the business owner organise the brief, budget, consultants, procurement, project decisions and handover. YOS coordinates the agreed client workstream and keeps responsibilities visible throughout the project.' },
  { question: 'Does YOS act as the builder or head contractor?', answer: 'YOS provides client-side project management. Building and trade work is undertaken by the appointed contractors. Builder, consultant, approval and certification responsibilities are confirmed in the project appointments and contracts.' },
  { question: 'Can you help with a Newcastle office fit out?', answer: 'Yes. Our office fit out service connects the workplace brief with design, budgeting, procurement, delivery coordination and handover. Furniture can be included under a separately agreed scope.' },
  { question: 'When should we involve YOS?', answer: 'Ideally while you are defining the project, before design and contractor commitments. If you already have a site or project underway, send us the current scope, drawings, programme and outstanding decisions so we can assess how to help.' },
  { question: 'What should we include in a project enquiry?', answer: 'Include the site suburb, proposed use, approximate area, current stage, target completion date and budget expectations. Mention any landlord conditions, access limits or need to keep the business operating during works. Available plans help us clarify the scope.' },
  { question: 'Who handles approvals and specialist advice?', answer: 'Appropriately appointed designers, engineers, certifiers and other qualified advisers handle their specialist responsibilities. YOS helps identify and coordinate the required inputs; the agreed appointments determine who prepares, obtains and signs off each item.' },
  { question: 'How much does construction project management cost?', answer: 'Fees depend on the scope, project stage, duration and responsibilities. We clarify the brief and provide an agreed management scope and fee before starting. Construction costs and third-party consultant fees are separate considerations.' },
] as const
const SECTION = { padding: 'clamp(3rem,7vw,6rem) clamp(1.25rem,4vw,3rem)' }
const WRAP = { maxWidth: 1200, margin: '0 auto' }

export default function ConstructionPage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <ServiceSchema name="Client-side Commercial Construction Project Management" path="/commercial-construction" area="NSW" description="Client-side commercial construction project management for Newcastle and Hunter business briefs, coordinating consultants and appointed contractors under an agreed scope." />
    <section className="bg-near-black text-white" style={{ ...SECTION, paddingTop: 'clamp(8rem,15vw,12rem)' }}><div style={WRAP}>
      <ContentBreadcrumbs title="Client-side construction project management" path="/commercial-construction" /><SectionLabel>Newcastle &amp; the Hunter · Client-side project management</SectionLabel>
      <h1 style={{ fontSize: 'clamp(2.3rem,5.5vw,5rem)', lineHeight: 1.05, maxWidth: 950, marginTop: 24, marginBottom: 28 }}>Commercial construction Newcastle. A clear plan on your side.</h1>
      <p className="text-white/80 leading-relaxed" style={{ maxWidth: 720, fontSize: '1.15rem', marginBottom: 24 }}>Your Office Space helps business owners manage commercial construction projects in Newcastle and the Hunter. We coordinate the client’s brief, consultants, appointed contractors and decisions, from planning through handover.</p>
      <p className="text-white/80 leading-relaxed" style={{ maxWidth: 720, marginBottom: 32 }}>YOS acts as your client-side project manager. The appointed builder and trade contractors deliver the building work under their own agreed responsibilities.</p>
      <Button href="#construction-enquiry" variant="primary" size="lg">Discuss your construction project</Button><p className="service-next-step">Share the site, proposed work and target timing. We will confirm the next step and the specialist inputs your project needs.</p>
    </div></section>
    <section className="bg-white" style={SECTION}><div style={WRAP}>
      <SectionLabel>Define the job before committing</SectionLabel>
      <h2 style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', marginTop: 20, marginBottom: 28 }}>Connect the brief, budget and people delivering it.</h2>
      <div className="grid md:grid-cols-2 gap-6">{[
        ['Brief and feasibility', 'Document the business requirements, proposed use, location, timing and budget expectations. Identify missing information and specialist inputs before committing to a delivery pathway.'],
        ['Design and approvals coordination', 'Bring consultant inputs, landlord requirements and approval responsibilities into the project plan. Keep open questions and decisions visible to the client.'],
        ['Procurement and contractor coordination', 'Help organise scope documents and compare proposed inclusions, exclusions, programme and responsibilities. Appointments and contracts establish who delivers each part of the work.'],
        ['Delivery and handover', 'Coordinate progress updates, client decisions and the agreed delivery programme. Help organise defects, documentation and handover actions with the appointed project team.'],
      ].map(([title, text]) => <article key={title} className="bg-warm-grey rounded-2xl" style={{ padding: 28 }}><h3 className="text-xl" style={{ marginBottom: 16 }}>{title}</h3><p className="text-charcoal leading-relaxed">{text}</p></article>)}</div>
    </div></section>
    <section className="bg-light-teal" style={SECTION}><div style={WRAP}>
      <h2 style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', marginBottom: 24 }}>Moving from property decisions to an operating workplace?</h2>
      <p className="text-charcoal leading-relaxed" style={{ maxWidth: 760, marginBottom: 28 }}>An office fit out focuses on the workplace layout, finishes and delivery. Commercial construction project management addresses the broader client coordination brief. We clarify which scope you need and connect property, fit out and furniture decisions where relevant.</p>
      <div className="flex flex-wrap gap-4"><Button href="/office-fitout" variant="primary">Office fit out</Button><Button href="/furniture" variant="primary">Office furniture</Button><Button href="/buyers-agency" variant="primary">Commercial property buying</Button></div>
    </div></section>
    <PlanningResources kind="project" />
    <WorkplaceGuides kind="project" />
    <ServiceFaq heading="Planning a commercial construction project?" items={FAQS} />
    <section id="construction-enquiry" tabIndex={-1} aria-labelledby="construction-enquiry-heading" className="bg-warm-grey" style={{ ...SECTION, scrollMarginTop: 110 }}><div style={{ ...WRAP, maxWidth: 820 }}>
      <SectionLabel>Tell us about the project</SectionLabel><h2 id="construction-enquiry-heading" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', marginTop: 20, marginBottom: 20 }}>Start with your site, scope and timing.</h2>
      <p className="text-charcoal leading-relaxed" style={{ marginBottom: 32 }}>Share what you know so far. We’ll discuss the next steps and whether YOS’s client-side project management is suited to your brief. You can also call <a href="tel:0240920733" className="font-semibold text-dark-teal">02 4092 0733</a>.</p>
      <ContactForm initialService="fitout" fixedService submitLabel="Send project enquiry →" messagePlaceholder="Site suburb, project scope, current stage, budget expectations and target completion date..." />
    </div></section>
</main><Footer /></>
}
