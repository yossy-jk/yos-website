'use client'
// Note: metadata must be in a separate server component for 'use client' pages
// SEO is handled via layout.tsx root metadata + page-level title tags
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import { virusTotalScan, encryptFile } from '@/lib/file-security'

/* ─── Data ───────────────────────────────────────────────── */
const FREE_CHECKS = [
  'Overall lease risk rating — RED / AMBER / GREEN',
  'Your top 3 highest-risk clauses identified',
  'Total financial exposure headline figure',
  'Whether your lease complies with Australian legislation',
]

const PAID_INCLUDES = [
  { title: 'All 12 risk categories', desc: 'Rent, make good, assignment, security, permitted use, outgoings, repairs, relocation, default, insurance, special conditions — every clause rated.' },
  { title: 'Full RAG risk table', desc: 'Every clause rated Red / Amber / Green with plain-English explanation of what it means for your business.' },
  { title: 'Financial exposure summary', desc: 'Total rent, outgoings, make good estimate, bank guarantee, and early exit cost — in one table.' },
  { title: 'Negotiation roadmap', desc: 'Which clauses to push back on, in priority order, with market benchmarks and realistic success likelihood.' },
  { title: 'Exit scenario analysis', desc: 'How the lease plays out if you exit early, sell the business, sublet, or hold to expiry.' },
  { title: 'Your next move', desc: 'Three clear paths: sign / negotiate / do not sign — with specific steps for each outcome.' },
]

/* ─── Types ──────────────────────────────────────────────── */
type FlowStep = 'landing' | 'form-details' | 'form-upload' | 'submitted'
type SecurityStep = 'idle' | 'scanning' | 'encrypting' | 'sending'

interface FormState {
  name: string
  email: string
  company: string
  phone: string
  leaseType: string
  state: string
  file: File | null
}

interface FieldErrors {
  name?: string
  email?: string
  leaseType?: string
  state?: string
  file?: string
}

/* ─── Input component ────────────────────────────────────── */
function Field({
  label, type = 'text', value, onChange, error, required, placeholder, autoComplete,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/80 text-xs font-semibold tracking-wide uppercase">
        {label}{required && <span className="text-teal ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error}
        className={[
          'bg-white/[0.07] text-white text-sm px-4 py-3.5 rounded-sm',
          'border transition-all duration-200 outline-none',
          'placeholder:text-white/35 font-light',
          'focus:bg-white/[0.10] focus:border-teal',
          error
            ? 'border-red-400/70 focus:border-red-400'
            : 'border-white/20 hover:border-white/35',
        ].join(' ')}
      />
      {error && (
        <p className="text-red-400 text-xs font-medium">{error}</p>
      )}
    </div>
  )
}

/* ─── Select component ───────────────────────────────────── */
function SelectField({
  label, value, onChange, options, error, required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/80 text-xs font-semibold tracking-wide uppercase">
        {label}{required && <span className="text-teal ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        className={[
          'text-sm px-4 py-3.5 rounded-sm',
          'border transition-all duration-200 outline-none',
          'focus:border-teal',
          value ? 'bg-white/[0.07] text-white' : 'bg-white/[0.07] text-white/35',
          error
            ? 'border-red-400/70 focus:border-red-400'
            : 'border-white/20 hover:border-white/35',
        ].join(' ')}
      >
        <option value="" disabled className="text-near-black bg-white">Select…</option>
        {options.map(o => (
          <option key={o.value} value={o.value} className="text-near-black bg-white">{o.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-xs font-medium">{error}</p>
      )}
    </div>
  )
}

/* ─── Progress indicator ─────────────────────────────────── */
function StepBar({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {[
        { n: 1, label: 'Your details' },
        { n: 2, label: 'Upload lease' },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={[
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300',
              current >= s.n
                ? 'bg-teal text-white'
                : 'bg-white/10 text-white/40',
            ].join(' ')}>
              {current > s.n ? '✓' : s.n}
            </div>
            <span className={[
              'text-xs font-semibold tracking-wide transition-colors duration-300',
              current >= s.n ? 'text-white/80' : 'text-white/30',
            ].join(' ')}>
              {s.label}
            </span>
          </div>
          {i < 1 && (
            <div className={[
              'flex-1 h-px w-12 transition-all duration-500',
              current > s.n ? 'bg-teal' : 'bg-white/15',
            ].join(' ')} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LeaseReviewPage() {
  const [step, setStep] = useState<FlowStep>('landing')
  const [form, setForm] = useState<FormState>({
    name: '', email: '', company: '', phone: '',
    leaseType: '', state: '', file: null,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [securityStep, setSecurityStep] = useState<SecurityStep>('idle')

  const set = (field: keyof FormState) => (value: string | File | null) =>
    setForm(prev => ({ ...prev, [field]: value }))

  /* Step 1 validation */
  const validateDetails = (): boolean => {
    const e: FieldErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    if (!form.leaseType) e.leaseType = 'Please select a lease type'
    if (!form.state) e.state = 'Please select your state'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* Step 2 validation */
  const validateUpload = (): boolean => {
    const e: FieldErrors = {}
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!form.file) e.file = 'Please upload your lease document'
    else if (form.file.size > 50 * 1024 * 1024) e.file = 'File must be under 50MB'
    else if (!allowedTypes.includes(form.file.type) && !form.file.name.match(/\.(pdf|doc|docx)$/i)) e.file = 'Please upload a PDF or Word document'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleDetailsNext = () => {
    if (validateDetails()) {
      setErrors({})
      setStep('form-upload')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateUpload()) return
    setSubmitting(true)

    if (form.file) {
      // ── Step 1: VirusTotal hash scan ────────────────────
      setSecurityStep('scanning')
      const scanResult = await virusTotalScan(form.file)

      if (scanResult.status === 'malicious') {
        // Block submission — known malicious file
        setErrors({ file: `This file was flagged by ${scanResult.detections} security engines and cannot be uploaded. Please contact us directly if you believe this is an error.` })
        setSubmitting(false)
        setSecurityStep('idle')
        return
      }
      // 'clean', 'unknown', or 'error' — all proceed (fail open on API errors)

      // ── Step 2: AES-256-GCM encryption ─────────────────
      setSecurityStep('encrypting')
      let encryptedFile: { blob: Blob; filename: string; ivHex: string; saltHex: string } | null = null
      try {
        encryptedFile = await encryptFile(form.file)
      } catch {
        // Encryption failed — fall back to unencrypted but still send
        encryptedFile = null
      }

      // ── Step 3: Submit ──────────────────────────────────
      setSecurityStep('sending')

      // 3a. HubSpot CRM entry
      try {
        const scanNote = scanResult.status === 'clean'
          ? `VT scan: CLEAN (${scanResult.engines} engines)`
          : scanResult.status === 'unknown'
          ? 'VT scan: hash not in database (new file)'
          : 'VT scan: skipped (API unreachable)'

        await fetch(
          'https://api.hsforms.com/submissions/v3/integration/submit/442709765/e3e49521-0831-49ba-8929-610c7cc7f282',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: [
                { name: 'firstname', value: form.name.split(' ')[0] },
                { name: 'lastname', value: form.name.split(' ').slice(1).join(' ') || '' },
                { name: 'email', value: form.email },
                { name: 'company', value: form.company },
                { name: 'phone', value: form.phone },
                { name: 'message', value: `LeaseIntel™ Free Review — ${form.leaseType} lease — ${form.state}\nFile: ${form.file?.name || 'none'} (${form.file ? (form.file.size / 1024 / 1024).toFixed(1) + 'MB' : ''})\n${scanNote}\nEncryption: ${encryptedFile ? 'AES-256-GCM' : 'none (fallback)'}` },
              ],
            }),
          }
        )
      } catch {
        // Non-blocking CRM entry
      }

      // 3b. Send encrypted file to Joe
      try {
        const fd = new FormData()
        fd.append('name', form.name)
        fd.append('email', form.email)
        fd.append('_replyto', form.email)
        fd.append('company', form.company || '—')
        fd.append('phone', form.phone || '—')
        fd.append('leaseType', form.leaseType)
        fd.append('state', form.state)
        fd.append('_subject', `LeaseIntel™ Free Review — ${form.name} (${form.company || form.email}) — ENCRYPTED`)
        fd.append('_captcha', 'false')

        if (encryptedFile) {
          // Send encrypted file + decryption metadata
          fd.append('attachment', encryptedFile.blob, encryptedFile.filename)
          fd.append('decrypt_iv', encryptedFile.ivHex)
          fd.append('decrypt_salt', encryptedFile.saltHex)
          fd.append('encrypt_note', 'AES-256-GCM encrypted. Use the YOS decrypt tool at /tools/decrypt-lease.html')
        } else {
          // Encryption failed — send original with warning
          fd.append('attachment', form.file, form.file.name)
          fd.append('encrypt_note', 'WARNING: Encryption failed — unencrypted file attached')
        }

        await fetch('https://formsubmit.co/jk@yourofficespace.au', {
          method: 'POST',
          body: fd,
        })
      } catch {
        // Non-blocking
      }
    }

    setSubmitting(false)
    setSecurityStep('idle')
    setStep('submitted')
  }

  /* ── LANDING ─────────────────────────────────────────── */
  if (step === 'landing') {
    return (
      <>
        <Nav />

        {/* HERO */}
        <section className="bg-near-black relative overflow-hidden" style={{ paddingTop: 'clamp(6rem,12vw,12rem)', paddingBottom: 'clamp(5rem,10vw,10rem)' }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <div className="max-w-3xl">
              <FadeIn delay={0}>
                <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 px-4 py-2 rounded-sm mb-8">
                  <span className="w-2 h-2 bg-teal rounded-full animate-pulse" />
                  <span className="text-teal font-bold text-xs tracking-widest uppercase">LeaseIntel™ by Your Office Space</span>
                </div>
              </FadeIn>
              <FadeIn delay={80}>
                <h1 className="text-white font-black leading-[0.95] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.25rem,6vw,5.5rem)' }}>
                  What&apos;s hiding<br />
                  <span className="text-teal">in your lease?</span>
                </h1>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="text-white/60 leading-relaxed mb-10 font-light"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '44rem' }}>
                  Most business owners sign commercial leases they don&apos;t fully understand.
                  LeaseIntel™ delivers complete, plain-English risk analysis — every clause rated,
                  every risk quantified, every negotiation opportunity identified.
                </p>
              </FadeIn>
              <FadeIn delay={240}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setStep('form-details')}
                    className="inline-flex items-center justify-center gap-2 bg-teal text-white font-black text-sm tracking-widest uppercase px-8 py-4 hover:bg-dark-teal transition-colors duration-200 min-h-[52px]"
                  >
                    Get Free Summary →
                  </button>
                  <a
                    href="#full-report"
                    className="inline-flex items-center justify-center border border-white/25 text-white font-bold text-[0.72rem] tracking-[0.14em] uppercase px-14 py-[1.25rem] hover:border-white/60 transition-colors duration-200 min-h-[52px]"
                  >
                    View Full Report — $97
                  </a>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                  {[
                    { icon: '🔐', text: 'AES-256 encrypted' },
                    { icon: '🛡️', text: 'Virus scanned' },
                    { icon: '🇦🇺', text: 'Privacy Act compliant' },
                  ].map(s => (
                    <span key={s.text} className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
                      <span>{s.icon}</span>{s.text}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-teal" style={{ paddingTop: 'clamp(2.5rem,5vw,4rem)', paddingBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          <FadeIn>
            <div className="max-w-screen-xl mx-auto grid grid-cols-3 gap-6 text-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
              {[
                { stat: '$97', label: 'Full report ex GST' },
                { stat: '24hr', label: 'Turnaround time' },
                { stat: '12', label: 'Risk categories reviewed' },
              ].map(item => (
                <div key={item.stat}>
                  <p className="text-white font-black text-2xl md:text-3xl leading-none mb-1">{item.stat}</p>
                  <p className="text-white/70 text-xs font-medium tracking-wide">{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* FREE SUMMARY */}
        <section className="bg-white" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <FadeIn direction="left">
              <div>
                <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Start free</p>
                <h2 className="text-near-black font-black leading-tight tracking-tight mb-5"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
                  Upload your lease.<br />Get your risk score. Free.
                </h2>
                <p className="text-charcoal text-sm md:text-base leading-relaxed mb-8 font-light">
                  Upload your lease document and receive a free summary — your overall risk rating
                  and the three highest-risk clauses identified. No payment, no obligation.
                </p>
                <button
                  onClick={() => setStep('form-details')}
                  className="inline-flex items-center justify-center gap-2 bg-near-black text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-black transition-all duration-200 min-h-[48px]"
                >
                  Start Free Review →
                </button>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="bg-warm-grey p-8 rounded-sm border-l-4 border-teal">
                <p className="text-near-black font-bold text-xs tracking-widest uppercase mb-5">Free summary includes:</p>
                <div className="flex flex-col gap-4">
                  {FREE_CHECKS.map(check => (
                    <div key={check} className="flex items-start gap-3">
                      <span className="text-teal font-black text-base leading-none mt-0.5 flex-shrink-0">✓</span>
                      <p className="text-charcoal text-sm leading-relaxed">{check}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FULL REPORT */}
        <section id="full-report" className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <FadeIn>
              <div className="max-w-2xl mb-7 md:mb-14">
                <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Full paid report — $97 ex GST</p>
                <h2 className="text-white font-black leading-tight tracking-tight mb-5"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
                  Everything you need to know<br />before you sign.
                </h2>
                <p className="text-white/55 text-sm md:text-base leading-relaxed font-light">
                  Law firms charge $1,500–$4,000 and take 3–10 days.
                  LeaseIntel™ delivers a complete 10-section report in 24 hours for $97.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7 md:mb-14">
              {PAID_INCLUDES.map((item, i) => (
                <FadeIn key={item.title} delay={i * 60} direction="up">
                  <div className="border border-white/10 p-6 rounded-sm hover:border-teal/40 hover:bg-white/[0.02] transition-all duration-200">
                    <h3 className="text-white font-black text-base mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-light">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn>
              <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  <p className="text-white font-black text-3xl mb-1">$97 <span className="text-white/35 font-light text-base">ex GST</span></p>
                  <p className="text-white/35 text-sm">24-hour turnaround · Invoiced via email · Pay before delivery</p>
                </div>
                <button
                  onClick={() => setStep('form-details')}
                  className="inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-[0.72rem] tracking-[0.14em] uppercase px-14 py-[1.25rem] hover:bg-dark-teal transition-all duration-200 min-h-[52px] w-full md:w-auto"
                >
                  Upload Your Lease →
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="bg-warm-grey" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
            <FadeIn>
              <h2 className="text-near-black font-black leading-tight tracking-tight mb-12 text-center"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
                vs. the alternatives
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'Law Firm Review', price: '$1,500–$4,000', time: '3–10 days', plain: false, roadmap: false, highlight: false },
                { name: 'LeaseIntel™', price: '$97 ex GST', time: '24 hours', plain: true, roadmap: true, highlight: true },
                { name: 'Sign without review', price: 'Free', time: 'Instant', plain: false, roadmap: false, highlight: false },
              ].map((opt, i) => (
                <FadeIn key={opt.name} delay={i * 80} direction="up">
                  <div className={[
                    'p-8 rounded-sm border-2 h-full',
                    opt.highlight ? 'border-teal bg-white' : 'border-gray-200 bg-white',
                  ].join(' ')}>
                    {opt.highlight && (
                      <div className="bg-teal text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4">
                        Best value
                      </div>
                    )}
                    <h3 className={`font-black text-lg mb-2 ${opt.highlight ? 'text-teal' : 'text-near-black'}`}>{opt.name}</h3>
                    <p className="text-near-black font-black text-2xl mb-1">{opt.price}</p>
                    <p className="text-mid-grey text-sm mb-6">{opt.time}</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Plain-English report', val: opt.plain },
                        { label: 'Negotiation roadmap', val: opt.roadmap },
                        { label: 'All 12 risk categories', val: opt.roadmap },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2.5">
                          <span className={`text-sm font-black ${f.val ? 'text-teal' : 'text-mid-grey'}`}>{f.val ? '✓' : '✗'}</span>
                          <span className={`text-sm ${f.val ? 'text-charcoal' : 'text-mid-grey'}`}>{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-white border-t border-gray-100" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

            {/* Trust badge strip */}
            <FadeIn>
              <div className="flex flex-wrap gap-3 mb-12">
                {[
                  { icon: '🔐', label: 'AES-256-GCM Encrypted' },
                  { icon: '🛡️', label: 'Virus Scanned on Upload' },
                  { icon: '🔒', label: 'TLS Encrypted in Transit' },
                  { icon: '🇦🇺', label: 'Privacy Act 1988 Compliant' },
                  { icon: '🚫', label: 'Never Shared or Sold' },
                ].map(b => (
                  <div key={b.label} className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50">
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-near-black font-bold text-xs tracking-wide">{b.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn direction="left">
                <div>
                  <p className="text-near-black font-black text-sm mb-3">Bank-grade encryption</p>
                  <p className="text-charcoal text-sm leading-relaxed font-light">
                    Your lease document is encrypted with AES-256-GCM — the same standard used by banks and governments — <strong>before it leaves your browser</strong>. The file is unreadable in transit and at rest. No third party can access it, even if they intercept the transmission.
                  </p>
                </div>
              </FadeIn>
              <FadeIn>
                <div>
                  <p className="text-near-black font-black text-sm mb-3">Scanned before we touch it</p>
                  <p className="text-charcoal text-sm leading-relaxed font-light">
                    Every upload is checked against VirusTotal&apos;s database of 70+ security engines before processing. Files flagged as malicious are rejected automatically. This protects both you and our team.
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="right">
                <div>
                  <p className="text-near-black font-black text-sm mb-3">Commercial expertise, not legal advice</p>
                  <p className="text-charcoal text-sm leading-relaxed font-light">
                    LeaseIntel™ provides commercially informed analysis. Every report recommends formal legal advice from a qualified solicitor before signing. We identify the risks — your solicitor confirms enforceability.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* JOE QUOTE */}
        <section className="bg-near-black text-center" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
          <FadeIn>
            <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
              <div className="w-10 h-1 bg-teal mx-auto mb-8" />
              <p className="text-white font-light leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                &ldquo;Most business owners sign commercial leases they don&apos;t fully understand.
                LeaseIntel™ changes that. For $97, you get complete plain-English analysis —
                every risk identified, every opportunity flagged, every number quantified.
                Before you sign.&rdquo;
              </p>
              <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase">
                Joe Kelley — Managing Director, Your Office Space
              </p>
            </div>
          </FadeIn>
        </section>

        <Footer />
      </>
    )
  }

  /* ── FORM: STEP 1 — Details ──────────────────────────── */
  if (step === 'form-details') {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-near-black flex items-start justify-center px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="w-full max-w-md">
            <button
              onClick={() => setStep('landing')}
              className="text-white/40 text-xs tracking-widest uppercase mb-10 hover:text-white/70 transition-colors flex items-center gap-2 no-min-height"
            >
              ← Back
            </button>

            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-teal rounded-full" />
              <span className="text-teal font-bold text-xs tracking-widest uppercase">LeaseIntel™ — Free Summary</span>
            </div>

            <StepBar current={1} />

            <h2 className="text-white font-black leading-tight tracking-tight mb-2"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
              Tell us about yourself
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8 font-light">
              We&apos;ll send your free risk summary to this email within minutes.
            </p>

            <div className="flex flex-col gap-5">
              <Field
                label="Full name" value={form.name} onChange={set('name')}
                error={errors.name} required placeholder="Jane Smith"
                autoComplete="name"
              />
              <Field
                label="Email address" type="email" value={form.email} onChange={set('email')}
                error={errors.email} required placeholder="jane@company.com.au"
                autoComplete="email"
              />
              <Field
                label="Business / company" value={form.company} onChange={set('company')}
                placeholder="Smith & Co Pty Ltd" autoComplete="organization"
              />
              <Field
                label="Phone (optional)" type="tel" value={form.phone} onChange={set('phone')}
                placeholder="04XX XXX XXX" autoComplete="tel"
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Lease type" value={form.leaseType} onChange={set('leaseType')}
                  error={errors.leaseType} required
                  options={[
                    { value: 'Office', label: 'Office' },
                    { value: 'Retail', label: 'Retail' },
                    { value: 'Industrial', label: 'Industrial' },
                    { value: 'Mixed Use', label: 'Mixed Use' },
                  ]}
                />
                <SelectField
                  label="State" value={form.state} onChange={set('state')}
                  error={errors.state} required
                  options={['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'].map(s => ({ value: s, label: s }))}
                />
              </div>

              <button
                onClick={handleDetailsNext}
                className="inline-flex items-center justify-center bg-teal text-white font-bold text-[0.72rem] tracking-[0.14em] uppercase px-14 py-[1.25rem] hover:bg-dark-teal transition-all duration-200 min-h-[52px] mt-2"
              >
                Continue — Upload Lease →
              </button>

              <p className="text-white/25 text-xs leading-relaxed text-center">
                Your information is handled under the Australian Privacy Act 1988 and never shared.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ── FORM: STEP 2 — Upload ───────────────────────────── */
  if (step === 'form-upload') {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-near-black flex items-start justify-center px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <button
              type="button"
              onClick={() => setStep('form-details')}
              className="text-white/40 text-xs tracking-widest uppercase mb-10 hover:text-white/70 transition-colors flex items-center gap-2 no-min-height"
            >
              ← Back
            </button>

            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-teal rounded-full" />
              <span className="text-teal font-bold text-xs tracking-widest uppercase">LeaseIntel™ — Free Summary</span>
            </div>

            <StepBar current={2} />

            <h2 className="text-white font-black leading-tight tracking-tight mb-2"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
              Upload your lease
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8 font-light">
              PDF or Word document. We&apos;ll send your free risk summary within minutes.
            </p>

            <div className="flex flex-col gap-5">
              {/* Upload zone */}
              <label className={[
                'border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-all duration-200',
                'hover:border-teal/60 hover:bg-white/[0.03]',
                form.file ? 'border-teal/60 bg-teal/[0.04]' : 'border-white/20',
                errors.file ? 'border-red-400/60' : '',
              ].join(' ')}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => {
                    const f = e.target.files?.[0] || null
                    set('file')(f as unknown as string)
                    if (f) setErrors(prev => ({ ...prev, file: undefined }))
                  }}
                  className="hidden"
                  aria-label="Upload lease document"
                />
                {form.file ? (
                  <div>
                    <div className="w-10 h-10 bg-teal/15 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-teal font-black text-lg">✓</span>
                    </div>
                    <p className="text-teal font-bold text-sm mb-1">{form.file.name}</p>
                    <p className="text-white/35 text-xs">
                      {(form.file.size / (1024 * 1024)).toFixed(1)}MB · Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 bg-white/8 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white/50 text-xl">↑</span>
                    </div>
                    <p className="text-white/70 text-sm font-semibold mb-1">Drop your lease here</p>
                    <p className="text-white/35 text-xs">PDF or Word doc · Max 50MB</p>
                  </div>
                )}
              </label>

              {errors.file && (
                <p className="text-red-400 text-xs font-medium -mt-2">{errors.file}</p>
              )}

              {/* Security trust signals */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {[
                  '🔐 AES-256 encrypted in your browser',
                  '🛡️ Virus scanned before processing',
                  '🔒 TLS secured in transit',
                ].map(s => (
                  <span key={s} className="text-white/35 text-xs font-medium">{s}</span>
                ))}
              </div>
              <p className="text-white/20 text-xs leading-relaxed">
                Never shared or sold. Deleted 30 days after delivery. Australian Privacy Act 1988.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-[0.72rem] tracking-[0.14em] uppercase px-14 py-[1.25rem] hover:bg-dark-teal transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[52px]"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    {securityStep === 'scanning' && 'Scanning for threats…'}
                    {securityStep === 'encrypting' && 'Encrypting document…'}
                    {securityStep === 'sending' && 'Sending securely…'}
                    {securityStep === 'idle' && 'Submitting…'}
                  </>
                ) : (
                  'Get My Free Summary →'
                )}
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }

  /* ── SUBMITTED ───────────────────────────────────────── */
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-near-black flex items-center justify-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-teal/15 border border-teal/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-teal text-2xl font-black">✓</span>
          </div>
          <h2 className="text-white font-black leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
            Got it. We&apos;re on it.
          </h2>
          <p className="text-white/55 text-base leading-relaxed mb-10 font-light">
            Your free risk summary will be in your inbox shortly. Joe personally reviews every
            submission — if anything urgent shows up, expect to hear from him directly.
          </p>
          <div className="bg-white/[0.04] border border-white/10 rounded-sm p-7 mb-10 text-left">
            <p className="text-teal font-bold text-xs tracking-widest uppercase mb-5">What happens next</p>
            <div className="flex flex-col gap-4">
              {[
                'Free summary arrives in your inbox',
                'Your top 3 risks and overall rating explained',
                'Want the full report? Reply to the email — $97 Xero invoice sent',
                'Full 10-section report delivered within 24 hours of payment',
                'Request a free Clarity Call with Joe any time',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-teal font-black text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <p className="text-white/60 text-sm leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <a
            href={HUBSPOT.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-teal font-bold text-xs tracking-widest uppercase border-b border-teal/50 hover:border-teal hover:text-dark-teal transition-colors no-underline pb-0.5 no-min-height"
          >
            Skip ahead — book a Clarity Call now →
          </a>
        </div>
      </div>
    </>
  )
}
