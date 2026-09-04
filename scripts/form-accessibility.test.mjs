import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const contactSource = await readFile(new URL('../src/components/ContactForm.tsx', import.meta.url), 'utf8')
const blogCaptureSource = await readFile(new URL('../src/components/BlogEmailCapture.tsx', import.meta.url), 'utf8')
const leaseReviewSource = await readFile(new URL('../src/app/lease-review/page.tsx', import.meta.url), 'utf8')
const leaseRiskSource = await readFile(new URL('../src/app/resources/lease-review/page.tsx', import.meta.url), 'utf8')
const fitoutEstimatorSource = await readFile(new URL('../src/app/resources/fitout-estimator/page.tsx', import.meta.url), 'utf8')

test('contact form labels are programmatically associated with their controls', () => {
  for (const field of ['name', 'company', 'email', 'phone', 'message']) {
    assert.match(contactSource, new RegExp(`htmlFor="contact-${field}"`))
    assert.match(contactSource, new RegExp(`id="contact-${field}"`))
    assert.match(contactSource, new RegExp(`name="${field}"`))
  }
})

test('required contact fields expose validation state and error references', () => {
  for (const field of ['name', 'email', 'message']) {
    assert.match(contactSource, new RegExp(`aria-invalid=\\{Boolean\\(errors\\.${field}\\)\\}`))
    assert.match(contactSource, new RegExp(`contact-${field}-error`))
  }
  assert.match(contactSource, /document\.getElementById\(`contact-\$\{firstInvalid\}`\)\?\.focus\(\)/)
})

test('blog email capture has a persistent accessible label and autocomplete metadata', () => {
  assert.match(blogCaptureSource, /<label htmlFor="blog-email"[^>]*>Email address<\/label>/)
  assert.match(blogCaptureSource, /id="blog-email"/)
  assert.match(blogCaptureSource, /name="email"/)
  assert.match(blogCaptureSource, /autoComplete="email"/)
})

test('multi-step tools move focus to the new step heading', () => {
  for (const source of [leaseReviewSource, leaseRiskSource, fitoutEstimatorSource]) {
    assert.match(source, /stepHeadingRef\.current\?\.focus\(\)/)
    assert.match(source, /ref=\{stepHeadingRef\} tabIndex=\{-1\}/)
  }
  assert.match(fitoutEstimatorSource, /resultHeadingRef\.current\?\.focus\(\)/)
  assert.match(fitoutEstimatorSource, /ref=\{resultHeadingRef\}[\s\S]{0,160}aria-label=\{`Your estimated fitout cost:/)
})

test('lease upload remains keyboard reachable and exposes its validation error', () => {
  assert.match(leaseReviewSource, /id="lease-file-upload"/)
  assert.match(leaseReviewSource, /className="absolute inset-0 h-full w-full cursor-pointer opacity-0"/)
  assert.doesNotMatch(leaseReviewSource, /type="file"[\s\S]{0,400}className="hidden"/)
  assert.match(leaseReviewSource, /aria-invalid=\{Boolean\(errors\.file\)\}/)
  assert.match(leaseReviewSource, /aria-describedby=\{errors\.file \? 'lease-file-error' : undefined\}/)
  assert.match(leaseReviewSource, /id="lease-file-error" role="alert"/)
})
