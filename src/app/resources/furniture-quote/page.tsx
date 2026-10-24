'use client'
import ToolGuide from '@/components/ToolGuide'

import { useState, useRef } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SectionLabel from '@/components/SectionLabel'
import FadeIn from '@/components/FadeIn'
import { ENQUIRY } from '@/lib/constants'
import { postEnquiry } from '@/lib/enquiry'
import { furnitureFileError, FURNITURE_FILE_ACCEPT } from '@/lib/furniture-file-rules'
import { trackConversion } from '@/lib/analytics'

const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const SEC_SM = { paddingTop: 'clamp(2.5rem,5vw,4rem)',   paddingBottom: 'clamp(2.5rem,5vw,4rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,6vw,8rem)', paddingRight: 'clamp(1.5rem,6vw,8rem)' }

const WRAP = 'max-w-screen-xl mx-auto'

const inputClass = 'w-full bg-white border border-gray-200 rounded-sm px-4 py-4 text-near-black text-sm font-light placeholder:text-mid-grey/60 focus:outline-none focus:border-teal transition-colors'
const labelClass = 'block text-near-black font-medium text-sm mb-1.5'

export default function FurnitureQuotePage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<{ preview?: boolean; reference?: string }>({})
  const [fileName, setFileName] = useState('')
  const [honey, setHoney] = useState('')
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
      if (file) {
        const fileError = furnitureFileError(file)
        if (fileError) { setError(fileError); return }
      }
      const response = await postEnquiry('/api/furniture-quote', {
        name: form.name, email: form.email, phone: form.phone, company: form.company,
        message: form.notes, _honey: honey,
        details: { workstations: form.workstations, area: form.area, budget: form.budget, projectType: form.projectType, timeline: form.timeline },
      }, file, 'attachment')
      const result = await response.json()
      if (!response.ok || result.ok !== true) {
        setError(result.error || 'We could not confirm delivery. Please try again or call (02) 4092 0733.')
        return
      }
      setReceipt({ preview: result.preview === true, reference: result.reference })
      setSubmitted(true)
      if (!result.preview) trackConversion('generate_lead', { service: 'Furniture', form_name: 'furniture_quote', email_delivery: true })
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

      <main id="main-content" tabIndex={-1}>

      {/* HERO */}
      <section
        className="relative bg-near-black"
        style={SEC_SM}
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
              Tell us about your project. Upload a floor plan if you have one. We&apos;ll review the brief and confirm what is required for a specification and quote.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FORM */}
      <section
        className="bg-white"
        style={SEC}
      >
        <div className={WRAP} style={PAD}>
          <div className="max-w-2xl">
            {submitted ? (
              <FadeIn>
                <div role="status" className="bg-warm-grey rounded-sm p-10 sm:p-14" style={{ padding: 'clamp(1.5rem,4vw,3rem)' }}>
                  <div className="w-10 h-1 bg-teal mb-8" />
                  <h2 className="text-near-black font-bold leading-tight mb-4">
                    {receipt.preview ? 'Preview completed.' : 'We have your brief.'}
                  </h2>
                  <p className="text-charcoal font-light text-lg leading-relaxed mb-8">
                    {receipt.preview ? 'This preview has not sent an email.' : 'We will review the brief and confirm the next step.'}
                  </p>
                  {receipt.reference && <p className="text-charcoal" style={{ marginBottom: 24, overflowWrap: 'anywhere' }}>Enquiry reference: {receipt.reference}</p>}
                  <p className="text-mid-grey font-light text-sm">
                    Prefer to talk?{' '}
                    <a
                      href={ENQUIRY.contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal underline underline-offset-2 hover:text-teal/80 transition-colors"
                    >
                      Request a call instead.
                    </a>
                  </p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn>
                <form id="furniture-quote-form" tabIndex={-1} aria-label="Furniture quote request" onSubmit={handleSubmit} className="furniture-quote-form space-y-6" aria-describedby="furniture-quote-help">
                  <p id="furniture-quote-help" className="text-charcoal leading-relaxed">Start with your name and email. Phone, company, quantities, area, budget, timing, notes and any attachment are optional. Share what you know; we can help clarify the furniture brief.</p>
                  <input type="text" name="_honey" value={honey} onChange={e => setHoney(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name <span className="text-teal">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
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
                        autoComplete="email"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        autoComplete="tel"
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
                        autoComplete="organization"
                        type="text"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company name"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Workstations + Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      placeholder="Anything else we should know, existing furniture, brand requirements, specific products..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label htmlFor="file" className={labelClass}>
                      Floor plan or design brief{' '}
                      <span className="text-mid-grey font-light text-xs">(optional, PDF, JPG, PNG or DWG, max 3 MB)</span>
                    </label>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept={FURNITURE_FILE_ACCEPT}
                      ref={fileRef}
                      className="w-full text-sm text-charcoal font-light file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-near-black file:text-white hover:file:bg-charcoal file:cursor-pointer cursor-pointer"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        setFileName(f?.name || '')
                        setError(f ? furnitureFileError(f) || null : null)
                      }}
                    />
                    {fileName && <button type="button" className="text-action-teal underline" style={{ padding: '12px 0', minHeight: 44 }} onClick={() => { if (fileRef.current) fileRef.current.value = ''; setFileName(''); setError(null) }}>Remove selected file</button>}
                    <p className="text-readable-grey text-sm" style={{ marginTop: 8 }}>Your file is included with your brief in the email to YOS. You can send the brief without a file.</p>
                  </div>

                  {error && (
                    <p role="alert" className="text-red-600 text-sm font-light">{error}</p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm px-10 py-[1.1rem] rounded-sm min-h-[60px] hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Sending...' : 'Submit brief'}
                    </button>
                    <p className="text-mid-grey font-light text-sm">
                      Prefer to talk?{' '}
                      <a
                        href={ENQUIRY.contactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal underline underline-offset-2 hover:text-teal/80 transition-colors"
                      >
                        Request a call instead.
                      </a>
                    </p>
                  </div>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </section>


      <div className="furniture-quote-guide"><ToolGuide purpose="Send a furniture brief so YOS can assess the project and prepare a scoped proposal." inputs="Your name and email are required. Add company, quantities, floor area, budget, timing or a plan if you have them; these details are optional." result="A request for a tailored proposal, rather than an instant binding quotation. Scope and site requirements are confirmed with you." next="See our furniture services" href="/furniture" /></div>
</main>

      <Footer />
    </>
  )
}
