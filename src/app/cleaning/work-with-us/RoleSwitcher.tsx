'use client'
export default function RoleSwitcher() {
  return (
    <section style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.875rem 0' }}>
      <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Also hiring:</span>
        <a href="/cleaning/work-with-us/cleaning"
          className="role-switch-link"
          style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', letterSpacing: '0.08em', textDecoration: 'none', padding: '0.3rem 0.875rem', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.15s' }}>
          Cleaning Specialists →
        </a>
      </div>
      <style>{`.role-switch-link:hover { color: white !important; border-color: rgba(255,255,255,0.3) !important; }`}</style>
    </section>
  )
}
