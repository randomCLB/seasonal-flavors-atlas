'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{FoodPurchase:require('../dist/food-purchase.js'),FoodRecords:{render:()=>''}}};vm.createContext(ctx);
for(const file of ['solar-terms.js','data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js','winter-additions.js','seasonal-additions.js','lottery-profiles.js','lottery-senses.js'])vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'..','dist',file),'utf8'),ctx);
const f=ctx.window.FOODS.find(x=>x.id==='anping-dongzhi-mackerel'),C=require('../dist/lottery-core.js');
test('Anping winter-solstice mackerel stays a sourced, term-only fishery lead with honest identity limits',()=>{
 assert.ok(f);assert.deepEqual(Array.from(f.entryTerms),[23]);assert.deepEqual(Array.from(f.peakTerms),[23]);assert.match(f.season,/未给出具体捕捞日、鱼种细分/);assert.match(f.taste,/没有描述风味/);assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));assert.ok(fs.existsSync(require('node:path').join(__dirname,'..','dist',f.image)));assert.ok(f.sources.some(x=>x[1]==='https://fae.moa.gov.tw/theme_data.php?id=32&sub_theme=knowledge&theme=topics'));
 const a=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:require('node:path').join(__dirname,'..'),encoding:'utf8'}));assert.ok(a.rows.find(r=>r.term==='冬至').foodIds.includes(f.id));assert.ok(!a.rows.find(r=>r.term==='大雪').foodIds.includes(f.id));
});
