import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const contactSource = await readFile(new URL('../src/components/ContactForm.tsx', import.meta.url), 'utf8')
const blogCaptureSource = await readFile(new URL('../src/components/BlogEmailCapture.tsx', import.meta.url), 'utf8')

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
})

test('blog email capture has a persistent accessible label and autocomplete metadata', () => {
  assert.match(blogCaptureSource, /<label htmlFor="blog-email"[^>]*>Email address<\/label>/)
  assert.match(blogCaptureSource, /id="blog-email"/)
  assert.match(blogCaptureSource, /name="email"/)
  assert.match(blogCaptureSource, /autoComplete="email"/)
})
