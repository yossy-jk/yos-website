interface RelatedPost { slug: string; division: string; tags: string[] }

// Topic neighbours keep each planning collection connected. Unclassified posts
// retain the broader service-based fallback, including older leasing articles.
export function relatedPosts<T extends RelatedPost>(posts: T[], current: T, limit = 3, topicForSlug?: (slug: string) => string | undefined): T[] {
  const topic = topicForSlug?.(current.slug)
  const peers = posts.filter(post => topic ? topicForSlug?.(post.slug) === topic : post.division === current.division)
  const index = peers.findIndex(post => post.slug === current.slug)
  const chosen: T[] = []
  const add = (post: T | undefined) => {
    if (post && post.slug !== current.slug && !chosen.some(existing => existing.slug === post.slug) && chosen.length < limit) chosen.push(post)
  }
  if (index >= 0 && peers.length > 1) {
    add(peers[(index + 1) % peers.length])
    add(peers[(index - 1 + peers.length) % peers.length])
  }
  const tags = new Set(current.tags.map(tag => tag.toLowerCase()))
  const overlap = (post: T) => post.tags.filter(tag => tags.has(tag.toLowerCase())).length
  for (const post of [...peers].sort((a, b) => overlap(b) - overlap(a))) add(post)
  if (!topic) for (const post of posts) add(post)
  return chosen
}
