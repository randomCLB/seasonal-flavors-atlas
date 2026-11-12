'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {load}=require('../scripts/audit-reader-access.cjs');
test('reviewed identities render evidence without inventing species or origins',()=>{
 const ctx=load();vm.runInContext(fs.readFileSync('dist/biology.js','utf8'),ctx);
 const {FoodBiology:biology}=ctx.window;
 const chayote=biology.html({id:'foshougua-miao'});
 assert.match(chayote,/Sicyos edulis/);assert.match(chayote,/Sechium edule/);
 assert.match(chayote,/1991 年起源研究/);assert.match(chayote,/年代仍有争议/);
 assert.match(biology.html({id:'congjun'}),/种暂未核实/);
 assert.match(biology.html({id:'binchuan-renong1-yuganzi'}),/2019/);
 assert.match(biology.html({id:'ganbajun'}),/Thelephora/);
 assert.equal(biology.html({id:'unknown'}),'');
});
test('every public ingredient has a sourced, renderable biological profile',()=>{
 const ctx=load();vm.runInContext(fs.readFileSync('dist/biology.js','utf8'),ctx);
 const catalog=vm.runInContext('canonicalCatalog',ctx), biology=ctx.window.FoodBiology;
 assert.equal(catalog.length,287);
 for(const food of catalog){
  const entries=biology.entry(food);assert.ok(entries.length,`${food.id}: missing profile`);
  for(const record of entries){
   assert.ok(record.name && record.latin && record.ranks?.length===7,`${food.id}: missing classification`);
   assert.ok(record.origin && record.source && record.originSources?.length && (record.id||record.catalogUrl),`${food.id}: missing evidence`);
   assert.ok(record.originSources.every(source=>source.length===2 && /^https?:\/\//.test(source[0]) && source[1]),`${food.id}: invalid origin source`);
  }
  assert.match(biology.html(food),/早期人工培育/,`${food.id}: profile does not render`);
 }
});
