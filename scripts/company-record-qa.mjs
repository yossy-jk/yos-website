import puppeteer from 'puppeteer'
import axe from 'axe-core'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const base=process.env.QA_BASE || 'http://127.0.0.1:3187'
const browser=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']})
const out=process.env.COMPANY_QA_OUT || 'screenshots/company-record'
const findings=[];fs.mkdirSync(out,{recursive:true})
try {
for(const route of ['/','/about','/office-fitout','/furniture','/cleaning','/flourish','/free-space-plan']){
const p=await browser.newPage();await p.setRequestInterception(true);p.on('request',r=>new URL(r.url()).origin===new URL(base).origin ? r.continue():r.abort())
await p.evaluateOnNewDocument(()=>{localStorage.setItem('yos_analytics_consent','declined');sessionStorage.setItem('yos-service-guide-dismissed','1')})
for(const width of [390,768,1440]){
await p.setViewport({width,height:950});await p.goto(base+route,{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready)
const data=await p.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,text:document.body.innerText,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(e=>{try{return [JSON.parse(e.textContent)]}catch{return []}})}))
assert.equal(data.overflow,false,route+width+' overflow');assert.equal(data.h1,1,route+' H1');assert.ok(data.description)
assert.doesNotMatch(data.text,/\b(?:EOF|Newvo|Rapidline|OzChild|AACFS|Access Industries|Hansen Yuncken|solutions|synergies|leverage|holistic|seamlessly|game-changer|passionate about|robust|scalable|innovative|cutting-edge|best-in-class|world-class)\b|[–—]/i,route+' copy')
await p.addScriptTag({content:axe.source});const a=await p.evaluate(async()=>await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.equal(a.violations.length,0,route+width+JSON.stringify(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))))
await p.screenshot({path:out+'/'+(route.replaceAll('/','_')||'home')+'-'+width+'.png',fullPage:true});findings.push({route,width,title:data.title,faq:JSON.stringify(data.schemas).includes('FAQPage')})
}
await p.close()
}
const p=await browser.newPage();await p.goto(base+'/free-space-plan');await p.select('select[name=builderEngaged]','yes');assert.equal(await p.$eval('button[type=submit]',e=>e.disabled),true);await p.select('select[name=builderEngaged]','no');assert.equal(await p.$eval('input[name=contactPermission]',e=>e.checked),false)
const valid={name:'Preview QA',email:'qa@example.invalid',suburb:'Newcastle',brief:'A workplace plan for twelve people',builderEngaged:'no',contactPermission:true}
for(const [body,status] of [[{...valid,builderEngaged:'yes'},400],[{...valid,contactPermission:false},400],[valid,200]]){const r=await p.evaluate(async(body)=>{const res=await fetch('/api/free-space-plan',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});return {status:res.status,body:await res.json()}},body);assert.equal(r.status,status,JSON.stringify(r));if(status===200)assert.equal(r.body.preview,true)}
await p.close();fs.writeFileSync(out+'/results.json',JSON.stringify(findings,null,2));console.log('Company record QA passed',findings.length,'layouts; form eligibility and preview delivery passed')
} finally {await browser.close()}
