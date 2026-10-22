'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync('dist/'+name+'.js','utf8'),ctx);
test('Lingshan spring tea is limited to its sourced Great Cold first-pick entry',()=>{
 const food=ctx.window.FOODS.find(f=>f.id==='lingshan-dahan-spring-tea-first-pick'),profile=ctx.window.LOTTERY_PROFILES[food.id],C=require('../dist/lottery-core.js');
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[1]);assert.deepEqual(Array.from(food.entryTerms),[1]);
 assert.match(food.season,/大寒前后即可采摘/);assert.match(food.season,/采期延续至4月上旬/);assert.match(food.season,/不代表整个茶季只在大寒/);
 assert.ok(fs.existsSync('dist/'+food.image));assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{encoding:'utf8'}));
 const greatCold=audit.rows.find(row=>row.term==='大寒'),previous=audit.rows.find(row=>row.term==='小寒');
 assert.ok(greatCold.foodIds.includes(food.id));assert.ok(!previous.foodIds.includes(food.id));
});
