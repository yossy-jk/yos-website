import puppeteer from 'puppeteer'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import {readdirSync,writeFileSync,mkdirSync,existsSync} from 'node:fs'
import path from 'node:path'
const configuredBase=process.env.LINK_AUDIT_BASE
const base=configuredBase || 'http://127.0.0.1:3104'
const out=process.env.LINK_AUDIT_OUTPUT_DIR || 'screenshots/button-audit'
mkdirSync(out,{recursive:true})
let server
if(!configuredBase) {
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3104'],{stdio:'ignore'})
 const deadline=Date.now()+30000
 while(true) {
  try {if((await fetch(base)).ok)break} catch { /* Wait for the local production build. */ }
  assert.ok(Date.now()<deadline,'Local production preview did not start.')
  await new Promise(resolve=>setTimeout(resolve,250))
 }
}
const browser=await puppeteer.launch({headless:true,executablePath:[process.env.PUPPETEER_EXECUTABLE_PATH,'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].filter(Boolean).find(existsSync),args:['--no-sandbox']})
const staticRoutes=[]
function walk(dir){for(const file of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,file.name);if(file.isDirectory())walk(full);else if(file.name==='page.tsx'){const route='/'+path.relative('src/app',dir);if(!route.includes('[')&&!route.startsWith('/dashboard')&&!route.startsWith('/eof-group'))staticRoutes.push(route==='/'?'/':route)}}}
walk('src/app')
try{
 const page=await browser.newPage();await page.evaluateOnNewDocument(()=>sessionStorage.setItem('yos-service-guide-dismissed','1'));await page.setCacheEnabled(false);await page.goto(base,{waitUntil:'domcontentloaded'});
 const report=await page.evaluate(async seeds=>{
  const xml=await (await fetch('/sitemap.xml')).text();const sitemap=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
  const queue=[...new Set([...seeds,...sitemap])],rows=[],docs=new Map(),checked=new Set();
  while(queue.length){const batch=queue.splice(0,5).filter(p=>!checked.has(p));batch.forEach(p=>checked.add(p));if(!batch.length)continue;
   await Promise.all(batch.map(async route=>{
    const r=await fetch(route),html=await r.text(),doc=new DOMParser().parseFromString(html,'text/html');docs.set(new URL(r.url).pathname,doc);
    const anchors=[...doc.querySelectorAll('a[href]')].map(a=>({text:(a.textContent||a.getAttribute('aria-label')||'').trim().replace(/\s+/g,' '),href:a.getAttribute('href'),download:a.hasAttribute('download'),region:a.closest('main')?'main':a.closest('footer')?'footer':'navigation'}));
    rows.push({route,finalPath:new URL(r.url).pathname,status:r.status,ids:[...doc.querySelectorAll('[id]')].map(e=>e.id),anchors,buttons:[...doc.querySelectorAll('button')].map(b=>({text:b.textContent?.trim(),type:b.getAttribute('type')||'submit',label:b.getAttribute('aria-label')}))});
    for(const a of anchors){let url;try{url=new URL(a.href,r.url)}catch{continue}if(!['http:','https:'].includes(url.protocol)||!['www.yourofficespace.au','yourofficespace.au',location.hostname].includes(url.hostname)||a.download)continue;if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/dashboard')||url.pathname.startsWith('/tenant-rep/brief/')||/\.[a-z0-9]+$/i.test(url.pathname))continue;if(!checked.has(url.pathname))queue.push(url.pathname)}
   }));
  }
  const failures=[];for(const row of rows){if(row.status!==200)failures.push({route:row.route,status:row.status});if(new Set(row.ids).size!==row.ids.length)failures.push({route:row.route,error:'Duplicate section IDs'});for(const a of row.anchors){let url;try{url=new URL(a.href,new URL(row.finalPath,location.origin))}catch{failures.push({route:row.route,...a,error:'Invalid URL'});continue}if(!url.hash||!['www.yourofficespace.au','yourofficespace.au',location.hostname].includes(url.hostname))continue;const dest=docs.get(url.pathname),id=decodeURIComponent(url.hash.slice(1));if(dest&&!dest.getElementById(id)&&!dest.querySelector(`[name="${CSS.escape(id)}"]`))failures.push({route:row.route,...a,error:'Missing section',destination:url.pathname,hash:id})}}
  return{pages:rows,failures,uniqueInternalTargets:[...new Set(rows.flatMap(r=>r.anchors.filter(a=>a.href.startsWith('/')||a.href.startsWith('#')).map(a=>a.href)))]}
 },staticRoutes);
 for(const row of report.pages)for(const a of row.anchors)if(a.text==='Enquire')assert.ok(!a.href.includes('meetings-ap1')&&a.href.includes('#'),`${row.route}: enquiry must reach a form, not a calendar.`)
 assert.deepEqual(report.failures, [], 'Every public destination and section must exist.')
 const dismissConsent=async()=>{
  assert.equal(await page.$('.analytics-consent-panel'), null, 'Privacy preferences must only open on request.')
  assert.equal(await page.$('.analytics-consent-trigger'), null, 'No floating privacy notification.')
 }
 const interactions=[]
 const matrix=report.pages.flatMap(row=>[...new Set(row.anchors.filter(a=>a.region==='main'&&a.href.startsWith('#')).map(a=>a.href))].map(href=>({route:row.route,href})))
 matrix.push(...[
  ['/','/contact#contact-enquiry'],['/','/cleaning#cleaning-quote-form'],['/about','/contact#contact-enquiry'],['/resources','/contact#contact-enquiry'],['/tenant-rep/newcastle','/lease-health-check'],
  ...['land-tax-calculator','lease-vs-buy','rental-yield-calculator','stamp-duty-calculator'].map(slug=>['/resources/'+slug,'/contact?service=buying#contact-enquiry']),['/resources/office-size-calculator','/contact?service=leasing#contact-enquiry'],['/tenant-rep','/lease-health-check'],
  ['/buyers-agency','/contact?service=buying#contact-enquiry'],['/office-fitout','/contact?service=fitout#contact-enquiry'],
  ['/furniture','/contact?service=furniture#contact-enquiry'],['/furniture','/resources/furniture-quote#furniture-quote-form'],
  ['/tools/space-planner','/contact?service=furniture#contact-enquiry'],['/newcastle-commercial-property','/contact#contact-enquiry'],
 ].map(([route,href])=>({route,href})))
 for(const width of (process.env.LINK_AUDIT_FOCUS ? [1440] : [390,1440])) {
  await page.setViewport({width,height:900})
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
  // Never send test enquiries, registrations, uploads, or bookings, including in live verification.
  await page.setRequestInterception(true)
  page.removeAllListeners('request')
  page.on('request',request=>request.method()==='POST'?request.abort():request.continue())
  for(const legacy of ['/lease-review','/leaseintel','/eof-group/lease-review']) {
   const response=await page.goto(base+legacy,{waitUntil:'networkidle2'})
   assert.equal(new URL(page.url()).pathname,'/lease-health-check',`${legacy}: must reach the consolidated Health Check`)
   assert.equal(response.request().redirectChain()[0]?.response()?.status(),308,`${legacy}: permanent redirect required`)
   assert.ok(await page.$('main form input'),`${legacy}: Health Check form is available`)
   interactions.push({route:legacy,href:'/lease-health-check',width,permanentRedirect:true})
  }
  for(const {route,href} of matrix.filter(item=>!process.env.LINK_AUDIT_FOCUS || item.route===process.env.LINK_AUDIT_FOCUS)) {
   console.log(`CHECK ${route} → ${href} @ ${width}px`)
   await page.goto(base+route,{waitUntil:'networkidle2'})
   await dismissConsent()
   let selector=`main a[href=${JSON.stringify(href)}]`
   if(!await page.$(selector))selector=`a[href=${JSON.stringify(href)}]`
   const link=await page.$(selector)
   assert.ok(link,`${route}: missing action ${href}`)
   await link.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
   await link.click()
   const expected=new URL(href,base+route)
   await page.waitForFunction((path,query,hash)=>{
    if(location.pathname!==path||location.search!==query||location.hash!==hash)return false
    if(!hash)return [...document.querySelectorAll('form input, form select, form textarea')].some(e=>!e.disabled&&getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().height>0)
    const e=document.getElementById(decodeURIComponent(hash.slice(1))),r=e?.getBoundingClientRect()
    return r&&r.top>=75&&r.top<140&&r.bottom>80
   },{timeout:15000},expected.pathname,expected.search,expected.hash)
   // Repeat same-page clicks after deliberately moving away; repeated hash links must still work.
   if(href.startsWith('#')) {
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}))
    await page.$eval(selector,e=>e.click())
    await page.waitForFunction(hash=>document.getElementById(hash.slice(1))?.getBoundingClientRect().top>=75&&document.getElementById(hash.slice(1))?.getBoundingClientRect().top<140,{},expected.hash)
   }
   const detail=await page.evaluate(()=>({top:document.getElementById(decodeURIComponent(location.hash.slice(1)))?.getBoundingClientRect().top,service:document.querySelector('input[name="service"]')?.value,nameTop:document.querySelector('#contact-name')?.getBoundingClientRect().top}))
   const services={leasing:'Leasing',buying:'Buying',fitout:'FitOut',furniture:'Furniture'}
   if(expected.pathname==='/contact') {
    assert.ok(detail.nameTop>64&&detail.nameTop<900,`Contact field must be visible: ${route}/${width}`)
    if(expected.searchParams.has('service'))assert.equal(detail.service,services[expected.searchParams.get('service')])
   }
   interactions.push({route,href,width,...detail})
  }
  // Shared navigation and search must lead to the correct public page/form at both sizes.
  await page.goto(base,{waitUntil:'networkidle2'})
  await dismissConsent()
  if(width<1280) {
   await page.click('button[aria-label="Open menu"]')
   await page.waitForSelector('button[aria-label="Close menu"]')
  }
  const enquiry=await page.evaluateHandle(()=>[...document.querySelectorAll('nav a[href="/contact#contact-enquiry"], #mobile-navigation-menu a[href="/contact#contact-enquiry"]')].find(e=>e.getBoundingClientRect().width>0))
  assert.ok(enquiry.asElement(),'Visible navigation enquiry link')
  await enquiry.asElement().click()
  await page.waitForFunction(()=>location.pathname==='/contact'&&location.hash==='#contact-enquiry'&&document.querySelector('#contact-name')?.getBoundingClientRect().top<900)
  assert.equal(await page.$eval('input[name="service"]',e=>e.value),'')
  await page.goto(base,{waitUntil:'networkidle2'})
  const search=await page.evaluateHandle(()=>[...document.querySelectorAll('button[aria-label="Search"]')].find(e=>e.getBoundingClientRect().width>0))
  await search.asElement().click()
  await page.type('input[aria-label="Search services, tools and articles"]','plant')
  await page.waitForSelector('#site-search-results a[href="/flourish/office-plant-hire-newcastle"]')
  await page.click('#site-search-results a[href="/flourish/office-plant-hire-newcastle"]')
  await page.waitForFunction(()=>location.pathname==='/flourish/office-plant-hire-newcastle')
  interactions.push({width,action:'Navigation enquiry and search destinations'})
  await page.goto(base+'/contact?service=cleaning#contact-enquiry',{waitUntil:'networkidle2'})
  assert.equal(await page.$eval('input[name="service"]',e=>e.value),'Cleaning')
  assert.ok(await page.$eval('#contact-name',e=>e.getBoundingClientRect().top<900))
  await page.screenshot({path:`${out}/contact-${width}.png`})
  await page.goto(base+'/market-snapshot',{waitUntil:'networkidle2'})
  await dismissConsent()
  await page.evaluate(()=>document.querySelector('dialog[open] button[aria-label="Close"]')?.click())
  const updatesTrigger=await page.$('main button[data-market-updates-trigger]')
  assert.ok(updatesTrigger,'Visible market updates CTA')
  await updatesTrigger.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
  await updatesTrigger.click()
  await page.waitForSelector('dialog[open] input[aria-label="Email address"]')
  assert.ok(await page.$('dialog[open] input[type="email"]'),'Updates CTA opens subscription form')
  await page.keyboard.press('Escape')
  await page.waitForFunction(()=>!document.querySelector('dialog[open]')&&document.activeElement?.hasAttribute('data-market-updates-trigger'))
  interactions.push({route:'/market-snapshot',width,action:'Subscription form opens'})
 }
 report.interactions=interactions
 writeFileSync(`${out}/${process.env.LINK_AUDIT_LABEL||'report'}.json`,JSON.stringify(report,null,2))
 console.log(JSON.stringify({pages:report.pages.length,links:report.pages.reduce((n,r)=>n+r.anchors.length,0),uniqueTargets:report.uniqueInternalTargets.length,interactions:interactions.length,failures:report.failures},null,2))
}finally{try{await browser.close()}finally{server?.kill('SIGTERM')}}
