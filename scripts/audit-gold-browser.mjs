#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const baseUrl = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3099').replace(/\/$/, '')
const root = process.cwd()
const outDir = path.join(root, 'audit')
const executableCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  `${process.env.HOME}/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
  '/opt/homebrew/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const executablePath = executableCandidates.find(candidate => fs.existsSync(candidate))

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`)
if (!sitemapResponse.ok) throw new Error(`Sitemap HTTP ${sitemapResponse.status}`)
const sitemap = await sitemapResponse.text()
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname)

const browser = await puppeteer.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})

const pages = []
try {
  for (const route of routes) {
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const findings = await page.evaluate(() => {
      const visible = [...document.body.querySelectorAll('*')].filter(element => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
      })
      const unique = list => [...new Set(list)].slice(0, 20)
      return {
        nonCanonicalFonts: unique(visible.filter(el => !getComputedStyle(el).fontFamily.toLowerCase().includes('montserrat')).map(el => el.tagName.toLowerCase())),
        shadows: unique(visible.filter(el => getComputedStyle(el).boxShadow !== 'none' || getComputedStyle(el).textShadow !== 'none').map(el => el.tagName.toLowerCase())),
        gradients: unique(visible.filter(el => /gradient/i.test(getComputedStyle(el).backgroundImage)).map(el => el.tagName.toLowerCase())),
        italics: unique(visible.filter(el => getComputedStyle(el).fontStyle === 'italic').map(el => el.tagName.toLowerCase())),
        excessiveRadii: unique(visible.filter(el => {
          if (el instanceof HTMLInputElement && ['radio', 'range'].includes(el.type)) return false
          return parseFloat(getComputedStyle(el).borderTopLeftRadius) > 4
        }).map(el => el.tagName.toLowerCase())),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      }
    })
    const passed = Object.entries(findings).every(([, value]) => Array.isArray(value) ? value.length === 0 : value === false)
    pages.push({ route, status: response?.status() || 0, passed, findings })
    await page.close()
  }
} finally {
  await browser.close()
}

const report = {
  standard: 'YOS Brand & Design Gold Standard v3.1 browser rendering gate',
  generatedAt: new Date().toISOString(),
  baseUrl,
  pageCount: pages.length,
  passingPages: pages.filter(page => page.passed && page.status === 200).length,
  pages,
}
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'gold-v31-browser-audit.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ pageCount: report.pageCount, passingPages: report.passingPages }))
if (report.passingPages !== report.pageCount) process.exitCode = 1
