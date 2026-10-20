import Link from 'next/link'
import { TenantLicence } from '@/components/tenant/TenantShell'
import ServiceEnquiry from '@/components/ServiceEnquiry'
import ServiceFaq from '@/components/ServiceFaq'
import ServiceSchema from '@/components/ServiceSchema'
import WorkplaceGuides from '@/components/WorkplaceGuides'
import ContentBreadcrumbs from '@/components/ContentBreadcrumbs'
import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'

export const metadata: Metadata = withPageSeo({
  title: 'Tenant Representative Newcastle | Your Office Space',
  description: 'Tenant representative for Newcastle and Hunter businesses. Compare premises, plan renewals and negotiate commercial lease terms with tenant-side support.',
  alternates: { canonical: 'https://www.yourofficespace.au/tenant-rep/newcastle' },
  openGraph: {

  images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
title: 'Tenant Rep Newcastle | Your Office Space',
    description: 'Tenant-side commercial leasing support for Newcastle and Hunter businesses, from premises search and renewal planning to negotiation.',
    url: 'https://www.yourofficespace.au/tenant-rep/newcastle',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
})


const section = { padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,5rem)' }
const heading = { fontSize: 'clamp(2rem,4vw,3.5rem)', lineHeight: 1.1, marginTop: 20, marginBottom: 24 }
const PATHS = [
  { title: 'Renew your current lease', body: 'Start with your expiry date, any option notice dates and how the premises support your next business stage. Compare the proposed renewal with alternatives before deciding.', tip: 'Gather the lease, recent rent and outgoings statements, and a list of what works or needs changing.', href: '/tools/critical-dates', label: 'Plan your lease dates' },
  { title: 'Relocate your business', body: 'Assess the cost of leaving as well as entering a new space. Consider make-good, overlap between leases, fit out, furniture, IT changeovers and disruption.', tip: 'Work backwards from your required operating date and flag any period when both sites may need to run.', href: '/blog/renew-or-relocate-commercial-lease', label: 'Compare renewal and relocation' },
  { title: 'Find your next premises', body: 'Set a documented brief before comparing listings: team size, work patterns, location, access, permitted use, budget and timing. Test shortlisted options against the same requirements.', tip: 'Separate essential requirements from preferences so a good-looking space does not distract from business needs.', href: '/resources/office-size-calculator', label: 'Explore your space requirements' },
] as const
const FAQS = [
  { question: 'What does a tenant representative do in Newcastle?', answer: 'YOS supports the tenant’s agreed brief, from premises comparison and renewal planning to commercial negotiation. We help make costs, options and decisions clear. Scope, fees and any relevant third-party payment arrangements are explained before engagement; your solicitor advises on legal terms.' },
  { question: 'Can you help with a renewal rather than a relocation?', answer: 'Yes. Start with your current lease dates, occupancy costs and business plans. We can assess the renewal brief and compare alternatives within the agreed scope. A move is not assumed to be the right outcome.' },
  { question: 'Do I need to upload my current lease to start?', answer: 'No. The free Lease Health Check accepts your details and lease situation, with an optional current-lease upload. We confirm the information needed and agree the next step. It does not replace legal advice.' },
  { question: 'How do we compare the cost of Newcastle premises?', answer: 'Compare rent, outgoings, incentives, lease length, reviews and the assumptions behind each offer. Include one-off costs such as fit out, furniture, moving and any existing lease exit obligations. Market comparables inform the assessment but do not guarantee a negotiated outcome.' },
  { question: 'Are market comparables included in every Tenant Rep package?', answer: 'Yes. The market comparables report is included in Gold, Platinum and Diamond. Platinum and Diamond also include the current lease exit plan and relocation roadmap; their distinction is business size. Compare the current package scope and fees on the main Tenant Rep page before choosing.' },
  { question: 'Can you help check a space before we commit?', answer: 'We can connect the leasing brief with early client-side FitOut planning where agreed. Test likely workplace requirements, timing, building constraints and responsibilities before committing. YOS coordinates the client-side project; appointed contractors carry out construction work.' },
] as const

export default function TenantRepNewcastlePage() {
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <ServiceSchema name="Tenant Representation Newcastle" path="/tenant-rep/newcastle" description="Tenant-side premises comparison, renewal planning and commercial lease negotiation for Newcastle and Hunter businesses." area="NSW" />
    <section className="bg-near-black text-white" style={{ ...section, paddingTop: 'clamp(9rem,15vw,13rem)' }}><div className="max-w-screen-xl mx-auto">
      <ContentBreadcrumbs section="Tenant representation" sectionPath="/tenant-rep" title="Newcastle" path="/tenant-rep/newcastle" />
      <SectionLabel>Newcastle &amp; Hunter tenant representation</SectionLabel>
      <h1 style={heading}>Tenant representative Newcastle.<br /><span className="text-teal">Plan your next lease around your business.</span></h1>
      <p className="text-white/80 max-w-3xl leading-relaxed" style={{ fontSize: '1.15rem', marginBottom: 28 }}>Renewing, relocating or leasing your next premises? YOS helps you compare the commercial options, organise the decisions and negotiate against an agreed tenant-side brief.</p>
      <div className="flex flex-col sm:flex-row gap-4"><Button href="/lease-health-check" variant="primary" size="lg">Start a free Lease Health Check</Button><Button href="#newcastle-enquiry" variant="outline-light" size="lg">Discuss your premises brief</Button></div>
      <p className="text-white/80" style={{ marginTop: 20 }}>Current lease upload is optional. Your solicitor provides legal advice.</p>
    </div></section>
    <section className="bg-white text-near-black" style={section}><div className="max-w-screen-xl mx-auto">
      <SectionLabel onLight>Choose your starting point</SectionLabel><h2 style={heading}>What decision is in front of you?</h2>
      <div className="grid md:grid-cols-3 gap-6">{PATHS.map(path => <article key={path.title} className="border border-black/15" style={{ padding: 28 }}><h3 className="text-2xl font-bold" style={{ marginBottom: 16 }}>{path.title}</h3><p className="leading-relaxed text-charcoal">{path.body}</p><p className="leading-relaxed text-charcoal" style={{ marginTop: 20, marginBottom: 24 }}><strong>Helpful first step:</strong> {path.tip}</p><Link href={path.href} className="text-action-teal underline font-semibold">{path.label}</Link></article>)}</div>
    </div></section>
    <section className="bg-light-teal text-near-black" style={section}><div className="max-w-screen-xl mx-auto">
      <SectionLabel onLight>Build a useful Newcastle leasing brief</SectionLabel><h2 style={heading}>Compare locations against how the team works.</h2>
      <p className="max-w-3xl leading-relaxed" style={{ marginBottom: 24 }}>A brief might span Newcastle CBD, Hamilton, Broadmeadow, Charlestown or Maitland. Assess each actual property rather than assuming a suburb will meet every requirement.</p>
      <ul className="leading-relaxed" style={{ paddingLeft: 24, listStyle: 'disc' }}>
        <li style={{ marginBottom: 16 }}><strong>People and access:</strong> record staff travel, visitor needs, public transport, parking and accessible entry requirements.</li>
        <li style={{ marginBottom: 16 }}><strong>Use and building constraints:</strong> identify the proposed activities, servicing needs and questions for the landlord, consultants and solicitor.</li>
        <li style={{ marginBottom: 16 }}><strong>Total occupancy budget:</strong> compare ongoing costs with initial works, furniture and moving allowances on a consistent basis.</li>
        <li><strong>Timing and ownership:</strong> name who approves the premises, budget and move, and record the dates that depend on those decisions.</li>
      </ul>
      <p className="leading-relaxed" style={{ marginTop: 28 }}>Use the <Link className="text-action-teal underline font-semibold" href="/resources/lease-comparison">lease comparison tool</Link> to organise options. Before committing to a space, explore <Link className="text-action-teal underline font-semibold" href="/office-fitout">client-side office FitOut planning</Link> to connect the premises decision with the workplace brief.</p>
    </div></section>
    <section className="bg-near-black text-white" style={section}><div className="max-w-screen-xl mx-auto"><SectionLabel>Understand the scope before starting</SectionLabel><h2 style={heading}>A clear brief, comparable options and agreed next steps.</h2><p className="text-white/80 max-w-3xl leading-relaxed" style={{ marginBottom: 24 }}>The main Tenant Rep page explains the process, package inclusions and fees. Every package includes a market comparables report. Platinum and Diamond also include the current lease exit plan and relocation roadmap, with the package choice reflecting business size.</p><Button href="/tenant-rep#packages" variant="primary">Compare Tenant Rep packages</Button></div></section>
    <WorkplaceGuides kind="tenant" />
    <ServiceFaq heading="Questions about tenant representation in Newcastle." items={FAQS} />
    <ServiceEnquiry id="newcastle-enquiry" service="Leasing" entryPage="/tenant-rep/newcastle" title="Tell us about your next lease decision." description="Share where you are up to. We will review the brief and confirm the information and next step needed." prompts={['Renewing, relocating or looking for new premises?', 'Preferred locations, team size and essential requirements.', 'Lease expiry or target operating date, if known.']} placeholder="Your lease situation, preferred locations, team size and timing..." />
    <section className="tenant-section"><div className="tenant-wrap"><TenantLicence /></div></section>
  </main><Footer /></>
}
