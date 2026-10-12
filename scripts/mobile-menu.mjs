import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer'
import axe from 'axe-core'

const configuredBase = process.env.MOBILE_MENU_BASE_URL
const base = configuredBase || 'http://127.0.0.1:3106'
const out = process.env.MOBILE_MENU_OUTPUT_DIR || 'screenshots/mobile-menu'
mkdirSync(out, { recursive: true })
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
let server, browser
const results = []
try {
  if (!configuredBase) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3106'], { stdio: 'ignore' })
    const deadline = Date.now() + 30000
    while (true) {
      try { if ((await fetch(base)).ok) break } catch { /* Wait for preview. */ }
      assert.ok(Date.now() < deadline, 'Preview did not start.')
      await new Promise(resolve => setTimeout(resolve, 250))
    }
  }
  browser = await puppeteer.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
  for (const width of [320, 390, 768, 1024]) {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setViewport({ width, height: 740 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.evaluateOnNewDocument(() => { sessionStorage.setItem('yos-service-guide-dismissed', '1'); localStorage.setItem('yos_analytics_consent', 'declined') })
    await page.setRequestInterception(true)
    page.on('request', request => request.method() === 'POST' ? request.abort() : request.continue())
    await page.goto(base, { waitUntil: 'networkidle2' })
    const openMenu = async () => {
      await page.click('button[aria-label="Open menu"]')
      await page.waitForSelector('button[aria-label="Close menu"]')
      await page.waitForFunction(() => document.querySelector('main').inert)
    }
    assert.equal(await page.$$eval('footer nav[aria-label="Flourish services"] a[href="/cleaning"]', items => items.length), 1)
    await openMenu()
    assert.equal(await page.$$eval('.yos-mobile-group-toggle[aria-expanded="true"]', items => items.length), 0)
    assert.equal(await page.$$eval('.yos-mobile-group-links a', items => items.filter(item => item.getClientRects().length).length), 0)
    assert.equal(await page.$$eval('.yos-mobile-nav-actions .site-search-trigger', items => items.length), 0)
    assert.equal(await page.$$eval('#mobile-navigation-menu .yos-mobile-simple-link', items => items.length), 2)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    assert.ok(await page.$eval('.yos-mobile-enquire', element => element.getBoundingClientRect().width >= innerWidth - 48), 'Full-width enquiry action.')
    const simpleRows = await page.$$eval('.yos-mobile-simple-link', items => items.map(item => ({ top: item.getBoundingClientRect().top, bottom: item.getBoundingClientRect().bottom })))
    assert.ok(simpleRows[1].top >= simpleRows[0].bottom - 1, 'About and Contact occupy separate rows.')
    const enquire = await page.$eval('.yos-mobile-enquire', element => ({ top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom }))
    assert.ok(enquire.top >= 72 && enquire.bottom <= 740, 'Enquiry is always visible.')
    await page.addScriptTag({ content: axe.source })
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))
    assert.deepEqual(violations, [])
    await page.screenshot({ path: `${out}/collapsed-${width}.png` })
    await page.$eval('.yos-mobile-call', element => element.focus())
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Your Office Space home')
    await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift')
    assert.ok(await page.evaluate(() => document.activeElement?.classList.contains('yos-mobile-call')))
    for (const key of ['services', 'care', 'resources']) {
      await page.click(`button[aria-controls="mobile-${key}-links"]`)
      assert.equal(await page.$$eval('.yos-mobile-group-toggle[aria-expanded="true"]', items => items.length), 1)
      assert.ok(await page.$eval(`#mobile-${key}-links`, element => !element.hidden))
      if (key === 'services' || key === 'care') assert.equal(await page.$$eval(`#mobile-${key}-links a[href="/cleaning"]`, items => items.length), 1, 'Cleaning belongs to both menu groups.')
      assert.ok(await page.$eval('.yos-mobile-enquire', element => element.getBoundingClientRect().bottom <= innerHeight))
    }
    await page.keyboard.press('Escape')
    await page.waitForSelector('#mobile-navigation-menu', { hidden: true })
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open menu')
    assert.equal(await page.$eval('main', element => element.inert), false)
    await openMenu()
    assert.equal(await page.$$eval('.yos-mobile-group-toggle[aria-expanded="true"]', items => items.length), 0, 'Reopening starts clean.')
    await page.click('#mobile-navigation-menu button[aria-label="Search"]')
    await page.waitForSelector('#site-search-title')
    await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'combobox')
    assert.equal(await page.$$eval('#site-search-title', items => items.length), 1)
    assert.ok(await page.$eval('#mobile-navigation-menu', element => element.hidden))
    await page.keyboard.press('Escape')
    await page.waitForSelector('#site-search-title', { hidden: true })
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open menu')
    await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control')
    await page.waitForSelector('#site-search-title')
    assert.equal(await page.$$eval('#site-search-title', items => items.length), 1, 'Shortcut opens one search dialog.')
    await page.keyboard.press('Escape')
    await page.waitForSelector('#site-search-title', { hidden: true })
    if ([320, 390].includes(width)) {
      await openMenu()
      await page.click('button[aria-controls="mobile-services-links"]')
      await page.screenshot({ path: `${out}/services-${width}.png` })
      await page.click('#mobile-services-links a[href="/office-fitout"]')
      await page.waitForFunction(() => location.pathname === '/office-fitout' && document.querySelector('#mobile-navigation-menu').hidden)
      await page.waitForFunction(() => !document.querySelector('main').inert)
      await openMenu()
      await page.click('.yos-mobile-enquire')
      await page.waitForFunction(() => location.pathname === '/contact' && location.hash === '#contact-enquiry' && document.querySelector('#contact-name')?.getBoundingClientRect().top < innerHeight)
    }
    await page.goto(base, { waitUntil: 'networkidle2' })
    await openMenu()
    await page.setViewport({ width: 1440, height: 900 })
    await page.waitForFunction(() => document.querySelector('#mobile-navigation-menu').hidden && !document.querySelector('main').inert)
    results.push({ width, collapsedGroups: 3, expandedOneAtATime: true, fixedEnquiry: true, search: true, shortcut: true, escape: true, wideScreenCleanup: true, axeViolations: violations })
    await context.close()
  }
  writeFileSync(`${out}/report.json`, JSON.stringify(results, null, 2))
  console.log('PASS mobile menu: four widths, collapsed groups, fixed enquiry, navigation, search, keyboard controls, desktop resize cleanup and accessibility.')
} finally { try { await browser?.close() } finally { server?.kill('SIGTERM') } }
