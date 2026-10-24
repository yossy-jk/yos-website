import test from 'node:test'
import assert from 'node:assert/strict'
import { assessLeaseAnswers, LEASE_QUESTIONS, LEASE_REVIEW_MESSAGES } from './lease-review.ts'

test('three previously divergent email answers and the solicitor-review control retain their classifications', () => {
  assert.deepEqual(assessLeaseAnswers({ assignment: 'No, not permitted', guarantee: 'Yes, unlimited guarantee', demolition: 'Yes, without adequate notice', solicitor: 'Skimmed it myself' }), {
    high: 3, medium: 1, level: 'high', issues: ['Can you assign or sublet the lease? No, not permitted', 'Does the lease require a personal guarantee? Yes, unlimited guarantee', 'Does the landlord have a demolition or redevelopment clause? Yes, without adequate notice', 'Has a solicitor reviewed this lease? Skimmed it myself']
  })
})
test('existing priority thresholds are retained and unrecognised answers are not invented as findings', () => {
  assert.equal(assessLeaseAnswers({ term: '5 years', options: '1 option', random: 'high', guarantee: 'invented' }).level, 'low')
  assert.equal(assessLeaseAnswers({ term: '7+ years' }).level, 'medium')
  assert.equal(assessLeaseAnswers({ term: '1–2 years', rent_review: 'Combination / not sure', fitout: 'Not requested' }).level, 'medium')
  assert.equal(assessLeaseAnswers({ term: '7+ years', options: 'No options', makegood: 'Full reinstatement required' }).level, 'high')
})
test('ten questionnaire options remain unique and lower flag wording does not promise lease suitability', () => {
  assert.equal(LEASE_QUESTIONS.length, 10)
  assert.equal(new Set(LEASE_QUESTIONS.map(q => q.id)).size, 10)
  for (const q of LEASE_QUESTIONS) for (const answer of Object.keys(q.risk)) assert.ok(q.options.includes(answer))
  assert.match(LEASE_REVIEW_MESSAGES.low, /does not establish/)
})
