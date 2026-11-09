import test from 'node:test'
import assert from 'node:assert/strict'
import { relatedPosts } from './related-posts.ts'
import { BLOG_CLUSTERS, getBlogCluster } from './blog-clusters.ts'
import { readFileSync } from 'node:fs'

test('older articles receive contextual incoming links from same-service peers', () => {
  const posts = Array.from({ length: 8 }, (_, i) => ({ slug: `lease-${i}`, division: 'tenant-rep', tags: ['lease'] }))
  const incoming = new Map(posts.map(post => [post.slug, new Set<string>()]))
  for (const current of posts) {
    const related = relatedPosts(posts, current)
    assert.equal(related.length, 3)
    assert.equal(new Set(related.map(post => post.slug)).size, 3)
    assert.ok(related.every(post => post.slug !== current.slug && post.division === current.division))
    for (const post of related) incoming.get(post.slug)!.add(current.slug)
  }
  assert.ok([...incoming.values()].every(sources => sources.size >= 2))
})

test('small libraries have no self-links or duplicates and prefer their own service', () => {
  const a = { slug: 'a', division: 'tenant-rep', tags: [] }
  const b = { slug: 'b', division: 'tenant-rep', tags: [] }
  const c = { slug: 'c', division: 'furniture', tags: [] }
  assert.deepEqual(relatedPosts([a], a), [])
  assert.deepEqual(relatedPosts([a, b, c], a).map(post => post.slug), ['b', 'c'])
})

test('Newcastle topic collections use published, unique articles and retain two-way discovery', () => {
  const assigned = BLOG_CLUSTERS.flatMap(cluster => [...cluster.slugs])
  assert.equal(new Set(assigned).size, assigned.length, 'An article has one primary planning intent')
  assert.equal(BLOG_CLUSTERS.flatMap(cluster => [...cluster.searchTerms]).length, 5)
  const posts = assigned.map(slug => JSON.parse(readFileSync(new URL(`../content/blog/${slug}.json`, import.meta.url), 'utf8')))
  const incoming = new Map(assigned.map(slug => [slug, new Set<string>()]))
  for (const cluster of BLOG_CLUSTERS) {
    assert.ok(cluster.slugs.length >= 3)
    for (const slug of cluster.slugs) {
      const current = posts.find(post => post.slug === slug)!
      const related = relatedPosts(posts, current, 3, slug => getBlogCluster(slug)?.id)
      assert.equal(related.length, Math.min(3, cluster.slugs.length - 1))
      assert.ok(related.every(post => post.slug !== slug && getBlogCluster(post.slug)?.id === cluster.id))
      for (const post of related) incoming.get(post.slug)!.add(slug)
    }
  }
  assert.ok([...incoming.values()].every(sources => sources.size >= 2))
  assert.equal(getBlogCluster('unknown-article'), undefined)
  assert.equal(getBlogCluster('office-fitout-newcastle-planning-checklist')?.serviceHref, '/office-fitout')
  assert.equal(getBlogCluster('commercial-construction-project-manager-vs-builder-newcastle')?.serviceHref, '/commercial-construction')
})
