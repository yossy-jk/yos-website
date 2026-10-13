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
    const route = load('src/app/api/notify/route.ts', {
      'next/server': { NextResponse: { json: (body, options = {}) => Response.json(body, options) } },
      resend: { Resend: class { emails = { send: async () => { sends++; return result } } } },
      '@/lib/ratelimit': { notifyLimiter: () => null, getIp: () => 'fixture' },
    }, { process: { env: { RESEND_API_KEY: 'fixture' } }, console: { error() {}, warn() {} } })
    const response = await route.POST(new Request('https://example.invalid/api/notify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Fixture', email: 'qa@example.invalid', source: 'Furniture Quote Request' }) }))
    assert.equal(response.status, expected); assert.equal(sends, 1)
  }
})
