#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const skippedDirectories = new Set([
  '.git',
  '.next',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'screenshots',
])
const textExtensions = new Set([
  '.cjs', '.conf', '.css', '.csv', '.env', '.graphql', '.htm', '.html', '.ini', '.js', '.json', '.jsx',
  '.key', '.md', '.mjs', '.pem', '.properties', '.sh', '.sql', '.svg', '.text', '.toml', '.ts', '.tsx',
  '.txt', '.xml', '.yaml', '.yml',
])
const prefixRules = [
  ['resend_api_key', 'critical', /\bre_[A-Za-z0-9_]{20,}\b/],
  ['github_classic_token', 'critical', /\bghp_[A-Za-z0-9]{20,}\b/],
  ['github_fine_grained_token', 'critical', /\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ['openai_api_key', 'critical', /\bsk-(?:proj|svcacct)-[A-Za-z0-9_-]{20,}\b/],
  ['openai_legacy_api_key', 'critical', /\bsk-(?!(?:lf|ant|proj|svcacct)-)[A-Za-z0-9_-]{20,}\b/],
  ['anthropic_api_key', 'critical', /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ['langfuse_secret_key', 'critical', /\bsk-lf-[A-Za-z0-9-]{20,}\b/],
  ['hubspot_private_app_token', 'critical', /\bpat-[A-Za-z0-9-]{20,}\b/],
  ['slack_token', 'critical', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ['google_api_key', 'high', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['aws_access_key', 'critical', /\bAKIA[0-9A-Z]{16}\b/],
  ['stripe_live_secret', 'critical', /\bsk_live_[A-Za-z0-9]{20,}\b/],
  ['sendgrid_api_key', 'critical', /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{20,}\b/],
]
const secretEnvironmentFallback = /process\.env\.([A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|API_KEY|PRIVATE_KEY)[A-Z0-9_]*)\s*(?:\|\||\?\?)\s*(['"])([^'"\r\n]+)\2/g
const directSecretAssignment = /(?:const|let|var)\s+([A-Za-z0-9_]*(?:SECRET|TOKEN|PASSWORD|API_KEY|PRIVATE_KEY)[A-Za-z0-9_]*)\s*=\s*(['"])([^'"\r\n]{8,})\2/g
const literalBasicCredential = /Buffer\.from\(\s*(['"])([^'"\r\n]{8,}:[^'"\r\n]{8,})\1\s*\)/g

async function* textFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of entries) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      yield* textFiles(absolute)
      continue
    }
    if (!entry.isFile()) continue
    if (!textExtensions.has(path.extname(entry.name).toLowerCase()) && !entry.name.startsWith('.env')) continue
    yield absolute
  }
}

const findings = []
let filesScanned = 0
for await (const file of textFiles(root)) {
  filesScanned += 1
  const content = await readFile(file, 'utf8')
  const lines = content.split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const [rule, severity, pattern] of prefixRules) {
      if (pattern.test(line)) findings.push({ file: path.relative(root, file), line: index + 1, rule, severity })
    }
    secretEnvironmentFallback.lastIndex = 0
    for (const match of line.matchAll(secretEnvironmentFallback)) {
      findings.push({
        file: path.relative(root, file),
        line: index + 1,
        rule: 'nonempty_secret_environment_fallback',
        severity: 'high',
        detail: `environment variable ${match[1]} must fail closed when absent`,
      })
    }
    directSecretAssignment.lastIndex = 0
    for (const match of line.matchAll(directSecretAssignment)) {
      findings.push({
        file: path.relative(root, file),
        line: index + 1,
        rule: 'direct_secret_assignment',
        severity: 'critical',
        detail: `secret-like variable ${match[1]} is assigned a literal`,
      })
    }
    literalBasicCredential.lastIndex = 0
    if (literalBasicCredential.test(line)) {
      findings.push({
        file: path.relative(root, file),
        line: index + 1,
        rule: 'literal_basic_auth_credential',
        severity: 'critical',
        detail: 'Basic-auth credential material must come from secret-backed configuration',
      })
    }
  })
}

const result = {
  schema_version: 1,
  files_scanned: filesScanned,
  finding_count: findings.length,
  severity_counts: Object.fromEntries(
    ['critical', 'high', 'moderate', 'low'].map(severity => [severity, findings.filter(item => item.severity === severity).length]),
  ),
  findings,
  matched_values_recorded: false,
  status: findings.length === 0 ? 'clean' : 'findings_blocking_release',
}

console.log(JSON.stringify(result, null, 2))
process.exitCode = findings.length === 0 ? 0 : 1
