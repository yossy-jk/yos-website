import { aud, type TenantPaymentQuote } from "./tenant-payment-rules";
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function tenantPaymentReceipt(
  name: string,
  quote: TenantPaymentQuote,
  reference: string,
) {
  const lines = [
    `Hi ${name},`,
    `Your ${quote.name} start payment has been received.`,
    `Paid today: ${aud(quote.total)} AUD, including ${aud(quote.gst)} GST.`,
    `${aud(quote.startExGst)} ex GST is credited towards your ${quote.name} package fee of ${aud(quote.feeExGst)} ex GST.`,
    `Remaining package fee: ${aud(quote.balanceExGst)} ex GST, due on signed Heads of Agreement. It has not been charged.`,
    "The YOS team will contact you to confirm your brief, scope and private agency agreement before tenant representation begins.",
    "You do not need to complete the Lease Health Check again. If you want to share your lease or plans now, you can use https://www.yourofficespace.au/lease-health-check. Uploading a lease is optional.",
    `Payment reference: ${reference}`,
    "Questions? Reply to this email or call 02 4092 0733.",
    "Your Office Space",
  ];
  return {
    text: lines.join("\n\n"),
    html: `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#F5F5F5;font-family:Arial,Helvetica,sans-serif;color:#1A1A1A"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:white;border-top:6px solid #00B5A5"><tr><td style="padding:28px;background:#1A1A1A;color:white"><p style="color:#00B5A5;letter-spacing:2px;font-size:12px">YOUR OFFICE SPACE</p><h1 style="font-size:26px">Your start payment is received.</h1></td></tr><tr><td style="padding:28px">${lines.map((line) => `<p style="font-size:15px;line-height:24px;overflow-wrap:anywhere">${escape(line)}</p>`).join("")}<a href="https://www.yourofficespace.au/lease-health-check" style="display:inline-block;background:#00796D;color:white;padding:14px;text-decoration:none;border-radius:4px">Share your lease and plans</a></td></tr></table></td></tr></table></body></html>`,
  };
}
