import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const layout = await readFile(new URL('../src/app/layout.tsx', import.meta.url), 'utf8')
const scrollManager = await readFile(new URL('../src/components/ScrollManager.tsx', import.meta.url), 'utf8')
const sitemap = await readFile(new URL('../src/app/sitemap.ts', import.meta.url), 'utf8')
const schema = await readFile(new URL('../src/lib/site-schema.ts', import.meta.url), 'utf8')

test('root layout wires deterministic route scrolling', () => {
  assert.match(layout, /import ScrollManager/)
  assert.match(layout, /<ScrollManager \/>/)
  assert.match(scrollManager, /window\.addEventListener\('popstate'/)
  assert.match(scrollManager, /window\.addEventListener\('hashchange'/)
  assert.match(scrollManager, /window\.scrollTo\(\{ top: 0, left: 0, behavior: 'auto' \}\)/)
})

test('schema uses a real logo and covers all five service types', () => {
  assert.match(schema, /brand\/yos-logo-black\.png/)
  for (const service of ['Tenant Representation', 'Commercial Property Buying', 'Commercial Fit Out', 'Office and Commercial Furniture', 'Commercial Cleaning']) {
    assert.match(schema, new RegExp(service))
  }
  assert.doesNotMatch(schema, /\/logo\.png/)
})

test('sitemap does not fabricate current timestamps for static routes', () => {
  assert.doesNotMatch(sitemap, /new Date\(\)\.toISOString\(\)/)
  for (const route of ['/case-studies', '/privacy', '/terms', '/not-for-profit-lease-support']) {
    assert.match(sitemap, new RegExp(route.replaceAll('/', '\\/')))
  }
  assert.match(sitemap, /getAllCaseStudies/)
})
