#!/usr/bin/env node
/**
 * YOS Website Screenshot Tool — Puppeteer
 * Takes screenshots at mobile, tablet, desktop widths
 * Usage: node scripts/screenshot.js [url]
 * Default URL: https://yos-website-greylh67y-joe-kelleys-projects-8f5ee275.vercel.app
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const URL = process.argv[2] || 'https://www.yourofficespace.au'
const OUT_DIR = path.join(__dirname, '..', 'screenshots')

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 800, dpr: 2 },
  { name: 'mobile-390', width: 390, height: 844, dpr: 2 },
  { name: 'tablet-768', width: 768, height: 1024, dpr: 2 },
  { name: 'tablet-1024', width: 1024, height: 768, dpr: 2 },
  { name: 'desktop-1440', width: 1440, height: 900, dpr: 1 },
]

const PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/tenant-rep', name: 'tenant-rep' },
  { path: '/office-fitout', name: 'office-fitout' },
  { path: '/furniture', name: 'furniture' },
  { path: '/cleaning', name: 'cleaning' },
  { path: '/resources', name: 'resources' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
]

async function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const runDir = path.join(OUT_DIR, timestamp)
  fs.mkdirSync(runDir, { recursive: true })

  console.log(`\n📸 YOS Screenshot Tool`)
  console.log(`   URL: ${URL}`)
  console.log(`   Output: ${runDir}\n`)

  const executablePath = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/opt/homebrew/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean).find(fs.existsSync)
  const browser = await puppeteer.launch({
    headless: 'new',
    ...(executablePath ? { executablePath } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  const failures = []

  for (const vp of VIEWPORTS) {
    const vpDir = path.join(runDir, vp.name)
    fs.mkdirSync(vpDir, { recursive: true })

    for (const pg of PAGES) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr })

      try {
        await page.goto(`${URL}${pg.path}`, { waitUntil: 'networkidle2', timeout: 20000 })
        await page.evaluate(() => {
          const essentialOnly = [...document.querySelectorAll('button')]
            .find(button => button.textContent?.trim() === 'Essential only')
          essentialOnly?.click()
        })
        await page.evaluate(async () => {
          const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
          document.documentElement.style.scrollBehavior = 'auto'
          const step = Math.max(window.innerHeight * 0.8, 480)
          for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
            window.scrollTo({ top, behavior: 'auto' })
            await pause(120)
          }

          await Promise.all([...document.images].map(image => {
            if (image.complete) return Promise.resolve()
            return new Promise(resolve => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            })
          }))

          window.scrollTo({ top: 0, behavior: 'auto' })
          while (window.scrollY !== 0) {
            await pause(25)
            window.scrollTo({ top: 0, behavior: 'auto' })
          }

          if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
          document.querySelectorAll('.skip-link').forEach(link => {
            if (link instanceof HTMLElement) link.style.display = 'none'
          })
          document.querySelectorAll('nav.fixed.top-0').forEach(nav => {
            if (nav instanceof HTMLElement) nav.style.position = 'absolute'
          })
          await pause(400)
        })

        const file = path.join(vpDir, `${pg.name}.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log(`   ✓ ${vp.name}/${pg.name}`)
      } catch (e) {
        console.log(`   ✗ ${vp.name}/${pg.name} — ${e.message.slice(0, 80)}`)
        failures.push(`${vp.name}/${pg.name}: ${e.message}`)
      }

      await page.close()
    }
  }

  await browser.close()
  if (failures.length) throw new Error(`Screenshot capture failed:\n${failures.join('\n')}`)
  console.log(`\n✅ Done — ${runDir}\n`)
  return runDir
}

run().catch(e => { console.error(e.message); process.exit(1) })
