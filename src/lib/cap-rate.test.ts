import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseCapNumber, calculateCapScenario, deriveAnnualNOI } from './cap-rate.ts'

test('strict monetary parsing accepts grouped amounts but never repairs invalid or negative input', () => {
  assert.equal(parseCapNumber('$1,500,000.25'), 1500000.25)
  assert.equal(parseCapNumber('0'), 0)
  for (const input of ['', ' ', '-500', '12,34', '12.3.4', 'Infinity', 'NaN', '1e309', '123abc', '9'.repeat(400)]) assert.equal(parseCapNumber(input), null)
})
test('the three explicit target modes reconcile the same independent example', () => {
  const inputs = { price: '1,500,000', noi: '90,000', rate: '6' }
  for (const target of ['rate', 'value', 'noi'] as const) assert.deepEqual(calculateCapScenario(target, inputs), { price: 1500000, noi: 90000, rate: 6 })
  const result = calculateCapScenario('value', { ...inputs, rate: '7' })
  assert.ok(!('error' in result)); assert.ok(Math.abs(result.price - 1285714.2857142857) < 0.000001)
})
test('the selected target ignores a stale third field and never silently changes mode', () => {
  assert.deepEqual(calculateCapScenario('rate', { price: '1500000', noi: '90000', rate: '99' }), { price: 1500000, noi: 90000, rate: 6 })
  assert.deepEqual(calculateCapScenario('noi', { price: '1500000', noi: '999', rate: '6' }), { price: 1500000, noi: 90000, rate: 6 })
  assert.deepEqual(calculateCapScenario('value', { price: '123', noi: '90000', rate: '6' }), { price: 1500000, noi: 90000, rate: 6 })
})
test('zero income is a valid income yield but cannot create a capitalised market value', () => {
  assert.deepEqual(calculateCapScenario('rate', { price: '1000000', noi: '0', rate: '' }), { price: 1000000, noi: 0, rate: 0 })
  for (const inputs of [{ price: '', noi: '90000', rate: '0' }, { price: '', noi: '0', rate: '6' }, { price: '', noi: '-1000', rate: '6' }]) assert.ok('error' in calculateCapScenario('value', inputs))
  assert.ok('error' in calculateCapScenario('rate', { price: '0', noi: '90000', rate: '' }))
})
test('NOI helper applies vacancy once and deducts only the entered unrecovered expenses', () => {
  assert.deepEqual(deriveAnnualNOI('120000', '5', '15000'), { noi: 99000 })
  assert.deepEqual(deriveAnnualNOI('120000', '0', '15000'), { noi: 105000 })
  assert.deepEqual(deriveAnnualNOI('120000', '100', '15000'), { noi: -15000 })
  assert.ok('error' in deriveAnnualNOI('120000', '101', '15000'))
  assert.ok('error' in deriveAnnualNOI('120000', '-1', '15000'))
})
test('positive scenario round trips preserve unrounded values over varied amounts and rates', () => {
  for (const price of [0.01, 100000, 1234567.89, 25000000]) for (const rate of [0.01, 4.75, 6, 12.5, 110]) {
    const noi = price * rate / 100
    const result = calculateCapScenario('value', { price: '', noi: noi.toFixed(12), rate: String(rate) })
    assert.ok(!('error' in result)); assert.ok(Math.abs(result.price - price) < Math.max(0.00001, price * 1e-10))
  }
})
test('overflow and missing input return an explanation rather than Infinity or a stale result', () => {
  assert.ok('error' in calculateCapScenario('value', { price: '', noi: '9'.repeat(307), rate: '0.00000000001' }))
  assert.ok('error' in calculateCapScenario('noi', { price: '', noi: '', rate: '6' }))
})

test('only the reviewed cap-rate tool is released from the financial-tool indexing guard', () => {
  const policy = readFileSync(new URL('./search-policy.ts', import.meta.url), 'utf8')
  assert.ok(!policy.includes('/resources/cap-rate-calculator'))
  for (const route of ['stamp-duty-calculator', 'land-tax-calculator', 'rental-yield-calculator']) assert.ok(policy.includes(route))
  const metadata = readFileSync(new URL('../app/resources/cap-rate-calculator/layout.tsx', import.meta.url), 'utf8')
  assert.match(metadata, /robots: \{ index: true, follow: true \}/)
  const sitemap = readFileSync(new URL('../app/sitemap.ts', import.meta.url), 'utf8')
  assert.match(sitemap, /resources\/cap-rate-calculator`, lastModified: '2026-10-22'/)
})
