import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const exports = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/article-inline.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports })
const parse = text => JSON.parse(JSON.stringify(exports.articleInlineTokens(text)))
test('paragraph links retain surrounding text, multiple destinations and bold text', () => {
  assert.deepEqual(parse('[Start](/lease-health-check). Upload optional. **Tip:** [Ask](#blog-contact-form) today.'), [
    { kind: 'link', text: 'Start', href: '/lease-health-check' }, { kind: 'text', text: '. Upload optional. ' },
    { kind: 'bold', text: 'Tip:' }, { kind: 'text', text: ' ' }, { kind: 'link', text: 'Ask', href: '#blog-contact-form' }, { kind: 'text', text: ' today.' },
  ])
})
test('unsafe and malformed destinations stay text, and explicit contact links reach the form', () => {
  for (const href of ['javascript:alert', '//other.example', '/\\other.example', '/bad path', 'data:text/html,test']) assert.equal(parse(`[Link](${href})`)[0].kind, 'text')
  assert.equal(parse('[Contact](/contact)')[0].href, '/contact#contact-enquiry')
  assert.equal(parse('[Source](https://example.org/guide)')[0].kind, 'link')
  assert.deepEqual(parse('A [broken link'), [{ kind: 'text', text: 'A [broken link' }])
})
