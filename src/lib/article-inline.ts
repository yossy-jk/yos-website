export type ArticleInlineToken = { kind: 'text' | 'bold'; text: string } | { kind: 'link'; text: string; href: string }

// Treat article markup as text; only explicit web, site and fragment links navigate.
export function articleInlineTokens(text: string): ArticleInlineToken[] {
  const tokens: ArticleInlineToken[] = []
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let end = 0
  for (const match of text.matchAll(pattern)) {
    if (match.index! > end) tokens.push({ kind: 'text', text: text.slice(end, match.index) })
    if (match[1]) tokens.push({ kind: 'bold', text: match[1] })
    else {
      const href = match[3].trim()
      const safe = !/[\s\\\u0000-\u001f]/.test(href) && (/^\/(?!\/)/.test(href) || /^#[^#]+/.test(href) || /^https?:\/\//i.test(href))
      tokens.push(safe ? { kind: 'link', text: match[2], href: href === '/contact' ? '/contact#contact-enquiry' : href } : { kind: 'text', text: match[0] })
    }
    end = match.index! + match[0].length
  }
  if (end < text.length) tokens.push({ kind: 'text', text: text.slice(end) })
  return tokens
}
