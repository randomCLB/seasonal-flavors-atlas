'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Taiwan Daxue eastern striped bonito keeps the sourced catch lead separate from its flavor season',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='taiwan-daxue-eastern-striped-bonito');assert.ok(f);assert.deepEqual(Array.from(f.entryTerms),[22]);assert.match(f.season,/不称大雪为最佳赏味期/);assert.match(f.description,/Sarda orientalis/);assert.match(f.taste,/不能据此断定大雪批次/);assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.ok(f.sources.some(s=>s[1]==='https://www.moa.gov.tw/ws.php?id=2507793'));assert.ok(f.sources.some(s=>s[1]==='https://kmweb.moa.gov.tw/theme_data.php?id=642&theme=fisheasy'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),daxue=audit.rows.find(row=>row.term==='大雪');assert.ok(daxue.foodIds.includes(f.id));assert.ok(!audit.rows.find(row=>row.term==='小雪').foodIds.includes(f.id));assert.equal(daxue.repeatRateDenominator,'current-term-total');assert.equal(daxue.withinLimit,true);
});
