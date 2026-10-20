import ContactForm from '@/components/ContactForm'
import DiscoveryBooking from '@/components/DiscoveryBooking'

export default function ServiceEnquiry({ id, service, entryPage, title, description, prompts, placeholder }: {
  id: string
  service: 'FitOut' | 'Buying'
  entryPage: string
  title: string
  description: string
  prompts: readonly string[]
  placeholder: string
}) {
  return <section id={id} tabIndex={-1} aria-labelledby={`${id}-heading`} className="bg-warm-grey outline-none" style={{ padding: 'clamp(3rem,7vw,6rem) clamp(1.25rem,4vw,3rem)', scrollMarginTop: 110 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <header className="max-w-3xl mb-8">
        <p className="text-action-teal font-semibold text-sm uppercase tracking-widest">Start a conversation</p>
        <h2 id={`${id}-heading`} className="text-near-black leading-tight mt-4 mb-6" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)' }}>{title}</h2>
        <p className="text-charcoal leading-relaxed mb-6">{description}</p>
        </header>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      <div className="order-2 lg:order-1">
        <h3 className="text-near-black text-lg mb-3">Helpful if you know it</h3>
        <ul className="list-disc pl-5 space-y-3 text-charcoal leading-relaxed mb-6">{prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul>
        <p className="text-charcoal leading-relaxed mb-6">These details are optional for the first enquiry. You can start with your name and email, and we’ll help clarify the brief. No plans or documents are required to get in touch.</p>
        <p className="text-charcoal mb-6">Prefer to call? <a className="text-action-teal font-semibold underline underline-offset-4" href="tel:0240920733">02 4092 0733</a></p>
        <DiscoveryBooking />
      </div>
      <div className="enquiry-form-card bg-white rounded-2xl order-1 lg:order-2" style={{ padding: 'clamp(1.25rem,3vw,2.5rem)', minWidth: 0 }}>
        <h3 className="text-near-black text-2xl mb-5">Send your enquiry</h3>
        <ContactForm initialService={service} entryPage={entryPage} fixedService submitLabel={service === 'Buying' ? 'Send my property brief →' : 'Send my project enquiry →'} messagePlaceholder={placeholder} />
      </div>
      </div>
    </div>
  </section>
}
