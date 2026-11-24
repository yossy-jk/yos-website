// Public copy rules from the owner record dated 25 November 2026.
// Compatibility URLs and private financial identifiers are not marketing copy.
const blockedNames = /\b(?:EOF(?: Group)?|Experienced Office Furniture|Newvo|Rapidline|Newcastle Office Interiors|Sharp Office|Trade Design Group|OzChild|AACAFS|AACFS|Australian Aboriginal Child and Family Services|Access Industries|Hansen Yuncken)\b/i
const replacements: [RegExp, string][] = [
  [/\bsolutions\b/gi, 'options'], [/\bsynergies\b/gi, 'connections'], [/\bleverage\b/gi, 'negotiating position'],
  [/\bholistic\b/gi, 'complete'], [/\bseamlessly\b/gi, 'smoothly'], [/\bgame[- ]changer\b/gi, 'practical improvement'],
  [/\bpassionate about\b/gi, 'focused on'], [/\brobust\b/gi, 'durable'], [/\bscalable\b/gi, 'adaptable'],
  [/\binnovative\b/gi, 'practical'], [/\bcutting[- ]edge\b/gi, 'current'], [/\bbest[- ]in[- ]class\b/gi, 'well-specified'], [/\bworld[- ]class\b/gi, 'high-quality'],
]
export function publicCopy(text: string | undefined): string {
  return (text || '').replace(/[\u2013\u2014]/g, '-').split(/(https?:\/\/[^\s<>")]+|\/[a-z0-9][a-z0-9/_.?#&=:-]+)/).map((part, index) => index % 2 ? part : replacements.reduce((copy, [pattern, replacement]) => copy.replace(pattern, replacement), part)).join('')
}
export function hasBlockedPublicName(text: string): boolean { return blockedNames.test(text) }
export function isAllowedPublicPost(post: { title: string; body: string; excerpt?: string; metaDescription?: string; sources?: { title: string; url: string }[] }): boolean {
  return !hasBlockedPublicName([post.title, post.body, post.excerpt, post.metaDescription, ...post.sources?.map(source => `${source.title} ${source.url}`) || []].join('\n'))
}
