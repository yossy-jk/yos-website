#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import axe from 'axe-core'
import puppeteer from 'puppeteer'

const host = '127.0.0.1'
const port = process.env.AXE_PORT || '3100'
const configuredBaseUrl = process.env.AXE_BASE_URL
const baseUrl = configuredBaseUrl || `http://${host}:${port}`
const routes = [
  '/',
  '/about',
  '/tenant-rep',
  '/newcastle-commercial-property',
  '/buyers-agency',
  '/resources',
  '/blog',
]

const executableCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  process.env.CHROME_BIN,
  '/opt/homebrew/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const executablePath = executableCandidates.find((candidate) => existsSync(candidate))
let server

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' })
      if (response.status < 500) return
    } catch {
      // The production server can take a moment to bind its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Timed out waiting for ${url}`)
}

function startProductionServer() {
  return spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', host, '--port', port],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  )
}

function formatViolation(route, violation) {
  const targets = violation.nodes
    .flatMap((node) => node.target)
    .slice(0, 5)
    .join(', ')

  return [
    `${route}: [${violation.impact || 'unknown'}] ${violation.id} — ${violation.help}`,
    `  ${violation.helpUrl}`,
    `  Targets: ${targets}`,
  ].join('\n')
}

async function run() {
  if (!configuredBaseUrl) {
    server = startProductionServer()
    server.stderr.on('data', (chunk) => process.stderr.write(chunk))
    await waitForServer(baseUrl)
  }

  const browser = await puppeteer.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  const violations = []

  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

      try {
        const response = await page.goto(`${baseUrl}${route}`, {
          waitUntil: 'networkidle2',
          timeout: 30_000,
        })

        if (!response || response.status() >= 400) {
          throw new Error(`HTTP ${response?.status() ?? 'unknown'}`)
        }

        await page.evaluate(axe.source)
        const result = await page.evaluate(async () => {
          return window.axe.run(document, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
            },
          })
        })

        if (result.violations.length === 0) {
          console.log(`PASS ${route} — 0 WCAG A/AA axe violations`)
        } else {
          violations.push(...result.violations.map((violation) => ({ route, violation })))
          console.error(`FAIL ${route} — ${result.violations.length} axe violation(s)`)
        }
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }

  if (violations.length > 0) {
    console.error('\nAccessibility violations:')
    for (const { route, violation } of violations) {
      console.error(formatViolation(route, violation))
    }
    process.exitCode = 1
    return
  }

  console.log(`Axe accessibility gate passed on ${routes.length} routes.`)
}

try {
  await run()
} finally {
  if (server && !server.killed) server.kill('SIGTERM')
}
