import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import FurniturePopup from '@/components/FurniturePopup'

export const metadata = {
  title: 'Office Furniture & Fitout | Your Office Space',
  description: 'Office furniture and fitout project management across Australia. In-stock express range to made-to-order — tailored to your timeline, budget and design intent.',
  openGraph: {
    title: 'Office Furniture & Fitout | Your Office Space',
    description: 'Brief to delivered. Office furniture and fitout project management — end to end. One team, no gaps.',
    url: 'https://yourofficespace.au/furniture',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function FurniturePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-near-black"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <Image
          src="/images/furniture/burgtec-room4.jpg"
          alt="Modern office furniture Newcastle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/82" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn delay={0}>
            <SectionLabel>Office Furniture &amp; Fitout</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-6 sm:mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              Your office is a business decision.{' '}
              <span className="text-teal">Treat it like one.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-8 sm:mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              We manage your furniture and fitout end to end — brief, specification, sourcing, delivery and install. Products are tailored to your timeline, budget and design intent. In-stock to made-to-order. One team, no gaps.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Button href="/resources/furniture-quote" variant="primary" size="lg">
              Get a Furniture Quote
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-warm-grey border-b border-gray-200"
        style={{ paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
              {[
                { stat: '200+', label: 'Projects delivered' },
                { stat: 'In stock to 6 weeks', label: 'Express range or made to order' },
                { stat: '$0', label: 'Hidden charges or surprises' },
                { stat: '1', label: 'Point of contact, start to finish' }
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

      {/* WHAT WE SUPPLY */}
      {/* ─── IMAGE BREAK ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(20rem,38vw,32rem)' }}>
        <Image src="/images/furniture/burgtec-open-plan.jpg" alt="Modern commercial office fitout" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.52)' }} />
        <div className="absolute inset-0">
          <div className="h-full max-w-screen-xl mx-auto flex items-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '22ch' }}>
              From brief to delivered workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
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
                image: '/images/furniture/collaboration-tables.png',
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
      <section style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }} className="bg-warm-grey">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <SectionLabel>Inspiration</SectionLabel>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }} className="text-near-black font-bold leading-tight mt-3 mb-12 max-w-2xl">
              What a well-specified workspace looks like.
            </h2>
          </FadeIn>
          {/* 3×3 inspiration grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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

      {/* WHO WE WORK WITH */}
      <section className="bg-near-black"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
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
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              From brief to delivered. No hassle.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
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

      {/* CTA */}
      <section className="bg-near-black"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <h2 className="text-white font-bold leading-tight mb-5 w-full"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)' }}>
                Ready to kit out your space?
              </h2>
              <p className="text-white/55 font-light text-lg leading-relaxed mb-10 w-full">
                Send us your floor plan, tell us your headcount, and we&apos;ll put together a specification and quote.
              </p>
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Get a Furniture Quote
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      <FurniturePopup />
      <Footer />
    </>
  )
}
