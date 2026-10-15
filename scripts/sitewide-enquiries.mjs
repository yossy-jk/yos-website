import assert from 'node:assert/strict'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer'
const base = process.env.QA_BASE || 'http://127.0.0.1:3143'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname))
const out = process.env.QA_OUT || 'screenshots/sitewide-enquiries'
mkdirSync(out, { recursive: true })
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
const browser = await puppeteer.launch({ headless: true, pipe: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
const report = []
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 950 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    const clickSubmit = async selector => {
      const button = await page.waitForSelector(selector, { visible: true })
      await button.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await button.click()
    }
    await page.evaluateOnNewDocument(() => { sessionStorage.setItem('yos-service-guide-dismissed', '1'); localStorage.removeItem('yos_tool_unlocked_office_size_calculator') })
    const requests = []
    let status = 200
    await page.setRequestInterception(true)
    page.on('request', async request => {
      if (request.method() === 'POST') {
        const url = new URL(request.url())
        assert.equal(url.origin, new URL(base).origin, 'No external form or CRM request allowed')
        assert.equal(url.pathname, '/api/enquiry')
        requests.push(JSON.parse(request.postData()))
        return request.respond({ status, contentType: 'application/json', body: JSON.stringify({ ok: status === 200 }) })
      }
      return request.continue()
    })
    for (const [path, service] of [
      ['/contact?service=buying', 'Buying'],
      ['/contact?service=furniture', 'Furniture'],
      ['/contact?service=leasing', 'Leasing'],
    ]) {
      console.log(`CHECK ${path} @ ${width}`)
      await page.goto(base + path, { waitUntil: 'networkidle2' })
      await page.waitForSelector('#contact-name')
      assert.equal(await page.$eval('input[name=service]', e => e.value), service)
      assert.equal(await page.$$eval('script[src]', elements => elements.some(e => /hsforms|hs-scripts/.test(e.src))), false)
      await page.type('#contact-name', 'YOS Browser QA')
      await page.type('#contact-email', 'qa@example.invalid')
      await clickSubmit('form button[type=submit]')
      await page.waitForFunction(() => document.body.innerText.includes('Message received.'))
      assert.equal(requests.at(-1).source, `Contact Form — ${service}`)
      report.push({ width, path, directEmail: true })
    }
    console.log(`CHECK blog/NFP/tool @ ${width}`)
    for (const [legacy, destination] of [['furniture', '/furniture'], ['tenant-representation', '/tenant-rep'], ['lease-review', '/lease-review']]) {
      await page.goto(`${base}/eof-group/${legacy}`, { waitUntil: 'networkidle2' })
      assert.equal(new URL(page.url()).pathname, destination)
      assert.equal(await page.$$eval('script[src]', elements => elements.some(e => /hsforms|hs-scripts/.test(e.src))), false)
    }
    await page.goto(base + '/blog', { waitUntil: 'networkidle2' })
    await page.type('#blog-email', 'qa@example.invalid')
    status = 502
    await clickSubmit('form:has(#blog-email) button[type=submit]')
    await page.waitForSelector('form:has(#blog-email) [role=alert]')
    assert.equal(await page.$eval('#blog-email', e => e.value), 'qa@example.invalid')
    const failedBlog = requests.at(-1)
    status = 200
    await clickSubmit('form:has(#blog-email) button[type=submit]')
    await page.waitForFunction(() => document.body.innerText.includes('Your subscription request has been received.'))
    assert.equal(requests.at(-1).submissionId, failedBlog.submissionId)
    assert.equal(requests.at(-1).marketingConsent, true)
    report.push({ width, path: '/blog', failurePreservesDetails: true, retryId: true })

    await page.goto(base + '/not-for-profit-lease-support', { waitUntil: 'networkidle2' })
    await page.type('#apply input[autocomplete=name]', 'YOS Browser QA')
    await page.type('#apply input[autocomplete=organization]', 'YOS Community QA')
    await page.type('#apply input[type=email]', 'qa@example.invalid')
    const selects = await page.$$('#apply select')
    await selects[0].select('lease-review'); await selects[1].select('in-lease')
    await page.type('#apply textarea', 'Please review our lease options.')
    status = 502
    await clickSubmit('#apply button[type=submit]')
    await page.waitForSelector('#apply [role=alert]')
    assert.equal(await page.$eval('#apply input[type=email]', e => e.value), 'qa@example.invalid')
    status = 200
    await clickSubmit('#apply button[type=submit]')
    await page.waitForFunction(() => document.body.innerText.includes('Application received.'))
    assert.ok(requests.at(-1).message.includes('Current situation: Currently in a commercial lease'))
    report.push({ width, path: '/not-for-profit-lease-support', fullDetails: true, retry: true })

    await page.goto(base + '/resources/office-size-calculator', { waitUntil: 'networkidle2' })
    await page.type('input[type=number]', '20')
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(b => b.textContent.includes('Traditional (all in daily)')).click()
      for (const label of ['Private offices needed', 'Meeting rooms needed']) {
        const field = [...document.querySelectorAll('label')].find(e => e.textContent.includes(label))
        field.parentElement.querySelector('button').click()
      }
    })
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Calculate')).click())
    await page.waitForSelector('main form input[type=email]')
    await page.type('main form input[type=text]', 'YOS Browser QA')
    await page.type('main form input[type=email]', 'qa@example.invalid')
    status = 502
    await clickSubmit('main form button[type=submit]')
    await page.waitForSelector('main form [role=alert]')
    status = 200
    await clickSubmit('main form button[type=submit]')
    await page.waitForFunction(() => !document.querySelector('main form'))
    assert.equal(requests.at(-1).source, 'Office Size Calculator')
    assert.ok(requests.at(-1).context.includes('Staff: 20'))
    report.push({ width, path: '/resources/office-size-calculator', resultContext: true, retry: true })
    await page.screenshot({ path: `${out}/tool-results-${width}.png` })
    await page.close()
  }
  writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.log('PASS sitewide email enquiries: contact service choices, three legacy redirects, blog signup, not-for-profit and tool gate at mobile/desktop; retries and source details. All POSTs mocked.')
} finally { await browser.close() }
