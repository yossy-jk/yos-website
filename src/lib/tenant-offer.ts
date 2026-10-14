// Commercial data owned by YOS. Unconfirmed inclusions stay out of client pricing.
export const TENANT_OFFER = {
  approvedForPublication: false,
  copyApproved: true,
  pricesConfirmed: true,
  guaranteeApproved: false,
  licenceApproved: true,
  delivery: {
    lockSeconds: 300,
    receiptRetentionSeconds: 604800,
    taskBusinessHours: 2,
  },
  dates: { years: 3, option: 3, early: 6, late: 3, frequency: 1 },
  rentReduction: 10,
  exampleNegotiated: {
    area: 250,
    rent: 305,
    years: 5,
    review: 0,
    rentFree: 6,
    contribution: 25000,
    makeGood: 0,
  },
  gstRate: 0.1,
  startPayment: 500,
  hubspotPortal: "442709765",
  customArea: 1000,
  guarantee: {
    multiple: 2,
    fallbackMultiple: 1,
    minYears: 3,
    minAnnualRent: 40000,
    annualRentConfirmed: false,
    statementBusinessDays: 10,
    refundDays: 30,
  },
  time: {
    defaultHours: 60,
    minHours: 20,
    maxHours: 120,
    annualHours: 1760,
    assumptionConfirmed: false,
  },
  lease: {
    area: 250,
    rent: 320,
    years: 5,
    review: 0,
    rentFree: 2,
    contribution: 0,
    makeGood: 0,
  },
  urgency: { planMonths: 24, startMonths: 12, urgentMonths: 6 },
  healthCheck: {
    turnaroundBusinessDays: null as number | null,
    uploadRetentionDays: null as number | null,
  },
  packages: [
    {
      id: "gold",
      name: "Gold",
      fee: 4400,
      maxArea: 150,
      maxPeople: 15,
      inspections: "Up to 5",
      updates: "Fortnightly update",
      fit: "Small offices and studios",
      extras: [] as string[],
    },
    {
      id: "platinum",
      name: "Platinum",
      fee: 6950,
      maxArea: 400,
      maxPeople: 40,
      inspections: "Up to 10",
      updates: "Weekly call",
      fit: "Growing teams",
      extras: [
        "Photo-documented ingoing condition report",
        "Preliminary fitout budget range",
        "Current lease make-good exposure review",
      ],
    },
    {
      id: "diamond",
      name: "Diamond",
      fee: 9950,
      maxArea: null,
      maxPeople: null,
      inspections: "Unlimited",
      updates: "Weekly round table",
      fit: "Larger or more complex moves",
      extras: [
        "Photo-documented ingoing condition report",
        "Preliminary fitout budget range",
        "Current lease make-good exposure review",
        "Market comparables report",
        "Current lease exit plan",
        "Relocation roadmap",
        "12-month post-move check",
      ],
    },
  ],
  core: [
    "A free Lease Health Check before you commit",
    "A written space, budget, location and timing brief",
    "Property search, including verified off-market introductions where available",
    "Net effective rent comparisons for shortlisted premises",
    "Commercial negotiation of rent, incentives and material lease terms",
    "Lease review alongside your solicitor",
    "A critical dates calendar for the life of the lease",
  ],
  // Only enter genuine, confirmed standalone prices here. Empty rows are hidden.
  standaloneValues: [] as { name: string; value: number; tiers: string[] }[],
  licence:
    "Tenant representation is provided by Joseph Kelley, Class 2 Licensed Real Estate Agent (NSW Licence No. 20565455), under the supervision of Gavin Coulson, Licensee in Charge, Property By RJB Pty Ltd t/as Elders Advantage Group (Licence 10100265, ABN 66 600 043 105).",
} as const;
export function packageForArea(area: number) {
  if (area > TENANT_OFFER.customArea) return "custom";
  return area < TENANT_OFFER.packages[0].maxArea
    ? "gold"
    : area < TENANT_OFFER.packages[1].maxArea
      ? "platinum"
      : "diamond";
}
export function feeForTier(tier: string) {
  return (
    TENANT_OFFER.packages.find((p) => p.id === tier)?.fee ??
    TENANT_OFFER.packages[0].fee
  );
}
export function extrasValue(tier: string) {
  return TENANT_OFFER.standaloneValues
    .filter(
      (v) => v.tiers.includes(tier) && Number.isFinite(v.value) && v.value > 0,
    )
    .reduce((sum, v) => sum + v.value, 0);
}
