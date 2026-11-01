import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { calculateCommercialRent, normaliseRentAmounts, validateCommercialRent, type CommercialRentInput } from './commercial-rent.ts'
const fixtures = JSON.parse(readFileSync(new URL('./commercial-rent-vectors.json', import.meta.url), 'utf8'))
const cents = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100
for (const f of fixtures) test(`${f.id}: supplied independent schedule, incentives and value fixtures`, () => {
  const { result: r, errors } = calculateCommercialRent(f.inp)
  assert.deepEqual(errors, {}); assert.ok(r)
  for (const [key, expected] of Object.entries(f.expected)) {
    if (key === 'rows') for (const [n, row] of (expected as Record<string, number>[]).entries()) for (const [k, v] of Object.entries(row)) assert.equal(cents(r.rows[n][k as keyof typeof row]), v, `${f.id} year ${n + 1} ${k}`)
    else if (key === 'sens') for (const [rate, value] of Object.entries(expected as Record<string, number>)) assert.equal(cents(r.sens.find(s => s.rate === Number(rate))!.value), value)
    else assert.equal(cents(r[key as keyof typeof r] as number), expected, `${f.id} ${key}`)
  }
})
const input: CommercialRentInput = fixtures[0].inp
for (const areaM2 of [0, NaN, -1, 100001]) test(`invalid area ${areaM2} hides results`, () => { const c = calculateCommercialRent({ ...input, areaM2 }); assert.equal(c.result, null); assert.equal(c.errors.areaM2, 'Enter the lettable area') })
test('rent-free cannot exceed term, and malformed or negative monetary inputs fail closed', () => {
  assert.equal(validateCommercialRent({ ...input, termYears: 1, rentFreeMonths: 13 }).rentFreeMonths, "Rent-free can't be longer than the lease")
  for (const key of ['faceRentPsm', 'outgoingsAnnual', 'fitoutContribution'] as const) for (const v of [-1, NaN, Infinity]) assert.equal(calculateCommercialRent({ ...input, [key]: v }).result, null)
  for (const termYears of [0, 1.5, 16]) assert.equal(calculateCommercialRent({ ...input, termYears }).result, null)
})
test('total rent, per-area outgoings and itemised outgoings reconcile V1', () => {
  for (const amounts of [normaliseRentAmounts(150, 67500, 'annual', 12000, 'annual'), normaliseRentAmounts(150, 450, 'psm', 80, 'psm'), normaliseRentAmounts(150, 450, 'psm', 0, 'annual', [5000, 3000, 4000])]) assert.deepEqual(calculateCommercialRent({ ...input, ...amounts }), calculateCommercialRent(input))
})
test('zero rates are preserved and term boundaries can be fully rent-free', () => {
  const { result: r } = calculateCommercialRent({ ...input, termYears: 1, reviewPct: 0, outgoingsIncreasePct: 0, rentFreeMonths: 12, outgoingsDuringRentFree: false })
  assert.ok(r); assert.equal(r.total_occupancy_ex, 0); assert.equal(r.rows[0].cumulative_inc, 0)
})
test('invalid cap rate suppresses only value; non-positive NOI never creates a capital value', () => {
  for (const capRatePct of [null, 0, -1, 21, NaN]) { const c = calculateCommercialRent({ ...input, capRatePct }); assert.ok(c.result); assert.equal(c.result.value, null) }
  const { result: r } = calculateCommercialRent({ ...input, capRatePct: 6, ownerCostsAnnual: 70000 }); assert.ok(r); assert.ok(r.noi_year1 < 0); assert.equal(r.value, null); assert.deepEqual(r.sens, [])
})
test('fitout contribution changes effective rent but never the cash schedule; unrounded totals reconcile', () => {
  const a = calculateCommercialRent(input).result!, b = calculateCommercialRent({ ...input, fitoutContribution: 20000 }).result!
  assert.deepEqual(a.rows, b.rows); assert.equal(a.effective_rent_annual - b.effective_rent_annual, 4000)
  assert.equal(a.total_occupancy_inc, a.rows.reduce((s, r) => s + r.total_inc, 0))
  assert.notEqual(a.total_occupancy_inc, a.rows.reduce((s, r) => s + cents(r.total_inc), 0))
})
