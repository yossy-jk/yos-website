import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const scanner = fileURLToPath(new URL('./scan-source-credentials.mjs', import.meta.url))

async function scanFixture(files) {
  const root = await mkdtemp(path.join(tmpdir(), 'yos-credential-scan-'))
  try {
    for (const [relative, content] of Object.entries(files)) {
      const target = path.join(root, relative)
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, content)
    }
    const run = spawnSync(process.execPath, [scanner], { cwd: root, encoding: 'utf8' })
    return { code: run.status, output: JSON.parse(run.stdout) }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('clean source passes', async () => {
  const result = await scanFixture({ 'clean.ts': 'const configured = process.env.SERVICE_TOKEN\n' })
  assert.equal(result.code, 0)
  assert.equal(result.output.finding_count, 0)
})

test('detects secret families and literal basic credentials without returning values', async () => {
  const langfuse = ['sk', 'lf', 'A'.repeat(28)].join('-')
  const legacyOpenAI = ['sk', 'B'.repeat(32)].join('-')
  const basic = `Buffer.from('${'C'.repeat(12)}:${'D'.repeat(24)}')`
  const result = await scanFixture({
    'page.html': `<meta content="${langfuse}">`,
    'legacy.txt': legacyOpenAI,
    'auth.ts': basic,
  })

  assert.equal(result.code, 1)
  assert.ok(result.output.findings.some((item) => item.rule === 'langfuse_secret_key'))
  assert.ok(result.output.findings.some((item) => item.rule === 'openai_legacy_api_key'))
  assert.ok(result.output.findings.some((item) => item.rule === 'literal_basic_auth_credential'))
  const serialized = JSON.stringify(result.output)
  assert.equal(serialized.includes(langfuse), false)
  assert.equal(serialized.includes(legacyOpenAI), false)
  assert.equal(serialized.includes(`${'C'.repeat(12)}:${'D'.repeat(24)}`), false)
})

test('detects non-empty secret environment fallback', async () => {
  const environmentRead = ['process', 'env', 'SERVICE_TOKEN'].join('.')
  const fallbackOperator = ['|', '|'].join('')
  const result = await scanFixture({
    'config.mjs': `const token = ${environmentRead} ${fallbackOperator} '${'E'.repeat(24)}'`,
  })
  assert.equal(result.code, 1)
  assert.ok(result.output.findings.some((item) => item.rule === 'nonempty_secret_environment_fallback'))
})
