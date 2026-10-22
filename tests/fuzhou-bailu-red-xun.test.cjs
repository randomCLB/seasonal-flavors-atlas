'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={window:{FoodPurchase:require('../dist/food-purchase.js'),FoodRecords:{render:()=>''}}};vm.createContext(ctx);
for(const file of ['solar-terms.js','data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js','winter-additions.js','seasonal-additions.js','lottery-profiles.js','lottery-senses.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..','dist',file),'utf8'),ctx);
const f=ctx.window.FOODS.find(x=>x.id==='fuzhou-bailu-red-xun'),C=require('../dist/lottery-core.js');
test('Fuzhou Bailu red-xun remains a sourced local-name seafood entry without invented species identity',()=>{
 assert.ok(f);assert.deepEqual(Array.from(f.entryTerms),[16]);assert.match(f.season,/不推断具体物种/);assert.match(f.procurement.checks.join(' '),/标准商品名/);assert.match(f.recipeTitle,/糯米饭/);assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));assert.ok(fs.existsSync(path.join(__dirname,'..','dist',f.image)));assert.ok(f.sources.some(x=>x[1]==='https://www.fuzhou.gov.cn/zgfzzt/zjrc/mdfc/msfq/202512/t20251205_5241002.htm'));
 const a=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:path.join(__dirname,'..'),encoding:'utf8'}));assert.ok(a.rows.find(r=>r.term==='白露').foodIds.includes(f.id));assert.ok(!a.rows.find(r=>r.term==='处暑').foodIds.includes(f.id));
});
