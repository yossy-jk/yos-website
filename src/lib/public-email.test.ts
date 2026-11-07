import test from 'node:test'
import assert from 'node:assert/strict'
import { publicEmailMarkup } from './public-email.ts'

test('public email remains a native mailto anchor inside the documented Cloudflare exception', () => {
  assert.equal(publicEmailMarkup('hello@yourofficespace.au'), '<!--email_off--><a href="mailto:hello@yourofficespace.au">hello@yourofficespace.au</a><!--/email_off-->')
})
test('email markup escapes labels and attributes and rejects non-email destinations', () => {
  assert.match(publicEmailMarkup('jk@yourofficespace.au', '<script>bad</script>', 'a" onclick="bad'), /&lt;script&gt;bad&lt;\/script&gt;/)
  assert.ok(!publicEmailMarkup('jk@yourofficespace.au', 'Joe', 'a" onclick="bad').includes('class="a" onclick='))
  for (const email of ['javascript:alert(1)', 'joe@example.com" onclick="bad', 'a@b.com\nBCC:x@y.com']) assert.throws(() => publicEmailMarkup(email))
})
