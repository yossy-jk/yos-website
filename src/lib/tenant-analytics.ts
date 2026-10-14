"use client";
import { TENANT_OFFER } from "./tenant-offer";
import { trackConversion } from "./analytics";
export function trackTenantEvent(
  name: string,
  parameters: Record<string, string | number | boolean | undefined> = {},
) {
  if (
    !TENANT_OFFER.approvedForPublication ||
    typeof window === "undefined" ||
    !["www.yourofficespace.au", "yourofficespace.au"].includes(
      window.location.hostname,
    )
  )
    return;
  trackConversion(name, parameters);
}
