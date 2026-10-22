'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { checklistService, SERVICE_CHECKLISTS, CHECKLIST_FOLLOWUP_PERMISSION } from '@/lib/service-checklists'
import { trackConversion } from '@/lib/analytics'
import './service-checklist-popup.css'

const SEEN = 'yos_checklist_offer_seen'
const CONVERTED = 'yos_checklist_offer_converted'
const WEEK = 7 * 24 * 60 * 60 * 1000

/** Disabled until capture, delivery and follow-up release checks are complete. */
export default function ServiceChecklistPopup({ enabled = false }: { enabled?: boolean }) {
  const pathname = usePathname()
  return <ChecklistOffer key={pathname} enabled={enabled} pathname={pathname} />
}

function ChecklistOffer({ enabled, pathname }: { enabled: boolean; pathname: string }) {
  const service = checklistService(pathname)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const submissionId = useRef('')
  const lastAttempt = useRef<{ submissionId: string; email: string; permission: boolean } | null>(null)
  const replacements = useRef<{ submissionId: string; email: string }[]>([])
  const measured = useRef(false)
  const panel = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const offer = service ? SERVICE_CHECKLISTS[service] : null

  useEffect(() => {
    if (!enabled || !service) return
    let started = Date.now(), shown = false
    const blocked = () => {
      try { return Boolean(localStorage.getItem(CONVERTED)) || Date.now() - Number(localStorage.getItem(SEEN) || 0) < WEEK } catch { return shown }
    }
    const show = () => {
      if (shown || blocked() || Date.now() - started < 30000 || document.visibilityState !== 'visible') return
      if (document.querySelector('[role="dialog"],dialog[open]') || document.activeElement?.closest('form') || document.activeElement?.matches('input,textarea,select,[contenteditable="true"]')) return
      shown = true
      try { localStorage.setItem(SEEN, String(Date.now())) } catch { /* Per-page suppression remains. */ }
      previousFocus.current = document.activeElement as HTMLElement
      setOpen(true)
    }
    const exit = (event: MouseEvent) => { if (event.clientY <= 0 && !event.relatedTarget && matchMedia('(hover: hover)').matches) show() }
    const scroll = () => {
      const range = document.documentElement.scrollHeight - innerHeight
      if (matchMedia('(hover: none)').matches && range > 0 && scrollY / range >= 0.5) show()
    }
    const converted = () => { try { localStorage.setItem(CONVERTED, '1') } catch {} setOpen(false) }
    document.addEventListener('mouseout', exit)
    window.addEventListener('scroll', scroll, { passive: true })
    // Someone may reach halfway before the engagement delay, then stop scrolling.
    const engagementTimer = window.setTimeout(scroll, 30000)
    window.addEventListener('yos-enquiry-completed', converted)
    return () => { window.clearTimeout(engagementTimer); document.removeEventListener('mouseout', exit); window.removeEventListener('scroll', scroll); window.removeEventListener('yos-enquiry-completed', converted); started = 0 }
  }, [enabled, service])

  useEffect(() => {
    if (state === 'sent') panel.current?.querySelector<HTMLAnchorElement>('a.checklist-action')?.focus()
  }, [state])

  useEffect(() => {
    if (!open) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const items = [...(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]') || [])]
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', key)
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); previousFocus.current?.focus() }
  }, [open])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!service || state === 'sending') return
    const address = email.trim().toLowerCase()
    if (lastAttempt.current && (address !== lastAttempt.current.email || permission !== lastAttempt.current.permission)) {
      if (replacements.current.length >= 8) { setState('error'); setMessage('Please call 02 4092 0733 so we can help with your request.'); return }
      replacements.current.push({ submissionId: lastAttempt.current.submissionId, email: lastAttempt.current.email })
      submissionId.current = ''
    }
    if (!submissionId.current) submissionId.current = crypto.randomUUID()
    lastAttempt.current = { submissionId: submissionId.current, email: address, permission }
    setState('sending'); setMessage('')
    try {
      const response = await fetch('/api/service-checklist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service, email: address, followUpConsent: permission, submissionId: submissionId.current, replaces: replacements.current, page: pathname }) })
      const result = await response.json()
      if (!response.ok || !result.ok) throw Error('Please try again, or contact us for the checklist.')
      setState('sent')
      try { localStorage.setItem(CONVERTED, '1') } catch {}
      if (!measured.current) {
        measured.current = true
        try { trackConversion('service_checklist_request', { service }) } catch { /* Optional measurement never blocks delivery. */ }
      }
    } catch { setState('error'); setMessage('We could not send your checklist. Please try again or call 02 4092 0733.') }
  }
  if (!enabled || !open || !offer) return null
  return <div className="checklist-backdrop" onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="checklist-title" aria-describedby="checklist-detail" className="checklist-dialog">
      <button className="checklist-close" type="button" aria-label="Close checklist offer" onClick={() => setOpen(false)}>×</button>
      <p className="checklist-eyebrow">YOUR OFFICE SPACE · FREE CHECKLIST</p>
      <h2 id="checklist-title">{state === 'sent' ? 'Your checklist is ready.' : offer.headline}</h2>
      <p id="checklist-detail">{state === 'sent' ? 'Check your inbox for the download link. You can also open it below.' : offer.detail}</p>
      {state === 'sent' ? <><a className="checklist-action" href={offer.pdf} target="_blank" rel="noopener noreferrer">Open your checklist (PDF)</a><Link href={offer.servicePath}>Explore {offer.label.toLowerCase()}</Link></> : <form onSubmit={submit} aria-busy={state === 'sending'}>
        <label htmlFor="checklist-email">Your email address</label>
        <input id="checklist-email" name="email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={e => setEmail(e.target.value)} disabled={state === 'sending'} />
        <label className="checklist-permission"><input type="checkbox" checked={permission} onChange={e => setPermission(e.target.checked)} disabled={state === 'sending'} /><span>{CHECKLIST_FOLLOWUP_PERMISSION}</span></label>
        <button className="checklist-action" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Email me the free checklist'}</button>
        <p className="checklist-privacy">We’ll use your email to deliver the checklist. The follow-up is optional. <Link href="/privacy">Privacy policy</Link></p>
        {message && <p role="alert">{message}</p>}
      </form>}
    </div>
  </div>
}
