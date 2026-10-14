import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
const require = createRequire(process.cwd() + "/package.json"),
  pp = require("puppeteer"),
  axe = require("axe-core");
const base = process.env.QA_BASE || "http://127.0.0.1:3121",
  out = process.env.QA_OUT || "../output/tenant-rep-client-journey/local";
mkdirSync(out, { recursive: true });
const executablePath = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]
  .filter(Boolean)
  .find(existsSync);
const browser = await pp.launch({
  headless: true,
  pipe: true,
  timeout: 60000,
  ...(executablePath ? { executablePath } : {}),
  args: ["--no-sandbox"],
});
const report = [];
const routes = [
  "/tenant-rep",
  "/tenant-rep/packages",
  "/tenant-rep/guarantee",
  "/lease-health-check",
  "/tools/lease-cost-calculator",
  "/tools/time-cost-calculator",
  "/tools/critical-dates",
  "/lease-checklist",
  "/refer",
  "/insights/lease-costs",
  "/tenant-rep/newcastle",
  "/thank-you/health-check",
];
try {
  for (const width of [390, 1440]) {
    const p = await browser.newPage();
    await p.setCacheEnabled(false);
    await p.setViewport({ width, height: 950 });
    await p.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    const posts = [];
    const fallbacks = [];
    let failure = false;
    let unavailable = false;
    let unavailableStatus = 503;
    let fallbackFailure = false;
    await p.setRequestInterception(true);
    p.on("request", async (r) => {
      const u = new URL(r.url());
      if (r.method() === "POST") {
        if (u.pathname === "/api/tenant-enquiry-email") {
          fallbacks.push(JSON.parse(r.postData()));
          await r.respond({ status: fallbackFailure || failure ? 502 : 200, contentType: "application/json", body: JSON.stringify({ ok: !fallbackFailure && !failure }) });
          return;
        }
        if (u.pathname === "/api/tenant-lead")
          posts.push(JSON.parse(r.postData()));
        await r.respond({
          status: unavailable ? unavailableStatus : failure ? 502 : 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: !failure && !unavailable, preview: !unavailable }),
        });
      } else if (
        /google-analytics|googletagmanager|hubspot|hs-scripts|hs-analytics/.test(
          u.hostname,
        )
      )
        await r.abort();
      else await r.continue();
    });
    for (const route of routes) {
      const res = await p.goto(base + route, { waitUntil: "networkidle2" });
      assert.equal(res.status(), 200, route);
      assert.equal(await p.$$eval("h1", (x) => x.length), 1, route);
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 2,
        ),
        route + " overflow",
      );
      assert.ok(await p.$("main#main-content"));
      assert.ok(
        !(await p.$eval("main", (e) => e.textContent)).includes("Most chosen"),
      );
      if (!route.startsWith("/thank-you/"))
        assert.equal(
          await p.$eval('link[rel="canonical"]', (e) => e.href),
          "https://www.yourofficespace.au" + route,
        );
      await p.addScriptTag({ content: axe.source });
      const violations = await p.evaluate(async () =>
        (
          await axe.run(document.querySelector("main"), {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
            },
          })
        ).violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      );
      assert.deepEqual(violations, [], route);
      report.push({ route, width, axeViolations: 0, overflow: false });
      if (
        ["/tenant-rep", "/tenant-rep/packages", "/lease-health-check"].includes(
          route,
        )
      )
        await p.screenshot({
          path: out + "/" + route.replaceAll("/", "_") + "-" + width + ".png",
        });
    }
    await p.goto(base + "/tenant-rep", { waitUntil: "networkidle2" });
    assert.equal(await p.$('[data-tenant-deferred="time"] input'), null);
    assert.equal(await p.$('[data-tenant-deferred="health"] input'), null);
    await p.$eval('[data-tenant-deferred="time"]', (e) => e.scrollIntoView({ block: "center" }));
    await p.waitForSelector("#hourly-true");
    await p.click("#hourly-true", { clickCount: 3 });
    await p.type("#hourly-true", "200");
    await p.click('[data-tenant-deferred="time"] form button[type=submit]');
    await p.waitForSelector('[data-tenant-deferred="time"] .tenant-result-main');
    assert.equal(await p.$eval('[data-tenant-deferred="time"] .tenant-result-main', e => e.textContent), "$12,000");
    await p.$eval('[data-tenant-deferred="health"]', (e) => e.scrollIntoView({ block: "center" }));
    await p.waitForSelector("#health_check-email");
    assert.ok(await p.$('[data-tenant-deferred="health"] form input[name="business"]'));
    await p.addScriptTag({ content: axe.source });
    assert.deepEqual(await p.evaluate(async () => (await axe.run(document.querySelector("main"))).violations.map(v => v.id)), []);
    await p.goto(base + "/tenant-rep/packages", { waitUntil: "networkidle2" });
    await p.type("#tenant-area", "250");
    assert.equal(
      await p.$eval(".tenant-package.is-selected h3", (e) => e.textContent),
      "Platinum",
    );
    assert.ok((await p.$eval("main", (e) => e.textContent)).includes("$6,950"));
    await p.goto(base + "/tools/time-cost-calculator", {
      waitUntil: "networkidle2",
    });
    await p.$eval("#hourly-false", (e) =>
      e.scrollIntoView({ block: "center" }),
    );
    await p.click("#hourly-false", { clickCount: 3 });
    await p.type("#hourly-false", "200");
    await p.click("form button[type=submit]");
    await p.waitForSelector(".tenant-result-main");
    assert.equal(
      await p.$eval(".tenant-result-main", (e) => e.textContent),
      "$12,000",
    );
    assert.equal(posts.length, 0);
    await p.goto(base + "/tools/lease-cost-calculator", {
      waitUntil: "networkidle2",
    });
    await p.click("form button[type=submit]");
    await p.waitForSelector(".tenant-result-main");
    assert.equal(
      await p.$eval(".tenant-result-main", (e) => e.textContent),
      "$386,667",
    );
    assert.equal(posts.length, 0);
    await p.goto(base + "/tools/critical-dates", { waitUntil: "networkidle2" });
    await p.evaluate(() => {
      const e = document.querySelector("#lease-start");
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set;
      setter.call(e, "2026-10-14");
      e.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await p.click("form button[type=submit]");
    await p.waitForSelector('a[download="yos-lease-dates.ics"]');
    const href = await p.$eval(
      'a[download="yos-lease-dates.ics"]',
      (e) => e.href,
    );
    assert.ok(decodeURIComponent(href).includes("DTSTART;VALUE=DATE:20290414"));
    await p.goto(base + "/tenant-rep/guarantee", { waitUntil: "networkidle2" });
    await p.click("form button[type=submit]");
    await p.waitForFunction(() =>
      [...document.querySelectorAll("dd")].some(
        (e) => e.textContent === "$68,542",
      ),
    );
    assert.ok(
      (await p.$eval("main", (e) => e.textContent)).includes(
        "capped at the fee paid",
      ),
    );
    await p.goto(
      base +
        "/lease-health-check?utm_source=linkedin&utm_campaign=lease-costs&package=platinum",
      { waitUntil: "networkidle2" },
    );
    await p.type("#health_check-name", "QA Owner");
    await p.type("#health_check-email", "qa@example.invalid");
    await p.type("#health_check-business", "QA Business");
    await p.type("#health_check-mobile", "0400000000");
    await p.type("#health_check-suburb", "Newcastle");
    await p.click("form button[type=submit]");
    await p.waitForFunction(() => document.activeElement.tagName === "LEGEND");
    assert.ok(
      (await p.$eval("main", (e) => e.textContent)).includes("Step 2 of 3"),
    );
    await p.select("#health-intent", "buy");
    await p.click("form button[type=submit]");
    await p.waitForFunction(() =>
      document.body.innerText.includes("Step 3 of 3"),
    );
    assert.equal(
      await p.$$eval(
        "input[type=checkbox]",
        (els) => els.filter((e) => e.checked).length,
      ),
      0,
    );
    failure = true;
    await p.click("form button[type=submit]");
    await p.waitForSelector("[role=alert]");
    assert.ok(await p.$("form"));
    failure = false;
    await p.click("form button[type=submit]");
    await p.waitForFunction(() =>
      document
        .querySelector('h3[tabindex="-1"]')
        ?.textContent.includes("Preview completed"),
    );
    assert.equal(posts.at(-1).fields.intent, "buy");
    assert.equal(posts.at(-1).marketingConsent, false);
    assert.equal(posts.at(-1).attribution.utm_source, "linkedin");
    assert.equal(posts.at(-1).attribution.package, "platinum");
    assert.ok(posts.at(-1).submissionId);
    assert.equal(posts.at(-1).submissionId, posts.at(-2).submissionId);
    assert.equal(await p.evaluate(() => document.activeElement.tagName), "H3");
    await p.screenshot({
      path: out + "/health-check-complete-" + width + ".png",
    });
    assert.equal(await p.$eval(".tenant-mobile-cta", e => getComputedStyle(e).display), "none", "The floating action must not cover receipt controls");
    await p.click(".tenant-results button");
    await p.waitForSelector("form button[type=submit]");
    unavailable = true;
    fallbackFailure = true;
    await p.click("form button[type=submit]");
    await p.waitForSelector("[role=alert]");
    assert.ok(await p.$("form"), "Email failure must preserve the enquiry");
    assert.equal(fallbacks.at(-1).email, "qa@example.invalid");
    assert.equal(JSON.parse(fallbacks.at(-1).message).marketingConsent, false);
    fallbackFailure = false;
    await p.click("form button[type=submit]");
    await p.waitForFunction(() => document.querySelector('h3[tabindex="-1"]')?.textContent.includes("Your request was received"));
    assert.ok(fallbacks.at(-1).source.includes("CRM follow-up required"));
    await p.click(".tenant-results button");
    await p.waitForSelector("form button[type=submit]");
    unavailableStatus = 502;
    await p.click("form button[type=submit]");
    await p.waitForFunction(() => document.querySelector('h3[tabindex="-1"]')?.textContent.includes("Your request was received"));
    unavailable = false;
    await p.goto(base + "/refer", { waitUntil: "networkidle2" });
    await p.type("#referral-name", "QA Referrer");
    await p.type("#referral-email", "qa@example.invalid");
    await p.type("#referral-referredBusiness", "Referred Business");
    await p.type("#referral-referredName", "Referred Contact");
    await p.type("#referral-referredPhone", "0400000000");
    const before = posts.length;
    await p.click("form button[type=submit]");
    assert.equal(posts.length, before);
    await p.click("input[type=checkbox][required]");
    await p.click("form button[type=submit]");
    await p.waitForFunction(() =>
      document
        .querySelector('h3[tabindex="-1"]')
        ?.textContent.includes("Preview completed"),
    );
    assert.equal(posts.at(-1).referralPermission, true);
    await p.close();
  }
  const p = await browser.newPage();
  await p.goto(base + "/sitemap.xml");
  const sitemap = await p.content();
  assert.ok(sitemap.includes("/tenant-rep/packages"));
  const draft = await p.goto(base + "/insights/lease-costs/cost-of-diy-office-search");
  assert.equal(draft.status(), 404, "Unpublished article templates must not go live");
  writeFileSync(
    out + "/report.json",
    JSON.stringify(
      {
        routes: report,
        checkedForms: true,
        deferredLandingTools: true,
        deliveryFailurePreserved: true,
        emailFallbackConfirmed: true,
        utmCapture: true,
        buyingIntent: true,
        marketingDefaultFalse: true,
        referralPermissionRequired: true,
        calculatorsUngated: true,
        icsCalendarVerified: true,
        publishedRoutesInSitemap: true,
        articleDraftsExcluded: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS 12 routes at mobile/desktop: metadata, axe, overflow, packages, ungated tools, calendar, guarantee example, health steps/focus/retry/UTM/consent and referral permission. All POSTs mocked.",
  );
} finally {
  await browser.close();
}
