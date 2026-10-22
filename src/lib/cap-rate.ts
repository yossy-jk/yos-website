export type CapTarget = 'rate' | 'value' | 'noi'
export type CapResult = { price: number; noi: number; rate: number } | { error: string }

export function parseCapNumber(input: string): number | null {
  const text = input.trim().replace(/^\$\s*/, '')
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(text)) return null
  const value = Number(text.replaceAll(',', ''))
  return Number.isFinite(value) ? value : null
}

export function calculateCapScenario(target: CapTarget, inputs: { price: string; noi: string; rate: string }): CapResult {
  const price = parseCapNumber(inputs.price), noi = parseCapNumber(inputs.noi), rate = parseCapNumber(inputs.rate)
  let result: CapResult
  if (target === 'rate') {
    if (price === null || price <= 0 || noi === null) return { error: 'Enter a positive property price and a non-negative annual NOI.' }
    result = { price, noi, rate: noi / price * 100 }
  } else if (target === 'value') {
    if (noi === null || noi <= 0 || rate === null || rate <= 0) return { error: 'A capitalised value requires positive annual NOI and a positive cap rate.' }
    result = { price: noi / (rate / 100), noi, rate }
  } else {
    if (price === null || price <= 0 || rate === null) return { error: 'Enter a positive property price and a non-negative cap rate.' }
    result = { price, noi: price * (rate / 100), rate }
  }
  return Object.values(result).every(Number.isFinite) ? result : { error: 'These inputs exceed the calculator’s numeric range.' }
}

export function deriveAnnualNOI(grossInput: string, vacancyInput: string, costsInput: string): { noi: number } | { error: string } {
  const gross = parseCapNumber(grossInput), vacancy = parseCapNumber(vacancyInput), costs = parseCapNumber(costsInput)
  if (gross === null || vacancy === null || costs === null || vacancy > 100) return { error: 'Enter non-negative annual amounts and a vacancy allowance from 0% to 100%.' }
  const noi = gross * (1 - vacancy / 100) - costs
  return Number.isFinite(noi) ? { noi } : { error: 'These inputs exceed the calculator’s numeric range.' }
}
