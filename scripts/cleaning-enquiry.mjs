import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'
import axe from 'axe-core'

const configuredBase = process.env.CLEANING_QA_BASE_URL
const base = configuredBase || 'http://127.0.0.1:3103'
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Submission tests run only against a local preview.')
const out = process.env.CLEANING_QA_OUTPUT_DIR || 'screenshots/cleaning-enquiry'
mkdirSync(out, { recursive: true })
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
let server, browser
const results = []
try {
  if (!configuredBase) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3103'], { stdio: 'ignore' })
    const deadline = Date.now() + 30000
    while (true) {
      try { if ((await fetch(base)).ok) break } catch { /* Wait for local preview. */ }
      assert.ok(Date.now() < deadline, 'Local preview did not start.')
      await new Promise(resolve => setTimeout(resolve, 250))
    }
  }
  browser = await puppeteer.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    await page.setViewport({ width, height: 900 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.setRequestInterception(true)
    let emailStatus = 503, crmStatus = 503
    const submitted = []
    page.on('request', async request => {
      const target = new URL(request.url())
      if (request.method() === 'POST' && ['/api/contact', '/api/hubspot'].includes(target.pathname)) {
        assert.equal(target.origin, new URL(base).origin)
        submitted.push({ endpoint: target.pathname, body: JSON.parse(request.postData()) })
        const status = target.pathname === '/api/contact' ? emailStatus : crmStatus
        await request.respond({ status, contentType: 'application/json', body: JSON.stringify({ ok: status === 200 }) })
      } else await request.continue()
    })
    const load = async () => {
      const response = await page.goto(`${base}/cleaning`, { waitUntil: 'networkidle2' })
      assert.equal(response.status(), 200)
      await page.evaluate(() => [...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Essential only')?.click())
      await page.waitForSelector('#cleaning-quote-form form')
    }
    await load()
    const structure = await page.evaluate(() => ({
      quoteLinks: document.querySelectorAll('main a[href="#cleaning-quote-form"]').length,
      forms: document.querySelectorAll('main form').length,
      service: document.querySelector('input[name="service"]')?.value,
      serviceChooser: Boolean(document.querySelector('#contact-service')),
      reviewsBeforeServices: document.querySelector('#cleaning-reviews-heading')?.closest('section').nextElementSibling.textContent.includes('What we clean'),
      reviews: document.querySelectorAll('[aria-label^="Show review from "]').length,
      overflow: document.documentElement.scrollWidth > innerWidth + 8,
      embed: [...document.scripts].some(script => script.src.includes('hsforms')),
    }))
    assert.equal(structure.quoteLinks, 4)
    assert.equal(structure.forms, 1)
    assert.equal(structure.service, 'Cleaning')
    assert.equal(structure.serviceChooser, false)
    assert.equal(structure.reviewsBeforeServices, true)
    assert.equal(structure.reviews, 8)
    assert.equal(structure.overflow, false)
    assert.equal(structure.embed, false)
    for (const link of await page.$$('main a[href="#cleaning-quote-form"]')) {
      await link.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await link.click()
      await page.waitForFunction(() => {
        const top = document.querySelector('#cleaning-quote-form').getBoundingClientRect().top
        return top >= 80 && top < 115 && location.hash === '#cleaning-quote-form'
      })
      const nameTop = await page.$eval('#contact-name', element => element.getBoundingClientRect().top)
      assert.ok(nameTop > 64 && nameTop < 900, `Name field not visible after CTA at ${width}px: ${nameTop}`)
    }
    await page.addScriptTag({ content: axe.source })
    const violations = await page.evaluate(async () => (await axe.run(document.querySelector('main'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))
    assert.deepEqual(violations, [])
    await page.screenshot({ path: path.join(out, `cleaning-form-${width}.png`) })
    await page.click('form button[type="submit"]')
    assert.equal(submitted.length, 0, 'Invalid form reached delivery endpoints.')
    await page.waitForFunction(() => document.activeElement.id === 'contact-name')
    assert.equal(await page.evaluate(() => document.activeElement.id), 'contact-name')
    await page.type('#contact-name', 'Local enquiry check')
    await page.type('#contact-email', 'qa@example.invalid')
    await page.click('form button[type="submit"]')
    await page.waitForFunction(() => document.body.innerText.includes('We could not confirm delivery'))
    assert.equal(await page.$eval('#contact-email', element => element.value), 'qa@example.invalid', 'Failure discarded the enquiry.')
    assert.equal(await page.$('form') !== null, true)
    emailStatus = 200
    await page.click('form button[type="submit"]')
    await page.waitForFunction(() => document.body.innerText.includes('Message received.'))
    assert.equal(await page.$('form'), null)
    await load()
    emailStatus = 503; crmStatus = 200
    await page.type('#contact-name', 'Local enquiry check')
    await page.type('#contact-email', 'qa@example.invalid')
    await page.click('form button[type="submit"]')
    await page.waitForFunction(() => document.body.innerText.includes('Message received.'))
    assert.equal(submitted.length, 6)
    assert.ok(submitted.every(item => item.body.source === 'Contact Form — Cleaning'))
    assert.ok(submitted.filter(item => item.endpoint === '/api/hubspot').every(item => item.body.context.startsWith('Service: Cleaning')))
    await page.click('[aria-label="Next review"]')
    assert.equal(await page.$eval('.cleaning-reviews figcaption strong', element => element.textContent), 'Beth Gwalter')
    await page.click('[aria-label="Previous review"]')
    assert.equal(await page.$eval('.cleaning-reviews figcaption strong', element => element.textContent), 'Sophie Collinson')
    await page.click('[aria-label="Show review from Kristy Cashman"]')
    await page.click('[aria-label="Next review"]')
    assert.equal(await page.$eval('.cleaning-reviews figcaption strong', element => element.textContent), 'Sophie Collinson')
    await page.$eval('.cleaning-reviews', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.screenshot({ path: path.join(out, `cleaning-reviews-${width}.png`) })
    results.push({ width, quoteButtons: 4, nativeForm: true, validation: true, preservesFailedEnquiry: true, emailOnlyReceipt: true, crmOnlyReceipt: true, reviewControls: true, accessibilityViolations: 0 })
    await page.close()
  }
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.goto(`${base}/cleaning`, { waitUntil: 'networkidle2' })
  await page.mouse.move(0, 0)
  await page.waitForFunction(() => { const name = document.querySelector('.cleaning-reviews figcaption strong')?.textContent; return name && name !== 'Sophie Collinson' }, { timeout: 12000 })
  writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, automaticReviewRotation: true }, null, 2))
  console.log('PASS cleaning enquiries: 16 CTA jumps, validation, both delivery fallbacks, accessibility and testimonial navigation/rotation.')
} finally {
  await browser?.close()
  server?.kill()
}
