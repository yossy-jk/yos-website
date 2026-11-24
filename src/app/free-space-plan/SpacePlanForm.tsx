'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { postEnquiry } from '@/lib/enquiry'
import { trackConversion } from '@/lib/analytics'
import { SPACE_PLAN_CONTACT_PERMISSION } from '@/lib/free-space-plan'
import styles from './space-plan.module.css'
export default function SpacePlanForm() {
  const [busy, setBusy] = useState(false), [error, setError] = useState('')
  const [receipt, setReceipt] = useState<{ preview?: boolean; reference?: string } | null>(null)
  const [builder, setBuilder] = useState('')
  const result = useRef<HTMLDivElement>(null)
  useEffect(() => { if (receipt || error) result.current?.focus() }, [receipt, error])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return
    const data = new FormData(event.currentTarget)
    const payload = Object.fromEntries(data.entries())
    setBusy(true); setError('')
    try {
      const response = await postEnquiry('/api/free-space-plan', { ...payload, contactPermission: data.get('contactPermission') === 'on' })
      const body = await response.json()
      if (!response.ok || body.ok !== true) { setError(body.error || 'We could not confirm delivery. Please retry or call (02) 4092 0733.'); return }
      setReceipt({ preview: body.preview === true, reference: body.reference })
      if (!body.preview) trackConversion('generate_lead', { service: 'FitOut', form_name: 'free_space_plan', email_delivery: true })
    } catch { setError('We could not confirm delivery. Please retry or call (02) 4092 0733.') }
    finally { setBusy(false) }
  }
  if (receipt) return <div ref={result} tabIndex={-1} className={styles.receipt} role="status"><h2>{receipt.preview ? 'Preview request checked' : 'Your request has been received'}</h2><p>{receipt.preview ? 'This preview has not sent an email or booked a space planning service.' : 'The team has received your brief and will contact you to discuss suitability, information needed and the scope of your free space plan.'}</p>{receipt.reference && <p>Reference: {receipt.reference}</p>}<button className={styles.button} onClick={() => setReceipt(null)}>Start another request</button></div>
  return <form className={styles.form} onSubmit={submit} aria-label="Free space plan request">
    <div className={styles.grid}><label>Your name <span>(required)</span><input name="name" autoComplete="name" required maxLength={200} /></label><label>Email <span>(required)</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label>Business name <span>(optional)</span><input name="company" autoComplete="organization" maxLength={200} /></label><label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={80} /></label></div>
    <label>Have you engaged a builder? <span>(required)</span><select name="builderEngaged" value={builder} onChange={e => setBuilder(e.target.value)} required><option value="">Please choose</option><option value="no">No, we have not engaged a builder</option><option value="yes">Yes, we have engaged a builder</option></select></label>
    {builder === 'yes' && <p className={styles.notice}>This free space plan offer is for businesses that have not yet engaged a builder. <Link href="/contact?service=fitout#contact-enquiry">Discuss your existing project with us</Link>.</p>}
    <div className={styles.grid}><label>Business suburb <span>(required)</span><input name="suburb" required maxLength={200} /></label><label>Current and expected team size <span>(optional)</span><input name="teamSize" maxLength={80} /></label></div>
    <label>Desired timing <span>(optional)</span><input name="timing" maxLength={200} /></label>
    <label>What does the space need to do? <span>(required)</span><textarea name="brief" required minLength={10} maxLength={4000} rows={5} placeholder="Tell us about the workplace, people, rooms and requirements. If you have an existing plan, mention it here." /></label>
    <div className={styles.honey} aria-hidden="true"><label>Leave blank<input name="_honey" tabIndex={-1} autoComplete="off" /></label></div>
    <label className={styles.permission}><input type="checkbox" name="contactPermission" required />{SPACE_PLAN_CONTACT_PERMISSION}</label>
    <p className={styles.privacy}>Your details go to the YOS team for this request. This does not subscribe you to marketing or engage a builder. <Link href="/privacy">Privacy policy</Link>.</p>
    {error && <div ref={result} tabIndex={-1} role="alert" className={styles.notice}>{error}</div>}
    <button className={styles.button} type="submit" disabled={busy || builder === 'yes'}>{busy ? 'Sending request...' : 'Request my free space plan'}</button>
  </form>
}
