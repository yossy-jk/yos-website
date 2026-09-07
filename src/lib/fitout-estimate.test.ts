import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateFitoutEstimate, type FitoutInputs } from './fitout-estimate.ts'

const baseInputs: FitoutInputs = {
  fitoutType: 'turnkey',
  sqm: '100',
  shellCondition: 'warm',
  tier: 'basic',
  workstationType: 'fixed',
  desks: '10',
  meetingRooms: '1',
  hasKitchen: false,
  hasReception: false,
  hasAV: false,
  buildingType: '',
  timeframe: '',
}

test('optional fitout items are only priced when selected', () => {
  const withoutExtras = calculateFitoutEstimate(baseInputs)
  const withExtras = calculateFitoutEstimate({
    ...baseInputs,
    hasKitchen: true,
    hasReception: true,
    hasAV: true,
  })

  assert.ok(withoutExtras)
  assert.ok(withExtras)
  assert.equal(withoutExtras.breakdown.some((row) => row.label === 'Kitchen / breakout'), false)
  assert.equal(withExtras.breakdown.some((row) => row.label === 'Kitchen / breakout'), true)
  assert.equal(withExtras.totalLow - withoutExtras.totalLow, 14850)
  assert.equal(withExtras.totalHigh - withoutExtras.totalHigh, 19305)
})

test('every displayed breakdown sums to the displayed total', () => {
  const cases: FitoutInputs[] = [
    baseInputs,
    { ...baseInputs, fitoutType: 'furniture-only', tier: 'mid', workstationType: 'eha' },
    { ...baseInputs, shellCondition: 'cold', tier: 'premium', hasKitchen: true, hasReception: true, hasAV: true },
  ]

  for (const inputs of cases) {
    const estimate = calculateFitoutEstimate(inputs)
    assert.ok(estimate)
    assert.equal(estimate.breakdown.reduce((sum, row) => sum + row.low, 0), estimate.totalLow)
    assert.equal(estimate.breakdown.reduce((sum, row) => sum + row.high, 0), estimate.totalHigh)
  }
})

test('invalid numeric inputs fail closed', () => {
  assert.equal(calculateFitoutEstimate({ ...baseInputs, desks: 'not-a-number' }), null)
  assert.equal(calculateFitoutEstimate({ ...baseInputs, meetingRooms: '-1' }), null)
  assert.equal(calculateFitoutEstimate({ ...baseInputs, sqm: '0' }), null)
})
