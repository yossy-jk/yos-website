import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const APP_ROOT = path.resolve('src/app')

function collectTsxFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name)
    return entry.isDirectory() ? collectTsxFiles(candidate) : [candidate]
  }).filter((file) => file.endsWith('.tsx'))
}

const files = collectTsxFiles(APP_ROOT).sort()

test('every application page owns or delegates a main landmark', () => {
  const delegatedPages = new Set([
    'market-snapshot/page.tsx',
    'not-for-profit-lease-support/page.tsx',
  ])
  const failures = []

  for (const file of files.filter((item) => item.endsWith(`${path.sep}page.tsx`))) {
    const relative = path.relative(APP_ROOT, file)
    if (delegatedPages.has(relative)) continue
    const source = fs.readFileSync(file, 'utf8')
    if (!/<main\b/.test(source)) failures.push(relative)
  }

  assert.deepEqual(failures, [])
})

test('every rendered global navigation has one matching main landmark', () => {
  const failures = []

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const navCount = source.match(/<Nav\s*\/>/g)?.length ?? 0
    if (navCount === 0) continue

    const mainCount = source.match(/<main\s+id=["']main-content["']/g)?.length ?? 0
    if (mainCount !== navCount) {
      failures.push(`${path.relative(APP_ROOT, file)}: Nav=${navCount}, main=${mainCount}`)
    }
  }

  assert.deepEqual(failures, [])
})

test('main landmarks are closed and never contain the global footer', () => {
  const failures = []

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const mainOpenCount = source.match(/<main\b/g)?.length ?? 0
    const mainCloseCount = source.match(/<\/main>/g)?.length ?? 0
    if (mainOpenCount !== mainCloseCount) {
      failures.push(`${path.relative(APP_ROOT, file)}: open=${mainOpenCount}, close=${mainCloseCount}`)
      continue
    }

    if (source.includes('<Footer />') && !/<\/main>\s*<Footer\s*\/>/.test(source)) {
      failures.push(`${path.relative(APP_ROOT, file)}: Footer is not directly after a main landmark`)
    }
  }

  assert.deepEqual(failures, [])
})

test('the not-for-profit route owns navigation and landmark in its layout only', () => {
  const layout = fs.readFileSync(path.join(APP_ROOT, 'not-for-profit-lease-support/layout.tsx'), 'utf8')
  const page = fs.readFileSync(path.join(APP_ROOT, 'not-for-profit-lease-support/page.tsx'), 'utf8')

  assert.match(layout, /<Nav\s*\/>[\s\S]*<main\s+id="main-content">\{children\}<\/main>[\s\S]*<Footer\s*\/>/)
  assert.doesNotMatch(page, /<(?:Nav|Footer)\s*\/>/)
})

test('the multi-step lease review renders a main landmark in every UI state', () => {
  const source = fs.readFileSync(path.join(APP_ROOT, 'lease-review/page.tsx'), 'utf8')

  assert.equal(source.match(/<Nav\s*\/>/g)?.length, 4)
  assert.equal(source.match(/<main\s+id="main-content">/g)?.length, 4)
  assert.equal(source.match(/<\/main>/g)?.length, 4)
})
