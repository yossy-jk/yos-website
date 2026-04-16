import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Commercial Tenant Rep Newcastle | Your Office Space",
  description: "Newcastle's only dedicated tenant representative. We negotiate commercial leases purely on your behalf — no landlord mandates, no conflicts. Hunter Valley and Lake Macquarie.",
};

export default function TenantRep() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <Image
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
          alt="Commercial lease negotiation Newcastle"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,26,0.80)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto", padding: "100px 5% 80px" }}>
          <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "24px" }}>
            Tenant Representation — Newcastle & Hunter Valley
          </p>
          <h1 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(38px, 5.5vw, 72px)", lineHeight: "1.05", letterSpacing: "-0.02em", maxWidth: "820px", marginBottom: "28px" }}>
            Your lease. Your terms. We make sure of it.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.68)", fontWeight: 300, fontSize: "clamp(17px, 2vw, 21px)", lineHeight: "1.65", maxWidth: "560px", marginBottom: "48px" }}>
            Your landlord has a professional negotiator in their corner. We put one in yours. Newcastle businesses stop accepting leases they should have fought harder on.
          </p>
          <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354"
            style={{ background: "#00B5A5", color: "#ffffff", fontWeight: 600, fontSize: "16px", padding: "16px 32px", borderRadius: "4px", textDecoration: "none", letterSpacing: "0.02em" }}>
            Book a Clarity Call
          </a>
        </div>
      </section>

      {/* THE PROBLEM — WHITE */}
      <section style={{ background: "#ffffff", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>The problem</p>
          <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: "1.15", marginBottom: "72px", maxWidth: "640px" }}>
            Every commercial lease is a negotiation. Most businesses don't realise it.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "48px" }}>
            {[
              {
                number: "01",
                title: "The landlord has a specialist. You don't.",
                body: "The agent showing you the space works for the landlord. Their job is to get the best deal for their client. Without a rep, you are negotiating alone against someone who does this every day."
              },
              {
                number: "02",
                title: "Make-good clauses can cost tens of thousands.",
                body: "Most tenants don't read make-good obligations properly until they're exiting a lease. By then, it's too late. A poorly worded clause can mean stripping a fitout you paid for."
              },
              {
                number: "03",
                title: "Rent reviews are structured against you by default.",
                body: "Fixed percentage increases, market reviews, CPI escalations — each one has implications for your cashflow over the life of the lease. The difference between a good clause and a bad one is significant."
              },
            ].map((p) => (
              <div key={p.number}>
                <p style={{ color: "#00B5A5", fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", marginBottom: "16px" }}>{p.number}</p>
                <h3 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "20px", lineHeight: "1.3", marginBottom: "14px" }}>{p.title}</h3>
                <p style={{ color: "#333333", fontWeight: 400, fontSize: "15px", lineHeight: "1.7" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK — DARK */}
      <section style={{ background: "#1A1A1A", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>How we work</p>
          <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: "1.15", marginBottom: "72px", maxWidth: "560px" }}>
            From first brief to signed lease — we run the process.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "48px" }}>
            {[
              { step: "01", title: "Initial strategy", body: "We start by understanding your business — what space you need, what flexibility matters, what your budget really allows. Most advisors skip this step." },
              { step: "02", title: "Property search", body: "We search on-market and off-market options across Newcastle, Lake Macquarie, and the Hunter. We shortlist based on your requirements, not what's easiest to show." },
              { step: "03", title: "Lease negotiation", body: "We negotiate directly with the landlord's agent. Rent, incentives, fit-out contributions, review clauses, make-good obligations — every term, reviewed and pushed." },
              { step: "04", title: "Final review", body: "Before you sign anything, we walk through the final lease with you. No surprises. No clauses you don't understand. You sign knowing exactly what you've agreed to." },
            ].map((s) => (
              <div key={s.step} style={{ paddingLeft: "24px", borderLeft: "4px solid #00B5A5" }}>
                <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "13px", letterSpacing: "0.1em", marginBottom: "12px" }}>{s.step}</p>
                <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "19px", marginBottom: "12px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300, fontSize: "15px", lineHeight: "1.7" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWCASTLE SPECIFIC — TEAL */}
      <section style={{ background: "#00B5A5", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "64px", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Newcastle-first</p>
            <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: "1.15", marginBottom: "20px" }}>
              We know this market. Not from a database — from being here.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 300, fontSize: "18px", lineHeight: "1.65" }}>
              Honeysuckle. Hunter Street. Broadmeadow. East Maitland. Maitland CBD. We know which landlords are flexible, which buildings have hidden outgoings, and where the real value sits in each precinct. That knowledge takes years to build. You get it from day one.
            </p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "4px", padding: "40px" }}>
            <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px", marginBottom: "24px" }}>Unlike advisors who work both sides of the deal:</p>
            {[
              "We only ever represent tenants — never landlords",
              "No vendor mandates, no sales commissions, no split loyalty",
              "Every recommendation is made purely in your interest",
              "We get paid when you get a better lease",
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", background: "#ffffff", borderRadius: "50%", marginTop: "7px", flexShrink: 0 }} />
                <p style={{ color: "rgba(255,255,255,0.9)", fontWeight: 400, fontSize: "15px", lineHeight: "1.6" }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES LIST — WHITE */}
      <section style={{ background: "#ffffff", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>What's included</p>
          <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: "1.15", marginBottom: "64px", maxWidth: "560px" }}>
            Full tenant representation — from brief to signed lease.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {[
              "Requirements brief and space strategy",
              "On-market and off-market property search",
              "Shortlisting and site inspection management",
              "Heads of agreement negotiation",
              "Lease clause review and risk assessment",
              "Make-good obligation analysis",
              "Rent review clause negotiation",
              "Fitout contribution and incentive negotiation",
              "Final lease walkthrough before execution",
              "Coordination with your solicitor",
            ].map((service, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "20px 0", borderBottom: "1px solid #F0F0F0" }}>
                <div style={{ width: "8px", height: "8px", background: "#00B5A5", borderRadius: "50%", marginTop: "6px", flexShrink: 0 }} />
                <p style={{ color: "#333333", fontWeight: 400, fontSize: "15px", lineHeight: "1.5" }}>{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — DARK */}
      <section style={{ background: "#1A1A1A", padding: "112px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(30px, 4vw, 50px)", lineHeight: "1.1", marginBottom: "20px" }}>
            Ready to negotiate from strength?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300, fontSize: "18px", lineHeight: "1.65", marginBottom: "48px" }}>
            20 minutes. Tell us about your lease situation. We will tell you whether we can help and what the realistic outcome looks like.
          </p>
          <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354"
            style={{ background: "#00B5A5", color: "#ffffff", fontWeight: 600, fontSize: "18px", padding: "18px 40px", borderRadius: "4px", textDecoration: "none", letterSpacing: "0.02em" }}>
            Book a Clarity Call
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111111", padding: "64px 5% 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "48px", marginBottom: "64px" }}>
            <div>
              <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px", marginBottom: "12px", letterSpacing: "0.04em" }}>YOUR OFFICE SPACE</p>
              <p style={{ color: "#9B9B9B", fontWeight: 300, fontSize: "14px", lineHeight: "1.7" }}>Newcastle's commercial property team. Lease, fitout, furniture, cleaning.</p>
            </div>
            <div>
              <p style={{ color: "#ffffff", fontWeight: 600, fontSize: "13px", marginBottom: "16px", letterSpacing: "0.08em" }}>SERVICES</p>
              {[["Tenant Rep", "/tenant-rep"], ["Buyers Agency", "/buyers-agency"], ["Furniture", "/furniture"], ["Cleaning", "/cleaning"]].map(([s, h]) => (
                <Link key={s} href={h} style={{ display: "block", color: "#9B9B9B", fontSize: "14px", textDecoration: "none", marginBottom: "10px" }}>{s}</Link>
              ))}
            </div>
            <div>
              <p style={{ color: "#ffffff", fontWeight: 600, fontSize: "13px", marginBottom: "16px", letterSpacing: "0.08em" }}>RESOURCES</p>
              {["Lease Review Tool", "Fitout Estimator", "Cap Rate Calculator", "Lease Comparison"].map((s) => (
                <p key={s} style={{ color: "#9B9B9B", fontSize: "14px", marginBottom: "10px" }}>{s}</p>
              ))}
            </div>
            <div>
              <p style={{ color: "#ffffff", fontWeight: 600, fontSize: "13px", marginBottom: "16px", letterSpacing: "0.08em" }}>CONTACT</p>
              <p style={{ color: "#9B9B9B", fontSize: "14px", marginBottom: "10px" }}>jk@yourofficespace.au</p>
              <p style={{ color: "#9B9B9B", fontSize: "14px", marginBottom: "10px" }}>0434 655 511</p>
              <p style={{ color: "#9B9B9B", fontSize: "14px" }}>Newcastle, NSW 2300</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ color: "#9B9B9B", fontSize: "12px" }}>NSW Real Estate Licence — Class 2</p>
            <p style={{ color: "#9B9B9B", fontSize: "12px" }}>© {new Date().getFullYear()} Your Office Space Pty Ltd</p>
          </div>
        </div>
      </footer>
    </>
  );
}
