"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  aud,
  tenantPaymentQuote,
  TENANT_PAYMENT_TERMS,
  type TenantPackageId,
} from "@/lib/tenant-payment-rules";
export default function TenantStartPayment({
  initialPackage,
  available,
  testMode,
  cancelled,
}: {
  initialPackage: TenantPackageId;
  available: boolean;
  testMode: boolean;
  cancelled: boolean;
}) {
  const [tier, setTier] = useState(initialPackage),
    [acknowledged, setAcknowledged] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const reference = useRef<{ tier: string; id: string } | null>(null);
  const quote = tenantPaymentQuote(tier);
  async function start(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !available || !acknowledged) return;
    setBusy(true);
    setError("");
    const key = `yos-tenant-start:${tier}`;
    try {
      if (!reference.current || reference.current.tier !== tier) {
        let cached = null;
        try {
          cached = sessionStorage.getItem(key);
        } catch {
          /* Browser storage is optional. */
        }
        reference.current = {
          tier,
          id:
            cached && /^[a-f0-9-]{36}$/i.test(cached)
              ? cached
              : crypto.randomUUID(),
        };
        try {
          sessionStorage.setItem(key, reference.current.id);
        } catch {
          /* The in-memory reference still protects retries. */
        }
      }
      const response = await fetch("/api/tenant-payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          requestId: reference.current.id,
          acknowledged,
          termsVersion: TENANT_PAYMENT_TERMS,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        if (data.code === "CHECKOUT_EXPIRED") {
          reference.current = null;
          try {
            sessionStorage.removeItem(key);
          } catch {
            /* Optional storage. */
          }
        }
        throw Error(
          data.error ||
            "We could not open checkout. Please retry or contact YOS.",
        );
      }
      const url = new URL(data.url);
      if (
        url.protocol !== "https:" ||
        !["checkout.stripe.com", "www.yourofficespace.au"].includes(
          url.hostname,
        )
      )
        throw Error("Checkout could not be verified. Please contact YOS.");
      window.location.assign(url.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry or contact YOS.");
      setBusy(false);
    }
  }
  return (
    <div className="tenant-two tenant-payment-layout">
      <form
        className="tenant-form-box"
        onSubmit={start}
        aria-label="Tenant representation start payment"
      >
        <h2>Review your start payment.</h2>
        {cancelled && (
          <p role="status">
            You returned from checkout. No new payment has been started here.
            You can return to Stripe or choose a different package.
          </p>
        )}
        {testMode && available && (
          <p className="tenant-note">
            Test checkout only. No real payment will be taken.
          </p>
        )}
        <label htmlFor="start-package">Your package</label>
        <select
          id="start-package"
          value={tier}
          onChange={(event) => {
            setTier(event.target.value as TenantPackageId);
            setAcknowledged(false);
            setError("");
          }}
        >
          <option value="gold">Gold - $4,400 ex GST</option>
          <option value="platinum">Platinum - $6,950 ex GST</option>
          <option value="diamond">Diamond - $9,950 ex GST</option>
        </select>
        <dl className="tenant-payment-summary">
          <div>
            <dt>Start payment</dt>
            <dd>{aud(quote.startExGst)} ex GST</dd>
          </div>
          <div>
            <dt>GST</dt>
            <dd>{aud(quote.gst)}</dd>
          </div>
          <div className="tenant-payment-total">
            <dt>Pay securely today (including GST)</dt>
            <dd>{aud(quote.total)} AUD</dd>
          </div>
          <div>
            <dt>Remaining package fee</dt>
            <dd>{aud(quote.balanceExGst)} ex GST</dd>
          </div>
        </dl>
        <p className="tenant-small">
          The remaining fee is due on signed Heads of Agreement. Final scope and
          package are confirmed with YOS before representation begins.
        </p>
        {available ? (
          <>
            <label className="tenant-checkbox">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                required
              />
              <span>
                I understand this is a one-off start payment towards my selected
                package. YOS will arrange my agency agreement privately before
                tenant representation begins.
              </span>
            </label>
            {error && (
              <p role="alert" className="tenant-error">
                {error}
              </p>
            )}
            <button
              className="tenant-button"
              type="submit"
              disabled={busy || !acknowledged}
            >
              {busy
                ? "Opening secure checkout…"
                : `Continue to Stripe - ${aud(quote.total)} AUD`}
            </button>
            <p className="tenant-small">
              Stripe processes your payment details securely. Your payment does
              not opt you into marketing.
            </p>
          </>
        ) : (
          <div className="tenant-note">
            <p>
              Online payment is being connected. Start with a free Lease Health
              Check and we will help you get underway.
            </p>
            <Link
              className="tenant-button"
              href={`/lease-health-check?package=${tier}`}
            >
              Start with a free Lease Health Check
            </Link>
          </div>
        )}
      </form>
      <div>
        <p className="tenant-eyebrow">
          Choose. Pay securely. We take it from there.
        </p>
        <h2>A simple start to your next lease.</h2>
        <ol className="tenant-checklist">
          <li>Choose the package that fits your business.</li>
          <li>
            Enter your name, business name, email and payment details securely
            with Stripe.
          </li>
          <li>
            Receive confirmation. Our team will contact you to confirm the
            brief, scope and private agency agreement.
          </li>
        </ol>
        <p>
          Your start payment forms part of the package fee. The remaining fee is
          due on signed Heads of Agreement and is not charged automatically.
        </p>
        <p>
          You can share your lease, phone number and property requirements with
          the team afterwards. No lease upload or long questionnaire is required
          to pay.
        </p>
        <p>
          Prefer to talk first?{" "}
          <Link href="/lease-health-check">
            Request a free Lease Health Check
          </Link>{" "}
          or <a href="tel:0240920733">call 02 4092 0733</a>.
        </p>
      </div>
    </div>
  );
}
