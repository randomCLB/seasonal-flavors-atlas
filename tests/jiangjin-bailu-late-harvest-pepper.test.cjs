'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Jiangjin White Dew pepper is a narrowly labeled 2025 pilot and enters the White Dew list with current tarot signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='jiangjin-bailu-late-harvest-pepper',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[16]);assert.deepEqual(Array.from(food.entryTerms),[16]);assert.deepEqual(Array.from(food.sourceYears),[2025]);assert.equal(food.seasonPrecision,'single-year-harvest-record');
 assert.match(food.season,/2025年.*试验/);assert.match(food.season,/不代表每年/);assert.match(food.taste,/高4倍以上/);assert.match(food.pitfall,/不是所有江津花椒/);assert.ok(food.sources.some(x=>x[1]==='https://nyncw.cq.gov.cn/zwxx_161/qxlb/202509/t20250930_15056093.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);assert.match(food.imageCaption,/异地产区.*不用于江津产地/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const currentAudit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));const currentRow=currentAudit.rows.find(x=>x.term==='白露');assert.ok(!currentRow.foodIds.includes(id));const historicalAudit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2024'],{cwd:root,encoding:'utf8'}));const historicalRow=historicalAudit.rows.find(x=>x.term==='白露');assert.ok(historicalRow.foodIds.includes(id));
 assert.ok(fs.readFileSync(path.join(root,'IMAGE_REGISTER.md'),'utf8').includes(food.image));assert.match(fs.readFileSync(path.join(root,'dist','credits.html'),'utf8'),/jiangjin-bailu-late-harvest-pepper/);
});
