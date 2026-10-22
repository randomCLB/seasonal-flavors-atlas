'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Wenxian Tiegum yam is a sourced Shuangjiang harvest node with labeled art and reviewed signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),f=ctx.window.FOODS.find(x=>x.id==='wenxian-shuangjiang-tiegun-yam');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[19]);assert.match(f.season,/霜降/);assert.match(f.description,/本站未亲身试吃/);assert.match(f.procurement.checks.join(''),/鲜根茎/);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.ok(f.sources.some(x=>x[1]==='https://hn.cri.cn/2024-10-24/bd0f11da-b367-bd3d-8486-42011575bf07.html'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),frost=audit.rows.find(x=>x.term==='霜降'),start=audit.rows.find(x=>x.term==='寒露');assert.ok(frost.foodIds.includes(f.id));assert.ok(!start.foodIds.includes(f.id));
});
