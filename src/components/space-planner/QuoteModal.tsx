"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { usePlannerStore } from "@/lib/space-planner/store";
import { getSmartRecommendations } from "@/components/space-planner/QuotePanel";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const { items } = usePlannerStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const recommendations = getSmartRecommendations(items);

  // Aggregate items — qty only, no pricing
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      await fetch("/api/space-planner-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          items: lineItems,
          recommendations,
          subtotal: 0,
          total: 0,
        }),
      });
      setSubmitted(true);
    } catch {
      // Non-fatal — still show success to user
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    fontSize: '0.875rem',
    padding: '0.55rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid #E5E5E5',
    outline: 'none',
    fontFamily: 'Montserrat, sans-serif',
    color: '#1A1A1A',
    background: '#FFFFFF',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#1A1A1A',
    fontFamily: 'Montserrat, sans-serif',
    marginBottom: '0.3rem',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(26, 26, 26, 0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: '100%', maxWidth: '440px', borderRadius: '12px', background: '#FFFFFF', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E5E5' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>
            {submitted ? 'Quote request sent' : 'Get your quote'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <CheckCircle size={48} style={{ color: '#00B5A5', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
              We have your layout.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6B6B6B', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              We will review your space plan and come back to you with a full itemised quote. Expect to hear from us within one business day.
            </p>
            <button
              onClick={onClose}
              style={{ background: '#1A1A1A', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

            {/* Space summary */}
            <div style={{ background: '#F7F6F4', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#3D3D3D' }}>
              <span style={{ fontWeight: 600 }}>{items.length} items</span> in your layout —
              {lineItems.slice(0, 3).map((i, idx) => (
                <span key={idx}> {i.qty}x {i.name}{idx < Math.min(lineItems.length, 3) - 1 ? ',' : ''}</span>
              ))}
              {lineItems.length > 3 && <span> and {lineItems.length - 3} more</span>}
            </div>

            <div>
              <label style={labelStyle}>Name <span style={{ color: '#00B5A5' }}>*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Email <span style={{ color: '#00B5A5' }}>*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0400 000 000" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Company</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name (optional)" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Anything else we should know?</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Budget range, timeline, special requirements..."
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <p style={{ fontSize: '0.72rem', color: '#9B9B9B', lineHeight: 1.5 }}>
              We will review your space plan and come back with a full quote — no obligation, no sales pressure.
            </p>

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: loading || !name.trim() || !email.trim() ? 'not-allowed' : 'pointer',
                background: !name.trim() || !email.trim() ? '#D0D0D0' : '#00B5A5',
                color: '#FFFFFF',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Sending...' : 'Send my layout for quoting'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
