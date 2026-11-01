'use client'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'
import { parseCapNumber } from '@/lib/cap-rate'
import { trackConversion } from '@/lib/analytics'
import { calculateCommercialRent, normaliseRentAmounts, type CommercialRentInput } from '@/lib/calculators/commercial-rent'
import styles from './calculator.module.css'

const defaults = { areaM2: '', rent: '', outgoings: '0', termYears: '5', reviewPct: '3', outgoingsIncreasePct: '3', rentFreeMonths: '0', fitoutContribution: '0', capRatePct: '', ownerCostsAnnual: '0' }
const outgoingLabels = ['Council rates', 'Water and sewerage', 'Building insurance', 'Strata levies', 'Land tax', 'Property management', 'Other']
const money = (v: number, cents = false) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }).format(v)
function Field({ label, value, onChange, hint, error, onBlur, locked = false }: { label: string; value: string; onChange: (v: string) => void; hint: string; error?: string; onBlur?: () => void; locked?: boolean }) {
  const id = useId()
  return <div className={styles.field}><label htmlFor={id}>{label}</label><input id={id} type="text" inputMode="decimal" value={value} readOnly={locked} onBlur={onBlur} onChange={e => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`} /><p id={`${id}-help`}>{hint}</p><p id={`${id}-error`} className={styles.error} aria-live="polite">{error || ''}</p></div>
}
function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const name = useId()
  return <fieldset className={styles.choice}><legend>{label}</legend><div>{options.map(o => <label key={o.value}><input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />{o.label}</label>)}</div></fieldset>
}
export default function CommercialRentCalculator() {
  const [form, setForm] = useState(defaults), [touched, setTouched] = useState<Record<string, boolean>>({})
  const [rentMode, setRentMode] = useState<'psm' | 'annual'>('psm'), [ogMode, setOgMode] = useState<'psm' | 'annual'>('annual')
  const [leaseType, setLeaseType] = useState<'net' | 'gross'>('net'), [gst, setGst] = useState(true), [ogDuringFree, setOgDuringFree] = useState(true)
  const [itemised, setItemised] = useState(false), [items, setItems] = useState(outgoingLabels.map(() => '0')), [valueOpen, setValueOpen] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const started = useRef(false), completed = useRef(false)
  const start = () => { if (!started.current) { trackConversion('tool_start', { tool: 'commercial-rent-calculator' }); started.current = true } }
  const update = (key: keyof typeof defaults, value: string) => { start(); setForm(p => ({ ...p, [key]: value })); setActionMessage('') }
  const num = (s: string) => parseCapNumber(s) ?? NaN
  const input = useMemo<CommercialRentInput>(() => {
    const areaM2 = num(form.areaM2)
    return { areaM2, ...normaliseRentAmounts(areaM2, num(form.rent), rentMode, num(form.outgoings), ogMode, itemised ? items.map(num) : undefined), leaseType, termYears: num(form.termYears), reviewPct: num(form.reviewPct), outgoingsIncreasePct: num(form.outgoingsIncreasePct), rentFreeMonths: num(form.rentFreeMonths), outgoingsDuringRentFree: ogDuringFree, fitoutContribution: num(form.fitoutContribution), showGst: gst, capRatePct: valueOpen && form.capRatePct.trim() ? num(form.capRatePct) : null, ownerCostsAnnual: valueOpen ? num(form.ownerCostsAnnual) : 0 }
  }, [form, rentMode, ogMode, itemised, items, leaseType, ogDuringFree, gst, valueOpen])
  const calculated = useMemo(() => calculateCommercialRent(input), [input])
  const [settled, setSettled] = useState(calculated)
  useEffect(() => { const timer = setTimeout(() => { setSettled(calculated); if (calculated.result && !completed.current) { trackConversion('tool_complete', { tool: 'commercial-rent-calculator' }); completed.current = true } }, 250); return () => clearTimeout(timer) }, [calculated])
  const result = calculated.result ? settled.result : null
  const pending = calculated !== settled
  const err = (key: string, raw: string) => (raw.trim() || touched[key]) ? calculated.errors[key] : undefined
  const field = (key: keyof typeof defaults, label: string, hint: string, errorKey: string = key) => <Field label={label} value={form[key]} onChange={v => update(key, v)} onBlur={() => setTouched(p => ({ ...p, [errorKey]: true }))} hint={hint} error={err(errorKey, form[key])} />
  const normalisedOutgoings = itemised ? items.map(num).reduce((a, b) => a + b, 0) : num(form.outgoings)
  const summary = result ? `Over ${input.termYears} years you will pay about ${money(result.total_occupancy_inc)} ${gst ? 'inc GST' : 'with GST excluded'}. Your year 1 face rent is ${money(result.year1_base_monthly)} a month ex GST and rises ${input.reviewPct}% a year. Incentives are worth ${money(result.incentive_total)}. Effective rent is ${money(result.effective_rent_annual)} a year ex GST. These are indicative planning figures, not advice or a valuation.` : ''
  const reset = () => { setForm(defaults); setTouched({}); setRentMode('psm'); setOgMode('annual'); setLeaseType('net'); setGst(true); setOgDuringFree(true); setItemised(false); setItems(outgoingLabels.map(() => '0')); setValueOpen(false); setActionMessage('Inputs reset'); started.current = false; completed.current = false }
  return <div className={`${styles.tool} rent-print-root`}>
    <div className={styles.controls}>
      <section className={styles.inputSection} aria-labelledby="rent-input-heading"><h2 id="rent-input-heading">The space and the rent</h2><div className={styles.grid}>
        {field('areaM2', 'Lettable area (m²)', 'The lettable area in the lease or listing. Maximum 100,000 m².')}
        <Choice label="Rent entered as" value={rentMode} options={[{ value: 'psm', label: 'Per m² per year' }, { value: 'annual', label: 'Total per year' }]} onChange={v => { start(); setRentMode(v) }} />
        {field('rent', rentMode === 'psm' ? 'Face rent ($/m² per year)' : 'Face rent ($ per year)', 'The rent quoted before any incentives.', 'faceRentPsm')}
        <Choice label="Lease type" value={leaseType} options={[{ value: 'net', label: 'Net' }, { value: 'gross', label: 'Gross' }]} onChange={v => { start(); setLeaseType(v) }} />
      </div><p>{leaseType === 'net' ? 'Outgoings are paid on top of the rent.' : 'Outgoings are included in the rent. Confirm the lease wording and any separate charges.'}</p></section>
      <section className={styles.inputSection} aria-labelledby="outgoings-heading"><h2 id="outgoings-heading">Outgoings</h2><div className={styles.grid}>
        {!itemised && <Choice label="Outgoings entered as" value={ogMode} options={[{ value: 'annual', label: 'Total per year' }, { value: 'psm', label: 'Per m² per year' }]} onChange={v => { start(); setOgMode(v) }} />}
        <Field label={leaseType === 'gross' ? "Owner's outgoings included in the gross rent (optional)" : `Annual outgoings (${!itemised && ogMode === 'psm' ? '$/m²' : '$ total'})`} value={itemised ? (Number.isFinite(normalisedOutgoings) ? String(normalisedOutgoings) : '') : form.outgoings} locked={itemised} onChange={v => update('outgoings', v)} onBlur={() => setTouched(p => ({ ...p, outgoingsAnnual: true }))} hint={leaseType === 'gross' ? 'Only used in the value panel.' : 'Paid by you on top of the rent. Itemised amounts below are annual totals.'} error={err('outgoingsAnnual', form.outgoings)} />
        {field('outgoingsIncreasePct', 'Outgoings increase per year (%)', 'Outgoings usually move with actual costs. 3% is a planning assumption, not a forecast.')}
      </div><label className={styles.check}><input type="checkbox" checked={itemised} onChange={e => { start(); setItemised(e.target.checked) }} />Itemise outgoings</label>
      {itemised && <div className={styles.grid}>{outgoingLabels.map((label, n) => <Field key={label} label={`${label} ($ per year)`} value={items[n]} onChange={v => { start(); setItems(p => p.map((s, j) => j === n ? v : s)) }} hint="Annual amount paid or recovered under the lease, before GST." error={parseCapNumber(items[n]) === null ? 'Enter a non-negative annual amount' : undefined} />)}</div>}
      <p>Only include charges permitted and recoverable under your actual lease. The categories are not a statement that every charge can be passed on.</p></section>
      <section className={styles.inputSection} aria-labelledby="term-heading"><h2 id="term-heading">Term, reviews and incentives</h2><div className={styles.grid}>
        {field('termYears', 'Lease term (years)', 'A whole number from 1 to 15.')}
        {field('reviewPct', 'Annual rent review (%)', 'Use the fixed % in your lease. For a CPI review, enter your own CPI assumption. Range 0% to 15%.')}
        {field('rentFreeMonths', 'Rent-free (months)', 'Months at the start of the lease with no base rent. Maximum 36 months and no longer than the lease.')}
        {field('fitoutContribution', 'Landlord fitout contribution ($)', 'Cash or works the landlord pays towards your fitout.')}
      </div>{leaseType === 'net' && <><Choice label="Outgoings payable during rent-free?" value={ogDuringFree ? 'yes' : 'no'} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} onChange={v => { start(); setOgDuringFree(v === 'yes') }} /><p>Many leases still charge outgoings during rent-free. Check yours.</p></>}
      <label className={styles.check}><input type="checkbox" checked={gst} onChange={e => { start(); setGst(e.target.checked) }} />Show GST</label><p>Adds 10% GST, assuming the landlord is registered for GST and the entered payments are taxable. This is a cash-flow model, not a tax or GST-credit calculation.</p></section>
    </div>
    <section className={styles.results} id="rent-results" aria-labelledby="results-heading" aria-busy={pending}>
      <p className={styles.eyebrow}>Your Office Space | Commercial Rent Calculator</p><h2 id="results-heading">Commercial lease summary</h2>
      <p role="status" className={styles.status}>{!calculated.result ? 'Enter a valid lettable area and face rent, and check the other fields, to see results.' : pending ? 'Updating your planning figures' : 'Planning figures updated. No email required.'}</p>
      {result && <><div className={styles.cards}>
        <div><h3>Year 1 face rent</h3><strong>{money(result.year1_base)}</strong><p>per year ex GST</p><p>{money(result.year1_base_monthly)} per month ex GST</p></div>
        <div><h3>Year 1 occupancy cost</h3><strong>{money(result.year1_occupancy_ex)}</strong><p>per year ex GST; {money(result.year1_occupancy_ex / 12)} per month</p>{gst && <p>{money(result.year1_occupancy_inc)} per year inc GST; {money(result.year1_occupancy_inc / 12)} per month</p>}<p>Normal full-year run-rate before rent-free.</p></div>
        <div><h3>Total occupancy cost</h3><strong>{money(result.total_occupancy_ex)}</strong><p>over {input.termYears} years ex GST</p>{gst && <p>{money(result.total_occupancy_inc)} inc GST</p>}</div>
        <div><h3>Effective rent</h3><strong>{money(result.effective_rent_psm)}/m²</strong><p>per year ex GST; {money(result.effective_rent_annual)} per year total</p><p>Incentives worth {money(result.incentive_total)} ({result.incentive_pct.toFixed(2)}% of rent over the term)</p>{result.effective_rent_annual < 0 && <p>The entered incentives exceed face rent. Check the offer and the incentive conditions.</p>}</div>
      </div><p className={styles.summary}>{summary}</p><p className={styles.printOnly}>Inputs: {input.areaM2} m²; {input.leaseType} lease; year 1 face rent {money(result.year1_base, true)}; year 1 outgoings {money(input.outgoingsAnnual, true)}; annual outgoings increase {input.outgoingsIncreasePct}%; rent-free {input.rentFreeMonths} months; outgoings during rent-free {input.outgoingsDuringRentFree ? 'payable' : 'not payable'} (net leases only); fitout contribution {money(input.fitoutContribution, true)}. Generated locally at yourofficespace.au/resources/commercial-rent-calculator.</p><h3>Year-by-year lease schedule</h3><div className={styles.tableWrap} role="region" aria-label="Lease schedule, scroll sideways for all columns" tabIndex={0}><table><thead><tr>{['Year', 'Base rent', 'Rent-free', ...(leaseType === 'net' ? ['Outgoings'] : []), 'Total ex GST', ...(gst ? ['GST', 'Total inc GST'] : []), `Running total ${gst ? 'inc' : 'ex'} GST`].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{result.rows.map(row => <tr key={row.year}><th scope="row">{row.year}</th><td>{money(row.base, true)}</td><td>{money(row.rent_free, true)}</td>{leaseType === 'net' && <td>{money(row.outgoings_payable, true)}</td>}<td>{money(row.total_ex, true)}</td>{gst && <><td>{money(row.gst, true)}</td><td>{money(row.total_inc, true)}</td></>}<td>{money(row.cumulative_inc, true)}</td></tr>)}</tbody><tfoot><tr><th scope="row">Total</th><td>{money(result.total_base_gross, true)}</td><td>{money(result.rent_free_value, true)}</td>{leaseType === 'net' && <td>{money(result.rows.reduce((n, row) => n + row.outgoings_payable, 0), true)}</td>}<td>{money(result.total_occupancy_ex, true)}</td>{gst && <><td>{money(result.rows.reduce((n, row) => n + row.gst, 0), true)}</td><td>{money(result.total_occupancy_inc, true)}</td></>}<td>{money(result.total_occupancy_inc, true)}</td></tr></tfoot></table></div><p>The fitout contribution is shown as an incentive. It isn&apos;t deducted from your rent payments.</p><p>Rent reviews apply on each lease anniversary. Rent-free starts in the first month and can run into later years. Totals use unrounded figures, so displayed cents may not add exactly. The model excludes make-good, deposits, finance, fitout costs and other costs not entered.</p>
      <div className={styles.controls}><Button onClick={async () => { try { await navigator.clipboard.writeText(summary); setActionMessage('Summary copied') } catch { setActionMessage('Copy was unavailable. Select the summary text to copy it manually.') } }}>Copy summary</Button><Button onClick={() => window.print()} variant="outline-light">Print or save as PDF</Button></div></>}
      <div className={styles.controls}><Button onClick={reset} variant="outline-light">Reset</Button><p role="status">{actionMessage}</p></div>
    </section>
    <details className={styles.valuePanel} open={valueOpen} onToggle={e => setValueOpen(e.currentTarget.open)}><summary>What this rent means for value</summary><p>Enter your own assumption. We don&apos;t supply market cap rates.</p><div className={styles.grid}>
      {field('capRatePct', 'Cap rate (%)', 'From 1% to 20%. You can use increments such as 6.05%.')}
      {field('ownerCostsAnnual', 'Other owner costs not recovered from the tenant ($ per year)', 'For example, management or repairs the owner pays. Leave at 0 if unsure. Do not count the same outgoing twice.')}
    </div>{valueOpen && result && !pending && <>{form.capRatePct.trim() && !calculated.errors.capRatePct && !calculated.errors.ownerCostsAnnual && result.noi_year1 <= 0 && <p role="status">With these figures the owner&apos;s net income is zero or less, so a capitalised value can&apos;t be calculated.</p>}{result.value !== null && <div id="rent-value"><h2>Indicative capitalised value</h2><strong className={styles.value}>{money(result.value)}</strong><p>Year 1 net income: {money(result.noi_year1, true)} ex GST. Assumed cap rate: {input.capRatePct}%.</p><div className={styles.tableWrap} role="region" aria-label="Cap rate sensitivity" tabIndex={0}><table><thead><tr><th scope="col">Assumed cap rate</th><th scope="col">Indicative value</th></tr></thead><tbody>{result.sens.map(s => <tr key={s.rate}><th scope="row">{s.rate.toFixed(2)}%</th><td>{money(s.value, true)}</td></tr>)}</tbody></table></div><p>Every extra $1,000 of net rent adds about {money(result.value_per_1000_rent!)} of value at this cap rate, with all other assumptions held constant.</p></div>}</>}
    <p>Based on year 1 face rent. Valuers usually look at net income after incentives, lease term remaining and tenant strength, and check it against recent sales. This is not a valuation.</p><Link href="/resources/cap-rate-calculator">Test more scenarios in the Cap Rate Calculator</Link></details>
  </div>
}
