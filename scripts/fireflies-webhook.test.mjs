import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as crypto from 'node:crypto'

const api = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/fireflies-webhook.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports: api, require: name => { assert.equal(name, 'node:crypto'); return crypto }, Buffer, Uint8Array })
const secret = 'fixture-only-signing-secret'
const bytes = Buffer.from('{"meetingId":"fixture","title":"Café"}')
const signature = 'sha256=' + createHmac('sha256', secret).update(bytes).digest('hex')

test('signature verifies exact raw UTF-8 bytes and rejects tampering or another key', () => {
  assert.equal(api.verifyFirefliesSignature(bytes, signature, secret), true)
  assert.equal(api.verifyFirefliesSignature(Buffer.concat([bytes, Buffer.from(' ')]), signature, secret), false)
  assert.equal(api.verifyFirefliesSignature(bytes, signature, 'different'), false)
})
test('signature fails closed for missing config, missing header and malformed digests', () => {
  for (const header of [null, '', 'sha256=x', 'sha1=' + 'a'.repeat(64), 'sha256=' + 'z'.repeat(64), 'sha256=' + 'a'.repeat(66)]) assert.equal(api.verifyFirefliesSignature(bytes, header, secret), false)
  assert.equal(api.verifyFirefliesSignature(bytes, signature, ''), false)
})
test('bounded reader accepts exact body and rejects oversized content-length before reading', async () => {
  assert.deepEqual(Buffer.from(await api.readFirefliesBody(new Request('https://fixture.invalid', { method: 'POST', body: bytes }))), bytes)
  await assert.rejects(api.readFirefliesBody(new Request('https://fixture.invalid', { method: 'POST', headers: { 'content-length': '999999' }, body: 'x' })), /Body too large/)
})
test('bounded reader cancels oversized streams even without a content-length', async () => {
  let cancelled = false
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(api.FIREFLIES_BODY_LIMIT + 1)) }, cancel() { cancelled = true } })
  await assert.rejects(api.readFirefliesBody(new Request('https://fixture.invalid', { method: 'POST', body, duplex: 'half' })), /Body too large/)
  assert.equal(cancelled, true)
})
test('V1 and initial V2 transcribed events share a dedupe identity across migration', () => {
  const now = Date.now()
  const legacy = api.parseFirefliesEvent({ meetingId: 'fixture', eventType: 'Transcription completed' }, now)
  const modern = api.parseFirefliesEvent({ meeting_id: 'fixture', event: 'meeting.transcribed', timestamp: now }, now)
  assert.equal(legacy.meetingId, 'fixture')
  assert.equal(legacy.deduplicationKey, modern.deduplicationKey)
  assert.equal(legacy.deduplicationKey.includes('fixture'), false)
})
test('V2 retries retain identity but a revised transcript can be processed separately', () => {
  const now = Date.now(), original = { meeting_id: 'fixture', event: 'meeting.transcribed', timestamp: now }
  const first = api.parseFirefliesEvent(original, now)
  assert.equal(first.deduplicationKey, api.parseFirefliesEvent({ ...original, timestamp: now + 1000 }, now + 1000).deduplicationKey)
  assert.notEqual(first.deduplicationKey, api.parseFirefliesEvent({ ...original, reprocessed_at: now - 1000 }, now).deduplicationKey)
})
test('malformed IDs, old or future V2 deliveries and revisions are rejected', () => {
  const now = Date.now(), event = { meeting_id: 'fixture', event: 'meeting.transcribed', timestamp: now }
  for (const id of ['', '../x', 'x'.repeat(201), 42]) assert.throws(() => api.parseFirefliesEvent({ ...event, meeting_id: id }, now), /Invalid meeting ID/)
  for (const timestamp of [undefined, '123', now - 600001, now + 600001, NaN]) assert.throws(() => api.parseFirefliesEvent({ ...event, timestamp }, now), /Invalid delivery timestamp/)
  for (const reprocessed_at of [-1, '1', now + 600001]) assert.throws(() => api.parseFirefliesEvent({ ...event, reprocessed_at }, now), /Invalid revision/)
  for (const value of [null, [], 'x']) assert.throws(() => api.parseFirefliesEvent(value), /Invalid payload/)
})
test('unsubscribed event kinds are skipped without entering the transcript pipeline', () => {
  assert.equal(api.parseFirefliesEvent({ event: 'meeting.bot_joined' }), null)
  assert.equal(api.parseFirefliesEvent({ event: 'meeting.summarized' }), null)
  assert.equal(api.parseFirefliesEvent({ eventType: 'other' }), null)
})

const basePayload = () => ({ meetingId: 'fixture', eventType: 'Transcription completed' })
function routeFixture(options = {}) {
  let providerCalls = 0, queues = 0
  const receipts = new Set(), jobs = [], exports = {}
  const env = { FIREFLIES_WEBHOOK_SECRET: secret, FIREFLIES_API_KEY: 'fixture-only-api-key', UPSTASH_REDIS_REST_URL: 'https://fixture.invalid', UPSTASH_REDIS_REST_TOKEN: 'fixture-token', ...options.env }
  class Redis {
    async exists(key) { if (options.storeFailure) throw Error('Fixture storage failure'); return receipts.has(key) ? 1 : 0 }
    async eval(script, keys, args) {
      assert.equal(script, api.FIREFLIES_ENQUEUE_SCRIPT)
      assert.equal(keys[1], 'yos:tasks:pending-transcripts')
      if (options.queueFailure) throw Error('Fixture queue failure')
      if (options.unknownAck) return null
      if (receipts.has(keys[0])) return 0
      receipts.add(keys[0]); queues++; jobs.push(JSON.parse(args[0])); return 1
    }
  }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/api/fireflies-webhook/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, require: name => {
      if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } }
      if (name === '@upstash/redis') return { Redis }
      if (name === '@/lib/fireflies-webhook') return api
      throw Error('Unexpected import')
    }, process: { env }, Buffer, AbortSignal, fetch: async (url, request) => {
      providerCalls++; assert.equal(url, 'https://api.fireflies.ai/graphql')
      assert.equal(JSON.parse(request.body).variables.transcriptId, 'fixture')
      if (options.providerFailure) return Response.json({}, { status: 503 })
      if (options.graphqlError) return Response.json({ errors: [{ message: 'fixture' }] })
      return Response.json({ data: { transcript: options.missingTranscript ? null : { id: options.wrongId ? 'other' : 'fixture', title: 'Fixture meeting', date: 123, participants: ['fixture@example.invalid'], summary: { action_items: 'Fixture action' }, sentences: [] } } })
    }, Response, Request, URL,
  })
  return {
    post: (payload = basePayload(), signatureOverride, headers = {}) => {
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
      const sig = signatureOverride === undefined ? 'sha256=' + createHmac('sha256', secret).update(body).digest('hex') : signatureOverride
      return exports.POST(new Request('https://fixture.invalid/api/fireflies-webhook', { method: 'POST', headers: { ...(sig ? { 'x-hub-signature': sig } : {}), ...headers }, body }))
    }, counts: () => ({ providerCalls, queues }), jobs,
  }
}
test('missing configuration, unsigned or bad-signature calls fail before providers', async () => {
  for (const key of ['FIREFLIES_WEBHOOK_SECRET', 'FIREFLIES_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']) {
    const f = routeFixture({ env: { [key]: '' } }); assert.equal((await f.post()).status, 503); assert.deepEqual(f.counts(), { providerCalls: 0, queues: 0 })
  }
  for (const signature of [null, 'sha256=' + '0'.repeat(64)]) {
    const f = routeFixture(); assert.equal((await f.post(basePayload(), signature)).status, 401); assert.equal(f.counts().providerCalls, 0)
  }
})
test('signed malformed, oversized and stale events cannot cause outbound requests', async () => {
  for (const [body, headers, status] of [['{', {}, 400], ['null', {}, 400], ['x'.repeat(17000), {}, 413], [basePayload(), { 'content-length': '17000' }, 413], [{ event: 'meeting.transcribed', meeting_id: 'fixture', timestamp: 1 }, {}, 400]]) {
    const f = routeFixture(); assert.equal((await f.post(body, undefined, headers)).status, status); assert.equal(f.counts().providerCalls, 0)
  }
})
test('signed events retain consumer job shape and V1/V2 initial retries enqueue only once', async () => {
  const f = routeFixture(), first = await f.post()
  assert.equal(first.status, 200); assert.match(first.headers.get('cache-control'), /no-store/)
  assert.equal((await first.json()).queued, true)
  assert.equal((await (await f.post()).json()).duplicate, true)
  assert.equal((await (await f.post({ meeting_id: 'fixture', event: 'meeting.transcribed', timestamp: Date.now() })).json()).duplicate, true)
  assert.deepEqual(f.counts(), { providerCalls: 1, queues: 1 })
  assert.equal(f.jobs[0].meetingId, 'fixture'); assert.equal(f.jobs[0].summary.action_items, 'Fixture action'); assert.ok(f.jobs[0].receivedAt)
})
test('concurrent signed retries have one queue acknowledgement', async () => {
  const f = routeFixture(), results = await Promise.all(Array.from({ length: 12 }, () => f.post()))
  const bodies = await Promise.all(results.map(response => response.json()))
  assert.equal(bodies.filter(body => body.queued).length, 1); assert.equal(f.counts().queues, 1)
})
test('provider, storage and queue failures cannot report success or lose retry eligibility', async () => {
  for (const option of ['providerFailure', 'graphqlError', 'wrongId', 'storeFailure', 'queueFailure', 'unknownAck']) {
    const f = routeFixture({ [option]: true }); const response = await f.post(); assert.equal(response.status, 502); assert.equal((await response.json()).ok, false); assert.equal(f.counts().queues, 0)
  }
  const absent = routeFixture({ missingTranscript: true }); assert.equal((await absent.post()).status, 404); assert.equal(absent.counts().queues, 0)
})
test('preview and unrelated signed events have no provider or queue effects', async () => {
  const preview = routeFixture({ env: { VERCEL_ENV: 'preview' } }); assert.equal((await preview.post()).status, 404); assert.equal(preview.counts().providerCalls, 0)
  const ignored = routeFixture(); assert.equal((await (await ignored.post({ event: 'meeting.bot_joined' })).json()).skipped, true); assert.equal(ignored.counts().providerCalls, 0)
})
