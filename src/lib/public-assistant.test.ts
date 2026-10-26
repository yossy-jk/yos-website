import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PUBLIC_ASSISTANT_SOURCES, selectAssistantSources, validateAssistantLead, assistantEvidence, ASSISTANT_CONTACT_PERMISSION } from './public-assistant.ts'

test('matches actual enquiries to relevant public evidence', () => {
  for (const [question, id] of [
    ['Do you clean offices in Lake Macquarie?', 'cleaning'],
    ['Are you the builder for our office fit out?', 'fitout'],
    ['Can you buy a commercial property for my business?', 'buying'],
    ['We need to negotiate a lease renewal', 'leasing'],
    ['Do you sell height adjustable desks?', 'desks'],
    ['What phone meeting pods do you have?', 'pods'],
    ['Can I visit a showroom?', 'yof-contact'],
    ['Is delivery available to Northern Territory?', 'yof'],
    ['Can you supply furniture to Darwin, and are you the builder for our fit out?', 'yof'],
    ['Can you arrange office plant hire or electrical test and tag?', 'flourish'],
    ['What tables and reception furniture do you sell?', 'range'],
    ['Can you give us a furniture project quote?', 'yof-quote'],
  ]) assert.ok(selectAssistantSources(question).some(source => source.id === id), `${question}: ${id}`)
})

test('short follow-up keeps topic context and always includes business and handoff facts', () => {
  const sources = selectAssistantSources('And what about timing?', ['I need cleaning'])
  assert.ok(sources.some(source => source.id === 'cleaning'))
  assert.ok(sources.some(source => source.id === 'about'))
  assert.ok(sources.some(source => source.id === 'contact'))
  assert.ok(sources.length <= 6)
})

test('model cannot inject external links or unselected sources', () => {
  const selected = selectAssistantSources('cleaning')
  const evidence = assistantEvidence(['cleaning', 'https://attacker.example', 'desks', 'cleaning'], selected)
  assert.deepEqual(evidence.map(source => source.id), ['cleaning'])
  assert.deepEqual(assistantEvidence('cleaning', selected), [])
  for (const source of PUBLIC_ASSISTANT_SOURCES) assert.ok(['www.yourofficespace.au', 'www.yourofficefurniture.com.au'].includes(new URL(source.url).hostname))
})

test('handoff requires explicit contact permission, valid email, name and useful brief', () => {
  const good = { name: 'Prospect', email: 'prospect@example.invalid', message: 'Please quote eight desks', contactPermission: true }
  assert.equal(validateAssistantLead(good).consentWording, ASSISTANT_CONTACT_PERMISSION)
  for (const change of [{ contactPermission: false }, { contactPermission: 'true' }, { email: '' }, { email: 'invalid' }, { name: '' }, { message: '' }]) {
    assert.throws(() => validateAssistantLead({ ...good, ...change }))
  }
  const lead = validateAssistantLead({ ...good, marketingConsent: true, phone: '123', company: 'Example', transcript: 'private conversation' })
  assert.equal(lead.marketingConsent, false)
  assert.equal('transcript' in lead, false)
  assert.equal(lead.phone, '123')
})
