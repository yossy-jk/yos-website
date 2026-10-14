"use client";
import { useState, useRef, useEffect } from "react";
import { TENANT_ATTRIBUTION_KEY } from "./TenantAttribution";
import Link from "next/link";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import { urgencyBand } from "@/lib/tenant-calculations";
import { HUBSPOT } from "@/lib/constants";
import { trackTenantEvent as trackConversion } from "@/lib/tenant-analytics";
type Kind = "health_check" | "results" | "referral" | "checklist";
const privacy =
  "YOS uses these details to respond to this request. Marketing is optional and requires separate consent.";
const marketing =
  "I would like practical lease guidance and follow-up emails from the YOS team. I can unsubscribe at any time.";
export default function TenantLeadForm({
  kind = "health_check",
  tool,
  results,
}: {
  kind?: Kind;
  tool?: string;
  results?: Record<string, number | string | boolean>;
}) {
  const [step, setStep] = useState(1),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false),
    [fields, setFields] = useState<Record<string, string>>({
      intent: "unsure",
      expiry: "",
    }),
    [worries, setWorries] = useState<string[]>([]),
    [consent, setConsent] = useState(false),
    [refPermission, setRefPermission] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submission = useRef({ body: "", id: "" });
  const started = useRef(false);
  const health = kind === "health_check";
  const previousStep = useRef(step);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (previousStep.current !== step) {
      const heading = formRef.current?.querySelector("legend");
      heading?.focus();
      heading?.scrollIntoView({ block: "center" });
      previousStep.current = step;
    }
  }, [step]);
  useEffect(() => {
    if (done) resultHeading.current?.focus();
  }, [done]);
  const set = (key: string, v: string) => {
    setFields((p) => ({ ...p, [key]: v }));
    setDone(false);
  };
  const band = urgencyBand(fields.expiry || "");
  const field = (
    key: string,
    label: string,
    type = "text",
    required = false,
  ) => (
    <div className="tenant-field" key={key}>
      <label htmlFor={`${kind}-${key}`}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={`${kind}-${key}`}
        name={key}
        type={type}
        required={required}
        value={fields[key] || ""}
        maxLength={key === "email" ? 200 : 150}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (health && step < 3) {
      setStep((s) => s + 1);
      if (TENANT_OFFER.approvedForPublication)
        trackConversion("health_check_step", { form_step: step + 1 });
      return;
    }
    if (kind === "referral" && !fields.referredEmail && !fields.referredPhone) {
      setError("Add their email or phone number.");
      document.getElementById(`${kind}-referredEmail`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const query = new URLSearchParams(location.search),
        attribution = Object.fromEntries(
          [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_content",
            "package",
          ].map((k) => [k, (query.get(k) || "").slice(0, 150)]),
        );
      let savedAttribution: Record<string, string> = {};
      try {
        savedAttribution = JSON.parse(
          sessionStorage.getItem(TENANT_ATTRIBUTION_KEY) || "{}",
        );
      } catch {
        /* Optional functional context. */
      }
      const payload = {
        kind,
        fields,
        worries,
        marketingConsent: consent,
        referralPermission: refPermission,
        tool,
        results,
        attribution: {
          ...savedAttribution,
          ...Object.fromEntries(
            Object.entries(attribution).filter(([, v]) => Boolean(v)),
          ),
        },
        landingPage: savedAttribution.landingPage || location.pathname,
        honeypot:
          (formRef.current?.elements.namedItem("website") as HTMLInputElement)
            ?.value || "",
      };
      const fingerprint = JSON.stringify(payload);
      if (submission.current.body !== fingerprint)
        submission.current = { body: fingerprint, id: crypto.randomUUID() };
      const response = await fetch("/api/tenant-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          submissionId: submission.current.id,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok)
        throw new Error(
          data.error ||
            "We could not confirm delivery. Please try again or call (02) 4092 0733.",
        );
      setPreview(Boolean(data.preview));
      setDone(true);
      if (!data.preview && !data.duplicate) {
        const event =
          kind === "health_check"
            ? "health_check_submit"
            : kind === "referral"
              ? "referral_submit"
              : kind === "results"
                ? "results_emailed"
                : "guide_download";
        trackConversion(event, {
          form_name: kind,
          tool,
          service: fields.intent === "buy" ? "Buying" : "Leasing",
        });
        if (kind === "health_check" || kind === "referral")
          trackConversion("generate_lead", {
            form_name: kind,
            service: fields.intent === "buy" ? "Buying" : "Leasing",
          });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="tenant-results" role="status">
        <h3 ref={resultHeading} tabIndex={-1}>
          {preview
            ? "Preview completed. No enquiry was sent."
            : "Your request was received."}
        </h3>
        {health && (
          <>
            <p>
              <strong>{band.band}</strong>: {band.message}
            </p>
            <p>
              This timing guide uses expiry only. An earlier option deadline can
              make your next step more urgent.
            </p>
          </>
        )}
        <p>
          {preview
            ? "Review the next step below. The booking link opens the existing YOS booking service."
            : "The YOS team will review your request and contact you about the next step."}
        </p>
        {kind === "checklist" && (
          <Link
            className="tenant-button"
            href="/downloads/newcastle-tenants-lease-checklist.pdf"
          >
            Download the checklist PDF
          </Link>
        )}
        <a
          className="tenant-button"
          href={HUBSPOT.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a clarity call
        </a>
        <p className="tenant-small">
          Sending this form does not book a call. Choose a time in the booking
          service.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="tenant-button"
        >
          Edit my details
        </button>
      </div>
    );
  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="tenant-form-box"
      onFocus={() => {
        if (health && !started.current && TENANT_OFFER.approvedForPublication) {
          started.current = true;
          trackConversion("health_check_start", { form_name: kind });
        }
      }}
    >
      {health && (
        <>
          <p>Step {step} of 3</p>
          <progress
            className="tenant-progress"
            value={step}
            max={3}
            aria-label={`Lease Health Check step ${step} of 3`}
          />
        </>
      )}
      <div style={{ position: "absolute", left: -9999 }} aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input
          id={`${kind}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {(!health || step === 1) && (
        <fieldset>
          <legend tabIndex={-1}>
            {kind === "referral"
              ? "Your details"
              : health
                ? "About you"
                : "Where should we send it?"}
          </legend>
          <div className="tenant-fields">
            {field("name", "Your name", "text", true)}
            {field("email", "Your email", "email", true)}
            {field(
              "business",
              "Business name",
              "text",
              health || kind === "checklist",
            )}
            {health && field("role", "Your role")}
            {health && field("mobile", "Mobile", "tel", true)}
            {health && field("suburb", "Current suburb", "text", true)}
          </div>
        </fieldset>
      )}
      {health && step === 2 && (
        <fieldset>
          <legend tabIndex={-1}>Your lease and next step</legend>
          <div className="tenant-fields">
            {field(
              "expiry",
              "Lease expiry date (leave blank if unsure)",
              "date",
            )}
            {field("area", "Floor area (m²)", "number")}
            {field("rent", "Current annual rent (optional, ex GST)", "number")}
            {field("headcount", "Headcount now", "number")}
            {field("futureHeadcount", "Headcount in two years", "number")}
          </div>
          <div className="tenant-field">
            <label htmlFor="health-intent">What are you weighing up?</label>
            <select
              id="health-intent"
              value={fields.intent}
              onChange={(e) => set("intent", e.target.value)}
            >
              <option value="unsure">Not sure yet</option>
              <option value="stay">Stay and renegotiate</option>
              <option value="move">Move</option>
              <option value="expand">Expand</option>
              <option value="buy">Buy instead</option>
            </select>
          </div>
          <p className="tenant-note">
            Have your lease handy for the call. You can request a secure way to
            share it with our team.
          </p>
        </fieldset>
      )}
      {health && step === 3 && (
        <fieldset>
          <legend tabIndex={-1}>What matters most?</legend>
          {[
            "Cost",
            "Time",
            "Make-good",
            "Finding space",
            "Timing",
            "Not sure what is fair",
          ].map((w) => (
            <label className="tenant-checkbox" key={w}>
              <input
                type="checkbox"
                checked={worries.includes(w)}
                onChange={(e) =>
                  setWorries((p) =>
                    e.target.checked ? [...p, w] : p.filter((v) => v !== w),
                  )
                }
              />
              {w}
            </label>
          ))}
          {field("heard", "How did you hear about us?")}
          {field("referrer", "Referrer name (if applicable)")}
        </fieldset>
      )}
      {kind === "referral" && (
        <fieldset>
          <legend tabIndex={-1}>Business you are referring</legend>
          <div className="tenant-fields">
            {field("referredBusiness", "Their business", "text", true)}
            {field("referredName", "Contact name", "text", true)}
            {field("referredEmail", "Contact email", "email")}
            {field("referredPhone", "Contact phone", "tel")}
            {field("expiry", "Lease expiry (if known)", "date")}
          </div>
          <label className="tenant-checkbox">
            <input
              type="checkbox"
              required
              checked={refPermission}
              onChange={(e) => setRefPermission(e.target.checked)}
            />
            They are happy for YOS to contact them.
          </label>
          <p className="tenant-small">
            Provide an email or phone number. Only refer someone who has agreed
            to be contacted.
          </p>
        </fieldset>
      )}
      {(!health || step === 3) && (
        <>
          <label className="tenant-checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            {marketing}
          </label>
          <p className="tenant-privacy">
            {privacy} <Link href="/privacy">Read our privacy policy.</Link>
          </p>
        </>
      )}
      {error && (
        <p className="tenant-error" role="alert">
          {error}
        </p>
      )}
      <div className="tenant-actions">
        {health && step > 1 && (
          <button
            type="button"
            className="tenant-button"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
        )}
        <button className="tenant-button" type="submit" disabled={busy}>
          {busy
            ? "Sending..."
            : health && step < 3
              ? "Continue"
              : health
                ? "Request my free Lease Health Check"
                : kind === "results"
                  ? "Email me my results"
                  : kind === "referral"
                    ? "Send referral"
                    : "Send me the checklist"}
        </button>
      </div>
    </form>
  );
}
