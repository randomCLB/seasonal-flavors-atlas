'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Chongming malantou is listed only for its sourced best-taste solar term',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='chongming-malan-head');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[6]);assert.deepEqual(Array.from(f.entryTerms),[6]);assert.match(f.season,/清明前后口感最佳/);assert.match(f.season,/不代表当年现货/);assert.match(f.description,/崇明俗称/);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.ok(f.sources.some(s=>s[1]==='https://www.shcm.gov.cn/bmpd/019006/019006003/20240407/35448bae-e157-47f4-97e9-54ed8e5a0630.html'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['清明'].includes(f.id));assert.ok(!pools['春分'].includes(f.id));assert.ok(!pools['谷雨'].includes(f.id));
});
