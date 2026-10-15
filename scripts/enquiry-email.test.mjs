import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const exports = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/enquiry-email.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports })
const { renderEnquiryEmail, enquirySydneyDate } = exports
const enquiry = { source: 'Commercial cleaning', name: 'Taylor Example', company: 'Newcastle QA', email: 'qa@example.invalid', phone: '02 4092 0733', submissionId: 'qa-reference', submittedAt: '2026-10-15T00:00:00Z', message: 'Please quote for weekly cleaning.\nAfter 6 pm works best.' }
test('contact and requirements come first in matching HTML and readable text alternatives', () => {
  const content = renderEnquiryEmail({ ...enquiry, details: { workstations: 20, hasKitchen: true, hasReception: false, budget: 0, notes: '<script>alert("test")</script>' } })
  for (const body of [content.html, content.text]) {
    assert.ok(body.indexOf('Contact details'.toUpperCase()) >= 0 || body.includes('Contact details'))
    assert.ok(body.indexOf('Taylor Example') < body.indexOf('Workstations'))
    assert.ok(body.includes('After 6 pm works best.'))
    assert.match(body, /Reception required/)
    assert.match(body, /No/)
    assert.match(body, /Budget/)
    assert.match(body, /Not opted in/)
  }
  assert.doesNotMatch(content.html, /<script>/)
  assert.match(content.html, /&lt;script&gt;/)
  assert.match(content.html, /href="mailto:qa%40example.invalid"/)
  assert.match(content.html, /href="tel:0240920733"/)
  assert.doesNotMatch(content.text, /"workstations"|schemaVersion|YOS OS/)
  assert.equal(enquirySydneyDate(enquiry.submittedAt), '15 Oct 2026, 11:00 am AEDT')
})
test('nested planner items and false/zero values survive without raw JSON', () => {
  const content = renderEnquiryEmail({ ...enquiry, details: { items: Array.from({ length: 12 }, (_, i) => ({ name: `Chair ${i}`, qty: i })), insurance: false } })
  assert.match(content.text, /Items · 12 · Name: Chair 11/)
  assert.match(content.text, /Items · 1 · Quantity: 0/)
  assert.match(content.text, /Insurance: No/)
})
test('attachment and lease fallback are legible, with stable retry payloads', () => {
  const data = { ...enquiry, message: JSON.stringify({ fields: { expiry: '2027-01-01' }, worries: ['High rent'], honeypot: 'hidden', submissionId: 'hidden' }), attachment: { filename: 'Current lease.pdf', size: 2048 }, followUpBy: '2026-10-16T00:00:00Z' }
  const a = renderEnquiryEmail(data)
  assert.match(a.text, /LEASE ATTACHED\nFile: Current lease.pdf \(2 KB\)/)
  assert.match(a.text, /Lease details · Lease expiry: 2027-01-01/)
  assert.match(a.text, /High rent/)
  assert.doesNotMatch(a.text, /hidden|honeypot|"fields"/)
  assert.deepEqual(a, renderEnquiryEmail(data))
})
test('visitor content cannot inject markup or mail headers and invalid dates stay out', () => {
  const result = renderEnquiryEmail({ ...enquiry, name: '<img src=x onerror=alert(1)>', email: 'qa?bcc=other@example.invalid', submittedAt: 'bad', attachment: { filename: '"><img src=x>.pdf', size: 50 } })
  assert.doesNotMatch(result.html, /<img/)
  assert.match(result.html, /mailto:qa%3Fbcc%3Dother%40example.invalid/)
  assert.doesNotMatch(result.text, /Invalid Date/)
})
