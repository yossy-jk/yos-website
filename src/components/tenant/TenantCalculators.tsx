"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { TENANT_OFFER, feeForTier } from "@/lib/tenant-offer";
import {
  leaseCost,
  timeCost,
  criticalDates,
  calendarIcs,
  guaranteeResult,
  type LeaseInputs,
} from "@/lib/tenant-calculations";
import TenantLeadForm from "./TenantLeadForm";
import { trackTenantEvent as trackConversion } from "@/lib/tenant-analytics";
const money = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
function Field({
  name,
  label,
  value,
  onChange,
  min = 0,
  max = 100000000,
  hint,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  return (
    <div className="tenant-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type="number"
        step="any"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(e.target.value === "" ? 0 : Number(e.target.value))
        }
        required
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}
function ToolResults({
  children,
  tool,
  inputs,
}: {
  children: ReactNode;
  tool: string;
  inputs: Record<string, number | string | boolean>;
}) {
  return (
    <div className="tenant-results" role="status">
      <p className="tenant-eyebrow">Your estimate</p>
      {children}
      <p className="tenant-small">
        Estimates use your inputs. They do not assess market rent, your lease
        wording or legal obligations.
      </p>
      <Link className="tenant-button" href="/lease-health-check">
        Check this with the YOS team
      </Link>
      <details>
        <summary>Email me a copy</summary>
        <TenantLeadForm kind="results" tool={tool} results={inputs} />
      </details>
    </div>
  );
}
export function TimeCalculator({ compact = false }: { compact?: boolean }) {
  const [hourly, setHourly] = useState(0),
    [annual, setAnnual] = useState(0),
    [basis, setBasis] = useState("hourly"),
    [leaders, setLeaders] = useState(1),
    [hours, setHours] = useState<number>(TENANT_OFFER.time.defaultHours),
    [tier, setTier] = useState("gold"),
    [result, setResult] = useState<number | null>(null),
    [error, setError] = useState("");
  return (
    <div className="tenant-two">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setResult(
              timeCost(
                basis === "annual"
                  ? annual / TENANT_OFFER.time.annualHours
                  : hourly,
                leaders,
                hours,
              ),
            );
            setError("");
            if (TENANT_OFFER.approvedForPublication)
              trackConversion("calculator_complete", {
                tool: "time_cost",
                package_tier: tier,
              });
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <div className="tenant-field">
          <label htmlFor={`time-basis-${compact}`}>
            How do you value your time?
          </label>
          <select
            id={`time-basis-${compact}`}
            value={basis}
            onChange={(e) => {
              setBasis(e.target.value);
              setResult(null);
            }}
          >
            <option value="hourly">Hourly value</option>
            <option value="annual">Annual pay estimate</option>
          </select>
        </div>
        {basis === "hourly" ? (
          <Field
            name={`hourly-${compact}`}
            label="Your hourly value ($)"
            value={hourly}
            onChange={(v) => {
              setHourly(v);
              setResult(null);
            }}
          />
        ) : (
          <Field
            name={`annual-${compact}`}
            label="Your annual pay ($)"
            value={annual}
            onChange={(v) => {
              setAnnual(v);
              setResult(null);
            }}
            hint={`Divided by ${TENANT_OFFER.time.annualHours.toLocaleString("en-AU")} working hours. Adjust the hourly value for your situation.`}
          />
        )}
        <div className="tenant-fields">
          <Field
            name={`leaders-${compact}`}
            label="Leaders involved"
            value={leaders}
            onChange={(v) => {
              setLeaders(v);
              setResult(null);
            }}
            min={1}
            max={100}
          />
          <div className="tenant-field">
            <label htmlFor={`hours-${compact}`}>
              Hours per leader: {hours}
            </label>
            <input
              id={`hours-${compact}`}
              type="range"
              min={TENANT_OFFER.time.minHours}
              max={TENANT_OFFER.time.maxHours}
              value={hours}
              onChange={(e) => {
                setHours(Number(e.target.value));
                setResult(null);
              }}
              aria-valuetext={`${hours} hours per leader`}
            />
          </div>
        </div>
        <p className="tenant-small">
          {TENANT_OFFER.time.defaultHours} hours is an editable example input,
          not a measured typical search. Use your own estimate.
        </p>
        <div className="tenant-field">
          <label htmlFor={`time-tier-${compact}`}>Compare with a package</label>
          <select
            id={`time-tier-${compact}`}
            value={tier}
            onChange={(e) => {
              setTier(e.target.value);
              setResult(null);
            }}
          >
            {TENANT_OFFER.packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p role="alert" className="tenant-error">
            {error}
          </p>
        )}
        <button className="tenant-button" type="submit">
          Calculate my time cost
        </button>
      </form>
      {result === null ? (
        <aside className="tenant-results">
          <h3>What else could your team do with that time?</h3>
          <p>
            Include searching listings, calls, inspections, comparing offers and
            coordinating the move. This is the value of time used, not a promise
            of time YOS will save.
          </p>
        </aside>
      ) : (
        <ToolResults
          tool="time_cost"
          inputs={{
            hourly:
              basis === "annual"
                ? annual / TENANT_OFFER.time.annualHours
                : hourly,
            leaders,
            hours,
            tier,
          }}
        >
          <p className="tenant-result-main">{money(result)}</p>
          <p>Estimated leadership time cost.</p>
          <p>
            {TENANT_OFFER.packages.find((p) => p.id === tier)?.name}{" "}
            professional fee: <strong>{money(feeForTier(tier))} ex GST</strong>.
          </p>
          <p>
            The time calculation and professional fee cover different things.
            Compare them alongside the scope and your team’s capacity.
          </p>
        </ToolResults>
      )}
    </div>
  );
}
function LeaseFields({
  prefix,
  inputs,
  set,
}: {
  prefix: string;
  inputs: LeaseInputs;
  set: (key: keyof LeaseInputs, value: number) => void;
}) {
  return (
    <div className="tenant-fields">
      {[
        ["area", "Floor area (m²)"],
        ["rent", "Annual rent per m² ($)"],
        ["outgoings", "Annual outgoings per m² ($)"],
        ["years", "Initial term (whole years)"],
        ["review", "Annual fixed review (%)"],
        ["rentFree", "Rent-free months"],
        ["contribution", "Fitout contribution ($)"],
        ["makeGood", "Estimated make-good cost ($)"],
        ["people", "Headcount (optional)"],
      ].map(([key, label]) => (
        <Field
          key={key}
          name={`${prefix}-${key}`}
          label={label}
          value={inputs[key as keyof LeaseInputs] ?? 0}
          onChange={(v) => set(key as keyof LeaseInputs, v)}
          min={key === "area" || key === "years" ? 1 : 0}
          max={key === "years" ? 30 : key === "review" ? 100 : 100000000}
          hint={
            key === "outgoings"
              ? "Use zero for gross rent that already includes outgoings."
              : key === "review"
                ? "Fixed percentage assumption. CPI and market reviews can vary."
                : undefined
          }
        />
      ))}
    </div>
  );
}
export function LeaseCalculator() {
  const [inputs, setInputs] = useState<LeaseInputs>({
      ...TENANT_OFFER.lease,
      outgoings: 0,
      people: 0,
    }),
    [result, setResult] = useState<ReturnType<typeof leaseCost> | null>(null),
    [error, setError] = useState("");
  return (
    <div className="tenant-two">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setResult(leaseCost(inputs));
            setError("");
            if (TENANT_OFFER.approvedForPublication)
              trackConversion("calculator_complete", { tool: "lease_cost" });
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <LeaseFields
          prefix="lease"
          inputs={inputs}
          set={(key, value) => {
            setInputs((p) => ({ ...p, [key]: value }));
            setResult(null);
          }}
        />
        <p className="tenant-small">
          All amounts are ex GST. Rent-free is valued at first-year base rent;
          outgoings continue during rent-free. The fixed review rate applies to
          rent and entered outgoings. Incentives and make-good are treated as
          cash amounts, without discounting or tax adjustments.
        </p>
        {error && (
          <p className="tenant-error" role="alert">
            {error}
          </p>
        )}
        <button className="tenant-button" type="submit">
          Calculate my lease cost
        </button>
      </form>
      {result ? (
        <ToolResults tool="lease_cost" inputs={{ ...inputs }}>
          <p className="tenant-result-main">{money(result.effective)}</p>
          <p>Estimated effective cost over the initial term.</p>
          <dl>
            <dt>Total rent and entered outgoings</dt>
            <dd>{money(result.totalRent)}</dd>
            <dt>Effective cost per m² per year</dt>
            <dd>{money(result.perSqm)}</dd>
            <dt>Incentives as a share of total cost</dt>
            <dd>{result.incentivePercent.toFixed(1)}%</dd>
            {result.perPerson !== null && (
              <>
                <dt>Cost per person per year</dt>
                <dd>{money(result.perPerson)}</dd>
              </>
            )}
            <dt>One extra month of rent-free</dt>
            <dd>{money(result.extraFreeMonth)}</dd>
            <dt>
              ${TENANT_OFFER.rentReduction} per m² lower rent across the term
            </dt>
            <dd>{money(result.tenDollarReduction)}</dd>
          </dl>
        </ToolResults>
      ) : (
        <aside className="tenant-results">
          <h3>Compare the full commitment.</h3>
          <p>
            A lower face rent can still come with a larger overall cost. Use the
            same assumptions for every offer, then check incentives, reviews and
            exit costs.
          </p>
          <Link href="/resources/lease-comparison">
            Already comparing two offers? Use our lease comparison tool.
          </Link>
        </aside>
      )}
    </div>
  );
}
export function GuaranteeCalculator() {
  const [tier, setTier] = useState("platinum"),
    [baseline, setBaseline] = useState<LeaseInputs>({
      ...TENANT_OFFER.lease,
    }),
    [negotiated, setNegotiated] = useState<LeaseInputs>({
      ...TENANT_OFFER.exampleNegotiated,
    }),
    [eligible, setEligible] = useState(true),
    [result, setResult] = useState<
      (ReturnType<typeof guaranteeResult> & { savings: number }) | null
    >(null),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          if (
            baseline.area !== negotiated.area ||
            baseline.years !== negotiated.years ||
            baseline.review !== negotiated.review
          )
            throw new Error(
              "Use the same area, initial term and review structure for both offers.",
            );
          const savings =
            leaseCost(baseline).effective - leaseCost(negotiated).effective;
          setResult({
            ...guaranteeResult(
              feeForTier(tier),
              savings,
              baseline.years,
              baseline.area * (baseline.rent + (baseline.outgoings ?? 0)),
              eligible,
            ),
            savings,
          });
          setError("");
          if (TENANT_OFFER.approvedForPublication)
            trackConversion("guarantee_calc_used", { package_tier: tier });
        } catch (err) {
          setError((err as Error).message);
        }
      }}
    >
      <div className="tenant-field">
        <label htmlFor="guarantee-tier">Package fee</label>
        <select
          id="guarantee-tier"
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            setResult(null);
          }}
        >
          {TENANT_OFFER.packages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <p className="tenant-note">
        Example only. This comparison estimates rent, outgoings, incentives and make-good only. Any
        other eligible saving needs written supporting evidence. Deposits and
        bank guarantees are excluded.
      </p>
      <div className="tenant-two">
        <fieldset>
          <legend>Landlord’s first written offer</legend>
          <LeaseFields
            prefix="baseline"
            inputs={baseline}
            set={(key, v) => {
              setBaseline((p) => ({ ...p, [key]: v }));
              setResult(null);
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Negotiated offer</legend>
          <LeaseFields
            prefix="negotiated"
            inputs={negotiated}
            set={(key, v) => {
              setNegotiated((p) => ({ ...p, [key]: v }));
              setResult(null);
            }}
          />
        </fieldset>
      </div>
      <label className="tenant-checkbox">
        <input
          type="checkbox"
          checked={eligible}
          onChange={(e) => {
            setEligible(e.target.checked);
            setResult(null);
          }}
        />
        YOS ran the negotiation, the lease was signed and no exclusion applies.
      </label>
      {error && (
        <p className="tenant-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="tenant-button">
        Calculate the example
      </button>
      {result && (
        <div className="tenant-results" role="status" style={{ marginTop: 24 }}>
          <h3>Example only</h3>
          <dl>
            <dt>Estimated additional savings</dt>
            <dd>{money(result.savings)}</dd>
            <dt>Multiple of the professional fee</dt>
            <dd>{result.achieved.toFixed(2)}x</dd>
            <dt>Savings target</dt>
            <dd>
              {result.multiple}x / {money(result.target)}
            </dd>
            <dt>Refund, capped at the fee paid</dt>
            <dd>{money(result.refund)}</dd>
          </dl>
          <p>
            Only improvements on the baseline are counted. This estimate does
            not establish eligibility or a contractual refund.
          </p>
        </div>
      )}
    </form>
  );
}
export function DatesCalculator() {
  const [start, setStart] = useState(""),
    [expiryOverride, setExpiryOverride] = useState(""),
    [years, setYears] = useState<number>(TENANT_OFFER.dates.years),
    [option, setOption] = useState<number>(TENANT_OFFER.dates.option),
    [early, setEarly] = useState<number>(TENANT_OFFER.dates.early),
    [late, setLate] = useState<number>(TENANT_OFFER.dates.late),
    [frequency, setFrequency] = useState<number>(TENANT_OFFER.dates.frequency),
    [dates, setDates] = useState<ReturnType<typeof criticalDates> | null>(null),
    [error, setError] = useState("");
  return (
    <div className="tenant-two">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setDates(
              criticalDates(
                start,
                years,
                option,
                early,
                late,
                frequency,
                expiryOverride,
              ),
            );
            setError("");
            if (TENANT_OFFER.approvedForPublication)
              trackConversion("calculator_complete", {
                tool: "critical_dates",
              });
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <div className="tenant-field">
          <label htmlFor="lease-start">Lease commencement date</label>
          <input
            id="lease-start"
            type="date"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setDates(null);
            }}
            required
          />
        </div>
        <div className="tenant-field">
          <label htmlFor="lease-expiry-override">
            Expiry date printed in your lease (optional)
          </label>
          <input
            id="lease-expiry-override"
            type="date"
            value={expiryOverride}
            onChange={(e) => {
              setExpiryOverride(e.target.value);
              setDates(null);
            }}
          />
          <small>
            If blank, we use a commencement-anniversary estimate. A lease may
            end the day before. Confirm the actual expiry before relying on
            these dates.
          </small>
        </div>
        <div className="tenant-fields">
          <Field
            name="date-years"
            label="Initial term (years)"
            value={years}
            onChange={(v) => {
              setYears(v);
              setDates(null);
            }}
            min={1}
            max={30}
          />
          <Field
            name="date-option"
            label="Option term (years, zero if none)"
            value={option}
            onChange={(v) => {
              setOption(v);
              setDates(null);
            }}
            max={30}
          />
          <Field
            name="date-early"
            label="Notice opens: months before expiry"
            value={early}
            onChange={(v) => {
              setEarly(v);
              setDates(null);
            }}
          />
          <Field
            name="date-late"
            label="Notice closes: months before expiry"
            value={late}
            onChange={(v) => {
              setLate(v);
              setDates(null);
            }}
          />
          <Field
            name="date-frequency"
            label="Rent review every (years)"
            value={frequency}
            onChange={(v) => {
              setFrequency(v);
              setDates(null);
            }}
            min={1}
            max={30}
          />
        </div>
        <p className="tenant-small">
          These are calendar estimates, not a reading of your lease. Review
          methods, market review years, commencement definitions and option
          conditions must be checked against the signed wording.
        </p>
        {error && (
          <p role="alert" className="tenant-error">
            {error}
          </p>
        )}
        <button className="tenant-button" type="submit">
          Show my lease dates
        </button>
      </form>
      {dates ? (
        <ToolResults
          tool="critical_dates"
          inputs={{
            start,
            years,
            option,
            early,
            late,
            frequency,
            expiry: expiryOverride,
          }}
        >
          <h3>Your estimated dates</h3>
          <ul className="tenant-checklist">
            {dates.map((d) => (
              <li key={d.date + d.label}>
                <strong>
                  {new Date(d.date + "T00:00:00Z").toLocaleDateString("en-AU", {
                    timeZone: "UTC",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                <br />
                {d.label}
              </li>
            ))}
          </ul>
          <a
            className="tenant-button"
            download="yos-lease-dates.ics"
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendarIcs(dates))}`}
          >
            Download calendar (.ics)
          </a>
          <p className="tenant-small">
            Import this file into Outlook or Google Calendar. Dates are all-day
            events. No automated email reminders are activated by downloading
            it.
          </p>
        </ToolResults>
      ) : (
        <aside className="tenant-results">
          <h3>Check notice deadlines first.</h3>
          <p>
            Expiry is only one date. An option notice can be due months earlier.
            Ask your solicitor to confirm the exact window and notice
            requirements.
          </p>
        </aside>
      )}
    </div>
  );
}
