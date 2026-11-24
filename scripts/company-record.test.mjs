import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const exports={}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/public-copy.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports})
test('stored public copy cannot reintroduce restricted client or supplier names',()=>{
 for(const name of ['EOF Group','Experienced Office Furniture','Newvo','Rapidline','OzChild','AACFS','Access Industries','Hansen Yuncken']) assert.equal(exports.isAllowedPublicPost({title:'Guide',body:`Working with ${name}`}),false)
 for(const name of ['Recovery Station','Jirsch Sutherland','Total Fitouts','Dynamic Business Technologies']) assert.equal(exports.isAllowedPublicPost({title:'Guide',body:`Working with ${name}`}),true)
 const text=exports.publicCopy('Plain — wording with solutions, leverage and innovative options. https://example.invalid/solutions')
 assert.doesNotMatch(text.split('https:')[0],/[–—]|solutions|leverage|innovative/)
 assert.ok(text.endsWith('https://example.invalid/solutions'),'URL compatibility is preserved')
})
test('legacy cleaning entry uses HTTP 301 to the canonical cleaning page',async()=>{
 const config={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('next.config.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:config,process:{env:{}}})
 const rule=(await config.default.redirects()).find(r=>r.source==='/commercial-cleaning');assert.equal(rule.destination,'/cleaning');assert.equal(rule.statusCode,301)
})
