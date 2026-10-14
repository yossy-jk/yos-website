import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";
import ts from "typescript";
import { reviewText } from "./check-tenant-offer.mjs";
function load(file, mocks = {}, extra = {}) {
  const sandboxModule = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      exports: sandboxModule.exports,
      module: sandboxModule,
      require: (n) => {
        if (n in mocks) return mocks[n];
        throw Error(n);
      },
      Date,
      Intl,
      Number,
      Object,
      JSON,
      Array,
      Math,
      Error,
      Set,
      process,
      Request,
      Response,
      AbortSignal,
      fetch,
      console,
      ...extra,
    },
  );
  return sandboxModule.exports;
}
const offer = load("src/lib/tenant-offer.ts"),
  calc = load("src/lib/tenant-calculations.ts", { "./tenant-offer": offer }),
  leads = load("src/lib/tenant-leads.ts", {
    "./tenant-offer": offer,
    "./tenant-calculations": calc,
  });
test("incomplete CMS records cannot break tenant guidance cards or redirects", () => {
  const content = load("src/lib/tenant-content.ts");
  const records = content.tenantPublicPosts([null, "text", {}, { slug: "broken" }, { slug: "../api/health", title: "Bad path" }, { slug: "valid-guide", title: "  Approved guide  " }]);
  assert.equal(JSON.stringify(records), JSON.stringify([{ slug: "valid-guide", title: "Approved guide" }]));
  assert.equal(content.tenantPublicPosts({}).length, 0);
});
test("guarantee examples reproduce the written baseline and cap refunds at fees paid", () => {
  const a = {
      area: 250,
      rent: 320,
      years: 5,
      review: 0,
      rentFree: 2,
      contribution: 0,
      makeGood: 0,
    },
    b = { ...a, rent: 305, rentFree: 6, contribution: 25000 };
  const saving = calc.leaseCost(a).effective - calc.leaseCost(b).effective;
  assert.equal(Math.round(saving), 68542);
  assert.equal(calc.guaranteeResult(6950, saving, 5, 80000).refund, 0);
  const c = { ...a, area: 120, rent: 350, years: 3, rentFree: 1 },
    d = { ...c, rent: 340, rentFree: 2 };
  assert.equal(calc.leaseCost(c).effective - calc.leaseCost(d).effective, 6900);
  assert.equal(calc.guaranteeResult(4400, 6900, 3, 42000).refund, 1900);
  assert.equal(calc.guaranteeResult(4400, 0, 3, 42000).refund, 4400);
  assert.equal(calc.guaranteeResult(4400, -100, 3, 42000).refund, 4400);
  assert.equal(calc.guaranteeResult(4400, 0, 2, 42000).multiple, 1);
  assert.equal(calc.guaranteeResult(4400, 0, 3, 39999).multiple, 1);
  assert.equal(calc.guaranteeResult(4400, 0, 3, 40000).multiple, 2);
  assert.equal(calc.guaranteeResult(4400, 0, 3, 42000, false).refund, 0);
});
test("lease estimates independently match whole-term rent, reviews, outgoings and incentives", () => {
  const cases = [
    {
      area: 100,
      rent: 300,
      years: 3,
      review: 0,
      rentFree: 0,
      contribution: 0,
      makeGood: 0,
    },
    {
      area: 250,
      rent: 320,
      years: 5,
      review: 3,
      rentFree: 6,
      contribution: 25000,
      makeGood: 12000,
      outgoings: 40,
      people: 20,
    },
    {
      area: 75,
      rent: 220,
      years: 2,
      review: 4,
      rentFree: 1,
      contribution: 4000,
      makeGood: 3000,
    },
  ];
  for (const i of cases) {
    let expected = 0;
    for (let y = 0; y < i.years; y++)
      expected +=
        i.area *
        (i.rent + (i.outgoings || 0)) *
        Math.pow(1 + i.review / 100, y);
    expected -= (i.rentFree * i.area * i.rent) / 12 + i.contribution;
    expected += i.makeGood;
    assert.ok(Math.abs(calc.leaseCost(i).effective - expected) < 1e-8);
  }
  assert.throws(() => calc.leaseCost({ ...cases[0], area: 0 }));
  assert.throws(() => calc.leaseCost({ ...cases[0], years: 1.5 }));
  assert.throws(() => calc.leaseCost({ ...cases[0], rentFree: 100 }));
  assert.equal(calc.timeCost(200, 2, 60), 24000);
  assert.throws(() => calc.timeCost(100, 1.5, 20));
});
test("dates clamp month ends, preserve leap years, and create exclusive all-day calendar events", () => {
  assert.equal(calc.addMonths("2024-02-29", 12), "2025-02-28");
  assert.equal(calc.addMonths("2026-01-31", 1), "2026-02-28");
  assert.throws(() => calc.addMonths("2026-02-30", 1));
  const dates = calc.criticalDates("2026-10-14", 3, 3, 6, 3, 1);
  assert.ok(
    dates.some((d) => d.date === "2029-04-14" && d.label.includes("opens")),
  );
  assert.ok(
    dates.some((d) => d.date === "2029-07-14" && d.label.includes("closes")),
  );
  const overridden = calc.criticalDates(
    "2026-10-14",
    3,
    3,
    6,
    3,
    1,
    "2029-10-13",
  );
  assert.ok(
    overridden.some(
      (d) => d.date === "2029-04-13" && d.label.includes("opens"),
    ),
  );
  const ics = calc.calendarIcs(dates);
  assert.ok(
    ics.includes("DTSTART;VALUE=DATE:20290414\r\nDTEND;VALUE=DATE:20290415"),
  );
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, dates.length);
  assert.throws(() => calc.criticalDates("2026-10-14", 3, 3, 2, 6, 1));
  assert.equal(calc.urgencyBand("", "2026-10-14").band, "Check");
  assert.equal(calc.urgencyBand("2028-10-14", "2026-10-14").band, "Start");
  assert.equal(calc.urgencyBand("2027-10-14", "2026-10-14").band, "Urgent");
  assert.equal(calc.urgencyBand("2027-04-14", "2026-10-14").band, "Critical");
  assert.equal(calc.urgencyBand("2026-12-01", "2026-10-14").band, "Critical");
  assert.equal(calc.urgencyBand("2029-10-14", "2026-10-14").band, "Plan");
  assert.equal(
    calc.responseTaskDue(new Date("2026-10-16T05:30:00Z")),
    "2026-10-18T23:30:00.000Z",
  );
});
test("package boundaries, unconfirmed value suppression and copy guard", () => {
  assert.equal(offer.packageForArea(149), "gold");
  assert.equal(offer.packageForArea(150), "platinum");
  assert.equal(offer.packageForArea(400), "diamond");
  assert.equal(offer.packageForArea(1000), "diamond");
  assert.equal(offer.packageForArea(1001), "custom");
  assert.equal(offer.extrasValue("diamond"), 0);
  assert.equal(reviewText("A planted — dash").length, 1);
  assert.equal(reviewText("Innovative solutions").length, 2);
  assert.equal(reviewText("Clear lease comparisons.").length, 0);
});
test("lead validation requires referral permission and recalculates emailed estimates server-side", () => {
  const health = {
    kind: "health_check",
    fields: {
      name: "QA",
      email: "qa@example.invalid",
      business: "Test",
      mobile: "0400000000",
      suburb: "Newcastle",
      intent: "buy",
    },
    marketingConsent: false,
  };
  const lead = leads.validateTenantLead(health);
  assert.equal(lead.fields.intent, "buy");
  assert.equal(lead.consent.marketing, false);
  assert.ok(lead.consent.wording.includes("unsubscribe"));
  assert.throws(() =>
    leads.validateTenantLead({
      ...health,
      fields: { ...health.fields, email: "bad" },
    }),
  );
  assert.throws(() =>
    leads.validateTenantLead({
      kind: "referral",
      fields: {
        name: "QA",
        email: "qa@example.invalid",
        referredBusiness: "Test",
        referredName: "Client",
        referredPhone: "0400000000",
      },
      referralPermission: false,
    }),
  );
  assert.equal(
    leads.validateTenantLead({
      kind: "results",
      fields: { name: "QA", email: "qa@example.invalid" },
      tool: "time_cost",
      results: { hourly: 100, leaders: 2, hours: 20, claimedResult: 1 },
    }).calculated.estimatedTimeCost,
    4000,
  );
});

test("preview requests cannot reach email or CRM; a wrong portal prevents CRM writes", async () => {
  let external = 0;
  const mocks = {
    "next/server": {
      NextResponse: {
        json: (body, options = {}) =>
          new Response(JSON.stringify(body), { status: options.status || 200 }),
      },
    },
    "node:crypto": { createHash },
    "@upstash/redis": {
      Redis: class {
        async set() {
          return "OK";
        }
        async get() {
          return null;
        }
        async del() {}
      },
    },
    resend: { Resend: class {} },
    "@/lib/ratelimit": { contactLimiter: () => null, getIp: () => "" },
    "@/lib/tenant-leads": leads,
    "@/lib/tenant-offer": { ...offer, TENANT_OFFER: { ...offer.TENANT_OFFER, approvedForPublication: false } },
    "@/lib/tenant-calculations": calc,
    "@/lib/constants": { HUBSPOT: { bookingUrl: "https://example.invalid" } },
  };
  const body = {
    kind: "health_check",
    fields: {
      name: "QA",
      email: "qa@example.invalid",
      business: "Test",
      mobile: "0400000000",
      suburb: "Newcastle",
      intent: "stay",
    },
    submissionId: "12345678-1234-1234-1234-123456789abc",
  };
  const request = () =>
    new Request("http://localhost/api/tenant-lead", {
      method: "POST",
      body: JSON.stringify(body),
    });
  const route = load("src/app/api/tenant-lead/route.ts", mocks, {
    fetch: async () => {
      external++;
      return Response.json({ hubId: 1 });
    },
  });
  assert.equal((await (await route.POST(request())).json()).preview, true);
  assert.equal(external, 0);
  const approved = {
    ...offer,
    TENANT_OFFER: { ...offer.TENANT_OFFER, approvedForPublication: true },
  };
  const live = load(
    "src/app/api/tenant-lead/route.ts",
    { ...mocks, "@/lib/tenant-offer": approved },
    {
      process: {
        env: {
          RESEND_API_KEY: "test",
          HUBSPOT_TOKEN: "test",
          UPSTASH_REDIS_REST_URL: "https://example.invalid",
          UPSTASH_REDIS_REST_TOKEN: "test",
          VERCEL_ENV: "production",
        },
      },
      fetch: async () => {
        external++;
        return Response.json({ hubId: 1 });
      },
    },
  );
  assert.equal((await live.POST(request())).status, 503);
  assert.equal(external, 1);
});
test("partial delivery resumes without duplicate deals, alerts or receipts", async () => {
  const records = new Map(),
    counts = { deal: 0, alert: 0, client: 0, task: 0 };
  let failAlert = true;
  class Redis {
    async set(k, v, options = {}) {
      if (options.nx && records.has(k)) return null;
      records.set(k, structuredClone(v));
      return "OK";
    }
    async get(k) {
      return records.get(k) || null;
    }
    async del(k) {
      records.delete(k);
    }
  }
  class Resend {
    emails = {
      send: async (data) => {
        if (Array.isArray(data.to)) {
          counts.alert++;
          if (failAlert) {
            failAlert = false;
            return { error: { message: "Temporary" }, data: null };
          }
        } else counts.client++;
        return { data: { id: "accepted" }, error: null };
      },
    };
  }
  const approved = {
    ...offer,
    TENANT_OFFER: { ...offer.TENANT_OFFER, approvedForPublication: true },
  };
  const route = load(
    "src/app/api/tenant-lead/route.ts",
    {
      "next/server": {
        NextResponse: {
          json: (b, o = {}) =>
            new Response(JSON.stringify(b), { status: o.status || 200 }),
        },
      },
      "node:crypto": { createHash },
      "@upstash/redis": { Redis },
      resend: { Resend },
      "@/lib/ratelimit": { contactLimiter: () => null, getIp: () => "" },
      "@/lib/tenant-leads": leads,
      "@/lib/tenant-offer": approved,
      "@/lib/tenant-calculations": calc,
      "@/lib/constants": { HUBSPOT: { bookingUrl: "https://example.invalid" } },
    },
    {
      process: {
        env: {
          RESEND_API_KEY: "test",
          HUBSPOT_TOKEN: "test",
          UPSTASH_REDIS_REST_URL: "https://example.invalid",
          UPSTASH_REDIS_REST_TOKEN: "test",
          VERCEL_ENV: "production",
        },
      },
      fetch: async (url) => {
        if (url.includes("access-token-info"))
          return Response.json({ hubId: 442709765 });
        if (url.endsWith("/deals")) {
          counts.deal++;
          return Response.json({ id: "deal1" });
        }
        if (url.endsWith("/tasks")) {
          counts.task++;
          return Response.json({ id: "task1" });
        }
        return Response.json({ id: "contact1" });
      },
    },
  );
  const body = {
    kind: "health_check",
    fields: {
      name: "QA",
      email: "qa@example.invalid",
      business: "Test",
      mobile: "0400000000",
      suburb: "Newcastle",
      intent: "buy",
    },
    submissionId: "12345678-1234-1234-1234-123456789abc",
  };
  const request = () =>
    new Request("http://localhost/api/tenant-lead", {
      method: "POST",
      body: JSON.stringify(body),
    });
  assert.equal((await route.POST(request())).status, 502);
  assert.equal(counts.deal, 1);
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(counts.deal, 1);
  assert.equal(counts.alert, 2);
  assert.equal(counts.client, 1);
  assert.equal(counts.task, 1);
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(counts.deal, 1);
  assert.equal(counts.client, 1);
});
