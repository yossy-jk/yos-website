import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const layout = await readFile(new URL('../src/app/layout.tsx', import.meta.url), 'utf8')
const scrollManager = await readFile(new URL('../src/components/ScrollManager.tsx', import.meta.url), 'utf8')
const sitemap = await readFile(new URL('../src/app/sitemap.ts', import.meta.url), 'utf8')
const schema = await readFile(new URL('../src/lib/site-schema.ts', import.meta.url), 'utf8')
const home = await readFile(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const nav = await readFile(new URL('../src/components/Nav.tsx', import.meta.url), 'utf8')
const footer = await readFile(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8')
const hubspotRoute = await readFile(new URL('../src/app/api/hubspot/route.ts', import.meta.url), 'utf8')

test('root layout wires deterministic route scrolling', () => {
  assert.match(layout, /import ScrollManager/)
  assert.match(layout, /<ScrollManager \/>/)
  assert.match(scrollManager, /document\.addEventListener\('click'/)
  assert.match(scrollManager, /window\.addEventListener\('hashchange'/)
  assert.match(scrollManager, /window\.scrollTo\(\{ top: 0, left: 0, behavior: 'auto' \}\)/)
})

test('schema uses a real logo and covers all five service types', () => {
  assert.match(schema, /brand\/yos-logo-black\.png/)
  for (const service of ['Tenant Representation', 'Commercial Property Buying', 'Commercial FitOut', 'Office and Commercial Furniture', 'Commercial Cleaning']) {
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

test('homepage preserves the approved responsive composition', () => {
  assert.match(home, /const primaryTagline = 'Find It, Fit It Out and Furnish It'/)
  assert.match(home, /className="home-service-grid"/)
  assert.match(home, /className="home-service-card"/)
  assert.doesNotMatch(home, /grid-cols-1 md:grid-cols-2/)
})

test('desktop navigation does not replace the mobile menu before wide screens', () => {
  assert.match(nav, /hidden xl:flex/)
  assert.match(nav, /xl:hidden/)
  assert.match(nav, /flex shrink-0 items-center/)
  assert.doesNotMatch(nav, /hidden md:flex/)
})

test('brand logos preserve their real aspect ratio and footer padding remains bounded', () => {
  assert.match(nav, /width=\{3148\}[\s\S]*height=\{482\}/)
  assert.match(footer, /width=\{3148\}[\s\S]*height=\{482\}/)
  assert.match(footer, /paddingLeft: 'clamp\(1\.25rem,3vw,2rem\)'/)
  assert.match(footer, /paddingRight: 'clamp\(1\.25rem,3vw,2rem\)'/)
})

test('default social and schema assets exist', async () => {
  await access(new URL('../public/og/og-default.png', import.meta.url))
  await access(new URL('../public/brand/yos-logo-black.png', import.meta.url))
})

test('HubSpot lead failures are diagnosable without logging credentials or lead data', () => {
  assert.match(hubspotRoute, /HubSpot \$\{step\} failed/)
  assert.match(hubspotRoute, /hubspot_contact_rejected/)
  assert.match(hubspotRoute, /hubspot_deal_rejected/)
  assert.doesNotMatch(hubspotRoute, /console\.error\([^\n]*(safeEmail|safeName|safeContext)/)
})
