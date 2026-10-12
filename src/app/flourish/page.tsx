import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import ServiceFaq from '@/components/ServiceFaq'
import FlourishServices from '@/components/FlourishServices'
import { FLOURISH_LINKS } from '@/lib/flourish-links'
import { withPageSeo } from '@/lib/page-seo'
import { SITE_URL } from '@/lib/site-schema'

export const metadata = withPageSeo({
  title: 'Flourish Workplace Services Newcastle | Your Office Space',
  description: 'Keep your Newcastle workplace working well with commercial cleaning, office plant hire and coordinated electrical, fire and first aid support.',
  alternates: { canonical: 'https://www.yourofficespace.au/flourish' },
  openGraph: { images: [{ url: '/images/furniture/space-cogc-wide.jpg', alt: 'Workplace greenery and commercial office furniture' }] },
})

const FAQS = [
  { question: 'What is Flourish at Your Office Space?', answer: 'Flourish brings ongoing workplace care together: commercial cleaning, office plant hire and coordinated support for electrical test and tag, fire safety and first aid arrangements.' },
  { question: 'Can I enquire about just one workplace service?', answer: 'Yes. Start with the service you need. We clarify your site, scope and provider arrangements before any booking, and can connect related workplace needs if that is useful.' },
  { question: 'Which areas can enquire?', answer: 'We welcome Flourish enquiries from Newcastle and Lake Macquarie. Commercial cleaning covers Newcastle CBD and Lake Macquarie; coverage and provider availability for other services are confirmed for your address.' },
  { question: 'Who performs specialist compliance work?', answer: 'Appropriately competent, qualified or accredited providers perform the relevant technical work. YOS coordinates the brief and arrangements; specialist certification and the business or building owner’s responsibilities remain with the relevant parties.' },
  { question: 'Can these services be planned during an office move or fitout?', answer: 'Yes. Raise the ongoing care brief while the workplace is being planned, so access, layouts, cleaning, planting and the relevant specialist checks can be coordinated before occupation.' },
] as const

export default function FlourishPage() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Flourish workplace services', url: `${SITE_URL}/flourish`,
    mainEntity: { '@type': 'ItemList', itemListElement: FLOURISH_LINKS.map((link, index) => ({ '@type': 'ListItem', position: index + 1, name: link.label, url: `${SITE_URL}${link.href}` })) },
  }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <Nav />
    <main id="main-content" tabIndex={-1} className="flourish-page">
      <section className="flourish-hero relative isolate bg-near-black pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <Image src="/images/furniture/space-cogc-wide.jpg" alt="Greenery and furniture in a commercial workplace" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-near-black/85" />
        <div className="yos-container relative">
          <p className="text-teal font-semibold text-sm uppercase tracking-widest">Flourish It</p>
          <h1 className="text-white font-bold text-[clamp(2.5rem,6vw,5rem)] leading-tight max-w-4xl mt-5">A workplace that keeps working for you.</h1>
          <p className="text-white/85 text-lg leading-relaxed max-w-3xl mt-7">Ongoing care for Newcastle workplaces, from commercial cleaning and indoor greenery to coordinated electrical, fire and first aid support. Choose one service or bring the needs together in one brief.</p>
          <a href="#flourish-enquiry" className="inline-flex bg-teal text-near-black font-bold rounded-lg px-7 py-4 no-underline mt-8 hover:bg-white">Discuss your workplace</a>
        </div>
      </section>
      <FlourishServices />
      <section className="bg-white py-16 md:py-24">
        <div className="yos-container grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 className="text-near-black text-3xl md:text-4xl font-bold leading-tight">Keep the care plan connected to the office.</h2>
          <div className="text-charcoal leading-relaxed space-y-5">
            <p>Every workplace has a different rhythm. Attendance, visitors, shared facilities and access affect the scope, and a move or new FitOut can change what is needed.</p>
            <p>YOS helps clarify the brief and coordinate provider arrangements. Start with the current setup, the issue you want resolved and any existing records, then agree inclusions, responsibilities and next steps.</p>
            <Link href="/office-fitout" className="inline-flex min-h-11 items-center text-action-teal underline underline-offset-4">Connect ongoing care with your FitOut.</Link>
          </div>
        </div>
      </section>
      <ServiceFaq heading="Flourish: your questions answered." items={FAQS} />
      <section id="flourish-enquiry" className="bg-warm-grey py-16 md:py-24 scroll-mt-24">
        <div className="yos-container grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-action-teal font-semibold uppercase tracking-widest text-sm">One clear starting point</p>
            <h2 className="text-near-black text-3xl md:text-4xl font-bold mt-4">What does your workplace need next?</h2>
            <p className="text-charcoal leading-relaxed mt-6">Tell us your address, preferred service and what you want to improve. We confirm the appropriate scope, availability and pricing before any booking.</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/10 p-6 md:p-8"><ContactForm initialService="Not sure" /></div>
        </div>
      </section>
    </main>
    <Footer />
  </>
}
