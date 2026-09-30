import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import CapabilityDownload from '@/components/CapabilityDownload'
import { LOGO_URL, ORGANIZATION_ID, SERVICE_TYPES, SITE_URL } from '@/lib/site-schema'

export const metadata: Metadata = {
  title: 'Commercial Property, Fit Out & Furniture | Your Office Space',
  description: 'Find, fit out and furnish your next commercial space with one team on your side. Commercial cleaning is available across Newcastle CBD and Lake Macquarie.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Find It, Fit It Out and Furnish It | Your Office Space',
    description: 'Commercial property, client-side fit out project management, furniture and commercial cleaning from one connected team.',
    url: SITE_URL,
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space commercial workplace services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find It, Fit It Out and Furnish It | Your Office Space',
    description: 'Commercial property, client-side fit out project management, furniture and commercial cleaning from one connected team.',
    images: ['/og/og-default.png'],
  },
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Your Office Space',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
      areaServed: ['New South Wales', 'Australia'],
      knowsAbout: SERVICE_TYPES,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Your Office Space',
      publisher: { '@id': ORGANIZATION_ID },
      inLanguage: 'en-AU',
    },
    ...SERVICE_TYPES.map(name => ({
      '@type': 'Service',
      name,
      provider: { '@id': ORGANIZATION_ID },
    })),
  ],
}
const primaryTagline = 'Find It, Fit It Out and Furnish It'

const services = [
  { label: 'Find It', title: 'Lease or buy', copy: 'Tenant-side property advice.', href: '/tenant-rep', image: '/images/furniture/space-cogc-office.jpg' },
  { label: 'Fit It Out', title: 'Plan and deliver', copy: 'Client-side project management.', href: '/office-fitout', image: '/images/furniture/space-wsi-openplan.jpg' },
  { label: 'Furnish It', title: 'Specify and install', copy: 'Commercial furniture, end to end.', href: '/furniture', image: '/images/furniture/dbt-boardroom.jpg' },
  { label: 'Look After It', title: 'Commercial Cleaning', copy: 'Reliable ongoing workplace care.', href: '/cleaning', image: '/images/furniture/space-liverpool-b.jpg' },
]

const clientLogos = [
  { name: 'Elders Advantage Group', src: '/client-logos/elders-advantage.png' },
  { name: 'Dynamic Business Technologies', src: '/client-logos/dynamic-business-technologies.jpg' },
  { name: 'Australian Aboriginal Child and Family Services', src: '/client-logos/aacafs.png' },
  { name: 'OzChild', src: '/client-logos/ozchild.png' },
  { name: 'Jirsch Sutherland', src: '/client-logos/jirsch-sutherland.jpg' },
  { name: 'Total Fitouts', src: '/client-logos/total-fitouts.webp' },
]

const showcases = [
  { eyebrow: 'Find It', title: 'Make the property decision with someone on your side.', copy: 'Lease or buy with a clear brief, market evidence and the commercial trade-offs explained before you commit.', points: ['Tenant representation across NSW', 'Commercial Buyers Agent support', 'Structure Ready and Finance Ready pathways'], href: '/tenant-rep', cta: 'Explore property services', image: '/images/furniture/space-cogc-office.jpg', alt: 'Contemporary commercial office used to illustrate property selection' },
  { eyebrow: 'Fit It Out', title: 'Keep the brief, budget and delivery connected.', copy: 'YOS acts as your client-side project manager, coordinating the specialist team while protecting your priorities.', points: ['Brief and preliminary budget', 'Design and procurement coordination', 'Programme, risk and handover oversight'], href: '/office-fitout', cta: 'See the fit out process', image: '/images/furniture/space-wsi-openplan.jpg', alt: 'Completed open-plan commercial workplace' },
  { eyebrow: 'Furnish It', title: 'Specify furniture around the people and the space.', copy: 'From one boardroom to a complete workplace, we coordinate selection, supply, delivery and installation.', points: ['Workstations and seating', 'Meeting, storage and breakout spaces', 'Australia-wide supply and installation'], href: '/furniture', cta: 'Explore commercial furniture', image: '/images/furniture/dbt-boardroom.jpg', alt: 'Commercial boardroom furniture installation' },
  { eyebrow: 'Look After It', title: 'A clean workplace without chasing anyone.', copy: 'Commercial cleaning across Newcastle CBD and Lake Macquarie, with a clear scope and monthly quality assurance.', points: ['Quote after a site inspection', 'Same cleaning team wherever possible', 'Monthly quality assurance'], href: '/cleaning', cta: 'Get a cleaning quote', image: '/images/furniture/space-liverpool-b.jpg', alt: 'Clean and ready commercial workplace' },
]

const reviews = [
  { quote: 'Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.', name: 'Liz Murray', organisation: 'Verified Google review' },
  { quote: 'Joe was instrumental in building out our boardroom. High-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.', name: 'Nathan Franks', organisation: 'Dynamic Business Technologies' },
]

export default function Home() {
  return <>
    <Nav />
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <section className="home-hero">
        <Image src="/images/furniture/space-cogc-wide.jpg" alt="Contemporary commercial workplace interior" fill priority className="object-cover" sizes="100vw" />
        <div className="home-hero-shade" />
        <div className="site-container home-hero-inner">
          <FadeIn>
            <p className="home-eyebrow home-eyebrow-light">One team for your workplace</p>
            <h1>{primaryTagline}</h1>
            <p className="home-hero-copy text-white/85">We help businesses lease or buy their next commercial space, then coordinate the fit out and furniture. Commercial cleaning is available across Newcastle CBD and Lake Macquarie.</p>
            <div className="home-actions"><Link href="/contact" className="home-button home-button-primary">Enquire</Link><Link href="/resources/fitout-estimator" className="home-button home-button-ghost">Estimate your fit out</Link></div>
          </FadeIn>
          <div className="home-service-grid" aria-label="Our services">
            {services.map((service, index) => <FadeIn key={service.label} delay={index * 70}><Link href={service.href} className="home-service-card"><Image src={service.image} alt="" fill className="object-cover" sizes="(min-width: 1200px) 300px, 50vw" /><span className="home-service-shade" /><span className="home-service-content"><span className="home-service-label">{service.label}</span><strong>{service.title}</strong><span>{service.copy}</span><span className="home-card-arrow" aria-hidden="true">→</span></span></Link></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="home-capability"><div className="site-container home-capability-inner"><div><p className="home-eyebrow">See how we work</p><h2>Review our capability before we talk.</h2><p>Our services, approach and the sectors we support—in one concise document.</p></div><CapabilityDownload label="Download capability statement" variant="primary" /></div></section>

      <section className="home-proof" aria-labelledby="proof-heading"><div className="site-container"><FadeIn><div className="home-section-intro home-section-intro-left"><p className="home-eyebrow">Real relationships</p><h2 id="proof-heading">Clients and partners connected to our workplace projects.</h2></div></FadeIn><div className="home-logo-grid">{clientLogos.map(logo => <div key={logo.name} className="home-logo-card"><Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain" sizes="180px" /></div>)}</div></div></section>

      <section className="home-journey"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">One coordinated journey</p><h2>One team, from the first decision to the working workplace.</h2></div></FadeIn><ol className="home-journey-list">{services.map((service, index) => <li key={service.label}><span>0{index + 1}</span><strong>{service.label}</strong><p>{service.copy}</p></li>)}</ol></div></section>

      <section className="home-showcases" aria-labelledby="services-heading"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">Choose what you need</p><h2 id="services-heading">One service, or one team across the whole journey.</h2></div></FadeIn><div className="home-showcase-list">{showcases.map((service, index) => <FadeIn key={service.eyebrow}><article className={`home-showcase ${index % 2 ? 'home-showcase-reverse' : ''}`}><div className="home-showcase-image"><Image src={service.image} alt={service.alt} fill className="object-cover" sizes="(min-width: 1100px) 50vw, 100vw" /></div><div className="home-showcase-copy"><p className="home-eyebrow">{service.eyebrow}</p><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.points.map(point => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul><Link href={service.href} className="home-button home-button-dark">{service.cta}<span aria-hidden="true">→</span></Link></div></article></FadeIn>)}</div></div></section>

      <section className="home-budget"><div className="site-container home-budget-grid"><FadeIn><div className="home-budget-visual" aria-label="Property, fit out, furniture and programme decisions all draw from one project budget">{['Property', 'Fit out', 'Furniture', 'Programme'].map((label, index) => <div key={label} style={{'--bar-width': `${88 - index * 12}%`} as React.CSSProperties}><span>{label}</span><i /></div>)}</div></FadeIn><FadeIn><div><p className="home-eyebrow">Protect the whole picture</p><h2>One budget. A lot of hands reaching for it.</h2><p>Property costs, consultants, contractors, furniture and programme changes all draw from the same project budget.</p><p>As your client-side project manager, YOS makes the trade-offs visible and keeps every decision tied to the workplace outcome.</p><Link href="/office-fitout" className="home-button home-button-outline">How client-side PM works</Link></div></FadeIn></div></section>

      <section className="home-reviews" aria-labelledby="reviews-heading"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">Independent feedback</p><h2 id="reviews-heading">What clients say about working with Joe.</h2></div></FadeIn><div className="home-review-grid">{reviews.map((review, index) => <FadeIn key={review.name} delay={index * 80}><figure><blockquote>“{review.quote}”</blockquote><figcaption><strong>{review.name}</strong><span>{review.organisation}</span></figcaption></figure></FadeIn>)}</div></div></section>

      <section className="home-estimator"><div className="site-container home-estimator-inner"><FadeIn><p className="home-eyebrow">Fit out estimator</p><h2>What could your fit out cost?</h2><p>Build an indicative range in about two minutes and bring the result into a preliminary budget conversation.</p></FadeIn><Link href="/resources/fitout-estimator" className="home-button home-button-dark">Estimate your fit out</Link></div></section>

      <section className="home-final"><div className="site-container home-final-grid"><div className="home-final-image"><Image src="/images/furniture/dbt-boardroom.jpg" alt="Finished commercial boardroom and furniture installation" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /></div><FadeIn><div><p className="home-eyebrow home-eyebrow-light">Clear next step</p><h2>Tell us what your workplace needs next.</h2><p>Property, fit out, furniture or commercial cleaning—start with the outcome you need.</p><Link href="/contact" className="home-button home-button-primary">Enquire</Link></div></FadeIn></div></section>
    </main>
    <Footer />
  </>
}
