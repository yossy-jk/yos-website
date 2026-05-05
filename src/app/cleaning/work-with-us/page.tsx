import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CareersForm from './CareersForm'

export const metadata: Metadata = {
  title: 'Work With Us | YOS Cleaning Newcastle',
  description: 'Join the Your Office Space cleaning team in Newcastle and the Hunter Valley. Positions available for employees and contractors. Apply now.',
  alternates: { canonical: 'https://yourofficespace.au/cleaning/work-with-us' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Work With Us — YOS Cleaning Newcastle',
    description: 'Join a growing Newcastle commercial cleaning business. Consistent work, fair pay, local management. Positions open for employees and contractors.',
    url: 'https://yourofficespace.au/cleaning/work-with-us',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const REASONS = [
  {
    heading: 'Consistent work',
    body: 'We don\'t send you out once and never call again. Our clients are on ongoing contracts — monthly, weekly, sometimes nightly. If you\'re reliable, there\'s always work.',
  },
  {
    heading: 'Paid on time. Every time.',
    body: 'We run a tight ship. Invoices go out, payments come back. You won\'t be chasing money or waiting on excuses.',
  },
  {
    heading: 'Local management',
    body: 'Sarah runs the team directly. No call centres, no ticketing systems, no talking to someone in a different state. You deal with a person who knows your name.',
  },
  {
    heading: 'Real communication',
    body: 'If something changes — we tell you. If there\'s a problem — we sort it together. No surprises, no ghosting.',
  },
  {
    heading: 'Room to grow',
    body: 'We\'re growing fast. Newcastle\'s commercial market is moving and we\'re moving with it. More clients means more work, and we\'d rather grow people we already trust.',
  },
]

const WHO_WE_WANT = [
  'You show up on time and do what you said you\'d do',
  'You take pride in your work — a clean space matters to you',
  'You can work independently without someone watching over your shoulder',
  'You communicate when something comes up instead of going quiet',
  'You treat clients\' spaces like your own',
]

export default function WorkWithUsPage() {
  return (
    <>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: '#0A0A0A',
        paddingTop: 'clamp(7rem,14vw,11rem)',
        paddingBottom: 'clamp(4rem,8vw,6rem)',
      }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            YOS Cleaning — Newcastle &amp; Hunter Valley
          </p>
          <h1 style={{
            color: 'white', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em',
            textTransform: 'uppercase', fontSize: 'clamp(2.5rem,7vw,6rem)', marginBottom: '1.5rem',
          }}>
            Work that&apos;s worth<br />
            <span style={{ color: '#00B5A5' }}>showing up for.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.75, maxWidth: '38rem', fontSize: 'clamp(1rem,2vw,1.2rem)', marginBottom: '2rem' }}>
            We&apos;re a Newcastle-based commercial cleaning business growing across the Hunter Valley.
            We&apos;re looking for cleaners who take their work seriously — employees and contractors alike.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#apply"
              style={{ background: '#00B5A5', color: 'white', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
              Express Interest
            </a>
            <a href="#why-yos"
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1rem 2rem', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)' }}>
              About the role
            </a>
          </div>
        </div>
      </section>

      {/* ── WHY YOS ──────────────────────────────────────────── */}
      <section id="why-yos" style={{ background: '#111', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Why work with us</p>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 'clamp(2.5rem,5vw,4rem)', maxWidth: '36rem' }}>
            We run a tight operation.<br />And we look after our people.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {REASONS.map((r, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                padding: '1.75rem', borderTop: '2px solid #00B5A5',
              }}>
                <p style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{r.heading}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE WANT ──────────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Who we&apos;re looking for</p>
              <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Reliable people<br />who take pride<br />in their work.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                We don&apos;t care if you&apos;ve been cleaning for 20 years or 2. What matters is your attitude. We can teach technique — we can&apos;t teach reliability.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                We clean commercial offices, medical practices and childcare centres. Experience in any of these is a bonus but not a barrier to applying.
              </p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>You&apos;re a fit if</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {WHO_WE_WANT.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', background: 'rgba(0,181,165,0.15)', border: '1px solid rgba(0,181,165,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                      <span style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMPLOYEE VS CONTRACTOR ────────────────────────────── */}
      <section style={{ background: '#111', padding: 'clamp(3rem,6vw,5rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Two ways to work with us</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(0,181,165,0.06)', border: '1px solid rgba(0,181,165,0.2)', padding: '2rem' }}>
              <p style={{ color: '#00B5A5', fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Employee</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                You join the YOS team directly. We handle scheduling, pay, super and all the admin. You show up, do great work, and get paid weekly.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['Paid employment (PAYG)', 'Superannuation included', 'Consistent scheduled shifts', 'Uniform provided', 'All equipment supplied'].map((p, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>• {p}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', padding: '2rem' }}>
              <p style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contractor</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                You run your own ABN and invoice us for completed work. You&apos;ll need current insurance. We&apos;ll give you consistent sites and a reliable relationship.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['ABN required', 'Public liability insurance required', 'Workers comp / personal accident required', 'Flexible scheduling', 'Ongoing site contracts'].map((p, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>• {p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────── */}
      <section id="apply" style={{ background: '#0A0A0A', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div style={{ maxWidth: '680px' }}>
            <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Express your interest</p>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
              Tell us about yourself.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 'clamp(2rem,4vw,3rem)' }}>
              Fill this in and Sarah will be in touch within 2 business days. No lengthy interview process upfront — just a conversation.
            </p>
            <CareersForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
