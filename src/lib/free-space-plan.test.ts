import test from 'node:test'
import assert from 'node:assert/strict'
import { normaliseSpacePlan } from './free-space-plan.ts'
const valid = { name: 'Preview Example', email: 'qa@example.invalid', suburb: 'Newcastle', brief: 'Initial workplace planning request', builderEngaged: 'no', contactPermission: true }
test('free plan only accepts a business without an engaged builder and explicit contact permission', () => {
  for (const builderEngaged of ['yes', '', undefined]) assert.throws(() => normaliseSpacePlan({ ...valid, builderEngaged }))
  assert.throws(() => normaliseSpacePlan({ ...valid, contactPermission: false }))
  assert.throws(() => normaliseSpacePlan({ ...valid, name: '' }))
  assert.throws(() => normaliseSpacePlan({ ...valid, email: 'invalid' }))
  assert.throws(() => normaliseSpacePlan({ ...valid, _honey: 'spam' }))
})
test('free plan fixes source, strips unknown data and keeps marketing opt-in off', () => {
  const data = normaliseSpacePlan({ ...valid, source: 'Spoofed source', marketingConsent: true, privateData: 'not retained' })
  assert.equal(data.source, 'Free space plan')
  assert.equal(data.marketingConsent, false)
  assert.equal(data.phone, '')
  assert.equal(data.company, '')
  assert.equal(data.details.builderEngaged, 'No')
  assert.ok(!JSON.stringify(data).includes('not retained'))
})
