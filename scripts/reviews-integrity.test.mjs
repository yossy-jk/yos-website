import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const reviews = page.split('const reviews = [')[1].split('\n]')[0]
test('homepage includes all eight owner-supplied reviewers and distinct original review links', () => {
  for (const name of ['Beth Gwalter', 'Olivia Crawford', 'Mitch Peck', 'Nathan Franks', 'Liz Murray', 'Jason Dowdall', 'Sophie Collinson', 'Kristy Cashman']) assert.ok(reviews.includes(`name: '${name}'`), name)
  const sources = [...reviews.matchAll(/source: '(https:\/\/share.google\/[^']+)'/g)].map(match => match[1])
  assert.equal(sources.length, 8)
  assert.equal(new Set(sources).size, 8)
})
test('every assigned logo is a real local asset', () => {
  const logos = [...reviews.matchAll(/logo: '([^']+)'/g)].map(match => match[1])
  assert.equal(logos.length, 7, 'Owner requested ConnectAbility name only, without a logo')
  for (const logo of logos) assert.ok(existsSync(new URL(`../public${logo}`, import.meta.url)), logo)
})
test('eight-review navigation wraps and cards do not clip the supplied text', () => {
  const carousel = readFileSync(new URL('../src/components/ReviewsCarousel.tsx', import.meta.url), 'utf8')
  assert.ok(carousel.includes("flexWrap: 'wrap'"))
  assert.ok(carousel.includes("fontSize: 'clamp(20px, 3vw, 30px)'"))
  assert.ok(carousel.includes('Read the full Google review'))
  assert.ok(carousel.includes("review.logoBackground === 'dark'"))
  const css = readFileSync(new URL('../src/components/ReviewsCarousel.module.css', import.meta.url), 'utf8')
  assert.ok(css.includes('repeat(4, 44px)'))
  assert.ok(css.includes('repeat(8, 44px)'))
})
