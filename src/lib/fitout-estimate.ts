export type FitoutTier = 'basic' | 'mid' | 'premium'
export type FitoutTypeKey = 'furniture-only' | 'turnkey-warm' | 'turnkey-cold'
export type RateBand = { low: number; high: number }

export interface FitoutRate {
  label: string
  color: string
  sqm?: RateBand
  desk: RateBand
  meetingRoom: RateBand
  kitchen?: RateBand
  reception?: RateBand
  av?: RateBand
  contingency: number
}

export interface FitoutInputs {
  fitoutType: 'furniture-only' | 'turnkey' | ''
  sqm: string
  shellCondition: 'cold' | 'warm' | ''
  tier: FitoutTier | ''
  workstationType: 'fixed' | 'eha' | ''
  desks: string
  meetingRooms: string
  hasKitchen: boolean
  hasReception: boolean
  hasAV: boolean
  buildingType: string
  timeframe: string
}

export const FITOUT_RATES: Record<FitoutTypeKey, Record<FitoutTier, FitoutRate>> = {
  'furniture-only': {
    basic: { label: 'Basic', color: '#9B9B9B', desk: { low: 550, high: 715 }, meetingRoom: { low: 2000, high: 3000 }, contingency: 0.10 },
    mid: { label: 'Mid-Range', color: '#00B5A5', desk: { low: 1050, high: 1365 }, meetingRoom: { low: 2000, high: 3000 }, contingency: 0.10 },
    premium: { label: 'Premium', color: '#1A1A1A', desk: { low: 2500, high: 3250 }, meetingRoom: { low: 2000, high: 3000 }, contingency: 0.15 },
  },
  'turnkey-warm': {
    basic: { label: 'Basic', color: '#9B9B9B', sqm: { low: 600, high: 780 }, desk: { low: 550, high: 715 }, meetingRoom: { low: 8000, high: 10400 }, kitchen: { low: 5000, high: 6500 }, reception: { low: 6000, high: 7800 }, av: { low: 2500, high: 3250 }, contingency: 0.10 },
    mid: { label: 'Mid-Range', color: '#00B5A5', sqm: { low: 900, high: 1170 }, desk: { low: 1050, high: 1365 }, meetingRoom: { low: 18000, high: 23400 }, kitchen: { low: 15000, high: 19500 }, reception: { low: 20000, high: 26000 }, av: { low: 8000, high: 10400 }, contingency: 0.10 },
    premium: { label: 'Premium', color: '#1A1A1A', sqm: { low: 1200, high: 1560 }, desk: { low: 2500, high: 3250 }, meetingRoom: { low: 40000, high: 52000 }, kitchen: { low: 35000, high: 45500 }, reception: { low: 50000, high: 65000 }, av: { low: 25000, high: 32500 }, contingency: 0.15 },
  },
  'turnkey-cold': {
    basic: { label: 'Basic', color: '#9B9B9B', sqm: { low: 800, high: 1040 }, desk: { low: 550, high: 715 }, meetingRoom: { low: 8000, high: 10400 }, kitchen: { low: 5000, high: 6500 }, reception: { low: 6000, high: 7800 }, av: { low: 2500, high: 3250 }, contingency: 0.10 },
    mid: { label: 'Mid-Range', color: '#00B5A5', sqm: { low: 1000, high: 1300 }, desk: { low: 1050, high: 1365 }, meetingRoom: { low: 18000, high: 23400 }, kitchen: { low: 15000, high: 19500 }, reception: { low: 20000, high: 26000 }, av: { low: 8000, high: 10400 }, contingency: 0.10 },
    premium: { label: 'Premium', color: '#1A1A1A', sqm: { low: 1400, high: 1820 }, desk: { low: 2500, high: 3250 }, meetingRoom: { low: 40000, high: 52000 }, kitchen: { low: 35000, high: 45500 }, reception: { low: 50000, high: 65000 }, av: { low: 25000, high: 32500 }, contingency: 0.15 },
  },
}

export function calculateFitoutEstimate(inputs: FitoutInputs) {
  if (!inputs.sqm || !inputs.tier || !inputs.fitoutType || !inputs.workstationType) return null

  const isFurniture = inputs.fitoutType === 'furniture-only'
  const rateKey: FitoutTypeKey = isFurniture
    ? 'furniture-only'
    : inputs.shellCondition === 'cold'
      ? 'turnkey-cold'
      : 'turnkey-warm'
  const rate = FITOUT_RATES[rateKey][inputs.tier]
  const sqm = Number(inputs.sqm)
  const desks = Number(inputs.desks)
  const meetings = Number(inputs.meetingRooms)

  if (!Number.isFinite(sqm) || sqm <= 0 || !Number.isInteger(desks) || desks <= 0 || !Number.isInteger(meetings) || meetings < 0) {
    return null
  }

  const ehaMultiplier = inputs.workstationType === 'eha' ? 1.25 : 1
  const base = isFurniture
    ? { low: 0, high: 0 }
    : { low: Math.round(sqm * (rate.sqm?.low ?? 0)), high: Math.round(sqm * (rate.sqm?.high ?? 0)) }
  const deskRate = {
    low: Math.round(desks * rate.desk.low * ehaMultiplier),
    high: Math.round(desks * rate.desk.high * ehaMultiplier),
  }
  const meetingCost = isFurniture
    ? { low: 0, high: 0 }
    : { low: meetings * rate.meetingRoom.low, high: meetings * rate.meetingRoom.high }
  const kitchenCost = !isFurniture && inputs.hasKitchen && rate.kitchen
    ? { low: rate.kitchen.low, high: rate.kitchen.high }
    : { low: 0, high: 0 }
  const receptionCost = !isFurniture && inputs.hasReception && rate.reception
    ? { low: rate.reception.low, high: rate.reception.high }
    : { low: 0, high: 0 }
  const avCost = !isFurniture && inputs.hasAV && rate.av
    ? { low: rate.av.low, high: rate.av.high }
    : { low: 0, high: 0 }
  const furnitureWorkstations = { low: Math.round(deskRate.low * 0.45), high: Math.round(deskRate.high * 0.45) }
  const furnitureSeating = { low: Math.round(deskRate.low * 0.35), high: Math.round(deskRate.high * 0.35) }
  const furnitureAccessories = {
    low: deskRate.low - furnitureWorkstations.low - furnitureSeating.low,
    high: deskRate.high - furnitureWorkstations.high - furnitureSeating.high,
  }
  const deliveryCost = { low: Math.round(deskRate.low * 0.05), high: Math.round(deskRate.high * 0.05) }
  const subtotalLow = base.low + deskRate.low + deliveryCost.low + meetingCost.low + kitchenCost.low + receptionCost.low + avCost.low
  const subtotalHigh = base.high + deskRate.high + deliveryCost.high + meetingCost.high + kitchenCost.high + receptionCost.high + avCost.high
  const totalLow = Math.round(subtotalLow * (1 + rate.contingency))
  const totalHigh = Math.round(subtotalHigh * (1 + rate.contingency))
  const contingencyCost = { low: totalLow - subtotalLow, high: totalHigh - subtotalHigh }
  const constructionLabel = isFurniture
    ? null
    : rateKey === 'turnkey-cold'
      ? 'Construction fitout (cold shell)'
      : 'Construction fitout (warm shell)'

  return {
    breakdown: [
      ...(constructionLabel ? [{ label: constructionLabel, low: base.low, high: base.high }] : []),
      ...(isFurniture
        ? [
            { label: 'Workstations', low: furnitureWorkstations.low, high: furnitureWorkstations.high },
            { label: 'Seating', low: furnitureSeating.low, high: furnitureSeating.high },
            { label: 'Accessories', low: furnitureAccessories.low, high: furnitureAccessories.high },
          ]
        : [{ label: 'Workstations & seating', low: deskRate.low, high: deskRate.high }]),
      { label: 'Delivery & install', low: deliveryCost.low, high: deliveryCost.high },
      ...(!isFurniture ? [{ label: 'Meeting rooms', low: meetingCost.low, high: meetingCost.high }] : []),
      ...(kitchenCost.low > 0 ? [{ label: 'Kitchen / breakout', low: kitchenCost.low, high: kitchenCost.high }] : []),
      ...(receptionCost.low > 0 ? [{ label: 'Reception area', low: receptionCost.low, high: receptionCost.high }] : []),
      ...(avCost.low > 0 ? [{ label: 'AV & technology', low: avCost.low, high: avCost.high }] : []),
      { label: `Contingency (${Math.round(rate.contingency * 100)}%)`, low: contingencyCost.low, high: contingencyCost.high },
    ].filter((band) => band.low > 0 || band.high > 0),
    totalLow,
    totalHigh,
    perSqm: { low: Math.round(totalLow / sqm), high: Math.round(totalHigh / sqm) },
    coverageNote: isFurniture
      ? 'Price is for supply and installation of furniture items listed. Excludes construction, electrical, and joinery.'
      : rateKey === 'turnkey-cold'
        ? 'Cold shell condition assumed. Base build services and ceiling works are included.'
        : 'Warm shell condition assumed. Base build services already in place.',
    joineryNote: isFurniture
      ? 'If your fitout includes built-in joinery or custom storage (reception desks, kitchenettes, bookshelves), budget an additional 25-35% on top of this estimate. Speak to us for a joinery quote alongside your furniture package.'
      : null,
  }
}
