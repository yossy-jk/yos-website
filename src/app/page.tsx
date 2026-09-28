import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import CapabilityDownload from '@/components/CapabilityDownload'

export const metadata: Metadata = {
  title: 'Commercial Property, FitOut & Furniture | Your Office Space',
  description: 'One team to help you find, FitOut, furnish and look after your commercial space.',
}

const services = [
  { label: 'Find', title: 'Lease or buy', copy: 'Tenant-side support for your next commercial property decision.', href: '/tenant-rep', image: '/images/furniture/space-cogc-office.jpg' },
  { label: 'FitOut', title: 'Plan and deliver', copy: 'A coordinated workplace brief, FitOut and handover.', href: '/office-fitout', image: '/images/furniture/space-wsi-openplan.jpg' },
  { label: 'Furnish It', title: 'Specify and install', copy: 'Commercial furniture selected around your people and space.', href: '/furniture', image: '/images/furniture/dbt-boardroom.jpg' },
  { label: 'Look After It', title: 'Commercial Cleaning', copy: 'Ongoing commercial cleaning across Newcastle CBD and Lake Macquarie.', href: '/cleaning', image: '/images/furniture/space-liverpool-b.jpg' },
]

const journey = [
  ['01', 'Find', 'Clarify the brief and make the property decision with the right evidence.'],
  ['02', 'FitOut', 'Coordinate the workplace scope, budget, programme and handover.'],
  ['03', 'Furnish It', 'Select, supply and install furniture that suits the space.'],
  ['04', 'Look After It', 'Keep the workplace ready through ongoing services where available.'],
]

const clientLogos = [
  { name: 'Elders Advantage Group', src: '/client-logos/elders-advantage.png' },
  { name: 'Dynamic Business Technologies', src: '/client-logos/dynamic-business-technologies.jpg' },
  { name: 'Australian Aboriginal Child and Family Services', src: '/client-logos/aacafs.png' },
  { name: 'OzChild', src: '/client-logos/ozchild.png' },
  { name: 'Jirsch Sutherland', src: '/client-logos/jirsch-sutherland.jpg' },
  { name: 'Total Fitouts', src: '/client-logos/total-fitouts.webp' },
]

const serviceShowcases = [
  {
    eyebrow: 'Find It',
    title: 'Make the property decision with someone on your side.',
    copy: 'Lease or buy with a brief, market evidence and the commercial trade-offs made clear before you commit.',
    points: ['Tenant representation across NSW', 'Commercial Buyers Agent support', 'Structure Ready and Finance Ready pathways'],
    href: '/tenant-rep',
    cta: 'Explore property services',
    image: '/images/furniture/space-cogc-office.jpg',
    alt: 'Contemporary commercial office used to illustrate property search and selection',
  },
  {
    eyebrow: 'Fit It Out',
    title: 'Keep the brief, budget and delivery connected.',
    copy: 'YOS acts as your client-side project manager, coordinating the specialist team while protecting your priorities from brief through handover.',
    points: ['Brief and preliminary budget', 'Design and procurement coordination', 'Programme, risk and handover oversight'],
    href: '/office-fitout',
    cta: 'See the FitOut process',
    image: '/images/furniture/space-wsi-openplan.jpg',
    alt: 'Completed open-plan commercial workplace',
  },
  {
    eyebrow: 'Furnish It',
    title: 'Specify furniture around the people and the space.',
    copy: 'From a single boardroom to a complete workplace, we coordinate selection, supply, delivery and installation.',
    points: ['Workstations and seating', 'Meeting, storage and breakout spaces', 'Australia-wide supply and installation'],
    href: '/furniture',
    cta: 'Explore commercial furniture',
    image: '/images/furniture/dbt-boardroom.jpg',
    alt: 'Commercial boardroom furniture installation',
  },
  {
    eyebrow: 'Look After It',
    title: 'A clean workplace without chasing anyone.',
    copy: 'Reliable commercial cleaning for Newcastle CBD and Lake Macquarie, with the same team, clear scope and monthly quality assurance.',
    points: ['Quote after a site inspection', 'Same cleaning team wherever possible', 'Monthly quality assurance'],
    href: '/cleaning',
    cta: 'Get a cleaning quote',
    image: '/images/furniture/space-liverpool-b.jpg',
    alt: 'Clean and ready commercial workplace',
  },
]

const reviews = [
  {
    quote: 'Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.',
    name: 'Liz Murray',
    organisation: 'Google review',
  },
  {
    quote: 'Joe was instrumental in building out our boardroom. High-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.',
    name: 'Nathan Franks',
    organisation: 'Dynamic Business Technologies',
  },
]

const container = 'mx-auto w-full max-w-[1280px] px-6 md:px-10'

export default function Home() {
  return <>
    <Nav />
    <main id="main-content" tabIndex={-1}>
      <section className="relative min-h-[92vh] overflow-hidden bg-near-black pt-20">
        <Image src="/images/furniture/space-cogc-wide.jpg" alt="Contemporary commercial workplace interior" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-near-black/75" />
        <div className={`${container} relative z-10 flex min-h-[calc(92vh-5rem)] flex-col justify-center py-16`}>
          <FadeIn>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-teal">One team for your workplace</p>
            <h1 className="max-w-[13ch] text-[clamp(2.8rem,7vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white">Find It, Fit It Out and Furnish It</h1>
            <p className="mt-7 max-w-2xl text-[clamp(1.05rem,2vw,1.3rem)] text-white/85 font-normal leading-relaxed">We help businesses lease or buy their next commercial space, then coordinate the FitOut, furniture and available ongoing services.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="rounded-lg bg-teal px-8 py-4 text-base font-bold text-near-black no-underline transition duration-200 hover:-translate-y-1 hover:bg-white motion-reduce:transform-none">Enquire</Link>
              <Link href="/resources/fitout-estimator" className="rounded-lg border border-white/60 px-8 py-4 text-base font-bold text-white no-underline transition duration-200 hover:-translate-y-1 hover:bg-white/10 motion-reduce:transform-none">Estimate your FitOut</Link>
            </div>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => <FadeIn key={service.label} delay={index * 70}>
              <Link href={service.href} className="group relative flex min-h-48 overflow-hidden rounded-2xl border border-white/20 bg-near-black/75 p-5 text-white no-underline backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-teal motion-reduce:transform-none">
                <Image src={service.image} alt="" fill className="object-cover opacity-20 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-30 motion-reduce:transform-none" />
                <span className="relative z-10 mt-auto"><span className="block text-xs font-semibold uppercase tracking-[0.2em] text-teal">{service.label}</span><span className="mt-2 block text-xl font-bold">{service.title}</span><span className="mt-2 block text-sm leading-relaxed text-white/75">{service.copy}</span><span className="mt-4 inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true">→</span></span>
              </Link>
            </FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-10"><div className={`${container} grid items-center gap-7 lg:grid-cols-[1fr_auto]`}>
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">See how we work</p><h2 className="mt-2 text-2xl font-bold text-near-black md:text-3xl">Review our capability before we talk.</h2><p className="mt-3 max-w-3xl leading-relaxed text-charcoal">Our capability statement sets out our services, approach and the sectors we support.</p></div>
        <CapabilityDownload label="Download capability statement" variant="primary" />
      </div></section>

      <section className="bg-warm-grey py-20 md:py-28"><div className={container}>
        <FadeIn><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">One coordinated journey</p><h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-near-black">One team, from the first decision to the working workplace.</h2></div></FadeIn>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{journey.map(([number, title, copy], index) => <FadeIn key={title} delay={index * 70}><article className="h-full rounded-2xl bg-white p-7"><span className="text-sm font-bold text-dark-teal">{number}</span><h3 className="mt-8 text-2xl font-bold text-near-black">{title}</h3><p className="mt-3 leading-relaxed text-charcoal">{copy}</p></article></FadeIn>)}</div>
      </div></section>

      <section className="bg-white py-20 md:py-28" aria-labelledby="services-heading"><div className={container}>
        <FadeIn><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">Four connected services</p><h2 id="services-heading" className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-near-black">Use one service, or keep the whole workplace journey connected.</h2></div></FadeIn>
        <div className="mt-16 space-y-8">{serviceShowcases.map((service, index) => <FadeIn key={service.eyebrow}>
          <article className="grid overflow-hidden rounded-3xl bg-warm-grey lg:grid-cols-2">
            <div className={`relative min-h-80 lg:min-h-[34rem] ${index % 2 ? 'lg:order-2' : ''}`}><Image src={service.image} alt={service.alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /></div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">{service.eyebrow}</p>
              <h3 className="mt-4 text-[clamp(2rem,3vw,3.25rem)] font-bold leading-tight text-near-black">{service.title}</h3>
              <p className="mt-5 text-lg leading-relaxed text-charcoal">{service.copy}</p>
              <ul className="mt-7 space-y-3">{service.points.map(point => <li key={point} className="flex gap-3 text-charcoal"><span className="font-bold text-dark-teal" aria-hidden="true">✓</span><span>{point}</span></li>)}</ul>
              <Link href={service.href} className="mt-9 inline-flex w-fit rounded-lg bg-action-teal px-8 py-4 font-bold text-white no-underline transition duration-200 hover:-translate-y-1 hover:bg-action-teal-hover motion-reduce:transform-none">{service.cta}<span className="ml-3" aria-hidden="true">→</span></Link>
            </div>
          </article>
        </FadeIn>)}</div>
      </div></section>

      <section className="bg-light-teal py-20 md:py-28"><div className={`${container} grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]`}>
        <FadeIn><div className="relative mx-auto aspect-square w-full max-w-md rounded-full border-[3rem] border-action-teal bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"><div className="absolute inset-12 flex items-center justify-center rounded-full bg-near-black p-8 text-center text-xl font-bold leading-tight text-white">Your brief<br />and budget</div></div></FadeIn>
        <FadeIn><p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">Protect the whole picture</p><h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-near-black">One budget. A lot of hands reaching for it.</h2><div className="mt-6 space-y-4 text-lg leading-relaxed text-charcoal"><p>Property costs, consultants, contractors, furniture and programme changes all take a share of the same project budget.</p><p>As your client-side project manager, YOS makes the trade-offs visible and keeps every decision tied to the workplace outcome.</p></div><Link href="/office-fitout" className="mt-8 inline-flex rounded-lg border-2 border-near-black px-8 py-4 font-bold text-near-black no-underline transition duration-200 hover:-translate-y-1 hover:bg-near-black hover:text-white motion-reduce:transform-none">How client-side PM works</Link></FadeIn>
      </div></section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="trusted-heading"><div className={container}>
        <FadeIn><p id="trusted-heading" className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">Organisations we have supported and worked alongside</p></FadeIn>
        <div className="mt-10 grid grid-cols-2 items-center gap-5 md:grid-cols-3 lg:grid-cols-6">{clientLogos.map(logo => <div key={logo.name} className="relative flex h-28 items-center justify-center rounded-2xl border border-black/10 bg-white p-5"><Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain p-5" sizes="200px" /></div>)}</div>
      </div></section>

      <section className="bg-warm-grey py-20 md:py-28" aria-labelledby="reviews-heading"><div className={container}>
        <FadeIn><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">Independent feedback</p><h2 id="reviews-heading" className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-near-black">What clients say about working with Joe.</h2></div></FadeIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">{reviews.map((review, index) => <FadeIn key={review.name} delay={index * 80}><figure className="h-full rounded-3xl bg-white p-8 sm:p-10"><blockquote className="text-xl leading-relaxed text-near-black">“{review.quote}”</blockquote><figcaption className="mt-8 border-t border-black/10 pt-6"><strong className="block text-near-black">{review.name}</strong><span className="mt-1 block text-sm text-charcoal">{review.organisation}</span></figcaption></figure></FadeIn>)}</div>
      </div></section>

      <section className="bg-teal text-white"><div className={`${container} grid items-center gap-8 py-16 md:py-20 lg:grid-cols-[1fr_auto]`}>
        <FadeIn><p className="text-sm font-semibold uppercase tracking-[0.2em] text-near-black">FitOut estimator</p><h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-white">What could your FitOut cost?</h2><p className="mt-4 max-w-2xl text-lg font-normal leading-relaxed text-white">Build an indicative range in about two minutes, see the assumptions and bring the result into a preliminary budget conversation.</p></FadeIn>
        <Link href="/resources/fitout-estimator" className="inline-flex rounded-lg bg-teal px-8 py-4 font-bold text-near-black no-underline transition duration-200 hover:-translate-y-1 hover:bg-white motion-reduce:transform-none">Estimate your FitOut</Link>
      </div></section>

      <section className="bg-near-black py-20 md:py-28"><div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src="/images/furniture/dbt-boardroom.jpg" alt="Finished commercial boardroom and furniture installation" fill className="object-cover" /></div>
        <FadeIn><p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Clear next step</p><h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-white">Tell us what your workplace needs next.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">Whether the decision is property, FitOut, furniture or commercial cleaning, start with the outcome you need.</p><Link href="/contact" className="mt-8 inline-flex rounded-lg bg-teal px-8 py-4 font-bold text-near-black no-underline transition duration-200 hover:-translate-y-1 hover:bg-white motion-reduce:transform-none">Enquire</Link></FadeIn>
      </div></section>
    </main>
    <Footer />
  </>
}
