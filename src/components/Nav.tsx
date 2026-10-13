'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { SERVICE_LINKS, CONTACT } from '@/lib/constants'
import Search from '@/components/Search'
import { FLOURISH_LINKS } from '@/lib/flourish-links'

const TOOLS_LEASING = [
  { label: 'Lease Risk Checker', href: '/resources/lease-review', tagline: 'Spot hidden obligations before you sign.' },
  { label: 'Lease Comparison', href: '/resources/lease-comparison', tagline: 'Compare two leases side by side.' },
  { label: 'Should I Relocate?', href: '/resources/relocate-quiz', tagline: 'Is it time to move offices?' },
  { label: 'Office Size Calculator', href: '/resources/office-size-calculator', tagline: 'How much space does your team need?' },
  { label: 'Fitout Estimator', href: '/resources/fitout-estimator', tagline: 'Budget your office fitout accurately.' },
]

const BLOG_HIGHLIGHTS = [
  { label: 'Newcastle Commercial Property Hub', href: '/newcastle-commercial-property' },
  { label: 'What Is Tenant Representation?', href: '/blog/what-is-tenant-representation-newcastle' },
  { label: 'Fitout Costs in Newcastle 2026', href: '/blog/commercial-fitout-cost-newcastle-2026' },
  { label: 'Make Good: What It Really Means', href: '/blog/what-is-make-good' },
]

const MOBILE_SERVICES = [
  { label: 'Tenant Representation', href: '/tenant-rep' },
  { label: 'Buyers Agency', href: '/buyers-agency' },
  { label: 'Office FitOut', href: '/office-fitout' },
  { label: 'Office Furniture', href: '/furniture' },
  { label: 'Commercial Cleaning', href: '/cleaning' },
]

const NAV_LINKS_SIMPLE = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<'services' | 'care' | 'resources' | null>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)
  const servicesButtonRef = useRef<HTMLButtonElement>(null)
  const resourcesButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const background = [...document.querySelectorAll<HTMLElement>('main, footer')]
    const previousInert = background.map(element => element.inert)
    document.body.style.overflow = 'hidden'
    background.forEach(element => { element.inert = true })
    mobileMenuButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      background.forEach((element, index) => { element.inert = previousInert[index] })
    }
  }, [open])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (open && e.key === 'Tab') {
        const items = [document.querySelector<HTMLElement>('.yos-nav-logo'), mobileMenuButtonRef.current, ...(mobilePanelRef.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])].filter((element): element is HTMLElement => Boolean(element?.getClientRects().length))
        const first = items[0], last = items.at(-1)
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
      if (e.key !== 'Escape') return

      if (open) {
        setOpen(false)
        mobileMenuButtonRef.current?.focus()
        return
      }
      if (servicesOpen) {
        setServicesOpen(false)
        servicesButtonRef.current?.focus()
        return
      }
      if (resourcesOpen) {
        setResourcesOpen(false)
        resourcesButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, resourcesOpen, servicesOpen])

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1280px)')
    const closeOnWide = () => { if (wide.matches) { setOpen(false); setMobileSection(null) } }
    wide.addEventListener('change', closeOnWide)
    return () => wide.removeEventListener('change', closeOnWide)
  }, [])

  const NAV_H = 80

  const closeMobile = () => { setOpen(false); setMobileSection(null) }
  const toggleMobile = () => { setOpen(!open); setMobileSection(null) }
  const closeAll = () => { setServicesOpen(false); setResourcesOpen(false) }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <nav className={`yos-navigation fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-near-black border-b border-white/10' : 'bg-near-black/95 backdrop-blur-md'
      }`}>
        <div
          className="yos-nav-header max-w-screen-xl mx-auto flex justify-between items-center h-16 md:h-20"
          style={{ paddingLeft: 'clamp(1.25rem,5vw,4rem)', paddingRight: 'clamp(1.25rem,5vw,4rem)' }}
        >
          <Link href="/" onClick={closeMobile} aria-label="Your Office Space home"
            className="yos-nav-logo relative z-50 flex shrink-0 items-center no-underline">
            <Image src="/brand/yos-logo-white.png" alt="Your Office Space" width={3148} height={482} sizes="(min-width: 1200px) 210px, 150px" className="h-[23px] w-auto xl:h-8" priority />
          </Link>

          <div className="hidden xl:flex gap-7 items-center">

            {/* ── Services dropdown ── */}
            <div className="relative" ref={servicesRef}>
              <button
                ref={servicesButtonRef}
                onClick={() => { setServicesOpen(v => !v); setResourcesOpen(false) }}
                className="text-white/60 font-medium hover:text-white transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                aria-expanded={servicesOpen}
                aria-controls="desktop-services-menu"
                aria-haspopup="true"
              >
                Services
                <svg style={{ width: '0.6rem', height: '0.6rem', transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div id="desktop-services-menu" hidden={!servicesOpen} aria-hidden={!servicesOpen}
                className="fixed left-0 right-0 bg-near-black border-b border-white/10 shadow-2xl z-50"
                style={{ top: `${NAV_H}px` }}>
                  <div className="max-w-screen-xl mx-auto"
                    style={{ padding: `0 clamp(1.5rem,5vw,4rem)` }}>
                    <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {SERVICE_LINKS.map((link, i) => (
                        <Link key={link.href} href={link.href} onClick={closeAll}
                          className="no-underline group flex flex-col bg-near-black hover:bg-white/[0.04] transition-colors"
                          style={{
                            padding: '2rem 2rem', flex: '1 1 0',
                            borderRight: i < SERVICE_LINKS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                            minWidth: 0,
                          }}>
                          <span className="text-white font-bold block group-hover:text-teal transition-colors"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.02em', marginBottom: '0.625rem' }}>
                            {link.label}
                          </span>
                          <span className="text-white/55 font-light block" style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
                            {link.tagline}
                          </span>
                          <span className="text-teal/0 group-hover:text-teal/70 transition-colors block mt-auto pt-3" style={{ fontSize: '0.65rem', fontWeight: 600 }}>→</span>
                        </Link>
                      ))}
                    </div>
                    <div className="py-5 flex flex-wrap items-center gap-x-7 gap-y-3">
                      <Link href="/flourish" onClick={closeAll} className="text-teal font-bold text-sm no-underline hover:text-white">Flourish workplace care</Link>
                      {FLOURISH_LINKS.map(link => <Link key={link.href} href={link.href} onClick={closeAll} className="inline-flex min-h-11 items-center text-white/80 hover:text-white text-sm no-underline">{link.label}</Link>)}
                    </div>
                  </div>
              </div>
            </div>

            {/* ── Resources dropdown ── */}
            <div className="relative" ref={resourcesRef}>
              <button
                ref={resourcesButtonRef}
                onClick={() => { setResourcesOpen(v => !v); setServicesOpen(false) }}
                className="text-white/60 font-medium hover:text-white transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                aria-expanded={resourcesOpen}
                aria-controls="desktop-resources-menu"
                aria-haspopup="true"
              >
                Resources
                <svg style={{ width: '0.6rem', height: '0.6rem', transition: 'transform 0.2s', transform: resourcesOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div id="desktop-resources-menu" hidden={!resourcesOpen} aria-hidden={!resourcesOpen}
                className="fixed left-0 right-0 bg-near-black border-b border-white/10 shadow-2xl z-50"
                style={{ top: `${NAV_H}px` }}>
                  <div className="max-w-screen-xl mx-auto"
                    style={{ padding: `0 clamp(1.5rem,5vw,4rem)` }}>
                    <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

                      {/* Col 1. Leasing Tools */}
                      <div style={{ flex: '1 1 0', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '1.75rem 1.75rem 1.75rem 0' }}>
                        <p className="text-teal font-bold uppercase" style={{ fontSize: '0.58rem', letterSpacing: '0.25em', marginBottom: '1rem' }}>Leasing Tools</p>
                        <div className="flex flex-col" style={{ gap: '0.1rem' }}>
                          {TOOLS_LEASING.map(tool => (
                            <Link key={tool.href} href={tool.href} onClick={closeAll}
                              className="no-underline group flex flex-col hover:bg-white/[0.04] transition-colors"
                              style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem' }}>
                              <span className="text-white font-semibold block group-hover:text-teal transition-colors"
                                style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                                {tool.label}
                              </span>
                              <span className="text-white/55 font-light block" style={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                                {tool.tagline}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <Link href="/resources" onClick={closeAll}
                            className="no-underline text-teal hover:text-teal font-semibold transition-colors"
                            style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            All tools →
                          </Link>
                        </div>
                      </div>

                      {/* Col 2. Blog */}
                      <div style={{ flex: '1 1 0', padding: '1.75rem 0 1.75rem 1.75rem' }}>
                        <p className="text-teal font-bold uppercase" style={{ fontSize: '0.58rem', letterSpacing: '0.25em', marginBottom: '1rem' }}>Latest Articles</p>
                        <div className="flex flex-col" style={{ gap: '0.1rem' }}>
                          {BLOG_HIGHLIGHTS.map(post => (
                            <Link key={post.href} href={post.href} onClick={closeAll}
                              className="no-underline group flex items-start gap-2.5 hover:bg-white/[0.04] transition-colors"
                              style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem' }}>
                              <span className="text-white/20 group-hover:text-teal/50 transition-colors flex-shrink-0 mt-0.5" style={{ fontSize: '0.65rem' }}>→</span>
                              <span className="text-white/65 font-light group-hover:text-white transition-colors"
                                style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                                {post.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <Link href="/blog" onClick={closeAll}
                            className="no-underline text-teal hover:text-teal font-semibold transition-colors"
                            style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            View all articles →
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
              </div>
            </div>

            {/* Plain links */}
            {NAV_LINKS_SIMPLE.map(link => (
              <Link key={link.href} href={link.href}
                className="text-white/60 font-medium hover:text-white transition-colors no-underline"
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {link.label}
              </Link>
            ))}

            <Search />

            <a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`}
              className="text-white/75 font-semibold hover:text-teal transition-colors no-underline whitespace-nowrap"
              style={{ fontSize: '0.75rem' }} aria-label={`Call Your Office Space on ${CONTACT.phone}`}>
              {CONTACT.phone}
            </a>

            <a href="https://www.linkedin.com/company/yourofficespace" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors no-underline flex items-center"
              aria-label="YOS on LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            <Link href="/contact#contact-enquiry" className="rounded-lg bg-teal text-near-black font-bold hover:bg-white transition-colors no-underline"
              style={{ fontSize: '0.8rem', letterSpacing: '0.02em', padding: '0.9rem 1.6rem' }}>Enquire</Link>
          </div>

          <div className="yos-mobile-nav-actions xl:hidden flex items-center gap-2">
            {!open && <Search compact />}
            <button ref={mobileMenuButtonRef} type="button" onClick={toggleMobile}
              className="yos-mobile-menu-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation-menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop backdrop */}
      {(servicesOpen || resourcesOpen) && (
        <div className="fixed inset-0 z-40 hidden xl:block"
          style={{ background: 'rgba(0,0,0,0.5)', top: `${NAV_H}px` }}
          onClick={closeAll}
        />
      )}

      {/* Mobile navigation: show one group at a time, with enquiry always within reach. */}
      <div id="mobile-navigation-menu" hidden={!open} aria-hidden={!open} ref={mobilePanelRef} className="yos-mobile-menu xl:hidden" role="navigation" aria-label="Mobile navigation">
        <div className="yos-mobile-menu-content">
          <div className="yos-mobile-search"><Search showShortcut={false} onOpen={closeMobile} focusReturnRef={mobileMenuButtonRef} /></div>
          <div className="yos-mobile-groups">
            {([
              { key: 'services', title: 'Services', links: MOBILE_SERVICES },
              { key: 'care', title: 'Workplace Care', links: [{ label: 'Explore Flourish', href: '/flourish' }, ...FLOURISH_LINKS.map(link => ({ href: link.href, label: link.label.replace(/^Office /, '') }))] },
              { key: 'resources', title: 'Resources', links: [{ label: 'Free Tools', href: '/resources' }, { label: 'Articles & Guides', href: '/blog' }] },
            ] as const).map(group => <div key={group.key} className="yos-mobile-group">
              <button type="button" aria-expanded={mobileSection === group.key} aria-controls={`mobile-${group.key}-links`} onClick={() => setMobileSection(mobileSection === group.key ? null : group.key)} className="yos-mobile-group-toggle">
                {group.title}<span aria-hidden="true">{mobileSection === group.key ? '−' : '+'}</span>
              </button>
              <div id={`mobile-${group.key}-links`} hidden={mobileSection !== group.key} className="yos-mobile-group-links">
                {group.links.map(link => <Link key={link.href} href={link.href} onClick={closeMobile}>{link.label}</Link>)}
              </div>
            </div>)}
            <Link href="/about" onClick={closeMobile} className="yos-mobile-simple-link">About YOS</Link>
            <Link href="/contact" onClick={closeMobile} className="yos-mobile-simple-link">Contact</Link>
          </div>
        </div>
        <div className="yos-mobile-menu-footer">
          <Link href="/contact#contact-enquiry" onClick={closeMobile} className="yos-mobile-enquire">Enquire →</Link>
          <a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`} onClick={closeMobile} className="yos-mobile-call">Call {CONTACT.phone}</a>
        </div>
      </div>

    </>
  )
}
