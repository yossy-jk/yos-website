import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const reviews = readFileSync(new URL('../src/lib/client-reviews.ts', import.meta.url), 'utf8')
test('homepage includes four approved client reviewers and distinct original review links', () => {
  for (const name of ['Beth Gwalter', 'Nathan Franks', 'Jason Dowdall', 'Sophie Collinson']) assert.ok(reviews.includes(`name: '${name}'`), name)
  const sources = [...reviews.matchAll(/source: '(https:\/\/share.google\/[^']+)'/g)].map(match => match[1])
  assert.equal(sources.length, 4)
  assert.equal(new Set(sources).size, 4)
})
test('every assigned logo is a real local asset', () => {
  const logos = [...reviews.matchAll(/logo: '([^']+)'/g)].map(match => match[1])
  assert.equal(logos.length, 4)
  for (const logo of logos) assert.ok(existsSync(new URL(`../public${logo}`, import.meta.url)), logo)
})
test('review navigation wraps and cards do not clip the supplied text', () => {
  const carousel = readFileSync(new URL('../src/components/ReviewsCarousel.tsx', import.meta.url), 'utf8')
  assert.ok(carousel.includes("flexWrap: 'wrap'"))
  assert.ok(carousel.includes("fontSize: 'clamp(20px, 3vw, 30px)'"))
  assert.ok(!carousel.includes('Read the full Google review'))
  assert.ok(!page.includes('Read our Google reviews'))
  assert.ok(!carousel.includes('<a '), 'Review carousel must keep visitors on-page')
  assert.ok(carousel.includes("review.logoBackground === 'dark'"))
  const css = readFileSync(new URL('../src/components/ReviewsCarousel.module.css', import.meta.url), 'utf8')
  assert.ok(css.includes('repeat(4, 44px)'))
  assert.ok(css.includes('repeat(8, 44px)'))
})
