import assert from 'node:assert/strict'
import { existsSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import puppeteer from 'puppeteer'
const base = process.env.QA_BASE || 'http://127.0.0.1:3144'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname))
const out = process.env.QA_OUT || 'screenshots/lease-check-flow'
mkdirSync(out, { recursive: true })
const temp = mkdtempSync(`${tmpdir()}/yos-lease-qa-`)
const file = `${temp}/qa-lease.pdf`, oversized = `${temp}/oversized.pdf`
writeFileSync(file, '%PDF-1.4\nSynthetic YOS test document, no client data\n%%EOF')
writeFileSync(oversized, Buffer.alloc(3 * 1024 * 1024 + 1))
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
const browser = await puppeteer.launch({ headless: true, pipe: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
const rows = []
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 950 })
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('yos-service-guide-dismissed', '1')
      window.__leaseQA = []
      const original = window.fetch.bind(window)
      window.fetch = (url, options) => {
        if (options?.method === 'POST') {
          const multipart = options.body instanceof FormData
          window.__leaseQA.push({ endpoint: String(url), payload: JSON.parse(multipart ? options.body.get('payload') : options.body), lease: multipart ? options.body.get('lease')?.name : null })
        }
        return original(url, options)
      }
    })
    let failure = false
    const posts = []
    await page.setRequestInterception(true)
    page.on('request', async request => {
      if (request.method() === 'POST') {
        posts.push({ path: new URL(request.url()).pathname, contentType: request.headers()['content-type'] })
        return request.respond({ status: failure ? 502 : 200, contentType: 'application/json', body: JSON.stringify({ ok: !failure }) })
      }
      return request.continue()
    })
    const clickText = async text => page.evaluate(text => [...document.querySelectorAll('main button')].find(b => b.textContent.trim() === text)?.click(), text)
    console.log(`CHECK Health Check @ ${width}`)
    await page.goto(base + '/lease-health-check', { waitUntil: 'networkidle2' })
    assert.equal(await page.$('#health_check-email'), null)
    await page.select('#health-intent', 'stay')
    await page.click('form button[type=submit]')
    await page.waitForFunction(() => document.body.innerText.includes('Step 2 of 3'))
    assert.equal(await page.$('#health_check-email'), null)
    await page.click('form button[type=submit]')
    await page.waitForSelector('#health_check-email')
    await page.click('form button[type=submit]')
    assert.equal(posts.length, 0, 'Final contact details are required')
    for (const [id, value] of [['name', 'YOS QA'], ['email', 'qa@example.invalid'], ['business', 'YOS QA'], ['mobile', '0240920733'], ['suburb', 'Newcastle']]) await page.type(`#health_check-${id}`, value)
    assert.equal(await page.$eval('input[type=file]', e => e.required), false)
    await (await page.$('input[type=file]')).uploadFile(oversized)
    await page.click('form button[type=submit]')
    assert.equal(posts.length, 0, 'Oversized file cannot be sent')
    await clickText('Remove lease')
    await page.click('form button[type=submit]')
    await page.waitForSelector('.tenant-results')
    assert.equal(posts.at(-1).contentType, 'application/json')
    const resourceLinks = await page.$$eval('[aria-label="Useful leasing tools and articles"] a', els => els.map(e => e.getAttribute('href')))
    assert.equal(resourceLinks.length, 6)
    assert.ok(await page.$eval('[aria-label="Useful leasing tools and articles"] a', a => a.querySelector('span').getBoundingClientRect().top >= a.querySelector('strong').getBoundingClientRect().bottom), 'Resource descriptions must sit below their titles')
    for (const href of resourceLinks) assert.equal((await fetch(base + href)).status, 200, href)
    await clickText('Edit my details')
    await page.waitForSelector('input[type=file]')
    await (await page.$('input[type=file]')).uploadFile(file)
    failure = true
    const before = posts.length
    await page.click('form button[type=submit]')
    await page.waitForSelector('form [role=alert]')
    assert.equal(posts.length, before + 1, 'Attachment must not be silently omitted by an email-only fallback')
    assert.equal(await page.$eval('input[type=file]', e => e.files[0].name), 'qa-lease.pdf')
    const failed = await page.evaluate(() => window.__leaseQA.at(-1))
    failure = false
    await page.click('form button[type=submit]')
    await page.waitForSelector('.tenant-results')
    assert.ok((await page.$eval('.tenant-results', e => e.innerText)).includes('Your lease was included'))
    const sent = await page.evaluate(() => window.__leaseQA.at(-1))
    assert.equal(sent.lease, 'qa-lease.pdf')
    assert.equal(failed.payload.submissionId, sent.payload.submissionId)
    assert.equal(sent.payload.marketingConsent, false)
    await page.$eval('.tenant-results', e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.screenshot({ path: `${out}/health-receipt-${width}.png` })
    rows.push({ width, path: '/lease-health-check', contactLast: true, noFileAccepted: true, optionalUpload: true, preservesFileOnFailure: true, links: 6 })

    console.log(`CHECK Risk Review @ ${width}`)
    await page.goto(base + '/resources/lease-review', { waitUntil: 'networkidle2' })
    await clickText('Start the checker')
    for (let i = 0; i < 10; i++) {
      await page.waitForSelector('main button[aria-pressed]')
      const heading = await page.$eval('main h2[tabindex="-1"]', e => e.textContent)
      await page.click('main button[aria-pressed]')
      await clickText(i === 9 ? 'See my results' : 'Next')
      await page.waitForFunction(previous => document.querySelector('main h2[tabindex="-1"]')?.textContent !== previous, {}, heading)
    }
    await page.waitForSelector('#lease-risk-name')
    assert.equal(await page.$eval('input[type=file]', e => e.required), false)
    await page.type('#lease-risk-name', 'YOS QA')
    await page.type('#lease-risk-email', 'qa@example.invalid')
    await page.click('form button[type=submit]')
    await page.waitForSelector('[aria-label="Useful leasing tools and articles"]')
    assert.equal((await page.evaluate(() => window.__leaseQA.at(-1))).lease, null)
    rows.push({ width, path: '/resources/lease-review', contactLast: true, noFileAccepted: true, resources: true })
    await page.reload({ waitUntil: 'networkidle2' })
    await clickText('Start the checker')
    for (let i = 0; i < 10; i++) {
      await page.waitForSelector('main button[aria-pressed]')
      const heading = await page.$eval('main h2[tabindex="-1"]', e => e.textContent)
      await page.click('main button[aria-pressed]')
      await clickText(i === 9 ? 'See my results' : 'Next')
      await page.waitForFunction(previous => document.querySelector('main h2[tabindex="-1"]')?.textContent !== previous, {}, heading)
    }
    await page.waitForSelector('input[type=file]')
    await page.type('#lease-risk-name', 'YOS QA')
    await page.type('#lease-risk-email', 'qa@example.invalid')
    await (await page.$('input[type=file]')).uploadFile(file)
    failure = true
    await page.click('form button[type=submit]')
    await page.waitForSelector('form [role=alert]')
    assert.equal(await page.$eval('input[type=file]', e => e.files[0].name), 'qa-lease.pdf')
    const failedRisk = await page.evaluate(() => window.__leaseQA.at(-1))
    failure = false
    await page.click('form button[type=submit]')
    await page.waitForSelector('[aria-label="Useful leasing tools and articles"]')
    const sentRisk = await page.evaluate(() => window.__leaseQA.at(-1))
    assert.equal(sentRisk.lease, 'qa-lease.pdf')
    assert.equal(sentRisk.payload.submissionId, failedRisk.payload.submissionId)
    rows.push({ width, path: '/resources/lease-review', withFileAccepted: true, failedRetry: true })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), true)
    await page.close()
  }
  writeFileSync(`${out}/report.json`, JSON.stringify(rows, null, 2))
  console.log('PASS lease checks: contact details last, with/without optional lease, file limits, preserved retry, no dropped attachment, and six working tools/articles links at mobile/desktop. All POSTs mocked.')
} finally { await browser.close(); rmSync(temp, { recursive: true, force: true }) }
