import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const exports = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/article-enquiry.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports })
const { articleEnquiry } = exports

test('article prompts retain the service intent, including FitOut within the furniture division', () => {
  for (const [slug, division, expected] of [
    ['what-is-tenant-representation-newcastle', 'tenant-rep', 'Leasing'],
    ['commercial-buyers-agent-brief-newcastle', 'buyers-agency', 'Buying'],
    ['commercial-cleaning-newcastle-what-to-expect', 'cleaning', 'Cleaning'],
    ['commercial-fitout-cost-newcastle-2026', 'furniture', 'FitOut'],
    ['commercial-construction-project-manager-vs-builder-newcastle', 'general', 'FitOut'],
    ['residential-vs-commercial-construction-nsw', 'furniture', 'FitOut'],
    ['office-fitout-handover-checklist', 'furniture', 'FitOut'],
    ['office-furniture-budget-newcastle', 'furniture', 'Furniture'],
    ['office-space-per-person-australia', 'general', 'Not sure'],
    ['fitout-before-a-lease', 'tenant-rep', 'Leasing'],
  ]) assert.equal(articleEnquiry(slug, division).service, expected)
})

test('each service has a distinct usable next step without reflecting arbitrary article input', () => {
  const rows = [['lease', 'tenant-rep'], ['buy', 'buyers-agency'], ['clean', 'cleaning'], ['fitout', 'furniture'], ['furnish', 'furniture'], ['other', 'general']].map(([slug, division]) => articleEnquiry(slug, division))
  assert.equal(new Set(rows.map(row => row.title)).size, 6)
  assert.equal(new Set(rows.map(row => row.action)).size, 6)
  for (const row of rows) for (const field of ['title', 'intro', 'action', 'submit', 'placeholder']) assert.ok(row[field].trim().length > 10)
  assert.ok(!JSON.stringify(articleEnquiry('<script>untrusted</script>', 'unknown')).includes('<script>'))
})
