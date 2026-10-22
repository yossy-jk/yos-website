"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { aud } from "@/lib/tenant-payment-rules";
type Status = {
  status?: "paid" | "pending" | "refunded";
  tier?: string;
  packageName?: string;
  amount?: number;
  balanceExGst?: number;
  notificationPending?: boolean;
  testMode?: boolean;
};
export default function TenantPaymentStatus({
  sessionId,
}: {
  sessionId: string;
}) {
  const [result, setResult] = useState<Status | null>(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    fetch(
      `/api/tenant-payments/status?session_id=${encodeURIComponent(sessionId)}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const data = await response.json();
        if (active) {
          if (!response.ok)
            setError(
              data.error ||
                "Payment could not be verified yet. Please contact YOS before paying again.",
            );
          else {
            setError("");
            setResult(data);
            if (data.status === 'paid') {
              try { window.localStorage.setItem('yos_checklist_offer_converted', '1'); } catch {}
              window.dispatchEvent(new Event('yos-enquiry-completed'));
            }
          }
        }
      })
      .catch(() => {
        if (active)
          setError(
            "We could not verify the payment yet. Do not pay again; retry this page or call YOS.",
          );
      });
    return () => {
      active = false;
    };
  }, [sessionId, attempt]);
  return (
    <div
      className="tenant-form-box tenant-results tenant-payment-status"
      aria-live="polite"
    >
      {error ? (
        <>
          <h2>Let’s check your payment.</h2>
          <p role="alert">{error}</p>
          <button
            className="tenant-button"
            onClick={() => {
              setError("");
              setAttempt(attempt + 1);
            }}
          >
            Check payment again
          </button>
        </>
      ) : result?.status === "paid" ? (
        <>
          <h2>Your start payment is received.</h2>
          {result.packageName && (
            <p>
              {result.packageName} package · {aud(result.amount!)} AUD paid,
              including GST.
            </p>
          )}
          <p>
            {result.testMode
              ? "Test payment verified. No real charge or customer email was sent."
              : result.notificationPending
                ? "Your payment is verified. Your email confirmation is still being processed; you do not need to pay again."
                : "Your confirmation is on its way. The YOS team will contact you to confirm the brief, scope and private agency agreement."}
          </p>
          {typeof result.balanceExGst === "number" && (
            <p>
              Remaining package fee: {aud(result.balanceExGst)} ex GST, due on
              signed Heads of Agreement. This has not been charged.
            </p>
          )}
          <p>
            You can share your lease and plans when you are ready. Uploading
            your lease is optional.
          </p>
          <Link className="tenant-button" href="/lease-health-check">
            Share your lease and plans
          </Link>
        </>
      ) : result?.status === "refunded" ? (
        <>
          <h2>This payment has a refund recorded.</h2>
          <p>
            Please contact the YOS team to confirm the next step before making
            another payment.
          </p>
        </>
      ) : result?.status === "pending" ? (
        <>
          <h2>Your payment is not confirmed yet.</h2>
          <p>
            Do not pay again while we check. You can retry this page or contact
            YOS.
          </p>
          <button
            className="tenant-button"
            onClick={() => setAttempt(attempt + 1)}
          >
            Check payment again
          </button>
        </>
      ) : (
        <>
          <h2>Checking your payment securely…</h2>
          <p>
            Please keep this page open. We will show confirmation once Stripe
            verifies payment.
          </p>
        </>
      )}
      <p>
        <a href="tel:0240920733">Call 02 4092 0733</a> ·{" "}
        <Link href="/contact?service=leasing#contact-enquiry">
          Contact the YOS team
        </Link>
      </p>
    </div>
  );
}
