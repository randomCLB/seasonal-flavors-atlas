'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={window:{FoodPurchase:require('../dist/food-purchase.js'),FoodRecords:{render:()=>''}}};vm.createContext(ctx);
for(const file of ['solar-terms.js','data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js','winter-additions.js','seasonal-additions.js','lottery-profiles.js','lottery-senses.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..','dist',file),'utf8'),ctx);
const f=ctx.window.FOODS.find(x=>x.id==='tianshui-qinzhou-xiaoman-cherry'),C=require('../dist/lottery-core.js');
test('Qinzhou cherry is limited to the sourced Xiaoman observation and does not claim a named cultivar',()=>{
 assert.ok(f);assert.deepEqual(Array.from(f.entryTerms),[9]);assert.match(f.season,/2025年报道/);assert.match(f.season,/不承诺2026年具体成熟日/);assert.match(f.description,/未说明这批果实的具体品种/);assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));assert.ok(fs.existsSync(path.join(__dirname,'..','dist',f.image)));assert.ok(f.sources.some(x=>x[1]==='https://www.tianshui.gov.cn/xmj/info/1483/107862.htm'));
 const a=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:path.join(__dirname,'..'),encoding:'utf8'}));assert.ok(a.rows.find(r=>r.term==='小满').foodIds.includes(f.id));assert.ok(!a.rows.find(r=>r.term==='立夏').foodIds.includes(f.id));
});
