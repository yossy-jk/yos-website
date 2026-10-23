import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const transpile = path => ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const policy = {}
vm.runInNewContext(transpile('src/lib/team-interest.ts'), { exports: policy })
const valid = { name: 'Fixture Person', email: 'fixture@example.invalid', location: 'Fixture region', role: 'Installer', arrangement: 'Open to discussing', contactPermission: true, submissionId: 'a1234567-1234-1234-1234-123456789abc' }
function handler({ preview = false, limited = false, failure = false } = {}) {
  const calls = [], exports = {}
  const mocks = {
    'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
    '@/lib/team-interest': policy,
    '@/lib/ratelimit': { contactLimiter: () => ({ limit: async () => ({ success: !limited }) }), getIp: () => 'fixture' },
    '@/lib/enquiry-delivery': { enquirySubmissionId: value => value, normaliseEnquiry: value => value, sendOwnerEnquiry: async (...args) => { calls.push(args); if (failure) throw Error('Fixture provider error') } },
  }
  vm.runInNewContext(transpile('src/app/api/team-interest/route.ts'), { exports, require: name => { assert.ok(name in mocks); return mocks[name] }, process: { env: { VERCEL_ENV: preview ? 'preview' : 'production' } }, Response, Request, URL })
  return { post: (data, headers = {}) => exports.POST(new Request('https://www.yourofficespace.au/api/team-interest', { method: 'POST', headers: { origin: 'https://www.yourofficespace.au', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) })), calls }
}
for (const role of policy.TEAM_ROLES) test(`${role}: inbox routing and fixed application source, without marketing subscription`, async () => {
  const h = handler(), result = await h.post({ ...valid, role, source: 'untrusted source', marketingConsent: true })
  assert.equal(result.status, 200)
  assert.match(result.headers.get('cache-control'), /no-store/)
  const [data, routing] = h.calls[0]
  assert.equal(data.source, `Work or Partner with YOS: ${role}`)
  assert.equal(data.enquiryPage, '/about/work-with-yos')
  assert.equal(data.details.contactPermission, true)
  assert.equal(data.marketingConsent, undefined)
  assert.equal(data.submissionId, valid.submissionId)
  if (role === 'Contract cleaner') { assert.equal(routing.recipient, 'sarah.kelley@yourofficespace.au'); assert.equal(routing.cc, 'jk@yourofficespace.au') } else assert.equal(routing, undefined)
})
test('missing fields, invalid role/email/arrangement, spam and withheld contact permission never deliver', async () => {
  for (const change of [{ name: '' }, { email: 'bad' }, { location: '' }, { role: 'invented' }, { arrangement: 'invented' }, { contactPermission: false }, { _honey: 'spam' }]) {
    const h = handler(), result = await h.post({ ...valid, ...change })
    assert.equal(result.status, 400); assert.equal(h.calls.length, 0)
  }
})
test('bad JSON, arrays, oversized submissions and cross-origin requests never deliver', async () => {
  for (const [data, headers, status] of [['{', {}, 400], ['[]', {}, 400], ['x'.repeat(16001), {}, 413], [valid, { origin: 'https://other.invalid' }, 403]]) {
    const h = handler(), result = await h.post(data, headers)
    assert.equal(result.status, status); assert.equal(h.calls.length, 0)
  }
})
test('preview reports success without any inbox delivery', async () => {
  const h = handler({ preview: true }), result = await h.post(valid)
  assert.equal((await result.json()).preview, true); assert.equal(h.calls.length, 0)
})
test('rate limit blocks delivery and provider failure cannot claim success', async () => {
  const limited = handler({ limited: true }); assert.equal((await limited.post(valid)).status, 429); assert.equal(limited.calls.length, 0)
  const failed = await handler({ failure: true }).post(valid); assert.equal(failed.status, 502); assert.equal((await failed.json()).ok, false)
})
test('optional phone, business and experience remain optional and free text is bounded', () => {
  const data = policy.parseTeamInterest({ ...valid, experience: 'a'.repeat(4000) })
  assert.equal(data.phone, ''); assert.equal(data.company, ''); assert.equal(data.experience.length, 3000)
})
