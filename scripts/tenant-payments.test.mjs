import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import Stripe from "stripe";
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
        if (!(name in mocks)) throw Error(`Unexpected dependency: ${name}`);
        return mocks[name];
      },
      Request,
      Response,
      URL,
      Date,
      JSON,
      process: { env },
    },
  );
  return exports;
}
const offer = load("src/lib/tenant-offer.ts");
const rules = load("src/lib/tenant-payment-rules.ts", {
  "./tenant-offer": offer,
});
const config = load("src/lib/tenant-payment-config.ts");
const receipt = load("src/lib/tenant-payment-receipt.ts", {
  "./tenant-payment-rules": rules,
});
const renderer = load("src/lib/enquiry-email.ts");
const orderId = "12345678-1234-1234-1234-123456789abc";
const env = {
  VERCEL_ENV: "production",
  STRIPE_SECRET_KEY: "sk_live_fixture",
  STRIPE_WEBHOOK_SECRET: "whsec_fixture",
  STRIPE_TENANT_GST_RATE_ID: "txr_fixture",
  STRIPE_TENANT_PAYMENTS_ENABLED: "true",
  RESEND_API_KEY: "fixture",
  UPSTASH_REDIS_REST_URL: "fixture",
  UPSTASH_REDIS_REST_TOKEN: "fixture",
};
const json = {
  NextResponse: { json: (data, options) => Response.json(data, options) },
};
function setup(options = {}) {
  const settings = { ...env, ...options.env };
  const records = new Map(),
    emails = [],
    creates = [];
  let session = {
    id: "cs_live_fixture",
    livemode: true,
    mode: "payment",
    status: "open",
    url: "https://checkout.stripe.com/c/pay/cs_live_fixture",
    payment_status: "unpaid",
    amount_total: 55000,
    amount_subtotal: 50000,
    total_details: { amount_tax: 5000 },
    currency: "aud",
    metadata: {
      yos_flow: rules.TENANT_PAYMENT_FLOW,
      order_id: orderId,
      package: "platinum",
    },
    customer_details: {
      email: "client@example.invalid",
      individual_name: "QA Owner",
      business_name: "QA Business",
    },
    payment_intent: { id: "pi_fixture", latest_charge: { amount_refunded: 0 } },
  };
  const Redis = class {
    async get(key) {
      return structuredClone(records.get(key) || null);
    }
    async set(key, value, opts = {}) {
      if (opts.nx && records.has(key)) return null;
      records.set(key, structuredClone(value));
      return "OK";
    }
    async del(key) {
      records.delete(key);
    }
  };
  const sdk = {
    taxRates: {
      retrieve: async () => ({
        id: "txr_fixture",
        active: true,
        inclusive: options.badTax || false,
        percentage: 10,
        country: "AU",
      }),
    },
    checkout: {
      sessions: {
        create: async (params, opts) => {
          creates.push({ params, opts });
          return structuredClone(session);
        },
        retrieve: async () => structuredClone(session),
      },
    },
    webhooks: Stripe.webhooks,
  };
  const StripeProvider = class {
    constructor() {
      return sdk;
    }
  };
  let customerFail = options.customerFail;
  const payments = load(
    "src/lib/tenant-payments.ts",
    {
      stripe: { default: StripeProvider },
      "@upstash/redis": { Redis },
      resend: {
        Resend: class {
          emails = {
            send: async (message, opts) => {
              emails.push({ message, opts });
              if (customerFail && message.to === "client@example.invalid") {
                customerFail = false;
                return { error: { message: "Temporary" } };
              }
              return { data: { id: "accepted" } };
            },
          };
        },
      },
      "./tenant-payment-config": {
        tenantPaymentRuntime: () => config.tenantPaymentRuntime(settings),
      },
      "./tenant-payment-rules": rules,
      "./enquiry-email": renderer,
      "./tenant-payment-receipt": receipt,
    },
    settings,
  );
  return {
    payments,
    records,
    emails,
    creates,
    sdk,
    settings,
    update: (change) => {
      session = { ...session, ...change };
    },
  };
}

test("server owns amount, currency and package; consent and valid references are required", () => {
  const input = {
    tier: "platinum",
    requestId: orderId,
    acknowledged: true,
    termsVersion: rules.TENANT_PAYMENT_TERMS,
  };
  assert.equal(rules.paymentRequest(input).quote.total, 55000);
  assert.equal(rules.tenantPaymentQuote("platinum").balanceExGst, 645000);
  assert.equal(rules.tenantPaymentQuote("diamond").balanceExGst, 945000);
  for (const bad of [
    { ...input, amount: 1 },
    { ...input, tier: "custom" },
    { ...input, acknowledged: false },
    { ...input, termsVersion: "old" },
    { ...input, requestId: "bad" },
  ])
    assert.throws(() => rules.paymentRequest(bad));
});

test("production never uses sandbox keys and previews never use live keys; activation is explicit", () => {
  assert.equal(config.tenantPaymentRuntime(env).enabled, true);
  for (const patch of [
    { STRIPE_TENANT_PAYMENTS_ENABLED: "false" },
    { STRIPE_SECRET_KEY: "sk_test_fixture" },
    { STRIPE_WEBHOOK_SECRET: "" },
    { STRIPE_TENANT_GST_RATE_ID: "" },
    { UPSTASH_REDIS_REST_TOKEN: "" },
    { RESEND_API_KEY: "" },
  ])
    assert.equal(
      config.tenantPaymentRuntime({ ...env, ...patch }).enabled,
      false,
    );
  assert.equal(
    config.tenantPaymentRuntime({
      ...env,
      VERCEL_ENV: "preview",
      STRIPE_TENANT_TEST_ENABLED: "true",
    }).enabled,
    false,
  );
  assert.equal(
    config.tenantPaymentRuntime({
      ...env,
      VERCEL_ENV: "preview",
      STRIPE_SECRET_KEY: "sk_test_fixture",
      STRIPE_TENANT_TEST_ENABLED: "true",
    }).enabled,
    true,
  );
});

test("double-clicks and retries reuse the checkout; payment details are collected only by Stripe", async () => {
  const { payments, creates } = setup();
  await payments.createTenantCheckout(
    rules.tenantPaymentQuote("platinum"),
    orderId,
  );
  await payments.createTenantCheckout(
    rules.tenantPaymentQuote("platinum"),
    orderId,
  );
  assert.equal(creates.length, 1);
  const { params, opts } = creates[0];
  assert.equal(opts.idempotencyKey, `yos-tenant-start-${orderId}`);
  assert.equal(params.mode, "payment");
  assert.equal(params.line_items[0].price_data.unit_amount, 50000);
  assert.equal(params.line_items[0].price_data.currency, "aud");
  assert.equal(params.line_items[0].tax_rates[0], "txr_fixture");
  assert.equal(params.name_collection.individual.optional, false);
  assert.equal(params.name_collection.business.optional, false);
  assert.equal(params.phone_number_collection.enabled, false);
  assert.equal(params.billing_address_collection, "auto");
  assert.equal(params.payment_intent_data.setup_future_usage, undefined);
  assert.equal(params.subscription_data, undefined);
  assert.ok(params.success_url.startsWith("https://www.yourofficespace.au/"));
});

test("misconfigured tax cannot start checkout and an expired reference cannot start a fresh charge silently", async () => {
  const bad = setup({ badTax: true });
  await assert.rejects(() =>
    bad.payments.createTenantCheckout(
      rules.tenantPaymentQuote("platinum"),
      orderId,
    ),
  );
  assert.equal(bad.creates.length, 0);
  const s = setup();
  await s.payments.createTenantCheckout(
    rules.tenantPaymentQuote("platinum"),
    orderId,
  );
  s.update({ status: "expired", url: null });
  await assert.rejects(
    () =>
      s.payments.createTenantCheckout(
        rules.tenantPaymentQuote("platinum"),
        orderId,
      ),
    (error) => error.code === "CHECKOUT_EXPIRED",
  );
  assert.equal(s.creates.length, 1);
});

test("unpaid, wrong totals, foreign sessions and refunded transactions cannot trigger paid notifications", async () => {
  const cases = [
    { change: {}, expected: "pending" },
    { change: { payment_status: "paid", amount_total: 1 }, rejects: true },
    { change: { payment_status: "paid", currency: "usd" }, rejects: true },
    {
      change: {
        payment_status: "paid",
        metadata: { yos_flow: "another_flow" },
      },
      rejects: true,
    },
    {
      change: {
        payment_status: "paid",
        payment_intent: {
          id: "pi_fixture",
          latest_charge: { amount_refunded: 100 },
        },
      },
      expected: "refunded",
    },
  ];
  for (const entry of cases) {
    const s = setup();
    await s.payments.createTenantCheckout(
      rules.tenantPaymentQuote("platinum"),
      orderId,
    );
    s.update(entry.change);
    if (entry.rejects)
      await assert.rejects(() =>
        s.payments.fulfilTenantPayment("cs_live_fixture"),
      );
    else
      assert.equal(
        (await s.payments.fulfilTenantPayment("cs_live_fixture")).status,
        entry.expected,
      );
    assert.equal(s.emails.length, 0);
  }
});

test("paid notifications retry independently without repeating owner mail or charging the remaining fee", async () => {
  const s = setup({ customerFail: true });
  await s.payments.createTenantCheckout(
    rules.tenantPaymentQuote("platinum"),
    orderId,
  );
  s.update({ payment_status: "paid", status: "complete" });
  await assert.rejects(
    () => s.payments.fulfilTenantPayment("cs_live_fixture"),
    (error) => error.code === "NOTIFICATION_PENDING",
  );
  assert.equal(
    (await s.payments.fulfilTenantPayment("cs_live_fixture")).status,
    "paid",
  );
  assert.equal(
    (await s.payments.fulfilTenantPayment("cs_live_fixture")).status,
    "paid",
  );
  assert.equal(
    s.emails.filter((e) => e.message.to === "jk@yourofficespace.au").length,
    1,
  );
  const customer = s.emails.filter(
    (e) => e.message.to === "client@example.invalid",
  );
  assert.equal(customer.length, 2);
  assert.deepEqual(customer[0], customer[1]);
  assert.match(customer[1].message.text, /\$550/);
  assert.match(customer[1].message.text, /\$6,450/);
  assert.match(customer[1].message.text, /It has not been charged/);
  assert.equal(s.creates.length, 1);
  const stored = JSON.stringify([...s.records.values()]);
  assert.ok(
    !stored.includes("client@example.invalid") &&
      !stored.includes("QA Business"),
  );
});

test("preview paid transactions use isolated keys and send no real emails", async () => {
  const s = setup({
    env: {
      VERCEL_ENV: "preview",
      STRIPE_SECRET_KEY: "sk_test_fixture",
      STRIPE_TENANT_TEST_ENABLED: "true",
    },
  });
  s.update({ id: "cs_test_fixture", livemode: false });
  await s.payments.createTenantCheckout(
    rules.tenantPaymentQuote("platinum"),
    orderId,
  );
  s.update({ payment_status: "paid", status: "complete" });
  const result = await s.payments.fulfilTenantPayment("cs_test_fixture");
  assert.equal(result.testMode, true);
  assert.equal(s.emails.length, 0);
  assert.ok(
    [...s.records.keys()].every((k) =>
      k.startsWith("preview:yos:tenant-payment:test:"),
    ),
  );
});

test("webhook verifies exact raw-body signatures, ignores foreign events, and retries failed delivery", async () => {
  const s = setup();
  let deliveries = 0,
    fail = true;
  const route = load(
    "src/app/api/tenant-payments/webhook/route.ts",
    {
      "next/server": json,
      "@/lib/tenant-payment-rules": rules,
      "@/lib/tenant-payments": {
        paymentServices: () => ({ stripe: s.sdk, runtime: { mode: "live" } }),
        fulfilTenantPayment: async () => {
          deliveries++;
          if (fail) throw Error("Temporary");
          return { status: "paid" };
        },
      },
    },
    env,
  );
  const event = JSON.stringify({
    type: "checkout.session.completed",
    livemode: true,
    data: {
      object: {
        id: "cs_live_fixture",
        metadata: { yos_flow: rules.TENANT_PAYMENT_FLOW },
      },
    },
  });
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload: event,
    secret: env.STRIPE_WEBHOOK_SECRET,
  });
  const request = (body, header) =>
    new Request("https://www.yourofficespace.au/api/tenant-payments/webhook", {
      method: "POST",
      body,
      headers: { "stripe-signature": header },
    });
  assert.equal((await route.POST(request(event, "invalid"))).status, 400);
  assert.equal((await route.POST(request(event + " ", signature))).status, 400);
  assert.equal(deliveries, 0);
  assert.equal((await route.POST(request(event, signature))).status, 503);
  fail = false;
  assert.equal((await route.POST(request(event, signature))).status, 200);
  const foreign = event.replace(rules.TENANT_PAYMENT_FLOW, "unrelated");
  assert.equal(
    (
      await route.POST(
        request(
          foreign,
          Stripe.webhooks.generateTestHeaderString({
            payload: foreign,
            secret: env.STRIPE_WEBHOOK_SECRET,
          }),
        ),
      )
    ).status,
    200,
  );
  assert.equal(deliveries, 2);
});

test("checkout endpoint rejects cross-origin and amount tampering before provider calls", async () => {
  let calls = 0;
  const s = setup();
  const route = load(
    "src/app/api/tenant-payments/checkout/route.ts",
    {
      "next/server": json,
      "@/lib/tenant-payment-rules": rules,
      "@/lib/ratelimit": {
        tenantPaymentLimiter: () => ({
          limit: async () => ({ success: true }),
        }),
        getIp: () => "fixture",
      },
      "@/lib/tenant-payments": {
        ...s.payments,
        createTenantCheckout: async () => {
          calls++;
          return { url: "https://checkout.stripe.com/c/pay/fixture" };
        },
      },
    },
    env,
  );
  const input = {
    tier: "gold",
    requestId: orderId,
    acknowledged: true,
    termsVersion: rules.TENANT_PAYMENT_TERMS,
  };
  const req = (body, origin = "https://www.yourofficespace.au") =>
    new Request("https://www.yourofficespace.au/api/tenant-payments/checkout", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { origin },
    });
  assert.equal(
    (await route.POST(req(input, "https://example.invalid"))).status,
    403,
  );
  assert.equal((await route.POST(req({ ...input, amount: 1 }))).status, 400);
  assert.equal(calls, 0);
  assert.equal((await route.POST(req(input))).status, 200);
  assert.equal(calls, 1);
});

test("verified paid status survives an email outage without suggesting another payment", async () => {
  const s = setup();
  const route = load("src/app/api/tenant-payments/status/route.ts", {
    "next/server": json,
    "@/lib/ratelimit": {
      tenantPaymentLimiter: () => ({ limit: async () => ({ success: true }) }),
      getIp: () => "fixture",
    },
    "@/lib/tenant-payments": {
      ...s.payments,
      fulfilTenantPayment: async () => {
        throw new s.payments.TenantPaymentError(
          "Pending",
          503,
          "NOTIFICATION_PENDING",
        );
      },
    },
  });
  const response = await route.GET(
    new Request(
      "https://www.yourofficespace.au/api/tenant-payments/status?session_id=cs_live_fixture",
    ),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, "paid");
  assert.match(response.headers.get("cache-control"), /no-store/);
});

test("a concurrent receipt worker cannot make the webhook acknowledge undelivered mail", async () => {
  const s = setup();
  await s.payments.createTenantCheckout(
    rules.tenantPaymentQuote("platinum"),
    orderId,
  );
  s.update({ payment_status: "paid", status: "complete" });
  const lock = `yos:tenant-payment:live:order:${orderId}:fulfil-lock`;
  s.records.set(lock, "another-worker");
  const route = load(
    "src/app/api/tenant-payments/webhook/route.ts",
    {
      "next/server": json,
      "@/lib/tenant-payment-rules": rules,
      "@/lib/tenant-payments": s.payments,
    },
    env,
  );
  const payload = JSON.stringify({
    type: "checkout.session.completed",
    livemode: true,
    data: {
      object: {
        id: "cs_live_fixture",
        metadata: { yos_flow: rules.TENANT_PAYMENT_FLOW },
      },
    },
  });
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload,
    secret: env.STRIPE_WEBHOOK_SECRET,
  });
  const request = () =>
    new Request("https://www.yourofficespace.au/api/tenant-payments/webhook", {
      method: "POST",
      body: payload,
      headers: { "stripe-signature": signature },
    });
  assert.equal((await route.POST(request())).status, 503);
  assert.equal(s.emails.length, 0);
  s.records.delete(lock);
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(s.emails.length, 2);
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(s.emails.length, 2);
});

test('disabling new checkouts preserves receipt delivery for payments already completed', async () => {
  const s = setup();
  await s.payments.createTenantCheckout(rules.tenantPaymentQuote('platinum'), orderId);
  s.settings.STRIPE_TENANT_PAYMENTS_ENABLED = 'false';
  s.update({ payment_status: 'paid', status: 'complete' });
  await assert.rejects(() => s.payments.createTenantCheckout(rules.tenantPaymentQuote('platinum'), orderId));
  const paid = await s.payments.fulfilTenantPayment('cs_live_fixture');
  assert.equal(paid.status, 'paid');
  assert.equal(paid.balanceExGst, 645000);
  assert.equal(s.emails.length, 2);
});
