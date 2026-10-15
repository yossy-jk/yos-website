/** Account setup only; never creates a charge. Run with a securely supplied Stripe key. */
import Stripe from "stripe";
import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const mode = process.argv.includes("--live") ? "live" : "test";
const key = process.env.STRIPE_SECRET_KEY;
if (!key || !new RegExp(`^(sk|rk)_${mode}_`).test(key))
  throw Error(
    `Supply the ${mode} account key through STRIPE_SECRET_KEY, not a command argument.`,
  );
const stripe = new Stripe(key);
const account = await stripe.accounts.retrieve();
if (account.country !== "AU")
  throw Error(
    "Check the selected account: this integration expects the YOS Australian Stripe account.",
  );
if (mode === "live" && !account.charges_enabled)
  throw Error("Live charges are not enabled on this Stripe account.");
const endpointUrl =
  process.env.STRIPE_TENANT_WEBHOOK_URL ||
  "https://www.yourofficespace.au/api/tenant-payments/webhook";
const target = new URL(endpointUrl);
if (
  mode === "live" &&
  endpointUrl !== "https://www.yourofficespace.au/api/tenant-payments/webhook"
)
  throw Error("Live webhooks must use the production YOS endpoint.");
if (
  target.protocol !== "https:" ||
  !target.pathname.endsWith("/api/tenant-payments/webhook")
)
  throw Error("Supply a public HTTPS sandbox/preview webhook URL.");
if (mode === "test" && target.hostname === "www.yourofficespace.au")
  throw Error(
    "Use the public HTTPS preview deployment for sandbox webhook delivery, not production.",
  );
const rates = await stripe.taxRates.list({ active: true, limit: 100 });
let rate = rates.data.find(
  (r) => !r.inclusive && r.percentage === 10 && r.country === "AU",
);
if (!rate)
  rate = await stripe.taxRates.create(
    {
      display_name: "GST",
      percentage: 10,
      inclusive: false,
      country: "AU",
      description: "Australian GST on YOS tenant representation start payments",
    },
    { idempotencyKey: "yos-tenant-gst-exclusive-v1" },
  );
const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
const existing = endpoints.data.find(
  (e) => e.url === endpointUrl && e.status === "enabled",
);
if (existing && !process.env.STRIPE_WEBHOOK_SECRET)
  throw Error(
    "This endpoint already exists. Retrieve its signing secret securely from Stripe; it cannot be recovered through the API.",
  );
const endpoint =
  existing ||
  (await stripe.webhookEndpoints.create(
    {
      url: endpointUrl,
      enabled_events: [
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
      ],
      api_version: Stripe.API_VERSION,
      description: `YOS tenant representation start payments (${mode})`,
    },
    {
      idempotencyKey: `yos-tenant-webhook-${mode}-${createHash("sha256").update(endpointUrl).digest("hex")}`,
    },
  ));
const directory = mkdtempSync(join(tmpdir(), "yos-stripe-setup-"));
chmodSync(directory, 0o700);
const output = join(directory, "stripe-settings.env");
writeFileSync(
  output,
  `STRIPE_TENANT_GST_RATE_ID=${rate.id}\nSTRIPE_WEBHOOK_SECRET=${endpoint.secret || process.env.STRIPE_WEBHOOK_SECRET}\n`,
  { mode: 0o600 },
);
console.log(
  `Account setup prepared in ${mode} mode for account ${account.id}. No payment was taken.`,
);
console.log(
  `Private configuration saved to ${output}. Transfer it to the matching Vercel environment securely, then remove the temporary file.`,
);
console.log(
  "Online payments remain disabled until the matching activation flag is set and the deployment is tested.",
);
