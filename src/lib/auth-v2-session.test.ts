import assert from 'node:assert/strict'
import test from 'node:test'
import { createSignedSessionToken, hashOneTimeCode, verifyOneTimeCode, verifySignedSessionToken, type AuthV2SessionPayload } from './auth-session.ts'

const session: AuthV2SessionPayload = {
  userId: 'user_test',
  email: 'owner@example.com',
  role: 'super',
  scopes: ['operations'],
  allowed_clients: [],
  exp: Math.floor(Date.now() / 1000) + 300,
}

test('auth-v2 creates an opaque, verifiable two-part token for dotted emails', async () => {
  const secret = 'test-session-key-'.repeat(4)
  const token = createSignedSessionToken(session, secret)
  assert.equal(token.split('.').length, 2)
  assert.equal(token.includes(session.email), false)
  assert.deepEqual(verifySignedSessionToken(token, secret), session)
})

test('auth-v2 refuses to sign with a missing or short secret', async () => {
  assert.throws(() => createSignedSessionToken(session, 'too-short'), /AUTH_COOKIE_SECRET/)
})

test('auth-v2 rejects tampered and expired session tokens', () => {
  const secret = 'test-session-key-'.repeat(4)
  const token = createSignedSessionToken(session, secret)
  assert.equal(verifySignedSessionToken(`${token}tampered`, secret), null)
  const expired = createSignedSessionToken({ ...session, exp: 1 }, secret)
  assert.equal(verifySignedSessionToken(expired, secret), null)
})

test('one-time codes are stored as hashes and compared safely', () => {
  const secret = 'test-session-key-'.repeat(4)
  const storedHash = hashOneTimeCode('123456', secret)
  assert.equal(storedHash.includes('123456'), false)
  assert.equal(verifyOneTimeCode('123456', storedHash, secret), true)
  assert.equal(verifyOneTimeCode('654321', storedHash, secret), false)
})
