import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { leaseFileError, MAX_LEASE_BYTES } from './lease-file-rules'
export type LeaseAttachment = { filename: string; content: string; size: number; digest: string; label?: string }
export class LeaseRequestError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}
export async function readLeaseRequest(req: Request): Promise<{ raw: Record<string, unknown>; attachment?: LeaseAttachment }> {
  const multipart = req.headers.get('content-type')?.startsWith('multipart/form-data')
  if (Number(req.headers.get('content-length')) > (multipart ? MAX_LEASE_BYTES + 100000 : 20000)) throw new LeaseRequestError('The request is too large. Try a smaller lease or continue without it.', 413)
  if (!multipart) {
    const text = await req.text()
    if (text.length > 20000) throw new LeaseRequestError('Request too large.', 413)
    const raw = JSON.parse(text)
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new LeaseRequestError('Invalid request details.')
    return { raw }
  }
  const form = await req.formData()
  const payload = form.get('payload')
  if (typeof payload !== 'string' || payload.length > 20000) throw new LeaseRequestError('Invalid request details.')
  const raw = JSON.parse(payload)
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new LeaseRequestError('Invalid request details.')
  const file = form.get('lease')
  if (!file || (typeof file !== 'string' && !file.name)) return { raw }
  if (typeof file === 'string') throw new LeaseRequestError('Choose a lease file.')
  const error = leaseFileError(file)
  if (error) throw new LeaseRequestError(error, file.size > MAX_LEASE_BYTES ? 413 : 400)
  const bytes = Buffer.from(await file.arrayBuffer())
  const extension = file.name.split('.').at(-1)!.toLowerCase()
  const pdf = extension === 'pdf' && bytes.subarray(0, 5).toString() === '%PDF-'
  const doc = extension === 'doc' && bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
  const docx = extension === 'docx' && bytes.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
  if (!pdf && !doc && !docx) throw new LeaseRequestError('The file does not match a PDF or Word document. Please choose another file, or continue without it.')
  return { raw, attachment: { filename: file.name.replace(/[^a-z0-9._ -]/gi, '_').slice(-120), content: bytes.toString('base64'), size: bytes.length, digest: createHash('sha256').update(bytes).digest('hex') } }
}
