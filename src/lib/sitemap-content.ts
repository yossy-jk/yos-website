export function safeContentDate(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value)) return undefined
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return undefined
  const iso = date.toISOString()
  if (value.length === 10 && iso.slice(0, 10) !== value) return undefined
  return iso
}

export function blogSitemapEntries(records: readonly unknown[], base: string, excluded: readonly string[]) {
  const seen = new Set<string>()
  return records.flatMap(value => {
    if (!value || typeof value !== 'object') return []
    const post = value as Record<string, unknown>
    if (typeof post.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || excluded.includes(post.slug) || seen.has(post.slug)) return []
    // Only discover records the article renderer can actually display.
    if (typeof post.title !== 'string' || !post.title.trim() || typeof post.body !== 'string' || !post.body.trim()) return []
    seen.add(post.slug)
    const lastModified = safeContentDate(post.updatedDate) || safeContentDate(post.date)
    return [{ url: `${base}/blog/${post.slug}`, ...(lastModified ? { lastModified } : {}), changeFrequency: 'monthly' as const, priority: 0.75 }]
  })
}
