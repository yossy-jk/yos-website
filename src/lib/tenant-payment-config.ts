import { TENANT_PAYMENT_ORIGIN } from "./tenant-payment-rules";
/** Server only: never pass credentials to a client component. */
export function tenantPaymentRuntime(env: NodeJS.ProcessEnv = process.env) {
  const production = env.VERCEL_ENV === "production";
  const mode = production ? "live" : "test";
  let origin = production ? TENANT_PAYMENT_ORIGIN : "";
  if (!production) {
    try {
      const candidate = new URL(env.STRIPE_TENANT_TEST_ORIGIN || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : ""));
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(candidate.hostname);
      if (!candidate.username && !candidate.password && candidate.pathname === "/" && !candidate.search && !candidate.hash &&
          ((candidate.protocol === "https:" && candidate.hostname.endsWith(".vercel.app")) || (local && candidate.protocol === "http:"))) origin = candidate.origin;
    } catch { /* A sandbox needs its own explicit or Vercel-generated return origin. */ }
  }
  const key = env.STRIPE_SECRET_KEY || "";
  const keyMatches = production
    ? /^(sk|rk)_live_/.test(key)
    : /^(sk|rk)_test_/.test(key);
  const configured =
    !!origin &&
    keyMatches &&
    !!env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") &&
    /^txr_[a-zA-Z0-9]+$/.test(env.STRIPE_TENANT_GST_RATE_ID || "") &&
    !!env.UPSTASH_REDIS_REST_URL &&
    !!env.UPSTASH_REDIS_REST_TOKEN &&
    (production ? !!env.RESEND_API_KEY : true);
  return {
    configured,
    origin,
    mode,
    enabled:
      configured &&
      (production
        ? env.STRIPE_TENANT_PAYMENTS_ENABLED === "true"
        : env.STRIPE_TENANT_TEST_ENABLED === "true"),
    prefix: `${env.VERCEL_ENV === "preview" ? "preview:" : ""}yos:tenant-payment:${mode}`,
  };
}
