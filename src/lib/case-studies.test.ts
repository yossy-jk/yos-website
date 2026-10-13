import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const originalDirectory = process.cwd()
const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'yos-case-publication-'))
const contentDirectory = path.join(fixtureDirectory, 'src/content/case-studies')
fs.mkdirSync(contentDirectory, { recursive: true })
for (const [slug, publication] of [['approved', true], ['draft', false], ['legacy', undefined]] as const) {
  fs.writeFileSync(path.join(contentDirectory, `${slug}.json`), JSON.stringify({ slug, title: slug, date: '2026-10-13', featured: true, published: publication }))
}
process.chdir(fixtureDirectory)
const { getAllCaseStudies, getCaseStudyBySlug, getFeaturedCaseStudies } = await import('./case-studies.ts')
after(() => { process.chdir(originalDirectory); fs.rmSync(fixtureDirectory, { recursive: true, force: true }) })

test('only explicitly published case studies reach lists, featured results and detail lookups', () => {
  assert.deepEqual(getAllCaseStudies().map(study => study.slug), ['approved'])
  assert.deepEqual(getFeaturedCaseStudies().map(study => study.slug), ['approved'])
  assert.equal(getCaseStudyBySlug('approved')?.slug, 'approved')
  assert.equal(getCaseStudyBySlug('draft'), null)
  assert.equal(getCaseStudyBySlug('legacy'), null)
  assert.equal(getCaseStudyBySlug('missing'), null)
})
test('case study lookup rejects paths outside the content slug namespace', () => {
  for (const slug of ['../approved', '/approved', 'approved.json', 'draft/approved']) assert.equal(getCaseStudyBySlug(slug), null)
})
