#!/usr/bin/env node
/**
 * YOS Website Screenshot Tool — Puppeteer
 * Takes screenshots at mobile, tablet, desktop widths
 * Usage: node scripts/screenshot.js [url]
 * Default URL: https://yos-website-greylh67y-joe-kelleys-projects-8f5ee275.vercel.app
 */

const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const URL = process.argv[2] || 'https://yos-website-greylh67y-joe-kelleys-projects-8f5ee275.vercel.app'
const OUT_DIR = path.join(__dirname, '..', 'screenshots')

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844, dpr: 2 },
  { name: 'tablet-768', width: 768, height: 1024, dpr: 2 },
  { name: 'desktop-1440', width: 1440, height: 900, dpr: 1 },
]

const PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/tenant-rep', name: 'tenant-rep' },
  { path: '/furniture', name: 'furniture' },
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

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  for (const vp of VIEWPORTS) {
    const vpDir = path.join(runDir, vp.name)
    fs.mkdirSync(vpDir, { recursive: true })

    for (const pg of PAGES) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr })

      try {
        await page.goto(`${URL}${pg.path}`, { waitUntil: 'networkidle2', timeout: 20000 })
        await new Promise(r => setTimeout(r, 1000))

        const file = path.join(vpDir, `${pg.name}.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log(`   ✓ ${vp.name}/${pg.name}`)
      } catch (e) {
        console.log(`   ✗ ${vp.name}/${pg.name} — ${e.message.slice(0, 80)}`)
      }

      await page.close()
    }
  }

  await browser.close()
  console.log(`\n✅ Done — ${runDir}\n`)
  return runDir
}

run().catch(e => { console.error(e.message); process.exit(1) })
