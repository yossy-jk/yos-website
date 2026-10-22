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
