import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import BookingCTA from '@/components/BookingCTA'
import FurniturePopup from '@/components/FurniturePopup'
import HubSpotForm from '@/components/HubSpotForm'

export const metadata = {
  title: 'Office Fit Out | Your Office Space',
  description: 'Commercial office fit out services across Australia. From cold shell to turnkey — project managed by one team, start to finish. Brief to delivered.',
  twitter: { card: 'summary_large_image', title: 'Office Fit Out | Your Office Space', description: 'Brief to delivered. Office furniture and fitout — one team, end to end. Express to made-to-order.' },
  alternates: { canonical: 'https://www.yourofficespace.au/office-fitout' },
  openGraph: {
    title: 'Office Fit Out | Your Office Space',
    description: 'Commercial office fit out. End-to-end project management — design, procurement, installation. One team, no gaps.',
    url: 'https://yourofficespace.au/furniture',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Office Fit Out — Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function OfficeFitoutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://www.yourofficespace.au/#organization",
            "name": "Your Office Space",
            "url": "https://www.yourofficespace.au",
            "logo": "https://www.yourofficespace.au/logo.png",
            "telephone": "+61434655511",
            "email": "jk@yourofficespace.au",
            "description": "Office furniture supply and fitout project management. From brief to installed workspace across Australia.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Sydney" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ]
          },
          {
            "@type": "Service",
            "@id": "https://www.yourofficespace.au/office-fitout#service",
            "name": "Commercial Office Fit Out — Newcastle",
            "provider": { "@id": "https://www.yourofficespace.au/#organization" },
            "description": "Office furniture supply and fitout project management. From brief to installed workspace — workstations, seating, meeting rooms, breakout zones.",
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ],
            "serviceType": "Commercial Office Fit Out",
            "url": "https://www.yourofficespace.au/office-fitout"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How much does an office fitout cost in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Office fitout costs in Newcastle range from $600–$1,200/sqm for basic, $1,200–$2,000/sqm for mid-range, and $2,000+/sqm for premium. Per workstation, budget $500–$3,500 depending on finish level. Use the free Your Office Space fitout estimator for a detailed budget based on your brief." } },
              { "@type": "Question", "name": "How long does a commercial office fitout take?", "acceptedAnswer": { "@type": "Answer", "text": "A basic furniture-only fitout delivers in 2–4 weeks. A full commercial fitout including construction, joinery, electrical and AV typically takes 6–16 weeks depending on scope. Your Office Space manages the entire process end-to-end." } },
              { "@type": "Question", "name": "What brands of commercial office furniture do you supply?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Your Office Space supplies a wide range of commercial office furniture brands covering workstations, seating, meeting tables, storage, and breakout settings. We match the product to your spec, timeline and budget — not to a limited product list. We also have an online shop at yos-furniture.myshopify.com for express orders." } },
              
              { "@type": "Question", "name": "Can you project manage a full fitout including construction and joinery?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Your Office Space project manages full commercial fitouts including partition walls, flooring, joinery, electrical, AV, and IT infrastructure. We are the single point of contact from brief to practical completion." } },
              { "@type": "Question", "name": "Do you offer express or fast-track fitout options?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We have an in-stock express range that ships in 1–2 weeks for standard workstations, seating and storage. Made-to-order items typically run 3–6 weeks. Lead times are confirmed before you commit to anything." } },
              { "@type": "Question", "name": "Can you supply furniture for government and council organisations?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We have worked with local government and public sector organisations across Australia. We understand procurement requirements, panel supplier arrangements, and compliance obligations specific to government fitout projects." } },
              { "@type": "Question", "name": "What areas of NSW do you deliver fitouts to?", "acceptedAnswer": { "@type": "Answer", "text": "We deliver across Newcastle, the Hunter Valley, Sydney, the Central Coast and regional NSW. We also work with commercial property clients across Australia for product supply regardless of location." } }
            ]
          }
        ]
      }) }} />
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-near-black"
        style={SEC}>
        <Image
          src="/images/furniture/space-wsi-openplan.jpg"
          alt="Modern office furniture Newcastle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/70" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Commercial Office Fit Out</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-6 sm:mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              Office Fit Out Newcastle —
              <br /><span className="text-teal">brief to delivered.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/80 font-light leading-relaxed max-w-2xl mb-8 sm:mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              We manage your furniture and fitout end to end — brief, specification, sourcing, delivery and install. Products are tailored to your timeline, budget and design intent. In-stock to made-to-order. One team, no gaps.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Get a Furniture Quote
              </Button>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-white font-bold border border-white/20 rounded-none px-6 py-3 no-underline hover:border-white/60 transition-colors"
                style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', letterSpacing: '0.02em' }}>
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {CONTACT.phone}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-warm-grey border-b border-gray-200"
        style={SEC_SM}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
              {[
                { stat: '200+', label: 'Fitouts delivered across Australia' },
                { stat: '1–2 weeks', label: 'Express delivery on in-stock items' },
                { stat: 'Fixed quote', label: 'No surprises — you approve before we start' },
                { stat: '1', label: 'Contact from brief to practical completion' }
              ].map((item) => (
                <div key={item.label} className="py-5 px-4 sm:py-8 sm:px-6 text-center">
                  <p className="text-near-black font-black text-2xl lg:text-3xl mb-2 leading-tight">{item.stat}</p>
                  <p className="text-mid-grey font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── SOCIAL PROOF STRIP ─────────────────────── */}
      <section style={SEC_SM} className="bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center justify-between">
              <div>
                <p className="text-white/30 font-light text-xs tracking-widest uppercase mb-2">Trusted by</p>
                <p className="text-white font-bold" style={{ fontSize: 'clamp(1rem,2vw,1.3rem)' }}>Government departments · Architects · Interior designers · Property developers</p>
              </div>
              <div className="flex-shrink-0 flex gap-6">
                {[
                  { stat: '200+', label: 'Fitouts delivered' },
                  { stat: '$0', label: 'Hidden charges' },
                  { stat: '1', label: 'Contact throughout' }
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <p className="text-teal font-black text-xl">{item.stat}</p>
                    <p className="text-white/40 font-light text-xs mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAST-TRACK CALLOUT ────────────────────────── */}
      <section className="bg-[#0D1117]" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">On a timeline?</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">
                  Fast-track your fitout.
                </h3>
                <p className="text-white/60 font-light leading-relaxed" style={{ fontSize: 'clamp(1rem,1.8vw,1.1rem)', lineHeight: 1.8 }}>
                  In-stock items dispatched within days. Made-to-order typically 3–6 weeks. If you're up against a lease end or a hard opening date, tell us — we'll map out what's possible and what it'll cost. No guesswork.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/resources/furniture-quote" variant="primary" size="lg">
                  Get a Fast-Track Quote →
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 3D DESIGN INCLUDED ────────────────────────── */}
      <section className="bg-warm-grey"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Before you commit</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              3D layout planning included. No extra charge.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
              Send us your floor plan and headcount. We design the layout in 3D before you commit to anything — so you can see how the space works, test different workstation configurations, and know exactly what you're getting before installation day.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Share your brief', body: "Floor plan, headcount, and a description of how your team works — that's all we need to get started." },
              { step: '02', title: 'We design your layout', body: 'We model your space in 3D and show you workstation positions, traffic flow, and common areas. You review and adjust before anything is ordered.' },
              { step: '03', title: 'Fixed quote. No surprises.', body: "Once the layout is locked, you get a fixed price. What you see in the 3D render is what turns up on installation day." }
            ].map((item) => (
              <FadeIn key={item.step} direction="up">
                <div className="bg-white rounded-xl p-7 border border-gray-100">
                  <p className="text-teal font-black text-4xl mb-4 leading-none">{item.step}</p>
                  <h3 className="text-near-black font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={100}>
            <div className="mt-10">
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Start with your floor plan →
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── IMAGE BREAK 1 ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(30rem,48vw,44rem)' }}>
        <Image src="/images/furniture/space-cogc-wide.jpg" alt="YOS project — contemporary commercial office fitout" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.45)' }} />
        <div className="absolute inset-0 flex items-end max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingBottom: 'clamp(2.5rem,6vw,5rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '20ch', marginBottom: '0.75rem' }}>
              Your workspace should feel like<br /><span style={{ color: '#00B5A5' }}>it was built for you.</span>
            </p>
            <p className="text-white/50 font-light" style={{ fontSize: '0.8rem', letterSpacing: '0.15em' }}>COMMERCIAL OFFICES — COGC — INSTALLED BY YOS</p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>What we supply</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Everything your workspace needs. Nothing it doesn&apos;t.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                category: 'Workstations & Desks',
                items: ['Sit-stand desks', 'Benching systems', 'Single and back-to-back workstations', 'Custom desk configurations', 'Cable management'],
                note: 'Designed for the way your team actually works.',
                image: '/images/furniture/strata360-sitstand.jpg',
                imageAlt: 'Height adjustable sit-stand desk'
              },
              {
                category: 'Seating',
                items: ['Ergonomic task chairs', 'Executive seating', 'Meeting and boardroom chairs', 'Visitor and reception seating', 'Breakout and lounge seating'],
                note: 'The right chair makes a measurable difference.',
                image: '/images/furniture/ergo-task-chair.png',
                imageAlt: 'Ergonomic task chair'
              },
              {
                category: 'Storage & Filing',
                items: ['Pedestal and mobile storage', 'Overhead lockers', 'Tall storage and shelving', 'Shared filing systems', 'Personal lockers'],
                note: 'Clean spaces start with proper storage.',
                image: '/images/furniture/nova-storage-tambour.jpg',
                imageAlt: 'Tambour storage unit with planters'
              },
              {
                category: 'Collaboration & Meeting',
                items: ['Boardroom and meeting tables', 'Collaborative workbenches', 'Breakout furniture', 'Phone booths and quiet pods', 'Presentation walls'],
                note: 'Spaces that make meetings worth having.',
                image: '/images/furniture/collaboration-tables.jpg',
                imageAlt: 'Collaboration and meeting furniture'
              }
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 70} direction="up">
                <div className="bg-warm-grey rounded-xl overflow-hidden h-full flex flex-col">
                  {/* Product image */}
                  <div className="relative overflow-hidden" style={{ height: '17rem' }}>
                    <Image src={cat.image} alt={cat.imageAlt} fill className="object-cover object-center" />
                    <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.18)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-white font-black text-lg tracking-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.category}</span>
                    </div>
                    <div className="absolute top-0 left-0 w-1" style={{ height: '100%', background: '#00B5A5' }} />
                  </div>
                  {/* Content */}
                  <div className="p-7 flex flex-col flex-1">
                    <ul className="space-y-2 mb-5 flex-1">
                      {cat.items.map((item, j) => (
                        <li key={j} className="text-charcoal font-light text-sm flex items-center gap-2">
                          <span className="text-teal font-bold" style={{ fontSize: '0.7rem' }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-mid-grey font-light text-xs border-t border-gray-200 pt-4">{cat.note}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSPIRATION GALLERY ──────────────────────────── */}
      <section style={SEC} className="bg-warm-grey">
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Inspiration</SectionLabel>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }} className="text-near-black font-bold leading-tight mt-3 mb-12 max-w-2xl">
              What a well-specified workspace looks like.
            </h2>
          </FadeIn>
          {/* 3×3 inspiration grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { src: '/images/furniture/space-wsi-openplan.jpg',       alt: 'Large open plan commercial office fitout',    label: 'Open Plan',       mood: 'Bright & Airy' },
              { src: '/images/furniture/space-cogc-wide.jpg',          alt: 'Contemporary government office fitout',               label: 'Corporate',       mood: 'Clean & Modern' },
              { src: '/images/furniture/space-pillowtalk-a.jpg',       alt: 'Vibrant contemporary office interior',                label: 'Collaborative',   mood: 'Warm & Energetic' },
              { src: '/images/furniture/space-bendigo-wide.jpg',       alt: 'Premium large scale commercial fitout',               label: 'Premium Fitout',  mood: 'Bold & Executive' },
              { src: '/images/furniture/space-liverpool-b.jpg',        alt: 'Civic place office with breakout zones',              label: 'Breakout Zones',  mood: 'Open & Social' },
              { src: '/images/furniture/space-pillowtalk-b.jpg',       alt: 'Bright modern commercial interior with lounge',       label: 'Reception & Lounge', mood: 'Inviting & Relaxed' },
              { src: '/images/furniture/space-cogc-office.jpg',        alt: 'Professional workstation layout',                     label: 'Workstations',    mood: 'Focused & Efficient' },
              { src: '/images/furniture/space-geelong-a.jpg',          alt: 'Contemporary Geelong office with natural light',      label: 'Natural Light',   mood: 'Fresh & Bright' },
              { src: '/images/furniture/space-liverpool-a.jpg',        alt: 'Civic office with collaborative layout',              label: 'Civic & Formal',  mood: 'Structured & Professional' },
            ].map((img, i) => (
              <FadeIn key={i} delay={Math.floor(i / 3) * 80 + (i % 3) * 60} direction="up">
                <div className="overflow-hidden rounded-xl aspect-[4/3] relative group cursor-pointer">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.1) 55%, transparent 100%)' }} />
                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white/50 font-light text-xs tracking-widest uppercase mb-1">{img.mood}</p>
                    <p className="text-white font-bold text-sm tracking-wide uppercase">{img.label}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-mid-grey font-light text-sm mt-6 leading-relaxed">
            Project photography supplied by our manufacturing and fitout partners. Every space is different — we work to yours.
          </p>
        </div>
      </section>

      {/* ─── IMAGE BREAK 2 ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(30rem,48vw,44rem)' }}>
        <Image src="/images/furniture/dbt-boardroom.jpg" alt="DBT boardroom — oval table, dark feature wall, installed by YOS" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.4)' }} />
        <div className="absolute inset-0 flex items-end max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingBottom: 'clamp(2.5rem,6vw,5rem)' }}>
          <FadeIn>
            <p className="text-white font-light italic" style={{ fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', maxWidth: '44rem', lineHeight: 1.75, borderLeft: '3px solid #00B5A5', paddingLeft: '1.5rem' }}>
              &ldquo;Joe was instrumental in building out our boardroom — high quality table, chairs, acoustic panelling. Practical advice, excellent detail.&rdquo;
              <br /><span className="text-teal font-semibold not-italic" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>— Nathan Franks, Dynamic Business Technologies</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="bg-near-black"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn direction="left">
            <div>
              <SectionLabel>Who we work with</SectionLabel>
              <h2 className="text-white font-bold leading-tight mt-3 mb-8"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,3rem)' }}>
                Private businesses, councils, schools, and health facilities across Australia.
              </h2>
              <p className="text-white/60 font-light leading-relaxed mb-12 max-w-2xl" style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                We work with organisations of all sizes — from 5-person professional services firms to multi-site government and health sector clients. The spec, the process, and the standard of work is the same regardless of project size.
              </p>
              <p className="text-white/60 font-light text-lg leading-relaxed max-w-2xl">
                Every project is managed by us from start to finish. You deal with one person. We coordinate the rest.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="flex flex-col gap-6">
              {[
                { label: 'Commercial offices', body: 'Private sector businesses of all sizes — from boutique professional services to multi-site operations.' },
                { label: 'Councils & government', body: 'Local government and public sector organisations across Australia.' },
                { label: 'Schools & education', body: 'Student furniture, staff workstations, staffrooms and learning spaces.' },
                { label: 'Health & community', body: 'Medical practices, NDIS environments, allied health and community facilities.' }
              ].map((item) => (
                <div key={item.label} className="pl-6 border-l-4 border-teal">
                  <p className="text-white font-bold text-base mb-1">{item.label}</p>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: "0.95rem", lineHeight: 1.8 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FITOUT PROCESS ──────────────────────────── */}
      <section className="bg-[#0D1117]" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>The fitout process</SectionLabel>
            <h2 className="text-white font-bold leading-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Brief → Design → Quote → Install. Transparent from start to finish.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Brief', body: "Tell us what you're trying to achieve. Floor plan, headcount, and how your team works. We start with your needs — not a product catalogue." },
              { step: '02', title: '3D Design', body: "We model your layout in 3D. You see exactly where workstations, meeting rooms, and breakout areas sit before anything is ordered. Adjustments are part of the process." },
              { step: '03', title: 'Fixed Quote', body: 'You get a fixed price based on the approved layout. Deposit structure to suit your cash flow. No surprises, no hidden line items.' },
              { step: '04', title: 'Install', body: "We manage delivery and installation. One team on site, one point of contact throughout. Your team walks in to a ready workspace." }
            ].map((step, i) => (
              <FadeIn key={step.step} delay={i * 80} direction="up">
                <div className="flex flex-col gap-4">
                  <p className="text-teal font-black text-4xl sm:text-5xl leading-none">{step.step}</p>
                  <h3 className="text-white font-bold text-xl">{step.title}</h3>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={100}>
            <div className="mt-10">
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Request a Fitout Quote →
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* BUNDLE CALLOUT — cross-sell to cleaning */}
      <section className="bg-white"
        style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="bg-near-black rounded-xl p-7 sm:p-10 lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">Bundle &amp; Save</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">
                  Fitout + cleaning. One team. Zero gaps.
                </h3>
                <p className="text-white/60 font-light text-base leading-relaxed">
                  Our cleaning division handles the post-construction deep clean and ongoing maintenance after every fitout. You don&apos;t coordinate two contractors — we handle it end to end.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/cleaning" variant="primary" size="lg">
                  Learn about Cleaning →
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* INLINE QUOTE FORM */}
      <section className="bg-near-black" style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">Get a Quote</p>
                <h2 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                  Tell us about your project.
                </h2>
                <p className="text-white/60 font-light leading-relaxed mb-8" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}>
                  Send us your floor plan and headcount and we’ll put together a full specification and quote.
                  We deliver across Newcastle, the Hunter Valley and regional NSW.
                </p>
                <div className="flex flex-col gap-3 text-white/60 text-sm">
                  {[
                    "Floor plan or rough dimensions",
                    "Headcount and workstation requirements",
                    "Meeting rooms, breakout, storage needs",
                    "Timeline and budget guidance",
                    "In-stock to made-to-order options"
                  ].map(s => (
                    <span key={s} className="flex items-center gap-2"><span className="text-teal font-bold">✓</span>{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-warm-grey rounded-xl p-7 sm:p-10">
                <HubSpotForm formId="188fd0e9-44a0-4ed1-ab94-da26126fcc9e" targetId="furniture-quote-form" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <FurniturePopup />
      <BookingCTA label="Book a Free Consultation" />
      <Footer />
    </>
  )
}
