'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Shexian Qizili hickory is a recurring Bailu harvest entry with fresh-fruit and processed-nut states separated',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='shexian-qizili-hickory');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[16]);assert.match(f.season,/白露开杆/);assert.match(f.season,/约半个月/);assert.match(f.season,/脱蒲、干燥/);assert.match(f.description,/不是本站试吃/);assert.match(f.procurement.checks.join(''),/采收年份/);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 for(const url of ['https://www.huangshan.gov.cn/zxzx/qxdt/8415979.html','https://www.huangshan.gov.cn/zxzx/qxdt/8405323.html'])assert.ok(f.sources.some(s=>s[1]===url));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['白露'].includes(f.id));assert.ok(!pools['秋分'].includes(f.id));
});
