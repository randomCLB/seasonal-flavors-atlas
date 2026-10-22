'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),ctx={window:{}};
vm.createContext(ctx);
for(const n of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES)),food=foods.find(x=>x.id==='taiwan-jialiao-bream'),events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);
test('Taiwanese 嘉鱲 is sourced, complete and labeled as a generic illustration',()=>{
 assert.ok(food);assert.equal(food.seasonStartTerm,20);assert.deepEqual(food.peakWindows,[['11-04','11-11']]);assert.match(food.season,/未提供具体采捕日期/);assert.equal(food.sources.length,2);assert.ok(food.procurement.checks.length>=2);assert.ok(food.steps.length>=3);assert.ok(food.storage&&food.safety);
 assert.equal(C.signature(food),profiles[food.id].signature);assert.equal(C.sensorySignature(food),profiles[food.id].senses.signature);
 const art=path.join(root,'dist',food.image);assert.ok(fs.statSync(art).size>1000);assert.match(food.imageCaption,/编辑插画/);assert.match(food.imageCaption,/不用于/);
 const before=Date.parse('2026-11-06T04:00:00Z'),during=Date.parse('2026-11-08T04:00:00Z'),after=Date.parse('2026-11-12T04:00:00Z');assert.equal(T.pool({foods,profiles,events,now:before}).some(x=>x.food.id===food.id),false);assert.equal(T.pool({foods,profiles,events,now:during}).some(x=>x.food.id===food.id),true);assert.equal(T.pool({foods,profiles,events,now:after}).some(x=>x.food.id===food.id),false);
});
