'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Taiwan MOA Frost Descent white-belly seerfish lead is distinct from Hanlu and exactly meets the repeat cap',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),f=ctx.window.FOODS.find(x=>x.id==='taiwan-frost-white-belly-seerfish');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[19]);assert.equal(f.seasonBasis,'fishery');assert.match(f.season,/不推定固定供应或最佳赏味期/);assert.match(f.procurement.checks.join(''),/规范名称/);assert.match(f.imageCaption,/不用于鱼种、产地或渔获鉴别/);assert.ok(f.sources.some(x=>x[1]==='https://www.moa.gov.tw/ws.php?id=2507790'));assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),frost=audit.rows.find(x=>x.term==='霜降'),hanlu=audit.rows.find(x=>x.term==='寒露');assert.ok(frost.foodIds.includes(f.id));assert.ok(!hanlu.foodIds.includes(f.id));assert.equal(frost.repeatRate,.5);assert.equal(frost.withinLimit,true);
});
