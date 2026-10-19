import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createHash, randomUUID, webcrypto } from 'node:crypto'
function load(file, dependencies = {}, globals = {}) {
  const exports = {}
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(output, { exports, require: name => { if (!(name in dependencies)) throw Error(`Unexpected dependency ${name}`); return dependencies[name] }, Request, Response, URL, JSON, Date, ...globals })
  return exports
}
const rules = load('src/lib/furniture-file-rules.ts')
const reader = load('src/lib/furniture-request.ts', { 'node:buffer': { Buffer }, 'node:crypto': { createHash }, './furniture-file-rules': rules })
const input = { name: 'Synthetic QA', email: 'qa@example.invalid', source: 'Untrusted source', submissionId: '12345678-1234-1234-1234-123456789abc', submittedAt: '2026-10-19T04:00:00Z', enquiryPage: '/resources/furniture-quote', details: { workstations: 20 }, message: 'Synthetic test brief only' }
const pdf = Buffer.from('%PDF-1.4\nSynthetic test only\n%%EOF')
function request(bytes, filename = 'plan.pdf', body = input) {
  if (!bytes) return new Request('https://example.invalid/api/furniture-quote', { method: 'POST', body: JSON.stringify(body) })
  const form = new FormData(); form.set('payload', JSON.stringify(body)); form.set('attachment', new File([bytes], filename))
  return new Request('https://example.invalid/api/furniture-quote', { method: 'POST', body: form })
}
function setup({ preview = false, reject = false, limited = false } = {}) {
  const messages = []
  const delivery = load('src/lib/enquiry-delivery.ts', {
    './enquiry-email': load('src/lib/enquiry-email.ts'), 'node:crypto': { randomUUID },
    'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
    '@/lib/ratelimit': { contactLimiter: () => ({ limit: async () => ({ success: !limited }) }), getIp: () => 'fixture' },
    resend: { Resend: class { emails = { send: async (message, options) => { messages.push({ message, options }); return reject ? { error: { message: 'Synthetic rejection' } } : { data: { id: 'synthetic-accepted' } } } } } },
  }, { process: { env: { RESEND_API_KEY: 'fixture', VERCEL_ENV: preview ? 'preview' : 'production' } } })
  const route = load('src/app/api/furniture-quote/route.ts', { '@/lib/furniture-request': reader, '@/lib/enquiry-delivery': delivery, 'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } } })
  return { route, messages }
}
test('optional project files accept supported signatures and reject mismatches, empty and oversized files', async () => {
  assert.equal((await reader.readFurnitureRequest(request())).attachment, undefined)
  for (const [bytes, filename] of [[pdf, 'plan.pdf'], [Buffer.from([255, 216, 255, 1]), 'plan.jpg'], [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1]), 'plan.png'], [Buffer.from('AC1032 synthetic'), 'plan.dwg']]) {
    const parsed = await reader.readFurnitureRequest(request(bytes, filename))
    assert.equal(parsed.attachment.filename, filename)
    assert.equal(parsed.attachment.digest, createHash('sha256').update(bytes).digest('hex'))
  }
  for (const [bytes, filename] of [[Buffer.from('not PDF'), 'bad.pdf'], [pdf, 'bad.exe'], [Buffer.alloc(0), 'empty.pdf'], [Buffer.alloc(rules.MAX_FURNITURE_FILE_BYTES + 1), 'large.pdf']]) {
    await assert.rejects(() => reader.readFurnitureRequest(request(bytes, filename)))
  }
})
test('actual streamed bytes are bounded even with absent or dishonest Content-Length', async () => {
  for (const claimed of [undefined, '1']) {
    let cancelled = false
    const stream = new ReadableStream({ pull(controller) { controller.enqueue(new Uint8Array(1024 * 1024)) }, cancel() { cancelled = true } })
    const req = new Request('https://example.invalid/api/furniture-quote', { method: 'POST', body: stream, duplex: 'half', headers: { 'content-type': 'multipart/form-data; boundary=fixture', ...(claimed ? { 'content-length': claimed } : {}) } })
    await assert.rejects(() => reader.readFurnitureRequest(req), error => error.status === 413)
    assert.equal(cancelled, true)
  }
})
test('one accepted owner email contains brief, project attachment, reference and page context', async () => {
  const { route, messages } = setup()
  const response = await route.POST(request(pdf))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).reference, input.submissionId)
  assert.equal(messages.length, 1)
  const { message, options } = messages[0]
  assert.equal(message.to, 'jk@yourofficespace.au')
  assert.equal(message.replyTo, input.email)
  assert.match(message.text, /Furniture Quote Request/)
  assert.match(message.text, /Workstations: 20/)
  assert.match(message.text, /PROJECT FILE ATTACHED/)
  assert.doesNotMatch(message.text, /LEASE ATTACHED|Untrusted source/)
  assert.match(message.text, /Enquiry page: \/resources\/furniture-quote/)
  assert.equal(message.attachments[0].content, pdf.toString('base64'))
  assert.equal(options.idempotencyKey, `${input.submissionId}-owner`)
})
test('rejection, rate limits, malformed data and cross-origin requests cannot produce success; previews send no mail', async () => {
  for (const [options, expected] of [[{ reject: true }, 502], [{ limited: true }, 429], [{ preview: true }, 200]]) {
    const { route, messages } = setup(options)
    const response = await route.POST(request(pdf)); assert.equal(response.status, expected)
    if (options.preview) { assert.equal((await response.json()).preview, true); assert.equal(messages.length, 0) }
  }
  const { route, messages } = setup()
  for (const body of [{ ...input, name: '' }, { ...input, email: 'invalid' }, { ...input, _honey: 'bot' }]) assert.equal((await route.POST(request(undefined, undefined, body))).status, 400)
  const cross = request(); cross.headers.set('origin', 'https://external.invalid')
  assert.equal((await route.POST(cross)).status, 403)
  assert.equal(messages.length, 0)
})
test('multipart browser retries keep the same payload and new file content gets a new reference', async () => {
  const calls = []
  const browser = load('src/lib/enquiry.ts', {}, { crypto: { randomUUID, subtle: webcrypto.subtle }, FormData, fetch: async (_, options) => { calls.push(options.body); return Response.json({ ok: true }) } })
  const file = new File([pdf], 'plan.pdf')
  await browser.postEnquiry('/api/furniture-quote', input, file, 'attachment')
  await browser.postEnquiry('/api/furniture-quote', input, file, 'attachment')
  assert.equal(calls[0].get('payload'), calls[1].get('payload'))
  assert.equal(calls[0].get('lease'), null)
  assert.equal(await calls[0].get('attachment').text(), pdf.toString())
  await browser.postEnquiry('/api/furniture-quote', input, new File([Buffer.concat([pdf, Buffer.from(' changed')])], 'plan.pdf'), 'attachment')
  assert.notEqual(JSON.parse(calls[0].get('payload')).submissionId, JSON.parse(calls[2].get('payload')).submissionId)
})
