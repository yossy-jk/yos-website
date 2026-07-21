'use client'

const AGENTS = [
  { name: 'CBRE',              src: '/agent-logos/cbre.svg',         alt: 'CBRE' },
  { name: 'JLL',               src: '/agent-logos/jll.svg',          alt: 'JLL' },
  { name: 'Knight Frank',       src: '/agent-logos/knightfrank.svg',  alt: 'Knight Frank' },
  { name: 'Colliers',           src: '/agent-logos/colliers.svg',     alt: 'Colliers' },
  { name: 'Cushman & Wakefield', src: '/agent-logos/cushman.svg',   alt: 'Cushman & Wakefield' },
  { name: 'Savills',            src: '/agent-logos/savills.svg',      alt: 'Savills' },
  { name: 'LJ Hooker Commercial', src: '/agent-logos/ljhooker.svg',  alt: 'LJ Hooker Commercial' },
  { name: 'Macquarie Commercial', src: '/agent-logos/macquarie.svg',  alt: 'Macquarie Commercial' },
]

export default function AgentNetworkBanner() {
  return (
    <section
      className="agent-network-banner overflow-hidden"
      aria-label="Commercial real estate agent network"
    >
      {/* ─── Stats headline ─── */}
      <div className="max-w-screen-xl mx-auto text-center mb-8 px-8">
        <p className="text-teal font-black uppercase tracking-widest mb-3"
          style={{ fontSize: '0.65rem', letterSpacing: '0.3em' }}>
          Our Network
        </p>
        <p className="text-white font-black leading-tight"
          style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', maxWidth: '52rem', margin: '0 auto' }}>
          Over 74% of commercial property deals happen{' '}
          <span className="text-teal">off-market.</span>
          {' '}We know the agents and developers who make it happen.
        </p>
      </div>

      {/* ─── Marquee ─── */}
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div className="agent-marquee-track flex items-center gap-16 whitespace-nowrap">
          {[...AGENTS, ...AGENTS].map((agent, i) => (
            <div
              key={`${agent.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ height: 'clamp(2.5rem,5vw,3.5rem)', padding: '0 1.5rem' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={agent.src}
                alt={agent.alt}
                className="h-full w-auto max-w-[10rem] object-contain opacity-60 hover:opacity-100 transition-opacity duration-200"
                style={{ minWidth: '6rem' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
