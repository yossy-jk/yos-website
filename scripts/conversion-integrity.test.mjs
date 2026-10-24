import './article-inline.test.mjs'
import './article-enquiry.test.mjs'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('successful contact enquiries emit a generate_lead conversion with service context', () => {
  const source = read('src/components/ContactForm.tsx')
  assert.match(source, /trackConversion\('generate_lead'/)
  assert.match(source, /service: fields\.service/)
  assert.match(source, /email_delivery: emailAccepted/)
  assert.doesNotMatch(source, /hubspotAccepted|crm_delivery/)
})

test('lead magnets and gated tools emit conversion events only after their success path', () => {
  const capability = read('src/components/CapabilityDownload.tsx')
  const tools = read('src/components/ToolGate.tsx')
  assert.ok(capability.indexOf("trackConversion('capability_statement_download'") > capability.indexOf('if (!res.ok || !data.downloadUrl)'))
  assert.match(tools, /trackConversion\('tool_complete'/)
  assert.match(tools, /email_delivery: leadResult\.ok/)
})

test('optional analytics remains consent gated globally', () => {
  const consent = read('src/components/AnalyticsConsent.tsx')
  assert.match(consent, /consent === 'accepted' && !paymentReceipt && <OptionalAnalytics \/>/)
  assert.match(consent, /pathname === '\/tenant-rep\/payment'/)
  assert.match(consent, /GoogleAnalytics/)
  assert.doesNotMatch(consent, /hs-script-loader|hs-scripts\.com/)
})


// Exercise the real browser transport without sending requests.
test('only accepted non-preview enquiry responses suppress future checklist prompts', async () => {
  const ts = await import('typescript')
  const { runInNewContext } = await import('node:vm')
  for (const fixture of [
    { body: { ok: true }, marked: true },
    { body: { success: true }, marked: true },
    { body: { ok: true, preview: true }, marked: false },
    { body: { success: true, preview: true }, marked: false },
    { body: { ok: false }, marked: false },
    { body: { ok: true }, status: 502, marked: false },
    { raw: 'invalid JSON', marked: false },
  ]) {
    const writes = [], events = [], exports = {}
    const response = new Response(fixture.raw ?? JSON.stringify(fixture.body), { status: fixture.status ?? 200 })
    runInNewContext(ts.transpileModule(read('src/lib/enquiry.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
      exports, crypto: { randomUUID: () => 'fixture-id' }, Event,
      window: { location: { pathname: '/buying' }, localStorage: { setItem: (...args) => writes.push(args) }, dispatchEvent: e => events.push(e.type) },
      fetch: async () => response,
    })
    const result = await exports.postEnquiry('/api/enquiry', { email: 'fixture@example.com' })
    assert.equal(writes.length, fixture.marked ? 1 : 0)
    assert.equal(events.length, fixture.marked ? 1 : 0)
    assert.equal(result, response)
    assert.equal(await result.text(), fixture.raw ?? JSON.stringify(fixture.body))
  }
})
