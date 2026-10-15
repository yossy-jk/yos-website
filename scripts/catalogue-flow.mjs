import assert from 'node:assert/strict'
import fs from 'node:fs'
import puppeteer from 'puppeteer'
import axe from 'axe-core'
const base=process.env.QA_BASE || 'http://localhost:3164'
const out=process.env.CATALOGUE_QA_OUT || 'screenshots/catalogues'
fs.mkdirSync(out,{recursive:true})
const executablePath=['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(fs.existsSync)
const browser=await puppeteer.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--no-sandbox']})
const results=[]
try {
 for(const [id,width,pages] of [['furniture',390,73],['acoustics',1440,19]]) {
  const page=await browser.newPage();const posts=[]
  await page.setViewport({width,height:900})
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
  await page.evaluateOnNewDocument(()=>{
   sessionStorage.setItem('yos-service-guide-dismissed','1');localStorage.setItem('yos_analytics_consent','declined')
   window.__qaHidden=false;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__qaHidden})
   document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement&&e.target.src.includes('page-01.jpg')&&!window.__imageLoadedAt)window.__imageLoadedAt=performance.now()},true)
   new MutationObserver(()=>{if(document.querySelector('dialog[open]')&&!window.__openedAt)window.__openedAt=performance.now()}).observe(document,{subtree:true,attributes:true,attributeFilter:['open']})
  })
  await page.setRequestInterception(true)
  page.on('request',r=>{
   if(r.method()==='POST'){
    if(r.url().endsWith('/api/catalogue-interest')){posts.push(JSON.parse(r.postData()));return r.respond({status:200,contentType:'application/json',body:JSON.stringify({ok:true,shopUrl:'https://www.yourofficefurniture.com.au/discount/YOSWELCOME5?redirect=%2Fcollections%2Fall'})})}
    return r.abort()
   }return r.continue()
  })
  await page.goto(`${base}/catalogues/${id}`,{waitUntil:'networkidle2'})
  await page.waitForFunction(()=>document.querySelector('.catalogue-page-image img')?.naturalWidth>0)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  assert.equal(await page.$$eval('select[aria-label="Catalogue page"] option',items=>items.length),pages)
  if(id==='acoustics'){
   await new Promise(r=>setTimeout(r,3000));await page.evaluate(()=>{window.__qaHidden=true;document.dispatchEvent(new Event('visibilitychange'))})
   await new Promise(r=>setTimeout(r,6000));assert.equal(await page.$('dialog[open]'),null)
   await page.evaluate(()=>{window.__qaHidden=false;document.dispatchEvent(new Event('visibilitychange'))})
  }else {await new Promise(r=>setTimeout(r,8000));assert.equal(await page.$('dialog[open]'),null)}
  await page.waitForSelector('dialog[open]',{timeout:12000})
  const elapsed=await page.evaluate(()=>window.__openedAt-window.__imageLoadedAt)
  assert.ok(elapsed>=9950,`Prompt too early: ${elapsed}`)
  if(id==='acoustics')assert.ok(elapsed>=15950,`Hidden time counted: ${elapsed}`)
  await page.addScriptTag({content:axe.source})
  const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))
  assert.deepEqual(violations,[])
  await page.screenshot({path:`${out}/${id}-offer-${width}.png`})
  if(id==='acoustics') {await page.click('button[aria-pressed="false"]');await page.type('input[name="name"]','Catalogue QA');await page.type('textarea[name="message"]','Planning a workplace')}
  await page.type('input[name="email"]','qa@example.invalid');await page.click('dialog button[type="submit"]');await page.waitForSelector('dialog [role="status"]')
  assert.equal(posts.length,1);assert.equal(posts[0].catalogue,id);assert.equal(posts[0].intent,id==='furniture'?'discount':'discovery')
  assert.ok(posts[0].submissionId)
  await page.keyboard.press('Escape');assert.equal(await page.$('dialog[open]'),null)
  await page.select('select[aria-label="Catalogue page"]',String(pages));await page.waitForFunction(n=>document.querySelector('.catalogue-page-image img')?.alt.endsWith(`page ${n}`)&&document.querySelector('.catalogue-page-image img')?.naturalWidth>0,{},pages)
  await page.screenshot({path:`${out}/${id}-last-page-${width}.png`})
  assert.equal((await page.$eval('a[download]',a=>a.getAttribute('href'))),`/catalogues/your-office-${id==='furniture'?'furniture':'acoustics'}-2026.pdf`)
  await page.reload({waitUntil:'networkidle2'});await new Promise(r=>setTimeout(r,10500));assert.equal(await page.$('dialog[open]'),null,'Reload should not repeat a dismissed prompt this session')
  results.push({id,width,pages,elapsed,violations,posted:posts.length});await page.close()
 }
 for(const path of ['/','/furniture']){const r=await fetch(base+path);const html=await r.text();for(const id of ['furniture','acoustics'])assert.ok(html.includes(`/catalogues/${id}`),`${path}: catalogue card missing`)}
 fs.writeFileSync(`${out}/report.json`,JSON.stringify(results,null,2));console.log('PASS catalogues: 10-second visible-time prompt, background pause, both forms, session dismissal, page navigation, asset links and accessibility. Provider calls mocked; no email sent.')
}finally{await browser.close()}
