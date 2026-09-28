import { jsPDF } from "jspdf";
import type { PlannerItem } from "./store";

interface QuotePDFParams {
  name: string;
  email: string;
  company?: string;
  items: PlannerItem[];
  recommendations: string[];
}

export function generateQuotePDF({
  name,
  email,
  company,
  items,
  recommendations,
}: QuotePDFParams): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  const teal = "#00B5A5";
  const nearBlack = "#1A1A1A";
  const midGrey = "#6B6B6B";

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

  let y = margin;

  // Header bar
  doc.setFillColor(teal);
  doc.rect(0, 0, pageW, 18, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor("#FFFFFF");
  doc.text("Space Planner", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#FFFFFF");
  doc.text("Powered by Your Office Space — yourofficespace.au", pageW - margin, 12, {
    align: "right",
  });

  y = 30;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(nearBlack);
  doc.text("Office Layout Quote", margin, y);

  y += 8;

  // Prepared for
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(midGrey);
  const dateStr = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Prepared for: ${name}${company ? ` — ${company}` : ""}`, margin, y);
  y += 6;
  doc.text(`Email: ${email}`, margin, y);
  y += 6;
  doc.text(`Date: ${dateStr}`, margin, y);
  y += 10;

  // Divider
  doc.setDrawColor(teal);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Table header
  const colWidths = [80, 20, 30, 30];
  const cols = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]];

  doc.setFillColor(nearBlack);
  doc.rect(margin, y - 5, contentW, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#FFFFFF");
  doc.text("Item", cols[0] + 2, y);
  doc.text("Qty", cols[1] + 2, y);
  doc.text("Unit Price", cols[2] + 2, y);
  doc.text("Total", cols[3] + 2, y);

  y += 6;

  // Table rows
  doc.setFont("helvetica", "normal");
  let rowAlt = false;
  for (const item of lineItems) {
    if (rowAlt) {
      doc.setFillColor("#F7F6F4");
      doc.rect(margin, y - 4, contentW, 7, "F");
    }
    rowAlt = !rowAlt;

    doc.setTextColor(nearBlack);
    doc.setFontSize(9);
    doc.text(item.name, cols[0] + 2, y);
    doc.text(String(item.qty), cols[1] + 2, y);
    doc.text(`$${item.price.toLocaleString("en-AU")}`, cols[2] + 2, y);
    doc.text(`$${item.total.toLocaleString("en-AU")}`, cols[3] + 2, y);
    y += 7;
  }

  // Totals
  y += 4;
  doc.setDrawColor("#DDDDDD");
  doc.setLineWidth(0.3);
  doc.line(cols[2], y, pageW - margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(midGrey);
  doc.text("Subtotal (ex GST)", cols[2] + 2, y);
  doc.text(`$${subtotal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`, cols[3] + 2, y);
  y += 6;

  doc.text("GST (10%)", cols[2] + 2, y);
  doc.text(`$${gst.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`, cols[3] + 2, y);
  y += 6;

  doc.setFillColor(teal);
  doc.rect(cols[2] - 2, y - 5, contentW - colWidths[0] - colWidths[1] + 4, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor("#FFFFFF");
  doc.text("Total (inc GST)", cols[2] + 2, y);
  doc.text(`$${total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`, cols[3] + 2, y);
  y += 12;

  // Recommendations
  if (recommendations.length > 0) {
    doc.setFillColor(teal);
    doc.rect(margin, y - 5, contentW, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor("#FFFFFF");
    doc.text("Smart Recommendations", margin + 2, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(nearBlack);
    for (const rec of recommendations) {
      doc.setFontSize(9);
      doc.text(`- ${rec}`, margin + 2, y);
      y += 6;
    }
    y += 4;
  }

  // Footer
  const footerY = 282;
  doc.setDrawColor("#DDDDDD");
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(midGrey);
  doc.text(
    "This quote is an estimate only. Contact YOS for a confirmed project quote.",
    margin,
    footerY
  );
  doc.text(
    "yourofficespace.au  |  0434 655 511",
    pageW - margin,
    footerY,
    { align: "right" }
  );

  const filename = `space-planner-quote-${name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;
  doc.save(filename);
}
