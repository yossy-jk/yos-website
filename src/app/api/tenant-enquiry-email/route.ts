import { NextResponse } from "next/server";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import { POST as sendOwnerEmail } from "../contact/route";

// Keep the emergency email path isolated from production in review deployments,
// even when the primary enquiry endpoint is unavailable before its own guard.
export async function POST(req: Request) {
  if (!TENANT_OFFER.approvedForPublication || process.env.VERCEL_ENV === "preview")
    return NextResponse.json({ ok: true, preview: true });
  return sendOwnerEmail(req);
}
