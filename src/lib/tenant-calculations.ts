import { TENANT_OFFER } from "./tenant-offer";
export type LeaseInputs = {
  area: number;
  rent: number;
  years: number;
  review: number;
  rentFree: number;
  contribution: number;
  makeGood: number;
  outgoings?: number;
  people?: number;
};
export function leaseCost(i: LeaseInputs) {
  if (
    ![
      i.area,
      i.rent,
      i.years,
      i.review,
      i.rentFree,
      i.contribution,
      i.makeGood,
      i.outgoings ?? 0,
      i.people ?? 0,
    ].every(Number.isFinite) ||
    i.area <= 0 ||
    i.rent < 0 ||
    !Number.isInteger(i.years) ||
    i.years < 1 ||
    i.years > 30 ||
    i.review < 0 ||
    i.review > 100 ||
    i.rentFree < 0 ||
    i.rentFree > i.years * 12 ||
    i.contribution < 0 ||
    i.makeGood < 0 ||
    (i.outgoings ?? 0) < 0 ||
    (i.people ?? 0) < 0
  )
    throw new Error(
      "Check your inputs. Use a whole initial lease term and non-negative amounts.",
    );
  const base = i.area * (i.rent + (i.outgoings ?? 0));
  const factor = Array.from(
    { length: i.years },
    (_, y) => (1 + i.review / 100) ** y,
  ).reduce((a, b) => a + b, 0);
  const totalRent = base * factor,
    rentFreeValue = (i.rentFree * i.area * i.rent) / 12;
  const incentives = rentFreeValue + i.contribution,
    effective = totalRent - incentives + i.makeGood;
  return {
    totalRent,
    incentives,
    effective,
    perSqm: effective / (i.area * i.years),
    incentivePercent: totalRent ? (incentives / totalRent) * 100 : 0,
    perPerson: i.people ? effective / (i.people * i.years) : null,
    extraFreeMonth: (i.area * i.rent) / 12,
    tenDollarReduction: i.area * TENANT_OFFER.rentReduction * factor,
  };
}
export function guaranteeResult(
  fee: number,
  savings: number,
  years: number,
  annualGrossRent: number,
  eligible = true,
) {
  if (
    ![fee, savings, years, annualGrossRent].every(Number.isFinite) ||
    fee <= 0 ||
    years <= 0 ||
    annualGrossRent < 0
  )
    throw new Error("Enter valid fee, term and annual rent.");
  const g = TENANT_OFFER.guarantee,
    multiple =
      years >= g.minYears && annualGrossRent >= g.minAnnualRent
        ? g.multiple
        : g.fallbackMultiple;
  return {
    multiple,
    achieved: savings / fee,
    refund: eligible ? Math.min(fee, Math.max(0, multiple * fee - savings)) : 0,
    target: multiple * fee,
  };
}
export function timeCost(hourly: number, leaders: number, hours: number) {
  if (
    ![hourly, leaders, hours].every(Number.isFinite) ||
    hourly < 0 ||
    !Number.isInteger(leaders) ||
    leaders < 1 ||
    hours < 0
  )
    throw new Error("Enter a valid hourly value, number of leaders and hours.");
  return hourly * leaders * hours;
}
export function addMonths(date: string, months: number) {
  const d = new Date(date + "T00:00:00Z");
  if (
    !Number.isFinite(d.getTime()) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    d.toISOString().slice(0, 10) !== date ||
    !Number.isInteger(months)
  )
    throw new Error("Enter a valid calendar date.");
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d.toISOString().slice(0, 10);
}
export function urgencyBand(expiry: string, today = sydneyToday()) {
  if (!expiry)
    return {
      band: "Check",
      message: "Start by finding your expiry and option notice dates.",
    };
  const end = new Date(expiry + "T00:00:00Z");
  if (!Number.isFinite(end.getTime()))
    throw new Error("Enter a valid expiry date.");
  const u = TENANT_OFFER.urgency;
  return expiry > addMonths(today, u.planMonths)
    ? {
        band: "Plan",
        message: "Use this time to plan your next lease decision.",
      }
    : expiry > addMonths(today, u.startMonths)
      ? {
          band: "Start",
          message: "Start comparing renewal and relocation options.",
        }
      : expiry > addMonths(today, u.urgentMonths)
        ? {
            band: "Urgent",
            message: "Check notice dates and start your next steps now.",
          }
        : {
            band: "Critical",
            message:
              "Speak with our team promptly and check any notice deadline with your solicitor.",
          };
}
export type CalendarDate = { date: string; label: string };
export function criticalDates(
  start: string,
  years: number,
  optionYears: number,
  earliest: number,
  latest: number,
  reviewEvery: number,
  expiryOverride = "",
) {
  if (
    ![years, optionYears, earliest, latest, reviewEvery].every(
      Number.isInteger,
    ) ||
    years < 1 ||
    years > 30 ||
    optionYears < 0 ||
    optionYears > 30 ||
    earliest < latest ||
    latest < 0 ||
    earliest > years * 12 ||
    reviewEvery < 1
  )
    throw new Error(
      "Check your term, option notice window and review frequency.",
    );
  const expiry = expiryOverride
      ? addMonths(expiryOverride, 0)
      : addMonths(start, years * 12),
    dates: CalendarDate[] = [
      {
        date: expiry,
        label: expiryOverride
          ? "Lease expiry entered from your agreement"
          : "Estimated anniversary expiry: confirm against your lease",
      },
    ];
  for (let y = reviewEvery; y < years; y += reviewEvery)
    dates.push({
      date: addMonths(start, y * 12),
      label: "Rent review: confirm the lease wording",
    });
  if (optionYears > 0) {
    dates.push(
      {
        date: addMonths(expiry, -earliest),
        label: "Estimated option notice window opens",
      },
      {
        date: addMonths(expiry, -latest),
        label: "Estimated option notice window closes",
      },
      {
        date: addMonths(expiry, optionYears * 12),
        label: "Option term expiry: if validly exercised",
      },
    );
  }
  return dates.sort((a, b) => a.date.localeCompare(b.date));
}
export function calendarIcs(dates: CalendarDate[]) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YOS//Lease dates//EN",
    "CALSCALE:GREGORIAN",
    ...dates.flatMap((d, i) => [
      "BEGIN:VEVENT",
      `UID:yos-${d.date}-${i}@yourofficespace.au`,
      "DTSTAMP:20261014T000000Z",
      `DTSTART;VALUE=DATE:${d.date.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${new Date(new Date(d.date + "T00:00:00Z").getTime() + 86400000).toISOString().slice(0, 10).replaceAll("-", "")}`,
      `SUMMARY:${d.label}`,
      "DESCRIPTION:Estimated lease date. Confirm against your signed lease.",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function responseTaskDue(now = new Date()) {
  let cursor = now.getTime(),
    minutes = TENANT_OFFER.delivery.taskBusinessHours * 60;
  const format = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  });
  while (minutes > 0) {
    const parts = Object.fromEntries(
      format.formatToParts(new Date(cursor)).map((p) => [p.type, p.value]),
    );
    if (
      !["Sat", "Sun"].includes(parts.weekday) &&
      Number(parts.hour) >= 9 &&
      Number(parts.hour) < 17
    )
      minutes--;
    cursor += 60000;
  }
  return new Date(cursor).toISOString();
}

export function sydneyToday(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
