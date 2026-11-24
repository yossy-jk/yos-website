import { COMPANY_POSITIONING, COMPANY_TAGLINE, COMPANY_FAQS } from '@/lib/company-record'
import ServiceFaq from '@/components/ServiceFaq'
import CompanyPurpose from '@/components/CompanyPurpose'
import CatalogueCards from '@/components/CatalogueCards'
import HomeServiceGuide from '@/components/HomeServiceGuide'
import { CLIENT_REVIEWS } from '@/lib/client-reviews'
import FlourishServices from '@/components/FlourishServices'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import CapabilityDownload from '@/components/CapabilityDownload'
import ReviewsCarousel from '@/components/ReviewsCarousel'
import { ORGANIZATION_ID, SITE_URL } from '@/lib/site-schema'

export const metadata: Metadata = withPageSeo({
  title: 'Outsourced Property Team Newcastle | Your Office Space',
  description: COMPANY_POSITIONING,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Outsourced Property Team Newcastle | Your Office Space',
    description: COMPANY_POSITIONING,
    url: SITE_URL,
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space commercial workplace services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outsourced Property Team Newcastle | Your Office Space',
    description: COMPANY_POSITIONING,
    images: ['/og/og-default.png'],
  },
})

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION_SCHEMA,
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
const primaryTagline = COMPANY_TAGLINE

const services = [
  { label: 'Find It', title: 'Lease or buy', copy: 'Tenant representation in NSW and commercial buying for businesses moving from leasing to buying.', href: '/tenant-rep', image: '/images/furniture/space-cogc-office.jpg' },
  { label: 'Fit It Out', title: 'Plan and deliver', copy: 'Client-side project management.', href: '/office-fitout', image: '/images/furniture/space-wsi-openplan.jpg' },
  { label: 'Furnish It', title: 'Source, supply and install', copy: 'Commercial furniture, end to end.', href: '/furniture', image: '/images/furniture/dbt-boardroom.jpg' },
  { label: 'Flourish It', title: 'Commercial Cleaning', copy: 'The Flourish Team: cleaning and after-move-in services.', href: '/cleaning', image: '/images/furniture/space-liverpool-b.jpg' },
]

const clientLogos = [
  { name: 'Recovery Station', src: '/images/relationships/recovery-station.jpg' },
  { name: 'Dynamic Business Technologies', src: '/client-logos/dynamic-business-technologies.jpg' },
  { name: 'Jirsch Sutherland', src: '/client-logos/jirsch-sutherland.jpg' },
  { name: 'Total Fitouts', src: '/client-logos/total-fitouts.webp', dark: true },
]

const showcases = [
  { eyebrow: 'Find It', title: 'Make the property decision with someone on your side.', copy: 'Tenant representation in NSW, plus commercial buyers agency for businesses moving from leasing to buying.', points: ['Tenant representation across NSW', 'Commercial buyers agency for owner-occupiers', 'Connect the leasing and buying decisions'], href: '/tenant-rep', cta: 'Explore property services', image: '/images/furniture/space-cogc-office.jpg', alt: 'Contemporary commercial office used to illustrate property selection' },
  { eyebrow: 'Fit It Out', title: 'Keep the brief, budget and delivery connected.', copy: 'YOS acts as your client-side project manager, coordinating the specialist team while protecting your priorities.', points: ['Brief and preliminary budget', 'Design and procurement coordination', 'Programme, risk and handover oversight'], href: '/office-fitout', cta: 'See the FitOut process', image: '/images/furniture/space-wsi-openplan.jpg', alt: 'Completed open-plan commercial workplace' },
  { eyebrow: 'Furnish It', title: 'Source, supply and install for the people in the space.', copy: 'From one boardroom to a complete workplace, we coordinate selection, supply, delivery and installation.', points: ['Workstations and seating', 'Meeting, storage and breakout spaces', 'Online ordering at Your Office Furniture'], href: '/furniture', cta: 'Explore commercial furniture', image: '/images/furniture/dbt-boardroom.jpg', alt: 'Commercial boardroom furniture installation' },
  { eyebrow: 'Flourish It', title: 'A clean workplace without chasing anyone.', copy: 'Commercial cleaning by the Flourish Team in Newcastle CBD and Lake Macquarie, with a clear scope and monthly quality assurance.', points: ['Commercial cleaning with monthly quality assurance', 'Plant hire and test and tag', 'Fire and first aid compliance coordination'], href: '/cleaning#cleaning-quote-form', cta: 'Get a cleaning quote', image: '/images/furniture/space-liverpool-b.jpg', alt: 'Clean and ready commercial workplace' },
]

const reviews = CLIENT_REVIEWS

export default function Home() {
  return <>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQQ9MD23" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager" /></noscript>
    <Nav />
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <section className="hero-static home-hero">
        <Image src="/images/furniture/space-cogc-wide.jpg" alt="Contemporary commercial workplace interior" fill loading="eager" fetchPriority="high" className="object-cover" sizes="100vw" />
        <div className="home-hero-shade" />
        <div className="site-container home-hero-inner">
          <FadeIn>
            <p className="home-eyebrow home-eyebrow-light">Your outsourced property team</p>
            <h1>Workplace Solutions</h1>
            <p className="home-hero-copy text-white/85">We partner with businesses to take the strain out of growing.</p><p className="text-white/85" style={{ marginTop: 20, lineHeight: 1.7 }}>{primaryTagline}</p>
            <div className="home-actions"><Link href="/free-space-plan" className="home-button home-button-primary">Get a free space plan</Link><Link href="/resources/fitout-estimator" className="home-button home-button-ghost">Estimate your FitOut</Link></div><HomeServiceGuide />
          </FadeIn>
        </div>
      </section>

      <section id="services" style={{ scrollMarginTop: 100 }} className="home-service-choice" aria-labelledby="service-choice-heading"><div className="site-container"><div className="home-service-choice-heading"><p className="home-eyebrow">Start with what you need</p><h2 id="service-choice-heading">Four ways we can help.</h2></div><div className="home-service-grid" aria-label="Our services">{services.map((service, index) => <FadeIn key={service.label} delay={index * 70}><Link href={service.href} className="home-service-card"><span className="home-service-number">0{index + 1}</span><span className="home-service-content"><span className="home-service-label">{service.label}</span><strong>{service.title}</strong><span>{service.copy}</span><span className="home-card-arrow" aria-hidden="true">→</span></span></Link></FadeIn>)}</div></div></section>


      <section aria-labelledby="capability-video-heading" style={{ padding: 'clamp(2rem, 5vw, 4rem) 0', background: '#F5F5F5' }}>
        <div className="site-container">
          <h2 id="capability-video-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '1.5rem' }}>See how we support your workplace.</h2>
          <video controls playsInline preload="none" poster="/videos/yos-one-team-poster.jpg" aria-label="Your Office Space capability video" style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#191919', borderRadius: '0.5rem' }}>
            <source src="/videos/yos-one-team.mp4" type="video/mp4" />
            Your browser does not support video. <a href="/videos/yos-one-team.mp4">Watch the capability video</a>.
          </video>
        </div>
      </section>

      <section className="home-capability"><div className="site-container home-capability-inner"><div><p className="home-eyebrow">See how we work</p><h2>Review our capability before we talk.</h2><p>Our services, approach and the sectors we support, in one concise document.</p></div><CapabilityDownload label="Download capability statement" variant="primary" /></div></section>

      <section className="home-proof" aria-labelledby="proof-heading"><div className="site-container"><FadeIn><div className="home-section-intro home-section-intro-left"><p className="home-eyebrow">Real relationships</p><h2 id="proof-heading">Client projects.</h2></div></FadeIn><div className="home-logo-grid">{clientLogos.map(logo => <div key={logo.name} className={`home-logo-card ${'dark' in logo && logo.dark ? 'home-logo-card-dark' : ''}`}><Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain" sizes="180px" /></div>)}</div></div></section>

      <CompanyPurpose compact introduction="An outsourced property team, from the premises decision to after-move-in care." />

      <section className="home-showcases" aria-labelledby="services-heading"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">Choose what you need</p><h2 id="services-heading">One service, or one team across the whole journey.</h2></div></FadeIn><div className="home-showcase-list">{showcases.map((service, index) => <FadeIn key={service.eyebrow}><article className={`home-showcase ${index % 2 ? 'home-showcase-reverse' : ''}`}><div className="home-showcase-image"><Image src={service.image} alt={service.alt} fill className="object-cover" sizes="(min-width: 1100px) 50vw, 100vw" /></div><div className="home-showcase-copy"><p className="home-eyebrow">{service.eyebrow}</p><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.points.map(point => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul><Link href={service.href} className="home-button home-button-dark">{service.cta}<span aria-hidden="true">→</span></Link></div></article></FadeIn>)}</div></div></section>

      <section className="home-capability"><div className="site-container home-capability-inner"><div><p className="home-eyebrow">Before you engage a builder</p><h2>Start with a free space plan.</h2><p>For businesses that have not yet engaged a builder. Share your workplace requirements and existing plan so we can discuss suitability and scope.</p></div><Link href="/free-space-plan" className="home-button home-button-primary">Request a free space plan</Link></div></section>
      <CatalogueCards />
      <FlourishServices compact />

      <section className="home-budget"><div className="site-container home-budget-grid"><FadeIn><div className="home-budget-visual" aria-label="Property, FitOut, furniture and programme are four connected parts of one project budget"><div><span>Property</span></div><div><span>FitOut</span></div><div><span>Furniture</span></div><div><span>Programme</span></div><strong>One brief<br />One budget</strong></div></FadeIn><FadeIn><div><p className="home-eyebrow">Protect the whole picture</p><h2>One budget. A lot of hands reaching for it.</h2><p>Property costs, consultants, contractors, furniture and programme changes all draw from the same project budget.</p><p>As your client-side project manager, YOS makes the trade-offs visible and keeps every decision tied to the workplace outcome.</p><Link href="/office-fitout" className="home-button home-button-outline">How client-side PM works</Link></div></FadeIn></div></section>

      <section className="home-reviews" aria-labelledby="reviews-heading"><div className="site-container"><FadeIn><div className="home-section-intro"><p className="home-eyebrow">Independent Google feedback</p><h2 id="reviews-heading">Nine five-star Google reviews.</h2></div></FadeIn><p style={{ marginTop: 24 }}>Nine five-star Google reviews as at 25 November 2026. Selected client-approved excerpts appear below.</p><div className="mt-10"><ReviewsCarousel reviews={reviews} /></div></div></section>

      <ServiceFaq items={COMPANY_FAQS} heading="Your outsourced property team: common questions" />
      <section className="home-estimator"><div className="site-container home-estimator-inner"><FadeIn><p className="home-eyebrow">FitOut estimator</p><h2>What could your FitOut cost?</h2><p>Build an indicative range in about two minutes and bring the result into a preliminary budget conversation.</p></FadeIn><Link href="/resources/fitout-estimator" className="home-button home-button-dark">Estimate your FitOut</Link></div></section>

      <section className="home-final"><div className="site-container home-final-grid"><div className="home-final-image"><Image src="/images/furniture/dbt-boardroom.jpg" alt="Finished commercial boardroom and furniture installation" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /></div><FadeIn><div><p className="home-eyebrow home-eyebrow-light">Clear next step</p><h2>Tell us what your workplace needs next.</h2><p>Property, FitOut, furniture or commercial cleaning, start with the outcome you need.</p><Link href="/contact#contact-enquiry" className="home-button home-button-primary">Enquire</Link></div></FadeIn></div></section>
    </main>
    <Footer />
  </>
}
