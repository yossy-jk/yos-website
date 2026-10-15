import Link from 'next/link'
const tools = [
  { href: '/tools/lease-cost-calculator', title: 'Compare the real cost of a lease', text: 'Look beyond face rent to reviews, incentives, outgoings and make-good.' },
  { href: '/tools/critical-dates', title: 'Map your lease dates', text: 'Plan expiry and option reminders, then download the dates to your calendar.' },
  { href: '/tools/time-cost-calculator', title: 'Put a value on your search time', text: 'Estimate the business time involved in finding and negotiating a space.' },
]
const articles = [
  { href: '/blog/how-to-compare-commercial-leases', title: 'How to compare two commercial leases', text: 'A practical guide to comparing the whole deal before you commit.' },
  { href: '/blog/what-is-make-good', title: 'Understand your make-good obligations', text: 'Know what may need to be repaired, removed or reinstated when you leave.' },
  { href: '/blog/tenant-representation-brief-newcastle', title: 'What to prepare for your first YOS meeting', text: 'Bring the useful details for a Newcastle lease discussion, even if some answers are still unclear.' },
]
export default function LeasingResources({ dark = false }: { dark?: boolean }) {
  return <section aria-label="Useful leasing tools and articles" style={{ marginTop: 32 }} className={`mt-8 ${dark ? 'text-white' : 'text-charcoal'}`}>
    <h3 style={{ fontSize: 22, marginBottom: 14 }} className="text-xl font-bold mb-3">Make your next step easier.</h3>
    <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }} className="text-sm mb-5">While the YOS team reviews your request, explore these free tools and practical guides. No need to wait for a call.</p>
    {[{ title: 'Free leasing tools', items: tools }, { title: 'Helpful reading', items: articles }].map(group => <div key={group.title} style={{ marginBottom: 24 }} className="mb-6">
      <h4 style={{ fontWeight: 700, marginBottom: 12 }} className="font-bold mb-3">{group.title}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12 }} className="grid grid-cols-1 gap-3">{group.items.map(item => <Link key={item.href} href={item.href} style={{ display: 'block', padding: 16, textDecoration: 'none', color: dark ? '#fff' : '#1a1a1a', border: `1px solid ${dark ? '#ffffff40' : '#a9d7d1'}`, borderRadius: 10, background: dark ? '#ffffff0d' : '#fff', fontWeight: 400, lineHeight: 1.6 }} className={`block rounded-lg border p-4 no-underline ${dark ? 'border-white/20 bg-white/5' : 'border-teal/25 bg-white'}`}>
        <strong style={{ display: 'block', marginBottom: 6, color: dark ? '#00b5a5' : '#00796d' }} className={`block mb-1 ${dark ? 'text-teal' : 'text-dark-teal'}`}>{item.title} →</strong><span style={{ display: 'block', fontSize: 14, lineHeight: 1.6 }} className="block text-sm leading-relaxed">{item.text}</span>
      </Link>)}</div>
    </div>)}
  </section>
}
