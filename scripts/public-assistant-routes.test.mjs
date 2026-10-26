import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createHmac } from 'node:crypto'
const knowledge = {}
const compile = (path, exports, require, extra = {}) => vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports, require, Request, Response, URL, ...extra })
compile('src/lib/public-assistant.ts', knowledge)
const answers = {}
compile('src/lib/public-assistant-answer.ts', answers, () => knowledge, { AbortSignal, fetch })
const origin = 'https://www.yourofficespace.au'
function ask(body, headers = { origin }) { return new Request(origin + '/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }) }
function endpoint(env = {}, results = []) {
  let calls = 0
  const identities = [], exports = {}
  compile('src/app/api/assistant/route.ts', exports, id => ({
    'node:crypto': { createHmac },
    '@upstash/redis': { Redis: class {} },
    '@upstash/ratelimit': { Ratelimit: class { static slidingWindow() {} static fixedWindow() {} async limit(id) { identities.push(id); return results.shift() || { success: true } } } },
    '@/lib/ratelimit': { getIp: () => '192.0.2.8' },
    '@/lib/deployment-scope': { deploymentScopedKey: key => key },
    '@/lib/public-assistant-answer': { ...answers, generateAssistantAnswer: async () => { calls++; return { answer: 'Reviewed answer', sources: [], mode: 'ai' } } },
  })[id], { process: { env } })
  return { post: exports.POST, calls: () => calls, identities }
}
const configured = { MINIMAX_API_KEY: 'test', UPSTASH_REDIS_REST_URL: 'https://example.invalid', UPSTASH_REDIS_REST_TOKEN: 'test' }
test('origin, input and contact boundaries prevent a model call', async () => {
  const route = endpoint(configured)
  assert.equal((await route.post(ask({ question: 'cleaning' }, {}))).status, 403)
  assert.equal((await route.post(ask({ question: '' }))).status, 400)
  const result = await (await route.post(ask({ question: 'Email me at qa@example.invalid' }))).json()
  assert.equal(result.mode, 'website')
  assert.equal(route.calls(), 0)
})
test('missing configuration, exhausted limits and datastore timeout never invoke paid generation', async () => {
  for (const route of [endpoint(), endpoint(configured, [{ success: false }]), endpoint(configured, [{ success: true, reason: 'timeout' }]), endpoint(configured, [{ success: true }, { success: false }])]) {
    assert.equal((await (await route.post(ask({ question: 'cleaning' }))).json()).mode, 'website')
    assert.equal(route.calls(), 0)
  }
  const route = endpoint(configured)
  const response = await route.post(ask({ question: 'cleaning' }))
  assert.equal((await response.json()).mode, 'ai')
  assert.equal(route.calls(), 1)
  assert.match(route.identities[0], /^[a-f0-9]{64}$/)
  assert.equal(route.identities[1], 'all')
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
})
test('only explicit, visitor-reviewed follow-up fields enter the inbox boundary', async () => {
  const exports = {}; let sent
  compile('src/app/api/assistant/lead/route.ts', exports, id => ({
    '@/lib/public-assistant': knowledge,
    '@/lib/enquiry-delivery': { enquiryResponse: async req => { sent = await req.json(); return Response.json({ ok: true, preview: true }) } },
  })[id])
  const payload = { name: 'QA Example', email: 'qa@example.invalid', message: 'Eight desks', phone: '', contactPermission: false, marketingConsent: true, transcript: 'DO NOT FORWARD', source: 'spoofed' }
  assert.equal((await exports.POST(ask(payload))).status, 400)
  assert.equal(sent, undefined)
  const response = await exports.POST(ask({ ...payload, contactPermission: true }))
  assert.equal((await response.json()).preview, true)
  assert.equal(sent.source, 'Website assistant follow-up')
  assert.equal(sent.marketingConsent, false)
  assert.equal(sent.transcript, undefined)
  assert.equal(sent.message, 'Eight desks')
  assert.equal(sent.details.summaryReviewedByVisitor, true)
})
