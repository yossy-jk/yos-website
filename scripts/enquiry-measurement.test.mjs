import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function load(relativePath, dependencies, globals = {}) {
  const source = readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const exports = {}
  vm.runInNewContext(output, { exports, require: name => { if (!(name in dependencies)) throw new Error(`Unexpected dependency ${name}`); return dependencies[name] }, ...globals })
  return exports
}

test('conversion measurement rejects missing/declined consent, excludes private paths and strips query data', () => {
  let consent = null
  const calls = []
  const window = { location: { pathname: '/contact', origin: 'https://www.yourofficespace.au' }, gtag: (...args) => calls.push(args) }
  const analytics = load('src/lib/analytics.ts', { './analytics-consent': { getAnalyticsConsent: () => consent } }, { window, process: { env: { NEXT_PUBLIC_GA_ID: 'G-FIXTURE' } } })
  analytics.trackConversion('generate_lead')
  consent = 'declined'; analytics.trackConversion('generate_lead')
  assert.equal(calls.length, 0)
  consent = 'accepted'; analytics.trackConversion('generate_lead', { service: 'Furniture', form_name: 'contact_enquiry' })
  assert.equal(calls.length, 1)
  assert.equal(calls[0][2].page_location, 'https://www.yourofficespace.au/contact')
  window.location.pathname = '/tenant-rep/brief/private-token'
  analytics.trackConversion('phone_click'); assert.equal(calls.length, 1)
  assert.equal(analytics.publicAnalyticsPath('/contact?email=private@example.invalid'), '/contact')
  assert.equal(analytics.publicAnalyticsPath('/tenant-rep/payment?session_id=private-reference'), undefined)
  window.location.pathname = '/tenant-rep/payment'
  analytics.trackConversion('phone_click'); assert.equal(calls.length, 1)
})

test('a consented conversion waits for GA init, flushes once, and is discarded on withdrawal', () => {
  let consent = 'accepted'
  const window = { location: { pathname: '/furniture', origin: 'https://www.yourofficespace.au' } }, calls = []
  const analytics = load('src/lib/analytics.ts', { './analytics-consent': { getAnalyticsConsent: () => consent } }, { window, process: { env: { NEXT_PUBLIC_GA_ID: 'G-FIXTURE' } } })
  analytics.trackConversion('generate_lead', { service: 'Furniture' })
  window.gtag = (...args) => calls.push(args)
  analytics.flushQueuedConversions(); analytics.flushQueuedConversions(); assert.equal(calls.length, 1)
  delete window.gtag; analytics.trackConversion('phone_click'); consent = 'declined'; analytics.flushQueuedConversions()
  consent = 'accepted'; window.gtag = (...args) => calls.push(args); analytics.flushQueuedConversions(); assert.equal(calls.length, 1)
})

test('the notification API only confirms delivery when Resend supplies an accepted message ID', async () => {
  for (const [result, expected] of [[{ data: { id: 'fixture-message' }, error: null }, 200], [{ data: null, error: { message: 'Rejected' } }, 502], [{ data: null, error: null }, 502]]) {
    let sends = 0
    const delivery = load('src/lib/enquiry-delivery.ts', {
      './enquiry-email': load('src/lib/enquiry-email.ts', {}),
      'next/server': { NextResponse: { json: (body, options = {}) => Response.json(body, options) } },
      resend: { Resend: class { emails = { send: async () => { sends++; return result } } } },
      'node:crypto': { randomUUID: () => '12345678-1234-1234-1234-123456789abc' },
      '@/lib/ratelimit': { contactLimiter: () => null, getIp: () => 'fixture' },
    }, { Request, Response, Date, JSON, process: { env: { RESEND_API_KEY: 'fixture' } }, console: { error() {}, warn() {} } })
    const response = await delivery.enquiryResponse(new Request('https://example.invalid/api/notify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Fixture', email: 'qa@example.invalid', source: 'Furniture Quote Request' }) }))
    assert.equal(response.status, expected); assert.equal(sends, 1)
  }
})

test('local and deployment preview interactions cannot enter production conversion reports', () => {
  for (const origin of ['http://127.0.0.1:3100', 'http://localhost:3100', 'https://yos-website-preview.vercel.app']) {
    const calls = []
    const window = { location: { origin, pathname: '/contact' }, gtag: (...args) => calls.push(args) }
    const analytics = load('src/lib/analytics.ts', { './analytics-consent': { getAnalyticsConsent: () => 'accepted' } }, { window, process: { env: { NEXT_PUBLIC_GA_ID: 'G-FIXTURE' } } })
    analytics.trackConversion('generate_lead'); analytics.flushQueuedConversions()
    assert.equal(calls.length, 0)
  }
})

test('furniture store intent is consented, separate from leads and excludes destination query data', () => {
  let consent = 'declined', listener, cleanup
  const calls = []
  const window = { location: { pathname: '/furniture', origin: 'https://www.yourofficespace.au' }, gtag: (...args) => calls.push(args) }
  const analytics = load('src/lib/analytics.ts', { './analytics-consent': { getAnalyticsConsent: () => consent } }, { window, process: { env: { NEXT_PUBLIC_GA_ID: 'G-FIXTURE' } } })
  class Element {
    constructor(link) { this.link = link }
    closest() { return this.link }
  }
  const document = { addEventListener: (_, fn) => { listener = fn }, removeEventListener: (_, fn) => { if (listener === fn) listener = undefined } }
  const tracking = load('src/components/FurnitureStoreTracking.tsx', {
    react: { useEffect: fn => { cleanup = fn() } }, '@/lib/analytics': analytics,
    '@/lib/constants': { FURNITURE_STORE_URL: 'https://www.yourofficefurniture.com.au' },
  }, { URL, Element, document })
  tracking.default()
  const link = { href: 'https://www.yourofficefurniture.com.au/products/chair?email=private@example.invalid#private', closest: selector => selector === 'main' ? {} : null }
  listener({ target: new Element(link) }); assert.equal(calls.length, 0)
  consent = 'accepted'; listener({ target: new Element(link) })
  assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'furniture_store_click')
  assert.equal(calls[0][2].link_location, 'content')
  assert.equal(calls[0][2].destination_site, 'your_office_furniture')
  assert.doesNotMatch(JSON.stringify(calls), /private|products|generate_lead|purchase/)
  window.location.pathname = '/tenant-rep/brief/private-token'
  listener({ target: new Element(link) }); assert.equal(calls.length, 1)
  cleanup(); assert.equal(listener, undefined)
})

test('store destination matching rejects lookalike domains, credentials and other protocols', () => {
  const tracking = load('src/components/FurnitureStoreTracking.tsx', {
    react: { useEffect() {} }, '@/lib/analytics': { trackConversion() {} },
    '@/lib/constants': { FURNITURE_STORE_URL: 'https://www.yourofficefurniture.com.au' },
  }, { URL })
  assert.equal(tracking.isFurnitureStoreLink('https://www.yourofficefurniture.com.au/collections/seating'), true)
  for (const href of ['https://www.yourofficefurniture.com.au.external.invalid', 'https://user:secret@www.yourofficefurniture.com.au', 'http://www.yourofficefurniture.com.au', 'javascript:alert(1)', '/furniture']) assert.equal(tracking.isFurnitureStoreLink(href), false)
})

test('homepage service choices respect consent and origin, use fixed labels and clean up listeners', () => {
  let consent = null, cleanup
  const calls = [], listeners = new Set()
  const window = { location: { pathname: '/', origin: 'https://www.yourofficespace.au' }, gtag: (...args) => calls.push(args) }
  const analytics = load('src/lib/analytics.ts', { './analytics-consent': { getAnalyticsConsent: () => consent } }, { window, process: { env: { NEXT_PUBLIC_GA_ID: 'G-FIXTURE' } } })
  class Element { constructor(link) { this.link = link } closest() { return this.link } }
  const document = { addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) }
  const tracking = load('src/components/ServiceChoiceTracking.tsx', { react: { useEffect: fn => { cleanup = fn() } }, '@/lib/analytics': analytics }, { URL, Element, document, window })
  const link = { href: 'https://www.yourofficespace.au/furniture?email=private@example.invalid#private', matches: selector => selector === '.home-service-card' }
  const click = () => { for (const listener of listeners) listener({ target: new Element(link) }) }
  tracking.default(); click(); consent = 'declined'; click(); assert.equal(calls.length, 0)
  consent = 'accepted'; click(); assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'service_select'); assert.equal(calls[0][2].service, 'Furniture'); assert.equal(calls[0][2].link_location, 'home_service_card')
  assert.doesNotMatch(JSON.stringify(calls), /private|email|generate_lead|purchase/)
  link.href = 'https://www.yourofficespace.au/cleaning'; link.matches = selector => selector === '.home-guide-service'
  click(); assert.equal(calls.length, 2); assert.equal(calls[1][2].service, 'Cleaning'); assert.equal(calls[1][2].link_location, 'home_service_guide')
  window.location.pathname = '/furniture'; click(); assert.equal(calls.length, 2)
  window.location.pathname = '/'; window.location.origin = 'http://localhost:3129'; link.href = 'http://localhost:3129/cleaning'; click(); assert.equal(calls.length, 2)
  cleanup(); assert.equal(listeners.size, 0); tracking.default(); assert.equal(listeners.size, 1); cleanup()
})

test('service choice tracking ignores unrelated, external, credentialled and unknown destinations', () => {
  let listener
  const calls = [], window = { location: { pathname: '/', origin: 'https://www.yourofficespace.au' } }
  class Element { constructor(link) { this.link = link } closest() { return this.link } }
  const tracking = load('src/components/ServiceChoiceTracking.tsx', { react: { useEffect: fn => fn() }, '@/lib/analytics': { trackConversion: (...args) => calls.push(args) } }, { URL, Element, window, document: { addEventListener: (_, fn) => { listener = fn }, removeEventListener() {} } })
  tracking.default()
  for (const href of ['https://other.invalid/furniture', 'https://www.yourofficespace.au/not-a-service', 'https://user:secret@www.yourofficespace.au/furniture', 'javascript:alert(1)']) listener({ target: new Element({ href, matches: () => true }) })
  listener({ target: new Element({ href: 'https://www.yourofficespace.au/furniture', matches: () => false }) })
  assert.equal(calls.length, 0)
})
