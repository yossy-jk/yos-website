'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import ToolGate from '@/components/ToolGate'
import { HUBSPOT } from '@/lib/constants'

const SEC = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

type WorkStyle = 'traditional' | 'hybrid' | 'agile'
type PrivateOffices = '0' | '1-2' | '3-5' | '6+'
type MeetingRooms = '0' | '1' | '2' | '3' | '4+'

const OFFICE_MIDPOINTS: Record<PrivateOffices, number> = {
  '0': 0,
  '1-2': 1.5,
  '3-5': 4,
  '6+': 7,
}

const ROOM_COUNTS: Record<MeetingRooms, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4+': 4,
}

function roundToNearest10(n: number) {
  return Math.round(n / 10) * 10
}

function fmtAUD(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

interface CalcResult {
  sqm: number
  sqmLow: number
  sqmHigh: number
  sqmPerSeat: number
  monthlyRent: number
  workStyle: WorkStyle
  staff: number
}

function calcOfficeSize(staff: number, workStyle: WorkStyle, privateOffices: PrivateOffices, meetingRooms: MeetingRooms): CalcResult {
  const multiplier = workStyle === 'traditional' ? 1 : workStyle === 'hybrid' ? 0.7 : 0.5
  const baseDeskSpace = staff * multiplier * 12
  const privateOfficeAdd = OFFICE_MIDPOINTS[privateOffices] * 16
  const meetingRoomAdd = ROOM_COUNTS[meetingRooms] * 20
  const subtotal = baseDeskSpace + privateOfficeAdd + meetingRoomAdd
  const total = roundToNearest10(subtotal * 1.25)

  return {
    sqm: total,
    sqmLow: roundToNearest10(total * 0.9),
    sqmHigh: roundToNearest10(total * 1.1),
    sqmPerSeat: parseFloat((total / staff).toFixed(1)),
    monthlyRent: Math.round((total * 35) / 12),
    workStyle,
    staff,
  }
}

const WORK_STYLE_RECOMMENDATIONS: Record<WorkStyle, string[]> = {
  traditional: [
    'Allocate dedicated desks for every team member — hot-desking won\'t suit your culture.',
    'Plan for a staff kitchen and breakout area; with everyone in daily, shared spaces take more load.',
    'Consider natural light and acoustic zoning — density matters when everyone is present all week.',
  ],
  hybrid: [
    'A desk-sharing ratio of 0.7:1 works well — not everyone is in on the same day.',
    'Invest in strong AV for meeting rooms; hybrid teams need reliable video conferencing.',
    'Book-a-desk software pays for itself quickly once you\'re above 20 staff.',
  ],
  agile: [
    'Focus your budget on collaboration zones and quiet focus pods rather than assigned desks.',
    'A central hub design — open collaboration in the middle, quiet focus at the edges — suits agile teams best.',
    'Review utilisation data every 6 months; agile workplaces often discover they can downsize further over time.',
  ],
}

export default function OfficeSizeCalculatorPage() {
  const [staff, setStaff] = useState('')
  const [workStyle, setWorkStyle] = useState<WorkStyle | ''>('')
  const [privateOffices, setPrivateOffices] = useState<PrivateOffices | ''>('')
  const [meetingRooms, setMeetingRooms] = useState<MeetingRooms | ''>('')
  const [result, setResult] = useState<CalcResult | null>(null)

  const staffNum = parseInt(staff, 10)
  const canCalc = staffNum > 0 && !!workStyle && !!privateOffices && !!meetingRooms

  function handleCalc() {
    if (!canCalc) return
    setResult(calcOfficeSize(staffNum, workStyle as WorkStyle, privateOffices as PrivateOffices, meetingRooms as MeetingRooms))
  }

  function handleReset() {
    setResult(null)
    setStaff('')
    setWorkStyle('')
    setPrivateOffices('')
    setMeetingRooms('')
  }

  const WORK_STYLES: { value: WorkStyle; label: string }[] = [
    { value: 'traditional', label: 'Traditional (all in daily)' },
    { value: 'hybrid', label: 'Hybrid (50–70% in)' },
    { value: 'agile', label: 'Agile (30–50% in)' },
  ]

  const PRIVATE_OFFICE_OPTIONS: PrivateOffices[] = ['0', '1-2', '3-5', '6+']
  const MEETING_ROOM_OPTIONS: MeetingRooms[] = ['0', '1', '2', '3', '4+']

  const teaserContent = result && (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-teal/10 border border-teal/30" style={{ padding: '1.5rem 1.25rem' }}>
        <p className="text-teal/70 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Recommended Space</p>
        <p className="text-teal font-black leading-tight blur-sm select-none" style={{ fontSize: '1.6rem' }}>
          {result.sqmLow}–{result.sqmHigh} sqm
        </p>
      </div>
      <div className="bg-white/5 border border-white/8" style={{ padding: '1.5rem 1.25rem' }}>
        <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Monthly Rent Est.</p>
        <p className="text-white font-black leading-tight blur-sm select-none" style={{ fontSize: '1.6rem' }}>
          {fmtAUD(result.monthlyRent)}
        </p>
      </div>
    </div>
  )

  const fullResults = result && (
    <div>
      <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>
        Your space estimate — {result.staff} staff · {result.workStyle}
      </p>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-teal/10 border border-teal/30" style={{ padding: '1.5rem 1.25rem' }}>
          <p className="text-teal/70 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Recommended Space</p>
          <p className="text-teal font-black leading-tight" style={{ fontSize: '1.6rem' }}>
            {result.sqmLow}–{result.sqmHigh} sqm
          </p>
        </div>
        <div className="bg-white/5 border border-white/8" style={{ padding: '1.5rem 1.25rem' }}>
          <p className="text-white/40 font-light mb-1 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Sqm Per Seat</p>
          <p className="text-white font-black leading-tight" style={{ fontSize: '1.6rem' }}>
            {result.sqmPerSeat} sqm
          </p>
        </div>
      </div>

      {/* Monthly rent */}
      <div className="bg-white/5 border border-white/8 mb-6" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 font-light uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>Monthly Rent Estimate</p>
            <p className="text-white font-black" style={{ fontSize: '1.4rem' }}>{fmtAUD(result.monthlyRent)} / mo</p>
          </div>
          <p className="text-white/25 font-light text-right" style={{ fontSize: '0.72rem', maxWidth: '12rem', lineHeight: 1.5 }}>
            Indicative Newcastle / Hunter market estimate at $35/sqm/yr
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="border border-white/10 mb-6" style={{ padding: '1.5rem' }}>
        <p className="text-white/50 font-semibold uppercase tracking-widest mb-4" style={{ fontSize: '0.65rem' }}>
          Recommendations for {result.workStyle === 'traditional' ? 'Traditional' : result.workStyle === 'hybrid' ? 'Hybrid' : 'Agile'} Teams
        </p>
        <ul className="flex flex-col" style={{ gap: '0.875rem', listStyle: 'none', padding: 0, margin: 0 }}>
          {WORK_STYLE_RECOMMENDATIONS[result.workStyle].map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-teal flex-shrink-0 font-bold" style={{ fontSize: '0.75rem', marginTop: '0.1rem' }}>→</span>
              <span className="text-white/70 font-light leading-relaxed" style={{ fontSize: '0.85rem', lineHeight: 1.65 }}>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <a
        href="/tenant-rep"
        className="inline-flex items-center gap-2 bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors"
        style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', borderRadius: '0.5rem' }}
      >
        Search spaces in this size range →
      </a>

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={handleReset} className="text-white/25 hover:text-white/50 transition-colors font-light" style={{ fontSize: '0.82rem' }}>
          ← Reset
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-near-black" style={{ paddingTop: 'clamp(6rem,14vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ ...WRAP, paddingTop: 'clamp(4rem,8vw,6rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>

          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl" style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}>
              <div className="inline-flex items-center gap-2 border border-teal/30 mb-6" style={{ padding: '0.4rem 1rem' }}>
                <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem' }} />
                <span className="text-teal font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>Free Tool</span>
              </div>
              <h1 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                Office Size Calculator
              </h1>
              <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
                How much space does your team actually need? Enter your details below to get a tailored sqm estimate with indicative costs for the Newcastle and Hunter market.
              </p>
            </div>
          </FadeIn>

          {/* Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: 'clamp(2.5rem,6vw,5rem)' }}>

            {/* Inputs */}
            <FadeIn delay={60}>
              <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Team details</p>

              <div className="flex flex-col" style={{ gap: '2.5rem' }}>

                {/* Number of staff */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Number of staff <span className="text-teal">*</span>
                  </label>
                  <input
                    type="number"
                    value={staff}
                    min={1}
                    onChange={e => { setStaff(e.target.value); setResult(null) }}
                    placeholder="e.g. 20"
                    className="w-full bg-white/8 text-white border border-white/15 focus:border-teal outline-none font-light placeholder:text-white/20 transition-colors"
                    style={{ padding: '0.9rem 1rem', fontSize: '1.1rem' }}
                  />
                </div>

                {/* Work style */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Work style <span className="text-teal">*</span>
                  </label>
                  <div className="flex flex-col" style={{ gap: '0.5rem' }}>
                    {WORK_STYLES.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setWorkStyle(opt.value); setResult(null) }}
                        className={`text-left font-semibold border transition-colors ${workStyle === opt.value ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.75rem 1rem', fontSize: '0.88rem' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Private offices */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Private offices needed <span className="text-teal">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIVATE_OFFICE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setPrivateOffices(opt); setResult(null) }}
                        className={`font-bold border transition-colors text-center ${privateOffices === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.88rem' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meeting rooms */}
                <div>
                  <label className="block text-white/70 font-semibold" style={{ marginBottom: '0.875rem', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                    Meeting rooms needed <span className="text-teal">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {MEETING_ROOM_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setMeetingRooms(opt); setResult(null) }}
                        className={`font-bold border transition-colors text-center ${meetingRooms === opt ? 'border-teal bg-teal/10 text-white' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'}`}
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.88rem' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCalc}
                  disabled={!canCalc}
                  className={`font-bold transition-all ${canCalc ? 'bg-teal text-white hover:bg-dark-teal cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                  style={{ padding: '1.25rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'flex-start', borderRadius: '0.5rem' }}
                >
                  Calculate →
                </button>
              </div>
            </FadeIn>

            {/* Results */}
            <FadeIn delay={120}>
              {!result ? (
                <div className="border border-white/8 bg-white/3" style={{ padding: '2.5rem 2rem' }}>
                  <p className="text-white/25 font-light text-center" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Fill in your team details to get a recommended office size and cost estimate.
                  </p>
                </div>
              ) : (
                <ToolGate
                  tool="Office Size Calculator"
                  teaser={
                    <div>
                      <p className="text-white/40 font-semibold uppercase tracking-[0.25em] mb-4" style={{ fontSize: '0.7rem' }}>
                        Loading your space estimate...
                      </p>
                      {teaserContent}
                    </div>
                  }
                  context={() => `Staff: ${result.staff}, Work style: ${result.workStyle}, Estimated sqm: ${result.sqm}`}
                >
                  {fullResults}
                </ToolGate>
              )}
            </FadeIn>
          </div>

          <div style={{ paddingBottom: 'clamp(4rem,8vw,6rem)' }} />

          {/* CTA */}
          <div className="mt-20 md:mt-28 pt-12 border-t border-white/8 max-w-2xl">
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-3" style={{ fontSize: '0.7rem' }}>Ready to find space?</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>
              We source and negotiate commercial space for Newcastle and Hunter businesses.
            </h2>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
              style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
              Book a Space Consultation →
            </a>
          </div>

        </div>
      </div>

      {/* CTA section */}
      <section className="bg-teal" style={SEC}>
        <div className="max-w-screen-xl mx-auto text-center" style={WRAP}>
          <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
            Getting the right space isn&apos;t just about sqm.
          </h2>
          <p className="text-white/80 font-light leading-relaxed mb-12 mx-auto"
            style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
            We help tenants negotiate favourable terms, fitout contributions and lease structures that match how you actually work.
          </p>
          <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-teal font-bold no-underline hover:bg-light-teal transition-colors"
            style={{ padding: '1.25rem 3rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '0.5rem' }}>
            Book a Clarity Call
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
