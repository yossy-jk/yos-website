import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import CapabilityDownload from '@/components/CapabilityDownload'
import ReviewsCarousel from '@/components/ReviewsCarousel'
import { LOGO_URL, ORGANIZATION_ID, SERVICE_TYPES, SITE_URL } from '@/lib/site-schema'

export const metadata: Metadata = {
  title: 'Commercial Property, FitOut & Furniture | Your Office Space',
  description: 'Find, fit out and furnish your next commercial space with one team on your side. Commercial cleaning is available across Newcastle CBD and Lake Macquarie.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Find It, Fit It Out and Furnish It | Your Office Space',
    description: 'Commercial property, client-side FitOut project management, furniture and commercial cleaning from one connected team.',
    url: SITE_URL,
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space commercial workplace services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find It, Fit It Out and Furnish It | Your Office Space',
    description: 'Commercial property, client-side FitOut project management, furniture and commercial cleaning from one connected team.',
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
    { '@type': 'Service', name: 'Tenant Representation and Commercial Leasing', url: `${SITE_URL}/tenant-rep`, areaServed: { '@type': 'State', name: 'New South Wales' }, provider: { '@id': ORGANIZATION_ID } },
    { '@type': 'Service', name: 'Commercial Buyers Agent', url: `${SITE_URL}/buyers-agency`, areaServed: { '@type': 'State', name: 'New South Wales' }, provider: { '@id': ORGANIZATION_ID } },
    { '@type': 'Service', name: 'Commercial FitOut Project Management', url: `${SITE_URL}/office-fitout`, areaServed: { '@type': 'Country', name: 'Australia' }, provider: { '@id': ORGANIZATION_ID } },
    { '@type': 'Service', name: 'Office and Commercial Furniture', url: `${SITE_URL}/furniture`, areaServed: { '@type': 'Country', name: 'Australia' }, provider: { '@id': ORGANIZATION_ID } },
    { '@type': 'Service', name: 'Commercial Cleaning', url: `${SITE_URL}/cleaning`, areaServed: [{ '@type': 'City', name: 'Newcastle CBD' }, { '@type': 'City', name: 'Lake Macquarie' }], provider: { '@id': ORGANIZATION_ID } },
  ],
}
const primaryTagline = 'Find It, Fit It Out and Furnish It'

const services = [
  { label: 'Find It', title: 'Lease or buy', copy: 'Tenant-side property advice.', href: '/tenant-rep', image: '/images/furniture/space-cogc-office.jpg' },
  { label: 'Fit It Out', title: 'Plan and deliver', copy: 'Client-side project management.', href: '/office-fitout', image: '/images/furniture/space-wsi-openplan.jpg' },
  { label: 'Furnish It', title: 'Source, supply and install', copy: 'Commercial furniture, end to end.', href: '/furniture', image: '/images/furniture/dbt-boardroom.jpg' },
  { label: 'Flourish It', title: 'Commercial Cleaning', copy: 'Reliable ongoing workplace care.', href: '/cleaning', image: '/images/furniture/space-liverpool-b.jpg' },
]

const clientLogos = [
  { name: 'Elders Advantage Group', src: '/client-logos/elders-advantage.png' },
  { name: 'Dynamic Business Technologies', src: '/client-logos/dynamic-business-technologies.jpg' },
  { name: 'Australian Aboriginal Child and Family Services', src: '/client-logos/aacafs.png' },
  { name: 'OzChild', src: '/client-logos/ozchild.png' },
  { name: 'Jirsch Sutherland', src: '/client-logos/jirsch-sutherland.jpg' },
  { name: 'Total Fitouts', src: '/client-logos/total-fitouts.webp', dark: true },
]

const showcases = [
  { eyebrow: 'Find It', title: 'Make the property decision with someone on your side.', copy: 'Lease or buy with a clear brief, market evidence and the commercial trade-offs explained before you commit.', points: ['Tenant representation across NSW', 'Commercial Buyers Agent support', 'Structure Ready and Finance Ready pathways'], href: '/tenant-rep', cta: 'Explore property services', image: '/images/furniture/space-cogc-office.jpg', alt: 'Contemporary commercial office used to illustrate property selection' },
  { eyebrow: 'Fit It Out', title: 'Keep the brief, budget and delivery connected.', copy: 'YOS acts as your client-side project manager, coordinating the specialist team while protecting your priorities.', points: ['Brief and preliminary budget', 'Design and procurement coordination', 'Programme, risk and handover oversight'], href: '/office-fitout', cta: 'See the FitOut process', image: '/images/furniture/space-wsi-openplan.jpg', alt: 'Completed open-plan commercial workplace' },
  { eyebrow: 'Furnish It', title: 'Source, supply and install for the people in the space.', copy: 'From one boardroom to a complete workplace, we coordinate selection, supply, delivery and installation.', points: ['Workstations and seating', 'Meeting, storage and breakout spaces', 'Australia-wide supply and installation'], href: '/furniture', cta: 'Explore commercial furniture', image: '/images/furniture/dbt-boardroom.jpg', alt: 'Commercial boardroom furniture installation' },
  { eyebrow: 'Flourish It', title: 'A clean workplace without chasing anyone.', copy: 'Commercial cleaning across Newcastle CBD and Lake Macquarie, with a clear scope and monthly quality assurance.', points: ['Quote after a site inspection', 'Same cleaning team wherever possible', 'Monthly quality assurance'], href: '/cleaning', cta: 'Get a cleaning quote', image: '/images/furniture/space-liverpool-b.jpg', alt: 'Clean and ready commercial workplace' },
]

const reviews = [
  { quote: 'For us, it meant we could stay focused on our core business while knowing the property side was being properly managed.', name: 'Beth Gwalter', organisation: 'Recovery Station', logo: '/images/relationships/recovery-station.jpg', source: 'https://share.google/0lpk1QW50JwpUsbRu' },
  { quote: 'They are incredibly professional, reliable, and always go above and beyond to meet our needs.', name: 'Olivia Crawford', organisation: 'Australian Aboriginal Child and Family Services', logo: '/client-logos/aacafs.png', source: 'https://share.google/HidAuZX3Bc0ZYK31x' },
  { quote: 'Communication was clear, lead times were accurate, and the product quality exceeded expectations.', name: 'Mitch Peck', organisation: 'Get Leveled Flooring', logo: '/client-logos/get-leveled-flooring.jpeg', source: 'https://share.google/vpstmI6eEJQYV0x2A' },
  { quote: 'His advice was practical, his attention to detail excellent, and the end result both functional and professional.', name: 'Nathan Franks', organisation: 'Dynamic Business Technologies', logo: '/client-logos/dynamic-business-technologies.jpg', source: 'https://share.google/sdMxxcSIOrRfm1U4R' },
  { quote: 'He asks thoughtful questions and builds genuine, lasting relationships based on consistent two-way communication.', name: 'Liz Murray', organisation: 'Edge of Possibilities', logo: '/client-logos/edge-of-possibilities.png', source: 'https://share.google/XPIrLkixCGQSgHtSY' },
  { quote: 'Joe and the team at YOS are incredible to work with.', name: 'Jason Dowdall', organisation: 'Total Fitouts', logo: '/client-logos/total-fitouts.webp', logoBackground: 'dark' as const, source: 'https://share.google/X2lSU9zQVaHDtDd0r' },
  { quote: 'They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met.', name: 'Sophie Collinson', organisation: 'Jirsch Sutherland', logo: '/client-logos/jirsch-sutherland.jpg', source: 'https://share.google/HXVrtRaWPBmZm0aEh' },
  { quote: 'Excellent service, reliable staff. We had an all-round exceptional experience and would definitely recommend', name: 'Kristy Cashman', organisation: 'ConnectAbility', logo: null, source: 'https://share.google/bnY6KlPoFhDbjOrA7' },
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
            <p className="home-hero-copy text-white/85">We help businesses lease or buy their next commercial space, then coordinate the FitOut and furniture. Commercial cleaning is available across Newcastle CBD and Lake Macquarie.</p>
            <div className="home-actions"><Link href="/contact" className="home-button home-button-primary">Enquire</Link><Link href="/resources/fitout-estimator" className="home-button home-button-ghost">Estimate your FitOut</Link></div>
          </FadeIn>
        </div>
      </section>

      <section className="home-service-choice" aria-labelledby="service-choice-heading"><div className="site-container"><div className="home-service-choice-heading"><p className="home-eyebrow">Start with what you need</p><h2 id="service-choice-heading">Four ways we can help.</h2></div><div className="home-service-grid" aria-label="Our services">{services.map((service, index) => <FadeIn key={service.label} delay={index * 70}><Link href={service.href} className="home-service-card"><span className="home-service-number">0{index + 1}</span><span className="home-service-content"><span className="home-service-label">{service.label}</span><strong>{service.title}</strong><span>{service.copy}</span><span className="home-card-arrow" aria-hidden="true">→</span></span></Link></FadeIn>)}</div></div></section>

      <section aria-labelledby="capability-video-heading" style={{ padding: 'clamp(2rem, 5vw, 4rem) 0', background: '#F5F5F5' }}>
        <div className="site-container">
          <h2 id="capability-video-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '1.5rem' }}>One team, from lease to move-in.</h2>
          <video controls playsInline preload="none" poster="/videos/yos-one-team-poster.jpg" aria-label="Your Office Space capability video, one team from lease to move-in" style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#191919', borderRadius: '0.5rem' }}>
            <source src="/videos/yos-one-team.mp4" type="video/mp4" />
            Your browser does not support video. <a href="/videos/yos-one-team.mp4">Watch the capability video</a>.
          </video>
        </div>
      </section>

      <section className="home-capability"><div className="site-container home-capability-inner"><div><p className="home-eyebrow">See how we work</p><h2>Review our capability before we talk.</h2><p>Our services, approach and the sectors we support—in one concise document.</p></div><CapabilityDownload label="Download capability statement" variant="primary" /></div></section>

      <section className="home-proof" aria-labelledby="proof-heading"><div className="site-container"><FadeIn><div className="home-section-intro home-section-intro-left"><p className="home-eyebrow">Real relationships</p><h2 id="proof-heading">Clients and partners connected to our workplace projects.</h2></div></FadeIn><div className="home-logo-grid">{clientLogos.map(logo => <div key={logo.name} className={`home-logo-card ${'dark' in logo && logo.dark ? 'home-logo-card-dark' : ''}`}><Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain" sizes="180px" /></div>)}</div></div></section>

      <section className="home-journey"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">One coordinated journey</p><h2>One team, from the first decision to the working workplace.</h2></div></FadeIn><ol className="home-journey-list">{services.map((service, index) => <li key={service.label}><span>0{index + 1}</span><strong>{service.label}</strong><p>{service.copy}</p></li>)}</ol></div></section>

      <section className="home-showcases" aria-labelledby="services-heading"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">Choose what you need</p><h2 id="services-heading">One service, or one team across the whole journey.</h2></div></FadeIn><div className="home-showcase-list">{showcases.map((service, index) => <FadeIn key={service.eyebrow}><article className={`home-showcase ${index % 2 ? 'home-showcase-reverse' : ''}`}><div className="home-showcase-image"><Image src={service.image} alt={service.alt} fill className="object-cover" sizes="(min-width: 1100px) 50vw, 100vw" /></div><div className="home-showcase-copy"><p className="home-eyebrow">{service.eyebrow}</p><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.points.map(point => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul><Link href={service.href} className="home-button home-button-dark">{service.cta}<span aria-hidden="true">→</span></Link></div></article></FadeIn>)}</div></div></section>

      <section className="home-budget"><div className="site-container home-budget-grid"><FadeIn><div className="home-budget-visual" aria-label="Property, FitOut, furniture and programme are four connected parts of one project budget"><div><span>Property</span></div><div><span>FitOut</span></div><div><span>Furniture</span></div><div><span>Programme</span></div><strong>One brief<br />One budget</strong></div></FadeIn><FadeIn><div><p className="home-eyebrow">Protect the whole picture</p><h2>One budget. A lot of hands reaching for it.</h2><p>Property costs, consultants, contractors, furniture and programme changes all draw from the same project budget.</p><p>As your client-side project manager, YOS makes the trade-offs visible and keeps every decision tied to the workplace outcome.</p><Link href="/office-fitout" className="home-button home-button-outline">How client-side PM works</Link></div></FadeIn></div></section>

      <section className="home-reviews" aria-labelledby="reviews-heading"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">Independent Google feedback</p><h2 id="reviews-heading">What clients say about working with Joe.</h2></div></FadeIn><div className="mt-10"><ReviewsCarousel reviews={reviews} /></div></div></section>

      <section className="home-estimator"><div className="site-container home-estimator-inner"><FadeIn><p className="home-eyebrow">FitOut estimator</p><h2>What could your FitOut cost?</h2><p>Build an indicative range in about two minutes and bring the result into a preliminary budget conversation.</p></FadeIn><Link href="/resources/fitout-estimator" className="home-button home-button-dark">Estimate your FitOut</Link></div></section>

      <section className="home-final"><div className="site-container home-final-grid"><div className="home-final-image"><Image src="/images/furniture/dbt-boardroom.jpg" alt="Finished commercial boardroom and furniture installation" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /></div><FadeIn><div><p className="home-eyebrow home-eyebrow-light">Clear next step</p><h2>Tell us what your workplace needs next.</h2><p>Property, FitOut, furniture or commercial cleaning—start with the outcome you need.</p><Link href="/contact" className="home-button home-button-primary">Enquire</Link></div></FadeIn></div></section>
    </main>
    <Footer />
  </>
}
