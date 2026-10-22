'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FoodPurchase:require('../dist/food-purchase.js'),FoodRecords:{render:()=>''}}};vm.createContext(ctx);
for(const file of ['solar-terms.js','data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js','winter-additions.js','seasonal-additions.js','lottery-profiles.js','lottery-senses.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx);
const f=ctx.window.FOODS.find(x=>x.id==='jiangning-bailu-white-dew-tea'),C=require('../dist/lottery-core.js');
test('Jiangning white-dew tea records the sourced autumn pick and stays exclusive to Bailu',()=>{
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[16]);assert.deepEqual(Array.from(f.entryTerms),[16]);assert.match(f.season,/白露前后采茶/);assert.match(f.description,/单芽无叶为龙针，一芽一叶为龙毫/);assert.ok(f.sources.some(x=>x[1]==='https://www.zjskw.gov.cn/art/2024/9/10/art_1229516293_60545.html'));assert.match(f.imageCaption,/非江宁实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
 const a=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),bailu=a.rows.find(x=>x.term==='白露');assert.ok(bailu.foodIds.includes(f.id));assert.ok(!a.rows.find(x=>x.term==='秋分').foodIds.includes(f.id));
});
