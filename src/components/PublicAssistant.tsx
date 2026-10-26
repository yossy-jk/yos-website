'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ASSISTANT_CONTACT_PERMISSION } from '@/lib/public-assistant'
import { postEnquiry } from '@/lib/enquiry'
import { DISCOVERY_BOOKING_URL } from '@/lib/constants'

type Reply = { question: string; answer: string; sources: { id: string; title: string; url: string }[]; mode: string }

export default function PublicAssistant() {
  const pathname = usePathname()
  // No chat on account, payment, private brief or internal workspace routes.
  if (/^\/(?:dashboard|api|eof-group|auth|login)(?:\/|$)|^\/tenant-rep\/(?:brief|payment)(?:\/|$)/.test(pathname)) return null
  return <AssistantPanel key={pathname} />
}

function AssistantPanel() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [replies, setReplies] = useState<Reply[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [leadOpen, setLeadOpen] = useState(false)
  const [summary, setSummary] = useState('')
  const [sending, setSending] = useState(false)
  const [leadError, setLeadError] = useState('')
  const [receipt, setReceipt] = useState<{ preview: boolean; reference?: string } | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const receiptEl = useRef<HTMLDivElement>(null)
  const questionEl = useRef<HTMLTextAreaElement>(null)
  const answerEl = useRef<HTMLDivElement>(null)
  const abort = useRef<AbortController | null>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const modal = dialog.current, opener = trigger.current, overflow = document.body.style.overflow
    modal?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { modal?.close(); document.body.style.overflow = overflow; opener?.focus({ preventScroll: true }) }
  }, [open])
  useEffect(() => () => abort.current?.abort(), [])
  useEffect(() => { if (receipt) receiptEl.current?.focus() }, [receipt])
  useEffect(() => { if (replies.length) answerEl.current?.scrollIntoView({ block: 'nearest' }) }, [replies.length])

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !question.trim()) return
    const submitted = question.trim()
    setBusy(true); setError('')
    const controller = new AbortController(); abort.current = controller
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ question: submitted, previousQuestions: replies.slice(-2).map(reply => reply.question) }) })
      const data = await response.json()
      if (!response.ok || typeof data.answer !== 'string' || !Array.isArray(data.sources)) throw Error('Answer unavailable')
      setReplies(current => [...current.slice(-5), { question: submitted, ...data }]); setQuestion('')
    } catch { if (!controller.signal.aborted) setError('We could not load an answer. Your question is still here. Please retry or ask the team below.') }
    finally { setBusy(false) }
  }
  async function sendLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    const form = new FormData(event.currentTarget)
    setSending(true); setLeadError('')
    try {
      const response = await postEnquiry('/api/assistant/lead', { name: form.get('name'), email: form.get('email'), phone: form.get('phone'), company: form.get('company'), message: summary, contactPermission: form.get('contactPermission') === 'on', _honey: form.get('_honey') })
      const data = await response.json()
      if (!response.ok || data.ok !== true) throw Error('Unconfirmed delivery')
      setReceipt({ preview: data.preview === true, reference: typeof data.reference === 'string' ? data.reference : undefined })
    } catch { setLeadError('We could not confirm delivery. Your details are still here. Retry, email hello@yourofficespace.au or call 02 4092 0733.') }
    finally { setSending(false) }
  }
  function showLead() {
    if (!summary) setSummary(replies.map(reply => reply.question).join('\n').slice(-3000))
    setLeadOpen(true)
  }

  return <>
    <button ref={trigger} className="yos-assistant-launch" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Ask YOS + YOF</button>
    {open && <dialog ref={dialog} className="yos-assistant-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`} onCancel={event => { event.preventDefault(); setOpen(false) }} onClose={() => setOpen(false)}>
      <header className="yos-assistant-header"><div><p className="yos-assistant-eyebrow">Your workplace, connected</p><h2 id={`${id}-title`}>Ask YOS + YOF</h2></div><button type="button" onClick={() => setOpen(false)} autoFocus aria-label="Close website assistant">Close</button></header>
      <div className="yos-assistant-body">
        <p id={`${id}-intro`}>Ask about our property, FitOut, furniture or cleaning services. We can help you find the next step and connect you with the team.</p>
        <p className="yos-assistant-note">AI answers use reviewed public website information and may need team confirmation. Questions may be processed by MiniMax. Keep contact details, order numbers and confidential information out of chat. <a href="/privacy">Privacy</a>.</p>
        {!replies.length && <div className="yos-assistant-prompts" aria-label="Question ideas">{['How can YOS help my business?', 'I need furniture for a new office', 'Where do you offer cleaning?'].map(prompt => <button type="button" key={prompt} onClick={() => { setQuestion(prompt); questionEl.current?.focus() }}>{prompt}</button>)}</div>}
        <div role="log" aria-label="Questions and answers" aria-live="polite" aria-relevant="additions" className="yos-assistant-log">
          {replies.map((reply, index) => <article key={index}><p className="yos-assistant-question"><strong>You:</strong> {reply.question}</p><div className="yos-assistant-answer"><p className="yos-assistant-note">{reply.mode === 'ai' ? 'AI assistant' : 'From our website'}</p><p style={{ whiteSpace: 'pre-wrap' }}>{reply.answer}</p>{reply.sources.length > 0 && <ul aria-label="Relevant website pages">{reply.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>}</div></article>)}
        </div>
        <div ref={answerEl} />
        <form onSubmit={ask} className="yos-assistant-ask"><label htmlFor={`${id}-question`}>Your question</label><textarea ref={questionEl} id={`${id}-question`} value={question} onChange={event => setQuestion(event.target.value)} maxLength={1200} required rows={2} aria-describedby={error ? `${id}-error` : undefined} /><button type="submit" disabled={busy}>{busy ? 'Finding an answer…' : 'Ask a question'}</button><p role="status">{busy ? 'Looking at our public information. Please wait.' : ''}</p>{error && <p id={`${id}-error`} role="alert">{error}</p>}</form>
        <section className="yos-assistant-handoff" aria-labelledby={`${id}-handoff`}><h3 id={`${id}-handoff`}>Let’s take the next step</h3><p>Want a quote, more information or help with your requirements?</p><div className="yos-assistant-actions"><button type="button" onClick={showLead}>Ask the team to contact me</button><a href={DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book 15 minutes with Joe<span className="sr-only"> (opens in a new tab)</span></a></div>
          {leadOpen && (receipt ? <div ref={receiptEl} tabIndex={-1} role="status" className="yos-assistant-receipt"><h3>{receipt.preview ? 'Preview only, enquiry not sent' : 'Your enquiry has been sent'}</h3><p>{receipt.preview ? 'This preview did not email the team. Use the live website or call 02 4092 0733.' : 'The YOS team has your contact details and the summary you submitted. They can follow up about your enquiry.'}</p>{receipt.reference && <p>Reference: {receipt.reference}</p>}<a href="/contact">Contact details</a></div> : <form onSubmit={sendLead} className="yos-assistant-lead"><p>Share your details and review the summary below. We send this form to the YOS team by email; your chat transcript is not sent. This is not a marketing subscription.</p>
            <label htmlFor={`${id}-name`}>Name (required)</label><input id={`${id}-name`} name="name" autoComplete="name" required maxLength={200} />
            <label htmlFor={`${id}-email`}>Email (required)</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} />
            <label htmlFor={`${id}-phone`}>Phone (optional)</label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={80} />
            <label htmlFor={`${id}-company`}>Business (optional)</label><input id={`${id}-company`} name="company" autoComplete="organization" maxLength={200} />
            <label htmlFor={`${id}-summary`}>What would you like help with? (required)</label><textarea id={`${id}-summary`} name="message" value={summary} onChange={event => setSummary(event.target.value)} required maxLength={3000} rows={4} />
            <div hidden aria-hidden="true"><label htmlFor={`${id}-website`}>Leave empty</label><input id={`${id}-website`} name="_honey" tabIndex={-1} autoComplete="off" /></div>
            <label className="yos-assistant-permission"><input name="contactPermission" type="checkbox" required /> <span>{ASSISTANT_CONTACT_PERMISSION} <a href="/privacy">Privacy policy</a>.</span></label>
            {leadError && <p role="alert">{leadError}</p>}<button type="submit" disabled={sending}>{sending ? 'Sending your enquiry…' : 'Send my enquiry to the team'}</button>
          </form>)}
        </section>
        <p className="yos-assistant-note">For an existing order or private project, <a href="/contact">contact the team directly</a>. Answers do not confirm a price, stock, delivery date or booking.</p>
      </div>
    </dialog>}
  </>
}
