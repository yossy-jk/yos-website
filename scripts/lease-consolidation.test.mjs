import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8')
test('all retired intake routes permanently redirect to the current Health Check without upload clients', async () => {
  const config = await read('next.config.ts')
  for (const route of ['/lease-review', '/leaseintel', '/eof-group/lease-review']) {
    assert.ok(config.includes(`['${route}', '/lease-health-check']`))
    const page = await read(`src/app${route}/page.tsx`)
    assert.match(page, /permanentRedirect\("\/lease-health-check"\)/)
    assert.doesNotMatch(page, /use client|FormData|formsubmit|file-security|HubSpotForm/)
  }
  assert.match(config, /permanent: true/)
  const sitemap = await read('src/app/sitemap.ts')
  assert.doesNotMatch(sitemap, /\$\{BASE\}\/(?:lease-review|leaseintel)`/)
  assert.ok(sitemap.includes("'/lease-health-check'"))
  assert.match(sitemap, /\$\{BASE\}\/resources\/lease-review/)
})
test('consolidated destination retains optional accessible upload and direct-inbox submission', async () => {
  const page = await read('src/app/lease-health-check/page.tsx')
  assert.match(page, /<TenantLeadForm/)
  assert.match(page, /Uploading your current lease is optional/)
  const form = await read('src/components/tenant/TenantLeadForm.tsx')
  assert.match(form, /LeaseAttachmentField/)
  assert.match(form, /\/api\/tenant-lead/)
  const field = await read('src/components/LeaseAttachmentField.tsx')
  assert.match(field, /<label htmlFor=\{id\}/)
  assert.match(field, /aria-invalid=\{Boolean\(error\)\}/)
  assert.match(field, /role="alert"/)
  assert.match(field, /You can submit without a document/)
  assert.doesNotMatch(field, /type="file"[^>]*required/)
})
