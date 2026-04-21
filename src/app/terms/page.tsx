import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'

export const metadata = {
  title: 'Terms & Conditions | Your Office Space',
  description: 'Terms and conditions governing use of the Your Office Space website and engagement of its services, including LeaseIntel™.',
  alternates: { canonical: 'https://yourofficespace.au/terms' },
  openGraph: {
    title: 'Terms & Conditions | Your Office Space',
    description: 'Terms and conditions governing use of the Your Office Space website and engagement of its services.',
    url: 'https://yourofficespace.au/terms',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-near-black font-black leading-tight tracking-tight mb-4"
      style={{ fontSize: 'clamp(1.25rem,2.5vw,1.75rem)' }}>
      {title}
    </h2>
    <div className="text-charcoal font-light leading-relaxed space-y-4"
      style={{ fontSize: 'clamp(0.95rem,1.5vw,1.05rem)', lineHeight: 1.85 }}>
      {children}
    </div>
  </div>
)

export default function TermsPage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        className="bg-near-black relative overflow-hidden"
        style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className={`relative ${WRAP}`} style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Legal</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1
              className="text-white font-black leading-[0.95] tracking-tight mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(2rem,6vw,5.5rem)' }}
            >
              Terms &amp; <span className="text-teal">Conditions.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p
              className="text-white/60 font-light leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1rem,2vw,1.2rem)' }}
            >
              Plain language. Straight up. These terms apply to everything we do — from your first visit to
              this website through to the completion of any service engagement.
            </p>
          </FadeIn>
          <FadeIn delay={220}>
            <p className="text-white/35 font-light mt-6 text-sm tracking-wide">
              Last updated: April 2025
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── CONTENT ──────────────────────────────────────── */}
      <section
        className="bg-white"
        style={{ paddingTop: 'clamp(5rem,10vw,9rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}
      >
        <div className={WRAP} style={PAD}>
          <div className="max-w-3xl">

            <FadeIn>
              <Section title="1. Who we are">
                <p>
                  Your Office Space is operated by Joe Kelley (Managing Director), NSW Real Estate Licence
                  number 20565455. When we say &ldquo;YOS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo; in these terms, we mean
                  Your Office Space and everyone working on its behalf. When we say &ldquo;you&rdquo;, we mean anyone
                  using this website or engaging our services.
                </p>
                <p>
                  By using this website or engaging any of our services, you agree to these terms in full.
                  If you don&apos;t agree, please don&apos;t use the site or our services.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={60}>
              <Section title="2. Our services — what we do and what we don't">
                <p>
                  YOS provides the following services. Each one comes with some important clarifications.
                </p>

                <div className="border-l-4 border-teal pl-6 py-2 space-y-1">
                  <p className="text-near-black font-semibold">Tenant Representation (Commercial Leasing Advisory)</p>
                  <p>
                    We act exclusively on behalf of tenants and occupiers to identify suitable commercial
                    premises, negotiate lease terms, and manage the process through to execution. We do not
                    act for landlords. We are not a substitute for independent legal advice on your lease
                    documentation — we strongly recommend you engage a solicitor before signing any lease.
                  </p>
                </div>

                <div className="border-l-4 border-teal pl-6 py-2 space-y-1">
                  <p className="text-near-black font-semibold">Commercial Buyers Agency</p>
                  <p>
                    We act on behalf of buyers seeking to purchase commercial property. We assist with
                    search, due diligence co-ordination, and negotiation strategy. We are not a financial
                    planner or investment adviser. Nothing we say constitutes financial advice — engage a
                    qualified adviser before making any investment decision.
                  </p>
                </div>

                <div className="border-l-4 border-teal pl-6 py-2 space-y-1">
                  <p className="text-near-black font-semibold">Office Furniture &amp; Fitout</p>
                  <p>
                    We provide project management and procurement services for commercial office fitouts
                    and furniture supply. Scope, specifications, and deliverables are agreed in writing
                    before work commences. Fitout outcomes depend on factors including landlord approvals,
                    building access, and supply chain conditions — timelines are estimates, not guarantees.
                  </p>
                </div>

                <div className="border-l-4 border-teal pl-6 py-2 space-y-1">
                  <p className="text-near-black font-semibold">Commercial Cleaning</p>
                  <p>
                    We provide ongoing commercial cleaning services for office and commercial premises.
                    The scope of cleaning, frequency, and pricing are agreed in a separate service
                    agreement. These terms apply in addition to any service-specific agreement in place.
                  </p>
                </div>

                <div className="border-l-4 border-teal pl-6 py-2 space-y-1">
                  <p className="text-near-black font-semibold">LeaseIntel™ — Commercial Lease Analysis</p>
                  <p>
                    See Section 3 below. This service has specific terms that apply in addition to
                    these general terms.
                  </p>
                </div>
              </Section>
            </FadeIn>

            <FadeIn delay={80}>
              <Section title="3. LeaseIntel™ — specific terms">
                <p>
                  LeaseIntel™ is a paid commercial lease analysis service. You submit your lease document,
                  we analyse it and return a written report. The current fee is $97 (ex GST) per report.
                </p>

                <div className="bg-warm-grey rounded-xl p-6 space-y-3 my-2">
                  <p className="text-near-black font-semibold">Important — please read this carefully.</p>
                  <p>
                    <span className="font-semibold text-near-black">LeaseIntel™ is commercial analysis, not legal advice.</span> The
                    report identifies commercial risks, unusual clauses, market context, and negotiation
                    opportunities based on our experience in the market. It is not prepared by a solicitor,
                    does not constitute legal advice, and cannot be relied upon as a substitute for
                    independent legal advice. If you need legal advice on your lease, engage a solicitor.
                    Full stop.
                  </p>
                  <p>
                    <span className="font-semibold text-near-black">No refunds once the report is delivered.</span> Because
                    the service involves professional time and analysis, payment is non-refundable once your
                    report has been sent to you.
                  </p>
                  <p>
                    <span className="font-semibold text-near-black">24-hour turnaround is a target, not a guarantee.</span> We
                    aim to deliver your report within 24 hours of receiving your document and payment. In
                    practice, most reports are delivered within that window. But circumstances outside our
                    control — document complexity, volume, public holidays — can affect timing. We won&apos;t
                    leave you waiting without communication, but we can&apos;t contractually guarantee the
                    24-hour window.
                  </p>
                  <p>
                    Payment is processed at the time of order. By submitting your lease document and
                    completing payment, you accept these terms.
                  </p>
                </div>
              </Section>
            </FadeIn>

            <FadeIn delay={100}>
              <Section title="4. No guarantee of outcomes">
                <p>
                  We work hard for every client and we&apos;re proud of our track record. But we can&apos;t
                  guarantee specific outcomes — and anyone who tells you otherwise is selling you something.
                </p>
                <p>
                  In particular, YOS makes no representation or warranty that our services will result in
                  any specific lease terms, rent savings, purchase price, fitout outcome, or commercial
                  advantage. Outcomes depend on market conditions, counterparty behaviour, timing, and a
                  range of factors outside our control.
                </p>
                <p>
                  Our obligation is to bring our genuine experience, local knowledge, and best professional
                  effort to your engagement. That&apos;s what we commit to — every time.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={110}>
              <Section title="5. Limitation of liability">
                <p>
                  To the maximum extent permitted by Australian law, YOS&apos;s total liability to you for
                  any claim arising out of or in connection with our services (whether in contract, tort,
                  negligence, statute, or otherwise) is limited to the total fees paid by you to YOS for
                  the specific service giving rise to the claim.
                </p>
                <p>
                  We exclude all liability for indirect, consequential, or special loss, including loss of
                  profits, loss of anticipated savings, loss of opportunity, or loss of data — to the extent
                  permitted by law.
                </p>
                <p>
                  Nothing in these terms limits or excludes any rights you may have under the Australian
                  Consumer Law that cannot lawfully be excluded or limited, including consumer guarantees
                  for services supplied to consumers.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={120}>
              <Section title="6. Intellectual property">
                <p>
                  All content on this website — including text, graphics, data, tools, and design — is the
                  intellectual property of Your Office Space or its licensors. You may view and use it for
                  your own personal, non-commercial reference only.
                </p>
                <p>
                  All reports, analysis, and written deliverables produced by YOS as part of a service
                  engagement (including LeaseIntel™ reports) remain the intellectual property of Your
                  Office Space. We grant you a personal, non-transferable licence to use the report for
                  your own business purposes. You may not reproduce, resell, or distribute any report
                  without our written consent.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={130}>
              <Section title="7. Your obligations">
                <p>By using our website or engaging our services, you agree that:</p>
                <ul className="list-none space-y-3 mt-2">
                  {[
                    'You will provide accurate, complete, and current information when requested — including when submitting documents for LeaseIntel™ or completing onboarding for any service engagement.',
                    'You will not use this website or our services for any unlawful purpose, or in any way that could damage, disable, or impair the website or interfere with any other party\'s use of it.',
                    'You will not attempt to gain unauthorised access to any part of this website or its underlying systems.',
                    'Any information you provide to us is yours to share — you hold the necessary rights and permissions to provide it.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-teal font-black mt-1 flex-shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  If you provide inaccurate or incomplete information that affects the quality or outcome
                  of our service, YOS accepts no liability for any resulting deficiency in the deliverable.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={140}>
              <Section title="8. Third-party links and tools">
                <p>
                  This website may contain links to third-party websites or embed third-party tools. We
                  don&apos;t control those sites or services and take no responsibility for their content,
                  accuracy, or practices. Linking to a third party is not an endorsement.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={150}>
              <Section title="9. Privacy">
                <p>
                  We collect and handle personal information in accordance with the Australian Privacy Act
                  1988 (Cth). We use the information you provide to deliver our services, communicate with
                  you, and improve what we do. We do not sell your data. For questions about your privacy,
                  contact us at{' '}
                  <a href="mailto:jk@yourofficespace.au" className="text-teal font-medium hover:underline">
                    jk@yourofficespace.au
                  </a>.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={160}>
              <Section title="10. Dispute resolution">
                <p>
                  If you have a concern or complaint, contact us first. In our experience, most issues get
                  resolved quickly when both sides are talking directly and in good faith.
                </p>
                <p>
                  If a dispute can&apos;t be resolved through direct discussion, the parties agree to attempt
                  mediation in good faith before commencing any legal proceedings.
                </p>
                <p>
                  These terms are governed by the laws of New South Wales, Australia. To the extent that
                  legal proceedings become necessary, both parties submit to the exclusive jurisdiction of
                  the courts of New South Wales.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={170}>
              <Section title="11. Changes to these terms">
                <p>
                  We may update these terms from time to time. When we do, we&apos;ll update the date at the
                  top of the page. Continued use of the website or our services after changes are published
                  constitutes acceptance of the updated terms.
                </p>
              </Section>
            </FadeIn>

            <FadeIn delay={180}>
              <Section title="12. Contact">
                <p>
                  For any questions about these terms, or anything else, get in touch directly.
                </p>
                <div className="mt-4 pl-6 border-l-4 border-teal py-1 space-y-1">
                  <p className="text-near-black font-semibold">Joe Kelley — Managing Director</p>
                  <p>Your Office Space</p>
                  <p>
                    <a href="mailto:jk@yourofficespace.au" className="text-teal font-medium hover:underline">
                      jk@yourofficespace.au
                    </a>
                  </p>
                  <p className="text-mid-grey text-sm">NSW Real Estate Licence 20565455</p>
                </div>
              </Section>
            </FadeIn>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
