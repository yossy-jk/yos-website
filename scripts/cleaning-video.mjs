import puppeteer from 'puppeteer'
import axe from 'axe-core'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
const base = process.env.VIDEO_QA_BASE || 'http://127.0.0.1:3192'
const out = process.env.VIDEO_QA_OUT || '/tmp/yos-cleaning-video-qa'
await mkdir(out, { recursive: true })
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
const browser = await puppeteer.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] })
const results = []
const routes = ['/cleaning', '/blog/commercial-cleaning-newcastle-what-to-expect', '/videos/commercial-office-cleaning-newcastle']
try {
  for (const width of [390, 768, 1440]) for (const route of routes) {
    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    await page.setViewport({ width, height: 1000 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.setRequestInterception(true)
    page.on('request', request => request.method() !== 'GET' || new URL(request.url()).origin !== new URL(base).origin ? request.abort() : request.continue())
    const response = await page.goto(base + route, { waitUntil: 'networkidle2' })
    assert.equal(response.status(), 200)
    await page.evaluate(() => document.fonts.ready)
    const data = await page.evaluate(async () => {
      const video = document.querySelector('video')
      const track = video.querySelector('track')
      track.track.mode = 'hidden'
      video.muted = true
      video.load()
      await video.play()
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(Error('Playback/captions did not load')), 15000)
        const poll = () => {
          if (video.currentTime > 0 && track.track.cues?.length) { clearTimeout(timeout); resolve() }
          else setTimeout(poll, 50)
        }
        poll()
      })
      video.pause()
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent))
      return { duration: video.duration, width: video.videoWidth, height: video.videoHeight, played: video.currentTime > 0, captionCues: track.track.cues.length, preload: video.preload, defaultCaptions: track.default, canonical: document.querySelector('link[rel="canonical"]')?.href, overflow: document.documentElement.scrollWidth > innerWidth + 2, h1s: document.querySelectorAll('h1').length, schemas, links: [...document.querySelectorAll('main a[href]')].map(a => a.getAttribute('href')) }
    })
    assert.ok(Math.abs(data.duration - 105.813) < 0.06)
    assert.equal(data.width, 1280)
    assert.equal(data.height, 720)
    assert.equal(data.preload, 'none')
    assert.equal(data.defaultCaptions, false)
    assert.equal(data.h1s, 1)
    assert.equal(data.overflow, false)
    assert.equal(data.canonical, 'https://www.yourofficespace.au' + route)
    assert.ok(JSON.stringify(data.schemas).includes('PT1M45.813S'))
    if (route.startsWith('/videos/')) {
      assert.ok(data.links.includes('/cleaning#cleaning-quote-form'))
      assert.ok(data.links.includes('/guides/office-cleaning-planning-template.txt'))
      assert.ok(!data.links.includes('/lease-health-check'))
    }
    await page.addScriptTag({ content: axe.source })
    const violations = await page.evaluate(async () => (await window.axe.run('main', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations)
    assert.deepEqual(violations.map(v => v.id), [])
    if (width === 390 || width === 1440) {
      await page.evaluate(async () => {
        const video = document.querySelector('video')
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(Error('Representative frame did not load')), 10000)
          video.addEventListener('seeked', () => { clearTimeout(timeout); resolve() }, { once: true })
          video.currentTime = 14
        })
      })
      await page.$eval('video', el => el.scrollIntoView({ block: 'center' }))
      await page.screenshot({ path: `${out}/${route.split('/').pop()}-${width}.png` })
    }
    results.push({ route, viewport: width, status: response.status(), ...data, axeViolations: violations.length })
    await page.close()
  }
  const sitemap = await fetch(base + '/sitemap.xml').then(r => r.text())
  assert.ok(sitemap.includes('https://www.yourofficespace.au/videos/commercial-office-cleaning-newcastle'))
  const hub = await fetch(base + '/videos').then(r => r.text())
  assert.ok(hub.includes('/videos/commercial-office-cleaning-newcastle'))
  await writeFile(out + '/checks.json', JSON.stringify({ base, results, sitemap: true, videoHub: true, actualSubmissions: 0 }, null, 2))
  console.log('PASS: nine cleaning video playback, caption, schema, responsive and accessibility journeys; sitemap and video hub; no submissions.')
} finally { await browser.close() }
