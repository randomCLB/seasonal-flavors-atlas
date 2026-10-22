'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),ids=['taiwan-qiufen-tamsui-maga','taiwan-qiufen-lukang-white-belly-seerfish','taiwan-qiufen-northeast-sailfish','taiwan-qiufen-northeast-black-marlin','taiwan-qiufen-northeast-red-emperor','taiwan-qiufen-northeast-shrimp'];
test('Taiwan MOA Qiufen catch leads are explicit one-term listings without invented taste or stock claims',()=>{
 const foods=ids.map(id=>ctx.window.FOODS.find(food=>food.id===id));assert.ok(foods.every(Boolean));
 for(const food of foods){
  assert.deepEqual(Array.from(food.peakTerms),[17]);assert.deepEqual(Array.from(food.entryTerms),[17]);assert.equal(food.seasonPrecision,'solar-term-record');
  assert.equal(food.taste,'现有节气来源没有描述这批渔获的滋味；不把通用品类的常见风味当成本地批次试吃结论。');
  assert.ok(food.sources.some(source=>source[1]==='https://www.moa.gov.tw/ws.php?id=2507788'));assert.ok(food.procurement.checks.length>=2);assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
  const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 }
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),qiufen=audit.rows.find(row=>row.term==='秋分');
 ;assert.equal(qiufen.repeatRate,0.5);assert.ok(qiufen.withinLimit);assert.ok(ids.every(id=>qiufen.foodIds.includes(id)));assert.ok(ids.every(id=>!audit.rows.find(row=>row.term==='白露').foodIds.includes(id)));
});
