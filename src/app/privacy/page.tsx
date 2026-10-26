import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SectionLabel from '@/components/SectionLabel'
import FadeIn from '@/components/FadeIn'

export const metadata = withPageSeo({
  title: 'Privacy Policy | Your Office Space',
  description: 'How Your Office Space collects, uses, and protects your personal information. Governed by the Privacy Act 1988 (Cth).',
  alternates: { canonical: 'https://www.yourofficespace.au/privacy' },
  openGraph: {
    title: 'Privacy Policy | Your Office Space',
    description: 'How Your Office Space collects, uses, and protects your personal information.',
    url: 'https://www.yourofficespace.au/privacy',
    images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
})

const PRIVACY_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    ORGANIZATION_SCHEMA,
    {
      "@type": "WebPage",
      "name": "Privacy Policy | Your Office Space",
      "description": "How Your Office Space collects, uses, and protects personal information. Governed by the Privacy Act 1988 (Cth) and Australian Privacy Principles.",
      "url": "https://www.yourofficespace.au/privacy",
      "isPartOf": { "@type": "WebSite", "name": "Your Office Space", "url": "https://www.yourofficespace.au" }
    }
  ]
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRIVACY_SCHEMA) }} />
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black relative overflow-hidden" style={SEC_SM}>
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
              Last updated: 26 October 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── CONTENT ──────────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="max-w-3xl prose-style">

            <PrivacySection title="Website assistant and optional follow-up">
              <p>The public YOS and Your Office Furniture assistant answers questions using reviewed public website information. Questions and recent question context may be sent to our AI provider, MiniMax, to prepare an answer. Please do not enter contact details, order numbers, passwords or confidential client information in the question box. The assistant cannot access individual orders, accounts or projects.</p>
              <p>Chat history stays in the current page session and is not saved as a chat transcript by our website. We use temporary, hashed network identifiers and request counters to limit abuse and AI usage. Provider processing is subject to the provider’s own privacy practices.</p>
              <p>If you choose a team follow-up, the separate form asks for your name, email, optional phone and business, an editable enquiry summary and permission to contact you. The form details and the summary you submit are emailed to the YOS team; the full chat transcript is not sent. This does not subscribe you to marketing. You can ask public questions without submitting the follow-up form.</p>
            </PrivacySection>

            <PrivacySection title="Who we are">
              <p>
                Your Office Space is operated by Joe Kelley, Managing Director. Tenant representation is delivered within verified NSW licensing coverage.
                We provide tenant representation, commercial fit out and project management, office and commercial furniture,
                commercial cleaning, and supporting workplace resources.
              </p>
              <p>
                This policy applies to all services offered at <strong>yourofficespace.au</strong> and is governed by the{' '}
                <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
              </p>
            </PrivacySection>

            <PrivacySection title="What we collect">
              <p>We only collect what we need to help you:</p>
              <ul>
                <li><strong>Name and email address</strong>, when you submit an enquiry form or sign up for updates.</li>
                <li><strong>Checklist requests</strong>, your email address, selected service, optional follow-up choice, request and delivery times, and delivery status.</li>
                <li><strong>Phone number</strong>, if you choose to include it in an enquiry.</li>
                <li><strong>Work and partnership interest</strong>, your name, contact details, selected role, location and any experience, business or availability details you choose to provide. We use these to review your interest and contact you about working with YOS. These expressions of interest are delivered directly to the relevant YOS team by email, without subscribing you to marketing.</li>
                <li><strong>Enquiry details</strong>, the information you type into any contact or service form.</li>
                <li><strong>Lease Health Check and tool details</strong>, business name, role, suburb, lease dates, area, headcount, plans, concerns and calculator inputs or results that you choose to send us.</li>
                <li><strong>Optional lease documents</strong>, your current lease if you choose to attach it to a lease check. It is emailed to the YOS inbox with your request through our email provider.</li>
                <li><strong>Referral details</strong>, referrer and business contact information, with confirmation that the referred contact has agreed to be contacted.</li>
                <li><strong>Request source and consent records</strong>, campaign labels, the landing page, and the marketing choice, wording and time recorded when you submit.</li>
                <li><strong>Payment details</strong>, when you choose a paid service. Card processing is handled by Stripe; we do not store card numbers.</li>
                <li><strong>IP address</strong>, collected automatically for rate limiting purposes (see Third Parties below). Not linked to your identity.</li>
                <li><strong>Basic browser/device and usage information</strong>, standard server logs used for security and performance monitoring. If you accept optional analytics, Google Analytics also process information about pages viewed, device/browser type and approximate location.</li>
              </ul>
              <p>We do not collect sensitive information (health, financial records, government IDs) unless you voluntarily include it in an enquiry message or optional lease attachment.</p>
            </PrivacySection>

            <PrivacySection title="Why we collect it">
              <ul>
                <li>To respond to your enquiry and provide the service you asked about.</li>
                <li>To email the checklist you requested, notify Joe of your request, and send one discovery invitation about 24 hours later only if you selected that separate option.</li>
                <li>To respond to your Lease Health Check and deliver any separately agreed advisory work.</li>
                <li>To send you occasional updates or resources if you&apos;ve opted in (you can unsubscribe any time).</li>
                <li>To protect the website from abuse (rate limiting).</li>
                <li>With your permission, to understand which pages and resources are useful and improve the website.</li>
              </ul>
              <p>We don&apos;t sell your data. We don&apos;t use it for advertising. Full stop.</p>
            </PrivacySection>

            <PrivacySection title="Third parties we use">
              <p>We work with a small number of trusted providers to run the site. Here&apos;s who they are and what they touch:</p>

              <div className="not-prose space-y-5 my-6">
                <ThirdParty
                  name="HubSpot"
                  role="Historical CRM records. Normal website enquiry forms deliver directly to the YOS inbox by email and do not send data to HubSpot."
                  link="https://legal.hubspot.com/privacy-policy"
                />
                <ThirdParty
                  name="Microsoft Bookings and Teams"
                  role="Optional appointment scheduling connected to Outlook. If you choose the external Microsoft booking calendar, Microsoft processes the details you enter there to arrange your appointment and online meeting. Opening the booking link does not by itself confirm an appointment."
                  link="https://privacy.microsoft.com/privacystatement"
                />
                <ThirdParty
                  name="Google Analytics"
                  role="Optional website analytics, helps us understand aggregate site usage. It only loads after you accept optional analytics, with IP anonymisation enabled."
                  link="https://policies.google.com/privacy"
                />
                <ThirdParty
                  name="Google Tag Manager"
                  role="The homepage loads the Google Tag Manager container with analytics and advertising storage denied by default. Optional Google Analytics remains separately controlled by your analytics preference."
                  link="https://policies.google.com/privacy"
                />
                <ThirdParty
                  name="Resend"
                  role="Email delivery, sends requested checklists, separately opted-in discovery invitations, confirmations and reports, and delivers enquiries and optional lease attachments to the YOS inbox."
                  link="https://resend.com/privacy"
                />
                <ThirdParty
                  name="Vercel"
                  role="Hosting, the website is served from Vercel's global edge network, with servers in the USA and globally."
                  link="https://vercel.com/legal/privacy-policy"
                />
                <ThirdParty
                  name="Upstash (Redis)"
                  role="Rate limiting, temporary delivery receipts and checklist delivery records. Checklist records include your email, selected service, follow-up choice and delivery status. Hashed email identifiers help prevent duplicate invitations and remember cancellations or known enquiries. These records expire automatically."
                  link="https://upstash.com/trust/privacy.pdf"
                />
              </div>

              <p>
                All third-party providers are contractually required to handle your data in accordance with applicable privacy laws.
                Because Vercel and Upstash operate infrastructure in the USA, your data may be processed or stored outside Australia.
                Where this occurs, we take reasonable steps to ensure it&apos;s protected to a standard consistent with the APPs.
              </p>
            </PrivacySection>

            <PrivacySection title="Requested results and marketing">
              <p>Sending a Health Check request, requesting a checklist or emailing yourself tool results does not automatically subscribe you to marketing. Marketing uses a separate, unticked choice. We keep a record of that choice and the wording you were shown.</p>
              <p>The free service checklist is available whether or not you choose the optional follow-up. That choice authorises one discovery invitation, not an ongoing email series. A known website enquiry or payment, or a cancellation through the checklist email, suppresses the optional invitation. An external calendar booking is not currently connected to this automatic suppression.</p>
              <p>We use short-lived session storage to carry campaign labels and the first landing page into your enquiry, and receipt identifiers to handle retries without repeating a delivery. You can submit an enquiry when session storage is unavailable.</p>
            </PrivacySection>

            <PrivacySection title="Cookies">
              <p>Checklist offers use browser local storage to avoid repeating an offer for seven days. A marker for a successful checklist request, enquiry or payment also prevents further offers in that browser; it remains until browser storage is cleared. These markers do not contain your email address. If storage is unavailable, repeat-offer suppression may be limited to the current page.</p>
              <p>
                Essential session and security storage is used where required for the site to function. Optional Google Analytics is disabled by default and only loads after you select <strong>Accept analytics</strong>.
              </p>
              <p>
                We do not use analytics for advertising. You can choose <strong>Essential only</strong> or use <strong>Privacy settings</strong> in the footer at any time to change your preference. You can also disable cookies in your browser settings, though some site functionality may be affected.
              </p>
            </PrivacySection>

            <PrivacySection title="How long we keep your data">
              <p>Temporary checklist request and unsubscribe-link records in Upstash expire 90 days after their last update. Checklist cancellation and known-enquiry suppression records also expire after 90 days. A separate hashed-email record limits discovery invitations to one per seven days. The checklist emails and notifications delivered to the YOS inbox follow the email retention approach below.</p>
              <p>
                New enquiry data is delivered to the YOS email inbox. Historical HubSpot records and enquiry emails are retained for as long as they&apos;re reasonably needed to manage the relationship or
                provide the requested service, typically no longer than three years of inactivity.
                Historical LeaseIntel™ order records are kept for seven years as required by Australian tax law.
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
                Checklist emails include a cancellation link. Open it and select <strong>Stop checklist follow-ups</strong> on the confirmation page to stop the optional invitation. Opening the link alone does not change your preference. You can also email{' '}
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
              <address className="font-normal mt-3 text-near-black/70 space-y-1" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                <strong className="text-near-black">Joe Kelley</strong><br />
                Managing Director, Your Office Space<br />
                Tenant representation is delivered within verified NSW licensing coverage.<br />
                <a href="mailto:jk@yourofficespace.au" className="text-teal hover:underline">jk@yourofficespace.au</a>
              </address>
            </PrivacySection>

          </div>
        </div>
      </section>

      </main>

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
