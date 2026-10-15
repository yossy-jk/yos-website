/** Server only: never pass credentials to a client component. */
export function tenantPaymentRuntime(env: NodeJS.ProcessEnv = process.env) {
  const production = env.VERCEL_ENV === "production";
  const mode = production ? "live" : "test";
  const key = env.STRIPE_SECRET_KEY || "";
  const keyMatches = production
    ? /^(sk|rk)_live_/.test(key)
    : /^(sk|rk)_test_/.test(key);
  const configured =
    keyMatches &&
    !!env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") &&
    /^txr_[a-zA-Z0-9]+$/.test(env.STRIPE_TENANT_GST_RATE_ID || "") &&
    !!env.UPSTASH_REDIS_REST_URL &&
    !!env.UPSTASH_REDIS_REST_TOKEN &&
    (production ? !!env.RESEND_API_KEY : true);
  return {
    configured,
    mode,
    enabled:
      configured &&
      (production
        ? env.STRIPE_TENANT_PAYMENTS_ENABLED === "true"
        : env.STRIPE_TENANT_TEST_ENABLED === "true"),
    prefix: `${env.VERCEL_ENV === "preview" ? "preview:" : ""}yos:tenant-payment:${mode}`,
  };
}
