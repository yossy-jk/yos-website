import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer'
import axe from 'axe-core'

const configuredBase = process.env.HOME_GUIDE_BASE_URL
const base = configuredBase || 'http://127.0.0.1:3105'
const out = process.env.HOME_GUIDE_OUTPUT_DIR || 'screenshots/home-service-guide'
mkdirSync(out, { recursive: true })
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
let server, browser
const results = []
try {
  if (!configuredBase) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3105'], { stdio: 'ignore' })
    const deadline = Date.now() + 30000
    while (true) {
      try { if ((await fetch(base)).ok) break } catch { /* Wait for preview. */ }
      assert.ok(Date.now() < deadline, 'Local preview did not start.')
      await new Promise(resolve => setTimeout(resolve, 250))
    }
  }
  browser = await puppeteer.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setCacheEnabled(false)
    await page.setViewport({ width, height: width <= 390 ? 740 : 900 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.setRequestInterception(true)
    page.on('request', request => request.method() === 'POST' ? request.abort() : request.continue())
    await page.goto(base, { waitUntil: 'networkidle2' })
    await page.waitForSelector('#home-service-guide-overlay')
    assert.equal(await page.$('.analytics-consent-panel'), null)
    assert.equal(await page.$('.analytics-consent-trigger'), null)
    assert.equal(await page.$('#hs-script-loader'), null)
    const links = await page.$$eval('#home-service-guide-overlay a', items => items.map(item => item.getAttribute('href')))
    assert.deepEqual(links, ['/tenant-rep', '/buyers-agency', '/office-fitout', '/furniture', '/cleaning', '/flourish', '/resources/fitout-estimator'])
    assert.ok(await page.$eval('.home-guide-panel', element => element.getBoundingClientRect().width <= innerWidth))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Close service guide')
    await page.keyboard.down('Shift')
    await page.keyboard.press('Tab')
    await page.keyboard.up('Shift')
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Browse the homepage')
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close service guide')
    await page.addScriptTag({ content: axe.source })
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))
    assert.deepEqual(violations, [])
    await page.screenshot({ path: `${out}/guide-${width}.png` })
    await page.keyboard.press('Escape')
    await page.waitForSelector('#home-service-guide-overlay', { hidden: true })
    await page.waitForFunction(() => document.activeElement?.classList.contains('home-guide-trigger'))
    assert.equal(await page.$eval('main', element => element.inert), false)
    await page.reload({ waitUntil: 'networkidle2' })
    await new Promise(resolve => setTimeout(resolve, 900))
    assert.equal(await page.$('#home-service-guide-overlay'), null, 'Dismissal survives revisits in this session.')
    if ([320, 1440].includes(width)) for (const href of links) {
      await page.goto(base, { waitUntil: 'networkidle2' })
      await page.click('.home-guide-trigger')
      await page.waitForSelector('#home-service-guide-overlay')
      const link = await page.$(`#home-service-guide-overlay a[href="${href}"]`)
      await link.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await link.click()
      await page.waitForFunction(path => location.pathname === path, {}, href)
      await page.waitForSelector('main h1')
      assert.equal(await page.$('.analytics-consent-panel'), null, 'Navigation must not open analytics preferences.')
      assert.equal(await page.$('.analytics-consent-trigger'), null)
      assert.equal(await page.$('#hs-script-loader'), null)
      assert.equal(await page.$('#home-service-guide-overlay'), null)
    }
    await page.goto(base, { waitUntil: 'networkidle2' })
    const settings = await page.$('.footer-privacy-settings')
    await settings.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await settings.click()
    await page.waitForSelector('.analytics-consent-panel')
    await page.click('.analytics-consent-panel button:nth-of-type(2)')
    await page.waitForSelector('.analytics-consent-panel', { hidden: true })
    assert.equal(await page.$('.analytics-consent-trigger'), null)
    assert.equal(await page.evaluate(() => localStorage.getItem('yos_analytics_consent')), 'declined')
    assert.equal(await page.$('#hs-script-loader'), null)
    results.push({ width, serviceLinks: links.length, focusTrap: true, escapeDismissal: true, sessionDismissal: true, manualPrivacySettings: true, axeViolations: violations })
    await context.close()
  }
  writeFileSync(`${out}/report.json`, JSON.stringify(results, null, 2))
  console.log('PASS homepage guide: four screen sizes, seven destinations, focus and dismissal, no automatic homepage privacy prompt, manual privacy settings and no optional analytics without consent.')
} finally {
  try { await browser?.close() } finally { server?.kill('SIGTERM') }
}
