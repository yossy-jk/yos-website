import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import ContentBreadcrumbs from '@/components/ContentBreadcrumbs'
import ServiceFaq from '@/components/ServiceFaq'
import FlourishServices from '@/components/FlourishServices'
import { ORGANIZATION_SCHEMA, ORGANIZATION_ID, SITE_URL } from '@/lib/site-schema'
import type { FlourishService } from '@/lib/flourish-content'

export default function FlourishServicePage({ service }: { service: FlourishService }) {
  const path = `/flourish/${service.slug}`
  const schema = {
    '@context': 'https://schema.org', '@graph': [ORGANIZATION_SCHEMA, {
      '@type': 'Service', '@id': `${SITE_URL}${path}#service`, name: service.name,
      description: service.description, url: `${SITE_URL}${path}`,
      provider: { '@id': ORGANIZATION_ID }, serviceType: service.formService,
      areaServed: { '@type': 'City', name: 'Newcastle' },
    }],
  }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <section className="flourish-hero relative isolate overflow-hidden bg-near-black pt-32 pb-16 md:pt-44 md:pb-24">
        <Image src={service.image} alt={service.imageAlt} fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-near-black/85" />
        <div className="yos-container relative">
          <ContentBreadcrumbs section="Flourish" sectionPath="/flourish" title={service.formService} path={path} />
          <p className="text-teal text-sm font-semibold uppercase tracking-widest">Flourish It · Newcastle workplaces</p>
          <h1 className="text-white text-[clamp(2rem,5vw,4.5rem)] font-bold leading-tight max-w-4xl mt-5">{service.name}</h1>
          <p className="text-white text-xl md:text-2xl font-semibold max-w-3xl mt-6">{service.headline}</p>
          <p className="text-white/85 leading-relaxed text-lg max-w-3xl mt-5">{service.intro}</p>
          <a href="#service-enquiry" className="inline-flex items-center justify-center gap-3 bg-teal text-near-black rounded-lg px-7 py-4 mt-8 font-bold no-underline hover:bg-white">Discuss your workplace <ArrowRight aria-hidden="true" className="h-5 w-5" /></a>
        </div>
      </section>
      <section className="bg-white py-16 md:py-24">
        <div className="yos-container">
          <div className="max-w-3xl">
            <p className="text-action-teal uppercase text-sm font-semibold tracking-widest">Start with a clear brief</p>
            <h2 className="text-near-black text-3xl md:text-4xl font-bold leading-tight mt-4">{service.answerHeading}</h2>
            <p className="mt-6 text-charcoal text-lg leading-relaxed">{service.answer}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {service.cards.map(card => <div key={card.title} className="rounded-2xl border border-black/10 p-7">
              <Check aria-hidden="true" className="text-action-teal h-6 w-6 mb-5" />
              <h3 className="text-near-black text-xl font-bold">{card.title}</h3>
              <p className="text-charcoal leading-relaxed mt-4">{card.text}</p>
            </div>)}
          </div>
        </div>
      </section>
      <section className="bg-warm-grey py-16 md:py-24">
        <div className="yos-container grid gap-10 lg:grid-cols-2 lg:gap-20 items-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={service.slug === 'office-plant-hire-newcastle' ? '/images/furniture/nova-storage-tambour.jpg' : service.image} alt={service.slug === 'office-plant-hire-newcastle' ? 'Indoor plants integrated into a commercial storage unit' : service.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="text-near-black text-3xl md:text-4xl font-bold leading-tight">{service.planningHeading}</h2>
            {service.planning.map(text => <p key={text} className="text-charcoal leading-relaxed mt-6">{text}</p>)}
          </div>
        </div>
      </section>
      <section className="bg-white py-16 md:py-24">
        <div className="yos-container">
          <h2 className="text-near-black text-3xl md:text-4xl font-bold">From enquiry to an agreed scope.</h2>
          <ol className="grid gap-8 md:grid-cols-3 mt-10">
            {service.process.map((step, index) => <li key={step.title}>
              <p className="text-action-teal text-sm font-bold tracking-widest">0{index + 1}</p>
              <h3 className="text-near-black text-xl font-bold mt-3">{step.title}</h3>
              <p className="text-charcoal leading-relaxed mt-4">{step.text}</p>
            </li>)}
          </ol>
          <div className="mt-12 border-l-4 border-action-teal bg-light-teal p-7 max-w-4xl">
            <h3 className="text-near-black font-bold text-xl">Clear responsibilities from the start.</h3>
            <p className="text-charcoal leading-relaxed mt-3">{service.scope}</p>
          </div>
        </div>
      </section>
      <ServiceFaq heading={`${service.formService}: your questions answered.`} items={service.faqs} />
      <section className="bg-warm-grey py-16 md:py-24 scroll-mt-24" aria-labelledby="service-enquiry-heading">
        <div className="yos-container grid gap-10 lg:grid-cols-2 lg:gap-20 items-start">
          <div>
            <p className="text-action-teal uppercase text-sm tracking-widest font-semibold">Enquire about {service.formService}</p>
            <h2 id="service-enquiry-heading" className="text-near-black text-3xl md:text-4xl font-bold leading-tight mt-4">Tell us what your office needs.</h2>
            <p className="text-charcoal leading-relaxed mt-6">{service.enquiry}</p>
            <p className="text-charcoal leading-relaxed mt-5">We welcome enquiries from Newcastle and Lake Macquarie. Your site address, provider availability, scope and pricing are confirmed before booking.</p>
            <Link href="/office-fitout" className="inline-flex min-h-11 items-center text-action-teal underline underline-offset-4 mt-6">Planning a FitOut? Connect the workplace brief.</Link>
          </div>
          <div id="service-enquiry" tabIndex={-1} aria-labelledby="service-enquiry-heading" className="bg-white rounded-2xl p-6 md:p-8 border border-black/10"><ContactForm initialService={service.formService} /></div>
        </div>
      </section>
      {service.sources.length > 0 && <section className="bg-white py-12">
        <div className="yos-container">
          <h2 className="text-near-black text-xl font-bold">Official guidance for your workplace.</h2>
          <p className="text-charcoal mt-4 max-w-3xl leading-relaxed">Guidance checked 12 October 2026. Requirements depend on your workplace and building; confirm the applicable scope with the relevant specialist.</p>
          <ul className="mt-5 space-y-3">{service.sources.map(source => <li key={source.href}><a href={source.href} className="text-action-teal underline underline-offset-4 leading-relaxed">{source.title}</a></li>)}</ul>
        </div>
      </section>}
      <FlourishServices />
  </>
}
