"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { usePlannerStore } from "@/lib/space-planner/store";
import { getSmartRecommendations } from "@/components/space-planner/QuotePanel";
import { generateQuotePDF } from "@/lib/space-planner/pdf";
import toast from "react-hot-toast";

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
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const recommendations = getSmartRecommendations(items);

  const aggregated = new Map<string, { name: string; price: number; qty: number; total: number }>();
  for (const item of items) {
    const existing = aggregated.get(item.productId);
    if (existing) {
      existing.qty += 1;
      existing.total += item.price;
    } else {
      aggregated.set(item.productId, { name: item.name, price: item.price, qty: 1, total: item.price });
    }
  }
  const lineItems = Array.from(aggregated.values());
  const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0);
  const total = subtotal * 1.1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      // Generate PDF
      generateQuotePDF({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        items,
        recommendations,
      });

      // Capture lead
      try {
        await fetch("/api/space-planner-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            company: company.trim(),
            phone: phone.trim(),
            items: lineItems,
            subtotal,
            total,
            recommendations,
          }),
        });
      } catch {
        // Lead capture failure is non-fatal
      }

      toast.success("Your quote PDF has been downloaded.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Could not generate your quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full text-sm px-3 py-2 rounded-lg border outline-none transition-colors";
  const inputStyle = {
    borderColor: "#E5E5E5",
    fontFamily: "Montserrat, sans-serif",
    color: "#1A1A1A",
    background: "#FFFFFF",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26, 26, 26, 0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-2xl"
        style={{ background: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #E5E5E5" }}>
          <h2 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>
            Your quote is ready
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: "#6B6B6B" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Summary */}
          <div className="rounded-lg p-3 text-sm" style={{ background: "#F7F6F4" }}>
            <span style={{ color: "#6B6B6B" }}>
              {items.length} item{items.length !== 1 ? "s" : ""} — Total:{" "}
            </span>
            <span className="font-bold" style={{ color: "#00B5A5" }}>
              ${total.toLocaleString("en-AU", { minimumFractionDigits: 2 })} inc GST
            </span>
          </div>

          {/* Fields */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#1A1A1A" }}>
              Name <span style={{ color: "#00B5A5" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#1A1A1A" }}>
              Email <span style={{ color: "#00B5A5" }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#1A1A1A" }}>
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name (optional)"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#1A1A1A" }}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (optional)"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Email checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: "#00B5A5" }}
            />
            <span className="text-sm" style={{ color: "#3D3D3D" }}>
              Send me the PDF by email
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim()}
            className="w-full py-3 text-sm font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#00B5A5",
              color: "#FFFFFF",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {loading ? "Generating..." : "Generate Quote"}
          </button>
        </form>
      </div>
    </div>
  );
}
