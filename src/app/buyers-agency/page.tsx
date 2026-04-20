import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Commercial Buyers Agency | Your Office Space',
  description: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers across Australia.'
}

export default function BuyersAgencyPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-0 bg-near-black"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial building"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/82" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn delay={0}>
            <SectionLabel>Commercial Buyers Agency</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-6 sm:mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              Buy commercial property{' '}
              <span className="text-teal">without getting burned.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-8 sm:mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              Off-market access, rigorous due diligence, and hard negotiations — handled by someone who does this every day.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
              Book a Buyer Consultation
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-teal py-8 sm:py-12 lg:py-16"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                { stat: '$0', label: 'Vendor-side fees — ever' },
                { stat: '60%+', label: 'Of our deals are off-market' },
                { stat: '12+', label: 'Years of commercial market experience' },
                { stat: '100%', label: 'Buyer-only representation' }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-white font-black text-3xl sm:text-4xl lg:text-5xl mb-2 leading-none">{item.stat}</p>
                  <p className="text-white/75 font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHO WE HELP */}
      {/* ─── IMAGE BREAK ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(18rem,35vw,28rem)' }}>
        <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80" alt="Commercial property" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.52)' }} />
        <div className="absolute inset-0 flex items-center max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '22ch' }}>
            Buy with confidence. Buy without risk.
          </p>
        </div>
      </section>

      <section className="bg-white"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <SectionLabel>Who we help</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mb-10 sm:mb-8 md:mb-16 lg:mb-10 md:mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              First-time commercial buyers to seasoned investors.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Business owners',
                body: "Buying your own premises is one of the best moves a business can make. We help you find the right property, at the right price, in the right location — and structure the deal to protect you long-term.",
                tag: 'Own your space'
              },
              {
                title: 'Property investors',
                body: "Commercial yields beat residential in most Newcastle submarkets right now. We find the properties that don't make it to the listing portals and negotiate from a position of genuine market knowledge.",
                tag: 'Build wealth'
              },
              {
                title: 'SMSF buyers',
                body: "Buying commercial property inside a self-managed super fund is increasingly popular in the Hunter. We work alongside your accountant to source and acquire the right asset within the right structure.",
                tag: 'Structure it right'
              }
            ].map((item) => (
              <FadeIn key={item.title} direction="up">
                <div className="border-t-4 border-teal pt-6 h-full flex flex-col">
                  <span className="inline-block text-teal text-xs font-bold tracking-widest uppercase mb-3">{item.tag}</span>
                  <h3 className="text-near-black font-bold text-2xl mb-4">{item.title}</h3>
                  <p className="text-charcoal font-light leading-relaxed flex-1" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-near-black"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <SectionLabel>What we do</SectionLabel>
            <h2 className="text-white font-bold leading-tight tracking-tight mb-10 sm:mb-8 md:mb-16 lg:mb-10 md:mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Every step of the acquisition. Done properly.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { label: 'Market analysis', body: 'We map the Newcastle and Hunter Valley commercial market — active listings, recent sales, off-market opportunities, and emerging precincts you should know about.' },
              { label: 'Off-market sourcing', body: "Most good commercial properties never hit the portals. Our network of local agents, owners, and developers gives us access to stock that other buyers don't see." },
              { label: 'Due diligence', body: 'Zoning, DA history, tenancy review, building condition, contamination risk — we go through every layer before you commit a dollar.' },
              { label: 'Price negotiation', body: "We know what things are worth in this market. We negotiate hard on price, terms, and conditions — without emotion, without ego, without compromise." },
              { label: 'Contract review coordination', body: 'We coordinate with your solicitor and conveyancer to ensure the contract protects your interests and that nothing slips through.' },
              { label: 'Settlement support', body: "We stay involved through to settlement. If issues arise — and they sometimes do — we're in your corner to resolve them quickly." }
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 60} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="pl-6 border-l-4 border-teal py-2">
                  <p className="text-white font-bold text-lg mb-2">{item.label}</p>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET SNAPSHOT */}
      <section className="bg-warm-grey"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <SectionLabel>Newcastle market right now</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-10 sm:mb-7 md:mb-14 lg:mb-8 md:mb-16 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Why commercial in the Hunter is the move.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 sm:mb-8 md:mb-16">
            {[
              {
                figure: '5.5–7.5%',
                label: 'Commercial yields',
                context: 'vs. 3–4% in Sydney. Quality assets with strong tenants are still achievable at numbers that make sense.'
              },
              {
                figure: '$420–$680',
                label: 'CBD office rent per sqm/pa',
                context: 'Still well below Sydney metro, with improving tenant demand and constrained new supply in the pipeline.'
              },
              {
                figure: '92%+',
                label: 'Industrial occupancy Hunter',
                context: 'Industrial vacancy is near historic lows. Well-located sheds and warehouses continue to see strong rental growth.'
              },
              {
                figure: '60%+',
                label: 'Off-market deal share',
                context: 'The best properties in Newcastle rarely make it to listing portals. Network access is everything.'
              }
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 70} direction="up">
                <div className="bg-white rounded-sm p-8 shadow-sm">
                  <p className="text-teal font-black text-4xl mb-1 leading-none">{item.figure}</p>
                  <p className="text-near-black font-bold text-base mb-3">{item.label}</p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>{item.context}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY YOS */}
      <section className="bg-near-black"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <SectionLabel>Why YOS</SectionLabel>
            <h2 className="text-white font-bold leading-tight mb-7 sm:mb-10"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Local knowledge. No conflicts.
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-white/60 font-light text-xl leading-relaxed mb-8">
              Most buyers agents claim to know your market. We actually live and operate in it. We&apos;ve done deals across the Newcastle CBD, Broadmeadow, Kotara, Maitland, and the broader Hunter Valley. We know which vendors are motivated, which agents play fair, and where the real opportunities sit right now.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="border-l-4 border-teal pl-8 py-4">
              <p className="text-white font-light text-xl leading-relaxed">
                We are never paid by vendors. Never paid by agents. Our fee comes from you, which means our job — our only job — is to get you the best possible outcome.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal text-center"
        style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <h2 className="text-white font-bold leading-tight mb-5 sm:mb-6"
              style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)' }}>
              Ready to buy smart?
            </h2>
            <p className="text-white/80 font-light text-lg leading-relaxed mb-8 sm:mb-12">
              Tell us what you&apos;re looking for. We&apos;ll tell you what&apos;s out there and what it would take to get it.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
              Book a Buyer Consultation
            </Button>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  )
}
