import puppeteer from 'puppeteer'
import axe from 'axe-core'
import assert from 'node:assert/strict'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
const base = process.env.QA_BASE || 'http://127.0.0.1:3191'
const out = process.env.QA_OUT || '/tmp/cleaning-campaign-qa'
await mkdir(out, { recursive: true })
const paths = ['/cleaning', '/blog/office-cleaning-frequency-newcastle', '/blog/after-hours-office-cleaning-newcastle']
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
const browser = await puppeteer.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
const results = []
try {
  for (const path of paths) for (const width of [390, 768, 1440]) {
    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    await page.setViewport({ width, height: 1000 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.setRequestInterception(true)
    page.on('request', request => {
      const url = new URL(request.url())
      if (request.method() !== 'GET' || (!['data:', 'blob:'].includes(url.protocol) && url.origin !== new URL(base).origin)) request.abort()
      else request.continue()
    })
    const response = await page.goto(base + path, { waitUntil: 'networkidle2' })
    assert.equal(response.status(), 200)
    await page.evaluate(() => document.fonts.ready)
    const data = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document.querySelector('meta[name="robots"]')?.content,
      h1: [...document.querySelectorAll('h1')].map(el => el.textContent),
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      templateLinks: document.querySelectorAll('a[href="/guides/office-cleaning-planning-template.txt"]').length,
      quoteLinks: document.querySelectorAll('a[href="/cleaning#cleaning-quote-form"],a[href="#cleaning-quote-form"]').length,
      schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
      text: document.querySelector('main')?.innerText,
    }))
    assert.equal(data.canonical, 'https://www.yourofficespace.au' + path)
    assert.equal(data.h1.length, 1)
    assert.equal(data.overflow, false)
    assert.ok(!data.robots?.includes('noindex'))
    assert.ok(data.templateLinks > 0)
    assert.ok(data.quoteLinks > 0)
    assert.ok(data.text.includes('Newcastle CBD') && data.text.includes('Lake Macquarie'))
    if (path === '/cleaning') {
      const form = await page.$('#cleaning-quote-form form')
      assert.ok(form)
      assert.ok(await page.$('#office-cleaning-newcastle'))
    }
    await page.addScriptTag({ content: axe.source })
    const a11y = await page.evaluate(async () => (await window.axe.run('main', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations)
    assert.deepEqual(a11y.map(v => v.id), [])
    if (width === 390) await page.screenshot({ path: `${out}/${path.split('/').pop()}-390.png`, fullPage: true })
    results.push({ path, width, ...data, text: undefined, axeViolations: a11y.length })
    await page.close()
  }
  const sitemap = await fetch(base + '/sitemap.xml').then(r => r.text())
  for (const path of paths) assert.ok(sitemap.includes('https://www.yourofficespace.au' + path))
  const template = await fetch(base + '/guides/office-cleaning-planning-template.txt')
  assert.equal(template.status, 200)
  assert.ok((await template.text()).includes('DO NOT RECORD PASSWORDS'))
  await writeFile(out + '/checks.json', JSON.stringify({ base, journeys: results, template: '200; correct bytes', sitemap: 'all three present', submissions: 0 }, null, 2))
  console.log('PASS: nine responsive journeys, metadata, schema, scoped axe, template and sitemap; no submissions.')
} finally { await browser.close() }
