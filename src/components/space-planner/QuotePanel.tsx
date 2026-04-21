"use client";

import { usePlannerStore } from "@/lib/space-planner/store";

export function getSmartRecommendations(items: ReturnType<typeof usePlannerStore.getState>["items"]): string[] {
  const recs: string[] = [];

  const desks = items.filter((i) => i.category === "Desks");
  const chairs = items.filter((i) => i.category === "Seating");
  const meetingTables = items.filter((i) => i.category === "Meeting" && i.name.toLowerCase().includes("table"));
  const storage = items.filter((i) => i.category === "Storage");
  const breakout = items.filter((i) => i.category === "Breakout");

  if (desks.length > 0 && chairs.length === 0) {
    recs.push(`You have ${desks.length} desk${desks.length > 1 ? "s" : ""} but no seating — add chairs`);
  }

  if (meetingTables.length > 0 && chairs.length < 4) {
    recs.push("Meeting rooms typically need 1 chair per seat");
  }

  if (desks.length >= 8 && storage.length === 0) {
    recs.push("Consider adding storage — 1 pedestal per workstation is standard");
  }

  const totalPeople = chairs.length + desks.length;
  if (totalPeople >= 10 && breakout.length === 0) {
    recs.push("A breakout zone makes a big difference for teams of 10+");
  }

  return recs;
}

interface QuotePanelProps {
  onGetQuote: () => void;
}

export default function QuotePanel({ onGetQuote }: QuotePanelProps) {
  const { items } = usePlannerStore();

  // Aggregate items by productId — qty only, no pricing
  const aggregated = new Map<string, { name: string; category: string; qty: number }>();
  for (const item of items) {
    const existing = aggregated.get(item.productId);
    if (existing) {
      existing.qty += 1;
    } else {
      aggregated.set(item.productId, { name: item.name, category: item.category, qty: 1 });
    }
  }
  const lineItems = Array.from(aggregated.values());
  const recommendations = getSmartRecommendations(items);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FAFAFA', borderLeft: '1px solid #E5E5E5' }}>

      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #E5E5E5' }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.2rem' }}>
          Your Space
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>
          {items.length} item{items.length !== 1 ? 's' : ''} placed
        </p>
      </div>

      {/* Item list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem' }}>
        {lineItems.length === 0 ? (
          <p style={{ fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', textAlign: 'center', paddingTop: '1.5rem' }}>
            Drag furniture onto the canvas to build your space
          </p>
        ) : (
          <div>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', paddingBottom: '6px', borderBottom: '1px solid #E5E5E5', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>Item</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', textAlign: 'right' }}>Qty</span>
            </div>

            {lineItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '8px',
                  padding: '6px 0',
                  borderBottom: '1px solid #F0F0F0',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 500, color: '#1A1A1A' }}>{item.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#9B9B9B' }}>{item.category}</p>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#3D3D3D', alignSelf: 'center', textAlign: 'right' }}>
                  {item.qty}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Smart recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Layout tips
            </p>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(0, 181, 165, 0.07)',
                  border: '1px solid rgba(0, 181, 165, 0.25)',
                  color: '#1A1A1A',
                  fontFamily: 'Montserrat, sans-serif',
                  marginBottom: '0.5rem',
                  lineHeight: 1.5,
                }}
              >
                {rec}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '1rem', borderTop: '1px solid #E5E5E5' }}>
        {items.length > 0 && (
          <p style={{ fontSize: '0.72rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.65rem', lineHeight: 1.5 }}>
            Submit your layout and we will come back with a full quote — no obligation.
          </p>
        )}
        <button
          onClick={onGetQuote}
          disabled={items.length === 0}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            cursor: items.length > 0 ? 'pointer' : 'not-allowed',
            background: items.length > 0 ? '#00B5A5' : '#D0D0D0',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            transition: 'background 0.15s',
          }}
        >
          Submit for quote
        </button>
        {items.length === 0 && (
          <p style={{ fontSize: '0.72rem', textAlign: 'center', marginTop: '0.5rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif' }}>
            Place at least one item to continue
          </p>
        )}
      </div>
    </div>
  );
}
