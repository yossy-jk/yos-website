import { TENANT_OFFER } from "./tenant-offer";
import {
  leaseCost,
  timeCost,
  criticalDates,
  urgencyBand,
  type LeaseInputs,
} from "./tenant-calculations";
export type TenantLead = ReturnType<typeof validateTenantLead>;
const trim = (v: unknown, n = 150) =>
  typeof v === "string" ? v.trim().slice(0, n) : "";
const mail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export function validateTenantLead(raw: unknown) {
  if (!raw || typeof raw !== "object") throw new Error("Invalid request.");
  const b = raw as Record<string, unknown>;
  if (
    !["health_check", "results", "referral", "checklist"].includes(
      String(b.kind),
    )
  )
    throw new Error("Invalid form.");
  const f =
    b.fields && typeof b.fields === "object"
      ? (b.fields as Record<string, unknown>)
      : {};
  const fields = Object.fromEntries(
    [
      "name",
      "email",
      "business",
      "role",
      "mobile",
      "suburb",
      "expiry",
      "area",
      "rent",
      "headcount",
      "futureHeadcount",
      "intent",
      "heard",
      "referrer",
      "referredBusiness",
      "referredName",
      "referredEmail",
      "referredPhone",
    ].map((k) => [
      k,
      trim(f[k], k === "email" || k === "referredEmail" ? 200 : 150),
    ]),
  );
  if (!fields.name || !mail(fields.email))
    throw new Error("Enter your name and a valid email.");
  if (
    b.kind === "health_check" &&
    (!fields.business ||
      !fields.mobile ||
      !fields.suburb ||
      !["stay", "move", "expand", "buy", "unsure"].includes(fields.intent))
  )
    throw new Error(
      "Complete your business, mobile, suburb and next decision.",
    );
  if (
    b.kind === "referral" &&
    (!fields.referredBusiness ||
      !fields.referredName ||
      (!fields.referredEmail && !fields.referredPhone) ||
      b.referralPermission !== true ||
      (fields.referredEmail && !mail(fields.referredEmail)))
  )
    throw new Error("Provide a contact email or phone and confirm permission.");
  if (b.kind === "checklist" && !fields.business)
    throw new Error("Enter your business name.");
  for (const k of ["area", "rent", "headcount", "futureHeadcount"])
    if (
      fields[k] &&
      (!Number.isFinite(Number(fields[k])) || Number(fields[k]) < 0)
    )
      throw new Error("Enter valid non-negative figures.");
  if (
    fields.expiry &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(fields.expiry) ||
      !Number.isFinite(new Date(fields.expiry).getTime()) ||
      new Date(fields.expiry).toISOString().slice(0, 10) !== fields.expiry)
  )
    throw new Error("Enter a valid expiry date.");
  const band = urgencyBand(fields.expiry);
  let calculated: unknown = null;
  const tool = trim(b.tool),
    i = (b.results && typeof b.results === "object" ? b.results : {}) as Record<
      string,
      unknown
    >;
  if (b.kind === "results") {
    if (tool === "lease_cost")
      calculated = leaseCost(
        Object.fromEntries(
          [
            "area",
            "rent",
            "years",
            "review",
            "rentFree",
            "contribution",
            "makeGood",
            "outgoings",
            "people",
          ].map((k) => [k, Number(i[k] ?? 0)]),
        ) as unknown as LeaseInputs,
      );
    else if (tool === "time_cost")
      calculated = {
        estimatedTimeCost: timeCost(
          Number(i.hourly),
          Number(i.leaders),
          Number(i.hours),
        ),
      };
    else if (tool === "critical_dates")
      calculated = criticalDates(
        trim(i.start),
        Number(i.years),
        Number(i.option),
        Number(i.early),
        Number(i.late),
        Number(i.frequency),
        trim(i.expiry),
      );
    else throw new Error("Invalid tool.");
  }
  const attr =
    b.attribution && typeof b.attribution === "object"
      ? (b.attribution as Record<string, unknown>)
      : {};
  return {
    kind: String(b.kind),
    source: b.kind === "referral" ? "referral" : String(b.kind),
    service: fields.intent === "buy" ? "Buying" : "Leasing",
    fields,
    worries: Array.isArray(b.worries)
      ? b.worries
          .filter((x) => typeof x === "string")
          .slice(0, 8)
          .map((x) => trim(x))
      : [],
    urgency: band.band,
    tool,
    calculated,
    attribution: Object.fromEntries(
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "package",
      ].map((k) => [k, trim(attr[k])]),
    ),
    landingPage: trim(b.landingPage, 250).split(/[?#]/)[0],
    consent: {
      marketing: b.marketingConsent === true,
      subjectEmail: fields.email,
      wording:
        "I would like practical lease guidance and follow-up emails from the YOS team. I can unsubscribe at any time.",
      at: new Date().toISOString(),
    },
    referralPermission: b.referralPermission === true,
    submittedAt: new Date().toISOString(),
    submittedSydney: new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
    }),
    honeypot: trim(b.honeypot),
  };
}
export const TENANT_ROUTING = {
  recipients: ["jk@yourofficespace.au"],
  pipeline: "default",
  stage: "2455891412",
  osEnabled: false,
  nurtureEnabled: false,
  portal: TENANT_OFFER.hubspotPortal,
};

export function resultsEmailText(lead: TenantLead): string {
  const money = (n: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 2,
    }).format(n);
  if (Array.isArray(lead.calculated))
    return lead.calculated
      .map(
        (d) =>
          `${new Date(d.date + "T00:00:00Z").toLocaleDateString("en-AU", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}: ${d.label}`,
      )
      .join("\n");
  if (!lead.calculated || typeof lead.calculated !== "object") return "";
  const values = lead.calculated as Record<string, number | null>;
  if (lead.tool === "time_cost")
    return `Estimated leadership time cost: ${money(values.estimatedTimeCost ?? 0)}.`;
  return [
    `Total rent and entered outgoings: ${money(values.totalRent ?? 0)}`,
    `Estimated effective cost over the initial term: ${money(values.effective ?? 0)}`,
    `Effective cost per square metre per year: ${money(values.perSqm ?? 0)}`,
    `Incentives: ${(values.incentivePercent ?? 0).toFixed(1)}% of total rent and entered outgoings`,
    ...(values.perPerson !== null
      ? [`Cost per person per year: ${money(values.perPerson ?? 0)}`]
      : []),
    `One extra rent-free month: ${money(values.extraFreeMonth ?? 0)}`,
    `$${TENANT_OFFER.rentReduction} per square metre lower rent over the term: ${money(values.tenDollarReduction ?? 0)}`,
  ].join("\n");
}
