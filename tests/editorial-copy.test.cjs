'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../dist'),C=require('../dist/lottery-core.js'),context={window:{}};
for(const name of ['data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions'])vm.runInNewContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),context);
const before=JSON.parse(JSON.stringify(context.window.FOODS));
vm.runInNewContext(fs.readFileSync(path.join(root,'editorial-copy.js'),'utf8'),context);
const after=JSON.parse(JSON.stringify(context.window.FOODS));
test('card names and summaries use food language rather than collection or procurement instructions',()=>{
 const apple=after.find(f=>f.id==='qixia-lidong-winter-after-apple');
 assert.equal(apple.name,'栖霞“冬后”苹果');assert.match(apple.short,/甜/);assert.match(apple.short,/切瓣/);
 for(const food of after){
  assert.doesNotMatch(food.name,/批次|采收记录|渔讯|试验|专题|早市/,food.id);
  assert.doesNotMatch(food.short,/核对|批次|记录|报道|资料|渔讯|不代表|参考|未实测|先问|合为一篇|线索|标准描述|待核|身份|认准|现场|试验/,food.id);
  assert.ok(food.short.length<=55,food.id);
 }
});
test('editorial changes preserve original IDs, season evidence, recipes, sources and draw signatures',()=>{
 assert.equal(after.length,before.length);
 for(let i=0;i<before.length;i++){
  const original=before[i],revised=after[i];assert.equal(C.signature(revised),C.signature(original),revised.id);assert.equal(C.sensorySignature(revised),C.sensorySignature(original),revised.id);
  const protectedFields=food=>Object.fromEntries(Object.entries(food).filter(([key])=>!['name','short'].includes(key)));
  assert.deepEqual(protectedFields(revised),protectedFields(original),revised.id);
 }
});
test('all entrypoints apply the same editorial copy after the complete catalog and before readers',()=>{
 for(const page of ['index.html','tarot.html','lottery.html']){
  const scripts=[...fs.readFileSync(path.join(root,page),'utf8').matchAll(/<script src="([^"?]+)/g)].map(m=>m[1]);
  assert.equal(scripts.filter(s=>s==='editorial-copy.js').length,1,page);
  assert.ok(scripts.indexOf('editorial-copy.js')>scripts.indexOf('term-gap-additions.js'),page);
  assert.ok(scripts.indexOf('editorial-copy.js')<scripts.indexOf('photo-review.js'),page);
 }
});
