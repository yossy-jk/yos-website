import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

test('consolidated furniture article stays out of public listings even when Redis retains an older copy', async () => {
  const exports = {}
  const retired = 'newcastle-office-fitout-costs-2026'
  const retained = { slug: 'redis-new-article-fixture', date: '2026-10-19' }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/blog.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, {
    exports, require: name => ({ fs, path })[name], process: { cwd: () => process.cwd(), env: { UPSTASH_REDIS_REST_URL: 'https://redis.invalid', UPSTASH_REDIS_REST_TOKEN: 'fixture' } }, AbortSignal,
    fetch: async () => ({ json: async () => ({ result: ['old', JSON.stringify({ slug: retired, date: '2026-06-04' }), 'new', JSON.stringify(retained)] }) }),
  })
  const posts = await exports.getAllPublicPostsAsync()
  assert.ok(!posts.some(post => post.slug === retired))
  assert.ok(posts.some(post => post.slug === retained.slug))
  assert.ok(posts.some(post => post.slug === 'office-furniture-budget-newcastle'))
  assert.ok(posts.some(post => post.slug === 'commercial-fitout-cost-newcastle-2026'))
  const config = fs.readFileSync('next.config.ts', 'utf8')
  assert.ok(config.includes("['/blog/" + retired + "', '/blog/office-furniture-budget-newcastle']"))
})
