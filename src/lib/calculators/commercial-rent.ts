export type CommercialRentInput = {
  areaM2: number; faceRentPsm: number; leaseType: 'net' | 'gross'; outgoingsAnnual: number;
  termYears: number; reviewPct: number; outgoingsIncreasePct: number; rentFreeMonths: number;
  outgoingsDuringRentFree: boolean; fitoutContribution: number; showGst: boolean;
  capRatePct: number | null; ownerCostsAnnual: number;
}
export type RentRow = { year: number; base: number; rent_free: number; outgoings_payable: number; total_ex: number; gst: number; total_inc: number; cumulative_inc: number }
export function normaliseRentAmounts(area: number, rent: number, rentMode: 'psm' | 'annual', outgoings: number, outgoingsMode: 'psm' | 'annual', items?: number[]) {
  return { faceRentPsm: rentMode === 'annual' ? rent / area : rent, outgoingsAnnual: items ? items.reduce((a, b) => a + b, 0) : outgoingsMode === 'psm' ? outgoings * area : outgoings }
}
export function validateCommercialRent(i: CommercialRentInput): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!Number.isFinite(i.areaM2) || i.areaM2 <= 0 || i.areaM2 > 100000) errors.areaM2 = 'Enter the lettable area'
  if (!Number.isFinite(i.faceRentPsm) || i.faceRentPsm <= 0 || i.faceRentPsm > 1e12) errors.faceRentPsm = 'Enter a positive face rent within the calculator range'
  for (const k of ['outgoingsAnnual', 'fitoutContribution', 'ownerCostsAnnual'] as const) if (!Number.isFinite(i[k]) || i[k] < 0 || i[k] > 1e12) errors[k] = 'Enter a non-negative amount up to $1 trillion'
  if (!Number.isInteger(i.termYears) || i.termYears < 1 || i.termYears > 15) errors.termYears = 'Enter a whole number from 1 to 15 years'
  for (const k of ['reviewPct', 'outgoingsIncreasePct'] as const) if (!Number.isFinite(i[k]) || i[k] < 0 || i[k] > 15) errors[k] = 'Enter a percentage from 0 to 15'
  if (!Number.isInteger(i.rentFreeMonths) || i.rentFreeMonths < 0 || i.rentFreeMonths > 36) errors.rentFreeMonths = 'Enter a whole number from 0 to 36 months'
  if (i.rentFreeMonths > i.termYears * 12) errors.rentFreeMonths = "Rent-free can't be longer than the lease"
  if (i.capRatePct !== null && (!Number.isFinite(i.capRatePct) || i.capRatePct < 1 || i.capRatePct > 20)) errors.capRatePct = 'Enter a cap rate from 1% to 20%'
  if (i.leaseType !== 'net' && i.leaseType !== 'gross') errors.leaseType = 'Choose a net or gross lease'
  return errors
}
export function calculateCommercialRent(i: CommercialRentInput) {
  const errors = validateCommercialRent(i)
  // A value-panel error does not hide a valid lease schedule.
  const leaseErrors = Object.fromEntries(Object.entries(errors).filter(([k]) => k !== 'capRatePct' && k !== 'ownerCostsAnnual'))
  if (Object.keys(leaseErrors).length) return { errors, result: null }
  let running = 0
  const rows: RentRow[] = Array.from({ length: i.termYears }, (_, n) => {
    const base = i.areaM2 * i.faceRentPsm * (1 + i.reviewPct / 100) ** n
    const outgoing = i.outgoingsAnnual * (1 + i.outgoingsIncreasePct / 100) ** n
    const free = Math.min(12, Math.max(0, i.rentFreeMonths - 12 * n))
    const rent_free = base * free / 12
    const outgoings_payable = i.leaseType === 'gross' ? 0 : outgoing * (i.outgoingsDuringRentFree ? 1 : (12 - free) / 12)
    const total_ex = base - rent_free + outgoings_payable
    const gst = total_ex * (i.showGst ? 0.1 : 0)
    const total_inc = total_ex + gst
    running += total_inc
    return { year: n + 1, base, rent_free, outgoings_payable, total_ex, gst, total_inc, cumulative_inc: running }
  })
  const sum = (key: keyof Omit<RentRow, 'year' | 'cumulative_inc'>) => rows.reduce((s, row) => s + row[key], 0)
  const total_base_gross = sum('base'), rent_free_value = sum('rent_free'), incentive_total = rent_free_value + i.fitoutContribution
  const year1_base = i.areaM2 * i.faceRentPsm
  const year1_occupancy_ex = year1_base + (i.leaseType === 'net' ? i.outgoingsAnnual : 0)
  const noi_year1 = year1_base - i.ownerCostsAnnual - (i.leaseType === 'gross' ? i.outgoingsAnnual : 0)
  const canValue = i.capRatePct !== null && !errors.capRatePct && !errors.ownerCostsAnnual && noi_year1 > 0
  const cap = i.capRatePct || 0
  const sens = canValue ? [-1, -0.5, 0, 0.5, 1].map(d => ({ rate: cap + d, value: noi_year1 / ((cap + d) / 100) })).filter(r => r.rate > 0) : []
  return { errors, result: { rows, year1_base, year1_base_monthly: year1_base / 12, year1_occupancy_ex, year1_occupancy_inc: year1_occupancy_ex * (i.showGst ? 1.1 : 1), total_base_gross, rent_free_value, fitout: i.fitoutContribution, incentive_total, incentive_pct: incentive_total / total_base_gross * 100, effective_rent_annual: (total_base_gross - incentive_total) / i.termYears, effective_rent_psm: (total_base_gross - incentive_total) / i.termYears / i.areaM2, total_occupancy_ex: sum('total_ex'), total_occupancy_inc: sum('total_inc'), noi_year1, value: canValue ? noi_year1 / (cap / 100) : null, sens, value_per_1000_rent: canValue ? 1000 / (cap / 100) : null } }
}
