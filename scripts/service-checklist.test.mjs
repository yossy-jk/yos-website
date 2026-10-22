import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as crypto from 'node:crypto'
function harness() {
  const values = new Map(), due = new Map(), emails = [], owners = []
  let now = 1760000000000
  const env = { VERCEL_ENV: 'production', SERVICE_CHECKLISTS_ENABLED: 'true', UPSTASH_REDIS_REST_URL: 'https://storage.invalid', UPSTASH_REDIS_REST_TOKEN: 'fixture', RESEND_API_KEY: 'fixture', CRON_SECRET: 'fixture-'.repeat(8) }
  class Clock extends Date { static now() { return now } }
  const redis = { async set(k,v,o={}) { if(o.nx&&values.has(k))return null;values.set(k,structuredClone(v));return 'OK' },async get(k){return structuredClone(values.get(k)??null)},async exists(k){return values.has(k)?1:0},async zadd(k,v){due.set(v.member,v.score)},async zrange(k,min,max){return [...due].filter(([,score])=>score>=min&&score<=max).map(([id])=>id)},async zrem(k,id){due.delete(id)},async eval(s,keys,args){if(values.get(keys[0])===args[0])values.delete(keys[0])} }
  const provider = { Resend: class { emails = { send: async (message,opts) => { emails.push({message,opts});return {data:{id:'accepted'}} } } } }
  function load(file,mocks={}) { const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>{if(!(n in mocks))throw Error(n);return mocks[n]},process:{env},Date:Clock,Buffer,URL,Request,Response,encodeURIComponent,console});return exports }
  const offers=load('src/lib/service-checklists.ts'),mail=load('src/lib/checklist-email.ts',{'./constants':{DISCOVERY_BOOKING_URL:'https://calendar.invalid/book'},'./service-checklists':offers})
  const store=load('src/lib/checklist-store.ts',{'@upstash/redis':{Redis:class{constructor(){return redis}}},'node:crypto':crypto,'./checklist-email':mail})
  const json={NextResponse:{json:(b,o)=>Response.json(b,o),redirect:(u,status)=>Response.redirect(u,status)}}
  const capture=load('src/app/api/service-checklist/route.ts',{'next/server':json,'resend':provider,'node:crypto':crypto,'@/lib/service-checklists':offers,'@/lib/checklist-email':mail,'@/lib/checklist-store':store,'@/lib/enquiry-delivery':{sendOwnerEnquiry:async(data,routing)=>owners.push({data,routing})},'@/lib/ratelimit':{voucherLimiter:()=>null,getIp:()=>''}})
  const worker=load('src/app/api/checklist-follow-ups/route.ts',{'next/server':json,'node:crypto':crypto,'resend':provider,'@/lib/checklist-store':store,'@/lib/checklist-email':mail})
  const unsub=load('src/app/api/checklist-unsubscribe/route.ts',{'next/server':json,'@/lib/checklist-store':store})
  const request=b=>new Request('https://www.yourofficespace.au/api/service-checklist',{method:'POST',headers:{origin:'https://www.yourofficespace.au'},body:JSON.stringify(b)})
  const run=()=>worker.GET(new Request('https://www.yourofficespace.au/api/checklist-follow-ups',{headers:{authorization:'Bearer '+env.CRON_SECRET}}))
  return {env,values,due,emails,owners,store,capture,worker,unsub,request,run,advance:ms=>{now+=ms}}
}
const body=()=>({service:'fitout',email:'prospect@example.invalid',followUpConsent:true,submissionId:crypto.randomUUID()})
test('capture delivers once, routes Joe, waits24h and sends follow-up once',async()=>{
 const h=harness(),b=body();assert.equal((await h.capture.POST(h.request(b))).status,200);assert.equal((await h.capture.POST(h.request(b))).status,200);assert.equal(h.emails.length,1);assert.equal(h.owners.length,1);assert.equal(h.owners[0].routing.recipient,'jk@yourofficespace.au');assert.equal(h.due.size,1);await h.run();assert.equal(h.emails.length,1);h.advance(86400000);assert.equal((await h.run()).status,200);assert.equal(h.emails.length,2);await h.run();assert.equal(h.emails.length,2);assert.equal(h.due.size,0)
})
test('download without optional consent never enters follow-up queue',async()=>{const h=harness();assert.equal((await h.capture.POST(h.request({...body(),followUpConsent:false}))).status,200);assert.equal(h.emails.length,1);assert.equal(h.due.size,0)})
test('unsubscribe suppresses queued delivery, GET scanners have no mutation route',async()=>{const h=harness(),b=body();await h.capture.POST(h.request(b));const record=await h.store.checklistRedis().get(h.store.checklistKey(b.submissionId));const form=new FormData();form.set('token',record.unsubscribeToken);assert.equal((await h.unsub.POST(new Request('https://www.yourofficespace.au/api/checklist-unsubscribe',{method:'POST',body:form}))).status,303);h.advance(86400000);await h.run();assert.equal(h.emails.length,1);assert.equal(h.due.size,0)})
test('known enquiry suppresses follow-up and preview has no side effects',async()=>{const h=harness(),b=body();await h.capture.POST(h.request(b));await h.store.suppressChecklistFollowUps(b.email);h.advance(86400000);await h.run();assert.equal(h.emails.length,1);h.env.VERCEL_ENV='preview';await h.capture.POST(h.request(body()));assert.equal(h.emails.length,1)})
test('invalid capture, changed retry identity and missing worker auth are rejected',async()=>{const h=harness(),b=body();assert.equal((await h.capture.POST(h.request({...b,email:'invalid'}))).status,400);await h.capture.POST(h.request(b));assert.equal((await h.capture.POST(h.request({...b,email:'other@example.invalid'}))).status,409);assert.equal((await h.worker.GET(new Request('https://www.yourofficespace.au/api/checklist-follow-ups'))).status,401)})
test('ambiguous send older than provider idempotency window is held instead of resent',async()=>{const h=harness(),b=body();await h.capture.POST(h.request(b));const r=await h.store.checklistRedis().get(h.store.checklistKey(b.submissionId));r.followUpAttemptedAt=r.dueAt;await h.store.saveChecklistRecord(h.store.checklistRedis(),r);h.advance(86400000+24*3600000);await h.run();assert.equal(h.emails.length,1);assert.equal(h.due.size,0)})
