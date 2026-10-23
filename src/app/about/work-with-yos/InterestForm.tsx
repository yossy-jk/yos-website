'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { postEnquiry } from '@/lib/enquiry'
import { TEAM_ROLES, TEAM_ARRANGEMENTS } from '@/lib/team-interest'
import styles from './page.module.css'

export default function InterestForm() {
  const successRef = useRef<HTMLHeadingElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [role, setRole] = useState('')
  const [arrangement, setArrangement] = useState('Open to discussing')
  useEffect(() => { if (status === 'success') successRef.current?.focus() }, [status])
  return <div className={styles.formCard}>
    {status === 'success' ? <div role="status"><h3 ref={successRef} tabIndex={-1}>Thanks for putting your hand up.</h3><p>Your interest has been delivered to the YOS team. We’ll review your experience, location and availability and contact you about suitable next steps.</p><p>You’re welcome to <a href="mailto:jk@yourofficespace.au">email Joe</a> if your details change.</p></div> : <form onSubmit={async event => {
      event.preventDefault()
      if (status === 'sending') return
      const data = new FormData(event.currentTarget)
      setStatus('sending'); setError('')
      try {
        const response = await postEnquiry('/api/team-interest', { ...Object.fromEntries(data), contactPermission: data.get('contactPermission') === 'on' })
        const result = await response.json()
        if (!response.ok || !result.ok) throw Error(result.error || 'Please try again or email Joe.')
        setStatus('success')
      } catch (failure) { setError(failure instanceof Error ? failure.message : 'Please try again or email Joe.'); setStatus('error') }
    }}>
      <p className={styles.formIntro}>Start with the essentials. No CV upload or account needed. Fields marked * are required.</p>
      <div className={styles.fields}>
        <div><label htmlFor="team-name">Your name *</label><input id="team-name" name="name" autoComplete="name" maxLength={200} required /></div>
        <div><label htmlFor="team-email">Email *</label><input id="team-email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
        <div><label htmlFor="team-phone">Phone (optional)</label><input id="team-phone" name="phone" type="tel" autoComplete="tel" maxLength={80} /></div>
        <div><label htmlFor="team-location">Suburb or region *</label><input id="team-location" name="location" autoComplete="address-level2" maxLength={200} required /></div>
        <div><label htmlFor="team-role">I’m interested in *</label><select id="team-role" name="role" value={role} onChange={event => { const value = event.target.value; setRole(value); setArrangement(value === 'Cleaning team member' ? 'Employment' : value === 'Furniture referral partner' ? 'Partnership' : 'Open to discussing') }} required><option value="" disabled>Choose an opportunity</option>{TEAM_ROLES.map(role => <option key={role}>{role}</option>)}</select></div>
        <div><label htmlFor="team-arrangement">How would you like to work? *</label><select id="team-arrangement" name="arrangement" value={arrangement} onChange={event => setArrangement(event.target.value)} aria-describedby="team-arrangement-hint" required>{TEAM_ARRANGEMENTS.map(value => <option key={value}>{value}</option>)}</select></div>
      </div>
      <p id="team-arrangement-hint" className={styles.hint}>{role === 'Cleaning team member' ? 'Employee cleaners are our preference. Choose Employment to join our team, or Contracting if you prefer to work through your own business.' : role === 'Furniture referral partner' ? 'Tell us how you’d like to partner. Referral terms are discussed and agreed individually.' : 'Tell us your preferred arrangement. We’ll discuss the right fit and terms with you.'}</p>
      <label htmlFor="team-company">Business or trading name (optional)</label><input id="team-company" name="company" autoComplete="organization" maxLength={200} />
      <label htmlFor="team-experience">A little about your experience (optional)</label><textarea id="team-experience" name="experience" rows={4} maxLength={3000} aria-describedby="team-experience-hint" /><p id="team-experience-hint" className={styles.hint}>Tell us what you do well and any relevant qualifications or licences. Please leave out identity documents, financial details and confidential client information.</p>
      <label htmlFor="team-availability">Availability and preferred work areas (optional)</label><input id="team-availability" name="availability" maxLength={500} />
      <div className={styles.honey} aria-hidden="true"><label htmlFor="team-website">Leave blank</label><input id="team-website" name="_honey" tabIndex={-1} autoComplete="off" /></div>
      <label className={styles.permission}><input name="contactPermission" type="checkbox" required /><span>I agree to YOS using these details to contact me about work or partnership opportunities. *</span></label>
      <p className={styles.hint}>Your details go directly to our team by email. This form doesn’t subscribe you to marketing. Read our <Link href="/privacy">privacy policy</Link>.</p>
      {status === 'error' && <p role="alert" className={styles.error}>{error}</p>}
      <button type="submit" disabled={status === 'sending'} className={styles.primary}>{status === 'sending' ? 'Sending your interest…' : 'Register my interest'}<span aria-hidden="true"> →</span></button>
      <p className={styles.hint}>Prefer a conversation? Email <a href="mailto:jk@yourofficespace.au">jk@yourofficespace.au</a>.</p>
    </form>}
  </div>
}
