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
  title: 'Office Furniture & Fitout | Your Office Space',
  description: 'Office furniture and fitout project management across Australia. Express in-stock range to made-to-order — tailored to your timeline, budget and design intent.',
  twitter: { card: 'summary_large_image', title: 'Office Furniture & Fitout | Your Office Space', description: 'Brief to delivered. Office furniture and fitout — one team, end to end. Express to made-to-order.' },
  alternates: { canonical: 'https://www.yourofficespace.au/furniture' },
  openGraph: {
    title: 'Office Furniture & Fitout | Your Office Space',
    description: 'Brief to delivered. Office furniture and fitout project management — end to end. One team, no gaps.',
    url: 'https://yourofficespace.au/furniture',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Office Furniture & Fitout — Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function FurniturePage() {
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
            "@id": "https://www.yourofficespace.au/furniture#service",
            "name": "Office Furniture & Fitout Newcastle",
            "provider": { "@id": "https://www.yourofficespace.au/#organization" },
            "description": "Office furniture supply and fitout project management. From brief to installed workspace — workstations, seating, meeting rooms, breakout zones.",
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ],
            "serviceType": "Office Furniture and Fitout",
            "url": "https://www.yourofficespace.au/furniture"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How much does an office fitout cost in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Office fitout costs in Newcastle range from $600–$1,200/sqm for basic, $1,200–$2,000/sqm for mid-range, and $2,000+/sqm for premium. Per workstation, budget $500–$3,500 depending on finish level. Use the free Your Office Space fitout estimator for a detailed budget based on your brief." } },
              { "@type": "Question", "name": "How long does a commercial office fitout take?", "acceptedAnswer": { "@type": "Answer", "text": "A basic furniture-only fitout delivers in 2–4 weeks. A full commercial fitout including construction, joinery, electrical and AV typically takes 6–16 weeks depending on scope. Your Office Space manages the entire process end-to-end." } },
              { "@type": "Question", "name": "Do you supply Rapidline and Burgtec furniture?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Your Office Space supplies the full Rapidline commercial furniture range and Burgtec seating, along with other commercial brands. We also have an online shop at yos-furniture.myshopify.com for express orders." } },
              { "@type": "Question", "name": "What brands of commercial office furniture do you supply?", "acceptedAnswer": { "@type": "Answer", "text": "We supply Rapidline, Burgtec, and a range of commercial brands covering workstations, seating, meeting tables, storage, and breakout furniture. We match the product to your spec, timeline and budget — not to a limited product list." } },
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
          src="/images/furniture/burgtec-room4.jpg"
          alt="Modern office furniture Newcastle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/70" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Office Furniture &amp; Fitout</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-6 sm:mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              Office Furniture &amp; Fitout Newcastle —
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
              <a href="/resources/fitout-estimator"
                className="inline-flex items-center gap-2 text-white font-bold border border-white/20 rounded-none no-underline hover:border-white/60 transition-colors"
                style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', letterSpacing: '0.02em', padding: '1.1rem 3rem' }}>
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Fit Out Cost Estimator
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
                { stat: '200+', label: 'Projects delivered across Australia' },
                { stat: '1–2 weeks', label: 'Express delivery on in-stock range' },
                { stat: '3D layout', label: 'Planning service at no extra cost' },
                { stat: '$0', label: 'Hidden charges or surprises' }
              ].map((item) => (
                <div key={item.label} className="py-5 px-4 sm:py-8 sm:px-6 text-center">
                  <p className="text-near-black font-black text-3xl lg:text-4xl mb-2 leading-tight">{item.stat}</p>
                  <p className="text-mid-grey font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
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
                image: '/images/furniture/burgtec-hero-desk.jpg',
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
                <div className="bg-warm-grey rounded-xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Product image */}
                  <div className="relative overflow-hidden" style={{ height: 'clamp(14rem, 22vw, 20rem)' }}>
                    <Image src={cat.image} alt={cat.imageAlt} fill className="object-cover object-center" />
                    <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.18)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-white font-black text-lg tracking-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.category}</span>
                    </div>
                    <div className="absolute top-0 left-0 w-1" style={{ height: '100%', background: '#00B5A5', width: '6px' }} />
                  </div>
                  {/* Content */}
                  <div className="p-8 sm:p-10 flex flex-col flex-1">
                    <ul className="space-y-3 mb-5 flex-1">
                      {cat.items.map((item, j) => (
                        <li key={j} className="text-charcoal font-light text-sm flex items-center gap-2">
                          <span className="text-teal font-bold" style={{ fontSize: '0.7rem' }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-mid-grey font-light text-xs border-t border-white/10 pt-5 mt-4">{cat.note}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {/* Inline CTA strip */}
          <FadeIn>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
              <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: 'clamp(0.9rem,1.5vw,1.05rem)' }}>
                Not sure what you need? Tell us your headcount and we'll put together options.
              </p>
              <Button href="/resources/furniture-quote" variant="primary" size="md">
                Request a Quote →
              </Button>
            </div>
          </FadeIn>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { src: '/images/furniture/space-wsi-openplan.jpg',       alt: 'Large open plan office with Burgtec workstations',    label: 'Open Plan',       mood: 'Bright & Airy' },
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
                <div className="overflow-hidden rounded-xl aspect-[4/3] relative group cursor-pointer group-hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.1) 55%, transparent 100%)' }} />
                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
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

      {/* ─── WHY WORK WITH US ──────────────────────── */}
      <section className="bg-[#0D1117]" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Why work with YOS</SectionLabel>
            <h2 className="text-white font-bold leading-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Not just a supplier — a partner who sees it through.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: 'Fast delivery available',
                body: "In-stock items dispatched in days. Made-to-order typically 3–6 weeks. If you're on a tight timeline, tell us up front — we'll find a way."
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
                title: 'Custom finishes & configurations',
                body: "We tailor products to match your brand, your space, and your budget. Not limited to what's on the shelf — we work to your brief."
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
                title: '3D layout planning',
                body: 'Send us your floor plan and headcount. We plan the layout before you commit — no guesswork, no surprises on install day.'
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                title: 'Trusted across NSW',
                body: "We've worked with councils, schools, health facilities and businesses of all sizes across New South Wales. References available on request."
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
                title: 'Flexible payment terms',
                body: 'Deposit structure to suit your cash flow. Account options available for repeat clients and ongoing relationships.'
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                title: 'One contact, start to finish',
                body: 'Same person from brief to install. We coordinate delivery, installation, and any issues. You focus on your business.'
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="flex gap-4 p-7 sm:p-8">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#00B5A5', color: '#0D1117' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.75 }}>{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={100}>
            <div className="mt-10">
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Request a Quote →
              </Button>
            </div>
          </FadeIn>
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

      {/* ─── BRAND TRUST BAR ──────────────────────────── */}
      <section style={SEC_SM} className="bg-[#0D1117] border-y border-white/5">
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <p className="text-white/30 font-light text-xs tracking-widest uppercase text-center mb-8">Trusted by organisations across NSW</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-40">
              {['Local Councils', 'Schools & Universities', 'Health Facilities', 'Professional Services', 'Government Bodies'].map(name => (
                <span key={name} className="text-white font-bold text-sm tracking-wide uppercase" style={{ fontSize: '0.8rem' }}>{name}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="bg-near-black"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={PAD}>
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
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-warm-grey"
        style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              From brief to delivered. No hassle.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Brief', body: "Tell us what you're trying to achieve. New fitout, partial refresh, or just some new chairs — we start with your needs, not a catalogue." },
              { step: '02', title: 'Spec & Quote', body: 'We prepare a specification and quote based on your space, your people, and your budget. No surprises.' },
              { step: '03', title: 'Source & Deliver', body: 'We match products to your timeline. In-stock express range ships in 1–2 weeks. Made-to-order items typically run 3–6 weeks. Lead times are confirmed before you commit.' },
              { step: '04', title: 'Deliver & Install', body: "We deliver and install. Your team walks in to a ready workspace. We don't leave until it's right." }
            ].map((step, i) => (
              <FadeIn key={step.step} delay={i * 80} direction="up">
                <div>
                  <p className="text-teal font-black text-4xl sm:text-5xl mb-4 leading-none">{step.step}</p>
                  <h3 className="text-near-black font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: "0.95rem", lineHeight: 1.8 }}>{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
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
                  Learn about Cleaning
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
