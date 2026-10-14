"use client";
import { useState } from "react";
import GuaranteeNote from "./GuaranteeNote";
import Link from "next/link";
import { TENANT_OFFER, packageForArea, extrasValue } from "@/lib/tenant-offer";
import { trackTenantEvent as trackConversion } from "@/lib/tenant-analytics";
const money = (v: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(v);
export default function PackageCards() {
  const [area, setArea] = useState("");
  const suggested =
    area && Number(area) > 0 ? packageForArea(Number(area)) : null;
  return (
    <>
      <div className="tenant-selector">
        <label htmlFor="tenant-area">How big is your space?</label>
        <div>
          <input
            id="tenant-area"
            type="number"
            min="1"
            max="100000"
            inputMode="numeric"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter floor area"
          />
          <span>m²</span>
        </div>
        <p>
          Use this as a starting point. Complexity and scope matter too. At{" "}
          {TENANT_OFFER.packages[0].maxArea} m², compare Platinum; at{" "}
          {TENANT_OFFER.packages[1].maxArea} m², compare Diamond.
        </p>
      </div>
      <div className="tenant-package-grid">
        {TENANT_OFFER.packages.map((p, index) => (
          <article
            key={p.id}
            className={`tenant-package ${suggested === p.id ? "is-selected" : ""}`}
          >
            <p className="tenant-eyebrow">
              {suggested === p.id ? "Suggested for your area" : p.fit}
            </p>
            <h3>{p.name}</h3>
            <p className="tenant-price">
              {money(p.fee)} <span>ex GST</span>
            </p>
            <p className="tenant-payment">
              {money(TENANT_OFFER.startPayment)} to start. Balance on signed
              Heads of Agreement.
            </p>
            <p>
              Balance: {money(p.fee - TENANT_OFFER.startPayment)} ex GST. The
              start payment is part of your fee.
            </p>
            <p>
              {p.maxArea
                ? `${index > 0 ? TENANT_OFFER.packages[index - 1].maxArea + " to below " : "Below "}${p.maxArea} m²`
                : `${TENANT_OFFER.packages[1].maxArea} m² and over`}{" "}
              · {p.inspections} inspections · {p.updates}
            </p>
            <GuaranteeNote />
            <ul>
              <li>All core services below</li>
              {p.extras.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            {TENANT_OFFER.standaloneValues.some((v) =>
              v.tiers.includes(p.id),
            ) && (
              <div>
                <h4>
                  Included on top of the core service, and what it is worth
                </h4>
                {TENANT_OFFER.standaloneValues
                  .filter((v) => v.tiers.includes(p.id) && v.value > 0)
                  .map((v) => (
                    <p key={v.name}>
                      {v.name}: {money(v.value)}
                    </p>
                  ))}
                <p>Total value: {money(extrasValue(p.id))}</p>
                <p>Your fee: {money(p.fee)}</p>
              </div>
            )}
            <Link
              className="tenant-button"
              href={`/lease-health-check?package=${p.id}`}
              onClick={() =>
                trackConversion("package_card_click", { package_tier: p.id })
              }
            >
              Start with a free Lease Health Check
            </Link>
          </article>
        ))}
      </div>
      <aside
        className={`tenant-custom ${suggested === "custom" ? "is-selected" : ""}`}
      >
        <h3>
          Multi-site, industrial or over{" "}
          {TENANT_OFFER.customArea.toLocaleString("en-AU")} m²?
        </h3>
        <p>We will agree the scope and price after a call with our team.</p>
        <Link
          className="tenant-button"
          href="/lease-health-check?package=custom"
        >
          Book a clarity call
        </Link>
      </aside>
      <p className="tenant-small">
        Fees are ex GST. Final scope and fee are set out in your agency
        agreement.
      </p>
    </>
  );
}
