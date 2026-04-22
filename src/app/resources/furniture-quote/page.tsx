'use client'

import { useState, useRef } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SectionLabel from '@/components/SectionLabel'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import { submitLead } from '@/lib/hubspot-lead'

const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-near-black text-sm font-light placeholder:text-mid-grey/60 focus:outline-none focus:border-teal transition-colors'
const labelClass = 'block text-near-black font-medium text-sm mb-1.5'

export default function FurnitureQuotePage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    workstations: '',
    area: '',
    budget: '',
    projectType: '',
    timeline: '',
    notes: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const file = fileRef.current?.files?.[0]

    try {
      // Build context string for HubSpot
      const contextParts = [
        form.company && `Company: ${form.company}`,
        form.phone && `Phone: ${form.phone}`,
        form.workstations && `Workstations: ${form.workstations}`,
        form.area && `Area: ${form.area} sqm`,
        form.budget && `Budget: ${form.budget}`,
        form.projectType && `Project type: ${form.projectType}`,
        form.timeline && `Timeline: ${form.timeline}`,
        form.notes && `Notes: ${form.notes}`,
        file && `File attached: ${file.name}`,
      ].filter(Boolean).join('\n')

      // If file uploaded, send via FormSubmit
      if (file) {
        const data = new FormData()
        data.append('name', form.name)
        data.append('email', form.email)
        data.append('phone', form.phone || '')
        data.append('company', form.company || '')
        data.append('workstations', form.workstations || '')
        data.append('area_sqm', form.area || '')
        data.append('budget', form.budget || '')
        data.append('project_type', form.projectType || '')
        data.append('timeline', form.timeline || '')
        data.append('notes', form.notes || '')
        data.append('attachment', file)
        data.append('_subject', `Furniture Quote Request — ${form.name}${form.company ? ` (${form.company})` : ''}`)
        data.append('_captcha', 'false')
        data.append('_template', 'table')

        const res = await fetch('https://formsubmit.co/jk@yourofficespace.au', {
          method: 'POST',
          body: data,
        })

        if (!res.ok) {
          console.warn('FormSubmit returned non-OK status:', res.status)
        }
      }

      // Always submit to HubSpot
      await submitLead({
        firstname: form.name,
        email: form.email,
        source: 'Furniture Quote',
        context: contextParts,
      })

      // Always notify Joe — even when no file attached
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          source: 'Furniture Quote Request',
          context: contextParts,
        }),
      }).catch(() => {})

      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Nav />

      {/* HERO */}
      <section
        className="relative bg-near-black"
        style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className={`relative z-10 ${WRAP}`} style={PAD}>
          <FadeIn>
            <SectionLabel>Furniture &amp; Fitout</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1
              className="text-white font-black leading-[0.95] tracking-tight max-w-3xl mb-5"
              style={{ fontSize: 'clamp(2rem,5vw,4.5rem)' }}
            >
              Get a furniture quote.
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p
              className="text-white/60 font-light leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1rem,2vw,1.25rem)' }}
            >
              Tell us about your project. Upload a floor plan if you have one. We&apos;ll come back with a specification and quote within one business day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FORM */}
      <section
        className="bg-white"
        style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}
      >
        <div className={WRAP} style={PAD}>
          <div className="max-w-2xl">
            {submitted ? (
              <FadeIn>
                <div className="bg-warm-grey rounded-xl p-10 sm:p-14">
                  <div className="w-10 h-1 bg-teal mb-8" />
                  <h2 className="text-near-black font-bold text-2xl sm:text-3xl leading-tight mb-4">
                    We have your brief.
                  </h2>
                  <p className="text-charcoal font-light text-lg leading-relaxed mb-8">
                    You&apos;ll hear from us within one business day.
                  </p>
                  <p className="text-mid-grey font-light text-sm">
                    Prefer to talk?{' '}
                    <a
                      href={HUBSPOT.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal underline underline-offset-2 hover:text-teal/80 transition-colors"
                    >
                      Book a call instead.
                    </a>
                  </p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name <span className="text-teal">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email <span className="text-teal">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com.au"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Phone + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="04xx xxx xxx"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className={labelClass}>Company</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company name"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Workstations + Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="workstations" className={labelClass}>Number of workstations</label>
                      <input
                        id="workstations"
                        name="workstations"
                        type="number"
                        min={1}
                        value={form.workstations}
                        onChange={handleChange}
                        placeholder="e.g. 20"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="area" className={labelClass}>Approximate area (sqm)</label>
                      <input
                        id="area"
                        name="area"
                        type="number"
                        min={1}
                        value={form.area}
                        onChange={handleChange}
                        placeholder="e.g. 350"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className={labelClass}>Budget range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a budget range</option>
                      <option value="Under $50k">Under $50k</option>
                      <option value="$50k–$150k">$50k–$150k</option>
                      <option value="$150k–$500k">$150k–$500k</option>
                      <option value="$500k+">$500k+</option>
                    </select>
                  </div>

                  {/* Project type + Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="projectType" className={labelClass}>Project type</label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={form.projectType}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select project type</option>
                        <option value="New fitout">New fitout</option>
                        <option value="Refresh">Refresh</option>
                        <option value="Partial replacement">Partial replacement</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timeline" className={labelClass}>Preferred timeline</label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={form.timeline}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select timeline</option>
                        <option value="ASAP">ASAP</option>
                        <option value="1–3 months">1–3 months</option>
                        <option value="3–6 months">3–6 months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className={labelClass}>Additional notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Anything else we should know — existing furniture, brand requirements, specific products..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label htmlFor="file" className={labelClass}>
                      Floor plan or design brief{' '}
                      <span className="text-mid-grey font-light text-xs">(optional — .pdf, .jpg, .png, .dwg, max 20MB)</span>
                    </label>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.dwg"
                      ref={fileRef}
                      className="w-full text-sm text-charcoal font-light file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-near-black file:text-white hover:file:bg-charcoal file:cursor-pointer cursor-pointer"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f && f.size > 20 * 1024 * 1024) {
                          setError('File is too large. Maximum size is 20MB.')
                          e.target.value = ''
                        } else {
                          setError(null)
                        }
                      }}
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm font-light">{error}</p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm px-8 py-4 rounded-xl hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Sending...' : 'Submit brief'}
                    </button>
                    <p className="text-mid-grey font-light text-sm">
                      Prefer to talk?{' '}
                      <a
                        href={HUBSPOT.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal underline underline-offset-2 hover:text-teal/80 transition-colors"
                      >
                        Book a call instead.
                      </a>
                    </p>
                  </div>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
