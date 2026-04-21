"use client";

import { usePlannerStore } from "@/lib/space-planner/store";

export function getSmartRecommendations(items: ReturnType<typeof usePlannerStore.getState>["items"]): string[] {
  const recs: string[] = [];

  const desks = items.filter((i) => i.category === "Desks");
  const chairs = items.filter((i) => i.category === "Seating");
  const meetingTables = items.filter((i) => i.category === "Meeting" && i.name.toLowerCase().includes("table"));
  const storage = items.filter((i) => i.category === "Storage");
  const breakout = items.filter((i) => i.category === "Breakout");
  const workstations = items.filter((i) => i.category === "Desks");

  if (desks.length > 0 && chairs.length === 0) {
    recs.push(`Add seating — you have ${desks.length} desk${desks.length > 1 ? "s" : ""} but no chairs`);
  }

  if (meetingTables.length > 0 && chairs.length < 4) {
    recs.push("Meeting rooms typically need 1 chair per seat");
  }

  if (workstations.length >= 8 && storage.length === 0) {
    recs.push("Consider adding storage — 1 pedestal per workstation is standard");
  }

  const totalPeople = chairs.length + workstations.length;
  if (totalPeople >= 10 && breakout.length === 0) {
    recs.push("A breakout zone improves team wellbeing and productivity");
  }

  return recs;
}

interface QuotePanelProps {
  onGetQuote: () => void;
}

export default function QuotePanel({ onGetQuote }: QuotePanelProps) {
  const { items } = usePlannerStore();

  // Aggregate items by productId
  const aggregated = new Map<
    string,
    { name: string; price: number; qty: number; total: number }
  >();
  for (const item of items) {
    const existing = aggregated.get(item.productId);
    if (existing) {
      existing.qty += 1;
      existing.total += item.price;
    } else {
      aggregated.set(item.productId, {
        name: item.name,
        price: item.price,
        qty: 1,
        total: item.price,
      });
    }
  }
  const lineItems = Array.from(aggregated.values());
  const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const recommendations = getSmartRecommendations(items);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#FAFAFA", borderLeft: "1px solid #E5E5E5" }}>
      {/* Header */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid #E5E5E5" }}>
        <h2 className="text-sm font-bold" style={{ color: "#1A1A1A", fontFamily: "Montserrat, sans-serif" }}>
          Your Quote
        </h2>
        <p className="text-xs mt-1" style={{ color: "#6B6B6B", fontFamily: "Montserrat, sans-serif" }}>
          {items.length} item{items.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Item list */}
        {lineItems.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
            Drag furniture onto the canvas to start your quote
          </p>
        ) : (
          <div className="space-y-1">
            {/* Table header */}
            <div className="grid text-xs font-semibold pb-1" style={{
              gridTemplateColumns: "1fr auto auto",
              gap: "8px",
              color: "#6B6B6B",
              fontFamily: "Montserrat, sans-serif",
              borderBottom: "1px solid #E5E5E5",
              paddingBottom: "6px",
            }}>
              <span>Item</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Total</span>
            </div>
            {lineItems.map((item, i) => (
              <div
                key={i}
                className="grid text-xs py-1"
                style={{
                  gridTemplateColumns: "1fr auto auto",
                  gap: "8px",
                  fontFamily: "Montserrat, sans-serif",
                  borderBottom: "1px solid #F0F0F0",
                  paddingBottom: "6px",
                }}
              >
                <div>
                  <p style={{ color: "#1A1A1A", fontWeight: 500 }}>{item.name}</p>
                  <p style={{ color: "#9B9B9B" }}>${item.price.toLocaleString("en-AU")} ea</p>
                </div>
                <span className="text-right self-center" style={{ color: "#3D3D3D" }}>{item.qty}</span>
                <span className="text-right self-center font-semibold" style={{ color: "#1A1A1A" }}>
                  ${item.total.toLocaleString("en-AU")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {lineItems.length > 0 && (
          <div className="space-y-1 pt-2" style={{ borderTop: "1px solid #E5E5E5" }}>
            <div className="flex justify-between text-xs" style={{ fontFamily: "Montserrat, sans-serif", color: "#6B6B6B" }}>
              <span>Subtotal (ex GST)</span>
              <span>${subtotal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs" style={{ fontFamily: "Montserrat, sans-serif", color: "#6B6B6B" }}>
              <span>GST (10%)</span>
              <span>${gst.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
            </div>
            <div
              className="flex justify-between text-sm font-bold py-2 px-3 rounded-lg mt-2"
              style={{ background: "#1A1A1A", color: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}
            >
              <span>Total (inc GST)</span>
              <span>${total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        {/* Smart recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold" style={{ color: "#1A1A1A", fontFamily: "Montserrat, sans-serif" }}>
              Recommendations
            </p>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="text-xs p-3 rounded-lg"
                style={{
                  background: "rgba(0, 181, 165, 0.08)",
                  border: "1px solid rgba(0, 181, 165, 0.3)",
                  color: "#1A1A1A",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {rec}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #E5E5E5" }}>
        <button
          onClick={onGetQuote}
          disabled={items.length === 0}
          className="w-full py-3 text-sm font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: items.length > 0 ? "#00B5A5" : "#9B9B9B",
            color: "#FFFFFF",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Get my quote PDF
        </button>
        {items.length === 0 && (
          <p className="text-xs text-center mt-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
            Place at least one item to generate a quote
          </p>
        )}
      </div>
    </div>
  );
}
