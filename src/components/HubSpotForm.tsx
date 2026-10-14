'use client'
// Legacy component name retained for partner page compatibility; no vendor embed.
import ContactForm from '@/components/ContactForm'
export default function HubSpotForm({ targetId, className = '' }: { formId?: string; targetId: string; className?: string }) {
  return <div id={targetId} className={className}><ContactForm initialService={targetId.includes('furniture') ? 'Furniture' : 'Leasing'} /></div>
}
