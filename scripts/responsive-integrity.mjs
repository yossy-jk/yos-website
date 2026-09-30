#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer'

const host = '127.0.0.1'
const port = process.env.RESPONSIVE_PORT || '3101'
const configuredBaseUrl = process.env.RESPONSIVE_BASE_URL
const baseUrl = configuredBaseUrl || `http://${host}:${port}`
const widths = [320, 390, 768, 820, 1024, 1280, 1440]
const routes = ['/', '/tenant-rep', '/office-fitout', '/furniture', '/cleaning', '/about', '/contact', '/resources', '/resources/fitout-estimator']
const executablePath = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  '/opt/homebrew/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean).find(existsSync)
let server

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' })
      if (response.status < 500) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error(`Timed out waiting for ${url}`)
}

try {
  if (!configuredBaseUrl) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', host, '--port', port], { stdio: ['ignore', 'pipe', 'pipe'] })
    server.stderr.on('data', chunk => process.stderr.write(chunk))
    await waitForServer(baseUrl)
  }

  const browser = await puppeteer.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] })
  const failures = []
  try {
    for (const route of routes) {
      for (const width of widths) {
        const page = await browser.newPage()
        await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
        try {
          const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle2', timeout: 30_000 })
          if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() ?? 'unknown'}`)
          const result = await page.evaluate(() => ({
            viewport: window.innerWidth,
            pageWidth: document.documentElement.scrollWidth,
            h1Count: document.querySelectorAll('h1').length,
            logoLoaded: [...document.images].some(image => image.alt === 'Your Office Space' && image.complete && image.naturalWidth > 0),
            brokenImages: [...document.images].filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src),
            clippedElements: [...document.querySelectorAll('main *')].filter(element => {
              const style = getComputedStyle(element)
              if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed') return false
              const rect = element.getBoundingClientRect()
              return rect.width > 0 && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
            }).slice(0, 10).map(element => `${element.tagName.toLowerCase()}.${String(element.className).split(' ').slice(0, 2).join('.')}`),
            homeServiceColumns: (() => {
              const grid = document.querySelector('.home-service-grid')
              return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length : null
            })(),
            top: window.scrollY,
          }))
          // Puppeteer's Linux Chrome can reserve a narrow vertical-scrollbar gutter
          // at the 768px breakpoint, making window.innerWidth smaller than the
          // requested viewport even when the page itself is not horizontally clipped.
          const overflow = result.pageWidth - width
          const mobileServiceFailure = route === '/' && width <= 390 && result.homeServiceColumns !== 2
          if (overflow > 1 || result.h1Count !== 1 || !result.logoLoaded || result.top !== 0 || result.brokenImages.length || result.clippedElements.length || mobileServiceFailure) {
            failures.push(`${route} @ ${width}px: overflow=${overflow}px, h1=${result.h1Count}, logo=${result.logoLoaded}, scrollY=${result.top}, brokenImages=${result.brokenImages.length}, clipped=${result.clippedElements.join('|') || 'none'}, serviceColumns=${result.homeServiceColumns ?? 'n/a'}`)
          } else {
            console.log(`PASS ${route} @ ${width}px`)
          }
        } finally {
          await page.close()
        }
      }
    }
  } finally {
    await browser.close()
  }
  if (failures.length) throw new Error(`Responsive integrity failures:\n${failures.join('\n')}`)
  console.log(`Responsive integrity gate passed on ${routes.length * widths.length} route/viewport combinations.`)
} finally {
  if (server && !server.killed) server.kill('SIGTERM')
}
