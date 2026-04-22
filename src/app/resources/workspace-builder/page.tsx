'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'
import ToolGate from '@/components/ToolGate'

// ─── Pricing reference (ex GST, YOS Furniture 2026) ─────────────────────────
type Tier = 'basic' | 'mid' | 'premium'
interface Range { low: number; high: number }
type TieredRange = Record<Tier, Range>

const WS_PRICE: TieredRange    = { basic:{low:300,high:600},   mid:{low:600,high:1200},   premium:{low:1200,high:2500} }
const SS_PRICE: TieredRange    = { basic:{low:700,high:1100},  mid:{low:1100,high:1800},  premium:{low:1800,high:3500} }
const MEET_2P: Range           = { low:1500, high:4000 }
const MEET_4_6: Range          = { low:4000, high:12000 }
const MEET_BOARD: Range        = { low:12000, high:35000 }
const BOOTH_PRICE: Range       = { low:3500, high:8000 }
const RECEP_PRICE: TieredRange = { basic:{low:3000,high:6000}, mid:{low:6000,high:15000}, premium:{low:15000,high:35000} }
const BREAK_PRICE: TieredRange = { basic:{low:2500,high:5000}, mid:{low:5000,high:15000}, premium:{low:15000,high:40000} }
const LOUNGE_PRICE: TieredRange= { basic:{low:2500,high:5000}, mid:{low:5000,high:15000}, premium:{low:15000,high:40000} }
const STORAGE_PRICE: Range     = { low:150, high:500 }
const TASK_CHAIR: TieredRange  = { basic:{low:250,high:400},   mid:{low:400,high:550},    premium:{low:550,high:700} }
const EXEC_CHAIR: TieredRange  = { basic:{low:600,high:900},   mid:{low:900,high:1400},   premium:{low:1400,high:2000} }
const VISIT_CHAIR: TieredRange = { basic:{low:150,high:250},   mid:{low:250,high:350},    premium:{low:350,high:450} }

function getTier(budget: string): Tier {
  if (budget === 'Under $10k' || budget === '$10–30k') return 'basic'
  if (budget === '$150k+') return 'premium'
  return 'mid'
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface SpaceInput {
  floorArea: string
  floors: string
  buildingType: string
}

interface TeamInput {
  headcount: number
  alwaysIn: number
  hybrid: number
  flexi: number
  remote: number
  visitorsPerDay: string
}

interface SpacesInput {
  workstations: boolean
  workstationsQty: number
  sitStand: boolean
  sitStandQty: number
  meetingRooms: boolean
  meetingRoomsQty: number
  meetingRoomSize: string
  phoneBooths: boolean
  phoneBoothsQty: number
  reception: boolean
  breakout: boolean
  loungeZones: boolean
  loungeZonesQty: number
  storage: boolean
  trainingRoom: boolean
}

interface PrioritiesInput {
  roles: string[]
  topPriority: string
  budgetRange: string
}

interface LineItem {
  space: string
  items: string
  qty: number
  unitLow: number
  unitHigh: number
  totalLow: number
  totalHigh: number
}

interface SpecResult {
  lineItems: LineItem[]
  callouts: string[]
  totalLow: number
  totalHigh: number
  tier: Tier
  adjustedDeskCount: number
  originalDeskQty: number
  isHybridMajority: boolean
  hybridPercent: number
}

// ─── Calculation ─────────────────────────────────────────────────────────────
function calcSpec(
  _space: SpaceInput,
  team: TeamInput,
  spaces: SpacesInput,
  priorities: PrioritiesInput
): SpecResult {
  const tier = getTier(priorities.budgetRange)

  const rawRate = (team.alwaysIn * 1.0 + team.hybrid * 0.85 + team.flexi * 0.55 + team.remote * 0.25) / 100
  const effectiveRate = Math.max(0.7, isNaN(rawRate) ? 1.0 : rawRate)
  const adjustedDeskCount = Math.ceil(team.headcount * effectiveRate)
  const hybridPercent = team.hybrid + team.flexi + team.remote
  const isHybridMajority = hybridPercent >= 40

  const wsQtyRaw = spaces.workstations ? spaces.workstationsQty : 0
  const wsQty = spaces.workstations
    ? (isHybridMajority ? adjustedDeskCount : wsQtyRaw)
    : 0
  const ssQty = spaces.sitStand ? spaces.sitStandQty : 0
  const totalDesks = wsQty + ssQty

  const visitMid = team.visitorsPerDay === '5–15' ? 10 : team.visitorsPerDay === '15+' ? 20 : 3
  const visitorChairs = visitMid * 2

  const hasExecs = priorities.roles.includes('Executives')
  const execQty = hasExecs ? Math.max(1, Math.ceil(team.headcount * 0.1)) : 0

  const mrSize = spaces.meetingRoomSize
  const mrRange: Range =
    mrSize === '4-6-person' ? MEET_4_6 :
    mrSize === 'boardroom'  ? MEET_BOARD :
    MEET_2P
  const mrQty = spaces.meetingRooms ? spaces.meetingRoomsQty : 0
  const mrLabel =
    mrSize === '4-6-person' ? '4–6 person' :
    mrSize === 'boardroom'  ? 'Boardroom 8+' :
    '2-person'

  const lineItems: LineItem[] = []

  function addItem(space: string, items: string, qty: number, unitRange: Range) {
    if (qty <= 0) return
    lineItems.push({
      space, items, qty,
      unitLow: unitRange.low,
      unitHigh: unitRange.high,
      totalLow: unitRange.low * qty,
      totalHigh: unitRange.high * qty,
    })
  }

  if (spaces.workstations && wsQty > 0)
    addItem('Individual Workstations', 'Fixed-height desk, cable management', wsQty, WS_PRICE[tier])
  if (spaces.sitStand && ssQty > 0)
    addItem('Sit-Stand Desks', 'Height-adjustable desk', ssQty, SS_PRICE[tier])
  if (totalDesks > 0)
    addItem('Task Chairs', 'Ergonomic task chair', totalDesks, TASK_CHAIR[tier])
  if (hasExecs && execQty > 0)
    addItem('Executive Chairs', 'Premium executive chair', execQty, EXEC_CHAIR[tier])
  if (spaces.meetingRooms && mrQty > 0)
    addItem(`Meeting Rooms (${mrLabel})`, 'Table, chairs, AV integration, glass partitions', mrQty, mrRange)
  if (spaces.phoneBooths && spaces.phoneBoothsQty > 0)
    addItem('Phone Booths / Quiet Pods', 'Acoustic phone booth', spaces.phoneBoothsQty, BOOTH_PRICE)
  if (spaces.reception)
    addItem('Reception Area', 'Reception desk, visitor seating, feature elements', 1, RECEP_PRICE[tier])
  if (spaces.breakout)
    addItem('Breakout / Kitchen Zone', 'Lounge seating, cafe tables, casual furniture', 1, BREAK_PRICE[tier])
  if (spaces.loungeZones && spaces.loungeZonesQty > 0)
    addItem('Collaborative Lounge Zones', 'Soft seating, collaboration furniture', spaces.loungeZonesQty, LOUNGE_PRICE[tier])
  if (spaces.storage)
    addItem('Storage & Filing', 'Lockers, pedestals, shelving (per person)', team.headcount, STORAGE_PRICE)
  if (visitorChairs > 0)
    addItem('Visitor / Side Chairs', 'Visitor seating', visitorChairs, VISIT_CHAIR[tier])
  if (spaces.trainingRoom)
    addItem('Training / Multi-Purpose Room', 'Folding tables, stacking chairs, AV', 1, { low: 5000, high: 25000 })

  const totalLow  = lineItems.reduce((s, i) => s + i.totalLow, 0)
  const totalHigh = lineItems.reduce((s, i) => s + i.totalHigh, 0)

  const callouts: string[] = []

  if (isHybridMajority && spaces.workstations && wsQtyRaw > adjustedDeskCount) {
    const saving = (wsQtyRaw - adjustedDeskCount) * WS_PRICE[tier].low
    callouts.push(
      `Based on your work style mix (${hybridPercent}% hybrid/flexi/remote), you need ${adjustedDeskCount} desks not ${wsQtyRaw} — saving approx ${fmt(saving)}.`
    )
  }

  if (spaces.meetingRooms && mrQty > 0 && team.headcount > 0) {
    const recommended = Math.max(1, Math.ceil(team.headcount / 8))
    if (mrQty > recommended) {
      callouts.push(
        `You have ${mrQty} meeting room${mrQty > 1 ? 's' : ''} for ${team.headcount} staff. The recommended ratio is 1 per 8 staff (${recommended} room${recommended !== 1 ? 's' : ''} for your team).`
      )
    }
  }

  if (!spaces.sitStand && team.headcount > 10) {
    const recommended = Math.ceil(team.headcount * 0.2)
    callouts.push(
      `For a team of ${team.headcount}, we recommend at least ${recommended} sit-stand desks (20%). Better ergonomics, better output.`
    )
  }

  if (!spaces.breakout && team.headcount > 15) {
    callouts.push(
      `For ${team.headcount} people, a breakout / kitchen zone is almost essential. It reduces fatigue and builds team culture.`
    )
  }

  return {
    lineItems, callouts, totalLow, totalHigh,
    tier, adjustedDeskCount, originalDeskQty: wsQtyRaw,
    isHybridMajority, hybridPercent,
  }
}

// ─── Reusable UI primitives ──────────────────────────────────────────────────
function QtyInput({ value, onChange, min = 1, max = 200 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-0" style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem', overflow: 'hidden', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ padding: '0.5rem 0.875rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}
        className="hover:bg-white/10 transition-colors"
      >−</button>
      <span style={{ padding: '0.5rem 0.875rem', color: 'white', fontWeight: 700, fontSize: '0.95rem', minWidth: '2.5rem', textAlign: 'center' }}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ padding: '0.5rem 0.875rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}
        className="hover:bg-white/10 transition-colors"
      >+</button>
    </div>
  )
}

function NavButtons({ onNext, onBack, nextLabel = 'Next →', disabled = false }: {
  onNext: () => void; onBack: () => void; nextLabel?: string; disabled?: boolean
}) {
  return (
    <div className="flex items-center" style={{ gap: '1.5rem' }}>
      <button
        onClick={onNext}
        disabled={disabled}
        className={`font-bold transition-all uppercase tracking-[0.14em] min-h-[52px] ${disabled ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-teal text-white hover:bg-dark-teal'}`}
        style={{ padding: '1.1rem 3rem', fontSize: '0.72rem', borderRadius: '0.5rem', minWidth: '12rem' }}
      >
        {nextLabel}
      </button>
      <button
        onClick={onBack}
        className="text-white/30 hover:text-white/60 transition-colors"
        style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}
      >
        ← Back
      </button>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function WorkspaceBuilderPage() {
  const [step, setStep] = useState(0)

  const [spaceData, setSpaceData]       = useState<SpaceInput>({ floorArea: '', floors: '1', buildingType: '' })
  const [teamData, setTeamData]         = useState<TeamInput>({ headcount: 10, alwaysIn: 40, hybrid: 30, flexi: 20, remote: 10, visitorsPerDay: '' })
  const [spacesData, setSpacesData]     = useState<SpacesInput>({
    workstations: false,  workstationsQty: 10,
    sitStand: false,      sitStandQty: 2,
    meetingRooms: false,  meetingRoomsQty: 1, meetingRoomSize: '4-6-person',
    phoneBooths: false,   phoneBoothsQty: 1,
    reception: false,     breakout: false,
    loungeZones: false,   loungeZonesQty: 1,
    storage: false,       trainingRoom: false,
  })
  const [prioritiesData, setPrioritiesData] = useState<PrioritiesInput>({ roles: [], topPriority: '', budgetRange: '' })
  const [unlockedName, setUnlockedName]     = useState('')
  const [unlockedEmail, setUnlockedEmail]   = useState('')

  const workStyleTotal = teamData.alwaysIn + teamData.hybrid + teamData.flexi + teamData.remote

  function canProceed(): boolean {
    if (step === 0) return true
    if (step === 1) return !!spaceData.floorArea && !!spaceData.buildingType
    if (step === 2) return teamData.headcount > 0 && workStyleTotal === 100 && !!teamData.visitorsPerDay
    if (step === 3) return (
      spacesData.workstations || spacesData.sitStand || spacesData.meetingRooms ||
      spacesData.phoneBooths || spacesData.reception || spacesData.breakout ||
      spacesData.loungeZones || spacesData.storage || spacesData.trainingRoom
    )
    if (step === 4) return !!prioritiesData.topPriority && !!prioritiesData.budgetRange
    return true
  }

  const spec = step >= 5 ? calcSpec(spaceData, teamData, spacesData, prioritiesData) : null
  const progress = (step / 5) * 100

  const setSpace  = (k: keyof SpaceInput, v: string) => setSpaceData(p => ({ ...p, [k]: v }))
  const setTeam   = (k: keyof TeamInput, v: number | string) => setTeamData(p => ({ ...p, [k]: v }))
  const setSpaces = (k: keyof SpacesInput, v: boolean | number | string) => setSpacesData(p => ({ ...p, [k]: v }))
  const toggleRole = (role: string) => setPrioritiesData(p => ({
    ...p,
    roles: p.roles.includes(role) ? p.roles.filter(r => r !== role) : [...p.roles, role],
  }))
  const setPrio = (k: keyof PrioritiesInput, v: string) => setPrioritiesData(p => ({ ...p, [k]: v }))

  // Slider helper — clamp value and keep total ≤ 100 loosely
  function setSlider(key: keyof TeamInput, raw: number) {
    setTeam(key, Math.max(0, Math.min(100, raw)))
  }

  const stepTitles = [
    'Workspace Builder',
    'About your space',
    'Your team',
    'Spaces you need',
    'Work styles & priorities',
    'Your workspace specification',
  ]

  const stepSubtitles = [
    'Accurate furniture requirements. Not guesswork.',
    'Floor area, layout and building type',
    'Headcount, work patterns and visitors',
    'Every room and zone you need',
    'Roles, priorities and budget',
    'Your full specification',
  ]

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(5rem,12vw,9rem)' }}>

        {/* Progress bar */}
        {step > 0 && (
          <div className="fixed top-16 md:top-20 left-0 right-0 z-40 h-0.5 bg-white/10">
            <div className="h-full bg-teal transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="max-w-screen-xl mx-auto w-full"
          style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>

          {/* Step header */}
          <div style={{ marginBottom: '3.5rem' }}>
            {step > 0 && step < 5 && (
              <p className="text-white/30 font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '2rem' }}>
                Step <span className="text-teal font-semibold">{step}</span>
                <span className="text-white/20"> / </span>4
              </p>
            )}
            {step === 0 && (
              <div className="inline-flex items-center gap-2 border border-teal/30" style={{ padding: '0.4rem 1rem', marginBottom: '1.75rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
            )}
            <h1 className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)', marginBottom: '1.25rem' }}>
              {stepTitles[step] ?? 'Workspace Builder'}
            </h1>
            <p className="text-white/40 font-light" style={{ fontSize: '0.95rem', lineHeight: 1.85, maxWidth: '36rem' }}>
              {stepSubtitles[step] ?? ''}
            </p>
          </div>

          {/* ── STEP 0: INTRO ─────────────────────────────────────── */}
          {step === 0 && (
            <div className="max-w-2xl">
              <p className="text-white/60 font-light leading-relaxed" style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '3rem' }}>
                Most businesses buy what they think they need. This tool helps you figure out what you actually need — based on how your team works, how many people visit, and how your space will be used.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
                {[
                  { num: '01', label: '4 quick questions' },
                  { num: '02', label: 'Smart utilisation calc' },
                  { num: '03', label: 'Full spec with pricing' },
                ].map(f => (
                  <div key={f.label} className="border border-white/10 bg-white/[0.03]" style={{ padding: '1.75rem 1.5rem', borderRadius: '0.75rem' }}>
                    <p className="text-teal font-black" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '0.625rem' }}>{f.num}</p>
                    <p className="text-white/70 font-medium" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{f.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="bg-teal text-white font-bold hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}
              >
                Build my workspace →
              </button>
            </div>
          )}

          {/* ── STEP 1: ABOUT YOUR SPACE ───────────────────────────── */}
          {step === 1 && (
            <div className="max-w-2xl">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '3.5rem' }}>

                {/* Floor area */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Total floor area (sqm) <span className="text-teal">*</span>
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['Under 100', '100–200', '200–500', '500+'].map(opt => (
                      <button key={opt} onClick={() => setSpace('floorArea', opt)}
                        className={`font-medium border transition-colors ${spaceData.floorArea === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                        {opt} sqm
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floors */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Number of floors
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['1', '2', '3+'].map(opt => (
                      <button key={opt} onClick={() => setSpace('floors', opt)}
                        className={`font-bold border transition-colors w-16 ${spaceData.floors === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.85rem', fontSize: '1rem' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Building type */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Building type <span className="text-teal">*</span>
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['New fitout', 'Existing office refresh', 'Home office', 'Co-working', 'Education', 'Healthcare'].map(opt => (
                      <button key={opt} onClick={() => setSpace('buildingType', opt)}
                        className={`font-medium border transition-colors ${spaceData.buildingType === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              <NavButtons onNext={() => setStep(2)} onBack={() => setStep(0)} disabled={!canProceed()} />
            </div>
          )}

          {/* ── STEP 2: YOUR TEAM ──────────────────────────────────── */}
          {step === 2 && (
            <div className="max-w-2xl">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '3.5rem' }}>

                {/* Headcount */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Total headcount <span className="text-teal">*</span>
                  </label>
                  <input
                    type="number" min="1" max="200" placeholder="e.g. 20"
                    value={teamData.headcount || ''}
                    onChange={e => setTeam('headcount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/25 transition-colors"
                    style={{ padding: '1rem 1.25rem', fontSize: '1.15rem', borderRadius: '0.5rem', display: 'block', marginBottom: '0.75rem', width: '12rem' }}
                  />
                  <p className="text-white/30" style={{ fontSize: '0.78rem' }}>Full-time equivalents using the space</p>
                </div>

                {/* Work style sliders */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <label className="text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Work style breakdown
                    </label>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: 700,
                      color: workStyleTotal === 100 ? '#00B5A5' : '#ef4444',
                      letterSpacing: '0.05em',
                    }}>
                      Total: {workStyleTotal}%{workStyleTotal !== 100 ? ' ← must equal 100' : ' ✓'}
                    </span>
                  </div>

                  {[
                    { key: 'alwaysIn' as const, label: 'Always in office', desc: '5 days/wk', color: '#00B5A5' },
                    { key: 'hybrid'   as const, label: 'Hybrid',           desc: '3+ days/wk', color: '#4DC3BA' },
                    { key: 'flexi'    as const, label: 'Flexi',            desc: '1–2 days/wk', color: '#80D4CD' },
                    { key: 'remote'   as const, label: 'Remote',           desc: 'Occasionally in', color: '#B3E6E3' },
                  ].map(s => (
                    <div key={s.key} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div>
                          <span className="text-white/80 font-medium" style={{ fontSize: '0.875rem' }}>{s.label}</span>
                          <span className="text-white/35 font-light" style={{ fontSize: '0.78rem', marginLeft: '0.5rem' }}>{s.desc}</span>
                        </div>
                        <span style={{ color: s.color, fontWeight: 700, fontSize: '0.9rem', minWidth: '3rem', textAlign: 'right' }}>
                          {teamData[s.key]}%
                        </span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={teamData[s.key]}
                        onChange={e => setSlider(s.key, parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: s.color, cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                  {workStyleTotal !== 100 && (
                    <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '-0.5rem' }}>
                      Adjust the sliders until the total equals 100%.
                    </p>
                  )}
                </div>

                {/* Visitors */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Average visitors per day <span className="text-teal">*</span>
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['0–5', '5–15', '15+'].map(opt => (
                      <button key={opt} onClick={() => setTeam('visitorsPerDay', opt)}
                        className={`font-medium border transition-colors ${teamData.visitorsPerDay === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              <NavButtons onNext={() => setStep(3)} onBack={() => setStep(1)} disabled={!canProceed()} />
            </div>
          )}

          {/* ── STEP 3: SPACES YOU NEED ────────────────────────────── */}
          {step === 3 && (
            <div className="max-w-2xl">
              <p className="text-white/40 font-light" style={{ fontSize: '0.85rem', marginBottom: '2rem' }}>
                Select everything that applies — tick at least one.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3.5rem' }}>

                {/* Workstations */}
                <SpaceRow
                  checked={spacesData.workstations}
                  onToggle={() => setSpaces('workstations', !spacesData.workstations)}
                  label="Individual Workstations"
                  desc="Fixed-height desks"
                >
                  {spacesData.workstations && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingLeft: '2.5rem' }}>
                      <span className="text-white/50" style={{ fontSize: '0.78rem' }}>Qty:</span>
                      <QtyInput value={spacesData.workstationsQty} onChange={v => setSpaces('workstationsQty', v)} max={200} />
                    </div>
                  )}
                </SpaceRow>

                {/* Sit-stand */}
                <SpaceRow
                  checked={spacesData.sitStand}
                  onToggle={() => setSpaces('sitStand', !spacesData.sitStand)}
                  label="Sit-Stand / Height-Adjustable Desks"
                  desc="Motorised height-adjustable"
                >
                  {spacesData.sitStand && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingLeft: '2.5rem' }}>
                      <span className="text-white/50" style={{ fontSize: '0.78rem' }}>Qty:</span>
                      <QtyInput value={spacesData.sitStandQty} onChange={v => setSpaces('sitStandQty', v)} max={200} />
                    </div>
                  )}
                </SpaceRow>

                {/* Meeting rooms */}
                <SpaceRow
                  checked={spacesData.meetingRooms}
                  onToggle={() => setSpaces('meetingRooms', !spacesData.meetingRooms)}
                  label="Meeting Rooms"
                  desc="Formal meeting spaces"
                >
                  {spacesData.meetingRooms && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', paddingLeft: '2.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="text-white/50" style={{ fontSize: '0.78rem' }}>Qty:</span>
                        <QtyInput value={spacesData.meetingRoomsQty} onChange={v => setSpaces('meetingRoomsQty', v)} max={20} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[
                          { val: '2-person', label: '2-person' },
                          { val: '4-6-person', label: '4–6 person' },
                          { val: 'boardroom', label: 'Boardroom 8+' },
                        ].map(sz => (
                          <button key={sz.val} onClick={() => setSpaces('meetingRoomSize', sz.val)}
                            className={`font-medium border transition-colors ${spacesData.meetingRoomSize === sz.val ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/25 hover:text-white'}`}
                            style={{ padding: '0.4rem 0.875rem', fontSize: '0.78rem', borderRadius: '0.4rem' }}>
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </SpaceRow>

                {/* Phone booths */}
                <SpaceRow
                  checked={spacesData.phoneBooths}
                  onToggle={() => setSpaces('phoneBooths', !spacesData.phoneBooths)}
                  label="Phone Booths / Quiet Pods"
                  desc="Acoustic private pods"
                >
                  {spacesData.phoneBooths && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingLeft: '2.5rem' }}>
                      <span className="text-white/50" style={{ fontSize: '0.78rem' }}>Qty:</span>
                      <QtyInput value={spacesData.phoneBoothsQty} onChange={v => setSpaces('phoneBoothsQty', v)} max={20} />
                    </div>
                  )}
                </SpaceRow>

                {/* Toggles */}
                <SpaceRow checked={spacesData.reception} onToggle={() => setSpaces('reception', !spacesData.reception)} label="Reception Area" desc="Entry desk, visitor seating" />
                <SpaceRow checked={spacesData.breakout}  onToggle={() => setSpaces('breakout', !spacesData.breakout)}   label="Breakout / Kitchen Area" desc="Kitchen, casual seating, cafe tables" />

                {/* Lounge zones */}
                <SpaceRow
                  checked={spacesData.loungeZones}
                  onToggle={() => setSpaces('loungeZones', !spacesData.loungeZones)}
                  label="Collaborative Lounge Zones"
                  desc="Soft seating, casual collaboration"
                >
                  {spacesData.loungeZones && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingLeft: '2.5rem' }}>
                      <span className="text-white/50" style={{ fontSize: '0.78rem' }}>Qty:</span>
                      <QtyInput value={spacesData.loungeZonesQty} onChange={v => setSpaces('loungeZonesQty', v)} max={10} />
                    </div>
                  )}
                </SpaceRow>

                <SpaceRow checked={spacesData.storage}      onToggle={() => setSpaces('storage', !spacesData.storage)}           label="Storage & Filing" desc="Lockers, pedestals, shelving" />
                <SpaceRow checked={spacesData.trainingRoom} onToggle={() => setSpaces('trainingRoom', !spacesData.trainingRoom)} label="Training / Multi-Purpose Room" desc="Flexible, multi-use space" />

              </div>
              <NavButtons onNext={() => setStep(4)} onBack={() => setStep(2)} disabled={!canProceed()} />
            </div>
          )}

          {/* ── STEP 4: PRIORITIES ─────────────────────────────────── */}
          {step === 4 && (
            <div className="max-w-2xl">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '3.5rem' }}>

                {/* Roles */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Role types in your team (select all that apply)
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['Executives', 'Sales', 'Creative', 'Admin', 'Technical', 'Customer-facing', 'Healthcare', 'Education'].map(role => (
                      <button key={role} onClick={() => toggleRole(role)}
                        className={`font-medium border transition-colors ${prioritiesData.roles.includes(role) ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                        {prioritiesData.roles.includes(role) ? '✓ ' : ''}{role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top priority */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Top priority <span className="text-teal">*</span>
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['Budget', 'Speed', 'Quality', 'Flexibility', 'Ergonomics', 'Aesthetics'].map(opt => (
                      <button key={opt} onClick={() => setPrio('topPriority', opt)}
                        className={`font-medium border transition-colors ${prioritiesData.topPriority === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget range */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    Budget range (furniture only, ex GST) <span className="text-teal">*</span>
                  </label>
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {['Under $10k', '$10–30k', '$30–75k', '$75–150k', '$150k+'].map(opt => (
                      <button key={opt} onClick={() => setPrio('budgetRange', opt)}
                        className={`font-medium border transition-colors ${prioritiesData.budgetRange === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              <NavButtons
                onNext={() => setStep(5)}
                onBack={() => setStep(3)}
                disabled={!canProceed()}
                nextLabel="Build my spec →"
              />
            </div>
          )}

          {/* ── STEP 5: RESULTS (GATED) ────────────────────────────── */}
          {step === 5 && spec && (
            <div className="max-w-3xl">
              <ToolGate
                tool="Workspace Builder"
                context={() =>
                  `Headcount: ${teamData.headcount} | Building: ${spaceData.buildingType} | Budget: ${prioritiesData.budgetRange} | Est: ${fmt(spec.totalLow)}–${fmt(spec.totalHigh)}`
                }
                heading="Where should we send your specification?"
                subheading="Enter your details — we'll email you a full workspace spec instantly."
                onUnlock={(name, email) => {
                  setUnlockedName(name)
                  setUnlockedEmail(email)
                  const ctx = `Building: ${spaceData.buildingType} | Headcount: ${teamData.headcount} | Budget: ${prioritiesData.budgetRange} | Est: ${fmt(spec.totalLow)}–${fmt(spec.totalHigh)} | Priority: ${prioritiesData.topPriority} | Roles: ${prioritiesData.roles.join(', ')}`
                  fetch('/api/hubspot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      firstname: name,
                      email,
                      source: 'Workspace Builder',
                      context: `Workspace Builder — ${ctx}`,
                    }),
                  }).catch(() => {})
                  // Notify Joe via email
                  fetch('/api/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name,
                      email,
                      source: 'Workspace Builder',
                      context: ctx,
                    }),
                  }).catch(() => {})
                }}
                teaser={
                  <div>
                    <div style={{ marginBottom: '2rem' }}>
                      <p className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>
                        {teamData.headcount} staff · {spaceData.buildingType}
                      </p>
                      <h2 className="text-white font-black uppercase leading-none tracking-tight"
                        style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '0.75rem' }}>
                        {fmt(spec.totalLow)} – {fmt(spec.totalHigh)}
                      </h2>
                      <p className="text-white/40 font-light" style={{ fontSize: '0.85rem' }}>
                        Estimated investment range · All figures ex GST
                      </p>
                    </div>
                    <div className="border border-white/10" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                      <div className="border-b border-white/10" style={{ padding: '0.875rem 1.5rem' }}>
                        <p className="text-white/40 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>
                          Full specification — unlock to view
                        </p>
                      </div>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex justify-between items-center border-b border-white/6" style={{ padding: '1rem 1.5rem' }}>
                          <span style={{ width: '40%', height: '0.75rem', background: 'rgba(255,255,255,0.08)', borderRadius: '0.5rem', display: 'block' }} />
                          <span style={{ width: '20%', height: '0.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.5rem', display: 'block' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                {/* ── RESULTS CONTENT ── */}
                <ResultsContent
                  spec={spec}
                  spaceData={spaceData}
                  teamData={teamData}
                  prioritiesData={prioritiesData}
                  onReset={() => {
                    setStep(0)
                    setSpaceData({ floorArea: '', floors: '1', buildingType: '' })
                    setTeamData({ headcount: 10, alwaysIn: 40, hybrid: 30, flexi: 20, remote: 10, visitorsPerDay: '' })
                    setSpacesData({
                      workstations: false, workstationsQty: 10,
                      sitStand: false, sitStandQty: 2,
                      meetingRooms: false, meetingRoomsQty: 1, meetingRoomSize: '4-6-person',
                      phoneBooths: false, phoneBoothsQty: 1,
                      reception: false, breakout: false,
                      loungeZones: false, loungeZonesQty: 1,
                      storage: false, trainingRoom: false,
                    })
                    setPrioritiesData({ roles: [], topPriority: '', budgetRange: '' })
                  }}
                />
              </ToolGate>
            </div>
          )}

        </div>
      </div>

      <Footer />

      {/* Print styles */}
      <style>{`
        @media print {
          nav, footer, button, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-table { color: black !important; }
          @page { margin: 2cm; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

// ─── SpaceRow component ──────────────────────────────────────────────────────
function SpaceRow({
  checked, onToggle, label, desc, children,
}: {
  checked: boolean
  onToggle: () => void
  label: string
  desc: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={`border transition-all ${checked ? 'border-teal bg-teal/[0.06]' : 'border-white/12 bg-white/[0.02] hover:border-white/20'}`}
      style={{ borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}
    >
      <button type="button" onClick={onToggle} className="w-full text-left flex items-center" style={{ gap: '1rem' }}>
        <span className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all ${checked ? 'border-teal bg-teal' : 'border-white/30'}`}
          style={{ borderRadius: '0.25rem' }}>
          {checked && <span className="text-white font-black" style={{ fontSize: '0.7rem', lineHeight: 1 }}>✓</span>}
        </span>
        <div>
          <p className="text-white font-semibold" style={{ fontSize: '0.95rem' }}>{label}</p>
          <p className="text-white/40 font-light" style={{ fontSize: '0.78rem' }}>{desc}</p>
        </div>
      </button>
      {children}
    </div>
  )
}

// ─── ResultsContent component ────────────────────────────────────────────────
function ResultsContent({
  spec, spaceData, teamData, prioritiesData, onReset,
}: {
  spec: SpecResult
  spaceData: SpaceInput
  teamData: TeamInput
  prioritiesData: PrioritiesInput
  onReset: () => void
}) {
  const tierLabels: Record<Tier, string> = { basic: 'Entry-level', mid: 'Mid-range', premium: 'Premium' }

  return (
    <div>
      {/* Summary header */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>
          {teamData.headcount} staff · {spaceData.buildingType} · {tierLabels[spec.tier]} spec
        </p>
        <h2 className="text-white font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.25rem,5vw,4rem)', marginBottom: '1rem' }}>
          {fmt(spec.totalLow)} – {fmt(spec.totalHigh)}
        </h2>
        <p className="text-white/40 font-light" style={{ fontSize: '0.875rem' }}>
          Estimated investment range &nbsp;·&nbsp; All figures ex GST &nbsp;·&nbsp; April 2026
        </p>
      </div>

      {/* Smart callouts */}
      {spec.callouts.length > 0 && (
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {spec.callouts.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(0,181,165,0.08)',
              border: '1px solid rgba(0,181,165,0.25)',
              borderLeft: '3px solid #00B5A5',
              borderRadius: '0.5rem',
              padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            }}>
              <span style={{ color: '#00B5A5', fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem' }}>💡</span>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.65, fontWeight: 400 }}>{c}</p>
            </div>
          ))}
        </div>
      )}

      {/* Spec table */}
      <div style={{ marginBottom: '3rem' }}>
        <p className="text-white/40 font-semibold uppercase tracking-widest" style={{ fontSize: '0.65rem', marginBottom: '1.25rem' }}>
          Your workspace specification
        </p>

        {/* Desktop table */}
        <div className="hidden sm:block border border-white/10" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
          {/* Header */}
          <div className="grid" style={{
            gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1.5fr',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '0.875rem 1.5rem',
          }}>
            {['Space', 'Recommended Items', 'Qty', 'Est. Unit Cost', 'Est. Total'].map(h => (
              <span key={h} className="text-white/40 font-semibold uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>{h}</span>
            ))}
          </div>

          {spec.lineItems.map((item, i) => (
            <div key={i} className="grid" style={{
              gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1.5fr',
              padding: '1rem 1.5rem',
              borderBottom: i < spec.lineItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              alignItems: 'center',
            }}>
              <span className="text-white font-medium" style={{ fontSize: '0.875rem' }}>{item.space}</span>
              <span className="text-white/50 font-light" style={{ fontSize: '0.8rem', lineHeight: 1.4, paddingRight: '1rem' }}>{item.items}</span>
              <span className="text-white font-bold" style={{ fontSize: '0.95rem' }}>{item.qty}</span>
              <span className="text-white/60 font-light" style={{ fontSize: '0.8rem' }}>{fmt(item.unitLow)}–{fmt(item.unitHigh)}</span>
              <span className="text-white font-semibold" style={{ fontSize: '0.875rem' }}>{fmt(item.totalLow)}–{fmt(item.totalHigh)}</span>
            </div>
          ))}

          {/* Total row */}
          <div className="grid" style={{
            gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1.5fr',
            padding: '1.25rem 1.5rem',
            background: 'rgba(0,181,165,0.1)',
            borderTop: '1px solid rgba(0,181,165,0.3)',
            alignItems: 'center',
          }}>
            <span className="text-white font-black uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Total</span>
            <span />
            <span />
            <span />
            <span className="text-teal font-black" style={{ fontSize: '1rem' }}>{fmt(spec.totalLow)}–{fmt(spec.totalHigh)}</span>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {spec.lineItems.map((item, i) => (
            <div key={i} className="border border-white/10 bg-white/[0.02]" style={{ borderRadius: '0.625rem', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="text-white font-semibold" style={{ fontSize: '0.875rem' }}>{item.space}</span>
                <span className="text-white font-bold" style={{ fontSize: '0.875rem' }}>×{item.qty}</span>
              </div>
              <p className="text-white/40 font-light" style={{ fontSize: '0.78rem', marginBottom: '0.75rem' }}>{item.items}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-white/50" style={{ fontSize: '0.78rem' }}>Unit: {fmt(item.unitLow)}–{fmt(item.unitHigh)}</span>
                <span className="text-teal font-semibold" style={{ fontSize: '0.875rem' }}>{fmt(item.totalLow)}–{fmt(item.totalHigh)}</span>
              </div>
            </div>
          ))}
          <div className="bg-teal/10 border border-teal/30" style={{ borderRadius: '0.625rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-white font-black uppercase" style={{ fontSize: '0.85rem' }}>Total estimate</span>
            <span className="text-teal font-black" style={{ fontSize: '1rem' }}>{fmt(spec.totalLow)}–{fmt(spec.totalHigh)}</span>
          </div>
        </div>
      </div>

      {/* Spec summary */}
      <div className="border border-white/10 bg-white/[0.02]" style={{ borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '3rem' }}>
        <p className="text-white/40 font-semibold uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>Spec summary</p>
        <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: '1rem' }}>
          {[
            { label: 'Building type', value: spaceData.buildingType },
            { label: 'Floor area', value: spaceData.floorArea + ' sqm' },
            { label: 'Headcount', value: teamData.headcount.toString() },
            { label: 'Spec tier', value: tierLabels[spec.tier] },
            { label: 'Budget range', value: prioritiesData.budgetRange },
            { label: 'Top priority', value: prioritiesData.topPriority },
          ].map(row => (
            <div key={row.label}>
              <p className="text-white/35 font-light" style={{ fontSize: '0.72rem', marginBottom: '0.25rem' }}>{row.label}</p>
              <p className="text-white/80 font-semibold" style={{ fontSize: '0.85rem' }}>{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-white/25 font-light leading-relaxed" style={{ fontSize: '0.82rem', lineHeight: 1.85, marginBottom: '3rem' }}>
        This specification is based on current market pricing from the YOS Furniture & Fitout cost guide (April 2026). Ranges reflect Newcastle and Hunter Region benchmarks. Actual costs vary with supplier selection, site conditions, and lead times. A site visit and detailed brief will refine this estimate significantly.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem', marginBottom: '2rem' }}>
        <Link href="/contact"
          className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] text-center"
          style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
          Get a full quote from YOS →
        </Link>
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="border border-white/20 text-white/70 font-medium hover:bg-white/8 hover:text-white transition-colors uppercase tracking-[0.14em] min-h-[52px]"
          style={{ padding: '1.1rem 2rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}
        >
          Print / Download
        </button>
        <Link href="/furniture"
          className="text-white/40 font-light no-underline hover:text-white/70 transition-colors text-center"
          style={{ padding: '0.75rem', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
          View Furniture & Fitout Services
        </Link>
      </div>

      <button
        onClick={onReset}
        className="text-white/25 hover:text-white/50 transition-colors font-light"
        style={{ fontSize: '0.82rem' }}
      >
        ← Start again
      </button>
    </div>
  )
}
