'use client'
import { useId } from 'react'
import { LEASE_ACCEPT, leaseFileError } from '@/lib/lease-file-rules'
export default function LeaseAttachmentField({ file, onChange, dark = false }: { file: File | null; onChange: (file: File | null) => void; dark?: boolean }) {
  const id = useId()
  const error = file ? leaseFileError(file) : ''
  return <div className={`my-5 rounded-xl border p-4 ${dark ? 'border-white/20 text-white' : 'border-teal/30 text-charcoal'}`}>
    <label htmlFor={id} className="block font-bold mb-2">Current lease (optional)</label>
    <p id={`${id}-help`} className="text-sm mb-3">PDF or Word, up to 3 MB. Your lease is emailed to the YOS team with your request. You can submit without a document.</p>
    <input id={id} name="lease" type="file" accept={LEASE_ACCEPT} aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`} aria-invalid={Boolean(error)}
      className="block w-full max-w-full text-sm" onChange={e => { e.currentTarget.focus(); onChange(e.target.files?.[0] || null) }} />
    {file && <p className="text-sm mt-2 break-words">Selected: {file.name} <button type="button" className="underline font-bold ml-2" onClick={() => { onChange(null); const input = document.getElementById(id) as HTMLInputElement; if (input) input.value = '' }}>Remove lease</button></p>}
    {error && <p id={`${id}-error`} role="alert" className={`mt-2 text-sm ${dark ? 'text-red-400' : 'text-red-700'}`}>{error}</p>}
  </div>
}
