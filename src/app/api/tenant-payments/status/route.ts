import { tenantPaymentLimiter, getIp } from "@/lib/ratelimit";
import { NextResponse } from "next/server";
import { fulfilTenantPayment, TenantPaymentError } from "@/lib/tenant-payments";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(req: Request) {
  const headers = {
    "Cache-Control": "no-store, private",
    "Referrer-Policy": "no-referrer",
  };
  try {
    const limit = tenantPaymentLimiter("status");
    if (!limit || !(await limit.limit(getIp(req))).success)
      return NextResponse.json(
        {
          error:
            "Please wait before checking again, or contact YOS. Do not pay again.",
        },
        { status: 429, headers },
      );
    return NextResponse.json(
      await fulfilTenantPayment(
        new URL(req.url).searchParams.get("session_id") || "",
      ),
      { headers },
    );
  } catch (error) {
    if (
      error instanceof TenantPaymentError &&
      error.code === "NOTIFICATION_PENDING"
    )
      return NextResponse.json(
        { status: "paid", notificationPending: true },
        { headers },
      );
    return NextResponse.json(
      {
        error:
          "We could not verify the payment yet. Do not pay again; please retry this page or contact YOS.",
      },
      {
        status:
          error instanceof TenantPaymentError && error.status === 400
            ? 400
            : 503,
        headers,
      },
    );
  }
}
