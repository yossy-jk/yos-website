import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function load(file, mocks = {}, env = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      exports,
      require: (name) => {
        if (!(name in mocks)) throw Error(name);
        return mocks[name];
      },
      Request,
      Response,
      URL,
      Date,
      process: { env },
    },
  );
  return exports;
}
const catalogues = load("src/lib/catalogues.ts");
const id = "12345678-1234-1234-1234-123456789abc";
const payload = {
  catalogue: "furniture",
  intent: "discount",
  email: "qa@example.invalid",
  submissionId: id,
  submittedAt: "2026-10-15T00:00:00Z",
};
function setup(options = {}) {
  const owners = [],
    customers = [];
  class FakeResend {
    emails = {
      send: async (data, settings) => {
        customers.push({ data, settings });
        return options.mailFailure
          ? { error: { message: "failure" } }
          : { data: { id: "mock" } };
      },
    };
  }
  const route = load(
    "src/app/api/catalogue-interest/route.ts",
    {
      "next/server": {
        NextResponse: { json: (body, init) => Response.json(body, init) },
      },
      resend: { Resend: FakeResend },
      "@/lib/enquiry-delivery": {
        sendOwnerEnquiry: async (data) => {
          owners.push(data);
          if (options.ownerFailure) throw Error("unavailable");
        },
      },
      "@/lib/ratelimit": {
        getIp: () => "qa",
        voucherLimiter: () => ({
          limit: async () => ({ success: !options.limited }),
        }),
      },
      "@/lib/catalogues": catalogues,
    },
    {
      VERCEL_ENV: options.preview ? "preview" : "production",
      RESEND_API_KEY: "fixture",
    },
  );
  return { ...route, owners, customers };
}
const request = (data = payload, origin = "https://www.yourofficespace.au") =>
  new Request("https://www.yourofficespace.au/api/catalogue-interest", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(data),
  });
test("catalogue submissions reject foreign origins, invalid contacts, tampering and honeypots before mail", async () => {
  const s = setup();
  assert.equal(
    (await s.POST(request(payload, "https://other.invalid"))).status,
    403,
  );
  for (const p of [
    { ...payload, email: "bad" },
    { ...payload, catalogue: "other" },
    { ...payload, intent: "other" },
    { ...payload, _honey: "bot" },
    { ...payload, submissionId: "invalid" },
    { ...payload, intent: "discovery" },
  ])
    assert.equal((await s.POST(request(p))).status, 400);
  assert.equal(s.owners.length + s.customers.length, 0);
});
test("discount requests notify the fixed inbox boundary and email a real fixed offer, without marketing opt-in", async () => {
  const s = setup();
  const r = await s.POST(
    request({ ...payload, discount: 99, code: "tampered" }),
  );
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.match(body.shopUrl, /YOSWELCOME5/);
  assert.equal(s.owners[0].marketingConsent, false);
  assert.equal(s.owners[0].details.discountCode, "YOSWELCOME5");
  assert.equal(s.customers[0].data.to, payload.email);
  assert.match(s.customers[0].data.text, /One use per customer/);
  assert.match(s.customers[0].data.html, /YOSWELCOME5/);
  assert.equal(
    s.customers[0].settings.idempotencyKey,
    `${id}-catalogue-discount`,
  );
});
test("discovery requests send project details to inbox without issuing a discount or claiming a booking", async () => {
  const s = setup();
  const r = await s.POST(
    request({
      ...payload,
      intent: "discovery",
      name: "QA",
      message: "Plan an office",
    }),
  );
  assert.equal(r.status, 200);
  assert.equal(s.owners[0].source, "Project Discovery Session request");
  assert.equal(s.owners[0].message, "Plan an office");
  assert.equal(s.customers.length, 0);
  assert.equal((await r.json()).shopUrl, undefined);
});
test("retries keep stable owner payloads and customer mail idempotency keys", async () => {
  const s = setup();
  await s.POST(request());
  await s.POST(request());
  assert.deepEqual(s.owners[0], s.owners[1]);
  assert.deepEqual(s.customers[0], s.customers[1]);
});
test("rate limits and mail failures never report successful delivery", async () => {
  assert.equal((await setup({ limited: true }).POST(request())).status, 429);
  assert.equal(
    (await setup({ mailFailure: true }).POST(request())).status,
    502,
  );
  assert.equal(
    (await setup({ ownerFailure: true }).POST(request())).status,
    502,
  );
});
test("previews never send real mail and every catalogue page asset exists", async () => {
  const s = setup({ preview: true });
  assert.equal((await (await s.POST(request())).json()).preview, true);
  assert.equal(s.customers.length + s.owners.length, 0);
  for (const c of catalogues.CATALOGUES) {
    assert.equal(
      fs
        .readdirSync(`public/catalogues/${c.id}`)
        .filter((f) => f.endsWith(".jpg")).length,
      c.pages,
    );
    for (let page = 1; page <= c.pages; page++)
      assert.ok(
        fs.existsSync(`public${catalogues.cataloguePageImage(c.id, page)}`),
      );
    assert.ok(
      fs
        .readFileSync(`public${c.pdf}`)
        .subarray(0, 5)
        .equals(Buffer.from("%PDF-")),
    );
  }
});
