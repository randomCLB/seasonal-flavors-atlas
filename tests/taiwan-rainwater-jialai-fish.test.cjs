'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Taiwan MOA Rainwater jialai fishery lead fills the one-item gap without appearing in Lichun',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),id='taiwan-rainwater-jialai-fish',f=ctx.window.FOODS.find(x=>x.id===id);assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[3]);assert.equal(f.seasonBasis,'fishery');assert.match(f.season,/不推定固定供应或最佳赏味期/);assert.match(f.description,/地方名称/);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/不用于鱼种、产地或渔获鉴别/);assert.ok(f.sources.some(x=>x[1]==='https://fae.moa.gov.tw/theme_data.php?id=38&sub_theme=knowledge&theme=topics'));assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),rain=audit.rows.find(x=>x.term==='雨水'),lichun=audit.rows.find(x=>x.term==='立春');assert.ok(rain.foodIds.includes(id));assert.ok(!lichun.foodIds.includes(id));assert.equal(rain.withinLimit,true);assert.equal(audit.overLimit,audit.rows.filter(row=>!row.withinLimit).length);
});
