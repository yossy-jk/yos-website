import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
function load(file, extra = {}) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, { exports, require: name => ({fs,path})[name], process: { cwd: () => process.cwd(), env: {} }, AbortSignal, ...extra })
  return exports
}
const retired = 'gross-vs-net-lease-newcastle'
const destination = 'gross-lease-vs-net-lease-newcastle-guide'
test('retired gross/net guide permanently redirects to the retained article', async () => {
  const config = load('next.config.ts').default
  const rule = (await config.redirects()).find(item => item.source === `/blog/${retired}`)
  assert.equal(rule.destination, `/blog/${destination}`)
  assert.equal(rule.permanent, true)
  assert.equal(fs.existsSync(`src/content/blog/${retired}.json`), false)
  assert.equal(JSON.parse(fs.readFileSync(`src/content/blog/${destination}.json`)).slug, destination)
})
test('a legacy Redis copy cannot restore the retired guide to public collections', async () => {
  const post = slug => JSON.stringify({slug,title:'Stored guide',body:'Stored body',division:'tenant-rep',date:'2026-01-01'})
  const blog = load('src/lib/blog.ts', { process: { cwd: () => process.cwd(), env: {UPSTASH_REDIS_REST_URL:'https://example.invalid',UPSTASH_REDIS_REST_TOKEN:'test'} }, fetch: async () => ({json:async()=>({result:[retired,post(retired),'other-stored-guide',post('other-stored-guide')]})}) })
  const slugs = (await blog.getAllPublicPostsAsync()).map(post => post.slug)
  assert.equal(slugs.includes(retired), false)
  assert.equal(slugs.includes(destination), true)
  assert.equal(slugs.includes('other-stored-guide'), true)
})
