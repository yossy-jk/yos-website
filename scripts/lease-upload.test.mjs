import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createHash } from 'node:crypto'
function load(file, mocks = {}, extra = {}) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { exports, require: name => { if (!(name in mocks)) throw Error(name); return mocks[name] }, Request, Response, Date, JSON, process: { env: { VERCEL_ENV: 'production', RESEND_API_KEY: 'test', UPSTASH_REDIS_REST_URL: 'test', UPSTASH_REDIS_REST_TOKEN: 'test' } }, ...extra })
  return exports
}
const rules = load('src/lib/lease-file-rules.ts')
const reader = load('src/lib/lease-request.ts', { 'node:buffer': { Buffer }, 'node:crypto': { createHash }, './lease-file-rules': rules })
const payload = { kind: 'health_check', fields: { name: 'QA', email: 'qa@example.invalid', business: 'QA', mobile: '0240920733', suburb: 'Newcastle', intent: 'unsure' }, submissionId: '12345678-1234-1234-1234-123456789abc' }
const pdf = Buffer.from('%PDF-1.4\nYOS synthetic QA lease, no client data\n%%EOF')
function request(file = pdf, filename = 'qa-lease.pdf') {
  const form = new FormData()
  form.set('payload', JSON.stringify(payload))
  if (file) form.set('lease', new File([file], filename))
  return new Request('https://example.invalid/api/tenant-lead', { method: 'POST', body: form })
}
test('lease attachment is optional, size bounded and checked against document signatures', async () => {
  assert.equal((await reader.readLeaseRequest(request(null))).attachment, undefined)
  const parsed = await reader.readLeaseRequest(request())
  assert.equal(parsed.attachment.filename, 'qa-lease.pdf')
  assert.equal(Buffer.from(parsed.attachment.content, 'base64').toString(), pdf.toString())
  await assert.rejects(() => reader.readLeaseRequest(request(Buffer.from('not a PDF'))))
  await assert.rejects(() => reader.readLeaseRequest(request(pdf, 'virus.exe')))
  await assert.rejects(() => reader.readLeaseRequest(request(Buffer.alloc(rules.MAX_LEASE_BYTES + 1))))
  const word = await reader.readLeaseRequest(request(Buffer.from([0x50, 0x4b, 0x03, 0x04, 1, 2]), 'lease.docx'))
  assert.equal(word.attachment.filename, 'lease.docx')
})
function route(preview = false, failFirst = false) {
  const messages = [], records = new Map()
  const handler = load('src/app/api/tenant-lead/route.ts', {
    '@/lib/lease-request': reader, 'next/server': { NextResponse: { json: (body, opts) => Response.json(body, opts) } },
    'node:crypto': { createHash },
    '@upstash/redis': { Redis: class {
      async set(k, value, options = {}) { if (options.nx && records.has(k)) return null; records.set(k, structuredClone(value)); return 'OK' }
      async get(k) { return records.get(k) || null }
      async del(k) { records.delete(k) }
    } },
    resend: { Resend: class { emails = { send: async (message) => { messages.push(message); if (failFirst && messages.length === 1) throw Error('Ambiguous delivery'); return { data: { id: 'accepted' } } } } } },
    '@/lib/ratelimit': { contactLimiter: () => null, getIp: () => '' },
    '@/lib/tenant-leads': { validateTenantLead: raw => ({ ...raw, urgency: 'Check', honeypot: '' }), resultsEmailText: () => '', TENANT_ROUTING: { recipients: ['jk@yourofficespace.au'] } },
    '@/lib/tenant-offer': { TENANT_OFFER: { approvedForPublication: true, delivery: { lockSeconds: 300, receiptRetentionSeconds: 604800 } } },
    '@/lib/tenant-calculations': { responseTaskDue: () => '2026-10-15T00:00:00Z' },
  }, preview ? { process: { env: { VERCEL_ENV: 'preview' } } } : {})
  return { handler, messages, records }
}
test('accepted lease goes only to YOS, is not stored in Redis, and retries do not duplicate it', async () => {
  const { handler, messages, records } = route()
  const response = await handler.POST(request())
  assert.equal(response.status, 200)
  assert.equal((await response.json()).leaseReceived, true)
  assert.equal(messages.length, 2)
  assert.equal(messages[0].to[0], 'jk@yourofficespace.au')
  assert.equal(messages[0].attachments[0].content, pdf.toString('base64'))
  assert.equal(messages[1].attachments, undefined)
  assert.ok(!JSON.stringify([...records.values()]).includes('qa-lease.pdf'))
  assert.equal((await (await handler.POST(request())).json()).duplicate, true)
  assert.equal(messages.length, 2)
  assert.equal((await handler.POST(request(Buffer.from('%PDF-1.4 different')))).status, 409)
})
test('preview uploads cannot send email or persist lease data', async () => {
  const { handler, messages, records } = route(true)
  assert.equal((await (await handler.POST(request())).json()).preview, true)
  assert.equal(messages.length, 0)
  assert.equal(records.size, 0)
})

test('an ambiguous send retries with an identical provider payload', async () => {
  const { handler, messages } = route(false, true)
  assert.equal((await handler.POST(request())).status, 502)
  assert.equal((await handler.POST(request())).status, 200)
  assert.deepEqual(messages[0], messages[1])
})
