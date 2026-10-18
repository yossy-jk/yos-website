import Link from 'next/link'
import type { Division } from '@/lib/blog'

export default function ArticleNextSteps({ slug, division }: { slug: string; division: Division }) {
  const construction = /construction|fitout|handover/.test(slug)
  const items = construction
    ? [{ href: '/office-fitout', title: 'Plan your office fit out', text: 'Connect scope, budget and appointed contractor responsibilities.' }, { href: '/commercial-construction', title: 'Client-side construction project management', text: 'Understand the coordination role before appointing your project team.' }]
    : division === 'buyers-agency'
      ? [{ href: '/buyers-agency', title: 'Commercial buyer-side support', text: 'Turn your requirements into a search and due diligence brief.' }, { href: '/office-fitout', title: 'Plan beyond settlement', text: 'Consider workplace works and handover before committing to the premises.' }]
      : division === 'tenant-rep'
        ? [{ href: '/tenant-rep', title: 'Compare tenant representation packages', text: 'See the process, inclusions and the next step for your lease.' }, { href: '/market-snapshot', title: 'Questions to ask about Newcastle market evidence', text: 'Use the historical discussion guide to evaluate dated comparables, not a current valuation.' }]
        : division === 'furniture'
          ? [{ href: '/furniture', title: 'Plan a Newcastle furniture project', text: 'Define product quantities, delivery, installation and quote inputs.' }, { href: '/catalogues/furniture', title: 'Browse the furniture catalogue', text: 'Bring a shortlist into your workplace brief.' }]
          : [{ href: '/flourish', title: 'Plan your workplace care', text: 'Connect cleaning, plant hire and specialist compliance coordination.' }, { href: '/contact#contact-enquiry', title: 'Discuss your workplace brief', text: 'Share the service and outcome you need.' }]
  return <section className="mt-12 rounded-2xl bg-light-teal p-6 md:p-8" aria-label="Put this guide into practice">
    <h2 className="text-near-black text-2xl font-bold mb-6">Put this guide into practice.</h2>
    <div className="grid sm:grid-cols-2 gap-6">{items.map(item => <div key={item.href}><Link href={item.href} className="text-action-teal font-semibold underline underline-offset-4">{item.title}</Link><p className="text-charcoal mt-3 leading-relaxed">{item.text}</p></div>)}</div>
  </section>
}
