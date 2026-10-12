import puppeteer from 'puppeteer'
import { existsSync, writeFileSync } from 'node:fs'
const base = process.env.SEO_BASE_URL || 'http://127.0.0.1:3118'
const site = 'https://www.yourofficespace.au'
const sitemapResponse = await fetch(`${base}/sitemap.xml`)
if (!sitemapResponse.ok) throw new Error('Sitemap cannot be fetched')
const xml = await sitemapResponse.text()
const sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'))
const additional = ['/resources/lease-vs-buy', '/resources/stamp-duty-calculator', '/resources/rental-yield-calculator', '/resources/cap-rate-calculator', '/resources/land-tax-calculator', '/resources/purchase-checklist', '/blog/commercial-property-stamp-duty-australia-guide', '/dashboard/login', '/wholesale']
const paths = [...new Set([...sitemapUrls.map(url => new URL(url).pathname), ...additional])]
const executablePath = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync)
const browser = await puppeteer.launch({headless: true, ...(executablePath ? {executablePath} : {}), args: ['--no-sandbox']})
const page = await browser.newPage()
try {
  await page.goto(base, {waitUntil: 'domcontentloaded'})
  const rows = await page.evaluate(async paths => {
    function nodes(value, out = []) { if (Array.isArray(value)) value.forEach(v => nodes(v,out)); else if (value && typeof value === 'object') { if (value['@type']) out.push(value); Object.values(value).forEach(v => nodes(v,out)) } return out }
    const normal = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    const results = []
    for (let i=0; i<paths.length; i+=4) {
      results.push(...await Promise.all(paths.slice(i,i+4).map(async path => {
        const response = await fetch(path); const html = await response.text(); const doc = new DOMParser().parseFromString(html, 'text/html')
        const meta = name => doc.querySelector(`meta[name="${name}"],meta[property="${name}"]`)?.content || ''
        const schemas=[]; const errors=[]
        doc.querySelectorAll('script[type="application/ld+json"]').forEach(script=>{try{schemas.push(JSON.parse(script.textContent))}catch{errors.push('Invalid JSON-LD')}})
        const content=(doc.querySelector('main') || doc.body).cloneNode(true);content.querySelectorAll('script,style').forEach(e=>e.remove());const text=normal(content.textContent)
        const schemaNodes=nodes(schemas)
        for (const node of schemaNodes) {
          if(node['@type']==='Question' && (!text.includes(normal(node.name)) || !text.includes(normal(node.acceptedAnswer?.text)))) errors.push(`FAQ not represented in visible content: ${node.name}`)
          if(typeof node.image==='string') {try{const url=new URL(node.image);if(!['https:','http:'].includes(url.protocol)||node.image.includes('.auhttps:'))errors.push('Invalid schema image URL')}catch{errors.push('Invalid schema image URL')}}
        }
        return {path,status:response.status,title:doc.title,description:meta('description'),canonical:doc.querySelector('link[rel="canonical"]')?.href || '',robots:meta('robots'),googleBot:meta('googlebot'),h1Count:doc.querySelectorAll('h1').length,ogTitle:meta('og:title'),ogUrl:meta('og:url'),ogImage:meta('og:image'),twitterTitle:meta('twitter:title'),wordCount:text.split(' ').length,schemaTypes:[...new Set(schemaNodes.map(n=>n['@type']))],errors}
      })))
    }
    return results
  }, paths)
  const failures=[]
  const indexed=rows.filter(r=>!r.robots.includes('noindex'))
  for (const row of rows) {
    if(row.status!==200) failures.push(`${row.path}: HTTP ${row.status}`)
    if(!row.robots.includes('noindex')) {
      if(new URL(row.canonical || 'https://missing.invalid').href!==new URL(`${site}${row.path}`).href) failures.push(`${row.path}: non-self canonical ${row.canonical}`)
      for(const key of ['title','description','ogTitle','ogUrl','ogImage','twitterTitle']) if(!row[key])failures.push(`${row.path}: missing ${key}`)
      if(row.h1Count!==1)failures.push(`${row.path}: ${row.h1Count} H1 headings`)
    }
    if(row.robots.includes('noindex') && row.googleBot && !row.googleBot.includes('noindex')) failures.push(`${row.path}: Googlebot overrides noindex`)
    if(sitemapUrls.includes(`${site}${row.path==='/'?'':row.path}`)&&row.robots.includes('noindex'))failures.push(`${row.path}: noindex URL in sitemap`)
    failures.push(...row.errors.map(e=>`${row.path}: ${e}`))
  }
  for(const key of ['title','description','canonical']){const seen=new Map();for(const row of indexed){if(seen.has(row[key]))failures.push(`Duplicate ${key}: ${row.path} and ${seen.get(row[key])}`);seen.set(row[key],row.path)}}
  writeFileSync(process.env.SEO_REPORT_PATH || '/tmp/yos-seo-rendered-audit.json',JSON.stringify({checkedAt:new Date().toISOString(),base,sitemapCount:sitemapUrls.length,pageCount:rows.length,rows,failures},null,2))
  console.log(`${rows.length} rendered routes checked; ${failures.length} issues.`)
  if(failures.length){console.error(failures.join('\n'));process.exitCode=1}
} finally { await browser.close() }
