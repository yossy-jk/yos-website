interface RelatedPost { slug: string; division: string; tags: string[] }

// Same-service neighbours keep the full library discoverable; tag overlap adds
// a topical third suggestion instead of showing only the newest three posts.
export function relatedPosts<T extends RelatedPost>(posts: T[], current: T, limit = 3): T[] {
  const peers = posts.filter(post => post.division === current.division)
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
  for (const post of posts) add(post)
  return chosen
}
