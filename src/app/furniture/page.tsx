import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { CheckIcon } from '@/components/Icons'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import BookingCTA from '@/components/BookingCTA'
import HubSpotForm from '@/components/HubSpotForm'

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export const metadata = {
  title: 'Commercial Office Furniture Newcastle | Burgtec, Rapidline & Commercial Brands | Your Office Space',
  description: 'Commercial office furniture across Newcastle and NSW. Burgtec workstations and seating, Rapidline commercial range, Nova storage and more. Express delivery available. Brief to delivered.',
  alternates: { canonical: 'https://www.yourofficespace.au/furniture' },
  twitter: { card: 'summary_large_image', title: 'Commercial Office Furniture Newcastle | Your Office Space', description: 'Burgtec, Rapidline and commercial furniture brands. Supply and install across Newcastle and NSW. Express delivery available.' },
  openGraph: {
    title: 'Commercial Office Furniture Newcastle | Your Office Space',
    description: 'Burgtec workstations and seating, Rapidline commercial range, Nova storage — supply and install across Newcastle and NSW.',
    url: 'https://www.yourofficespace.au/furniture',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Commercial Office Furniture Newcastle — Your Office Space' }],
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
            "description": "Commercial office furniture supply and installation. Burgtec, Rapidline, and commercial brands. Based in Newcastle, working across NSW.",
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
            "name": "Commercial Office Furniture Newcastle",
            "provider": { "@id": "https://www.yourofficespace.au/#organization" },
            "description": "Commercial office furniture supply and installation. Burgtec workstations and seating, Rapidline commercial range, Nova storage, meeting tables, ergonomic seating. Supply and install across Newcastle and NSW.",
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ],
            "serviceType": "Commercial Office Furniture",
            "url": "https://www.yourofficespace.au/furniture"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What brands of commercial office furniture do you supply?", "acceptedAnswer": { "@type": "Answer", "text": "We supply Burgtec, Rapidline, Nova Storage, and a range of commercial-grade brands covering workstations, seating, meeting tables, storage and breakout furniture. We match the product to your spec and timeline — not to a limited product list." } },
              { "@type": "Question", "name": "How much does commercial office furniture cost in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Commercial workstation pricing starts from $400 per desk for standard range, $800–$1,500 for sit-stand, and $1,500+ for premium ergonomic systems. Task chairs start from $200. We provide itemised quotes based on your headcount and specification." } },
              { "@type": "Question", "name": "Do you offer express delivery on office furniture?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our in-stock range — Burgtec seating, standard workstations, and storage — ships within 1–2 weeks across Newcastle and NSW. Made-to-order items typically run 3–6 weeks. Lead times are confirmed before you commit." } },
              { "@type": "Question", "name": "Can I buy office furniture online through YOS?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our online shop at yos-furniture.myshopify.com stocks the express range for direct purchase. For full project quotes including delivery and installation, use our quote form or call us directly." } },
              { "@type": "Question", "name": "Do you install the furniture as well as supply it?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We supply and install on every project. Your team walks in to a fully installed workspace. We do not leave until it is right." } },
              { "@type": "Question", "name": "Can you supply furniture for government and council organisations?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We have supplied councils, government departments, schools and health facilities across NSW. We understand procurement requirements and compliance obligations." } },
              { "@type": "Question", "name": "Do you offer 3D layout planning with furniture quotes?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Send us your floor plan and headcount and we design the workstation layout in 3D before you commit. No charge. No guesswork." } },
              { "@type": "Question", "name": "What areas of NSW do you deliver office furniture to?", "acceptedAnswer": { "@type": "Answer", "text": "We deliver and install across Newcastle, the Hunter Valley, Sydney, the Central Coast and regional NSW. Australia-wide for product supply." } }
            ]
          }
        ]
      }) }} />

      <Nav />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black" style={SEC}>
        <Image
          src="/images/furniture/burgtec-room4.jpg"
          alt="Burgtec workstation fitout — modern commercial office Newcastle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/65" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Office Furniture — Supply &amp; Install</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              Commercial Office Furniture Newcastle —
              <br /><span className="text-teal">Burgtec, Rapidline &amp; commercial brands.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/80 font-light leading-relaxed max-w-2xl mb-8"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              Burgtec workstations and seating. Rapidline commercial range. Nova storage systems. Supply and install across Newcastle and NSW — with express delivery on in-stock range.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Get a Quote
              </Button>
              <a href="https://yos-furniture.myshopify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-bold border border-white/20 rounded-none no-underline hover:border-white/60 transition-colors"
                style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', letterSpacing: '0.02em', padding: '1.1rem 3rem' }}>
                Shop Online
                <svg style={{ width: '0.85rem', height: '0.85rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── BRANDS BAR ─────────────────────────────── */}
      <section className="bg-warm-grey border-b border-gray-200" style={SEC_SM}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
              {[
                { stat: 'Burgtec', label: 'Workstations & seating — est. 1981, Central Coast NSW' },
                { stat: 'Rapidline', label: 'Commercial desking & storage systems' },
                { stat: 'Nova Storage', label: 'Modular storage by Burgtec' },
                { stat: '1–2 weeks', label: 'Express delivery on in-stock range' }
              ].map((item) => (
                <div key={item.label} className="py-5 px-4 sm:py-8 sm:px-6 text-center">
                  <p className="text-near-black font-black text-2xl lg:text-3xl mb-1 leading-tight">{item.stat}</p>
                  <p className="text-mid-grey font-light text-xs leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── BRAND SPOTLIGHT: BURGTEC ───────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={PAD}>
          <FadeIn direction="left">
            <div>
              <SectionLabel>Brand Spotlight</SectionLabel>
              <h2 className="text-white font-bold leading-tight mt-3 mb-6"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,3rem)' }}>
                Burgtec — commercial furniture built to last.
              </h2>
              <p className="text-white/60 font-light leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                Burgtec has been designing and manufacturing commercial furniture in Australia since 1981. Based on the Central Coast of NSW, they supply workstations, seating, and storage to workplaces, government, education, and healthcare environments across the country.
              </p>
              <p className="text-white/60 font-light leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                Burgtec furniture is built for commercial use — high-density environments where furniture needs to perform year after year. Powder-coated steel frames, commercial-grade laminates, and configurable systems that adapt as organisations change.
              </p>
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Request Burgtec Quote →
              </Button>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="grid grid-cols-2 gap-4">
              <Image src="/images/furniture/burgtec-hero-desk.jpg" alt="Burgtec workstation — height adjustable commercial desk Newcastle" fill className="object-cover rounded-xl aspect-square" />
              <Image src="/images/furniture/nova-storage-tambour.jpg" alt="Nova Storage by Burgtec — modular tambour storage Newcastle" fill className="object-cover rounded-xl aspect-square" />
              <Image src="/images/furniture/space-cogc-wide.jpg" alt="City of Gold Coast Council — Burgtec furniture installed by YOS" fill className="object-cover rounded-xl aspect-square" />
              <Image src="/images/furniture/space-wsi-openplan.jpg" alt="Western Sydney International Airport — Burgtec public space furniture" fill className="object-cover rounded-xl aspect-square" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── BRAND SPOTLIGHT: RAPIDLINE ──────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={PAD}>
          <FadeIn direction="right">
            <div>
              <SectionLabel>Brand Spotlight</SectionLabel>
              <h2 className="text-near-black font-bold leading-tight mt-3 mb-6"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,3rem)' }}>
                Rapidline — commercial desking built for the real world.
              </h2>
              <p className="text-charcoal font-light leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                Rapidline is one of Australia&apos;s most widely specified commercial furniture ranges. Desking systems, storage, and meeting tables trusted by councils, government departments, schools, and private sector organisations across NSW.
              </p>
              <p className="text-charcoal font-light leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                Rapidline is specified because it works: consistent quality, competitive pricing, fast availability, and a range that covers everything from a 5-person office to a multi-site government rollout.
              </p>
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Request Rapidline Quote →
              </Button>
            </div>
          </FadeIn>
          <FadeIn direction="left">
            <div className="relative rounded-xl overflow-hidden" style={{ height: 'clamp(22rem, 35vw, 32rem)' }}>
              <Image src="/images/furniture/space-cogc-office.jpg" alt="Rapidline desking — commercial office installation Newcastle" fill className="object-cover object-center" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── PRODUCT CATEGORIES ──────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>What we supply</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Every category. Every configuration. Commercially rated.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                category: 'Workstations & Desks',
                brandNote: 'Burgtec + Rapidline',
                items: ['Sit-stand desks', 'Benching systems', 'Single and back-to-back workstations', 'Custom desk configurations', 'Cable management', 'Height-adjustable (EHA) systems'],
                image: '/images/furniture/burgtec-hero-desk.jpg',
                imageAlt: 'Burgtec height adjustable commercial workstation Newcastle'
              },
              {
                category: 'Seating',
                brandNote: 'Burgtec + commercial ergonomic brands',
                items: ['Ergonomic task chairs', 'Executive seating', 'Meeting and boardroom chairs', 'Visitor and reception seating', 'Breakout and lounge seating', 'Healthcare-grade seating'],
                image: '/images/furniture/ergo-task-chair.png',
                imageAlt: 'Commercial ergonomic task chair Newcastle'
              },
              {
                category: 'Storage & Filing',
                brandNote: 'Nova Storage (Burgtec) + Rapidline',
                items: ['Pedestal and mobile storage', 'Tambour storage units', 'Tall storage and shelving', 'Personal lockers', 'Filing systems', 'Modular storage configurations'],
                image: '/images/furniture/nova-storage-tambour.jpg',
                imageAlt: 'Nova Storage tambour unit — commercial storage Newcastle'
              },
              {
                category: 'Collaboration & Meeting',
                brandNote: 'Burgtec + commercial range',
                items: ['Boardroom and meeting tables', 'Collaborative workbenches', 'Breakout furniture', 'Phone booths and quiet pods', 'Reception and lobby furniture', 'Presentation walls'],
                image: '/images/furniture/collaboration-tables.jpg',
                imageAlt: 'Commercial collaboration and meeting furniture Newcastle'
              }
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 70} direction="up">
                <div className="bg-warm-grey rounded-xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative overflow-hidden" style={{ height: 'clamp(14rem, 22vw, 20rem)' }}>
                    <Image src={cat.image} alt={cat.imageAlt} fill className="object-cover object-center" />
                    <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.18)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-white font-black text-lg tracking-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.category}</span>
                      <p className="text-white/70 text-xs mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.brandNote}</p>
                    </div>
                    <div className="absolute top-0 left-0" style={{ height: '100%', background: '#00B5A5', width: '6px' }} />
                  </div>
                  <div className="p-8 sm:p-10 flex flex-col flex-1">
                    <ul className="space-y-3 mb-5 flex-1">
                      {cat.items.map((item, j) => (
                        <li key={j} className="text-charcoal font-light text-sm flex items-center gap-2">
                          <span className="text-teal font-bold" style={{ fontSize: '0.7rem' }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
              <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: 'clamp(0.9rem,1.5vw,1.05rem)' }}>
                Need something specific? Tell us your headcount and workspace requirements — we will put together options across brands and configurations.
              </p>
              <Button href="/resources/furniture-quote" variant="primary" size="md">
                Request a Quote →
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── INSPIRATION GALLERY ─────────────────────── */}
      <section style={SEC} className="bg-warm-grey">
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Inspiration</SectionLabel>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }} className="text-near-black font-bold leading-tight mt-3 mb-12 max-w-2xl">
              What a well-specified workspace looks like.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { src: '/images/furniture/space-wsi-openplan.jpg',       alt: 'Western Sydney International Airport — Burgtec workstations installed by YOS',  label: 'Open Plan',       mood: 'Bright & Airy' },
              { src: '/images/furniture/space-cogc-wide.jpg',          alt: 'City of Gold Coast Council — commercial office fitout by YOS',                  label: 'Corporate',       mood: 'Clean & Modern' },
              { src: '/images/furniture/space-pillowtalk-a.jpg',       alt: 'Vibrant contemporary commercial office interior Newcastle',                        label: 'Collaborative',   mood: 'Warm & Energetic' },
              { src: '/images/furniture/space-bendigo-wide.jpg',       alt: 'Bendigo GovHub — commercial furniture installation by YOS',                      label: 'Premium Fitout',  mood: 'Bold & Executive' },
              { src: '/images/furniture/space-liverpool-b.jpg',        alt: 'Civic office with breakout zones — commercial furniture Newcastle',              label: 'Breakout Zones',  mood: 'Open & Social' },
              { src: '/images/furniture/space-pillowtalk-b.jpg',       alt: 'Modern commercial interior with lounge and reception furniture Newcastle',         label: 'Reception',       mood: 'Inviting & Relaxed' },
              { src: '/images/furniture/space-cogc-office.jpg',         alt: 'Rapidline desking — professional commercial workstation layout Newcastle',         label: 'Workstations',    mood: 'Focused & Efficient' },
              { src: '/images/furniture/space-geelong-a.jpg',          alt: 'Contemporary commercial office with natural light — Newcastle',                    label: 'Natural Light',   mood: 'Fresh & Bright' },
              { src: '/images/furniture/space-liverpool-a.jpg',       alt: 'Civic office — formal commercial workspace furniture installation Newcastle',        label: 'Civic & Formal',  mood: 'Structured' },
            ].map((img, i) => (
              <FadeIn key={i} delay={Math.floor(i / 3) * 80 + (i % 3) * 60} direction="up">
                <div className="overflow-hidden rounded-xl aspect-[4/3] relative group cursor-pointer">
                  <Image src={img.src} alt={img.alt} fill className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.1) 55%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/50 font-light text-xs tracking-widest uppercase mb-1">{img.mood}</p>
                    <p className="text-white font-bold text-sm tracking-wide uppercase">{img.label}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-mid-grey font-light text-sm mt-6 leading-relaxed">
            Photography: YOS installations. Every space is different — we work to yours.
          </p>
        </div>
      </section>

      {/* ─── WHY BUY THROUGH YOS ────────────────────── */}
      <section className="bg-[#0D1117]" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Why buy through YOS</SectionLabel>
            <h2 className="text-white font-bold leading-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Not just a supplier — a team that sees the job through.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: 'Fast delivery available',
                body: 'In-stock items dispatched within days. Made-to-order typically 3–6 weeks. Lead times confirmed before you commit.'
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
                title: '3D layout planning',
                body: 'Send us your floor plan and headcount. We plan the layout in 3D before you commit — no guesswork, no surprises on installation day.'
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                title: 'Supply + install',
                body: "We do not just deliver to the loading dock. We install, position, and check everything — your team walks in to a finished workspace."
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
                title: 'Custom configurations',
                body: "Burgtec and Rapidline are fully configurable. We tailor finishes, sizes, and layouts to your space and brand — not the standard catalogue option."
              },
              {
                icon: <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
                title: 'Flexible payment',
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
        </div>
      </section>

      {/* ─── TESTIMONIAL ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(20rem,30vw,26rem)' }}>
        <Image src="/images/furniture/dbt-boardroom.jpg" alt="DBT boardroom — Burgtec table, chairs, acoustic panelling, installed" fill className="object-cover object-center" />
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

      {/* ─── BRAND TRUST ─────────────────────────────── */}
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

      {/* ─── BUNDLE CALLOUT ───────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="bg-near-black rounded-xl p-7 sm:p-10 lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">Bundle &amp; Save</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">
                  Furniture + fitout + cleaning. One team.
                </h3>
                <p className="text-white/60 font-light text-base leading-relaxed">
                  We handle the furniture, the fitout management, and the post-construction clean. One briefing. One team. Zero gaps between contractors.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-3">
                <Button href="/office-fitout" variant="primary" size="lg">
                  See Fitout Services →
                </Button>
                <Button href="/cleaning" variant="primary" size="lg">
                  See Cleaning →
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── QUOTE FORM ───────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">Get a Quote</p>
                <h2 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                  Tell us what you need.
                </h2>
                <p className="text-white/60 font-light leading-relaxed mb-8" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}>
                  Itemised quotes for furniture supply, or full project quotes including delivery and installation across Newcastle and NSW.
                </p>
                <div className="flex flex-col gap-3 text-white/60 text-sm">
                  {[
                    "Floor plan or rough dimensions",
                    "Headcount and workstation requirements",
                    "Preferred brands or finishes",
                    "Timeline and budget guidance",
                    "In-stock or made-to-order preference"
                  ].map(s => (
                    <span key={s} className="flex items-center gap-2"><CheckIcon />{s}</span>
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

      <BookingCTA label="Book a Free Consultation" />
      <Footer />
    </>
  )
}
