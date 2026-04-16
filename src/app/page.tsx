import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* NAVIGATION */}
      <nav style={{ background: '#1A1A1A', padding: '0 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          <Link href="/" style={{ color: '#ffffff', fontWeight: 700, fontSize: '20px', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            YOUR OFFICE SPACE
          </Link>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="/tenant-rep" style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '14px', textDecoration: 'none' }}>Tenant Rep</Link>
            <Link href="/buyers-agency" style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '14px', textDecoration: 'none' }}>Buyers Agency</Link>
            <Link href="/furniture" style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '14px', textDecoration: 'none' }}>Furniture</Link>
            <Link href="/cleaning" style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '14px', textDecoration: 'none' }}>Cleaning</Link>
            <Link href="/resources" style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '14px', textDecoration: 'none' }}>Resources</Link>
            <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354" className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>Book a Call</a>
          </div>
        </div>
      </nav>

      {/* HERO — DARK */}
      <section style={{ background: '#1A1A1A', padding: '120px 5%' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ color: '#00B5A5', fontWeight: 600, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
            Newcastle Commercial Property
          </p>
          <h1 style={{ color: '#ffffff', fontWeight: 700, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            Newcastle businesses deserve someone in their corner.
          </h1>
          <p style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '20px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '600px' }}>
            We handle the lease, the fitout, the furniture, and the cleaning. You focus on the business.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354" className="btn-primary">
              Book a Clarity Call
            </a>
            <Link href="/resources" className="btn-ghost">
              Explore free tools
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES — WHITE */}
      <section style={{ background: '#ffffff', padding: '96px 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: '#9B9B9B', fontWeight: 600, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            What we do
          </p>
          <h2 style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: '1.2', marginBottom: '64px', maxWidth: '560px' }}>
            One team. Every part of the workspace problem.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            {[
              { title: 'Tenant Rep', tagline: 'Your lease. Your terms. Your call.', body: 'We represent the tenant — not the landlord. Every lease negotiation, clause review, and deal is done in your interest only.', href: '/tenant-rep' },
              { title: 'Buyers Agency', tagline: 'Buy commercial in Newcastle without getting burned.', body: 'Off-market access, due diligence, and negotiations handled by someone who does this every day. Not just when your lease expires.', href: '/buyers-agency' },
              { title: 'Furniture', tagline: 'Spaces that work. Furniture that lasts.', body: 'Government-approved supplier. Fitout project management, ergonomic workstations, and everything in between — Newcastle to Hunter Valley.', href: '/furniture' },
              { title: 'Cleaning', tagline: 'Shows up. Does the job. Every time.', body: 'Commercial cleaning for offices, childcare centres, medical practices, and industrial facilities. Sarah runs the division. Standards are non-negotiable.', href: '/cleaning' },
            ].map((service) => (
              <div key={service.title} style={{ borderLeft: '4px solid #00B5A5', paddingLeft: '24px' }}>
                <h3 style={{ color: '#1A1A1A', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>{service.title}</h3>
                <p style={{ color: '#00B5A5', fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>{service.tagline}</p>
                <p style={{ color: '#333333', fontWeight: 400, fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>{service.body}</p>
                <Link href={service.href} style={{ color: '#00B5A5', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY YOS — DARK */}
      <section style={{ background: '#1A1A1A', padding: '96px 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#00B5A5', fontWeight: 600, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Why YOS
            </p>
            <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: '1.2' }}>
              One team. No conflicts. No shortcuts.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              { label: 'Tenant-side only', body: 'We never represent landlords. No conflict of interest. Ever.' },
              { label: 'Newcastle-first', body: "We live and work here. This isn't a Sydney firm that flies in for big deals and disappears." },
              { label: 'End-to-end', body: 'Lease to clean. One relationship, one accountable team, from your first decision to the day you move in.' },
            ].map((point) => (
              <div key={point.label} style={{ borderLeft: '4px solid #00B5A5', paddingLeft: '24px' }}>
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{point.label}</p>
                <p style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '15px', lineHeight: '1.6' }}>{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE HUB CTA — TEAL */}
      <section style={{ background: '#00B5A5', padding: '96px 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: '1.2', marginBottom: '16px' }}>
              Free tools built for Newcastle businesses.
            </h2>
            <p style={{ color: '#E0F5F3', fontWeight: 400, fontSize: '18px', lineHeight: '1.6' }}>
              Lease review analysis. Fitout cost estimator. Cap rate calculator. Lease comparison. No signup required to start.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/resources" style={{ display: 'inline-block', background: '#1A1A1A', color: '#ffffff', fontWeight: 600, fontSize: '16px', letterSpacing: '0.05em', padding: '14px 32px', borderRadius: '4px', textDecoration: 'none' }}>
              Explore the Resource Hub →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT CTA — DARK */}
      <section style={{ background: '#1A1A1A', padding: '96px 5%', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: '1.2', marginBottom: '16px' }}>
            Ready to talk?
          </h2>
          <p style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
            Book a 20-minute clarity call. No pitch. Just a conversation about your space and what you are trying to do.
          </p>
          <a href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354" className="btn-primary" style={{ fontSize: '16px' }}>
            Book a Clarity Call
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111111', padding: '48px 5%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>YOUR OFFICE SPACE</p>
            <p style={{ color: '#9B9B9B', fontWeight: 400, fontSize: '13px' }}>Newcastle, NSW</p>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <Link href="/tenant-rep" style={{ color: '#9B9B9B', fontSize: '13px', textDecoration: 'none' }}>Tenant Rep</Link>
            <Link href="/buyers-agency" style={{ color: '#9B9B9B', fontSize: '13px', textDecoration: 'none' }}>Buyers Agency</Link>
            <Link href="/furniture" style={{ color: '#9B9B9B', fontSize: '13px', textDecoration: 'none' }}>Furniture</Link>
            <Link href="/cleaning" style={{ color: '#9B9B9B', fontSize: '13px', textDecoration: 'none' }}>Cleaning</Link>
            <Link href="/resources" style={{ color: '#9B9B9B', fontSize: '13px', textDecoration: 'none' }}>Resources</Link>
            <Link href="/contact" style={{ color: '#9B9B9B', fontSize: '13px', textDecoration: 'none' }}>Contact</Link>
          </div>
          <p style={{ color: '#9B9B9B', fontSize: '12px' }}>
            jk@yourofficespace.au · 0434 655 511
          </p>
        </div>
      </footer>
    </main>
  );
}
