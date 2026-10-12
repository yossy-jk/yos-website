import Link from 'next/link'
import { ArrowUpRight, Leaf, PlugZap, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react'
import { FLOURISH_LINKS } from '@/lib/flourish-links'

const icons = [Sparkles, Leaf, PlugZap, ShieldCheck, HeartPulse]

export default function FlourishServices({ compact = false }: { compact?: boolean }) {
  return (
    <section className="flourish-services bg-warm-grey py-16 md:py-24" aria-labelledby="flourish-services-heading">
      <div className="yos-container">
        <div className="max-w-3xl mb-10">
          <p className="text-action-teal text-sm font-semibold uppercase tracking-widest">Flourish It</p>
          <h2 id="flourish-services-heading" className="mt-4 text-3xl md:text-4xl font-bold text-near-black">Keep your workplace looking good and working well.</h2>
          <p className="mt-5 text-charcoal leading-relaxed">Cleaning, indoor greenery and specialist workplace support. Start with the service you need, then connect the brief with the rest of your office.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FLOURISH_LINKS.map((link, index) => {
            const Icon = icons[index]
            return <Link key={link.href} href={link.href} className="flourish-card group block min-h-11 min-w-0 rounded-2xl border border-black/10 bg-white p-5 sm:p-7 no-underline hover:border-action-teal focus-visible:outline-2 focus-visible:outline-action-teal focus-visible:outline-offset-4">
              <Icon aria-hidden="true" className="h-8 w-8 text-action-teal mb-6" />
              <h3 className="text-near-black text-xl font-bold">{link.label}</h3>
              <p className="text-charcoal leading-relaxed mt-3">{link.description}</p>
              <span className="flex items-center gap-2 mt-6 text-action-teal font-semibold">Explore service <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
            </Link>
          })}
        </div>
        {compact && <Link href="/flourish" className="inline-flex items-center min-h-11 mt-8 text-action-teal font-semibold underline underline-offset-4">Explore all Flourish workplace services</Link>}
      </div>
    </section>
  )
}
