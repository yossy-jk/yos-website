import Link from 'next/link'

const resources = {
  tenant: {
    label: 'Useful before your next lease decision', heading: 'Start with a comparison you can follow.', intro: 'Use these blank planning templates to organise the questions, evidence and responsibilities. They are starting points, not completed client reports, legal advice or a promise of an outcome.',
    files: [
      ['lease-comparables-template.csv', 'Market comparables worksheet', 'Record dated evidence, asking versus agreed terms, outgoings, incentives and unanswered questions.'],
      ['lease-exit-plan-template.csv', 'Current lease exit planning sheet', 'Ask your solicitor to confirm notice windows and obligations before assigning dates and action owners.'],
      ['relocation-roadmap-template.csv', 'Relocation roadmap', 'Connect the brief, comparison, commitment, preparation and handover with dependencies visible.'],
    ],
    links: [{ href: '/tenant-rep/packages', title: 'Compare the package inclusions' }, { href: '/tools/lease-cost-calculator', title: 'Explore lease costs' }, { href: '/market-snapshot', title: 'Evaluate Newcastle market evidence' }],
  },
  furniture: {
    label: 'Furniture brief', heading: 'Make the first quote easier to prepare.', intro: 'List the rooms, quantities and furniture you want to keep. Add a plan if available, then confirm finishes, delivery access and the required date. Product availability and installation scope are confirmed in the quote.',
    files: [['furniture-brief-template.csv', 'Furniture brief and schedule', 'A blank worksheet for quantities, specifications, access, dates and quote inclusions.']],
    links: [{ href: '/about#frank-smith', title: 'Meet Frank, Head of Furniture' }, { href: '/resources/furniture-quote#furniture-quote-form', title: 'Request a project furniture quote' }, { href: '/catalogues/acoustics', title: 'Consider workplace acoustics' }],
  },
  project: {
    label: 'Project planning', heading: 'Keep the next decision and its owner visible.', intro: 'Use a milestone sheet to connect the business brief, appointed advisers, contractor inputs and handover. It is an illustrative planning aid, not a contracted programme or an approval assessment. YOS coordinates the client-side workstream; appointed specialists retain their responsibilities.',
    files: [['project-milestone-template.csv', 'Project milestone and responsibility sheet', 'Record required evidence, decision owners, dependencies and confirmed dates.']],
    links: [{ href: '/commercial-construction', title: 'Understand client-side project management' }, { href: '/office-fitout', title: 'Plan an office fit out' }, { href: '/furniture', title: 'Coordinate the furniture brief' }],
  },
  buyer: {
    label: 'Before inspecting properties', heading: 'Give every opportunity the same test.', intro: 'Write down the business use, location, access, budget and timing before a listing sets the agenda. The blank brief helps coordinate questions for your solicitor, finance team and building specialists. Scope and fees are agreed before an engagement starts.',
    files: [['commercial-buyer-brief-template.csv', 'Commercial buyer brief', 'Record requirements, missing evidence, adviser responsibilities and decisions.']],
    links: [{ href: '/commercial-construction', title: 'Consider works before you commit' }, { href: '/office-fitout', title: 'Plan the workplace after settlement' }, { href: '/contact?service=buying#contact-enquiry', title: 'Discuss a buying brief' }],
  },
} as const

export default function PlanningResources({ kind }: { kind: keyof typeof resources }) {
  const content = resources[kind]
  return <section className="bg-warm-grey py-16 md:py-24" aria-label={content.label}>
    <div className="max-w-screen-xl mx-auto px-6 md:px-8">
      <p className="text-action-teal text-xs font-bold uppercase tracking-widest mb-4">{content.label}</p>
      <h2 className="text-near-black text-3xl md:text-4xl font-bold leading-tight max-w-3xl mb-6">{content.heading}</h2>
      <p className="text-charcoal leading-relaxed max-w-3xl mb-8">{content.intro}</p>
      <div className="grid md:grid-cols-3 gap-6">{content.files.map(([file, title, text]) => <article key={file} className="bg-white border border-black/10 rounded-2xl p-6">
        <h3 className="text-near-black text-xl font-bold mb-4">{title}</h3><p className="text-charcoal leading-relaxed mb-5">{text}</p>
        <a href={`/downloads/${file}`} download className="text-action-teal font-semibold underline underline-offset-4">Download blank worksheet (CSV)</a>
      </article>)}</div>
      <p className="text-charcoal mt-5 text-sm">No email required. Open CSV worksheets in Excel or another spreadsheet app. Fill in your own information; no client data is included.</p>
      <ul className="flex flex-wrap gap-x-8 gap-y-4 mt-8">{content.links.map(link => <li key={link.href}><Link href={link.href} className="text-action-teal font-semibold underline underline-offset-4">{link.title}</Link></li>)}</ul>
    </div>
  </section>
}
