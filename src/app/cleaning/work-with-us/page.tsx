import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SalesCareersForm from './SalesCareersForm'
import RoleSwitcher from './RoleSwitcher'
import { BroomIcon, ChairIcon, HandshakeIcon, CheckIcon } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'Commission Sales Partners | Your Office Space',
  description: 'Earn serious commission selling commercial cleaning and office furniture in Newcastle and the Hunter Valley. No base, no cap — just results.',
  alternates: { canonical: 'https://www.yourofficespace.au/cleaning/work-with-us' },
  robots: { index: true, follow: true },
  openGraph: {
    
  images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
title: 'Commission Sales Partners — Your Office Space',
    description: 'Earn serious commission selling commercial cleaning and office furniture in Newcastle and the Hunter Valley. No base, no cap.',
    url: 'https://yourofficespace.au/cleaning/work-with-us',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const WHAT_YOU_SELL = [
  {
    icon: 'broom',
    heading: 'Commercial Cleaning',
    body: 'Ongoing office, medical and childcare cleaning contracts. Clients want consistency — you bring the opportunity, we deliver the service.',
  },
  {
    icon: 'chair',
    heading: 'Office Furniture & Fitout',
    body: 'New offices, refits, expansion projects. We manage the full supply and install so you never have to worry about delivery or execution.',
  },
  {
    icon: 'handshake',
    heading: 'Tenant Representation',
    body: 'Leasing support for businesses moving or growing. Smallish deals (50–300sqm) that move fast and pay well.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    heading: 'You find the opportunity',
    body: 'A business needs cleaning, new furniture, or help with their office move. You scope it out and make the intro.',
  },
  {
    step: '02',
    heading: 'We do the rest',
    body: 'YOS takes over from there — scoping, quoting, delivering. You stay in the loop but carry none of the operational weight.',
  },
  {
    step: '03',
    heading: 'Commission lands in your account',
    body: 'Once the client is signed and we\'ve received the first invoice, your commission is calculated and paid. No waiting 90 days.',
  },
]

const WHO_THIS_FITS = [
  'You have existing relationships with Newcastle businesses',
  'You understand commercial property or facilities management',
  'You\'re motivated by uncapped earnings — not a guaranteed wage',
  'You prefer working autonomously without a boss looking over your shoulder',
  'You can hold a conversation with a GM or property manager without a script',
  'You want to be part of a business that actually delivers what it promises',
]

export default function SalesPartnersPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: '#0A0A0A',
        paddingTop: 'clamp(7rem,14vw,11rem)',
        paddingBottom: 'clamp(4rem,8vw,6rem)',
      }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Sales Partnership — Newcastle &amp; Hunter Valley
          </p>
          <h1 style={{
            color: 'white', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em',
            textTransform: 'uppercase', fontSize: 'clamp(2.5rem,7vw,6rem)', marginBottom: '1.5rem',
          }}>
            Uncapped commission.<br />
            <span style={{ color: '#00B5A5' }}>Zero base.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.75, maxWidth: '42rem', fontSize: 'clamp(1rem,2vw,1.2rem)', marginBottom: '2rem' }}>
            We&apos;re looking for sales people who want to earn serious money bringing commercial cleaning and furniture opportunities to YOS. You find the client. We do everything else. Commission-only, no cap, no strings.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#apply"
              style={{ background: '#00B5A5', color: 'white', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
              Apply to partner
            </a>
            <a href="#what-you-sell"
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1rem 2rem', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)' }}>
              What you sell
            </a>
          </div>
        </div>
      </section>

      {/* ── ROLE SWITCHER ────────────────────────────────────── */}
      <RoleSwitcher />

      {/* ── WHAT YOU SELL ─────────────────────────────────────── */}
      <section id="what-you-sell" style={{ background: '#111', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>What you sell</p>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 'clamp(2.5rem,5vw,4rem)', maxWidth: '36rem' }}>
            Three revenue streams.<br />One relationship.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {WHAT_YOU_SELL.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                padding: '1.75rem', borderTop: '2px solid #00B5A5',
              }}>
                <BroomIcon size={28} />
                <p style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{s.heading}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>How it works</p>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 'clamp(2.5rem,5vw,4rem)', maxWidth: '40rem' }}>
            Simple. No drama.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i}>
                <p style={{ color: '#00B5A5', fontSize: 'clamp(3rem,5vw,4.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>{h.step}</p>
                <p style={{ color: 'white', fontWeight: 800, fontSize: '1rem', marginBottom: '0.6rem', lineHeight: 1.3 }}>{h.heading}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO THIS FITS ─────────────────────────────────────── */}
      <section style={{ background: '#111', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Who this is for</p>
              <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                If you&apos;ve got the relationships,<br />we&apos;ve got the product.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                You don&apos;t need to be a cleaning expert. You need to be someone who knows Newcastle businesses and can have a genuine conversation about what they need. We handle everything from that point.
              </p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>You&apos;re a fit if</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {WHO_THIS_FITS.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', background: 'rgba(0,181,165,0.15)', border: '1px solid rgba(0,181,165,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                      <CheckIcon />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────── */}
      <section id="apply" style={{ background: '#0A0A0A', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div style={{ maxWidth: '680px' }}>
            <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Apply to partner</p>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
              Tell us about yourself.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 'clamp(2rem,4vw,3rem)' }}>
              Joe will be in touch within 2 business days. No pushy sales training, no scripts to learn. Just a conversation about whether we&apos;re a good fit.
            </p>
            <SalesCareersForm />
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}