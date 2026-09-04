import assert from 'node:assert/strict'
import test from 'node:test'
import { createDownloadToken, validateDownloadToken } from './download-token.mjs'

const filename = 'YOS-Capability-Statement.pdf'
const secret = 'synthetic-test-secret-with-no-provider-access'
const now = 2_000_000_000
const token = createDownloadToken(filename, now + 900, secret)

test('valid token is accepted only for its file and secret', () => {
  assert.equal(validateDownloadToken(token, filename, secret, now), true)
  assert.equal(validateDownloadToken(token, 'another.pdf', secret, now), false)
  assert.equal(validateDownloadToken(token, filename, 'wrong-secret', now), false)
})

test('tampered, expired and missing-secret tokens fail closed', () => {
  const replacement = token.endsWith('A') ? 'B' : 'A'
  const tampered = token.slice(0, -1) + replacement
  assert.equal(validateDownloadToken(tampered, filename, secret, now), false)
  assert.equal(validateDownloadToken(token, filename, secret, now + 901), false)
  assert.equal(validateDownloadToken(token, filename, undefined, now), false)
})

test('token payload contains scope and expiry but not the signing secret', () => {
  const [payload] = token.split('.')
  const decoded = Buffer.from(payload, 'base64url').toString('utf8')
  assert.equal(decoded, `${filename}:${now + 900}`)
  assert.equal(token.includes(secret), false)
})
