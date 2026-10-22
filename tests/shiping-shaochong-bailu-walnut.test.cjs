'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Shiping Shaochong fresh walnut is listed only for Bailu and has reviewed tarot signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),f=ctx.window.FOODS.find(x=>x.id==='shiping-shaochong-bailu-walnut');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[16]);assert.match(f.season,/白露/);assert.match(f.description,/本站未亲身试吃/);assert.match(f.procurement.checks.join(''),/青皮鲜核桃/);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.ok(f.sources.some(x=>x[1]==='https://www.hhsp.gov.cn/info/1051/399941.htm'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),bailu=audit.rows.find(x=>x.term==='白露'),qiufen=audit.rows.find(x=>x.term==='秋分');assert.ok(bailu.foodIds.includes(f.id));assert.ok(!qiufen.foodIds.includes(f.id));assert.ok(bailu.repeatRate<0.75);
});
