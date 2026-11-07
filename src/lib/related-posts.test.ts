import test from 'node:test'
import assert from 'node:assert/strict'
import { relatedPosts } from './related-posts.ts'

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
