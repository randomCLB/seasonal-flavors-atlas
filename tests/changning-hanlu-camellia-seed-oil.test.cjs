'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js');
test('常宁寒露籽按多年度地方收摘证据列为寒露油料，不把生籽写成鲜食',()=>{
 const id='changning-hanlu-camellia-seed-oil',food=ctx.window.FOODS.find(x=>x.id===id),profile=ctx.window.LOTTERY_PROFILES[id];assert.ok(food);assert.equal(food.category,'oilseed');assert.deepEqual(Array.from(food.peakTerms),[18]);assert.deepEqual(Array.from(food.entryTerms),[18]);assert.equal(food.seasonStartTerm,18);assert.match(food.season,/2023、2024、2025年/);assert.match(food.safety,/不要食用生油茶果/);assert.match(food.recipeTitle,/清炒/);assert.ok(food.sources.some(s=>s[1].includes('20231009')));assert.ok(food.sources.some(s=>s[1].includes('20241008')));assert.ok(food.sources.some(s=>s[1].includes('645759')));assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),hanlu=audit.rows.find(x=>x.term==='寒露'),qiufen=audit.rows.find(x=>x.term==='秋分');assert.ok(hanlu.foodIds.includes(id));assert.ok(!qiufen.foodIds.includes(id));
});
