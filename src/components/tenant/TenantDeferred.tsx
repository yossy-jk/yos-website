"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TimeCalculator = dynamic(
  () => import("./TenantCalculators").then((module) => module.TimeCalculator),
  { ssr: false, loading: () => <p role="status">Preparing your calculator...</p> },
);
const HealthCheck = dynamic(() => import("./TenantLeadForm"), {
  ssr: false,
  loading: () => <p role="status">Preparing your Health Check...</p>,
});

// Only the landing page's off-screen tools are deferred. Dedicated tool and
// enquiry pages keep their full first render and remain direct link targets.
export default function TenantDeferred({ kind }: { kind: "time" | "health" }) {
  const region = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = region.current;
    if (!target || visible) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "450px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <div
      ref={region}
      data-tenant-deferred={kind}
      style={{ minHeight: kind === "time" ? 430 : 760 }}
    >
      {visible ? (
        kind === "time" ? <TimeCalculator compact /> : <HealthCheck />
      ) : (
        <Link
          className="tenant-button"
          href={kind === "time" ? "/tools/time-cost-calculator" : "/lease-health-check"}
        >
          {kind === "time" ? "Open the time cost calculator" : "Start your free Lease Health Check"}
        </Link>
      )}
    </div>
  );
}
