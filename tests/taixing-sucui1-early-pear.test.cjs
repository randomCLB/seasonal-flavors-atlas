'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Taixing Su Cui No. 1 pear is a sourced Xiaoshu entry and a distinct summer-term addition',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='taixing-sucui1-early-pear',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'fruit');assert.deepEqual(Array.from(food.peakTerms),[12]);assert.deepEqual(Array.from(food.entryTerms),[12]);
 assert.match(food.season,/2025年、2026年均于7月上旬上市/);assert.match(food.description,/鲜食早熟梨/);assert.ok(food.sources.some(x=>x[1]==='https://zys.moa.gov.cn/gzdt/202507/P020250721568526002533.pdf'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/Dusan Bicanski/);assert.match(food.imageCaption,/不代表泰兴产地或苏翠1号品种/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const term=audit.rows.find(x=>x.term==='小暑'),previous=audit.rows.find(x=>x.term==='夏至');
 assert.ok(term.foodIds.includes(id));assert.ok(!previous.foodIds.includes(id));assert.equal(term.repeatRate,0.5);assert.equal(term.withinLimit,true);
});
