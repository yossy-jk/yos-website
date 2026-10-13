import test from 'node:test'
import assert from 'node:assert/strict'
import { blogSitemapEntries, safeContentDate } from './sitemap-content.ts'
const base = 'https://www.yourofficespace.au'
const valid = { slug: 'lease-planning', title: 'Lease planning', body: 'A useful planning guide.', date: '2026-10-12' }

test('invalid or missing publication dates do not take the sitemap down or imply fresh content', () => {
  for (const date of [undefined, null, '', 'not-a-date', '2026', '2026-02-31', 1234]) {
    const entries = blogSitemapEntries([{ ...valid, date }], base, [])
    assert.equal(entries.length, 1)
    assert.equal(entries[0].url, `${base}/blog/lease-planning`)
    assert.equal('lastModified' in entries[0], false)
  }
})
test('valid recorded dates retain their actual publication time', () => {
  assert.equal(safeContentDate('2026-10-12'), '2026-10-12T00:00:00.000Z')
  assert.equal(safeContentDate('2026-10-12T15:00:00+11:00'), '2026-10-12T04:00:00.000Z')
})
test('metadata records, malformed articles and unsafe slugs cannot become crawl URLs', () => {
  const rows = [null, 1, true, 'metadata', {}, {slug:'../private', title:'X',body:'Y'}, {slug:'empty',title:'',body:'X'}, {slug:'missing-body',title:'X'}, valid]
  assert.deepEqual(blogSitemapEntries(rows, base, []).map(row => row.url), [`${base}/blog/lease-planning`])
})
test('search exclusions and duplicate published slugs stay out of the sitemap', () => {
  assert.equal(blogSitemapEntries([valid,valid],base,[]).length,1)
  assert.equal(blogSitemapEntries([valid],base,['lease-planning']).length,0)
})

test('a recorded article revision updates crawl freshness without inventing a date', () => {
  const revised = blogSitemapEntries([{ ...valid, updatedDate: '2026-10-13' }], base, [])
  assert.equal(revised[0].lastModified, '2026-10-13T00:00:00.000Z')
  const invalid = blogSitemapEntries([{ ...valid, updatedDate: '2026-02-31' }], base, [])
  assert.equal(invalid[0].lastModified, '2026-10-12T00:00:00.000Z')
})
