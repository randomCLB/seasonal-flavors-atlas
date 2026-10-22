'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Yunxiao white-stem water spinach is a sourced Lichun-after listing with its unknown season end kept explicit',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='yunxiao-liuye-baigeng-wongcai');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[2]);assert.match(f.season,/立春过后/);assert.match(f.season,/未给出完整上市结束日期/);assert.match(f.description,/农家品种提纯复壮/);assert.match(f.imageCaption,/非实物摄影/);assert.ok(f.procurement.checks.length>=2);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.ok(f.sources.some(s=>s[1]==='https://nynct.fujian.gov.cn/ztzl/fsfsfnyp/202404/t20240429_6441659.htm'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['立春'].includes(f.id));assert.ok(!pools['大寒'].includes(f.id));
});
