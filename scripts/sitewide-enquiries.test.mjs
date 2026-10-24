import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { randomUUID } from 'node:crypto'
function load(file, mocks, extra = {}) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { exports, require: name => { if (!(name in mocks)) throw Error(`Unexpected provider: ${name}`); return mocks[name] }, Request, Response, Date, JSON, process: { env: { RESEND_API_KEY: 'test', VERCEL_ENV: 'production' } }, ...extra })
  return exports
}
const fileRules = load('src/lib/lease-file-rules.ts', {});
const leaseRequest = load('src/lib/lease-request.ts', { 'node:buffer': { Buffer }, 'node:crypto': { createHash: (await import('node:crypto')).createHash }, './lease-file-rules': fileRules });
const leaseReview = load('src/lib/lease-review.ts', {});
const json = { NextResponse: { json: (body, opts) => Response.json(body, opts) } }
function setup(result = { data: { id: 'accepted' } }, env = {}) {
  const messages = []
  const delivery = load('src/lib/enquiry-delivery.ts', {
      './enquiry-email': load('src/lib/enquiry-email.ts', {}),
    'next/server': json, 'node:crypto': { randomUUID },
    resend: { Resend: class { emails = { send: async (message, options) => { messages.push({ message, options }); return result } } } },
    '@/lib/ratelimit': { contactLimiter: () => null, getIp: () => '' },
  }, { process: { env: { RESEND_API_KEY: 'test', VERCEL_ENV: 'production', ...env } } })
  return { delivery, messages }
}
const input = { name: 'YOS QA', email: 'qa@example.invalid', phone: '0240920733', source: 'Furniture enquiry', message: 'Need 20 desks', submissionId: '12345678-1234-1234-1234-123456789abc' }
const request = (body = input) => new Request('https://example.invalid/api/enquiry', { method: 'POST', body: JSON.stringify(body) })

test('all compatibility routes deliver to the fixed inbox with no CRM credentials', async () => {
  const { delivery, messages } = setup()
  for (const endpoint of ['enquiry', 'contact', 'notify', 'hubspot', 'space-planner-gate']) {
    const route = load(`src/app/api/${endpoint}/route.ts`, { '@/lib/enquiry-delivery': delivery })
    assert.equal((await route.POST(request())).status, 200)
  }
  assert.equal(messages.length, 5)
  for (const { message, options } of messages) {
    assert.equal(message.to, 'jk@yourofficespace.au')
    assert.equal(message.replyTo, input.email)
    assert.ok(message.text.includes('Need 20 desks'))
    assert.equal(options.idempotencyKey, `${input.submissionId}-owner`)
  }
})

test('provider rejection or missing accepted ID cannot produce a success receipt', async () => {
  for (const result of [{ error: { message: 'Rejected' } }, { data: null }]) {
    const { delivery } = setup(result)
    assert.equal((await delivery.enquiryResponse(request())).status, 502)
  }
  const { delivery, messages } = setup()
  assert.equal((await delivery.enquiryResponse(request({ ...input, email: 'invalid' }))).status, 400)
  assert.equal(messages.length, 0)
})

test('preview requests send no owner email and marketing consent is never inferred', async () => {
  const { delivery, messages } = setup(undefined, { VERCEL_ENV: 'preview' })
  assert.equal((await (await delivery.enquiryResponse(request())).json()).preview, true)
  assert.equal(messages.length, 0)
  assert.equal(delivery.normaliseEnquiry(input).marketingConsent, false)
  assert.equal(delivery.normaliseEnquiry({ ...input, marketingConsent: 'true' }).marketingConsent, false)
  assert.equal(delivery.normaliseEnquiry({ ...input, marketingConsent: true }).marketingConsent, true)
})

test('space planner quotes keep every selected item and room in the email', async () => {
  const { delivery, messages } = setup()
  const items = Array.from({ length: 12 }, (_, i) => ({ name: `Chair ${i}`, qty: i + 1 }))
  for (const [endpoint, body] of [
    ['space-planner-lead', { ...input, items, recommendations: ['Add storage'], walls: [{ type: 'glass', length: 4 }] }],
    ['space-planner-quote', { contact: { firstName: 'YOS', lastName: 'QA', email: input.email, phone: input.phone }, items, room: { width: 8, depth: 10, type: 'office' } }],
  ]) {
    const route = load(`src/app/api/${endpoint}/route.ts`, { '@/lib/enquiry-delivery': delivery, 'next/server': json })
    assert.equal((await route.POST(request(body))).status, 200)
    assert.ok(messages.at(-1).message.text.includes('Chair 11'))
  }
})

test('browser retries reuse the same email request ID and changed details get a new ID', async () => {
  const calls = []
  const browser = load('src/lib/enquiry.ts', {}, { crypto: { randomUUID }, fetch: async (url, options) => { calls.push({ url, body: JSON.parse(options.body) }); return Response.json({ ok: true }) } })
  await browser.sendEnquiry(input)
  await browser.sendEnquiry(input)
  await browser.sendEnquiry({ ...input, message: 'Need 30 desks' })
  assert.equal(calls[0].url, '/api/enquiry')
  assert.deepEqual(calls[0].body, calls[1].body, 'Retries must keep the whole provider request stable, including timestamps')
  assert.equal(calls[0].body.submissionId, calls[1].body.submissionId)
  assert.notEqual(calls[1].body.submissionId, calls[2].body.submissionId)
})

test('public form routes contain no HubSpot requests or third-party quote-system dependency', () => {
  const files = ['contact', 'notify', 'hubspot', 'enquiry', 'space-planner-gate', 'space-planner-lead', 'space-planner-quote', 'market-snapshot-register', 'lease-risk-capture', 'cleaning-careers', 'fitout-report', 'download/capability-statement']
  for (const endpoint of files) assert.doesNotMatch(fs.readFileSync(`src/app/api/${endpoint}/route.ts`, 'utf8'), /HUBSPOT_TOKEN|hubapi\.com|hsforms\.com|createOdooDraft|yos:hubspot:actions/)
  assert.doesNotMatch(fs.readFileSync('src/components/HubSpotForm.tsx', 'utf8'), /<Script|hsforms\.net|hbspt/)
})

test('specialised registrations and reports require confirmed inbox delivery', async () => {
  const cases = [
    ['market-snapshot-register', { firstname: input.name, email: input.email, region: 'Newcastle' }],
    ['lease-risk-capture', { firstname: input.name, email: input.email, answers: { term: '7+ years', options: 'No options', makegood: 'Full reinstatement required' } }],
    ['cleaning-careers', { ...input, type: 'employee', experience: 'Offices', yearsExp: '3', availability: 'Evenings' }],
    ['download/capability-statement', { firstname: input.name, email: input.email }],
    ['fitout-report', { ...input, fitoutType: 'turnkey', sqm: '200', tier: 'mid', shellCondition: 'warm', workstationType: 'fixed', desks: '20', meetingRooms: '2', hasKitchen: true, hasReception: false, hasAV: false }],
  ]
  for (const [endpoint, body] of cases) {
    for (const accepted of [true, false]) {
      const { delivery, messages } = setup(accepted ? { data: { id: 'accepted' } } : { error: { message: 'Not accepted' } })
      const customerMessages = []
      const route = load(`src/app/api/${endpoint}/route.ts`, {
        'next/server': json, '@/lib/enquiry-delivery': delivery, '@/lib/lease-request': leaseRequest, '@/lib/lease-review': leaseReview,
        resend: { Resend: class { emails = { send: async message => { customerMessages.push(message); return { data: { id: 'customer' } } } } } },
        '@/lib/ratelimit': { contactLimiter: () => null, fitoutLimiter: () => null, getIp: () => '' },
        '@/lib/deployment-scope': { isPreviewDeployment: () => false },
        '@/lib/download-token.mjs': { createDownloadToken: () => 'signed-fixture' },
        '@/lib/fitout-estimate': { calculateFitoutEstimate: () => ({ totalLow: 100, totalHigh: 200, perSqm: { low: 1, high: 2 }, breakdown: [] }) },
      }, { process: { env: { RESEND_API_KEY: 'fixture', DOWNLOAD_SIGNING_SECRET: 'fixture', VERCEL_ENV: 'production' } }, console: { error() {}, warn() {} } })
      const response = await route.POST(request({ ...body, submissionId: input.submissionId }))
      assert.equal(response.status, accepted ? 200 : 502, `${endpoint}: accepted=${accepted}`)
      assert.equal(messages.length, 1, `${endpoint} must attempt inbox delivery`)
      if (endpoint === 'fitout-report' && accepted) {
        assert.equal(customerMessages.length, 1)
        assert.ok(customerMessages[0].html.includes('stored planning allowances'))
        assert.ok(customerMessages[0].html.includes('not verified market evidence or a supplier quote'))
        assert.ok(customerMessages[0].html.includes('/office-fitout#fitout-enquiry'))
        assert.ok(!customerMessages[0].html.includes('fixed-price proposal'))
      }
      if (endpoint === 'cleaning-careers') {
        assert.equal(messages[0].message.to, 'sarah.kelley@yourofficespace.au')
        assert.equal(messages[0].message.cc, 'jk@yourofficespace.au')
        assert.ok(messages[0].message.text.includes('Evenings'))
      }
    }
  }
})

test('the ten-question lease review forwards an optional attachment only to the YOS inbox', async () => {
  const { delivery, messages } = setup()
  const route = load('src/app/api/lease-risk-capture/route.ts', {
    'next/server': json, '@/lib/enquiry-delivery': delivery, '@/lib/lease-request': leaseRequest, '@/lib/lease-review': leaseReview,
    resend: { Resend: class { emails = { send: async () => ({ data: { id: 'customer' } }) } } },
  }, { console: { error() {}, warn() {} } })
  const form = new FormData()
  form.set('payload', JSON.stringify({ firstname: input.name, email: input.email, answers: { term: '7+ years' }, submissionId: input.submissionId }))
  form.set('lease', new File(['%PDF-1.4 YOS QA only'], 'qa-lease.pdf'))
  assert.equal((await route.POST(new Request('https://example.invalid/api/lease-risk-capture', { method: 'POST', body: form }))).status, 200)
  assert.equal(messages[0].message.to, 'jk@yourofficespace.au')
  assert.equal(messages[0].message.attachments[0].filename, 'qa-lease.pdf')
  assert.equal(Buffer.from(messages[0].message.attachments[0].content, 'base64').toString(), '%PDF-1.4 YOS QA only')
})

test('accepted enquiry references reconcile to the owner record and strip private page context', async () => {
  const { delivery, messages } = setup()
  const response = await delivery.enquiryResponse(request({ ...input, enquiryPage: '/contact?email=secret@example.invalid', entryPage: '/office-fitout#private' }))
  assert.equal((await response.json()).reference, input.submissionId)
  assert.match(messages[0].message.text, /Enquiry page: \/contact/)
  assert.match(messages[0].message.text, /Service entry page: \/office-fitout/)
  assert.doesNotMatch(messages[0].message.text, /secret@example.invalid|#private/)
  for (const page of ['/tenant-rep/brief/private-token', '/tenant-rep/payment', '//external.invalid', '/dashboard/leads', '/contact/<script>', '/contact/%40private']) {
    assert.equal(delivery.normaliseEnquiry({ ...input, enquiryPage: page }).enquiryPage, undefined)
  }
})

test('browser transport records public page context without query data and omits private paths', async () => {
  const calls = []
  const window = { location: { pathname: '/office-fitout', search: '?email=private@example.invalid' } }
  const browser = load('src/lib/enquiry.ts', {}, { window, crypto: { randomUUID }, fetch: async (url, options) => { calls.push(JSON.parse(options.body)); return Response.json({ ok: true, reference: input.submissionId }) } })
  assert.equal((await browser.sendEnquiry(input)).reference, input.submissionId)
  assert.equal(calls[0].enquiryPage, '/office-fitout')
  window.location.pathname = '/tenant-rep/brief/private-token'
  await browser.sendEnquiry(input)
  assert.equal(calls[1].enquiryPage, undefined)
  assert.doesNotMatch(JSON.stringify(calls), /private@example.invalid|private-token/)
})


test('lease questionnaire email matches the screen scoring for the three previously mismatched answer labels and a matching control', async () => {
  const { delivery } = setup()
  const sent = []
  const route = load('src/app/api/lease-risk-capture/route.ts', {
    'next/server': json, '@/lib/enquiry-delivery': delivery, '@/lib/lease-request': leaseRequest, '@/lib/lease-review': leaseReview,
    resend: { Resend: class { emails = { send: async message => { sent.push(message); return { data: { id: 'fixture' } } } } } },
  }, { console: { error() {}, warn() {} } })
  const answers = { assignment: 'No, not permitted', guarantee: 'Yes, unlimited guarantee', demolition: 'Yes, without adequate notice', solicitor: 'Skimmed it myself' }
  const risk = leaseReview.assessLeaseAnswers(answers)
  assert.equal(risk.high, 3)
  assert.equal(risk.medium, 1)
  assert.equal(risk.level, 'high')
  assert.equal((await route.POST(request({ firstname: '<b>QA Fixture</b>', email: input.email, answers, submissionId: input.submissionId }))).status, 200)
  assert.equal(sent.length, 1)
  assert.ok(sent[0].html.includes('&lt;b&gt;QA Fixture&lt;/b&gt;'))
  assert.ok(!sent[0].html.includes('<b>QA Fixture</b>'))
  assert.ok(sent[0].html.includes('HIGHER REVIEW PRIORITY'))
  for (const issue of risk.issues) assert.ok(sent[0].html.includes(issue))
  assert.ok(sent[0].html.includes(leaseReview.LEASE_REVIEW_MESSAGES.high))
  assert.ok(!sent[0].html.includes('no hidden issues'))
})
