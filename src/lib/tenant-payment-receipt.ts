import { DISCOVERY_BOOKING_URL } from "./constants";
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
    `Book your Project Discovery Session: ${DISCOVERY_BOOKING_URL}`,
    "The YOS team will contact you to confirm your brief, scope and private agency agreement before tenant representation begins.",
    "If you have an existing lease, please email a copy to jk@yourofficespace.au before your Project Discovery Session so we can prepare. This is optional; if you do not have a lease to share, you can still book your session.",
    `Payment reference: ${reference}`,
    "Questions? Reply to this email or call 02 4092 0733.",
    "Your Office Space",
  ];
  return {
    text: lines.join("\n\n"),
    html: `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#F5F5F5;font-family:Arial,Helvetica,sans-serif;color:#1A1A1A"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:white;border-top:6px solid #00B5A5"><tr><td style="padding:28px;background:#1A1A1A;color:white"><p style="color:#00B5A5;letter-spacing:2px;font-size:12px">YOUR OFFICE SPACE</p><h1 style="font-size:26px">Your start payment is received.</h1></td></tr><tr><td style="padding:28px"><h2 style="font-size:21px;margin:0 0 16px">Your ${escape(quote.name)} package</h2>${lines.filter((line) => !line.startsWith("Book your Project Discovery Session:") && !line.startsWith("If you have an existing lease,")).map((line) => `<p style="font-size:15px;line-height:24px;overflow-wrap:anywhere">${escape(line)}</p>`).join("")}<p style="margin:24px 0"><a href="${escape(DISCOVERY_BOOKING_URL)}" style="display:inline-block;background:#00796D;color:white;padding:16px 20px;text-decoration:none;border-radius:4px;font-weight:bold">Book your Project Discovery Session</a></p><p style="font-size:15px;line-height:24px">Choose a time that suits you. We’ll discuss your business, your lease and the next steps.</p><h2 style="font-size:20px;margin:24px 0 12px">Have an existing lease?</h2><p style="font-size:15px;line-height:24px">If applicable, please email a copy to <a href="mailto:jk@yourofficespace.au" style="color:#00796D">jk@yourofficespace.au</a> before your discovery session so we can prepare. This is optional; you can still book without a lease to share.</p></td></tr></table></td></tr></table></body></html>`,
  };
}
