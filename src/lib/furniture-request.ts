import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { furnitureFileError, MAX_FURNITURE_FILE_BYTES } from './furniture-file-rules'
import type { LeaseAttachment } from './lease-request'

export class FurnitureRequestError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

/** Bound the actual streamed body, including requests without Content-Length. */
export async function readFurnitureRequest(req: Request): Promise<{ raw: Record<string, unknown>; attachment?: LeaseAttachment }> {
  const multipart = req.headers.get('content-type')?.startsWith('multipart/form-data')
  const limit = multipart ? MAX_FURNITURE_FILE_BYTES + 100000 : 20000
  if (Number(req.headers.get('content-length')) > limit) throw new FurnitureRequestError('The request is too large. Choose a smaller file or continue without one.', 413)
  const reader = req.body?.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        length += value.byteLength
        if (length > limit) {
          await reader.cancel()
          throw new FurnitureRequestError('The request is too large. Choose a smaller file or continue without one.', 413)
        }
        chunks.push(value)
      }
    } finally { reader.releaseLock() }
  }
  const body = Buffer.concat(chunks)
  const parsePayload = (text: string) => {
    if (text.length > 20000) throw new FurnitureRequestError('Please shorten your project details.', 413)
    const raw = JSON.parse(text)
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new FurnitureRequestError('Check your enquiry details.')
    return raw as Record<string, unknown>
  }
  if (!multipart) return { raw: parsePayload(body.toString('utf8')) }
  const form = await new Request(req.url, { method: 'POST', headers: req.headers, body }).formData()
  const payload = form.get('payload')
  if (typeof payload !== 'string') throw new FurnitureRequestError('Check your enquiry details.')
  const raw = parsePayload(payload)
  const file = form.get('attachment')
  if (!file || (typeof file !== 'string' && !file.name)) return { raw }
  if (typeof file === 'string') throw new FurnitureRequestError('Choose a project file or continue without one.')
  const error = furnitureFileError(file)
  if (error) throw new FurnitureRequestError(error, file.size > MAX_FURNITURE_FILE_BYTES ? 413 : 400)
  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split('.').at(-1)!.toLowerCase()
  const valid = (ext === 'pdf' && bytes.subarray(0, 5).toString() === '%PDF-')
    || (['jpg', 'jpeg'].includes(ext) && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    || (ext === 'png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    || (ext === 'dwg' && /^AC10\d{2}$/.test(bytes.subarray(0, 6).toString()))
  if (!valid) throw new FurnitureRequestError('The file does not match its file type. Choose another file or remove it to continue.')
  return { raw, attachment: { filename: file.name.replace(/[^a-z0-9._ -]/gi, '_').slice(-120), content: bytes.toString('base64'), size: bytes.length, digest: createHash('sha256').update(bytes).digest('hex'), label: 'Project file attached' } }
}
