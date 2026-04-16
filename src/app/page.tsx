import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO — full viewport, dark overlay on real office image */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Premium Newcastle commercial office space"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,26,0.78)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto", padding: "0 5%", paddingTop: "72px" }}>
          <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "24px" }}>
            Newcastle Commercial Property
          </p>
          <h1 style={{
            color: "#ffffff", fontWeight: 700,
            fontSize: "clamp(40px, 6vw, 80px)",
            lineHeight: "1.05", letterSpacing: "-0.02em",
            maxWidth: "800px", marginBottom: "28px"
          }}>
            Your space is your competitive advantage.
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)", fontWeight: 300,
            fontSize: "clamp(18px, 2vw, 22px)", lineHeight: "1.6",
            maxWidth: "580px", marginBottom: "48px"
          }}>
            We handle the lease, the fitout, the furniture, and the cleaning. One team. Your interests first. Newcastle through and through.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354"
              style={{
                background: "#00B5A5", color: "#ffffff", fontWeight: 600,
                fontSize: "16px", padding: "16px 32px", borderRadius: "4px",
                textDecoration: "none", letterSpacing: "0.02em"
              }}>
              Book a Clarity Call
            </a>
            <Link href="/resources"
              style={{
                background: "transparent", color: "#ffffff", fontWeight: 600,
                fontSize: "16px", padding: "16px 32px", borderRadius: "4px",
                textDecoration: "none", border: "2px solid rgba(255,255,255,0.4)",
                letterSpacing: "0.02em"
              }}>
              Explore free tools
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "0.1em", textAlign: "center" }}>
          <div style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.2)", margin: "0 auto 8px" }} />
          SCROLL
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #F5F5F5", padding: "32px 5%" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0", alignItems: "center"
        }}>
          {[
            { stat: "100+", label: "Fitouts delivered" },
            { stat: "Newcastle & Hunter", label: "Exclusively local" },
            { stat: "Tenant-side only", label: "No conflicts of interest" },
            { stat: "Lease to clean", label: "End-to-end service" },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "16px 32px",
              borderRight: i < 3 ? "1px solid #F0F0F0" : "none",
              textAlign: "center"
            }}>
              <p style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "18px", marginBottom: "4px" }}>{item.stat}</p>
              <p style={{ color: "#9B9B9B", fontWeight: 400, fontSize: "13px" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: "#ffffff", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
            What we do
          </p>
          <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: "1.15", marginBottom: "72px", maxWidth: "600px" }}>
            Every part of the workspace problem. One team.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
            {[
              {
                title: "Tenant Rep",
                tagline: "Your lease. Your terms. Your call.",
                body: "We represent the tenant — never the landlord. Every negotiation, every clause, every deal is done purely in your interest. Most businesses sign without anyone in their corner. Ours don't.",
                href: "/tenant-rep",
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
                alt: "Commercial lease negotiation"
              },
              {
                title: "Buyers Agency",
                tagline: "Buy commercial in Newcastle without getting burned.",
                body: "Off-market access, rigorous due diligence, and hard negotiations — handled by someone who does this every day. Not just when your lease expires.",
                href: "/buyers-agency",
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                alt: "Commercial property Newcastle"
              },
              {
                title: "Furniture",
                tagline: "Spaces that work. Furniture that lasts.",
                body: "Government-approved supplier. Fitout project management, ergonomic workstations, full office solutions — delivered across Newcastle and the Hunter Valley.",
                href: "/furniture",
                img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
                alt: "Premium office furniture"
              },
              {
                title: "Cleaning",
                tagline: "Shows up. Does the job. Every time.",
                body: "Commercial cleaning for offices, childcare centres, medical practices, and industrial facilities. Consistent, accountable, and Newcastle-based.",
                href: "/cleaning",
                img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
                alt: "Commercial cleaning Newcastle"
              },
            ].map((s) => (
              <div key={s.title} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "240px", overflow: "hidden", marginBottom: "0" }}>
                  <Image src={s.img} alt={s.alt} fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ borderTop: "4px solid #00B5A5", paddingTop: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "22px", marginBottom: "8px" }}>{s.title}</h3>
                  <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "14px", marginBottom: "14px" }}>{s.tagline}</p>
                  <p style={{ color: "#333333", fontWeight: 400, fontSize: "15px", lineHeight: "1.65", marginBottom: "20px", flex: 1 }}>{s.body}</p>
                  <Link href={s.href} style={{ color: "#00B5A5", fontWeight: 600, fontSize: "14px", textDecoration: "none", letterSpacing: "0.02em" }}>
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY YOS — DARK */}
      <section style={{ background: "#1A1A1A", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "80px", alignItems: "start" }}>
          <div>
            <p style={{ color: "#00B5A5", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Why YOS</p>
            <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: "1.15", marginBottom: "32px" }}>
              One team.<br />No conflicts.<br />No shortcuts.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300, fontSize: "16px", lineHeight: "1.7" }}>
              Most commercial property advisors work both sides of the deal. We don't. Every decision we make is in your interest — because that's the only interest we have.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {[
              {
                label: "Tenant-side only",
                body: "We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we are negotiating for you."
              },
              {
                label: "Newcastle-first",
                body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database."
              },
              {
                label: "End-to-end",
                body: "Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running properly."
              },
            ].map((p) => (
              <div key={p.label} style={{ paddingLeft: "24px", borderLeft: "4px solid #00B5A5" }}>
                <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>{p.label}</p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300, fontSize: "15px", lineHeight: "1.7" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE HUB — TEAL */}
      <section style={{ background: "#00B5A5", padding: "112px 5%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "64px", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Free tools</p>
            <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: "1.15", marginBottom: "20px" }}>
              Built for Newcastle businesses. Free to use.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 300, fontSize: "18px", lineHeight: "1.65", marginBottom: "40px" }}>
              Lease review analysis. Fitout cost estimator. Cap rate calculator. Commercial lease comparison. No signup required to start.
            </p>
            <Link href="/resources" style={{
              display: "inline-block", background: "#1A1A1A", color: "#ffffff",
              fontWeight: 600, fontSize: "16px", padding: "16px 32px",
              borderRadius: "4px", textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Explore the Resource Hub →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Lease Review Analysis — free basic report, $150 detailed",
              "Fitout Cost Estimator — Newcastle market rates",
              "Cap Rate Calculator — for commercial investors",
              "Lease Comparison Tool — true cost across 3 options",
              "Commercial Purchase Checklist — 25-point due diligence",
            ].map((tool, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.15)", borderRadius: "4px",
                padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px"
              }}>
                <div style={{ width: "8px", height: "8px", background: "#ffffff", borderRadius: "50%", flexShrink: 0 }} />
                <p style={{ color: "#ffffff", fontWeight: 400, fontSize: "15px" }}>{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section style={{ background: "#F5F5F5", padding: "112px 5%" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#00B5A5", fontWeight: 700, fontSize: "64px", lineHeight: "1", marginBottom: "24px" }}>"</p>
          <p style={{ color: "#1A1A1A", fontWeight: 300, fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: "1.65", marginBottom: "32px" }}>
            Thanks to Joe and the YOS team, we now have a state-of-the-art facility that not only meets but exceeds our expectations. I wholeheartedly recommend them to anyone seeking a dedicated and knowledgeable commercial property advisor in Newcastle.
          </p>
          <p style={{ color: "#9B9B9B", fontWeight: 600, fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Newcastle Business Owner
          </p>
        </div>
      </section>

      {/* FINAL CTA — DARK */}
      <section style={{ background: "#1A1A1A", padding: "112px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: "1.1", marginBottom: "20px" }}>
            Ready to talk?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300, fontSize: "18px", lineHeight: "1.65", marginBottom: "48px" }}>
            20 minutes. No pitch. Just a conversation about what you are trying to build and whether we can help.
          </p>
          <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354"
            style={{
              background: "#00B5A5", color: "#ffffff", fontWeight: 600,
              fontSize: "18px", padding: "18px 40px", borderRadius: "4px",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
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
              {["Tenant Rep", "Buyers Agency", "Furniture", "Cleaning"].map((s) => (
                <Link key={s} href={`/${s.toLowerCase().replace(" ", "-")}`} style={{ display: "block", color: "#9B9B9B", fontSize: "14px", textDecoration: "none", marginBottom: "10px" }}>{s}</Link>
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
