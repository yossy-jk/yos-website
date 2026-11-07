// Cloudflare's documented per-address exclusion keeps public mailto links intact.
// Only the anchor markup is exempted; zone-wide email protection is unchanged.
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
export function publicEmailMarkup(email: string, label: string = email, className: string = '') {
  if (!/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) throw new Error('Invalid public email address')
  return `<!--email_off--><a href="mailto:${escapeHtml(encodeURIComponent(email).replace('%40', '@'))}"${className ? ` class="${escapeHtml(className)}"` : ''}>${escapeHtml(label)}</a><!--/email_off-->`
}
