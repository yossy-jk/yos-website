"use client";
import { useEffect } from "react";
export const TENANT_ATTRIBUTION_KEY = "yos_tenant_attribution";
export default function TenantAttribution() {
  useEffect(() => {
    try {
      const query = new URLSearchParams(location.search);
      const campaign = Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign", "utm_content"].map(
          (key) => [key, (query.get(key) || "").slice(0, 150)],
        ),
      );
      const previous = JSON.parse(
        sessionStorage.getItem(TENANT_ATTRIBUTION_KEY) || "null",
      );
      if (!previous || Object.values(campaign).some(Boolean))
        sessionStorage.setItem(
          TENANT_ATTRIBUTION_KEY,
          JSON.stringify({ ...campaign, landingPage: location.pathname }),
        );
    } catch {
      /* The enquiry works when session storage is unavailable. */
    }
  }, []);
  return null;
}
