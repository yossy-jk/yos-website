'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

type SearchResult = {
  title: string
  description: string
  href: string
  category: string
}

const ALL_ITEMS: SearchResult[] = [
  // Services
  { title: 'Tenant Representation', description: 'We negotiate your office lease on your side. Newcastle and Hunter Region.', href: '/tenant-rep', category: 'Service' },
  { title: 'Commercial Cleaning', description: 'Healthcare, aged care and government-grade cleaning contracts from $2k/month.', href: '/cleaning', category: 'Service' },
  { title: 'Furniture & Fitout', description: 'Commercial furniture supply and project-managed fitouts across NSW.', href: '/furniture', category: 'Service' },
  { title: 'Buyers Agency', description: 'Commercial property buyers agent for Newcastle and Hunter.', href: '/buyers-agency', category: 'Service' },
  // Tools
  { title: 'Lease Risk Checker', description: 'Answer 10 questions and get an instant risk rating on your commercial lease.', href: '/resources/lease-review', category: 'Tool' },
  { title: 'Fitout Cost Estimator', description: 'Estimate your office fitout cost using 2026 Newcastle market rates.', href: '/resources/fitout-estimator', category: 'Tool' },
  { title: 'Lease Comparison Tool', description: 'Compare up to three lease options on true occupancy cost.', href: '/resources/lease-comparison', category: 'Tool' },
  { title: 'Office Size Calculator', description: 'Work out how much space your team actually needs.', href: '/resources/office-size-calculator', category: 'Tool' },
  { title: 'Should I Relocate?', description: 'Six-question quiz gives you a Red, Amber or Green verdict on moving offices.', href: '/resources/relocate-quiz', category: 'Tool' },
  { title: 'Lease vs Buy Calculator', description: 'Model the true cost of leasing versus buying over 5, 10 and 15 years.', href: '/resources/lease-vs-buy', category: 'Tool' },
  { title: 'Stamp Duty Calculator', description: 'NSW commercial property transfer duty estimate. 2025-26 rates.', href: '/resources/stamp-duty-calculator', category: 'Tool' },
  { title: 'Rental Yield Calculator', description: 'Gross and net yield on commercial property, including outgoings and vacancy.', href: '/resources/rental-yield-calculator', category: 'Tool' },
  { title: 'Cap Rate Calculator', description: 'Capitalisation rate and implied valuation for commercial investment property.', href: '/resources/cap-rate-calculator', category: 'Tool' },
  { title: 'Land Tax Calculator', description: 'Annual land tax liability across all Australian states.', href: '/resources/land-tax-calculator', category: 'Tool' },
  { title: 'Purchase Checklist', description: '25-point due diligence checklist for NSW commercial property buyers.', href: '/resources/purchase-checklist', category: 'Tool' },
  { title: 'Workspace Builder', description: 'Plan your office layout — rooms, desks, and space requirements.', href: '/resources/workspace-builder', category: 'Tool' },
  { title: 'LeaseIntel Report', description: 'Full professional lease review. Free for Newcastle businesses until July 2026.', href: '/leaseintel', category: 'Tool' },
  // Pages
  { title: 'About Your Office Space', description: 'Who we are, what we do, and how we work with Newcastle businesses.', href: '/about', category: 'Page' },
  { title: 'Contact', description: 'Get in touch with the YOS team in Newcastle.', href: '/contact', category: 'Page' },
  { title: 'Case Studies', description: 'Real projects across tenant rep, furniture, cleaning and buyers agency.', href: '/case-studies', category: 'Page' },
  { title: 'Blog & Articles', description: 'Commercial property guides, market insights and practical advice.', href: '/blog', category: 'Page' },
  { title: 'Resources & Tools', description: 'All free tools, calculators and market resources in one place.', href: '/resources', category: 'Page' },
  { title: 'Newcastle Office Market Snapshot', description: 'Monthly tenant-side market report. Vacancy, rents and trends.', href: '/market-snapshot', category: 'Page' },
  // Blog articles
  { title: 'What Is Tenant Representation?', description: 'How a tenant rep works, what it costs, and why you need one.', href: '/blog/what-is-tenant-representation-newcastle', category: 'Article' },
  { title: 'Fitout Costs in Newcastle 2026', description: 'What a commercial fitout actually costs per sqm in Newcastle this year.', href: '/blog/commercial-fitout-cost-newcastle-2026', category: 'Article' },
  { title: 'Make Good: What It Really Means', description: 'Your make-good obligations at lease end — and how to negotiate them.', href: '/blog/what-is-make-good', category: 'Article' },
  { title: 'Buying Commercial Property in 2026', description: 'A guide to purchasing commercial property in Newcastle and the Hunter.', href: '/blog/buying-commercial-property-newcastle-2026', category: 'Article' },
]

const CATEGORY_COLOURS: Record<string, string> = {
  Service: 'text-teal',
  Tool: 'text-emerald-400',
  Page: 'text-white/40',
  Article: 'text-violet-400',
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(0,181,165,0.25)', color: '#00B5A5', borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function Search() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = query.trim().length < 1
    ? ALL_ITEMS.slice(0, 8)
    : ALL_ITEMS.filter(item =>
        [item.title, item.description, item.category].some(f =>
          f.toLowerCase().includes(query.toLowerCase())
        )
      ).slice(0, 10)

  const openSearch = useCallback(() => {
    setOpen(true)
    setQuery('')
    setActive(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  // Keyboard shortcut — Cmd/Ctrl + K
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? closeSearch() : openSearch()
      }
      if (e.key === 'Escape' && open) closeSearch()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, openSearch, closeSearch])

  // Arrow key navigation
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
      if (e.key === 'Enter' && results[active]) {
        window.location.href = results[active].href
        closeSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, active, results, closeSearch])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.children[active] as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  useEffect(() => {
    setActive(0)
  }, [query])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Search trigger button — shown in nav */}
      <button
        onClick={openSearch}
        aria-label="Search"
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 outline-none focus:outline-none"
        style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline" style={{
          fontSize: '0.55rem', padding: '0.15rem 0.4rem', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '3px', color: 'rgba(255,255,255,0.35)', fontFamily: 'inherit', letterSpacing: '0.05em'
        }}>⌘K</kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center"
          style={{ paddingTop: 'clamp(4rem,10vw,8rem)', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeSearch() }}
        >
          <div
            className="w-full bg-near-black border border-white/10 shadow-2xl"
            style={{ maxWidth: '640px', margin: '0 clamp(1rem,4vw,2rem)', borderRadius: '0.75rem', overflow: 'hidden' }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-white/10" style={{ padding: '1rem 1.25rem' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, color: 'rgba(255,255,255,0.3)' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search services, tools, articles..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/25 font-light"
                style={{ fontSize: '0.95rem' }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-white/30 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <button onClick={closeSearch}
                className="text-white/25 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                style={{ fontSize: '0.6rem', letterSpacing: '0.1em', padding: '0.25rem 0.5rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px' }}>
                ESC
              </button>
            </div>

            {/* Results */}
            <ul ref={listRef} role="listbox" style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.5rem 0', margin: 0, listStyle: 'none' }}>
              {results.length === 0 ? (
                <li style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
                  No results for &ldquo;{query}&rdquo;
                </li>
              ) : results.map((item, i) => (
                <li key={item.href} role="option" aria-selected={i === active}>
                  <Link
                    href={item.href}
                    onClick={closeSearch}
                    onMouseEnter={() => setActive(i)}
                    className="no-underline flex items-start gap-3"
                    style={{
                      display: 'flex', padding: '0.875rem 1.25rem',
                      background: i === active ? 'rgba(255,255,255,0.05)' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    {/* Icon */}
                    <span className="flex-shrink-0 mt-0.5" style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.category === 'Tool' && (
                        <svg width="12" height="12" fill="none" stroke="#00B5A5" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
                        </svg>
                      )}
                      {item.category === 'Service' && (
                        <svg width="12" height="12" fill="none" stroke="#00B5A5" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      )}
                      {item.category === 'Article' && (
                        <svg width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                        </svg>
                      )}
                      {item.category === 'Page' && (
                        <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      )}
                    </span>
                    {/* Text */}
                    <span className="flex-1 min-w-0">
                      <span className="block text-white font-semibold" style={{ fontSize: '0.875rem', lineHeight: 1.3, marginBottom: '0.2rem' }}>
                        {highlight(item.title, query)}
                      </span>
                      <span className="block text-white/40 font-light" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                        {highlight(item.description, query)}
                      </span>
                    </span>
                    {/* Category badge */}
                    <span className={`flex-shrink-0 font-semibold uppercase mt-0.5 ${CATEGORY_COLOURS[item.category]}`}
                      style={{ fontSize: '0.58rem', letterSpacing: '0.15em' }}>
                      {item.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-white/10 flex items-center gap-4" style={{ padding: '0.75rem 1.25rem' }}>
              <span className="text-white/20 font-light" style={{ fontSize: '0.65rem' }}>
                <kbd style={{ fontFamily: 'inherit', padding: '0.1rem 0.3rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', marginRight: '3px' }}>↑↓</kbd>
                navigate
              </span>
              <span className="text-white/20 font-light" style={{ fontSize: '0.65rem' }}>
                <kbd style={{ fontFamily: 'inherit', padding: '0.1rem 0.3rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', marginRight: '3px' }}>↵</kbd>
                open
              </span>
              <span className="text-white/20 font-light" style={{ fontSize: '0.65rem' }}>
                <kbd style={{ fontFamily: 'inherit', padding: '0.1rem 0.3rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', marginRight: '3px' }}>ESC</kbd>
                close
              </span>
              {!query && <span className="text-white/15 font-light ml-auto" style={{ fontSize: '0.65rem' }}>
                {ALL_ITEMS.length} pages indexed
              </span>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
