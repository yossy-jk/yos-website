# Tenant representation start payment

## Customer journey

Select Gold, Platinum or Diamond, review the package and one-off start payment at `/tenant-rep/start?package=platinum`, acknowledge the payment summary, then continue to Stripe-hosted Checkout. Stripe collects individual name, business name, email and payment details. Phone and lease upload are not required; billing address is collected only when Stripe needs it. No customer account or long questionnaire is required. The free Lease Health Check remains available.

The implementation currently follows the already approved website pricing: AUD $500 ex GST plus $50 GST = $550 paid today. This GST treatment must be confirmed before enabling live collection. The $500 ex GST is credited against the selected package fee; the balance is due on signed Heads of Agreement. There is no subscription, saved future-payment authority or automatic balance charge. Payment is an onboarding start payment; scope and the agency agreement are arranged privately before representation begins. Public legal/agency documents are not added.

## Account connection and activation

No Stripe account credentials are committed. The checkout remains disabled without all configuration and an explicit enable flag. Existing package buttons continue to the free Health Check until payment is configured.

Set these **server-side** in the Vercel project `yos-website`:

- `STRIPE_SECRET_KEY`: the matching sandbox or live API key; never use a `NEXT_PUBLIC_` variable.
- `STRIPE_WEBHOOK_SECRET`: signing secret for the endpoint in that same account/mode.
- `STRIPE_TENANT_GST_RATE_ID`: active Australian exclusive 10% GST rate (`txr_...`).
- Existing `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
- Existing `RESEND_API_KEY` for live owner and customer confirmations.

For a public preview/sandbox deployment, use sandbox keys and `STRIPE_TENANT_TEST_ENABLED=true`. Production keys are rejected in previews; sandbox keys cannot enable production payments. Test orders use separate Redis keys and never send real emails. If Vercel deployment protection is enabled, the preview webhook must have an approved public webhook path or a separate public sandbox deployment; do not disable project-wide protection merely for this test.

For production, first confirm GST treatment and complete sandbox verification. Set live keys/rate/signing secret and `STRIPE_TENANT_PAYMENTS_ENABLED=true`, then redeploy. Environment changes alone do not update statically rendered package-card availability. Do not claim live payments work until a real account Checkout session, customer receipt and signed callback have been verified. Testing does not require charging a real card.

Create a Stripe webhook destination at:

`https://www.yourofficespace.au/api/tenant-payments/webhook`

Listen for `checkout.session.completed` and `checkout.session.async_payment_succeeded`; match the installed Stripe SDK's API version. The server verifies the raw-body signature, retrieves the session directly from Stripe and checks payment status, amount, GST, AUD currency, package metadata and its stored order reference. Unrelated payments are ignored. Refunds already present on a payment prevent a fresh paid notification.

Optional account setup helper (creates tax rate/webhook only, never a charge): securely supply `STRIPE_SECRET_KEY` through the local environment and run `node scripts/setup-tenant-stripe.mjs` for test mode, or append `--live` for live mode. Test mode additionally needs `STRIPE_TENANT_WEBHOOK_URL` pointing to the public HTTPS sandbox deployment. The helper writes the new webhook secret and tax-rate ID to an owner-only temporary file outside the repository and prints only its path; transfer those values securely to Vercel and delete the file. Existing signing secrets cannot be read back through Stripe's API. The helper does not set activation flags or change receipt/email settings.

## Delivery and records

Only a Stripe-verified paid session can produce paid confirmation. A returned success URL is not proof of payment. The return page shows pending/error/refunded states and tells the payer not to pay again while verification is unresolved. If email delivery fails after verified payment, the return page still identifies the payment as received while Stripe retries the notification.

A branded owner notification goes to `jk@yourofficespace.au` with reply-to set to the payer. A branded customer acknowledgement lists package, paid amount/GST, credited amount and remaining fee. No marketing consent is inferred. These acknowledgements are not labelled tax invoices; account-level Stripe tax-invoice/receipt settings and merchant details should be configured in the actual account if those documents are needed.

Redis stores only the internal order/reference, package/price snapshot, acknowledgement version, timestamps, Stripe session ID and delivery flags. Unpaid records expire after seven days. Paid delivery records are retained for reconciliation/deduplication and contain no card or customer contact data; Stripe remains the payment record. Card details never pass through YOS. No HubSpot dependency or YOS OS sync is introduced. A future OS adapter can use the order ID as an external reference and retrieve confirmed customer details from Stripe.

The receipt page is noindex, has no-referrer metadata, returns no contact/card data from its status API, and is excluded from optional analytics. APIs are rate-limited and do not cache payment status. Duplicate clicks reuse an order/Checkout session; webhook and return-page fulfilment share a lock and separate owner/customer delivery flags.

## Verification before activation

Use Stripe sandbox test cards, not real card information. Verify a successful payment, cancelled checkout, declined card, any authentication flow, duplicate clicks, reloads, invalid signatures, wrong mode/amount, email retry and customer/owner confirmation. Confirm each package's credited and remaining fees. Then verify live configuration and the hosted checkout page without submitting a real payment. Rollback: set `STRIPE_TENANT_PAYMENTS_ENABLED=false` and redeploy. Existing paid-session webhook processing remains active so disabling new checkouts does not discard completed payments.

Primary implementation guidance: [Stripe Checkout name collection](https://docs.stripe.com/payments/checkout/name-collection), [Checkout fulfilment and signed webhooks](https://docs.stripe.com/checkout/fulfillment).
