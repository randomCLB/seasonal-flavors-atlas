'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Taiwan MOA Lidong east-coast fishery leads are distinct from Hanlu and have current tarot signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),ids=['taiwan-lidong-east-sailfish','taiwan-lidong-east-red-eye-bream','taiwan-lidong-east-jiana-fish'];
 for(const id of ids){const f=ctx.window.FOODS.find(x=>x.id===id);assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[20]);assert.equal(f.seasonBasis,'fishery');assert.match(f.season,/不推定固定供应或最佳赏味期/);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/不用于鱼种、产地或渔获鉴别/);assert.ok(f.sources.some(x=>x[1]==='https://www.moa.gov.tw/ws.php?id=2507791'));assert.ok(fs.existsSync(path.join(root,'dist',f.image)));}
 assert.ok(ctx.window.FOODS.find(x=>x.id==='taiwan-lidong-east-jiana-fish').sources.some(x=>x[1].includes('tcma.gov.taipei')));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);for(const id of ids){const f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));}
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),winter=audit.rows.find(x=>x.term==='立冬'),hanlu=audit.rows.find(x=>x.term==='寒露');for(const id of ids){assert.ok(winter.foodIds.includes(id));assert.ok(!hanlu.foodIds.includes(id));};
});
