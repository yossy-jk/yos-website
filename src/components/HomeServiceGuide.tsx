'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

const DISMISSED = 'yos-service-guide-dismissed'
const SERVICES = [
  { title: 'Tenant Representation', detail: 'Lease, renew or relocate your workplace.', href: '/tenant-rep' },
  { title: 'Commercial Buyers Agency', detail: 'Find and buy premises for your business.', href: '/buyers-agency' },
  { title: 'Office FitOut', detail: 'Plan and deliver your workplace FitOut.', href: '/office-fitout' },
  { title: 'Office & Commercial Furniture', detail: 'Furnish a workplace that works for your team.', href: '/furniture' },
  { title: 'Commercial Cleaning', detail: 'Keep your office clean and ready for business.', href: '/cleaning' },
  { title: 'Flourish Workplace Care', detail: 'Plants, test and tag, fire and first aid support.', href: '/flourish' },
]

export default function HomeServiceGuide() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISSED, '1') } catch { /* Still allow dismissal without storage. */ }
    setOpen(false)
  }

  useEffect(() => {
    try { if (sessionStorage.getItem(DISMISSED)) return } catch { /* The guide can still open. */ }
    // Direct section links should reach their destination without an interruption.
    if (window.location.hash) return
    const timer = setTimeout(() => {
      if (!document.querySelector('[aria-modal="true"], .analytics-consent-panel, .yos-mobile-menu:not([hidden])')) setOpen(true)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    const reopenButton = trigger.current
    const previousOverflow = document.body.style.overflow
    const background = [...document.body.children].filter(element => element instanceof HTMLElement && element.id !== 'home-service-guide-overlay') as HTMLElement[]
    const previousInert = background.map(element => element.inert)
    background.forEach(element => { element.inert = true })
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      background.forEach((element, index) => { element.inert = previousInert[index] })
      document.body.style.overflow = previousOverflow
      const focusTarget = previousFocus?.isConnected && previousFocus !== document.body ? previousFocus : reopenButton
      focusTarget?.focus({ preventScroll: true })
    }
  }, [open])

  return <>
    <button ref={trigger} type="button" className="home-guide-trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}>Help me choose a service</button>
    {open && createPortal(<div id="home-service-guide-overlay" className="home-guide-overlay" onClick={event => { if (event.target === event.currentTarget) dismiss() }}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="home-service-guide-heading" aria-describedby="home-service-guide-description" className="home-guide-panel" onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); dismiss() }
        if (event.key === 'Tab') {
          const items = [...(dialog.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])]
          const first = items[0], last = items.at(-1)
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }
      }}>
        <div className="home-guide-heading-row">
          <div><p className="home-guide-eyebrow">Your Office Space</p><h2 id="home-service-guide-heading">How can we partner together?</h2></div>
          <button ref={closeButton} type="button" className="home-guide-close" aria-label="Close service guide" onClick={dismiss}>×</button>
        </div>
        <p id="home-service-guide-description">Choose what you need help with and we’ll point you in the right direction.</p>
        <div className="home-guide-services">{SERVICES.map(service => <Link key={service.href} href={service.href} onClick={dismiss} className="home-guide-service"><span>{service.title}</span><p>{service.detail}</p><span aria-hidden="true" className="home-guide-arrow">→</span></Link>)}</div>
        <div className="home-guide-bottom"><Link href="/resources/fitout-estimator" onClick={dismiss}>Estimate your FitOut costs →</Link><button type="button" onClick={dismiss}>Browse the homepage</button></div>
      </div>
    </div>, document.body)}
  </>
}
