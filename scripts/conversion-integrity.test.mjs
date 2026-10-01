import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('successful contact enquiries emit a generate_lead conversion with service context', () => {
  const source = read('src/components/ContactForm.tsx')
  assert.match(source, /trackConversion\('generate_lead'/)
  assert.match(source, /service: fields\.service/)
  assert.match(source, /email_delivery: emailAccepted/)
  assert.match(source, /crm_delivery: hubspotAccepted/)
})

test('lead magnets and gated tools emit conversion events only after their success path', () => {
  const capability = read('src/components/CapabilityDownload.tsx')
  const tools = read('src/components/ToolGate.tsx')
  assert.ok(capability.indexOf("trackConversion('capability_statement_download'") > capability.indexOf('if (!res.ok || !data.downloadUrl)'))
  assert.match(tools, /trackConversion\('tool_complete'/)
  assert.match(tools, /crm_delivery: leadResult\.ok/)
})

test('optional analytics remains consent gated globally', () => {
  const consent = read('src/components/AnalyticsConsent.tsx')
  assert.match(consent, /consent === 'accepted' && <OptionalAnalytics \/>/)
  assert.match(consent, /GoogleAnalytics/)
  assert.match(consent, /hs-script-loader/)
})

