import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SectionLabel from '@/components/SectionLabel'
import FadeIn from '@/components/FadeIn'

export const metadata = {
  title: 'Privacy Policy | Your Office Space',
  description: 'How Your Office Space collects, uses, and protects your personal information. Governed by the Privacy Act 1988 (Cth).',
  alternates: { canonical: 'https://yourofficespace.au/privacy' },
  openGraph: {
    title: 'Privacy Policy | Your Office Space',
    description: 'How Your Office Space collects, uses, and protects your personal information.',
    url: 'https://yourofficespace.au/privacy',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black relative overflow-hidden" style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className={`relative ${WRAP}`} style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Legal</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(2rem,6vw,5rem)' }}>
              Privacy Policy
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/50 font-light max-w-xl" style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.7 }}>
              We keep it simple. Here&apos;s exactly what we collect, why, and how you can ask us to change or delete it.
            </p>
          </FadeIn>
          <FadeIn delay={220}>
            <p className="text-white/25 font-light mt-6" style={{ fontSize: '0.82rem' }}>
              Last updated: April 2025
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── CONTENT ──────────────────────────────────────── */}
      <section className="bg-white" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(5rem,10vw,10rem)' }}>
        <div className={WRAP} style={PAD}>
          <div className="max-w-3xl prose-style">

            <PrivacySection title="Who we are">
              <p>
                Your Office Space is operated by Joe Kelley, Managing Director, NSW Real Estate Licence 20565455.
                We provide tenant representation, commercial buyers agency, office furniture and fitout, commercial cleaning,
                and the LeaseIntel™ lease review service.
              </p>
              <p>
                This policy applies to all services offered at <strong>yourofficespace.au</strong> and is governed by the{' '}
                <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
              </p>
            </PrivacySection>

            <PrivacySection title="What we collect">
              <p>We only collect what we need to help you:</p>
              <ul>
                <li><strong>Name and email address</strong> — when you submit an enquiry form or sign up for updates.</li>
                <li><strong>Phone number</strong> — if you choose to include it in an enquiry.</li>
                <li><strong>Enquiry details</strong> — the information you type into any contact or service form.</li>
                <li><strong>Payment details</strong> — for LeaseIntel™ ($97 review). Card processing is handled by Stripe; we do not store card numbers.</li>
                <li><strong>IP address</strong> — collected automatically for rate limiting purposes (see Third Parties below). Not linked to your identity.</li>
                <li><strong>Basic browser/device info</strong> — standard server logs used for security and performance monitoring.</li>
              </ul>
              <p>We do not collect sensitive information (health, financial records, government IDs) unless you voluntarily include it in an enquiry message.</p>
            </PrivacySection>

            <PrivacySection title="Why we collect it">
              <ul>
                <li>To respond to your enquiry and provide the service you asked about.</li>
                <li>To deliver your LeaseIntel™ lease review report.</li>
                <li>To send you occasional updates or resources if you&apos;ve opted in (you can unsubscribe any time).</li>
                <li>To protect the website from abuse (rate limiting).</li>
              </ul>
              <p>We don&apos;t sell your data. We don&apos;t use it for advertising. Full stop.</p>
            </PrivacySection>

            <PrivacySection title="Third parties we use">
              <p>We work with a small number of trusted providers to run the site. Here&apos;s who they are and what they touch:</p>

              <div className="not-prose space-y-5 my-6">
                <ThirdParty
                  name="HubSpot"
                  role="CRM — stores your name, email, and enquiry context so we can follow up properly."
                  link="https://legal.hubspot.com/privacy-policy"
                />
                <ThirdParty
                  name="Resend"
                  role="Email delivery — sends you confirmation emails and delivers your LeaseIntel™ report."
                  link="https://resend.com/privacy"
                />
                <ThirdParty
                  name="Vercel"
                  role="Hosting — the website is served from Vercel's global edge network, with servers in the USA and globally."
                  link="https://vercel.com/legal/privacy-policy"
                />
                <ThirdParty
                  name="Upstash (Redis)"
                  role="Rate limiting — stores IP addresses temporarily to prevent form spam. No personal profile is built. Data expires automatically."
                  link="https://upstash.com/trust/privacy.pdf"
                />
              </div>

              <p>
                All third-party providers are contractually required to handle your data in accordance with applicable privacy laws.
                Because Vercel and Upstash operate infrastructure in the USA, your data may be processed or stored outside Australia.
                Where this occurs, we take reasonable steps to ensure it&apos;s protected to a standard consistent with the APPs.
              </p>
            </PrivacySection>

            <PrivacySection title="Cookies">
              <p>
                We use minimal cookies — primarily session and security cookies required for the site to function.
                We do not use advertising or cross-site tracking cookies. If we add analytics in future, we&apos;ll update this policy.
              </p>
              <p>
                You can disable cookies in your browser settings, though some site functionality may be affected.
              </p>
            </PrivacySection>

            <PrivacySection title="How long we keep your data">
              <p>
                Enquiry data is retained in HubSpot for as long as it&apos;s reasonably needed to manage the relationship or
                provide the requested service — typically no longer than three years of inactivity.
                LeaseIntel™ order records are kept for seven years as required by Australian tax law.
                Rate-limiting IP data in Upstash expires automatically (usually within minutes to hours).
              </p>
            </PrivacySection>

            <PrivacySection title="Your rights">
              <p>Under the <em>Privacy Act 1988</em> (Cth) you have the right to:</p>
              <ul>
                <li><strong>Access</strong> the personal information we hold about you.</li>
                <li><strong>Correct</strong> any information that&apos;s inaccurate or out of date.</li>
                <li><strong>Request deletion</strong> of your personal information (subject to any legal retention obligations).</li>
                <li><strong>Unsubscribe</strong> from marketing communications at any time.</li>
                <li><strong>Complain</strong> to the Office of the Australian Information Commissioner (OAIC) at{' '}
                  <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">oaic.gov.au</a>{' '}
                  if you feel we&apos;ve mishandled your information.
                </li>
              </ul>
              <p>
                To exercise any of these rights, just email us at{' '}
                <a href="mailto:jk@yourofficespace.au" className="text-teal hover:underline">jk@yourofficespace.au</a>.
                We&apos;ll respond within 30 days.
              </p>
            </PrivacySection>

            <PrivacySection title="Unsubscribing">
              <p>
                Every marketing email we send includes an unsubscribe link. Click it and you&apos;re off the list — no confirmation
                loop, no re-engagement emails. You can also email{' '}
                <a href="mailto:jk@yourofficespace.au" className="text-teal hover:underline">jk@yourofficespace.au</a>{' '}
                and we&apos;ll remove you manually.
              </p>
            </PrivacySection>

            <PrivacySection title="Data deletion requests">
              <p>
                Want us to delete everything we hold on you? Email{' '}
                <a href="mailto:jk@yourofficespace.au" className="text-teal hover:underline">jk@yourofficespace.au</a>{' '}
                with &ldquo;Delete my data&rdquo; in the subject line. We&apos;ll action it within 30 days, unless we&apos;re legally required
                to retain certain records (for example, transaction data for tax purposes).
              </p>
            </PrivacySection>

            <PrivacySection title="Changes to this policy">
              <p>
                If we make material changes, we&apos;ll update the &ldquo;Last updated&rdquo; date at the top of this page. We won&apos;t
                retroactively change how we handle data you&apos;ve already provided without notifying you.
              </p>
            </PrivacySection>

            <PrivacySection title="Governing law">
              <p>
                This policy is governed by the laws of New South Wales, Australia. Any disputes will be subject to the
                jurisdiction of the courts of New South Wales.
              </p>
            </PrivacySection>

            <PrivacySection title="Contact">
              <p>
                Privacy questions? Just reach out directly:
              </p>
              <address className="not-italic mt-3 text-near-black/70 space-y-1" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                <strong className="text-near-black">Joe Kelley</strong><br />
                Managing Director, Your Office Space<br />
                NSW Real Estate Licence 20565455<br />
                <a href="mailto:jk@yourofficespace.au" className="text-teal hover:underline">jk@yourofficespace.au</a>
              </address>
            </PrivacySection>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

/* ─── Sub-components ──────────────────────────────────────── */

function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2
        className="font-black text-near-black tracking-tight mb-5"
        style={{ fontSize: 'clamp(1.25rem,2.5vw,1.75rem)' }}
      >
        {title}
      </h2>
      <div className="text-near-black/70 font-light space-y-4" style={{ fontSize: '0.975rem', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  )
}

function ThirdParty({ name, role, link }: { name: string; role: string; link: string }) {
  return (
    <div className="border-l-2 border-teal/30 pl-5">
      <p className="font-bold text-near-black" style={{ fontSize: '0.9rem' }}>
        {name}{' '}
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="text-teal font-normal hover:underline" style={{ fontSize: '0.78rem' }}>
          Privacy policy ↗
        </a>
      </p>
      <p className="text-near-black/60 font-light mt-1" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
        {role}
      </p>
    </div>
  )
}
