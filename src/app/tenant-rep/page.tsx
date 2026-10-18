import { TENANT_INTRO_TRANSCRIPT } from '@/lib/tenant-intro'
import PlanningResources from '@/components/PlanningResources'
import { tenantPaymentRuntime } from "@/lib/tenant-payment-config";
import Image from "next/image";
import Link from "next/link";
import TenantShell, {
  TenantCta,
  tenantMetadata,
} from "@/components/tenant/TenantShell";
import PackageCards from "@/components/tenant/PackageCards";
import TenantDeferred from "@/components/tenant/TenantDeferred";
import ServiceFaq from "@/components/ServiceFaq";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import { ORGANIZATION_SCHEMA } from "@/lib/site-schema";
export const metadata = tenantMetadata(
  "Tenant Representation Newcastle & NSW | Your Office Space",
  "Tenant-side lease support in Newcastle, Lake Macquarie and NSW. Understand costs, compare clear packages and start with a free Lease Health Check.",
  "/tenant-rep",
);
const faqs = [
  {
    question: "What does a tenant representative do?",
    answer:
      "We help your business define its premises brief, find and compare properties, and negotiate the commercial terms. Your solicitor advises on legal wording. You decide which option to pursue and whether to sign.",
  },
  {
    question: "Who pays YOS?",
    answer:
      "The professional fees and payment timing are shown in our packages and confirmed in your agency agreement. Any relevant payment arrangement or conflict is disclosed before an engagement begins.",
  },
  {
    question: "Do you act for the landlord?",
    answer:
      "In a tenant representation engagement, YOS represents the occupying business. The landlord-appointed leasing agent represents the property owner.",
  },
  {
    question: "What if I already have an offer?",
    answer:
      "Bring the written proposal to the Health Check. We can help compare its commercial costs, obligations and timing before you decide. For the guarantee, an existing written offer is the baseline.",
  },
  {
    question: "Can you help me renew instead of moving?",
    answer:
      "Yes. We can compare renewal with suitable alternatives, assess the commercial terms and help negotiate a renewal. Check option notice deadlines with your solicitor before they pass.",
  },
  {
    question: "What happens if I do not sign?",
    answer: `The package payment terms are ${TENANT_OFFER.startPayment * (1 + TENANT_OFFER.gstRate)} dollars including GST to start (${TENANT_OFFER.startPayment} dollars ex GST plus ${TENANT_OFFER.startPayment * TENANT_OFFER.gstRate} dollars GST), with the balance due on signed Heads of Agreement. If no suitable space is found and you do not sign, the start payment is all you pay, subject to the agreed engagement terms.`,
  },
  {
    question: "What does the guarantee exclude?",
    answer:
      "It excludes changes already in the first written offer, bank guarantees and deposit reductions. It also excludes direct client negotiation during the engagement, signing against written YOS advice, or ending before a lease is signed. See the full terms and refund cap.",
  },
  {
    question: "Can you help after the lease decision?",
    answer:
      "Yes. Separately agreed fitout project management, furniture supply and workplace care can carry the same brief through to a working office. Appointed builders and licensed trades deliver construction.",
  },
];
export default function Page() {
  return (
    <TenantShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              ORGANIZATION_SCHEMA,
              {
                "@type": "Service",
                name: "Commercial Tenant Representation",
                provider: {
                  "@id": "https://www.yourofficespace.au/#organization",
                },
                areaServed: ["Newcastle", "Lake Macquarie", "New South Wales"],
                description:
                  "Tenant-side premises search, lease comparisons and commercial negotiation.",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.yourofficespace.au/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Tenant representation",
                    item: "https://www.yourofficespace.au/tenant-rep",
                  },
                ],
              },
            ],
          }),
        }}
      />
      <section className="tenant-hero">
        <Image
          className="tenant-hero-image"
          src="/images/furniture/space-geelong-a.jpg"
          alt="Illustrative commercial office interior"
          fill
          preload
          sizes="100vw"
        />
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">
            Tenant representation / Newcastle, Lake Macquarie and NSW
          </p>
          <h1>
            Your next lease.
            <br />A clear plan.
            <br />
            One team on your side.
          </h1>
          <p className="tenant-intro">
            The rent on the listing is only part of the commitment. We help you
            understand the costs, compare the options and negotiate with your
            business priorities in view.
          </p>
          <div className="tenant-actions">
            <TenantCta />
            <Link href="#packages">See packages and fees</Link>
          </div>
          <p className="tenant-small">
            Start with a conversation about your lease, dates and next decision.
            No agency agreement is signed online.
          </p>
          <Link href="/tenant-rep/guarantee">
            Explore the {TENANT_OFFER.guarantee.multiple}x Return Guarantee
          </Link>
        </div>
      </section>
      <section className="tenant-section">
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">Look beyond the asking rent</p>
          <h2>Three costs to put on the table.</h2>
          <div className="tenant-grid">
            {[
              {
                title: "Your money",
                body: "Compare rent, outgoings, reviews, incentives and the cost of leaving. A rent-free period is only useful when you understand the full deal.",
                href: "/tools/lease-cost-calculator",
                link: "See the full lease cost",
              },
              {
                title: "Your time",
                body: "Calls, inspections and comparing proposals take time from the people running your business. Put a value on that time using your own numbers.",
                href: "#time-cost",
                link: "Calculate your time cost",
              },
              {
                title: "Your risk",
                body: "Make-good wording and option notice deadlines can affect your next move. Know what needs checking before you commit.",
                href: "/tools/critical-dates",
                link: "Map your lease dates",
              },
            ].map((x) => (
              <article className="tenant-card" key={x.title}>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
                <Link href={x.href}>{x.link}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="tenant-section tenant-soft" id="tenant-video">
        <div className="tenant-wrap tenant-two">
          <div>
            <p className="tenant-eyebrow">A quick introduction</p>
            <h2>
              More clarity.
              <br />
              More time for your business.
            </h2>
            <p>
              Watch how tenant representation brings the search, comparison and
              negotiation into one organised process.
            </p>
            <p className="tenant-small">
              56 seconds. On-screen subtitles and optional English captions.
            </p>
          </div>
          <video
            className="tenant-video"
            width={1920}
            height={1080}
            controls
            playsInline
            preload="none"
            poster="/videos/yos-tenant-representation-2026-10-poster.jpg"
            aria-label="Tenant representation introduction"
          >
            <source
              src="/videos/yos-tenant-representation-2026-10.mp4"
              type="video/mp4"
            />
            <track
              src="/videos/yos-tenant-representation-2026-10.vtt"
              kind="captions"
              srcLang="en"
              label="English"
            />
            Your browser does not support video.{" "}
            <a href="/videos/yos-tenant-representation-2026-10.mp4">
              Watch the introduction
            </a>
            .
          </video>
        </div>
        <div className="tenant-wrap tenant-video-transcript" style={{ marginTop: 32 }}>
          <details className="border border-black/10 rounded-xl" style={{ padding: "clamp(1.25rem,3vw,1.75rem)" }}>
            <summary className="font-semibold cursor-pointer">Read the video transcript</summary>
            <div className="max-w-3xl" style={{ marginTop: 20 }}>{TENANT_INTRO_TRANSCRIPT.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </details>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: "Tenant representation explained",
              description:
                "How a tenant representative helps compare property options, occupancy costs and lease terms.",
              thumbnailUrl:
                "https://www.yourofficespace.au/videos/yos-tenant-representation-2026-10-poster.jpg",
              contentUrl:
                "https://www.yourofficespace.au/videos/yos-tenant-representation-2026-10.mp4",
              uploadDate: "2026-10-15T10:48:46Z",
              duration: "PT55.893S",
              transcript: TENANT_INTRO_TRANSCRIPT.join(" "),
            }),
          }}
        />
      </section>
      <section className="tenant-section" id="time-cost">
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">Use your own numbers</p>
          <h2>What will the search cost in your time?</h2>
          <p>
            Get an estimate on screen. You can email yourself a copy afterwards.
          </p>
          <TenantDeferred kind="time" />
        </div>
      </section>
      <section className="tenant-section tenant-dark">
        <div className="tenant-wrap tenant-two">
          <div>
            <p className="tenant-eyebrow">One workplace budget</p>
            <h2>Your lease decision shapes everything that follows.</h2>
          </div>
          <div>
            <p>
              Rent, fitout, furniture, technology and the move all draw on the
              same budget. Check the preferred premises against the whole
              workplace brief before signing.
            </p>
            <p>
              Our team can connect the property decision with separately agreed
              fitout project management, furniture and ongoing workplace care.
            </p>
            <div className="tenant-inline-links">
              <Link href="/office-fitout">Fit It Out</Link>
              <Link href="/furniture">Furnish It</Link>
              <Link href="/cleaning">Flourish workplace care</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="tenant-section" id="how-it-works">
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">How it works</p>
          <h2>Five steps. Each with a clear next decision.</h2>
          <ol className="tenant-steps">
            {[
              {
                title: "Health Check",
                we: "We review your starting point, lease dates and concerns.",
                you: "You tell us what is changing and share the information you have.",
                get: "A sensible next step.",
              },
              {
                title: "Agree the brief",
                we: "We document the space, budget, location, timing and non-negotiables.",
                you: "You confirm the brief, scope and agency agreement.",
                get: "A shared decision standard.",
              },
              {
                title: "Search and compare",
                we: "We source options, coordinate inspections and compare the full occupancy cost.",
                you: "You shortlist premises with the trade-offs visible.",
                get: "A like-for-like comparison.",
              },
              {
                title: "Negotiate",
                we: "We negotiate commercial terms and coordinate the agreed position with your solicitor.",
                you: "You approve the proposed deal and obtain legal advice.",
                get: "A clear commercial proposal.",
              },
              {
                title: "Sign and settle in",
                we: "We help coordinate key dates and handover. Further workplace services are agreed separately.",
                you: "You decide whether to sign and plan the move.",
                get: "An organised path into the workplace.",
              },
            ].map((s, i) => (
              <li key={s.title}>
                <span className="tenant-number">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>
                  <strong>YOS:</strong> {s.we}
                </p>
                <p>
                  <strong>You:</strong> {s.you}
                </p>
                <p>
                  <strong>Your outcome:</strong> {s.get}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    <PlanningResources kind="tenant" />
      <section className="tenant-section tenant-soft" id="packages">
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">Clear scope. Clear fees.</p>
          <h2>Choose a starting point for your tenancy.</h2>
          <p>
            Two payments: $550 including GST to start ($500 ex GST plus $50
            GST), which forms part of the fee, then the balance on signed Heads
            of Agreement. The final package is agreed with your team.
          </p>
          <PackageCards paymentsEnabled={tenantPaymentRuntime().enabled} />
          <h3>Included in every package</h3>
          <ul className="tenant-list">
            {TENANT_OFFER.core.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <Link href="/tenant-rep/packages">Compare the package details</Link>
        </div>
      </section>
      <section className="tenant-section">
        <div className="tenant-wrap tenant-two">
          <div>
            <p className="tenant-eyebrow">Commercial protection</p>
            <h2>The {TENANT_OFFER.guarantee.multiple}x Return Guarantee.</h2>
            <p>
              A defined savings target, a written baseline and a refund
              calculation you can follow. See how savings are measured and how
              the fee-capped refund works.
            </p>
          </div>
          <div className="tenant-results">
            <p>
              For eligible leases, the target is savings worth at least{" "}
              {TENANT_OFFER.guarantee.multiple} times the professional fee,
              measured against the first written offer over the initial term.
            </p>
            <ul className="tenant-guarantee-conditions">
              <li>
                Initial term of at least {TENANT_OFFER.guarantee.minYears}{" "}
                years.
              </li>
              <li>
                Minimum annual gross rent:{" "}
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD",
                  maximumFractionDigits: 0,
                }).format(TENANT_OFFER.guarantee.minAnnualRent)}
                .
              </li>
              <li>
                YOS runs the negotiation and the agreed exclusions do not apply.
              </li>
              <li>
                Any shortfall refund is capped at the professional fee paid.
                Shorter or smaller leases use the{" "}
                {TENANT_OFFER.guarantee.fallbackMultiple}x rule.
              </li>
            </ul>
            <Link href="/tenant-rep/guarantee">
              Read the terms and try the calculator
            </Link>
          </div>
        </div>
      </section>
      <section className="tenant-section tenant-soft">
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">Evidence you can follow</p>
          <h2>Know why a recommendation fits.</h2>
          <div className="tenant-grid">
            <article className="tenant-card">
              <h3>Your brief stays visible</h3>
              <p>
                Space, timing, budget and priorities give each property
                comparison a consistent starting point.
              </p>
            </article>
            <article className="tenant-card">
              <h3>The costs are explained</h3>
              <p>
                See the assumptions behind the rent comparison, incentives,
                fitout allowance and exit exposure.
              </p>
            </article>
            <article className="tenant-card">
              <h3>You control the decision</h3>
              <p>
                YOS explains the options and negotiates within the agreed scope.
                You retain the decision to proceed.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="tenant-section" id="team">
        <div className="tenant-wrap">
          <p className="tenant-eyebrow">The YOS team</p>
          <h2>One team across your workplace decision.</h2>
          <p className="tenant-intro">
            Property advice, client-side project management, furniture and
            workplace care can use the same brief, so each stage supports the
            next.
          </p>
          <div className="tenant-grid">
            <article className="tenant-card">
              <h3>Find It</h3>
              <p>Tenant-side search, comparisons and commercial negotiation.</p>
            </article>
            <article className="tenant-card">
              <h3>Fit It Out and Furnish It</h3>
              <p>
                Project coordination, furniture plans, schedules, quotes and
                delivery under agreed scopes.
              </p>
            </article>
            <article className="tenant-card">
              <h3>Flourish</h3>
              <p>
                Commercial cleaning and workplace care to support the office
                once you move in.
              </p>
            </article>
          </div>
          <p style={{ marginTop: 24 }}>
            <Link href="/about">Meet the YOS team</Link>
          </p>
        </div>
      </section>
      <ServiceFaq
        heading="Understand the next step before you take it."
        items={faqs}
      />
      <section className="tenant-section tenant-soft" id="lease-health-check">
        <div className="tenant-wrap tenant-two">
          <div>
            <p className="tenant-eyebrow">Your first step</p>
            <h2>Start with a free Lease Health Check.</h2>
            <p>
              Tell us about your business, your lease and the decision ahead.
              You do not need to know every answer.
            </p>
            <ul className="tenant-checklist">
              <li>Key lease dates and option questions.</li>
              <li>Commercial costs and make-good points to check.</li>
              <li>Whether renewal, relocation or buying needs exploring.</li>
              <li>
                A clear next step, with any further work scoped separately.
              </li>
            </ul>
            <p>
              Your solicitor provides legal advice. We will confirm the
              information needed and timing for your Health Check.
            </p>
          </div>
          <TenantDeferred kind="health" />
        </div>
      </section>
      <section className="tenant-section">
        <div className="tenant-wrap tenant-inline-links">
          <Link href="/tenant-rep/newcastle">
            Tenant representation in Newcastle
          </Link>
          <Link href="/insights/lease-costs">Understand your lease costs</Link>
          <Link href="/lease-checklist">Before-you-sign checklist</Link>
        </div>
      </section>
    </TenantShell>
  );
}
